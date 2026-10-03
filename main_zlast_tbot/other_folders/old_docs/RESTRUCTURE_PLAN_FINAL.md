# Final Project Restructure Plan

## New Structure

```
url-detector/
├── backend/                    # Unified backend API
│   ├── api/                   # API routes
│   │   ├── __init__.py
│   │   ├── auth.py           # Authentication routes
│   │   ├── scan.py           # URL scanning routes
│   │   ├── stats.py          # Statistics routes
│   │   └── admin.py          # Admin routes
│   ├── models/                # ML and data models
│   │   ├── __init__.py
│   │   ├── ml_detector.py    # ML model
│   │   └── database.py       # Database operations
│   ├── services/              # Business logic
│   │   ├── __init__.py
│   │   ├── virustotal.py     # VirusTotal integration
│   │   └── utils.py          # Utility functions
│   ├── app.py                # Main Flask app
│   ├── config.py             # Configuration
│   └── requirements.txt      # Python dependencies
│
├── bot/                       # Telegram bot
│   ├── bot.py                # Main bot file
│   └── requirements.txt      # Bot dependencies
│
├── frontend/                  # React dashboard
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── data/                      # Shared data
│   ├── models/               # ML model files
│   │   ├── ml_model.pkl
│   │   └── label_encoder.pkl
│   ├── database/             # Database files
│   │   └── url_detector.db
│   └── raw/                  # Training data
│
├── docs/                      # Documentation
├── scripts/                   # Utility scripts
│   ├── train_model.py
│   └── setup.py
│
├── .env                       # Environment variables
├── .gitignore
├── README.md
└── start.bat                  # Startup script
```

## Changes

1. **Unified Backend** - One API for both frontend and bot
2. **Shared Database** - Single database for all data
3. **Organized Structure** - Clear separation of concerns
4. **Shared Models** - ML model and database used by both
5. **Clean Dependencies** - Separate requirements for backend and bot
