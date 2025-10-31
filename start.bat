@echo off
echo ===================================
echo   Fitness Trainer App
echo ===================================
echo.

REM Kill existing processes
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul

echo [1/3] Starting backend server...
start "Backend Server" cmd /k "cd backend && npm run dev"

timeout /t 5 /nobreak >nul

echo [2/3] Starting frontend server...
start "Frontend Server" cmd /k "cd frontend && npm run dev"

timeout /t 10 /nobreak >nul

echo [3/3] Opening browser...
start http://localhost:3000

echo.
echo ===================================
echo   Servers started!
echo ===================================
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo.
pause

