@echo off
echo ========================================
echo Starting Telegram Bot
echo ========================================
echo.

cd bot
call ..\venv\Scripts\activate.bat
python telegram_bot.py

pause
