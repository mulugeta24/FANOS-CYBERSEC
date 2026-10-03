# 🚀 START HERE FIRST!

## ⚡ Get Running in 3 Minutes

### Step 1: Setup (1 minute)
```bash
# Copy environment file
copy .env.example .env

# Edit .env - Add these:
TELEGRAM_BOT_TOKEN=your_token
ADMIN_PASSWORD=your_password
SECRET_KEY=random_string_here
```

### Step 2: Install (1 minute)
```bash
# Python
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt

# Frontend
cd frontend
npm install
cd ..
```

### Step 3: Start (1 command)
```bash
start.bat
```

---

## 🌐 Access Your System

### ✅ Web Dashboard (USE THIS!)
```
http://localhost:3000
```
**Login:** admin / (your password)

### ℹ️ API Server (Backend Only)
```
http://localhost:5000/api/health
```
**Note:** This is for API calls, not the web interface

---

## ⚠️ IMPORTANT

### Use the Correct URL!
- ✅ **Web Interface**: http://localhost:3000
- ❌ **NOT**: http://localhost:5000

### Both Must Be Running
The `start.bat` command opens 2 windows:
1. API Server (port 5000) - Backend
2. Frontend (port 3000) - Web Interface

**Keep both windows open!**

---

## 🎯 What to Do Next

1. Open http://localhost:3000
2. Login with your credentials
3. Go to "URL Analysis" page
4. Enter a URL and click "Analyze"
5. View results!

---

## 🐛 Having Issues?

### "Not Found" Error?
→ You're using the wrong URL!
→ Use: http://localhost:3000 (NOT 5000)

### Can't Login?
→ Check your password in .env file
→ Default is: admin / admin123

### Need More Help?
→ Read [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
→ Read [QUICK_START.md](QUICK_START.md)

---

## 📚 Documentation

- **[QUICK_START.md](QUICK_START.md)** - Quick guide
- **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** - Fix issues
- **[README.md](README.md)** - Full docs
- **[INDEX.md](INDEX.md)** - All documentation

---

## ✨ You're Ready!

```bash
start.bat
```

Then open: **http://localhost:3000**

**That's it! 🎉**
