@echo off
REM NCKH Project - Complete Debug Suite Runner
REM Runs all debug tools and generates comprehensive report

echo ========================================
echo NCKH PROJECT - COMPLETE DEBUG SUITE
echo ========================================
echo.

REM Set PROJECT_DIR to parent of scripts folder
set PROJECT_DIR=%~dp0..

REM Create timestamp for reports
set TIMESTAMP=%DATE:~10,4%%DATE:~4,2%%DATE:~7,2%_%TIME:~0,2%%TIME:~3,2%%TIME:~6,2%
set TIMESTAMP=%TIMESTAMP: =0%

echo [%TIME%] Starting complete debug suite...
echo Report timestamp: %TIMESTAMP%
echo.

REM Step 1: Run automated debug report
echo ========================================
echo STEP 1: Running automated debug report
echo ========================================
if exist "!PROJECT_DIR!\scripts\generate-debug-report.bat" (
    call "!PROJECT_DIR!\scripts\generate-debug-report.bat"
    echo.
) else (
    echo - generate-debug-report.bat not found!
    echo.
)

REM Step 2: Run flow test
echo ========================================
echo STEP 2: Running flow test
echo ========================================
if exist "!PROJECT_DIR!\tests\test-flow.js" (
    echo Running Node.js flow test...
    node "!PROJECT_DIR!\tests\test-flow.js"
    echo.
) else (
    echo ⚠ tests\test-flow.js not found (optional)!
    echo.
)

REM Step 3: Check for additional test files
echo ========================================
echo STEP 3: Running additional tests
echo ========================================

REM Backend API tests
if exist "!PROJECT_DIR!\tests\test_backend.js" (
    echo Running backend API tests...
    node "!PROJECT_DIR!\tests\test_backend.js"
    echo.
)

REM Register API tests
if exist "!PROJECT_DIR!\tests\test_register.js" (
    echo Running register API tests...
    node "!PROJECT_DIR!\tests\test_register.js"
    echo.
)

REM Login flow tests
if exist "!PROJECT_DIR!\tests\test-login-flow.js" (
    echo Running login flow tests...
    node "!PROJECT_DIR!\tests\test-login-flow.js"
    echo.
)

REM API tests
if exist "!PROJECT_DIR!\tests\test-api.js" (
    echo Running general API tests...
    node "!PROJECT_DIR!\tests\test-api.js"
    echo.
)

REM Step 4: Generate summary report
echo ========================================
echo STEP 4: Generating summary report
echo ========================================

echo Creating comprehensive summary report...
echo.

REM Create summary file
set SUMMARY_FILE=debug-suite-report-%TIMESTAMP%.txt
echo ======================================== > "%SUMMARY_FILE%"
echo NCKH PROJECT - DEBUG SUITE SUMMARY >> "%SUMMARY_FILE%"
echo ======================================== >> "%SUMMARY_FILE%"
echo Timestamp: %TIMESTAMP% >> "%SUMMARY_FILE%"
echo Generated: %DATE% %TIME% >> "%SUMMARY_FILE%"
echo. >> "%SUMMARY_FILE%"

echo DEBUG REPORTS GENERATED: >> "%SUMMARY_FILE%"
echo ======================= >> "%SUMMARY_FILE%"

REM Check for generated files
if exist debug-report-*.txt (
    for %%f in (debug-report-*.txt) do (
        echo - %%~nf >> "%SUMMARY_FILE%"
    )
) else (
    echo - No debug reports found >> "%SUMMARY_FILE%"
)

if exist flow-test-summary.txt (
    echo - flow-test-summary.txt >> "%SUMMARY_FILE%"
)

if exist flow-test-report.json (
    echo - flow-test-report.json >> "%SUMMARY_FILE%"
)

echo. >> "%SUMMARY_FILE%"
echo QUICK STATUS CHECK: >> "%SUMMARY_FILE%"
echo ================== >> "%SUMMARY_FILE%"

REM Quick port check
echo Checking service ports... >> "%SUMMARY_FILE%"
for %%p in (5173 3000 8080 8081 5432 3306 6379) do (
    netstat -an | find "%%p" >nul 2>&1
    if errorlevel 1 (
        echo - Port %%p: NOT LISTENING >> "%SUMMARY_FILE%"
    ) else (
        echo - Port %%p: LISTENING >> "%SUMMARY_FILE%"
    )
)

echo. >> "%SUMMARY_FILE%"
echo TROUBLESHOOTING GUIDE: >> "%SUMMARY_FILE%"
echo ===================== >> "%SUMMARY_FILE%"
echo If you see failures above, check: >> "%SUMMARY_FILE%"
echo 1. guides/DEBUG_GUIDE.md for detailed troubleshooting >> "%SUMMARY_FILE%"
echo 2. Individual test reports for specific errors >> "%SUMMARY_FILE%"
echo 3. Service logs in backend/ and api-gateway/ folders >> "%SUMMARY_FILE%"
echo 4. Database connectivity (PostgreSQL/MySQL) >> "%SUMMARY_FILE%"
echo. >> "%SUMMARY_FILE%"
echo For quick fixes, try: >> "%SUMMARY_FILE%"
echo - scripts/start-project.bat (start all services) >> "%SUMMARY_FILE%"
echo - scripts/verify-services.bat (check service status) >> "%SUMMARY_FILE%"
echo - tests/test-login.bat (test authentication) >> "%SUMMARY_FILE%"
echo. >> "%SUMMARY_FILE%"
echo ======================================== >> "%SUMMARY_FILE%"

echo Summary report saved: %SUMMARY_FILE%
echo.

REM Step 5: Display results
echo ========================================
echo DEBUG SUITE COMPLETED
echo ========================================
echo.

echo Generated reports:
if exist debug-report-*.txt (
    for %%f in (debug-report-*.txt) do echo   - %%~nf
)
if exist flow-test-summary.txt echo   - flow-test-summary.txt
if exist flow-test-report.json echo   - flow-test-report.json
echo   - %SUMMARY_FILE%
echo.

echo Next steps:
echo 1. Review the summary report: %SUMMARY_FILE%
echo 2. Check individual test reports for details
echo 3. Follow DEBUG_GUIDE.md for troubleshooting
echo 4. Use start-project.bat to restart services if needed
echo.

echo ========================================
echo END OF DEBUG SUITE
echo ========================================