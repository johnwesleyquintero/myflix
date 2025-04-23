@echo off
setlocal EnableDelayedExpansion

echo --- Starting Local Deployment ---

REM --- Define the port your dev server runs on (default Next.js is 3000) ---
set DEV_PORT=3000

REM --- Kill existing process on the dev port ---
echo --- Attempting to find and kill any process listening on port %DEV_PORT% ---
set PID_FOUND=0

REM Use PowerShell to find and kill process on the specified port
for /f "delims=" %%a in ('powershell -Command "$ErrorActionPreference='SilentlyContinue'; try { $p = Get-NetTCPConnection -LocalPort %DEV_PORT% -State Listen | Select -Expand OwningProcess -First 1; if ($p) { Stop-Process -Id $p -Force -ErrorAction Stop; echo 1 } else { echo 0 } } catch { echo 0 }" 2^>nul') do set PID_FOUND=%%a

if !PID_FOUND! equ 1 (
    echo --- Found and killed process listening on port %DEV_PORT%. Waiting briefly... ---
    timeout /t 2 /nobreak > nul REM Added short delay for port release
) else (
    echo --- No process found listening on port %DEV_PORT% ---
)
echo --- Port check/kill finished ---

REM Ensure we are in the script's directory
cd %~dp0
echo --- Current directory: %cd% ---

REM --- Removing .next and other build artifacts ---
echo --- Cleaning build artifacts ---
echo --- PowerShell command: ---
powershell -File cleanup.ps1
echo }"
echo --- Cleanup finished ---

REM --- Building the project for production ---
echo --- Building project ---
call npm run build
echo --- Build finished with exit code: !errorlevel! ---
if !errorlevel! neq 0 (
    echo ERROR: Build failed with exit code !errorlevel! !
    exit /b !errorlevel!
)

REM --- Starting the application locally ---
echo --- Starting application ---
call npm run start %*

echo --- Application server stopped. Exit code: !errorlevel! ---
endlocal
exit /b !errorlevel!
