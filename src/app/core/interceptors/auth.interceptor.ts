import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, of, switchMap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../services/auth.service';
import { TokenRefreshService } from '../services/token-refresh.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.getAccessToken();
  const apiUrl = environment.apiUrl.replace(/\/$/, '');
  const isRelativeUrl = !/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(req.url);
  const isApiUrl = req.url === apiUrl || req.url.startsWith(`${apiUrl}/`) ||
    req.url.startsWith(`${apiUrl}?`);
  const isSessionEndpoint = /(?:^|\/)auth\/(?:login|refresh)(?:[/?#]|$)/.test(req.url);

  if ((!isRelativeUrl && !isApiUrl) || req.headers.has('Authorization') || isSessionEndpoint) {
    return next(req);
  }

  const refresh = inject(TokenRefreshService);
  const router = inject(Router);
  const expireSession = () => {
    auth.clearSession();
    void router.navigateByUrl('/login', { replaceUrl: true });
  };
  const authorized = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authorized).pipe(
    catchError((error: unknown) => {
      if (!(error instanceof HttpErrorResponse) || error.status !== 401) {
        return throwError(() => error);
      }
      const currentToken = auth.getAccessToken();
      // Another request may already have refreshed while this request was in flight.
      const replacement = currentToken && currentToken !== token
        ? of(currentToken)
        : refresh.refresh().pipe(
            catchError((refreshError: unknown) => {
              if (auth.getAccessToken() === currentToken) expireSession();
              return throwError(() => refreshError);
            }),
          );
      return replacement.pipe(
        switchMap((newToken) => next(req.clone({
          setHeaders: { Authorization: `Bearer ${newToken}` },
        })).pipe(
          catchError((retryError: unknown) => {
            if (retryError instanceof HttpErrorResponse && retryError.status === 401 &&
                auth.getAccessToken() === newToken) {
              expireSession();
            }
            return throwError(() => retryError);
          }),
        )),
      );
    }),
  );
};
