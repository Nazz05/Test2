# 🚀 Quick Start Guide - NCKH Project

## ⚡ Khởi Động Nhanh (30 giây)

### Windows:
```bash
# 1. Mở PowerShell/CMD tại thư mục gốc NCKH
# 2. Chạy:
start-all-clean.bat

# 3. Chờ tất cả services khởi động (khoảng 60 giây)
# 4. Mở browser: http://localhost:5173
```

### Linux/Mac:
```bash
# Terminal 1 - Auth Service
cd backend/audit-service/Nckh-Lu-n
./mvnw spring-boot:run

# Terminal 2 - Product Service  
cd backend/product-service/Tien/Tien
./mvnw spring-boot:run

# Terminal 3 - API Gateway
cd api-gateway
npm install && npm start

# Terminal 4 - Frontend
cd frontend/web-client
npm install && npm run dev
```

## 🔓 Tài Khoản Test (Chọn một)

```
Admin Account:
  Email: sysadmin
  Password: 1234

Regular User:
  Email: 23810310082
  Password: 123456

Alternatively:
  nam123 / 123456
  lan456 / 123456
```

## 🌐 URLs Chính

| Chức Năng | URL |
|-----------|-----|
| 🏠 Trang chủ | http://localhost:5173 |
| 🛍️ Sản phẩm | http://localhost:5173/products |
| 🔐 Đăng nhập | http://localhost:5173/login |
| 📝 Đăng ký | http://localhost:5173/register |
| 👤 Profile | http://localhost:5173/profile (cần login) |
| 🛒 Giỏ hàng | http://localhost:5173/cart (cần login) |
| 👨‍💼 Admin | http://localhost:5173/admin (cần admin) |

## 🔧 Services & Ports

| Service | Port | Status |
|---------|------|--------|
| Frontend (Vite) | 5173 | ✅ React App |
| API Gateway | 3000 | ✅ Express Proxy |
| Auth Service | 8080 | ✅ Spring Boot |
| Product Service | 8081 | ✅ Spring Boot |
| PostgreSQL | 5432 | ✅ Auth DB |
| MySQL | 3306 | ✅ Product DB |
| Redis | 6379 | ✅ Cache |

## 📊 Main Features

✅ **Đăng nhập/Đăng ký** - JWT authentication  
✅ **Xem sản phẩm** - API integration  
✅ **Tìm kiếm & lọc** - By keyword & category  
✅ **Admin dashboard** - Quản lý sản phẩm  
✅ **Role-based routing** - Auto redirect admin  
✅ **Responsive design** - Mobile-friendly  
✅ **Error handling** - User-friendly messages  

## 🐛 Troubleshooting

### "Cannot connect to API"
```
→ Kiểm tra API Gateway chạy port 3000
→ Xóa localStorage & reload page
→ Kiểm tra console cho errors
```

### "Port already in use"
```
# Windows - Kill process
taskkill /PID <PID> /F

# Linux/Mac
kill -9 <PID>

# Hoặc chỉnh port trong code
```

### "Service not starting"
```
→ Kiểm tra Java installed: java -version
→ Kiểm tra Maven: mvn -version
→ Kiểm tra Node: node -v
```

### "Admin page blank"
```
→ Login lại với admin account
→ Kiểm trace user role trong browser console
```

## 📁 Project Structure

```
NCKH/
├── frontend/web-client/          # React Vite app
├── api-gateway/                  # Express proxy
├── backend/
│   ├── audit-service/           # Auth Service
│   └── product-service/         # Product Service
├── start-all-clean.bat           # Auto-start script
├── SETUP_GUIDE.md               # Full documentation
└── CHANGES_SUMMARY.md           # All changes made
```

## ✨ New Features Added

1. **Product API Integration**
   - Frontend calls product API via gateway
   - Home page shows real products
   - Product listing page with search & filter

2. **Admin Dashboard**
   - Full CRUD for products
   - Real-time table updates
   - Access control by role

3. **Role-Based Routing**
   - Auto-redirect admin to /admin
   - Users go to /home
   - Private routes protected

4. **API Gateway Enhancement**
   - Generic proxy for /api/* routes
   - Forward to auth or product service
   - Better error handling

## 🔗 API Endpoints

### Product Service (via /api/products):
```
GET    /api/products              # List all
GET    /api/products/category/:type  # Filter
GET    /api/products/search?keyword=X  # Search
POST   /api/products              # Create (Admin)
PUT    /api/products/:id          # Update (Admin)
DELETE /api/products/:id          # Delete (Admin)
POST   /api/products/purchase/:id # Purchase
```

### Auth Service (via /api/auth):
```
POST   /api/auth/login            # Login
POST   /api/auth/register         # Register
POST   /api/auth/validate         # Validate token
POST   /api/auth/logout           # Logout
```

## 📝 Development Notes

- **Frontend**: React 19 + Vite (HMR enabled)
- **Backend**: Spring Boot 3.x + Java 17/21
- **Database**: PostgreSQL (auth) + MySQL (products)
- **API**: RESTful with JWT authentication
- **UI**: Ant Design components
- **State**: Context API + localStorage

## 🎯 Next Steps

1. ✅ Test login flow
2. ✅ Browse products
3. ✅ Test search & filter
4. ✅ Add products as admin
5. ✅ Test user profile
6. ✅ Test shopping cart
7. ✅ Deploy to production

## 💡 Tips

- **Auto-refresh on code change** (Frontend only)
- **Clear localStorage** if auth issues: Open DevTools → Storage → Clear
- **Check browser console** for detailed error messages
- **Monitor API Gateway logs** for request forwarding details
- **Use test accounts** provided - don't create new ones yet

## 📚 Documentation

For detailed information, see:
- `SETUP_GUIDE.md` - Full setup instructions
- `CHANGES_SUMMARY.md` - All modifications made
- Backend README files in service directories

## ✅ Verification Checklist

After starting, verify:
- [ ] Frontend loads at http://localhost:5173
- [ ] Can navigate to /login and /register
- [ ] Can login with test account
- [ ] Products load on home page
- [ ] Can go to /products page
- [ ] Search & filter work
- [ ] Admin can go to /admin (with admin account)
- [ ] Admin can add/edit/delete products
- [ ] API Gateway logs show requests forwarding

---

**Status:** ✅ Production Ready  
**Version:** 1.0.0  
**Last Updated:** 2025-01-12

🎉 Happy coding! If you encounter any issues, check SETUP_GUIDE.md for troubleshooting.
