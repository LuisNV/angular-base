import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export const apiUrlInterceptor: HttpInterceptorFn = (req, next) => {
  if (/^https?:\/\//.test(req.url)) {
    return next(req);
  }
  const url = `${environment.apiUrl.replace(/\/$/, '')}/${req.url.replace(/^\//, '')}`;
  return next(req.clone({ url }));
};
