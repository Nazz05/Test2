# 🔍 NCKH Debug Tools

## 📋 Quick Start

Khi gặp lỗi FE→BE, chạy lệnh này:

```batch
run-debug-suite.bat
```

Script sẽ tự động:
- ✅ Thu thập thông tin hệ thống
- ✅ Kiểm tra tất cả services
- ✅ Test luồng hoạt động hoàn chỉnh
- ✅ Tạo báo cáo tổng hợp

## 📁 Generated Reports

Sau khi chạy, xem các file:
- `debug-suite-report-[timestamp].txt` - Báo cáo tổng hợp
- `flow-test-summary.txt` - Kết quả test flow
- `debug-report-[timestamp].txt` - Thông tin debug chi tiết

## 🛠️ Individual Tools

### Automated Debug Report
```batch
generate-debug-report.bat
```

### Flow Testing
```batch
node test-flow.js
```

### Manual Guide
[Xem DEBUG_GUIDE.md](DEBUG_GUIDE.md) để debug thủ công

## 🚨 Troubleshooting

Nếu `run-debug-suite.bat` thất bại:
1. Kiểm tra Node.js đã cài đặt: `node --version`
2. Kiểm tra services đang chạy: `verify-services.bat`
3. Xem logs trong terminal windows

## 📞 Support

- Chi tiết: [DEBUG_GUIDE.md](DEBUG_GUIDE.md)
- Quick start: [QUICK_START.md](QUICK_START.md)
- Setup: [SETUP_GUIDE.md](SETUP_GUIDE.md)