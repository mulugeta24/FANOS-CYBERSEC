# URL Detector System

A comprehensive malicious URL detection system with Machine Learning, VirusTotal integration, web interface, and Telegram bot.

## 🎯 Features

- **ML-Based Detection**: Trained machine learning model for URL classification
- **VirusTotal Integration**: Real-time threat intelligence
- **Web Dashboard**: Modern React interface with statistics and reports
- **Telegram Bot**: Easy URL checking via Telegram
- **Unified Backend**: Single API serving all clients
- **Shared Database**: Consistent data across all interfaces

## 📁 Project Structure

```
url-detector/
├── backend/          # Unified Flask API server
├── bot/              # Telegram bot application
├── frontend/         # React web interface
├── data/             # Database and ML models
│   ├── database/     # SQLite database
│   └── models/       # ML models
└── docs/             # Documentation
```

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd url-detector
```

2. **Install Backend Dependencies**
```bash
cd backend
pip install -r requirements.txt
cd ..
```

3. **Install Bot Dependencies**
```bash
cd bot
pip install -r requirements.txt
cd ..
```

4. **Install Frontend Dependencies**
```bash
cd frontend
npm install
cd ..
```

5. **Configure Environment**

Copy `.env.example` to `.env` and configure:
```env
# Telegram Bot
TELEGRAM_BOT_TOKEN=your_bot_token

# VirusTotal
VT_API_KEY=your_vt_api_key

# Admin Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123

# Backend API
SECRET_KEY=your-secret-jwt-key
```

### Running the System

**Start All Services:**
```bash
start_all.bat
```

**Or start individually:**
```bash
# Backend API
start_backend.bat

# Telegram Bot
start_bot.bat

# Frontend
cd frontend
npm run dev
```

## 🌐 Access Points

### Web Interface
- URL: http://localhost:3002
- Login: admin / admin123
- Features: Dashboard, Reports, Statistics, URL Analysis

### Backend API
- URL: http://localhost:5000
- Endpoints: `/api/scan`, `/api/stats`, `/api/admin/*`

### Telegram Bot
- Commands: `/start`, `/check <url>`, `/stats`, `/report`
- Admin: `/adminsec <password>`

## 📊 Components

### Backend (`backend/`)
Unified Flask API server serving both web frontend and Telegram bot.

**Features:**
- JWT authentication
- ML model integration
- VirusTotal API integration
- RESTful API endpoints
- Admin management

### Bot (`bot/`)
Telegram bot for easy URL checking.

**Features:**
- URL scanning
- Statistics viewing
- Report submission
- Admin panel
- User-friendly interface

### Frontend (`frontend/`)
Modern React web application.

**Features:**
- Dashboard with real-time stats
- URL scanning interface
- Reports management
- Statistics and charts
- Admin controls

### Data (`data/`)
Centralized data storage.

**Contents:**
- `database/bot_data.db` - Shared SQLite database
- `models/ml_model.pkl` - Trained ML model
- `models/label_encoder.pkl` - Label encoder

## 🔧 Architecture

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

## 📖 Documentation

- `PROJECT_STRUCTURE.md` - Detailed project structure
- `SETUP_GUIDE.md` - Setup and configuration guide
- `docs/` - Complete documentation

## 🛠️ Development

### Adding New Features

**Backend:**
```bash
cd backend
# Edit app.py or add new modules in core/ or services/
```

**Frontend:**
```bash
cd frontend
# Add pages in src/pages/ or components in src/components/
```

**Bot:**
```bash
cd bot
# Edit telegram_bot.py
```

## 🔒 Security

- JWT authentication for web interface
- Password-based admin authentication
- Secure API endpoints
- Environment-based configuration

## 📝 License

[Your License Here]

## 🤝 Contributing

Contributions are welcome! Please follow the existing structure and coding standards.

## 📧 Support

For issues and questions, please check the documentation or open an issue.

---

**Version:** 2.0.0 (Restructured)
**Last Updated:** February 20, 2026
