# 🚀 Quick Start Guide

## ✅ System is Ready!

Your URL Detector system is now fully configured with:
- ✅ Telegram Bot with admin authentication
- ✅ React Web Frontend with modern UI
- ✅ API Backend with JWT authentication
- ✅ Real ML Model integration
- ✅ Real VirusTotal integration

---

## 🎯 Quick Start (3 Steps)

### Step 1: Start the API Server

**Option A: Double-click**
```
start_api.bat
```

**Option B: Command line**
```bash
cd api
python app.py
```

You should see:
```
✅ Server starting...
🤖 ML Model: LOADED
🛡️ VirusTotal: ENABLED
🔐 Authentication: ENABLED
* Running on http://127.0.0.1:5000
```

### Step 2: Start the React Frontend

**Option A: Double-click**
```
start_react.bat
```

**Option B: Command line**
```bash
cd frontend-react
npm install    # First time only
npm start
```

### Step 3: Open Web Application

The app will automatically open at:
```
http://localhost:3000
```

**Note:** For the old HTML version, see `web/` folder and use `start_web.bat`

---

## 🔐 Login Credentials

### Web Application
```
Username: admin
Password: admin123
```

### Telegram Bot
```
Send: /start admin123
```

---

## 📱 Using the System

### React Web Interface

1. **Login**
   - Open http://localhost:3000 (opens automatically)
   - Enter username: `admin`
   - Enter password: `admin123`
   - Click "Sign In"

2. **Scan a URL**
   - Enter URL in the scanner
   - Click "Scan URL"
   - Wait for results (ML + VirusTotal)
   - View detailed analysis

3. **Report Results**
   - Click "Report Result" button
   - Select correct category
   - Report saved to database

4. **View Statistics**
   - Click "Statistics" in navigation
   - View total scans
   - See detection counts
   - Check reports chart

5. **Admin Panel**
   - Click "Admin" in navigation
   - View system status
   - See recent reports
   - Clear statistics
   - Export data

### Telegram Bot

1. **Start Bot**
   ```bash
   python bot.py
   ```

2. **Authenticate**
   ```
   /start admin123
   ```

3. **Check URL**
   ```
   https://example.com
   ```
   or
   ```
   /check https://example.com
   ```

4. **View Stats**
   ```
   /stats
   ```

5. **Admin Panel**
   ```
   /admin
   ```

---

## 🔧 Configuration

### Change Admin Password

Edit `.env` file:
```env
ADMIN_PASSWORD=YourNewPassword
```

Restart API server.

### Add Your Telegram ID

1. Message @userinfobot on Telegram
2. Copy your user ID
3. Edit `.env`:
```env
ADMIN_USER_IDS=YOUR_TELEGRAM_ID
```

### Enable VirusTotal

Your VirusTotal API key is already configured!
```env
VT_API_KEY=d44ad00eb24358a67493d002ad6d248845dd796f4b75aa4599810d161bbe7e1f
```

---

## 📊 What's Working

✅ **API Server**: http://localhost:5000
- ML Model: LOADED
- VirusTotal: ENABLED
- Database: ACTIVE
- Authentication: ENABLED

✅ **React Frontend**: http://localhost:3000
- Modern React UI
- Login system
- URL scanner
- Statistics dashboard
- Admin panel
- Responsive design

✅ **Telegram Bot**
- Admin authentication
- URL scanning
- Reporting system
- Statistics

---

## 🧪 Test the System

### Test API (in browser or curl)

```bash
# Health check
http://localhost:5000/api/health

# Should return:
{
  "status": "healthy",
  "ml_model": true,
  "virustotal": true,
  "database": true
}
```

### Test React Web Login

1. Go to http://localhost:3000
2. Login with admin/admin123
3. Should see scanner page

### Test URL Scan

1. Enter: `https://google.com`
2. Click "Scan URL"
3. Should see:
   - Final Verdict
   - ML Prediction
   - VirusTotal Result

---

## 📁 Project Structure

```
main_zlast_tbot/
├── api/
│   └── app.py              # API server (RUNNING)
├── frontend-react/         # React frontend (NEW)
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   └── context/        # Auth context
│   └── package.json        # Dependencies
├── web/                    # Old HTML version
│   ├── index.html
│   └── js/app.js
├── bot.py                  # Telegram bot
├── ml_model.pkl            # ML model (LOADED)
├── label_encoder.pkl       # Encoder (LOADED)
├── bot_data.db             # Database (ACTIVE)
├── .env                    # Configuration
├── start_api.bat           # Quick start API
├── start_react.bat         # Quick start React (NEW)
├── start_web.bat           # Quick start old HTML
└── START_HERE.md           # This file
```

---

## 🆘 Troubleshooting

### API Won't Start

**Error**: "Module not found"
```bash
cd api
pip install Flask Flask-CORS PyJWT
```

**Error**: "ML model not found"
- Check `ml_model.pkl` exists in parent directory
- Verify file path in `api/app.py`

### Web Won't Load

**Error**: "Connection refused"
- Make sure API server is running
- Check http://localhost:5000/api/health

**Error**: "CORS error"
- Restart API server
- Clear browser cache

### Can't Login

**Error**: "Invalid credentials"
- Check `.env` file
- Default: admin/admin123
- Restart API server after changes

---

## 📞 Need Help?

1. Check `REACT_SETUP.md` for React frontend setup
2. Check `WEB_SETUP.md` for old HTML version
3. Check `ADMIN_SETUP.md` for admin configuration
4. Check `COMPLETE_SYSTEM_SUMMARY.md` for full overview
5. Review logs in terminal windows

---

## ✨ Next Steps

1. ✅ Change default passwords in `.env`
2. ✅ Add your Telegram user ID
3. ✅ Test URL scanning
4. ✅ Try reporting system
5. ✅ Explore admin panel
6. ✅ Check statistics dashboard

---

## 🎉 You're All Set!

Your complete URL detection system is ready to use with:
- Real ML predictions
- Real VirusTotal integration
- Admin authentication
- Web interface
- Telegram bot

**Everything uses real data - no demos!**

---

**Quick Links:**
- React App: http://localhost:3000 (NEW)
- Old Web App: http://localhost:8000
- API: http://localhost:5000
- Health Check: http://localhost:5000/api/health

**Default Login:**
- Username: admin
- Password: admin123

**Status:**
- 🤖 ML Model: LOADED ✅
- 🛡️ VirusTotal: ENABLED ✅
- 🔐 Authentication: ENABLED ✅
- 💾 Database: ACTIVE ✅

---

**Enjoy your URL Detector System! 🚀**
