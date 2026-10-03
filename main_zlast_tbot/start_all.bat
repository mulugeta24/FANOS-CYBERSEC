@echo off
echo ========================================
echo URL Detector System - Starting All Services
echo ========================================
echo.

set PYTHONUTF8=1
set PYTHONIOENCODING=utf-8

REM Check if PostgreSQL is responding on 5432, if not start local instance
netstat -ano | findstr ":5432 " >nul
if %ERRORLEVEL% NEQ 0 (
    echo Starting PostgreSQL 18 Server on port 5432...
    start "PostgreSQL Server" /MIN cmd /c "if exist ""C:\Program Files\PostgreSQL\18\bin\postgres.exe"" ""C:\Program Files\PostgreSQL\18\bin\postgres.exe"" -D ""%~dp0data\postgres_data"""
    ping -n 3 127.0.0.1 >nul
)

echo Starting Backend API Server...
start "Backend API" cmd /k "cd /d %~dp0backend && call ..\venv\Scripts\activate.bat && python app.py"

ping -n 4 127.0.0.1 >nul

echo Starting Telegram Bot...
start "Telegram Bot" cmd /k "cd /d %~dp0bot && call ..\venv\Scripts\activate.bat && python telegram_bot.py"

ping -n 3 127.0.0.1 >nul

echo Starting Frontend Development Server...
start "Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo ========================================
echo All Services Started!
echo ========================================
echo Backend API: http://localhost:5000
echo Frontend: http://localhost:3002 (check terminal)
echo Telegram Bot: Running
echo.
echo Database: PostgreSQL (urldb)
echo ML Models: data/models/
echo.
echo You can close this window at any time; the services will keep running.
pause



