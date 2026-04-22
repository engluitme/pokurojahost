@echo off
echo ================================
echo PokuRoja Houses - Supabase Setup
echo ================================
echo.
echo Before running this script, please:
echo 1. Create a Supabase project at https://supabase.com
echo 2. Get your Project URL and API Key
echo.

setlocal enabledelayedexpansion

set /p SUPABASE_URL="Enter your Supabase Project URL (https://xxxxx.supabase.co): "
set /p SUPABASE_KEY="Enter your Anon Key: "
set /p SUPABASE_SERVICE_KEY="Enter your Service Role Key: "
set /p ADMIN_EMAIL="Enter your admin email: "
set /p ADMIN_PASSWORD="Enter your admin password: "

REM Generate a random JWT Secret (simplified - use an online generator for production)
setlocal enabledelayedexpansion
set "JWT_SECRET=change-this-to-a-random-string-of-at-least-32-chars"

REM Create .env file
(
echo SUPABASE_URL=%SUPABASE_URL%
echo SUPABASE_KEY=%SUPABASE_KEY%
echo SUPABASE_SERVICE_KEY=%SUPABASE_SERVICE_KEY%
echo JWT_SECRET=%JWT_SECRET%
echo ADMIN_EMAIL=%ADMIN_EMAIL%
echo ADMIN_PASSWORD=%ADMIN_PASSWORD%
echo PORT=5000
echo NODE_ENV=development
) > .env

echo.
echo [OK] .env file created successfully!
echo.
echo Next steps:
echo 1. Run the SQL queries from SUPABASE_SETUP.md in your Supabase dashboard
echo 2. Start your backend: npm start
echo 3. Open admin panel: http://localhost:5000/admin/login.html
echo.
pause
