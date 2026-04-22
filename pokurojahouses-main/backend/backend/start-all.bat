@echo off
echo ================================
echo PokuRoja Houses - Startup Script
echo ================================
echo.
echo This will start both servers:
echo   1. Website (http://localhost:8000)
echo   2. Backend API (http://localhost:5000)
echo.
echo Press any key to continue...
pause

echo.
echo Starting Backend (Node.js)...
start cmd /k "cd /d "&"%~dp0backend"&" && npm start"

echo Waiting 3 seconds for backend to start...
timeout /t 3 /nobreak

echo.
echo Starting Website (Python)...
start cmd /k "cd /d "&"%~dp0"&" && python -m http.server 8000"

echo.
echo ================================
echo Both servers are starting!
echo ================================
echo.
echo Admin Panel:    http://localhost:5000/admin/login.html
echo Dashboard:      http://localhost:5000/admin/Dashboard.html
echo Website:        http://localhost:8000
echo.
echo Login with:
echo   Email:    admin@pokuroja.com
echo   Password: admin123
echo.
echo Press any key to close this window...
pause
