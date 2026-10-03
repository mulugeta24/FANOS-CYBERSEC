# 🚀 Start System Guide

## Pre-Flight Check ✅

Run this first to verify everything is ready:
```bash
python test_all_components.py
```

Expected output: `✅ ALL TESTS PASSED!`

## Starting the System

### Option 1: Start Everything (Recommended)

```bash
start_all.bat
```

This will open 3 terminal windows:
1. **Backend API** - Flask server on port 5000
2. **Telegram Bot** - Bot service
3. **Frontend** - React dev server on port 3002

### Option 2: Start Components Individually

**Terminal 1 - Backend:**
```bash
start_backend.bat
```
Or manually:
```bash
cd backend
python app.py
```

**Terminal 2 - Bot:**
```bash
start_bot.bat
```
Or manually:
```bash
cd bot
python telegram_bot.py
```

**Terminal 3 - Frontend:**
```bash
cd frontend
npm run dev
```

## Verification Steps

### 1. Check Backend (Port 5000)

**Expected Output:**
```
============================================================
🌐 URL Detector - Unified Backend API
============================================================
✅ Server starting...
🤖 ML Model: LOADED
🛡️ VirusTotal: ENABLED
🔐 Authentication: ENABLED
📊 Serving: Web Frontend + Telegram Bot
============================================================
 * Running on http://0.0.0.0:5000
```

**Test Backend:**
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "ml_model": true,
  "virustotal": true,
  "database": true
}
```

### 2. Check Telegram Bot

**Expected Output:**
```
============================================================
🤖 URL Detector - Telegram Bot
============================================================
✅ Bot is running...
🤖 ML Model: ✅ LOADED
🛡️ VirusTotal: ✅ ENABLED
📊 Using unified backend database
============================================================
```

**Test Bot:**
1. Open Telegram
2. Find your bot
3. Send: `/start`
4. Expected: Welcome message with commands

### 3. Check Frontend (Port 3002)

**Expected Output:**
```
VITE v5.x.x ready in XXX ms

➜  Local:   http://localhost:3002/
➜  Network: use --host to expose
```

**Test Frontend:**
1. Open browser: http://localhost:3002
2. Should see login page
3. Login: admin / admin123
4. Should redirect to dashboard

## Testing Each Component

### Backend API Tests

**1. Health Check:**
```bash
curl http://localhost:5000/api/health
```

**2. Login Test:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"admin\",\"password\":\"admin123\"}"
```

Expected: JWT token in response

**3. Stats Test (requires token):**
```bash
# First get token from login
TOKEN="your_token_here"

curl http://localhost:5000/api/stats \
  -H "Authorization: Bearer $TOKEN"
```

### Telegram Bot Tests

**Basic Commands:**
1. `/start` - Should show welcome message
2. `/help` - Should show command list
3. `/stats` - Should show statistics
4. Paste any URL - Should analyze it

**Admin Commands:**
1. `/adminsec admin123` - Should authenticate as admin
2. `/admin` - Should show admin panel
3. `/systeminfo` - Should show system info

### Frontend Tests

**1. Login Page:**
- Navigate to http://localhost:3002
- Should see login form
- Enter: admin / admin123
- Should redirect to dashboard

**2. Dashboard:**
- Should see 4 stat cards
- Should see charts
- Numbers should be real (not demo data)

**3. URL Scanner:**
- Click "URL Analysis" in sidebar
- Enter a URL (e.g., https://google.com)
- Click "Scan URL"
- Should see results with ML and VT verdicts

**4. Reports Page:**
- Click "Reports" in sidebar
- Should see table of scanned URLs
- Try search functionality
- Try export to CSV

**5. Statistics Page:**
- Click "Statistics" in sidebar
- Should see charts with real data
- Should see category distribution
- Should see detection rates

## Common Issues & Solutions

### Backend Issues

**Issue:** Port 5000 already in use
```bash
# Windows: Find and kill process
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

**Issue:** ML model not loading
- Check `data/models/ml_model.pkl` exists
- Check `data/models/label_encoder.pkl` exists
- Verify file permissions

**Issue:** Database error
- Check `data/database/` folder exists
- Will be created automatically on first run
- Check write permissions

### Bot Issues

**Issue:** Bot not responding
- Check `TELEGRAM_BOT_TOKEN` in .env
- Verify token is correct
- Check bot is running in terminal

**Issue:** Admin commands not working
- Check `ADMIN_PASSWORD` in .env
- Use `/adminsec <password>` first
- Verify authentication successful

### Frontend Issues

**Issue:** White screen
- Clear browser cache (Ctrl+Shift+Delete)
- Hard refresh (Ctrl+F5)
- Check browser console (F12) for errors
- Verify backend is running

**Issue:** Can't login
- Check backend is running on port 5000
- Verify credentials: admin / admin123
- Check browser console for errors
- Check backend logs

**Issue:** No data showing
- Scan some URLs first
- Check backend is connected
- Verify database has data
- Check API responses in Network tab (F12)

## Stopping the System

### Stop All Services

**Windows:**
- Close all terminal windows
- Or press Ctrl+C in each terminal

### Stop Individual Services

**Backend:**
- Press Ctrl+C in backend terminal

**Bot:**
- Press Ctrl+C in bot terminal

**Frontend:**
- Press Ctrl+C in frontend terminal

## Restart After Changes

### Backend Changes
```bash
# Stop backend (Ctrl+C)
# Restart
cd backend
python app.py
```

### Bot Changes
```bash
# Stop bot (Ctrl+C)
# Restart
cd bot
python telegram_bot.py
```

### Frontend Changes
```bash
# Usually auto-reloads
# If not, stop (Ctrl+C) and restart
cd frontend
npm run dev
```

## Monitoring

### Check Logs

**Backend:**
- Watch terminal for API requests
- Look for errors or warnings

**Bot:**
- Watch terminal for bot activity
- Check for connection issues

**Frontend:**
- Check browser console (F12)
- Look for network errors

### Database

**View Database:**
```bash
# Install SQLite browser or use command line
sqlite3 data/database/bot_data.db

# View tables
.tables

# View stats
SELECT * FROM stats;

# View reports
SELECT * FROM reports LIMIT 10;

# Exit
.quit
```

## Performance Tips

### Backend
- ML model loads once at startup
- VirusTotal results are cached
- Database uses connection pooling

### Bot
- Handles multiple users concurrently
- Caches recent checks
- Admin features are optimized

### Frontend
- React dev server has hot reload
- Production build is optimized
- API calls are cached

## Production Deployment

For production deployment, see:
- [docs/08_DEPLOYMENT.md](docs/08_DEPLOYMENT.md)
- [docs/DEPLOYMENT_CHECKLIST.md](docs/DEPLOYMENT_CHECKLIST.md)

## Quick Command Reference

```bash
# Test everything
python test_all_components.py

# Start all
start_all.bat

# Start individual
start_backend.bat
start_bot.bat
cd frontend && npm run dev

# Test backend
curl http://localhost:5000/api/health

# Access frontend
# Open: http://localhost:3002
# Login: admin / admin123
```

## Success Checklist

- [ ] All tests pass (`python test_all_components.py`)
- [ ] Backend starts without errors
- [ ] Bot connects successfully
- [ ] Frontend loads in browser
- [ ] Can login to web interface
- [ ] Can scan URLs
- [ ] Reports page shows data
- [ ] Statistics page shows charts
- [ ] Telegram bot responds to commands
- [ ] Database updates correctly

## Next Steps

Once everything is running:

1. ✅ Test URL scanning in web interface
2. ✅ Test URL scanning in Telegram bot
3. ✅ Check reports are being saved
4. ✅ Verify statistics are updating
5. ✅ Test admin features
6. ✅ Review documentation

## Support

If you encounter issues:
1. Check this guide
2. Review [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)
3. Run `python test_all_components.py`
4. Check logs in terminals

---

**Everything is ready! Start the system and enjoy!** 🎉
