# 🚀 Quick Start Guide

Welcome to the Malicious URL Detector System! This guide will get you up and running in minutes.

## ⚡ Fast Setup (5 Minutes)

### Step 1: Configure Environment

1. Copy the example environment file:
```bash
copy .env.example .env
```

2. Edit `.env` and add your credentials:
```
TELEGRAM_BOT_TOKEN=your_bot_token_here
VT_API_KEY=your_virustotal_key_here
SECRET_KEY=change-this-to-random-string
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

### Step 2: Install Dependencies

**Python (Backend):**
```bash
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

**Node.js (Frontend):**
```bash
cd frontend
npm install
cd ..
```

### Step 3: Start the System

Simply run:
```bash
start.bat
```

This opens two windows:
- **API Server** (http://localhost:5000)
- **Frontend Dashboard** (http://localhost:3000)

### Step 4: Access the Dashboard

1. Open your browser to http://localhost:3000
2. Login with:
   - Username: `admin`
   - Password: `admin123`

## 🎯 What You Can Do

### Admin Dashboard (Web)
- View real-time statistics
- Analyze URLs manually
- Review user reports
- Export data
- Monitor system health

### Telegram Bot
1. Find your bot on Telegram
2. Send `/start`
3. Send any URL to scan it
4. Get instant results with ML + VirusTotal analysis

## 📁 Project Structure

```
url-detector/
├── api/              # Backend API server
├── frontend/         # React admin dashboard
├── data/            # Training datasets
├── docs/            # Full documentation
├── bot.py           # Telegram bot
├── ml_model.py      # ML detection engine
├── database.py      # Database operations
└── start.bat        # Quick start script
```

## 🔧 Common Tasks

### Start Individual Components

**API Server Only:**
```bash
venv\Scripts\activate
python api\app.py
```

**Frontend Only:**
```bash
cd frontend
npm run dev
```

**Telegram Bot Only:**
```bash
venv\Scripts\activate
python bot.py
```

### Check System Health

Visit: http://localhost:5000/api/health

Should return:
```json
{
  "status": "healthy",
  "ml_model": true,
  "virustotal": true,
  "database": true
}
```

## 🐛 Troubleshooting

### Port Already in Use
- API (5000): Change in `api/app.py`
- Frontend (3000): Change in `frontend/vite.config.js`

### ML Model Not Loading
```bash
python train_urls_multiclass.py
```

### Frontend Can't Connect to API
1. Check API server is running (http://localhost:5000/api/health)
2. Check CORS settings in `api/app.py`
3. Clear browser cache

### Telegram Bot Not Responding
1. Verify bot token in `.env`
2. Check bot is running
3. Send `/start` to initialize

## 📚 Next Steps

1. **Read the Documentation**: Check `docs/` folder for detailed guides
2. **Customize Settings**: Modify `.env` for your needs
3. **Train Custom Model**: Use your own dataset with `train_urls_multiclass.py`
4. **Deploy**: See `docs/08_DEPLOYMENT.md` for production setup

## 🔐 Security Notes

- Change default admin password immediately
- Keep `.env` file secure (never commit to git)
- Use strong SECRET_KEY in production
- Enable HTTPS for production deployment

## 💡 Tips

- Use `/stats` in Telegram bot to check system statistics
- Export data regularly from admin dashboard
- Monitor the Reports page for false positives
- Check logs in terminal windows for debugging

## 🆘 Need Help?

1. Check `README.md` for detailed information
2. Review documentation in `docs/` folder
3. Look at API reference: `docs/07_API_REFERENCE.md`
4. Check system architecture: `docs/10_ARCHITECTURE.md`

## ✅ Verification Checklist

- [ ] Environment variables configured
- [ ] Python dependencies installed
- [ ] Frontend dependencies installed
- [ ] API server starts successfully
- [ ] Frontend loads at http://localhost:3000
- [ ] Can login to admin dashboard
- [ ] Health check returns "healthy"
- [ ] Telegram bot responds to messages

---

**Ready to go!** 🎉 Start scanning URLs and keeping the internet safer!
