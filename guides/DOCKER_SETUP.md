# 🐳 Chạy Product Service với Docker

## Bước 1: Khởi động MySQL Container

```bash
# Di chuyển đến thư mục Product Service
cd backend/product-service/Tien/Tien

# Khởi động Docker containers
docker-compose up -d

# Kiểm tra trạng thái
docker-compose ps
```

**Output kỳ vọng:**
```
NAME                COMMAND                  SERVICE             STATUS              PORTS
product-mysql       "docker-entrypoint.s…"   product-mysql       Up (healthy)        0.0.0.0:3306->3306/tcp
```

## Bước 2: Chạy Product Service

```bash
# Từ thư mục Product Service
.\mvnw.cmd clean spring-boot:run

# Hoặc từ scripts folder
.\scripts\start-all-clean.bat
```

Service sẽ:
- ✅ Tự động kết nối đến MySQL container (`product-mysql:3306`)
- ✅ Tạo database `shopquanao` (nếu chưa có)
- ✅ Tạo/cập nhật tables (Hibernate ddl-auto=update)
- ✅ Chạy trên port `8081`

## Bước 3: Kiểm Tra

```bash
# Test endpoint
curl http://localhost:8081/api/products

# Xem logs
docker-compose logs -f product-mysql
```

## Dừng Docker

```bash
# Dừng containers
docker-compose down

# Dừng và xóa volumes (xóa dữ liệu)
docker-compose down -v
```

## Troubleshooting

| Vấn đề | Giải Pháp |
|--------|----------|
| **Port 3306 đã được dùng** | `docker-compose down` hoặc đổi port trong docker-compose.yml |
| **MySQL không sẵn sàng** | Đợi 10-15s sau khi `docker-compose up`, health check sẽ báo ready |
| **Kết nối bị từ chối** | Kiểm tra `docker-compose ps`, chắc chắn container đang chạy |
| **Permission denied** | Chạy PowerShell/CMD với quyền Admin |

## Cấu Hình Chi Tiết

**application.properties:**
```properties
server.port=8081
spring.datasource.url=jdbc:mysql://product-mysql:3306/shopquanao
spring.datasource.username=root
spring.datasource.password=tien0399007905
```

**docker-compose.yml:**
- Root password: `tien0399007905`
- Database: `shopquanao`
- Port: `3306` (port host:container)
- Health check: Tự động kiểm tra mỗi 10 giây
