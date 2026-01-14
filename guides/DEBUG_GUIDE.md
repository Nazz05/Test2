# 🔍 NCKH Project - Hướng Dẫn Kiểm Tra Luồng Hoạt Động

## 📋 Tổng Quan

Hướng dẫn chi tiết cách kiểm tra và debug luồng hoạt động từ Frontend đến Backend trong dự án NCKH. Khi có lỗi xảy ra, hãy làm theo từng bước để xác định nguyên nhân.

---

## 🏗️ Kiến Trúc Luồng Request

```
Frontend (React, Port 5173)
    ↓ (axiosClient)
API Gateway (Express, Port 3000)
    ↓ (proxy)
Auth Service (Spring Boot, Port 8080) OR Product Service (Spring Boot, Port 8081)
    ↓ (JPA)
Database (PostgreSQL/MySQL)
```

---

## 🔧 Công Cụ Kiểm Tra

### 1. **Browser Developer Tools** (F12)
- **Network Tab**: Xem tất cả HTTP requests
- **Console Tab**: Xem JavaScript errors
- **Application Tab**: Kiểm tra localStorage

### 2. **Terminal Commands**
```bash
# Kiểm tra services đang chạy
verify-services.bat

# Test API endpoints
node test-api.js

# Kiểm tra ports
netstat -ano | findstr :5173
netstat -ano | findstr :3000
netstat -ano | findstr :8080
netstat -ano | findstr :8081
```

### 3. **Logs**
- API Gateway logs (terminal window)
- Spring Boot logs (terminal windows)
- Browser console logs

---

## 📝 Quy Trình Kiểm Tra Luồng

### Bước 1: Kiểm Tra Services Đang Chạy

**Command:**
```bash
verify-services.bat
```

**Kết quả mong đợi:**
```
Checking Frontend (Vite) on port 5173... ✓ Running
Checking API Gateway on port 3000... ✓ Running
Checking Auth Service on port 8080... ✓ Running
Checking Product Service on port 8081... ✓ Running
Checking PostgreSQL on port 5432... ✓ Running
Checking MySQL on port 3306... ✓ Running
Checking Redis on port 6379... ✓ Running
```

**Nếu có service không chạy:**
- Xem terminal window của service đó
- Kiểm tra error messages
- Restart service

---

### Bước 2: Kiểm Tra Frontend

**1. Mở Browser:**
```
http://localhost:5173
```

**2. Mở Developer Tools (F12):**
- **Console Tab**: Không có errors màu đỏ
- **Network Tab**: Không có requests failed (màu đỏ)

**3. Kiểm Tra localStorage:**
```javascript
// Trong Console tab, chạy:
localStorage.getItem('token')
localStorage.getItem('user')
```

**Kết quả mong đợi:**
- Token: chuỗi JWT dài
- User: JSON object với username, role, etc.

---

### Bước 3: Test Login Flow

**1. Thực hiện login:**
- Username: `sysadmin`
- Password: `1234`

**2. Kiểm tra Network Tab:**
- Tìm request: `POST /api/auth/login`
- Status: `200 OK`
- Response: `{token: "...", username: "sysadmin", role: "ADMIN", ...}`

**3. Kiểm tra redirect:**
- Admin → `http://localhost:5173/admin`
- User → `http://localhost:5173/`

---

### Bước 4: Kiểm Tra API Gateway Logs

**Trong terminal window của API Gateway, bạn sẽ thấy:**

```
[Proxy] POST /api/auth/login -> http://localhost:8080/api/auth/login
[Proxy] GET /api/products -> http://localhost:8081/api/products
```

**Nếu không thấy logs:**
- API Gateway không nhận được request
- Kiểm tra axios baseURL trong `axiosClient.js`

---

### Bước 5: Kiểm Tra Product Loading

**1. Truy cập trang chủ:**
```
http://localhost:5173
```

**2. Kiểm tra Network Tab:**
- Request: `GET /api/products`
- Status: `200 OK`
- Response: Array of products

**3. Kiểm tra Console:**
- Không có error messages
- Products hiển thị trên trang

---

### Bước 6: Test Admin Dashboard

**1. Login với admin account:**
```
sysadmin / 1234
```

**2. Truy cập:**
```
http://localhost:5173/admin
```

**3. Kiểm tra Network Tab:**
- `GET /api/products` - Load danh sách
- Status: `200 OK`

**4. Test CRUD operations:**
- Add product → `POST /api/products`
- Edit product → `PUT /api/products/{id}`
- Delete product → `DELETE /api/products/{id}`

---

## 🚨 Xử Lý Lỗi Thường Gặp

### Lỗi 1: "Cannot connect to API"

**Triệu chứng:**
- Browser console: `net::ERR_CONNECTION_REFUSED`
- Network tab: Failed requests

**Nguyên nhân:**
- API Gateway không chạy (port 3000)
- axios baseURL sai

**Giải pháp:**
```bash
# Kiểm tra API Gateway
netstat -ano | findstr :3000

# Kiểm tra axiosClient.js
// baseURL phải là: "http://localhost:3000/api"
```

---

### Lỗi 2: "502 Bad Gateway"

**Triệu chứng:**
- Network tab: `502 Bad Gateway`
- API Gateway logs: Proxy error

**Nguyên nhân:**
- Backend service không chạy
- Port sai trong proxy config

**Giải pháp:**
```bash
# Kiểm tra backend services
netstat -ano | findstr :8080  # Auth Service
netstat -ano | findstr :8081  # Product Service

# Kiểm tra API Gateway config
// Trong server.js, PRODUCT_SERVICE_URL phải là "http://localhost:8081"
```

---

### Lỗi 3: "401 Unauthorized"

**Triệu chứng:**
- Login thành công nhưng requests khác fail
- Network tab: `401 Unauthorized`

**Nguyên nhân:**
- Token không được gửi
- Token expired
- localStorage bị xóa

**Giải pháp:**
```javascript
// Kiểm tra token trong Console
localStorage.getItem('token')

// Nếu null → Login lại
// Nếu có token → Kiểm tra expiry
```

---

### Lỗi 4: "Products not loading"

**Triệu chứng:**
- Trang chủ trống
- Console: API error

**Nguyên nhân:**
- Product Service không chạy
- Database trống
- API endpoint sai

**Giải pháp:**
```bash
# Test trực tiếp Product Service
curl http://localhost:8081/api/products

# Kiểm tra database
# MySQL có data không
```

---

### Lỗi 5: "Admin page blank"

**Triệu chứng:**
- Login admin nhưng trang admin trống
- Console: Role check failed

**Nguyên nhân:**
- User role không phải ADMIN
- Role check logic sai

**Giải pháp:**
```javascript
// Kiểm tra user object
JSON.parse(localStorage.getItem('user'))

// Phải có: role: "ADMIN"
```

---

## 📊 Logs Và Monitoring

### API Gateway Logs
```
[Proxy] GET /api/products -> http://localhost:8081/api/products
Response: 200 OK
```

### Spring Boot Logs
```
2025-01-12 10:30:15 INFO  ProductController - Getting all products
2025-01-12 10:30:15 INFO  ProductService - Found 15 products
```

### Browser Console Logs
```
✅ Login successful
✅ Products loaded: 15 items
✅ Admin access granted
```

---

## 🛠️ Debug Tools

### 1. **Postman/Insomnia**
```json
// Test login
POST http://localhost:3000/api/auth/login
{
  "username": "sysadmin",
  "password": "1234"
}

// Test products
GET http://localhost:3000/api/products
Authorization: Bearer <token>
```

### 2. **cURL Commands**
```bash
# Test login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"sysadmin","password":"1234"}'

# Test products with token
curl -X GET http://localhost:3000/api/products \
  -H "Authorization: Bearer <token>"
```

### 3. **Database Check**
```sql
-- PostgreSQL (Auth DB)
SELECT * FROM users WHERE username = 'sysadmin';

-- MySQL (Product DB)
SELECT * FROM products LIMIT 5;
```

---

## 📋 Checklist Debug

### Frontend Layer
- [ ] Browser console không có errors
- [ ] Network tab shows successful requests
- [ ] localStorage có token và user
- [ ] axios baseURL đúng: `http://localhost:3000/api`

### API Gateway Layer
- [ ] Port 3000 đang listen
- [ ] Logs show proxy forwarding
- [ ] No 502 errors
- [ ] CORS headers present

### Backend Layer
- [ ] Auth Service port 8080 running
- [ ] Product Service port 8081 running
- [ ] Spring Boot logs show requests
- [ ] Database connections working

### Database Layer
- [ ] PostgreSQL port 5432 accessible
- [ ] MySQL port 3306 accessible
- [ ] Tables have data
- [ ] No connection errors

---

## 🔄 Flow Test Script

Tạo file `test-flow.js`:

```javascript
#!/usr/bin/env node

/**
 * NCKH Project - Comprehensive Flow Test
 * Tests the complete flow from Frontend simulation to Backend
 * Generates detailed report of each step
 */

const axios = require('axios');
const fs = require('fs');

class FlowTester {
  constructor() {
    this.results = {
      timestamp: new Date().toISOString(),
      tests: [],
      summary: {
        total: 0,
        passed: 0,
        failed: 0,
        warnings: 0
      }
    };
    this.token = null;
    this.user = null;
  }

  log(message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    const prefix = {
      info: 'ℹ️ ',
      success: '✅ ',
      error: '❌ ',
      warning: '⚠️ ',
      debug: '🔍 '
    }[type] || 'ℹ️ ';

    console.log(`[${timestamp}] ${prefix}${message}`);
  }

  addTest(name, status, details = '', response = null) {
    const test = {
      name,
      status,
      details,
      timestamp: new Date().toISOString(),
      response: response ? {
        status: response.status,
        statusText: response.statusText,
        data: typeof response.data === 'object' ? JSON.stringify(response.data, null, 2) : response.data
      } : null
    };

    this.results.tests.push(test);
    this.results.summary.total++;

    switch (status) {
      case 'PASS':
        this.results.summary.passed++;
        this.log(`${name}: ${details}`, 'success');
        break;
      case 'FAIL':
        this.results.summary.failed++;
        this.log(`${name}: ${details}`, 'error');
        break;
      case 'WARN':
        this.results.summary.warnings++;
        this.log(`${name}: ${details}`, 'warning');
        break;
    }

    return test;
  }

  async testServiceConnectivity() {
    this.log('Testing service connectivity...', 'debug');

    const services = [
      { name: 'Frontend', url: 'http://localhost:5173', port: 5173 },
      { name: 'API Gateway', url: 'http://localhost:3000/api/auth/validate', port: 3000 },
      { name: 'Auth Service', url: 'http://localhost:8080/actuator/health', port: 8080 },
      { name: 'Product Service', url: 'http://localhost:8081/actuator/health', port: 8081 }
    ];

    for (const service of services) {
      try {
        const response = await axios.get(service.url, { timeout: 5000 });
        this.addTest(
          `Service Connectivity - ${service.name}`,
          'PASS',
          `Port ${service.port} responding (${response.status})`,
          response
        );
      } catch (error) {
        // API Gateway auth endpoint should return 401 (no token) - that's expected
        if (service.name === 'API Gateway' && error.response?.status === 401) {
          this.addTest(
            `Service Connectivity - ${service.name}`,
            'PASS',
            `Port ${service.port} responding (401 expected for auth endpoint)`,
            error.response
          );
        } else {
          this.addTest(
            `Service Connectivity - ${service.name}`,
            'FAIL',
            `Port ${service.port} not responding: ${error.message}`,
            error.response
          );
        }
      }
    }
  }

  async testAuthentication() {
    this.log('Testing authentication flow...', 'debug');

    // Test login
    try {
      const loginResponse = await axios.post('http://localhost:3000/api/auth/login', {
        username: 'sysadmin',
        password: '1234'
      }, { timeout: 10000 });

      this.addTest(
        'Authentication - Login',
        'PASS',
        `Login successful for admin user`,
        loginResponse
      );

      this.token = loginResponse.data.token;
      this.user = loginResponse.data;

      // Validate token
      if (this.token) {
        try {
          const validateResponse = await axios.post('http://localhost:3000/api/auth/validate', {}, {
            headers: { Authorization: `Bearer ${this.token}` },
            timeout: 5000
          });

          this.addTest(
            'Authentication - Token Validation',
            'PASS',
            'Token validated successfully',
            validateResponse
          );
        } catch (error) {
          this.addTest(
            'Authentication - Token Validation',
            'FAIL',
            `Token validation failed: ${error.message}`,
            error.response
          );
        }
      }

    } catch (error) {
      this.addTest(
        'Authentication - Login',
        'FAIL',
        `Login failed: ${error.message}`,
        error.response
      );
    }
  }

  async testProductOperations() {
    if (!this.token) {
      this.addTest('Product Operations', 'FAIL', 'Cannot test products - no authentication token');
      return;
    }

    this.log('Testing product operations...', 'debug');

    const headers = { Authorization: `Bearer ${this.token}` };

    // Test get all products
    try {
      const response = await axios.get('http://localhost:3000/api/products', {
        headers,
        timeout: 10000
      });

      const productCount = Array.isArray(response.data) ? response.data.length : 0;
      this.addTest(
        'Product Operations - Get All',
        'PASS',
        `Retrieved ${productCount} products`,
        response
      );

      // Test category filter if we have products
      if (productCount > 0) {
        try {
          const categoryResponse = await axios.get('http://localhost:3000/api/products/category/Nam', {
            headers,
            timeout: 5000
          });

          this.addTest(
            'Product Operations - Category Filter',
            'PASS',
            `Category filter working`,
            categoryResponse
          );
        } catch (error) {
          this.addTest(
            'Product Operations - Category Filter',
            'WARN',
            `Category filter failed: ${error.message}`,
            error.response
          );
        }

        // Test search
        try {
          const searchResponse = await axios.get('http://localhost:3000/api/products/search?keyword=test', {
            headers,
            timeout: 5000
          });

          this.addTest(
            'Product Operations - Search',
            'PASS',
            'Search functionality working',
            searchResponse
          );
        } catch (error) {
          this.addTest(
            'Product Operations - Search',
            'WARN',
            `Search failed: ${error.message}`,
            error.response
          );
        }
      }

    } catch (error) {
      this.addTest(
        'Product Operations - Get All',
        'FAIL',
        `Failed to get products: ${error.message}`,
        error.response
      );
    }
  }

  async testAdminOperations() {
    if (!this.token || !this.user || this.user.role !== 'ADMIN') {
      this.addTest('Admin Operations', 'FAIL', 'Cannot test admin operations - not logged in as admin');
      return;
    }

    this.log('Testing admin operations...', 'debug');

    const headers = { Authorization: `Bearer ${this.token}` };

    // Test create product
    try {
      const testProduct = {
        name: `Test Product ${Date.now()}`,
        type: 'Test',
        price: 99999,
        quantity: 10,
        description: 'Test product created by flow test'
      };

      const createResponse = await axios.post('http://localhost:3000/api/products', testProduct, {
        headers,
        timeout: 10000
      });

      this.addTest(
        'Admin Operations - Create Product',
        'PASS',
        'Product created successfully',
        createResponse
      );

      // Store product ID for cleanup
      const productId = createResponse.data.id;

      // Test update product
      try {
        const updateResponse = await axios.put(`http://localhost:3000/api/products/${productId}`, {
          ...testProduct,
          price: 88888
        }, {
          headers,
          timeout: 5000
        });

        this.addTest(
          'Admin Operations - Update Product',
          'PASS',
          'Product updated successfully',
          updateResponse
        );
      } catch (error) {
        this.addTest(
          'Admin Operations - Update Product',
          'WARN',
          `Update failed: ${error.message}`,
          error.response
        );
      }

      // Test delete product (cleanup)
      try {
        const deleteResponse = await axios.delete(`http://localhost:3000/api/products/${productId}`, {
          headers,
          timeout: 5000
        });

        this.addTest(
          'Admin Operations - Delete Product',
          'PASS',
          'Product deleted successfully',
          deleteResponse
        );
      } catch (error) {
        this.addTest(
          'Admin Operations - Delete Product',
          'WARN',
          `Delete failed: ${error.message} (manual cleanup may be needed)`,
          error.response
        );
      }

    } catch (error) {
      this.addTest(
        'Admin Operations - Create Product',
        'FAIL',
        `Create failed: ${error.message}`,
        error.response
      );
    }
  }

  generateReport() {
    const report = {
      title: 'NCKH Project - Flow Test Report',
      ...this.results,
      environment: {
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch,
        timestamp: new Date().toISOString()
      }
    };

    // Save detailed JSON report
    const jsonReport = JSON.stringify(report, null, 2);
    fs.writeFileSync('flow-test-report.json', jsonReport);

    // Generate human-readable summary
    let summary = '='.repeat(50) + '\n';
    summary += 'NCKH PROJECT FLOW TEST SUMMARY\n';
    summary += '='.repeat(50) + '\n\n';
    summary += `Timestamp: ${new Date().toLocaleString()}\n`;
    summary += `Total Tests: ${this.results.summary.total}\n`;
    summary += `Passed: ${this.results.summary.passed}\n`;
    summary += `Failed: ${this.results.summary.failed}\n`;
    summary += `Warnings: ${this.results.summary.warnings}\n\n`;

    if (this.results.summary.failed === 0 && this.results.summary.warnings === 0) {
      summary += '🎉 ALL TESTS PASSED! System is working correctly.\n\n';
    } else {
      summary += '⚠️  Some issues detected. Check details below.\n\n';
    }

    summary += 'DETAILED RESULTS:\n';
    summary += '-'.repeat(30) + '\n';

    this.results.tests.forEach((test, index) => {
      const status = {
        'PASS': '✅',
        'FAIL': '❌',
        'WARN': '⚠️'
      }[test.status] || 'ℹ️';

      summary += `${index + 1}. ${status} ${test.name}\n`;
      summary += `   ${test.details}\n`;

      if (test.response) {
        summary += `   Status: ${test.response.status}\n`;
      }
      summary += '\n';
    });

    summary += '='.repeat(50) + '\n';
    summary += 'END OF REPORT\n';
    summary += '='.repeat(50) + '\n';

    fs.writeFileSync('flow-test-summary.txt', summary);

    return summary;
  }

  async runAllTests() {
    console.log('\n🚀 Starting NCKH Flow Tests...\n');
    console.log('=' .repeat(50));

    try {
      await this.testServiceConnectivity();
      console.log('');

      await this.testAuthentication();
      console.log('');

      await this.testProductOperations();
      console.log('');

      await this.testAdminOperations();
      console.log('');

      const summary = this.generateReport();

      console.log('\n' + '='.repeat(50));
      console.log('TESTS COMPLETED');
      console.log('='.repeat(50));
      console.log(`Total: ${this.results.summary.total}`);
      console.log(`Passed: ${this.results.summary.passed}`);
      console.log(`Failed: ${this.results.summary.failed}`);
      console.log(`Warnings: ${this.results.summary.warnings}`);
      console.log('');
      console.log('Reports saved:');
      console.log('  - flow-test-summary.txt (human readable)');
      console.log('  - flow-test-report.json (detailed JSON)');
      console.log('');
      console.log('For troubleshooting guide: DEBUG_GUIDE.md');

    } catch (error) {
      this.log(`Fatal error during testing: ${error.message}`, 'error');
    }
  }
}

// Run tests if called directly
if (require.main === module) {
  const tester = new FlowTester();
  tester.runAllTests().catch(console.error);
}

module.exports = FlowTester;
```

**Chạy test:**
```bash
node test-flow.js
```

---

## 🤖 Automated Debug Suite

### **Công cụ chính: `run-debug-suite.bat`**

Script tự động chạy tất cả các công cụ debug và tạo báo cáo tổng hợp:

```batch
# Chạy toàn bộ debug suite
run-debug-suite.bat
```

**Script sẽ thực hiện:**
1. ✅ Chạy `generate-debug-report.bat` (thu thập thông tin hệ thống)
2. ✅ Chạy `test-flow.js` (test luồng hoạt động)
3. ✅ Chạy các test bổ sung (test_backend.js, test_register.js, etc.)
4. ✅ Tạo báo cáo tổng hợp với timestamp

**Output files:**
- `debug-suite-report-[timestamp].txt` - Báo cáo tổng hợp
- `debug-report-[timestamp].txt` - Báo cáo debug chi tiết
- `flow-test-summary.txt` - Tóm tắt test flow
- `flow-test-report.json` - Báo cáo JSON chi tiết

### **Cách sử dụng nhanh:**

```batch
# Khi gặp lỗi, chạy lệnh này:
run-debug-suite.bat

# Sau đó xem báo cáo:
notepad debug-suite-report-*.txt
```

---

## 📝 Debug Report Template

Khi gặp lỗi, tạo report theo format này:

```
🔍 DEBUG REPORT - NCKH Project
================================

**Timestamp:** 2025-01-12 14:30:00
**User:** [Tên người test]
**Environment:** [Windows/Linux/Mac]

**Issue Description:**
[Miêu tả lỗi]

**Steps to Reproduce:**
1. [Bước 1]
2. [Bước 2]
3. [Bước 3]

**Expected Result:**
[Expected behavior]

**Actual Result:**
[Actual behavior]

**Debug Information:**

**1. Services Status:**
- Frontend (5173): [Running/Not Running]
- API Gateway (3000): [Running/Not Running]
- Auth Service (8080): [Running/Not Running]
- Product Service (8081): [Running/Not Running]
- PostgreSQL (5432): [Running/Not Running]
- MySQL (3306): [Running/Not Running]

**2. Browser Console Errors:**
[Paste errors here]

**3. Network Tab:**
- Request: [URL]
- Status: [Status Code]
- Response: [Response data]

**4. API Gateway Logs:**
[Paste logs here]

**5. Backend Logs:**
[Paste Spring Boot logs here]

**6. localStorage:**
- Token: [Present/Null]
- User: [User object]

**Root Cause:**
[Analysis of the issue]

**Solution Applied:**
[What was done to fix]

**Status:** [Fixed/Pending]
```

---

## 🎯 Quick Debug Commands

```bash
# 1. Check all services
verify-services.bat

# 2. Test API endpoints
node test-api.js

# 3. Check ports
netstat -ano | findstr "5173\|3000\|8080\|8081"

# 4. Kill process on port
taskkill /PID <PID> /F

# 5. Clear browser cache
# Ctrl+Shift+R in browser

# 6. Clear localStorage
# F12 → Application → Storage → Clear

# 7. Check Java version
java -version

# 8. Check Node version
node -v

# 9. Restart services
start-all-clean.bat
```

---

## 📞 Support Checklist

Trước khi liên hệ support:

- [ ] Đã chạy `verify-services.bat`
- [ ] Đã kiểm tra browser console
- [ ] Đã kiểm tra network tab
- [ ] Đã thử login lại
- [ ] Đã clear localStorage
- [ ] Đã restart services
- [ ] Đã kiểm tra ports không bị chiếm
- [ ] Đã xem logs của tất cả services

---

## � Quick Debug Commands

Khi gặp lỗi, chạy các lệnh sau theo thứ tự:

### **1. Debug Suite (Khuyến nghị)**
```batch
# Chạy toàn bộ debug và tạo báo cáo
run-debug-suite.bat

# Xem báo cáo tổng hợp
notepad debug-suite-report-*.txt
```

### **2. Quick Checks**
```batch
# Kiểm tra services
verify-services.bat

# Test login
test-login.bat

# Test API
node test-api.js
```

### **3. Manual Debug**
```batch
# Kiểm tra ports
netstat -ano | findstr "5173\|3000\|8080\|8081"

# Test API Gateway
curl -X GET http://localhost:3000/api/auth/validate

# Test login
curl -X POST http://localhost:3000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"sysadmin\",\"password\":\"1234\"}"
```

---

## �🔗 Related Documentation

- [QUICK_START.md](QUICK_START.md) - Khởi động nhanh
- [SETUP_GUIDE.md](SETUP_GUIDE.md) - Hướng dẫn setup
- [CHANGES_SUMMARY.md](CHANGES_SUMMARY.md) - Thay đổi đã làm
- [INTEGRATION_COMPLETE.md](INTEGRATION_COMPLETE.md) - Tổng quan hoàn thành

---

**Version:** 1.0.0
**Last Updated:** 2025-01-12
**Status:** Active
