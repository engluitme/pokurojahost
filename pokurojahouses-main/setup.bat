@echo off
echo Installing dependencies...
npm install

echo.
echo ========================================
echo PokuRoja Backend Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Create a Supabase project at https://supabase.com
echo 2. Copy .env.example to .env
echo 3. Fill in your Supabase credentials in .env
echo 4. Run the SQL from the README.md in Supabase
echo 5. Run "npm start" to start the server
echo.
echo Admin Panel: http://localhost:5000/admin
echo.
pause
