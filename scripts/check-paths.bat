@echo off
REM Check paths after folder reorganization
REM This script verifies all file references are correct

chcp 65001 >nul
setlocal enabledelayedexpansion

echo.
echo ========================================
echo   NCKH Project - Path Verification
echo ========================================
echo.

set ERRORS=0
set WARNINGS=0
set SUCCESS=0

REM Check scripts folder
echo [1/5] Checking scripts/ folder...
if exist scripts\ (
    echo   ✓ scripts folder exists
    set /a SUCCESS+=1
) else (
    echo   ✗ scripts folder NOT FOUND
    set /a ERRORS+=1
)

if exist scripts\start-all-clean.bat (echo   ✓ start-all-clean.bat) else (echo   ✗ start-all-clean.bat NOT FOUND & set /a ERRORS+=1)
if exist scripts\start-project.bat (echo   ✓ start-project.bat) else (echo   ✗ start-project.bat NOT FOUND & set /a ERRORS+=1)
if exist scripts\verify-services.bat (echo   ✓ verify-services.bat) else (echo   ✗ verify-services.bat NOT FOUND & set /a ERRORS+=1)
echo.

REM Check tests folder
echo [2/5] Checking tests/ folder...
if exist tests\ (
    echo   ✓ tests folder exists
    set /a SUCCESS+=1
) else (
    echo   ✗ tests folder NOT FOUND
    set /a ERRORS+=1
)

if exist tests\test-api.js (echo   ✓ test-api.js) else (echo   ✗ test-api.js NOT FOUND & set /a ERRORS+=1)
if exist tests\test-login.js (echo   ✓ test-login.js) else (echo   ✗ test-login.js NOT FOUND & set /a ERRORS+=1)
if exist tests\test-login-flow.js (echo   ✓ test-login-flow.js) else (echo   ✗ test-login-flow.js NOT FOUND & set /a ERRORS+=1)
if exist tests\test_backend.js (echo   ✓ test_backend.js) else (echo   ✗ test_backend.js NOT FOUND & set /a ERRORS+=1)
if exist tests\postman-test.json (echo   ✓ postman-test.json) else (echo   ✗ postman-test.json NOT FOUND & set /a ERRORS+=1)
echo.

REM Check guides folder
echo [3/5] Checking guides/ folder...
if exist guides\ (
    echo   ✓ guides folder exists
    set /a SUCCESS+=1
) else (
    echo   ✗ guides folder NOT FOUND
    set /a ERRORS+=1
)

if exist guides\QUICK_START.md (echo   ✓ QUICK_START.md) else (echo   ✗ QUICK_START.md NOT FOUND & set /a ERRORS+=1)
if exist guides\DEBUG_GUIDE.md (echo   ✓ DEBUG_GUIDE.md) else (echo   ✗ DEBUG_GUIDE.md NOT FOUND & set /a ERRORS+=1)
if exist guides\SETUP_GUIDE.md (echo   ✓ SETUP_GUIDE.md) else (echo   ✗ SETUP_GUIDE.md NOT FOUND & set /a ERRORS+=1)
echo.

REM Check database folder
echo [4/5] Checking database/ folder...
if exist database\ (
    echo   ✓ database folder exists
    set /a SUCCESS+=1
) else (
    echo   ✗ database folder NOT FOUND
    set /a ERRORS+=1
)

if exist database\setup_db.sql (echo   ✓ setup_db.sql) else (echo   ✗ setup_db.sql NOT FOUND & set /a ERRORS+=1)
if exist database\setup_db_simple.sql (echo   ✓ setup_db_simple.sql) else (echo   ✗ setup_db_simple.sql NOT FOUND & set /a ERRORS+=1)
if exist database\insert-test-user.sql (echo   ✓ insert-test-user.sql) else (echo   ✗ insert-test-user.sql NOT FOUND & set /a ERRORS+=1)
echo.

REM Check main folders
echo [5/5] Checking main project folders...
if exist api-gateway\ (echo   ✓ api-gateway) else (echo   ✗ api-gateway NOT FOUND & set /a ERRORS+=1)
if exist backend\ (echo   ✓ backend) else (echo   ✗ backend NOT FOUND & set /a ERRORS+=1)
if exist frontend\ (echo   ✓ frontend) else (echo   ✗ frontend NOT FOUND & set /a ERRORS+=1)
if exist docs\ (echo   ✓ docs) else (echo   ✗ docs NOT FOUND & set /a ERRORS+=1)
echo.

REM Summary
echo ========================================
echo   VERIFICATION SUMMARY
echo ========================================
echo   ✓ All OK: %SUCCESS%
echo   ✗ Errors: %ERRORS%
echo.

if %ERRORS% equ 0 (
    echo ✓ All paths are correct!
    echo.
    echo You can now run:
    echo   - scripts\start-all-clean.bat
    echo   - scripts\start-project.bat
    echo   - scripts\verify-services.bat
    echo.
) else (
    echo ✗ Some paths are INCORRECT!
    echo Please check the errors above.
    echo.
)

pause
