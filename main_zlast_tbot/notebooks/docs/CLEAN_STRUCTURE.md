# Clean Project Structure ✅

## Current Structure

```
url-detector/
│
├── backend/                    # 🔧 Backend API Server
│   ├── core/                   # Core modules
│   │   ├── database.py         # Database operations
│   │   └── ml_detector.py      # ML model wrapper
│   ├── services/               # External services
│   │   └── virustotal.py       # VirusTotal integration
│   ├── models/                 # (Reserved for future)
│   ├── utils/                  # (Reserved for utilities)
│   ├── app.py                  # Main Flask API server
│   └── requirements.txt        # Python dependencies
│
├── bot/                        # 🤖 Telegram Bot
│   ├── telegram_bot.py         # Main bot application
│   └── requirements.txt        # Bot dependencies
│
├── frontend/                   # 🌐 Web Frontend
│   ├── src/
│   │   ├── pages/              # Page components
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Reports.jsx
│   │   │   ├── Statistics.jsx
│   │   │   ├── URLAnalysis.jsx
│   │   │   ├── Settings.jsx
│   │   │   └── Login.jsx
│   │   ├── components/         # Reusable components
│   │   │   └── Layout.jsx
│   │   ├── context/            # React context
│   │   │   └── AuthContext.jsx
│   │   ├── services/           # API services
│   │   │   └── api.js
│   │   ├── App.jsx             # Main app
│   │   ├── main.jsx            # Entry point
│   │   └── index.css           # Styles
│   ├── public/                 # Static assets
│   ├── node_modules/           # NPM packages
│   ├── package.json            # NPM config
│   ├── package-lock.json
│   ├── vite.config.js          # Vite config
│   ├── index.html              # HTML template
│   └── README.md
│
├── data/                       # 📊 Data Storage
│   ├── database/               # Database files
│   │   └── bot_data.db         # Shared SQLite database
│   ├── models/                 # ML models
│   │   ├── ml_model.pkl        # Trained model
│   │   └── label_encoder.pkl   # Label encoder
│   ├── raw/                    # Raw datasets
│   │   └── dataset.csv
│   └── processed/              # Processed data
│
├── docs/                       # 📚 Documentation
│   ├── 00_DOCUMENTATION_INDEX.md
│   ├── 01_OVERVIEW.md
│   ├── 02_INSTALLATION.md
│   ├── 03_USE_CASE_DIAGRAM.md
│   ├── 04_CLASS_DIAGRAM.md
│   ├── 05_SEQUENCE_DIAGRAMS.md
│   ├── 06_DATABASE_SCHEMA.md
│   ├── 07_API_REFERENCE.md
│   ├── 08_DEPLOYMENT.md
│   ├── 09_TESTING.md
│   ├── 10_ARCHITECTURE.md
│   ├── 11_ACTIVITY_DIAGRAM.md
│   ├── 12_STATE_AND_COMPONENT_DIAGRAMS.md
│   └── 13_ADMIN_DASHBOARD.md
│
├── notebooks/                  # 📓 Jupyter Notebooks
│   ├── eda.ipynb               # Exploratory analysis
│   ├── modeling.ipynb          # Model training
│   └── preprocessing.ipynb     # Data preprocessing
│
├── scripts/                    # 🔨 Utility Scripts
│   └── (training scripts)
│
├── old_docs/                   # 📦 Old Documentation
│   └── (archived docs)
│
├── .vscode/                    # VS Code settings
├── venv/                       # Python virtual environment
│
├── .env                        # Environment variables
├── .env.example                # Example environment file
├── .gitignore                  # Git ignore rules
│
├── README.md                   # Main README
├── README_NEW.md               # Updated README
├── PROJECT_STRUCTURE.md        # Detailed structure
├── SETUP_GUIDE.md              # Setup guide
├── RESTRUCTURE_COMPLETE.md     # Restructure summary
├── CLEAN_STRUCTURE.md          # This file
│
├── start_all.bat               # Start all services
├── start_backend.bat           # Start backend only
└── start_bot.bat               # Start bot only
```

## Folder Purposes

### 🔧 backend/
**Purpose:** Unified Flask API server serving both web frontend and Telegram bot

**Contains:**
- `app.py` - Main Flask application with all API endpoints
- `core/` - Core functionality (database, ML model)
- `services/` - External service integrations (VirusTotal)
- `requirements.txt` - Python dependencies

**Port:** 5000

**Start:** `start_backend.bat` or `cd backend && python app.py`

---

### 🤖 bot/
**Purpose:** Telegram bot for URL checking

**Contains:**
- `telegram_bot.py` - Main bot application
- `requirements.txt` - Bot-specific dependencies

**Features:**
- URL scanning
- Statistics viewing
- Report submission
- Admin panel

**Start:** `start_bot.bat` or `cd bot && python telegram_bot.py`

---

### 🌐 frontend/
**Purpose:** React web application for URL analysis

**Contains:**
- `src/pages/` - Page components (Dashboard, Reports, Statistics, etc.)
- `src/components/` - Reusable UI components
- `src/context/` - React context for state management
- `src/services/` - API integration
- `package.json` - NPM dependencies

**Port:** 3002 (or as assigned by Vite)

**Start:** `cd frontend && npm run dev`

---

### 📊 data/
**Purpose:** Centralized data storage

**Contains:**
- `database/bot_data.db` - Shared SQLite database
- `models/` - ML model files
- `raw/` - Raw datasets
- `processed/` - Processed datasets

**Shared By:**
- Backend API
- Telegram Bot

---

### 📚 docs/
**Purpose:** Project documentation

**Contains:**
- Installation guides
- API reference
- Architecture diagrams
- Deployment instructions
- Testing guides

---

### 📓 notebooks/
**Purpose:** Jupyter notebooks for data analysis and model training

**Contains:**
- EDA (Exploratory Data Analysis)
- Model training notebooks
- Data preprocessing notebooks

---

### 🔨 scripts/
**Purpose:** Utility scripts

**Contains:**
- Training scripts
- Data processing scripts
- Maintenance scripts

---

### 📦 old_docs/
**Purpose:** Archived documentation from previous versions

**Contains:**
- Old setup guides
- Previous documentation
- Historical records

---

## Key Files

### Configuration Files

**`.env`** - Environment variables (shared by all components)
```env
TELEGRAM_BOT_TOKEN=your_token
VT_API_KEY=your_key
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
SECRET_KEY=your-secret-key
```

**`.env.example`** - Example environment file

**`.gitignore`** - Git ignore rules

---

### Start Scripts

**`start_all.bat`** - Start all services at once
- Starts backend API
- Starts Telegram bot
- Starts frontend dev server

**`start_backend.bat`** - Start backend API only

**`start_bot.bat`** - Start Telegram bot only

---

### Documentation

**`README.md`** - Main project README

**`PROJECT_STRUCTURE.md`** - Detailed structure explanation

**`SETUP_GUIDE.md`** - Quick setup guide

**`RESTRUCTURE_COMPLETE.md`** - Restructure summary

**`CLEAN_STRUCTURE.md`** - This file

---

## Data Flow

```
┌─────────────┐         ┌─────────────┐
│   Frontend  │────────▶│   Backend   │
│  (React)    │◀────────│   (Flask)   │
│  Port 3002  │         │  Port 5000  │
└─────────────┘         └──────┬──────┘
                               │
┌─────────────┐                │
│  Telegram   │────────────────┤
│    Bot      │◀───────────────┤
└─────────────┘                │
                               │
                        ┌──────▼──────┐
                        │   Database  │
                        │  (SQLite)   │
                        │ data/database/
                        └──────┬──────┘
                               │
                        ┌──────▼──────┐
                        │  ML Models  │
                        │ data/models/ │
                        └─────────────┘
```

## Removed/Cleaned Up

### Deleted Old Files ✅
- `api/` folder (replaced by `backend/`)
- `bot.py` (moved to `bot/telegram_bot.py`)
- `database.py` (moved to `backend/core/database.py`)
- `ml_model.py` (moved to `backend/core/ml_detector.py`)
- `utils.py` (moved to `backend/services/virustotal.py`)
- `vt_api.py` (merged into `backend/services/virustotal.py`)
- `vt_cache.py` (functionality in database)
- `bot_data.db` (moved to `data/database/bot_data.db`)
- `ml_model.pkl` (moved to `data/models/ml_model.pkl`)
- `label_encoder.pkl` (moved to `data/models/label_encoder.pkl`)
- Old start scripts

### Archived Documentation ✅
Moved to `old_docs/`:
- Old setup guides
- Previous fix documentation
- Historical summaries

### Organized Data ✅
- Datasets moved to `data/raw/`
- Training scripts moved to `scripts/`
- Models moved to `data/models/`

---

## Quick Start

### 1. Install Dependencies

```bash
# Backend
cd backend
pip install -r requirements.txt
cd ..

# Bot
cd bot
pip install -r requirements.txt
cd ..

# Frontend
cd frontend
npm install
cd ..
```

### 2. Configure Environment

Edit `.env` file with your credentials

### 3. Start Services

```bash
# Start everything
start_all.bat

# Or start individually
start_backend.bat
start_bot.bat
cd frontend && npm run dev
```

### 4. Access

- **Web:** http://localhost:3002
- **API:** http://localhost:5000
- **Bot:** Telegram

---

## Benefits of Clean Structure

### ✅ Organization
- Clear folder hierarchy
- Easy to navigate
- Logical grouping

### ✅ Maintainability
- Modular design
- Clear dependencies
- Easy to update

### ✅ Scalability
- Components can scale independently
- Easy to add new features
- Clear separation of concerns

### ✅ Development
- Easy onboarding
- Clear project layout
- Better collaboration

### ✅ Deployment
- Each component can be deployed separately
- Clear build processes
- Better resource management

---

## Summary

The project now has a clean, professional structure with:

✅ **Unified Backend** - Single API in `backend/`
✅ **Telegram Bot** - Separate bot in `bot/`
✅ **Web Frontend** - React app in `frontend/`
✅ **Centralized Data** - All data in `data/`
✅ **Complete Docs** - Documentation in `docs/`
✅ **Clean Root** - Only essential files in root
✅ **Easy Start** - Simple start scripts

Everything is organized, documented, and ready to use! 🎉

---

**Last Updated:** February 20, 2026
**Version:** 2.0.0 (Clean Structure)
