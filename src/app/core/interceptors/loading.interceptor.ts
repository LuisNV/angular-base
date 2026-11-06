import { inject } from '@angular/core';
import { HttpContextToken, HttpInterceptorFn } from '@angular/common/http';
import { defer, finalize } from 'rxjs';
import { LoadingService } from '../services/loading.service';

/** Set to true for polling or background requests that should not block the UI. */
export const SKIP_GLOBAL_LOADING = new HttpContextToken<boolean>(() => false);

export const loadingInterceptor: HttpInterceptorFn = (request, next) => {
  const loading = inject(LoadingService);
  if (request.context.get(SKIP_GLOBAL_LOADING)) return next(request);

  return defer(() => {
    const finish = loading.show();
    return defer(() => next(request)).pipe(finalize(finish));
  });
};
