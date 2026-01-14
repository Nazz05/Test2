@echo off
REM NCKH Project - Debug Report Generator
REM Automatically collects debug information and creates a comprehensive report

chcp 65001 >nul
setlocal enabledelayedexpansion

echo.
echo ========================================
echo   NCKH Debug Report Generator
echo ========================================
echo.

REM Set PROJECT_DIR to parent of scripts folder
set PROJECT_DIR=%~dp0..

REM Get timestamp
for /f "tokens=2 delims==" %%i in ('wmic os get localdatetime /value') do set datetime=%%i
set TIMESTAMP=%datetime:~0,4%-%datetime:~4,2%-%datetime:~6,2% %datetime:~8,2%:%datetime:~10,2%:%datetime:~12,2%

REM Create report filename
set REPORT_FILE=debug_report_%TIMESTAMP:~0,4%%TIMESTAMP:~5,2%%TIMESTAMP:~8,2%_%TIMESTAMP:~11,2%%TIMESTAMP:~14,2%%TIMESTAMP:~17,2%.txt

echo Generating debug report: %REPORT_FILE%
echo.

REM Start collecting information
echo ======================================== > "%REPORT_FILE%"
echo NCKH PROJECT DEBUG REPORT >> "%REPORT_FILE%"
echo ======================================== >> "%REPORT_FILE%"
echo. >> "%REPORT_FILE%"
echo Timestamp: %TIMESTAMP% >> "%REPORT_FILE%"
echo Computer: %COMPUTERNAME% >> "%REPORT_FILE%"
echo User: %USERNAME% >> "%REPORT_FILE%"
echo. >> "%REPORT_FILE%"

echo [1/8] Collecting system information...
echo ======================================== >> "%REPORT_FILE%"
echo SYSTEM INFORMATION >> "%REPORT_FILE%"
echo ======================================== >> "%REPORT_FILE%"

REM OS Version
echo OS Version: >> "%REPORT_FILE%"
ver >> "%REPORT_FILE%"
echo. >> "%REPORT_FILE%"

REM Java Version
echo Java Version: >> "%REPORT_FILE%"
java -version >> "%REPORT_FILE%" 2>&1
echo. >> "%REPORT_FILE%"

REM Node Version
echo Node.js Version: >> "%REPORT_FILE%"
node -v >> "%REPORT_FILE%" 2>&1
echo. >> "%REPORT_FILE%"

REM NPM Version
echo NPM Version: >> "%REPORT_FILE%"
npm -v >> "%REPORT_FILE%" 2>&1
echo. >> "%REPORT_FILE%"

echo [2/8] Checking service ports...
echo ======================================== >> "%REPORT_FILE%"
echo SERVICE PORT CHECK >> "%REPORT_FILE%"
echo ======================================== >> "%REPORT_FILE%"

REM Check ports
set PORTS=5173 3000 8080 8081 5432 3306 6379
for %%p in (%PORTS%) do (
    echo Checking port %%p... >> "%REPORT_FILE%"
    netstat -ano | findstr ":%%p " >> "%REPORT_FILE%" 2>&1
    if !errorlevel! neq 0 (
        echo Port %%p: NOT LISTENING >> "%REPORT_FILE%"
    )
    echo. >> "%REPORT_FILE%"
)

echo [3/8] Testing service connectivity...
echo ======================================== >> "%REPORT_FILE%"
echo SERVICE CONNECTIVITY TEST >> "%REPORT_FILE%"
echo ======================================== >> "%REPORT_FILE%"

REM Test services with curl if available
where curl >nul 2>&1
if !errorlevel! equ 0 (
    echo Testing Frontend (http://localhost:5173)... >> "%REPORT_FILE%"
    curl -s -o nul -w "Status: %%{http_code}\n" http://localhost:5173 >> "%REPORT_FILE%" 2>&1
    echo. >> "%REPORT_FILE%"

    echo Testing API Gateway (http://localhost:3000/api/auth/validate)... >> "%REPORT_FILE%"
    curl -s -o nul -w "Status: %%{http_code}\n" http://localhost:3000/api/auth/validate >> "%REPORT_FILE%" 2>&1
    echo. >> "%REPORT_FILE%"

    echo Testing Auth Service (http://localhost:8080/actuator/health)... >> "%REPORT_FILE%"
    curl -s -o nul -w "Status: %%{http_code}\n" http://localhost:8080/actuator/health >> "%REPORT_FILE%" 2>&1
    echo. >> "%REPORT_FILE%"

    echo Testing Product Service (http://localhost:8081/actuator/health)... >> "%REPORT_FILE%"
    curl -s -o nul -w "Status: %%{http_code}\n" http://localhost:8081/actuator/health >> "%REPORT_FILE%" 2>&1
    echo. >> "%REPORT_FILE%"
) else (
    echo cURL not available - skipping connectivity tests >> "%REPORT_FILE%"
    echo. >> "%REPORT_FILE%"
)

echo [4/8] Testing API endpoints...
echo ======================================== >> "%REPORT_FILE%"
echo API ENDPOINT TEST >> "%REPORT_FILE%"
echo ======================================== >> "%REPORT_FILE%"

REM Run API test if Node.js available
if exist "tests\test-api.js" (
    echo Running API endpoint tests... >> "%REPORT_FILE%"
    node tests\test-api.js >> "%REPORT_FILE%" 2>&1
    echo. >> "%REPORT_FILE%"
) else (
    echo tests\test-api.js not found - skipping API tests >> "%REPORT_FILE%"
    echo. >> "%REPORT_FILE%"
)

echo [5/8] Checking configuration files...
echo ======================================== >> "%REPORT_FILE%"
echo CONFIGURATION CHECK >> "%REPORT_FILE%"
echo ======================================== >> "%REPORT_FILE%"

REM Check axiosClient configuration
if exist "!PROJECT_DIR!\frontend\web-client\src\api\axiosClient.js" (
    echo axiosClient.js configuration: >> "%REPORT_FILE%"
    findstr "baseURL" "!PROJECT_DIR!\frontend\web-client\src\api\axiosClient.js" >> "%REPORT_FILE%" 2>&1
    echo. >> "%REPORT_FILE%"
) else (
    echo axiosClient.js not found >> "%REPORT_FILE%"
    echo. >> "%REPORT_FILE%"
)

REM Check API Gateway configuration
if exist "!PROJECT_DIR!\api-gateway\server.js" (
    echo API Gateway proxy configuration: >> "%REPORT_FILE%"
    findstr "PRODUCT_SERVICE_URL\|AUTH_SERVICE_URL" "!PROJECT_DIR!\api-gateway\server.js" >> "%REPORT_FILE%" 2>&1
    echo. >> "%REPORT_FILE%"
) else (
    echo server.js not found >> "%REPORT_FILE%"
    echo. >> "%REPORT_FILE%"
)

echo [6/8] Checking database connectivity...
echo ======================================== >> "%REPORT_FILE%"
echo DATABASE CONNECTIVITY >> "%REPORT_FILE%"
echo ======================================== >> "%REPORT_FILE%"

REM Check if PostgreSQL is accessible (basic check)
echo PostgreSQL connection test: >> "%REPORT_FILE%"
netstat -ano | findstr ":5432" >> "%REPORT_FILE%" 2>&1
echo. >> "%REPORT_FILE%"

REM Check if MySQL is accessible (basic check)
echo MySQL connection test: >> "%REPORT_FILE%"
netstat -ano | findstr ":3306" >> "%REPORT_FILE%" 2>&1
echo. >> "%REPORT_FILE%"

echo [7/8] Collecting recent logs...
echo ======================================== >> "%REPORT_FILE%"
echo RECENT LOGS >> "%REPORT_FILE%"
echo ======================================== >> "%REPORT_FILE%"

REM Check for log files
if exist "*.log" (
    echo Recent log files found: >> "%REPORT_FILE%"
    dir *.log /b /o-d >> "%REPORT_FILE%" 2>&1
    echo. >> "%REPORT_FILE%"
    echo Last 20 lines of most recent log: >> "%REPORT_FILE%"
    for /f %%i in ('dir *.log /b /o-d') do (
        echo === %%i === >> "%REPORT_FILE%"
        powershell "Get-Content %%i -Tail 20" >> "%REPORT_FILE%" 2>&1
        goto :logdone
    )
    :logdone
    echo. >> "%REPORT_FILE%"
) else (
    echo No log files found in current directory >> "%REPORT_FILE%"
    echo. >> "%REPORT_FILE%"
)

echo [8/8] Generating recommendations...
echo ======================================== >> "%REPORT_FILE%"
echo RECOMMENDATIONS >> "%REPORT_FILE%"
echo ======================================== >> "%REPORT_FILE%"

REM Analyze results and provide recommendations
echo Based on the collected data: >> "%REPORT_FILE%"
echo. >> "%REPORT_FILE%"

REM Check if all services are running
set MISSING_SERVICES=0
for %%p in (5173 3000 8080 8081) do (
    netstat -ano | findstr ":%%p " >nul 2>&1
    if !errorlevel! neq 0 (
        set /a MISSING_SERVICES+=1
    )
)

if %MISSING_SERVICES% gtr 0 (
    echo WARNING: %MISSING_SERVICES% critical services not running >> "%REPORT_FILE%"
    echo - Run verify-services.bat to check status >> "%REPORT_FILE%"
    echo - Run start-all-clean.bat to start all services >> "%REPORT_FILE%"
    echo. >> "%REPORT_FILE%"
) else (
    echo All critical services appear to be running >> "%REPORT_FILE%"
    echo. >> "%REPORT_FILE%"
)

echo General troubleshooting steps: >> "%REPORT_FILE%"
echo 1. Clear browser cache (Ctrl+Shift+R) >> "%REPORT_FILE%"
echo 2. Clear localStorage in browser DevTools >> "%REPORT_FILE%"
echo 3. Restart all services using start-all-clean.bat >> "%REPORT_FILE%"
echo 4. Check browser console for JavaScript errors >> "%REPORT_FILE%"
echo 5. Check Network tab for failed HTTP requests >> "%REPORT_FILE%"
echo. >> "%REPORT_FILE%"

echo For detailed troubleshooting, see DEBUG_GUIDE.md >> "%REPORT_FILE%"
echo. >> "%REPORT_FILE%"

echo ======================================== >> "%REPORT_FILE%"
echo END OF DEBUG REPORT >> "%REPORT_FILE%"
echo ======================================== >> "%REPORT_FILE%"

echo.
echo ========================================
echo   Debug Report Generated Successfully!
echo ========================================
echo.
echo Report saved to: %REPORT_FILE%
echo.
echo To view the report:
echo   notepad "%REPORT_FILE%"
echo.
echo For detailed troubleshooting guide:
echo   notepad DEBUG_GUIDE.md
echo.
echo Press any key to exit...
pause >nul
