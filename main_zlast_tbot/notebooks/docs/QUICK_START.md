# 🚀 Quick Start - 3 Simple Steps

## Step 1: Configure Environment (1 minute)

```bash
# Copy the example file
copy .env.example .env

# Edit .env and add your tokens
# Minimum required:
TELEGRAM_BOT_TOKEN=your_bot_token
ADMIN_PASSWORD=your_secure_password
SECRET_KEY=your_random_secret_key
```

## Step 2: Install Dependencies (2 minutes)

```bash
# Python dependencies
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt

# Frontend dependencies
cd frontend
npm install
cd ..
```

## Step 3: Start the System (1 command)

```bash
start.bat
```

This opens 2 windows:
- ✅ API Server (Backend)
- ✅ Frontend (Web Interface)

---

## 🌐 Access the System

### Web Dashboard (Main Interface)
```
http://localhost:3000
```
- Login with: `admin` / `your_password`
- This is where you manage everything

### API Server (Backend Only)
```
http://localhost:5000/api/health
```
- This is for API calls only
- Don't open this in browser for the UI

---

## ⚠️ Important URLs

| What | URL | Purpose |
|------|-----|---------|
| **Web Dashboard** | http://localhost:3000 | ✅ Use this for web interface |
| **API Health** | http://localhost:5000/api/health | ℹ️ Check if API is running |
| **API Docs** | http://localhost:5000/api/* | ℹ️ API endpoints only |

---

## 🎯 What to Do After Starting

### 1. Open Web Dashboard
```
http://localhost:3000
```

### 2. Login
- Username: `admin`
- Password: (from your .env file)

### 3. Try These Features

#### Dashboard
- View statistics
- See recent activity
- Monitor system health

#### URL Analysis
- Enter any URL
- Click "Analyze"
- Get instant results

#### Reports
- View user reports
- Export data
- Filter results

#### Statistics
- View charts
- Analyze trends
- Track performance

---

## 🤖 Telegram Bot (Optional)

### Start the Bot
```bash
# In a new terminal
venv\Scripts\activate
python bot.py
```

### Use the Bot
1. Find your bot on Telegram
2. Send `/start`
3. Send any URL to scan
4. Get instant results

---

## ✅ Verify Everything Works

### 1. Check API is Running
```bash
curl http://localhost:5000/api/health
```

Should return:
```json
{
  "status": "healthy",
  "ml_model": true,
  "virustotal": true,
  "database": true
}
```

### 2. Check Frontend is Running
- Open http://localhost:3000
- Should see login page
- No errors in browser console (F12)

### 3. Test Login
- Enter credentials
- Should redirect to dashboard
- Should see statistics

### 4. Test URL Scanning
- Go to "URL Analysis" page
- Enter: `https://google.com`
- Click "Analyze"
- Should see results

---

## 🐛 Common Issues

### "Not Found" Error
**Problem:** Accessing wrong URL
**Solution:** Use http://localhost:3000 (NOT 5000)

### Can't Login
**Problem:** Wrong credentials
**Solution:** Check ADMIN_PASSWORD in .env file

### API Not Responding
**Problem:** API server not running
**Solution:** 
```bash
venv\Scripts\activate
python api\app.py
```

### Frontend Not Loading
**Problem:** Frontend not running
**Solution:**
```bash
cd frontend
npm run dev
```

---

## 📱 System Architecture

```
┌─────────────────────────────────────────┐
│  Browser (http://localhost:3000)        │
│  ┌─────────────────────────────────┐   │
│  │   React Frontend (Port 3000)    │   │
│  │   - Login Page                  │   │
│  │   - Dashboard                   │   │
│  │   - URL Analysis                │   │
│  │   - Reports & Statistics        │   │
│  └─────────────────────────────────┘   │
└─────────────────┬───────────────────────┘
                  │ HTTP Requests
                  ↓
┌─────────────────────────────────────────┐
│  Flask API (http://localhost:5000)      │
│  ┌─────────────────────────────────┐   │
│  │   Backend API (Port 5000)       │   │
│  │   - Authentication              │   │
│  │   - URL Scanning                │   │
│  │   - Statistics                  │   │
│  │   - Database Operations         │   │
│  └─────────────────────────────────┘   │
└─────────────────┬───────────────────────┘
                  │
        ┌─────────┴─────────┐
        ↓                   ↓
┌──────────────┐    ┌──────────────┐
│  ML Model    │    │  VirusTotal  │
│  (Local)     │    │  API         │
└──────────────┘    └──────────────┘
```

---

## 🎓 Next Steps

### Learn More
- Read [README.md](README.md) for detailed info
- Check [docs/](docs/) folder for documentation
- Review [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for help

### Customize
- Change admin password in .env
- Add more users in API
- Customize frontend theme
- Train custom ML model

### Deploy
- Follow [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)
- Set up production server
- Enable HTTPS
- Configure monitoring

---

## 💡 Pro Tips

1. **Always start both API and Frontend**
   ```bash
   start.bat  # Starts both automatically
   ```

2. **Use the correct URL**
   - Web UI: http://localhost:3000 ✅
   - API: http://localhost:5000 (backend only)

3. **Check logs for errors**
   - API logs in API terminal
   - Frontend logs in browser console (F12)

4. **Keep terminals open**
   - Don't close the terminal windows
   - They show real-time logs

5. **Restart if needed**
   - Press Ctrl+C in terminals
   - Run `start.bat` again

---

## 🆘 Need Help?

### Quick Fixes
1. Restart everything: Close terminals, run `start.bat`
2. Check .env file is configured
3. Verify both services are running
4. Clear browser cache

### Documentation
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - Common issues
- [README.md](README.md) - Full documentation
- [START_HERE.md](START_HERE.md) - Detailed guide

### Verify Installation
```bash
# Check Python
python --version

# Check Node
node --version

# Check dependencies
venv\Scripts\activate
pip list

cd frontend
npm list --depth=0
```

---

## ✨ You're Ready!

The system is now running and ready to use:

1. ✅ API Server: http://localhost:5000
2. ✅ Web Dashboard: http://localhost:3000
3. ✅ Login: admin / your_password
4. ✅ Start scanning URLs!

**Happy scanning! 🎉**
