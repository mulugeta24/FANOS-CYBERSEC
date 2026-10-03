# Migration Guide - Old to New Structure

## Overview

This guide helps you understand the changes from the old structure to the new restructured project.

## Quick Comparison

### Old Structure
```
project/
├── api/
│   └── app.py
├── bot.py
├── database.py
├── ml_model.py
├── utils.py
├── bot_data.db
├── ml_model.pkl
├── label_encoder.pkl
└── frontend/
```

### New Structure
```
project/
├── backend/
│   ├── core/
│   │   ├── database.py
│   │   └── ml_detector.py
│   ├── services/
│   │   └── virustotal.py
│   └── app.py
├── bot/
│   └── telegram_bot.py
├── data/
│   ├── database/
│   │   └── bot_data.db
│   └── models/
│       ├── ml_model.pkl
│       └── label_encoder.pkl
└── frontend/
```

## File Mapping

### Python Files

| Old Location | New Location | Changes |
|-------------|--------------|---------|
| `api/app.py` | `backend/app.py` | Updated imports |
| `database.py` | `backend/core/database.py` | Updated DB path |
| `ml_model.py` | `backend/core/ml_detector.py` | Renamed class, updated paths |
| `utils.py` (VT functions) | `backend/services/virustotal.py` | Extracted VT functions |
| `bot.py` | `bot/telegram_bot.py` | Updated imports |

### Data Files

| Old Location | New Location |
|-------------|--------------|
| `bot_data.db` | `data/database/bot_data.db` |
| `ml_model.pkl` | `data/models/ml_model.pkl` |
| `label_encoder.pkl` | `data/models/label_encoder.pkl` |

### Configuration

| File | Changes |
|------|---------|
| `.env` | No changes - same location |
| `requirements.txt` | Split into `backend/requirements.txt` and `bot/requirements.txt` |

## Import Changes

### Backend (backend/app.py)

**Old:**
```python
from ml_model import MLDetector
from utils import get_combined_verdict
import database
```

**New:**
```python
from core.database import init_db, get_stat, increment_stat, ...
from core.ml_detector import MLDetector
from services.virustotal import get_combined_verdict
```

### Bot (bot/telegram_bot.py)

**Old:**
```python
from ml_model import MLDetector
from utils import get_combined_verdict
import database
```

**New:**
```python
import sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend'))

from core.database import init_db, get_stat, ...
from core.ml_detector import MLDetector
from services.virustotal import get_combined_verdict
```

## Path Changes

### Database Path

**Old:**
```python
DB_FILE = "bot_data.db"
```

**New:**
```python
DB_FILE = os.path.join(
    os.path.dirname(os.path.dirname(os.path.dirname(__file__))),
    "data", "database", "bot_data.db"
)
```

### ML Model Paths

**Old:**
```python
detector = MLDetector(
    model_path="ml_model.pkl",
    label_encoder_path="label_encoder.pkl"
)
```

**New:**
```python
detector = MLDetector()  # Uses default paths in data/models/
```

## Running Commands

### Old Way

**Backend:**
```bash
cd api
python app.py
```

**Bot:**
```bash
python bot.py
```

**Frontend:**
```bash
cd frontend
npm run dev
```

### New Way

**Backend:**
```bash
cd backend
python app.py
# or
start_backend.bat
```

**Bot:**
```bash
cd bot
python telegram_bot.py
# or
start_bot.bat
```

**Frontend:**
```bash
cd frontend
npm run dev
```

**All Services:**
```bash
start_all.bat
```

## API Endpoints

### No Changes!

All API endpoints remain the same:
- `POST /api/auth/login`
- `POST /api/scan`
- `GET /api/stats`
- `GET /api/admin/status`
- etc.

The frontend doesn't need any changes because the API interface is identical.

## Database Schema

### No Changes!

The database schema remains exactly the same:
- `vt_cache` table
- `stats` table
- `reports` table

Your existing database can be moved to `data/database/` and will work immediately.

## Environment Variables

### No Changes!

The `.env` file format remains the same:
```env
TELEGRAM_BOT_TOKEN=...
VT_API_KEY=...
ADMIN_PASSWORD=...
ADMIN_USERNAME=...
SECRET_KEY=...
```

## Breaking Changes

### None!

There are no breaking changes:
- API endpoints unchanged
- Database schema unchanged
- Environment variables unchanged
- Functionality unchanged

Only the internal organization changed.

## Migration Steps

If you have an existing installation:

### 1. Backup Your Data
```bash
# Backup database
copy bot_data.db bot_data.db.backup

# Backup .env
copy .env .env.backup
```

### 2. Move Database
```bash
# Create data folders
mkdir data\database
mkdir data\models

# Move database
move bot_data.db data\database\

# Move models
move ml_model.pkl data\models\
move label_encoder.pkl data\models\
```

### 3. Update Dependencies
```bash
# Backend
cd backend
pip install -r requirements.txt

# Bot
cd ..\bot
pip install -r requirements.txt

# Frontend (no changes needed)
cd ..\frontend
npm install
```

### 4. Test
```bash
# Run verification
python verify_structure.py

# Start services
start_all.bat
```

## Troubleshooting

### "Module not found" errors

**Problem:** Import errors when running backend or bot

**Solution:**
- Make sure you're in the correct directory
- Check that `sys.path` includes the backend folder (bot does this automatically)
- Verify dependencies are installed

### Database not found

**Problem:** `bot_data.db` not found

**Solution:**
- Check database is in `data/database/bot_data.db`
- Run backend or bot once to create it automatically
- Verify folder permissions

### ML model not loading

**Problem:** ML model files not found

**Solution:**
- Check models are in `data/models/`
- Verify `ml_model.pkl` and `label_encoder.pkl` exist
- Check file paths in code

### Old scripts not working

**Problem:** Old start scripts fail

**Solution:**
- Use new start scripts: `start_backend.bat`, `start_bot.bat`, `start_all.bat`
- Or navigate to correct folders and run directly

## Benefits of New Structure

### For Development
- ✅ Clearer organization
- ✅ Better separation of concerns
- ✅ Easier to find files
- ✅ Simpler imports

### For Deployment
- ✅ Can deploy components separately
- ✅ Better scalability
- ✅ Clearer dependencies
- ✅ Easier to containerize

### For Maintenance
- ✅ Easier to update components
- ✅ Better code reusability
- ✅ Simpler testing
- ✅ Clearer documentation

## FAQ

### Q: Do I need to change my frontend code?
**A:** No, the frontend works without any changes.

### Q: Will my existing database work?
**A:** Yes, just move it to `data/database/bot_data.db`.

### Q: Do I need to retrain the ML model?
**A:** No, just move the model files to `data/models/`.

### Q: Can I still use the old folder structure?
**A:** Technically yes, but the new structure is recommended for better organization.

### Q: Will this affect my Telegram bot users?
**A:** No, the bot functionality is identical.

### Q: Do I need to update my .env file?
**A:** No, the .env format is unchanged.

### Q: What about my custom modifications?
**A:** You'll need to migrate them to the new structure, but the logic remains the same.

## Support

If you encounter issues during migration:

1. Check this guide
2. Review `SETUP_GUIDE.md`
3. Run `python verify_structure.py`
4. Check the logs for specific errors

## Summary

The restructure is a **non-breaking change** that improves organization without changing functionality. Your existing data, configuration, and API remain compatible.

Key points:
- ✅ No API changes
- ✅ No database schema changes
- ✅ No configuration changes
- ✅ Better organization
- ✅ Easier maintenance

---

**Migration Date:** February 20, 2026
**Version:** 2.0.0
