@echo off
setlocal EnableDelayedExpansion

echo --- Starting Reset Script ---

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

REM --- Removing node_modules, package-lock.json, .next (if they exist) ---
echo --- Removing node_modules, package-lock.json, .next ---
powershell -Command "Remove-Item -Recurse -Force node_modules, .next -ErrorAction SilentlyContinue; Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue"
echo --- Removal finished ---

REM --- Cleaning npm cache ---
echo --- Cleaning npm cache ---
call npm cache clean --force
if !errorlevel! neq 0 (
    echo ERROR: npm cache clean failed!
    endlocal
    exit /b !errorlevel!
)
echo --- npm cache clean finished ---

REM --- Running npm install ---
echo --- Running npm install ---
call npm install
if !errorlevel! neq 0 (
    echo ERROR: npm install failed!
    endlocal
    exit /b !errorlevel!
)
echo --- npm install finished ---

REM --- Running code quality checks ---
echo --- Running code quality checks ---
node .\.wescore\scripts\check-quality.mjs %*
if !errorlevel! neq 0 (
    echo ERROR: Code quality checks failed! Not starting dev server.
    endlocal
    exit /b !errorlevel!
)
echo --- Code quality checks passed ---

REM --- Starting the application in development mode ---
echo --- Starting the application in development mode (Port: %DEV_PORT%) ---
call npm run dev %*

echo --- Development server stopped. Exit code: !errorlevel! ---
endlocal
exit /b !errorlevel!
