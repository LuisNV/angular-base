import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { NotifyService } from '../services/notify.service';

const ERROR_MESSAGES: Record<number, string> = {
  0: 'Không kết nối được tới máy chủ.',
  400: 'Dữ liệu gửi lên không hợp lệ.',
  403: 'Bạn không có quyền thực hiện thao tác này.',
  404: 'Không tìm thấy dữ liệu yêu cầu.',
  500: 'Lỗi hệ thống. Vui lòng thử lại sau.',
};

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notify = inject(NotifyService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const message =
        error.error?.message ?? ERROR_MESSAGES[error.status] ?? 'Đã xảy ra lỗi không xác định.';
      const isEmailUpdateError = req.method === 'PUT'
        && /(?:^|\/)users\/me(?:[?#]|$)/.test(req.url)
        && ((error.status === 409 && [1001, 1003].includes(error.error?.code))
          || (error.status === 400 && error.error?.code === 1002));
      if (!isEmailUpdateError) notify.error('Có lỗi xảy ra', message);
      return throwError(() => error);
    }),
  );
};
