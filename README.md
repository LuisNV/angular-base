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

## Cấu trúc Clean Architecture

Tổ chức theo feature, với ba lớp cho tính năng có nghiệp vụ:

```text
src/app/
├── core/                         # Hạ tầng chung: API client, interceptor, layout, toast
├── shared/                       # Thành phần dùng chung, trang 404
├── features/
│   ├── auth/
│   │   ├── domain/               # Model, hợp đồng repository, use case (TypeScript thuần)
│   │   ├── data/                 # DTO, HTTP data source, repository implementation
│   │   ├── presentation/pages/   # Component, template, trạng thái giao diện
│   │   └── auth.providers.ts     # Nối dependency bằng Angular DI
│   └── home/presentation/pages/  # Trang mẫu, chưa cần domain/data
└── app.routes.ts
```

Domain không import Angular, HTTP hay data/presentation. Data triển khai hợp đồng
của domain và chuyển DTO thành model. Presentation gọi use case, không gọi HTTP
trực tiếp. auth.providers.ts là nơi lắp ghép các lớp, được đăng ký tại route login.
Domain dùng Promise; Observable của HttpClient được chuyển ở data source.

Luồng đăng nhập:

```text
Login → LoginUseCase → AuthRepository (hợp đồng)
                           ↑
                    HttpAuthRepository → AuthApi → ApiClient → Backend
```

/login có form mẫu gọi POST /auth/login, giả định phản hồi { accessToken: string }.
Chưa xác minh hợp đồng backend, lưu phiên, gắn token, guard hay phân quyền.
Kết quả hiện chỉ được báo trên form; chưa điều hướng hoặc lưu token.
Không còn AuthService cũ trong core; logic đăng nhập đã chuyển vào feature auth.

## Thêm tính năng

1. Tạo component standalone trong features/<feature>/presentation/pages/<ten-trang>.
2. Nếu có nghiệp vụ, định nghĩa model, repository và use case trong domain.
3. Triển khai gọi API, DTO và repository trong data.
4. Tạo <feature>.providers.ts để nối repository và use case bằng DI.
5. Thêm route lazy-load và providers; trang dùng Shell đặt trong children, trước **.
6. Thêm menu trong core/layout/navigation.ts nếu cần; id trùng path route.

Không cần tạo domain/data rỗng cho trang chỉ hiển thị nội dung.
State dùng signal/computed; form phức tạp có thể dùng ReactiveFormsModule.
Header tìm kiếm, thông báo, ứng dụng và avatar hiện là giao diện mẫu.

## API và toast

Data source inject ApiClient, gọi URL tương đối như api.get('users').
Interceptor ghép environment.apiUrl theo môi trường. URL http/https tuyệt đối được giữ nguyên.
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
có test LoginUseCase (validation, chuẩn hóa tài khoản, truyền lỗi). npm run format định dạng mã nguồn.

## Môi trường API

| Môi trường | File cấu hình | API URL | Chạy local | Build |
|---|---|---|---|---|
| Dev | src/environments/environment.development.ts | http://127.0.0.1:8081 | npm run start:dev | npm run build:dev |
| UAT | src/environments/environment.uat.ts | /api | npm run start:uat | npm run build:uat |
| Production | src/environments/environment.ts | /api | npm run start:prod | npm run build:prod |

npm start mặc định dùng dev; npm run build mặc định dùng production.
Angular thay file environment khi chạy/build; code luôn import environment.ts.
UAT và production hiện dùng /api trên cùng origin, cần gateway/reverse proxy
chuyển tiếp tới backend. Thay apiUrl trong file tương ứng nếu có domain API riêng.
Không đặt mật khẩu hoặc secret trong environment vì chúng được đóng gói vào frontend.

Với dev, gọi /auth/login sẽ gửi tới http://127.0.0.1:8081/auth/login.
Nếu backend có prefix /api, đổi apiUrl thành http://127.0.0.1:8081/api.
Backend local cần cho phép CORS từ origin frontend (mặc định http://localhost:4200).
Sau khi sửa environment, khởi động lại ng serve nếu cấu hình chưa được cập nhật.
