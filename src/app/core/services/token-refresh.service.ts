import { HttpBackend, HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { defer, finalize, map, Observable, shareReplay } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthSession } from '../../features/auth/domain/models/auth.models';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class TokenRefreshService {
  // Bypass interceptors so a rejected refresh cannot start another refresh.
  private readonly http = new HttpClient(inject(HttpBackend));
  private readonly auth = inject(AuthService);
  private pending?: Observable<string>;

  refresh(): Observable<string> {
    if (!this.pending) {
      const accessToken = this.auth.getAccessToken();
      const refreshToken = this.auth.getRefreshToken();
      this.pending = defer(() => {
        if (!refreshToken) throw new Error('Phiên đăng nhập đã hết hạn.');
        return this.http.post<AuthSession>(
          `${environment.apiUrl.replace(/\/$/, '')}/auth/refresh`,
          { refreshToken },
        );
      }).pipe(
        map((session) => {
          if (this.auth.getAccessToken() !== accessToken ||
            this.auth.getRefreshToken() !== refreshToken) {
            throw new Error('Phiên đăng nhập đã thay đổi.');
          }
          if (!session?.accessToken?.trim() || !session.refreshToken?.trim()) {
            throw new Error('Phản hồi làm mới phiên không hợp lệ.');
          }
          this.auth.setSession(session);
          return session.accessToken;
        }),
        finalize(() => { this.pending = undefined; }),
        shareReplay({ bufferSize: 1, refCount: false }),
      );
    }
    return this.pending;
  }
}
