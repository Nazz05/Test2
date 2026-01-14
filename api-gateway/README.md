# API Gateway

API Gateway để xác thực JWT và chuyển tiếp requests từ Frontend tới Backend.

## Tính năng

- ✅ JWT Token Verification
- ✅ CORS Support cho Frontend (port 5173)
- ✅ Request Forwarding tới Backend (port 8080)
- ✅ Authentication routes (Register, Login, Validate)
- ✅ Authorization header handling
- ✅ Error handling và logging

## Port

- **Gateway**: `3000`
- **Frontend**: `5173`
- **Backend**: `8080`

## Installation

```bash
cd api-gateway
npm install
```

## Configuration

Tạo file `.env`:

```
PORT=3000
BACKEND_URL=http://localhost:8080
JWT_SECRET=caef38e2f3667de7631b24840629c0aa60ef53f76a7c3e66d5edd0218a2df52c
```

## Run

```bash
# Development
npm run dev

# Production
npm start
```

## API Routes

### Authentication

- `POST /api/auth/register` - Đăng ký tài khoản
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/validate` - Xác thực token

### Other Routes

Gateway sẽ tự động forward tất cả các requests khác tới backend:
- `GET /api/*`
- `POST /api/*`
- `PUT /api/*`
- `DELETE /api/*`

## Flow

```
Frontend (5173)
     ↓
   Axios → Gateway (3000)
     ↓
  JWT Verification
     ↓
   Forward → Backend (8080)
     ↓
   Response ← Backend
     ↓
   Return → Frontend
```

## JWT Structure

Token gồm có:
```json
{
  "userId": "number",
  "username": "string",
  "email": "string",
  "iat": "timestamp",
  "exp": "timestamp"
}
```

## Request Header

```
Authorization: Bearer <token>
```

## Error Handling

Gateway trả về lỗi với format:

```json
{
  "message": "Error description",
  "error": "Backend error details"
}
```

## Logging

Tất cả requests sẽ được log với timestamp:

```
2026-01-11T14:30:00Z - POST /api/auth/login
```
