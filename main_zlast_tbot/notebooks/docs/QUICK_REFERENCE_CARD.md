# 🚀 Quick Reference Card

## One-Page Guide to Your Restructured Project

### 📁 Structure
```
backend/    → Unified API server
bot/        → Telegram bot
frontend/   → React web app
data/       → Database + ML models
docs/       → Documentation
```

### ⚡ Quick Start
```bash
start_all.bat
```

### 🌐 Access
- **Web:** http://localhost:3002
- **API:** http://localhost:5000
- **Login:** admin / admin123

### 📝 Key Commands

**Start Services:**
```bash
start_all.bat          # All services
start_backend.bat      # Backend only
start_bot.bat          # Bot only
```

**Verify Setup:**
```bash
python verify_structure.py
```

**Install Dependencies:**
```bash
cd backend && pip install -r requirements.txt
cd bot && pip install -r requirements.txt
cd frontend && npm install
```

### 📂 Important Files

| Component | Main File | Port |
|-----------|-----------|------|
| Backend | `backend/app.py` | 5000 |
| Bot | `bot/telegram_bot.py` | - |
| Frontend | `frontend/src/App.jsx` | 3002 |
| Database | `data/database/bot_data.db` | - |
| ML Model | `data/models/ml_model.pkl` | - |

### 🔧 Configuration

**File:** `.env`
```env
TELEGRAM_BOT_TOKEN=your_token
VT_API_KEY=your_key
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
SECRET_KEY=your-secret-key
```

### 📖 Documentation

| Need | Read |
|------|------|
| Setup | [SETUP_GUIDE.md](SETUP_GUIDE.md) |
| Structure | [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) |
| All Docs | [INDEX.md](INDEX.md) |
| Migration | [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md) |
| Troubleshooting | [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md) |

### 🤖 Bot Commands

```
/start              - Start bot
/check <url>        - Check URL
/stats              - View statistics
/report             - Report result
/adminsec <pass>    - Admin auth
/admin              - Admin panel
```

### 🌐 API Endpoints

```
POST /api/auth/login      - Login
POST /api/scan            - Scan URL
GET  /api/stats           - Statistics
GET  /api/admin/status    - Admin status
POST /api/admin/clear     - Clear stats
GET  /api/admin/export    - Export data
GET  /api/health          - Health check
```

### 🗄️ Database

**Location:** `data/database/bot_data.db`

**Tables:**
- `vt_cache` - VirusTotal cache
- `stats` - Statistics
- `reports` - Scan reports

### 🧠 ML Models

**Location:** `data/models/`

**Files:**
- `ml_model.pkl` - Trained model
- `label_encoder.pkl` - Label encoder

### 🔍 Troubleshooting

**Issue:** Module not found
**Fix:** Check you're in correct directory

**Issue:** Database not found
**Fix:** Run backend once to create it

**Issue:** ML model error
**Fix:** Check models in `data/models/`

**Issue:** Port in use
**Fix:** Stop other services or change port

### ✅ Verification Checklist

```bash
python verify_structure.py
```

Should show:
- ✅ Backend structure
- ✅ Bot structure
- ✅ Frontend structure
- ✅ Data structure
- ✅ Documentation
- ✅ Configuration
- ✅ Start scripts

### 🎯 Common Tasks

**Add new API endpoint:**
1. Edit `backend/app.py`
2. Add route function
3. Test with Postman/curl

**Update frontend:**
1. Edit files in `frontend/src/`
2. Restart dev server
3. Clear browser cache

**Modify bot:**
1. Edit `bot/telegram_bot.py`
2. Restart bot
3. Test commands

**Update ML model:**
1. Train new model
2. Save to `data/models/`
3. Restart services

### 📊 Project Stats

- **Components:** 3 (Backend, Bot, Frontend)
- **Database:** 1 shared SQLite
- **ML Models:** 2 files
- **Documentation:** 10+ files
- **Start Scripts:** 3

### 🎓 Learning Path

1. Read [SETUP_GUIDE.md](SETUP_GUIDE.md)
2. Run `start_all.bat`
3. Test web interface
4. Test Telegram bot
5. Review [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)
6. Explore code

### 💡 Pro Tips

- Use `verify_structure.py` before starting
- Check logs for errors
- Clear browser cache if frontend issues
- Restart services after code changes
- Read docs before asking questions

### 🆘 Quick Help

**Can't start backend?**
→ Check Python installed, dependencies installed

**Can't start frontend?**
→ Check Node.js installed, npm install run

**Can't login?**
→ Check credentials: admin / admin123

**Bot not responding?**
→ Check token in .env, bot running

**Database errors?**
→ Check `data/database/` exists, permissions OK

### 📞 Support Resources

- [INDEX.md](INDEX.md) - All documentation
- [SETUP_GUIDE.md](SETUP_GUIDE.md) - Setup help
- [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md) - Common issues
- [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md) - Migration help

### 🎉 Success Indicators

✅ `verify_structure.py` passes
✅ Backend starts without errors
✅ Bot connects successfully
✅ Frontend loads in browser
✅ Can login to web interface
✅ Can scan URLs
✅ Database updates correctly

---

**Keep this card handy for quick reference!** 📌

**Version:** 2.0.0 | **Date:** Feb 20, 2026 | **Status:** ✅ Ready
