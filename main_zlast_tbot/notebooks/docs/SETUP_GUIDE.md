# Quick Setup Guide - Restructured Project

## New Project Structure ✅

The project is now organized into clean, separate folders:

```
├── backend/        # Unified API server (Flask)
├── bot/            # Telegram bot
├── frontend/       # React web app
├── data/           # Database + ML models
└── docs/           # Documentation
```

## Quick Start

### 1. Install Dependencies

**Backend:**
```bash
cd backend
pip install -r requirements.txt
```

**Bot:**
```bash
cd bot
pip install -r requirements.txt
```

**Frontend:**
```bash
cd frontend
npm install
```

### 2. Configure Environment

The `.env` file in the root directory is shared by all components:

```env
# Telegram Bot
TELEGRAM_BOT_TOKEN=your_bot_token

# VirusTotal
VT_API_KEY=your_vt_api_key

# Admin
ADMIN_PASSWORD=admin123
ADMIN_USERNAME=admin

# Backend API
SECRET_KEY=your-secret-jwt-key
```

### 3. Start the System

**Option A: Start Everything**
```bash
start_all.bat
```

**Option B: Start Individual Services**
```bash
# Backend API
start_backend.bat

# Telegram Bot
start_bot.bat

# Frontend
cd frontend
npm run dev
```

## What Changed?

### Before (Old Structure)
```
├── api/            # Old API folder
├── bot.py          # Bot in root
├── database.py     # Database in root
├── ml_model.py     # ML in root
├── utils.py        # Utils in root
├── bot_data.db     # Database in root
├── ml_model.pkl    # Model in root
└── frontend/       # Frontend
```

### After (New Structure)
```
├── backend/
│   ├── core/
│   │   ├── database.py      # Moved from root
│   │   └── ml_detector.py   # Moved from ml_model.py
│   ├── services/
│   │   └── virustotal.py    # Moved from utils.py
│   └── app.py               # Moved from api/app.py
├── bot/
│   └── telegram_bot.py      # Moved from bot.py
├── frontend/                # Same, but updated imports
├── data/
│   ├── database/
│   │   └── bot_data.db      # Moved from root
│   └── models/
│       ├── ml_model.pkl     # Moved from root
│       └── label_encoder.pkl # Moved from root
└── docs/                    # Same
```

## Key Improvements

### 1. Unified Backend ✅
- Single API server for both frontend and bot
- Located in `backend/app.py`
- Port: 5000

### 2. Shared Database ✅
- Single database: `data/database/bot_data.db`
- Used by both backend API and Telegram bot
- Consistent data across all interfaces

### 3. Centralized ML Models ✅
- Models in `data/models/`
- Shared by backend and bot
- Easy to update and maintain

### 4. Clean Organization ✅
- Each component in its own folder
- Clear separation of concerns
- Easy to navigate and maintain

## Access Points

### Web Frontend
- URL: http://localhost:3002 (or check terminal)
- Login: admin / admin123
- Features: Dashboard, Reports, Statistics, URL Analysis

### Backend API
- URL: http://localhost:5000
- Endpoints: `/api/scan`, `/api/stats`, `/api/admin/*`
- Authentication: JWT tokens

### Telegram Bot
- Start: `/start`
- Check URL: Just paste any URL
- Admin: `/adminsec admin123`

## Database Location

**New Location:** `data/database/bot_data.db`

This database is shared by:
- Backend API (for web frontend)
- Telegram Bot

Both components read and write to the same database, ensuring data consistency.

## ML Models Location

**New Location:** `data/models/`

Files:
- `ml_model.pkl` - Trained ML model
- `label_encoder.pkl` - Label encoder

Both backend and bot load models from this location.

## File Mapping

### Old → New Locations

| Old Location | New Location |
|-------------|--------------|
| `api/app.py` | `backend/app.py` |
| `bot.py` | `bot/telegram_bot.py` |
| `database.py` | `backend/core/database.py` |
| `ml_model.py` | `backend/core/ml_detector.py` |
| `utils.py` | `backend/services/virustotal.py` |
| `bot_data.db` | `data/database/bot_data.db` |
| `ml_model.pkl` | `data/models/ml_model.pkl` |
| `label_encoder.pkl` | `data/models/label_encoder.pkl` |

## Testing

### Test Backend
```bash
cd backend
python app.py
```

Should show:
```
✅ ML Model loaded successfully
✅ Database initialized
✅ Server starting...
```

### Test Bot
```bash
cd bot
python telegram_bot.py
```

Should show:
```
✅ ML Model loaded successfully
✅ Bot is running...
```

### Test Frontend
```bash
cd frontend
npm run dev
```

Should show:
```
VITE ready in XXX ms
Local: http://localhost:3002
```

## Troubleshooting

### "Module not found" errors
- Make sure you're in the correct directory
- Check that dependencies are installed
- Verify Python path includes backend folder

### Database not found
- Check `data/database/` folder exists
- Run backend or bot once to create database
- Verify file permissions

### ML model not loading
- Check `data/models/` folder exists
- Verify `ml_model.pkl` and `label_encoder.pkl` are present
- Check file paths in code

### Frontend can't connect to API
- Verify backend is running on port 5000
- Check CORS configuration
- Clear browser cache

## Next Steps

1. ✅ Start all services with `start_all.bat`
2. ✅ Access web frontend at http://localhost:3002
3. ✅ Login with admin / admin123
4. ✅ Test URL scanning
5. ✅ Check Telegram bot
6. ✅ View reports and statistics

## Benefits of New Structure

### For Development
- Easier to find files
- Clear module boundaries
- Better code organization
- Simpler imports

### For Deployment
- Each component can be deployed separately
- Easier to scale individual services
- Better resource management
- Clearer dependencies

### For Maintenance
- Easier to update components
- Clear separation of concerns
- Better testing isolation
- Simpler debugging

## Documentation

Full documentation available in:
- `PROJECT_STRUCTURE.md` - Detailed structure
- `docs/` - Complete documentation
- `README.md` - Main README

## Support

If you encounter issues:
1. Check this guide
2. Review `PROJECT_STRUCTURE.md`
3. Check logs in terminal
4. Verify `.env` configuration

---

**The project is now fully restructured and ready to use!** 🎉
