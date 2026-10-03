@echo off
echo ========================================
echo Restarting Telegram Bot with Fix
echo ========================================
echo.

echo The bot has been fixed!
echo.
echo Changes:
echo - Fixed ML model feature extraction (17 features)
echo - Enhanced error handling
echo - Added fallback to VirusTotal only
echo.
echo Starting bot...
echo.

cd bot
call ..\venv\Scripts\activate.bat
python telegram_bot.py

pause

