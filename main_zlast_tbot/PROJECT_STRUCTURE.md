# Project Folder Structure

## Complete Directory Tree

```
malicious-url-detector/
│
├── backend/                          # Backend API Server
│   ├── api/                          # API endpoints
│   │   ├── __init__.py
│   │   └── auth.py                   # Authentication endpoints
│   │
│   ├── core/                         # Core business logic
│   │   ├── __init__.py
│   │   ├── database.py               # Database operations (SQLite)
│   │   └── ml_detector.py            # ML model wrapper and prediction
│   │
│   ├── services/                     # External service integrations
│   │   ├── __init__.py
│   │   └── virustotal.py             # VirusTotal API integration
│   │
│   ├── models/                       # Trained ML models
│   │   ├── ml_model.pkl              # XGBoost trained model
│   │   └── label_encoder.pkl         # Label encoder for categories
│   │
│   ├── utils/                        # Utility functions
│   │
│   ├── __pycache__/                  # Python cache files
│   │
│   ├── app.py                        # Main Flask application
│   └── requirements.txt              # Backend dependencies
│
├── bot/                              # Telegram Bot
│   ├── __pycache__/                  # Python cache files
│   ├── telegram_bot.py               # Main bot application
│   └── requirements.txt              # Bot dependencies
│
├── frontend/                         # React Web Dashboard
│   ├── node_modules/                 # Node.js dependencies
│   │
│   ├── public/                       # Static public files
│   │   ├── favicon.ico
│   │   └── index.html
│   │
│   ├── src/                          # React source code
│   │   ├── components/               # Reusable UI components
│   │   │   └── Layout.jsx            # Main layout wrapper
│   │   │
│   │   ├── context/                  # React context providers
│   │   │   └── AuthContext.jsx       # Authentication context
│   │   │
│   │   ├── pages/                    # Page components
│   │   │   ├── Dashboard.jsx         # Main dashboard with stats
│   │   │   ├── Login.jsx             # Login page
│   │   │   ├── Reports.jsx           # User feedback reports
│   │   │   ├── Settings.jsx          # System settings
│   │   │   ├── Statistics.jsx        # Detailed statistics & charts
│   │   │   └── URLAnalysis.jsx       # URL scanning interface
│   │   │
│   │   ├── services/                 # API client services
│   │   │   └── api.js                # Axios API client
│   │   │
│   │   ├── App.jsx                   # Main App component
│   │   ├── App.test.jsx              # App tests
│   │   ├── index.css                 # Global styles
│   │   └── main.jsx                  # React entry point
│   │
│   ├── .env.example                  # Environment variables template
│   ├── .gitignore                    # Git ignore rules
│   ├── index.html                    # HTML entry point
│   ├── package.json                  # Node.js dependencies
│   ├── package-lock.json             # Locked dependencies
│   ├── README.md                     # Frontend documentation
│   └── vite.config.js                # Vite configuration
│
├── data/                             # Data storage
│   ├── database/                     # SQLite database files
│   │   └── bot_data.db               # Main database file
│   │
│   ├── models/                       # ML model files (backup)
│   │   ├── ml_model.pkl
│   │   └── label_encoder.pkl
│   │
│   ├── processed/                    # Processed datasets
│   │
│   └── raw/                          # Raw training data
│       └── dataset.csv               # Original training dataset
│
├── notebooks/                        # Jupyter notebooks
│   ├── docs/                         # Project documentation
│   │   ├── 00_DOCUMENTATION_INDEX.md
│   │   ├── 01_OVERVIEW.md
│   │   ├── 02_INSTALLATION.md
│   │   ├── 03_USE_CASE_DIAGRAM.md
│   │   ├── 04_CLASS_DIAGRAM.md
│   │   ├── 05_SEQUENCE_DIAGRAMS.md
│   │   ├── 06_DATABASE_SCHEMA.md
│   │   ├── 07_API_REFERENCE.md
│   │   ├── 08_DEPLOYMENT.md
│   │   ├── 09_TESTING.md
│   │   ├── 10_ARCHITECTURE.md
│   │   ├── 11_ACTIVITY_DIAGRAM.md
│   │   ├── 12_STATE_AND_COMPONENT_DIAGRAMS.md
│   │   ├── 13_ADMIN_DASHBOARD.md
│   │   ├── DEPLOYMENT_CHECKLIST.md
│   │   ├── QUICK_START.md
│   │   ├── START_HERE.md
│   │   ├── TROUBLESHOOTING.md
│   │   └── 🚀_START_HERE_FIRST.md
│   │
│   ├── eda.ipynb                     # Exploratory Data Analysis
│   ├── modeling.ipynb                # Model training & evaluation
│   └── preprocessing.ipynb           # Data preprocessing
│
├── other_folders/                    # Archive and utilities
│   ├── old_docs/                     # Archived documentation
│   │   └── [various old documentation files]
│   │
│   ├── scripts/                      # Utility scripts
│   │
│   └── verify_structure.py           # Structure verification script
│
├── venv/                             # Python virtual environment
│   ├── Lib/
│   ├── Scripts/
│   └── pyvenv.cfg
│
├── __pycache__/                      # Python cache files
│
├── .env                              # Environment variables (not in git)
├── .env.example                      # Environment variables template
├── .gitignore                        # Git ignore rules
├── Chapter_Three_Updated.md          # Chapter 3 documentation
├── Chapter_3_Complete.md             # Complete Chapter 3
├── fix_vt_cache_table.py             # Database migration script
├── README.md                         # Main project documentation
├── requirements.txt                  # Root Python dependencies
├── RESTART_BOT.bat                   # Bot restart script (Windows)
├── start_all.bat                     # Start all services (Windows)
├── start_backend.bat                 # Start backend only (Windows)
├── test_all_components.py            # Component testing script
├── TEST_API.html                     # API testing interface
└── test_bot_functions.py             # Bot function tests
```

---

## Detailed Component Descriptions

### Backend (`/backend`)

The backend serves as the unified API server for both the Telegram bot and web frontend.

**Key Files**:
- `app.py`: Main Flask application with all API endpoints
- `core/database.py`: Database operations, table management, and queries
- `core/ml_detector.py`: ML model loading and prediction logic
- `services/virustotal.py`: VirusTotal API integration with caching
- `models/`: Serialized ML models (XGBoost and label encoder)

**Technologies**: Flask, Flask-CORS, SQLite, scikit-learn, XGBoost, PyJWT

---

### Bot (`/bot`)

Telegram bot for instant URL checking via messaging platform.

**Key Files**:
- `telegram_bot.py`: Complete bot implementation with all commands

**Features**:
- Rate limiting (10 requests/60 seconds)
- Admin authentication
- User feedback collection
- Real-time URL analysis

**Technologies**: python-telegram-bot, asyncio

---

### Frontend (`/frontend`)

React-based web dashboard for administrators.

**Key Directories**:
- `src/pages/`: Main application pages
  - `Dashboard.jsx`: Overview with statistics cards and charts
  - `URLAnalysis.jsx`: URL scanning interface
  - `Statistics.jsx`: Detailed analytics with graphs
  - `Reports.jsx`: User feedback management
  - `Settings.jsx`: System configuration
  - `Login.jsx`: Authentication page

- `src/components/`: Reusable UI components
- `src/context/`: React context for state management
- `src/services/`: API client with Axios

**Technologies**: React, Material-UI, Recharts, Axios, Vite, React Router

---

### Data (`/data`)

Centralized data storage for the entire system.

**Structure**:
- `database/bot_data.db`: SQLite database with tables:
  - `scans`: Automatic URL detections
  - `user_reports`: User feedback
  - `vt_cache`: VirusTotal cache (24h expiry)
  - `stats`: Legacy statistics
  - `reports`: Legacy reports

- `models/`: Backup of trained ML models
- `raw/dataset.csv`: Original training dataset
- `processed/`: Processed datasets for training

---

### Notebooks (`/notebooks`)

Jupyter notebooks for ML model development and documentation.

**Key Notebooks**:
- `preprocessing.ipynb`: Data cleaning and feature engineering
- `eda.ipynb`: Exploratory data analysis
- `modeling.ipynb`: Model training and evaluation

**Documentation** (`/notebooks/docs`):
- Comprehensive project documentation
- Architecture diagrams
- API references
- Deployment guides

---

## Database Schema

### scans table
```sql
CREATE TABLE scans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    url TEXT NOT NULL,
    final_verdict TEXT NOT NULL,
    ml_prediction TEXT,
    ml_confidence REAL,
    vt_result TEXT,
    user_id INTEGER,
    timestamp INTEGER DEFAULT (strftime('%s', 'now')),
    source TEXT
)
```

### user_reports table
```sql
CREATE TABLE user_reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    scan_id INTEGER,
    url TEXT NOT NULL,
    original_verdict TEXT,
    user_verdict TEXT NOT NULL,
    user_id INTEGER,
    timestamp INTEGER DEFAULT (strftime('%s', 'now')),
    notes TEXT,
    FOREIGN KEY (scan_id) REFERENCES scans(id)
)
```

### vt_cache table
```sql
CREATE TABLE vt_cache (
    url TEXT PRIMARY KEY,
    verdict TEXT NOT NULL,
    malicious INTEGER,
    suspicious INTEGER,
    harmless INTEGER,
    timestamp INTEGER NOT NULL
)
```

---

## Configuration Files

### Environment Variables (`.env`)

```env
# Backend Configuration
SECRET_KEY=your-secret-key-here
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123

# VirusTotal API
VT_API_KEY=your-virustotal-api-key
VIRUSTOTAL_API_KEY=your-virustotal-api-key

# Telegram Bot
TELEGRAM_BOT_TOKEN=your-telegram-bot-token

# Database
DATABASE_PATH=./data/database/bot_data.db
```

### Backend Requirements (`backend/requirements.txt`)

```
Flask==3.0.0
Flask-CORS==4.0.0
python-dotenv==1.0.0
PyJWT==2.8.0
requests==2.31.0
scikit-learn==1.3.2
xgboost==2.0.3
pandas==2.1.4
numpy==1.26.2
```

### Bot Requirements (`bot/requirements.txt`)

```
python-telegram-bot==20.7
python-dotenv==1.0.0
requests==2.31.0
```

### Frontend Dependencies (`frontend/package.json`)

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "@mui/material": "^5.14.20",
    "@mui/icons-material": "^5.14.19",
    "@emotion/react": "^11.11.1",
    "@emotion/styled": "^11.11.0",
    "axios": "^1.6.2",
    "recharts": "^2.10.3"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.1",
    "vite": "^5.0.8"
  }
}
```

---

## Startup Scripts

### Start All Services (`start_all.bat`)

```batch
@echo off
echo Starting Malicious URL Detector System...
echo.

echo [1/3] Starting Backend API...
start "Backend API" cmd /k "cd backend && python app.py"
timeout /t 3

echo [2/3] Starting Telegram Bot...
start "Telegram Bot" cmd /k "cd bot && python telegram_bot.py"
timeout /t 3

echo [3/3] Starting Frontend...
start "Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo All services started!
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3002
echo Bot: Running in background
pause
```

### Start Backend Only (`start_backend.bat`)

```batch
@echo off
cd backend
python app.py
pause
```

### Restart Bot (`RESTART_BOT.bat`)

```batch
@echo off
echo Restarting Telegram Bot...
taskkill /F /FI "WINDOWTITLE eq Telegram Bot*"
timeout /t 2
start "Telegram Bot" cmd /k "cd bot && python telegram_bot.py"
echo Bot restarted!
pause
```

---

## Port Configuration

| Service | Port | URL |
|---------|------|-----|
| Backend API | 5000 | http://localhost:5000 |
| Frontend (Dev) | 3002 | http://localhost:3002 |
| Telegram Bot | N/A | Polling mode |

---

## Data Flow

```
User Input (Telegram/Web)
    ↓
Backend API (Flask)
    ↓
┌─────────────────┬─────────────────┐
│                 │                 │
ML Detector    VirusTotal API    Database
(Tier 2)         (Tier 1)        (Cache)
│                 │                 │
└─────────────────┴─────────────────┘
    ↓
Verdict Synthesis Logic
    ↓
Store in Database (scans table)
    ↓
Return Result to User
    ↓
User Feedback (optional)
    ↓
Store in user_reports table
```

---

## Key Features by Component

### Backend
- ✅ Unified API for bot and frontend
- ✅ JWT authentication
- ✅ Rate limiting
- ✅ Timeout protection
- ✅ Database management
- ✅ ML model integration
- ✅ VirusTotal caching

### Bot
- ✅ Command handlers (/start, /check, /stats, /report, /admin)
- ✅ Rate limiting (10 req/60s)
- ✅ Admin authentication
- ✅ User feedback collection
- ✅ Real-time URL analysis
- ✅ Error handling

### Frontend
- ✅ Material-UI design
- ✅ Real-time statistics
- ✅ Interactive charts (Recharts)
- ✅ URL analysis tool
- ✅ User reports management
- ✅ System settings
- ✅ Responsive design

### Database
- ✅ Separate tables for scans and reports
- ✅ VirusTotal cache (24h expiry)
- ✅ Thread-safe operations
- ✅ Automatic timestamps
- ✅ Foreign key relationships

---

## Development Workflow

1. **Setup Environment**:
   ```bash
   python -m venv venv
   venv\Scripts\activate
   pip install -r requirements.txt
   ```

2. **Configure Environment Variables**:
   - Copy `.env.example` to `.env`
   - Add API keys and tokens

3. **Start Services**:
   - Run `start_all.bat` (Windows)
   - Or start each service individually

4. **Access Interfaces**:
   - Web: http://localhost:3002
   - API: http://localhost:5000
   - Bot: Open Telegram and search for your bot

---

## Testing

- `test_all_components.py`: Test all system components
- `test_bot_functions.py`: Test bot functionality
- `TEST_API.html`: Interactive API testing interface
- `frontend/src/App.test.jsx`: Frontend component tests

---

## Documentation

All documentation is located in `notebooks/docs/`:
- Installation guides
- API references
- Architecture diagrams
- Deployment checklists
- Troubleshooting guides

---

**Last Updated**: February 22, 2026
