# Hướng Dẫn Khởi Động Dự Án NCKH (Đầy đủ)

## Tổng Quan Kiến Trúc

```
Frontend (Vite + React)
    ↓ (Port 5173)
API Gateway (Express.js)
    ↓ (Port 3000)
    ├→ Auth Service (Spring Boot, Port 8080)
    └→ Product Service (Spring Boot, Port 8081)
        ↓
    [PostgreSQL + Redis]
    [MySQL (Product DB)]
```

## Các Dịch Vụ

### 1. **Frontend** (Vite + React)
- **Port:** 5173
- **URL:** http://localhost:5173
- **Thư mục:** `frontend/web-client`
- **Công nghệ:** React 19, Vite, Ant Design, Axios, React Router

### 2. **API Gateway** (Express.js)
- **Port:** 3000
- **URL:** http://localhost:3000
- **Thư mục:** `api-gateway`
- **Chức năng:** 
  - CORS proxy cho tất cả requests từ Frontend
  - JWT token verification
  - Route forwarding tới Auth Service và Product Service

### 3. **Auth Service** (Spring Boot)
- **Port:** 8080
- **URL:** http://localhost:8080
- **Thư mục:** `backend/audit-service/Nckh-Lu-n`
- **Công nghệ:** Spring Boot 3.5.9, Java 17, PostgreSQL
- **Endpoints:**
  - `POST /api/auth/login` - Đăng nhập
  - `POST /api/auth/register` - Đăng ký
  - `POST /api/auth/validate` - Xác thực token
  - `POST /api/auth/logout` - Đăng xuất

### 4. **Product Service** (Spring Boot)
- **Port:** 8081
- **URL:** http://localhost:8081
- **Thư mục:** `backend/product-service/Tien/Tien`
- **Công nghệ:** Spring Boot 3.3.4, Java 21, MySQL
- **Endpoints:**
  - `GET /api/products` - Lấy tất cả sản phẩm
  - `GET /api/products/category/{type}` - Lọc theo loại
  - `GET /api/products/search?keyword=...` - Tìm kiếm
  - `POST /api/products` - Thêm sản phẩm (Admin)
  - `PUT /api/products/{id}` - Cập nhật sản phẩm (Admin)
  - `DELETE /api/products/{id}` - Xóa sản phẩm (Admin)
  - `POST /api/products/purchase/{id}?quantity=...` - Mua hàng

### 5. **Database**
- **PostgreSQL** (Port 5432) - Auth DB
- **Redis** (Port 6379) - Cache
- **MySQL** - Product DB

## Khởi Động Nhanh

### Tùy chọn 1: Script tự động (Windows)
```batch
# Chạy file start-all-clean.bat trong thư mục gốc
start-all-clean.bat
```

Script sẽ:
1. ✅ Kiểm tra Node.js, Docker, Java
2. ✅ Khởi động Auth Service (Port 8080)
3. ✅ Khởi động Product Service (Port 8081)
4. ✅ Khởi động API Gateway (Port 3000)
5. ✅ Khởi động Frontend (Port 5173)

### Tùy chọn 2: Khởi động thủ công

#### Terminal 1 - Auth Service:
```bash
cd backend/audit-service/Nckh-Lu-n
mvnw.cmd spring-boot:run
# hoặc
./mvnw spring-boot:run  # Linux/Mac
```

#### Terminal 2 - Product Service:
```bash
cd backend/product-service/Tien/Tien
mvnw.cmd spring-boot:run
# hoặc
./mvnw spring-boot:run  # Linux/Mac
```

#### Terminal 3 - API Gateway:
```bash
cd api-gateway
npm install  # nếu chưa cài
npm start
```

#### Terminal 4 - Frontend:
```bash
cd frontend/web-client
npm install  # nếu chưa cài
npm run dev
```

## Tài Khoản Test

```
Username: sysadmin
Password: 1234

Username: 23810310082
Password: 123456

Username: nam123
Password: 123456

Username: lan456
Password: 123456
```

## Các Tính Năng

### 🔐 Xác Thực & Phân Quyền
- ✅ Đăng nhập/Đăng ký
- ✅ JWT token management
- ✅ Lưu trữ user trong localStorage
- ✅ Automatic redirect cho admin role

### 📦 Quản Lý Sản Phẩm
- ✅ Hiển thị danh sách sản phẩm từ API
- ✅ Tìm kiếm theo keyword
- ✅ Lọc theo loại/category
- ✅ Admin dashboard để CRUD sản phẩm
- ✅ Tự động cập nhật UI khi có thay đổi

### 🛒 Giỏ Hàng & Đặt Hàng
- ✅ Thêm sản phẩm vào giỏ
- ✅ Xem chi tiết giỏ hàng
- ✅ Đặt hàng

### 👤 Quản Lý Tài Khoản
- ✅ Xem/Chỉnh sửa profile
- ✅ Quản lý địa chỉ
- ✅ Lịch sử đơn hàng

### 📊 Admin Features
- ✅ Dashboard quản lý sản phẩm (Port: /admin)
- ✅ Quản lý đơn hàng
- ✅ Quản lý người dùng
- ✅ Dashboard doanh số

## URLs Chính

| Trang | URL | Yêu Cầu Auth |
|-------|-----|-------------|
| Trang Chủ | http://localhost:5173 | ❌ Không |
| Đăng Nhập | http://localhost:5173/login | ❌ Không |
| Đăng Ký | http://localhost:5173/register | ❌ Không |
| Sản Phẩm | http://localhost:5173/products | ❌ Không |
| Giỏ Hàng | http://localhost:5173/cart | ✅ Có |
| Profile | http://localhost:5173/profile | ✅ Có |
| Admin Dashboard | http://localhost:5173/admin | ✅ Có (Admin) |
| Admin Orders | http://localhost:5173/admin/orders | ✅ Có (Admin) |
| Admin Users | http://localhost:5173/admin/users | ✅ Có (Admin) |
| Admin Revenue | http://localhost:5173/admin/revenue | ✅ Có (Admin) |

## API Gateway Proxy Configuration

API Gateway tự động proxy các routes:
- `/api/auth/*` → Auth Service (8080)
- `/api/products/*` → Product Service (8081)
- Tất cả các routes khác → Generic proxy

## Cấu Hình Biến Môi Trường

### API Gateway (.env)
```
PORT=3000
AUTH_SERVICE_URL=http://localhost:8080
PRODUCT_SERVICE_URL=http://localhost:8081
JWT_SECRET=caef38e2f3667de7631b24840629c0aa60ef53f76a7c3e66d5edd0218a2df52c
```

### Product Service (application.properties)
```
server.port=8081
spring.datasource.url=jdbc:mysql://localhost:3306/product_db
spring.datasource.username=root
spring.datasource.password=password
```

### Auth Service (application.properties)
```
server.port=8080
spring.datasource.url=jdbc:postgresql://localhost:5432/auth_db
spring.datasource.username=postgres
spring.datasource.password=postgres
```

## Troubleshooting

### Frontend không kết nối được API
- Kiểm tra API Gateway có chạy trên port 3000 không
- Kiểm tra axiosClient baseURL: `http://localhost:3000/api`
- Xóa localStorage và reload trang

### Auth Service không khởi động
- Kiểm tra port 8080 không bị chiếm dụng: `netstat -ano | findstr :8080`
- Kiểm tra Java version: `java -version` (cần Java 17+)
- Kiểm tra PostgreSQL có chạy không

### Product Service không khởi động
- Kiểm tra port 8081 không bị chiếm dụng: `netstat -ano | findstr :8081`
- Kiểm tra Java version: `java -version` (cần Java 21+)
- Kiểm tra MySQL có chạy không

### API Gateway 502 Bad Gateway
- Kiểm tra Auth Service có chạy trên port 8080 không
- Kiểm tra Product Service có chạy trên port 8081 không
- Xem logs của API Gateway

### Port bị chiếm dụng

#### Windows:
```batch
REM Tìm process chiếm dụng port
netstat -ano | findstr :5173

REM Kill process (thay thế PID)
taskkill /PID <PID> /F
```

#### Linux/Mac:
```bash
# Tìm process
lsof -i :5173

# Kill process
kill -9 <PID>
```

## Cải Tiến Được Thực Hiện

### Frontend
- ✅ Tạo `product.api.js` - Centralized product API client
- ✅ Tạo `ProductList.jsx` - Trang liệt kê sản phẩm với tìm kiếm và lọc
- ✅ Tạo `AdminDashboard.jsx` - Dashboard quản lý sản phẩm
- ✅ Cập nhật `Home.jsx` - Hiển thị sản phẩm từ API thay vì hardcoded
- ✅ Cập nhật `Login.jsx` - Admin role-based redirect
- ✅ Cập nhật router - Thêm routes /products, /admin

### API Gateway
- ✅ Thêm generic proxy cho /api/* requests
- ✅ Support tất cả HTTP methods (GET, POST, PUT, DELETE)
- ✅ Proper error handling

### Backend
- ✅ Cấu hình port 8081 cho Product Service
- ✅ CORS enabled ("*") cho Product Service

### Script
- ✅ Cập nhật `start-all-clean.bat` - Khởi động cả Product Service

## Lưu Ý

1. **Token Expiration:** Tokens được lưu trong localStorage, không có auto-refresh. Nếu token hết hạn, user phải đăng nhập lại.

2. **Admin Role:** Có hai loại admin account. Hãy kiểm tra role field của user sau khi login để tìm admin account.

3. **CORS:** Frontend cần chạy trên port 5173 hoặc 127.0.0.1:5173 để API Gateway cho phép request.

4. **Database Seeding:** Auth Service dùng UserInitializer để tạo test data, Product Service tạo mock data trong InitDataRunner.

5. **Pagination:** Một số endpoints có hỗ trợ pagination, xem Backend code để chi tiết.

## Liên Lạc & Support

Nếu gặp vấn đề, hãy kiểm tra:
1. Tất cả services đã khởi động chưa?
2. Ports có bị chiếm dụng không?
3. Database có chạy không?
4. Browser console có lỗi gì không?
5. API Gateway logs có lỗi gì không?
