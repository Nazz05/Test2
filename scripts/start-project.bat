@echo off
setlocal enabledelayedexpansion
chcp 65001 >nul

echo.
echo ================================
echo   KHOI DONG DU AN NCKH
echo ================================
echo.

REM Kiem tra Node.js
echo [1/4] Kiem tra Node.js...
where node >nul 2>nul
if errorlevel 1 (
    echo [ERROR] Node.js khong duoc cai dat.
    pause
    exit /b 1
)
echo [OK] Node.js

REM Kiem tra Docker
echo [2/4] Kiem tra Docker...
where docker >nul 2>nul
if errorlevel 1 (
    echo [WARN] Docker khong duoc cai dat.
    set SKIP_DOCKER=1
) else (
    echo [OK] Docker
)

REM Kiem tra Java
echo [3/4] Kiem tra Java...
where java >nul 2>nul
if errorlevel 1 (
    echo [WARN] Java khong duoc cai dat.
    set SKIP_JAVA=1
) else (
    echo [OK] Java
)

echo [4/4] Chuan bi khoi dong...
echo.

cd /d "%~dp0.."
set PROJECT_DIR=%CD%

REM === DOCKER ===
if not "%SKIP_DOCKER%"=="1" (
    echo.
    echo [DOCKER] Starting PostgreSQL, Redis...
    cd "%PROJECT_DIR%\backend\audit-service\Nckh-Lu-n"
    call docker-compose up -d
    
    echo [DOCKER] Starting MySQL for Product Service...
    cd "%PROJECT_DIR%\backend\product-service\Tien\Tien"
    call docker-compose up -d
    
    echo [DOCKER] Waiting 15 seconds for containers...
    timeout /t 15 /nobreak
)

REM === BACKEND ===
if not "%SKIP_JAVA%"=="1" (
    echo.
    echo [BACKEND] Starting Auth Service on port 8080...
    start "Auth Service" cmd /k "cd /d "%PROJECT_DIR%\backend\audit-service\Nckh-Lu-n" && mvnw.cmd clean spring-boot:run -DskipTests"
    timeout /t 15 /nobreak
    
    echo [BACKEND] Starting Product Service on port 8081...
    start "Product Service" cmd /k "cd /d "%PROJECT_DIR%\backend\product-service\Tien\Tien" && mvnw.cmd clean spring-boot:run -DskipTests"
    timeout /t 15 /nobreak
)

REM === GATEWAY ===
echo.
echo [GATEWAY] Starting API Gateway on port 3000...
cd "%PROJECT_DIR%\api-gateway"
if not exist "node_modules" (
    call npm install
)
start "API Gateway" cmd /k "cd /d "%PROJECT_DIR%\api-gateway" && npm start"
timeout /t 5 /nobreak

REM === FRONTEND ===
echo [FRONTEND] Starting React app on port 5173...
cd "%PROJECT_DIR%\frontend\web-client"
if not exist "node_modules" (
    call npm install
)
start "Frontend" cmd /k "cd /d "%PROJECT_DIR%\frontend\web-client" && npm run dev"
timeout /t 3 /nobreak

echo.
echo ================================
echo   ALL SERVICES STARTED!
echo ================================
echo.
echo URLs:
echo   Frontend:      http://localhost:5173
echo   API Gateway:   http://localhost:3000
if not "%SKIP_JAVA%"=="1" (
    echo   Auth Service:    http://localhost:8080
    echo   Product Service: http://localhost:8081
)
echo.
echo Press Ctrl+C in each window to stop services.
echo.
pause
