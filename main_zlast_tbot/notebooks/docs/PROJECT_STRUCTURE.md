# URL Detector System - Project Structure

## Overview

This project is now organized into a clean, modular structure with separate folders for each component while sharing a unified database and API.

## Directory Structure

```
url-detector/
├── backend/                    # Unified Backend API
│   ├── core/                   # Core modules
│   │   ├── database.py         # Database operations
│   │   └── ml_detector.py      # ML model wrapper
│   ├── services/               # External services
│   │   └── virustotal.py       # VirusTotal integration
│   ├── models/                 # (Reserved for future models)
│   ├── utils/                  # (Reserved for utilities)
│   ├── app.py                  # Main Flask API server
│   └── requirements.txt        # Python dependencies
│
├── bot/                        # Telegram Bot
│   ├── telegram_bot.py         # Main bot application
│   └── requirements.txt        # Bot dependencies
│
├── frontend/                   # React Web Frontend
│   ├── src/                    # Source code
│   │   ├── pages/              # Page components
│   │   ├── components/         # Reusable components
│   │   ├── context/            # React context
│   │   ├── services/           # API services
│   │   ├── App.jsx             # Main app component
│   │   └── main.jsx            # Entry point
│   ├── public/                 # Static assets
│   ├── package.json            # NPM dependencies
│   └── vite.config.js          # Vite configuration
│
├── data/                       # Data Storage
│   ├── database/               # Database files
│   │   └── bot_data.db         # Shared SQLite database
│   ├── models/                 # ML models
│   │   ├── ml_model.pkl        # Trained ML model
│   │   └── label_encoder.pkl   # Label encoder
│   ├── raw/                    # Raw datasets
│   └── processed/              # Processed data
│
├── docs/                       # Documentation
│   ├── 00_DOCUMENTATION_INDEX.md
│   ├── 01_OVERVIEW.md
│   ├── 02_INSTALLATION.md
│   └── ... (other docs)
│
├── notebooks/                  # Jupyter notebooks
│   ├── eda.ipynb               # Exploratory data analysis
│   ├── modeling.ipynb          # Model training
│   └── preprocessing.ipynb     # Data preprocessing
│
├── .env                        # Environment variables
├── .env.example                # Example environment file
├── .gitignore                  # Git ignore rules
├── README.md                   # Main README
├── start_all.bat               # Start all services
├── start_backend.bat           # Start backend only
├── start_bot.bat               # Start bot only
└── PROJECT_STRUCTURE.md        # This file
```

## Components

### 1. Backend (`backend/`)

The unified backend API server that serves both the web frontend and Telegram bot.

**Key Features:**
- Flask REST API
- JWT authentication
- ML model integration
- VirusTotal integration
- Shared database access
- Admin endpoints

**Main Files:**
- `app.py` - Main Flask application
- `core/database.py` - Database operations
- `core/ml_detector.py` - ML model wrapper
- `services/virustotal.py` - VirusTotal API integration

**Port:** 5000

### 2. Bot (`bot/`)

Telegram bot for URL checking with admin features.

**Key Features:**
- URL scanning via Telegram
- Admin authentication
- Statistics viewing
- Report submission
- Admin panel

**Main Files:**
- `telegram_bot.py` - Main bot application

**Commands:**
- `/start` - Start the bot
- `/check <url>` - Check a URL
- `/stats` - View statistics
- `/report` - Report incorrect detection
- `/adminsec <password>` - Admin authentication
- `/admin` - Admin panel (admin only)

### 3. Frontend (`frontend/`)

React web application for URL analysis and management.

**Key Features:**
- Modern React UI with Material-UI
- JWT authentication
- Real-time statistics
- URL scanning
- Reports management
- Admin dashboard

**Main Pages:**
- Dashboard - Overview and quick stats
- Reports - View all scan reports
- Statistics - Charts and analytics
- URL Analysis - Scan URLs
- Settings - Configuration

**Port:** 3002 (or as assigned by Vite)

### 4. Data (`data/`)

Centralized data storage for database, models, and datasets.

**Structure:**
- `database/` - SQLite database files
- `models/` - ML models and encoders
- `raw/` - Raw datasets
- `processed/` - Processed datasets

**Shared Database:**
- Location: `data/database/bot_data.db`
- Used by: Backend API, Telegram Bot
- Tables: `vt_cache`, `stats`, `reports`

### 5. Documentation (`docs/`)

Comprehensive project documentation.

**Contents:**
- Installation guides
- API reference
- Architecture diagrams
- Deployment instructions
- Troubleshooting guides

## Data Flow

```
┌─────────────┐         ┌─────────────┐
│   Frontend  │────────▶│   Backend   │
│  (React)    │◀────────│   (Flask)   │
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
                        └──────┬──────┘
                               │
                        ┌──────▼──────┐
                        │  ML Models  │
                        │ VirusTotal  │
                        └─────────────┘
```

## Installation

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
```

### Bot Setup
```bash
cd bot
pip install -r requirements.txt
```

### Frontend Setup
```bash
cd frontend
npm install
```

### Environment Configuration
Copy `.env.example` to `.env` and configure:
```env
# Telegram Bot
TELEGRAM_BOT_TOKEN=your_bot_token

# VirusTotal
VT_API_KEY=your_vt_api_key

# Admin
ADMIN_PASSWORD=admin123
ADMIN_USERNAME=admin

# Backend
SECRET_KEY=your-secret-jwt-key
```

## Running the System

### Option 1: Start All Services
```bash
start_all.bat
```

This starts:
- Backend API (port 5000)
- Telegram Bot
- Frontend (port 3002)

### Option 2: Start Individual Services

**Backend Only:**
```bash
start_backend.bat
# or
cd backend
python app.py
```

**Bot Only:**
```bash
start_bot.bat
# or
cd bot
python telegram_bot.py
```

**Frontend Only:**
```bash
cd frontend
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login and get JWT token

### URL Scanning
- `POST /api/scan` - Scan a URL
- `POST /api/report` - Submit a report

### Statistics
- `GET /api/stats` - Get statistics
- `GET /api/admin/status` - Get system status (admin)

### Admin
- `POST /api/admin/clear` - Clear statistics (admin)
- `GET /api/admin/export` - Export data (admin)

### Health
- `GET /api/health` - Health check

## Database Schema

### `vt_cache` Table
- `url` (TEXT, PRIMARY KEY)
- `result` (TEXT)
- `timestamp` (INTEGER)

### `stats` Table
- `key` (TEXT, PRIMARY KEY)
- `value` (INTEGER)

### `reports` Table
- `id` (INTEGER, PRIMARY KEY)
- `url` (TEXT)
- `report_type` (TEXT)
- `ml_prediction` (TEXT)
- `vt_result` (TEXT)
- `user_id` (INTEGER)
- `timestamp` (INTEGER)
- `notes` (TEXT)

## Key Features

### Unified Architecture
- Single database shared by all components
- Single API serving multiple clients
- Consistent data across all interfaces

### Security
- JWT authentication for web frontend
- Password-based admin authentication for bot
- Secure API endpoints

### Scalability
- Modular design
- Easy to add new components
- Separate concerns

### Maintainability
- Clear folder structure
- Well-documented code
- Consistent naming conventions

## Development

### Adding New Features

**Backend:**
1. Add new routes in `backend/app.py`
2. Add new services in `backend/services/`
3. Update database schema in `backend/core/database.py`

**Frontend:**
1. Add new pages in `frontend/src/pages/`
2. Add new components in `frontend/src/components/`
3. Update API calls in `frontend/src/services/api.js`

**Bot:**
1. Add new commands in `bot/telegram_bot.py`
2. Add new handlers as needed

### Testing

**Backend:**
```bash
cd backend
python -m pytest
```

**Frontend:**
```bash
cd frontend
npm test
```

## Deployment

See `docs/08_DEPLOYMENT.md` for detailed deployment instructions.

## Troubleshooting

### Database Issues
- Check `data/database/bot_data.db` exists
- Verify permissions
- Check database initialization logs

### API Issues
- Verify backend is running on port 5000
- Check `.env` configuration
- Review backend logs

### Frontend Issues
- Clear browser cache
- Check API connection
- Verify frontend is running

### Bot Issues
- Verify Telegram token
- Check bot permissions
- Review bot logs

## Contributing

1. Follow the existing folder structure
2. Document new features
3. Update relevant README files
4. Test thoroughly before committing

## License

[Your License Here]

## Support

For issues and questions:
- Check documentation in `docs/`
- Review troubleshooting guides
- Check project issues on GitHub

---

**Last Updated:** February 20, 2026
**Version:** 2.0.0 (Restructured)
