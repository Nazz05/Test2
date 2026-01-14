# 📁 Cấu Trúc Thư Mục Dự Án NCKH

## Sơ Đồ Tổng Quan

```
Nckh/
├── 📁 api-gateway/          # Express.js Gateway (Port 3000)
├── 📁 backend/              # Các dịch vụ Java Spring Boot
│   ├── audit-service/       # Auth Service (Port 8080)
│   ├── order-service/
│   ├── product-service/     # Product Service (Port 8081)
│   └── user-service/
├── 📁 frontend/             # React + Vite (Port 5173)
│   └── web-client/
├── 📁 docs/                 # Tài liệu kiến trúc
│
├── 📁 scripts/              # 🔧 Script khởi chạy & debug
│   ├── start-all-clean.bat
│   ├── start-project.bat
│   ├── verify-services.bat
│   ├── generate-debug-report.bat
│   ├── run-debug-suite.bat
│   └── debug_report_*.txt
│
├── 📁 tests/                # 🧪 Các file test API
│   ├── test-api.js
│   ├── test-login.js
│   ├── test-login-flow.js
│   ├── test-login.bat
│   ├── test-gateway-login.bat
│   ├── test_backend.js
│   ├── test_register.js
│   ├── test-register-api.js
│   ├── test_api.sh
│   └── postman-test.json
│
├── 📁 guides/               # 📖 Hướng dẫn & tài liệu
│   ├── QUICK_START.md
│   ├── SETUP_GUIDE.md
│   ├── DEBUG_GUIDE.md
│   ├── DEBUG_README.md
│   ├── ADMIN_NAVIGATION_FIX.md
│   ├── CHANGES_SUMMARY.md
│   ├── COMPLETION_CHECKLIST.md
│   └── INTEGRATION_COMPLETE.md
│
├── 📁 database/             # 🗄️ Database setup scripts
│   ├── setup_db.sql
│   ├── setup_db_simple.sql
│   └── insert-test-user.sql
│
├── package.json             # Node.js dependencies (root)
├── package-lock.json
└── README.md                # Tài liệu chính
```

## Chi Tiết Các Thư Mục

### 📁 scripts/
Chứa tất cả file script để khởi chạy và debug dự án.

| File | Mục đích |
|------|---------|
| `start-all-clean.bat` | Khởi chạy tất cả dịch vụ (Backend + Gateway + Frontend) |
| `start-project.bat` | Khởi chạy từng dịch vụ riêng biệt |
| `verify-services.bat` | Kiểm tra trạng thái các dịch vụ |
| `generate-debug-report.bat` | Tạo báo cáo debug tự động |
| `run-debug-suite.bat` | Chạy toàn bộ bộ test debug |
| `debug_report_*.txt` | Báo cáo debug được tạo ra |

**Cách sử dụng:**
```bash
# Từ thư mục dự án gốc
scripts\start-all-clean.bat
scripts\verify-services.bat
```

### 📁 tests/
Chứa tất cả các file test API cho các dịch vụ.

| File | Loại | Mục đích |
|------|------|---------|
| `test-api.js` | Node.js | Test API endpoints tổng hợp |
| `test-login.js` | Node.js | Test login vào Auth Service |
| `test-login-flow.js` | Node.js | Test quy trình login đầy đủ |
| `test_backend.js` | Node.js | Test Backend API connection |
| `test_register.js` | Node.js | Test đăng ký người dùng |
| `test-register-api.js` | Node.js | Test Register API endpoints |
| `test_api.sh` | Shell | Test API trên Linux/Mac |
| `test-login.bat` | Batch | Test login Auth Service |
| `test-gateway-login.bat` | Batch | Test login qua Gateway |
| `postman-test.json` | Postman | Bộ test Postman Collection |

**Cách sử dụng:**
```bash
# Test từ thư mục tests/
node test-api.js
node test-login-flow.js

# Hoặc từ thư mục gốc
node tests/test-api.js

# Test với Postman
# Import postman-test.json vào Postman
```

### 📁 guides/
Chứa toàn bộ tài liệu hướng dẫn dự án.

| File | Nội dung |
|------|---------|
| `QUICK_START.md` | Hướng dẫn nhanh bắt đầu |
| `SETUP_GUIDE.md` | Hướng dẫn cài đặt chi tiết |
| `DEBUG_GUIDE.md` | Hướng dẫn debug lỗi |
| `DEBUG_README.md` | Tài liệu debug bổ sung |
| `ADMIN_NAVIGATION_FIX.md` | Hướng dẫn fix Admin Navigation |
| `CHANGES_SUMMARY.md` | Tóm tắt các thay đổi |
| `COMPLETION_CHECKLIST.md` | Danh sách hoàn thành |
| `INTEGRATION_COMPLETE.md` | Báo cáo hoàn thành tích hợp |

**Cách sử dụng:**
```bash
# Đọc hướng dẫn
start guides/QUICK_START.md
start guides/DEBUG_GUIDE.md
```

### 📁 database/
Chứa các script SQL để thiết lập cơ sở dữ liệu.

| File | Mục đích |
|------|---------|
| `setup_db.sql` | Script setup đầy đủ database |
| `setup_db_simple.sql` | Script setup đơn giản |
| `insert-test-user.sql` | Chèn dữ liệu test user |

**Cách sử dụng:**
```bash
# Chạy script SQL trên MySQL/PostgreSQL
mysql -u root -p < database/setup_db.sql
```

## Đường Dẫn Tương Đối Từ Scripts

Khi chạy script từ thư mục `/scripts`, các đường dẫn được sử dụng:

```bat
@echo off
set PROJECT_DIR=%~dp0
cd /d "%PROJECT_DIR%"

REM Từ scripts/, để trỏ đến các file test:
if exist "..\tests\test-api.js" (...)

REM Từ scripts/, để trỏ đến hướng dẫn:
REM guides\DEBUG_GUIDE.md

REM Từ scripts/, để trỏ đến backend:
REM ..\backend\audit-service\Nckh-Lu-n
```

## Lưu Ý Quan Trọng

⚠️ **Không di chuyển các thư mục sau nếu không cập nhật đường dẫn trong script:**
- `api-gateway/`
- `backend/`
- `frontend/`
- `docs/`

✅ **An toàn di chuyển các file trong:**
- `scripts/` - Scripts và reports
- `tests/` - Test files
- `guides/` - Hướng dẫn
- `database/` - SQL scripts

## Quick Links

- 🚀 [Khởi chạy nhanh](guides/QUICK_START.md)
- 🔧 [Hướng dẫn setup](guides/SETUP_GUIDE.md)
- 🐛 [Hướng dẫn debug](guides/DEBUG_GUIDE.md)
- 📊 [Kiến trúc dự án](docs/architecture/README.md)
