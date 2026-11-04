# Angular Base

Angular 21 standalone + VietinOne UI / PrimeNG, SCSS, OnPush.

## Chạy dự án

Yêu cầu Node.js ^20.19 hoặc ^22.12 hoặc >=24 và npm >=10.
Scope @vietinbank lấy từ Nexus nội bộ theo .npmrc; cần truy cập mạng nội bộ.

```bash
npm ci
npm start
npm run build:prod
```

Development: http://localhost:4200. Build: dist/angular-base/browser.

## Cấu trúc

- src/app/core/layout: Shell responsive, header, sidebar, navigation.
- src/app/core/interceptors: ghép API URL và hiển thị lỗi HTTP.
- src/app/core/services: NotifyService dùng toast toàn ứng dụng.
- src/app/shared: models, services, utils dùng chung.
- src/app/pages: trang Home mẫu và trang 404, lazy-load qua router.
- src/app/app.config.ts: đăng ký router, HttpClient và VietinOne UI.
- src/environments: API URL development và production.
- public: tài nguyên tĩnh kế thừa từ project gốc; thay logo/avatar theo ứng dụng.

## Thêm trang

1. Tạo component standalone trong src/app/pages/<ten-trang>.
2. Thêm route lazy-load vào children của Shell trong app.routes.ts, trước **.
3. Thêm menu trong core/layout/navigation.ts; id trùng path route.

State dùng signal/computed; form có thể dùng ReactiveFormsModule.
Chưa tích hợp đăng nhập, phân quyền hoặc API nghiệp vụ.
Header tìm kiếm, thông báo, ứng dụng và avatar hiện là giao diện mẫu.

## API và toast

Inject HttpClient trong service, gọi URL tương đối như http.get('users').
Interceptor ghép environment.apiUrl: development http://localhost:8080/api,
production /api. URL http/https tuyệt đối được giữ nguyên.
Lỗi HTTP được hiển thị qua NotifyService và tiếp tục trả lỗi cho bên gọi.
Inject NotifyService, gọi success/info/warn/error(summary, detail).
Trang Home có nút thử toast.

## Docker

```bash
docker build -t angular-base .
docker run --rm -p 9999:8080 angular-base
```

Truy cập http://localhost:9999/. Image nền dùng registry nội bộ VietinBank.
Nginx phục vụ SPA tại /; /api cần được định tuyến tới backend ở tầng gateway
hoặc bổ sung location proxy trong nginx.conf trước khi tích hợp backend.
Nếu triển khai dưới sub-path, đồng bộ base-href khi build và cấu hình Nginx.

## Kiểm tra

npm run build:prod kiểm tra biên dịch và template. npm test đã có builder Vitest,
chưa có test nghiệp vụ. npm run format định dạng mã nguồn.
