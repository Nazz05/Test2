@echo off
curl -X POST http://localhost:3000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"23810310082\",\"password\":\"123456\"}"
echo.
pause
