@echo off
REM NCKH Project Verification Script
REM Checks if all services are running and endpoints are accessible

chcp 65001 >nul
setlocal enabledelayedexpansion

echo.
echo ========================================
echo   NCKH Project - Service Verification
echo ========================================
echo.

set DELAY=2
set SUCCESS=0
set FAILED=0

REM Color codes
set GREEN=true
set RED=false

echo [INFO] This script will check if all services are running...
echo.

REM Function to check port
:CHECK_PORT
set PORT=%1
set SERVICE=%2
set URL=%3

echo Checking %SERVICE% on port %PORT%...
netstat -ano | findstr ":%PORT%" >nul 2>&1
if !errorlevel! equ 0 (
    echo   ✓ %SERVICE% is running on port %PORT%
    echo     URL: %URL%
    set /a SUCCESS+=1
) else (
    echo   ✗ %SERVICE% NOT running on port %PORT%
    set /a FAILED+=1
)
echo.
goto:eof

REM Check services
call:CHECK_PORT 5173 "Frontend (Vite)" "http://localhost:5173"
call:CHECK_PORT 3000 "API Gateway" "http://localhost:3000"
call:CHECK_PORT 8080 "Auth Service" "http://localhost:8080"
call:CHECK_PORT 8081 "Product Service" "http://localhost:8081"
call:CHECK_PORT 5432 "PostgreSQL" "postgresql://localhost:5432"
call:CHECK_PORT 3306 "MySQL" "mysql://localhost:3306"
call:CHECK_PORT 6379 "Redis" "redis://localhost:6379"

echo.
echo ========================================
echo   Test Summary
echo ========================================
echo   ✓ Running: %SUCCESS%
echo   ✗ Failed: %FAILED%
echo.

if %FAILED% equ 0 (
    echo All services are running! You can proceed with testing.
    echo.
    echo Recommended URLs to test:
    echo   - Frontend: http://localhost:5173
    echo   - Products: http://localhost:5173/products
    echo   - Admin: http://localhost:5173/admin
    echo.
) else (
    echo Some services are not running. Please check:
    echo   1. Windows Defender/Firewall not blocking ports
    echo   2. Required software installed (Node.js, Java, Docker)
    echo   3. Ports not in use by other applications
    echo.
    echo Start services using:
    echo   start-all-clean.bat
    echo.
)

echo Press any key to continue...
pause >nul
