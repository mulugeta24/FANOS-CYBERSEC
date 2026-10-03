@echo off
echo ========================================
echo Starting Backend API Server
echo ========================================
echo.

cd backend
call ..\venv\Scripts\activate.bat
python app.py

pause

