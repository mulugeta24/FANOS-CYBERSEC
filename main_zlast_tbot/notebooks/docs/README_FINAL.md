# 🔒 URL Detector System

> A comprehensive malicious URL detection system with Machine Learning, VirusTotal integration, web interface, and Telegram bot.

[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://www.python.org/)
[![React](https://img.shields.io/badge/React-18+-61DAFB.svg)](https://reactjs.org/)
[![Flask](https://img.shields.io/badge/Flask-3.0-green.svg)](https://flask.palletsprojects.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## ✨ Features

- 🤖 **ML-Based Detection** - Trained machine learning model for URL classification
- 🛡️ **VirusTotal Integration** - Real-time threat intelligence from VirusTotal API
- 🌐 **Web Dashboard** - Modern React interface with real-time statistics and charts
- 💬 **Telegram Bot** - Easy URL checking via Telegram with admin features
- 🔄 **Unified Backend** - Single API serving all clients
- 💾 **Shared Database** - Consistent data across all interfaces
- 📊 **Real-Time Analytics** - Live statistics and reporting
- 🔐 **Secure Authentication** - JWT for web, password for bot admin

## 🚀 Quick Start

### 1. Test System
```bash
python test_all_components.py
```

### 2. Start Everything
```bash
start_all.bat
```

### 3. Access
- **Web:** http://localhost:3002 (admin / admin123)
- **API:** http://localhost:5000
- **Bot:** Telegram

## 📁 Project Structure

```
url-detector/
├── backend/              # Unified Flask API server
│   ├── core/             # Core modules (database, ML)
│   ├── services/         # External services (VirusTotal)
│   └── app.py            # Main API server
├── bot/                  # Telegram bot
│   └── telegram_bot.py   # Bot application
├── frontend/             # React web interface
│   └── src/              # Source code
├── data/                 # Data storage
│   ├── database/         # SQLite database
│   └── models/           # ML models
└── docs/                 # Documentation
```

## 🔧 Installation

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Setup

**1. Install Backend:**
```bash
cd backend
pip install -r requirements.txt
```

**2. Install Bot:**
```bash
cd bot
pip install -r requirements.txt
```

**3. Install Frontend:**
```bash
cd frontend
npm install
```

**4. Configure Environment:**

Copy `.env.example` to `.env` and configure:
```env
TELEGRAM_BOT_TOKEN=your_bot_token
VT_API_KEY=your_vt_api_key
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
SECRET_KEY=your-secret-jwt-key
```

## 🎯 Usage

### Web Interface

1. Start system: `start_all.bat`
2. Open: http://localhost:3002
3. Login: admin / admin123

**Features:**
- Dashboard with real-time statistics
- URL scanner with ML + VirusTotal
- Reports management
- Statistics and charts
- Admin controls

### Telegram Bot

**User Commands:**
- `/start` - Start the bot
- `/check <url>` - Check a URL
- `/stats` - View statistics
- `/report` - Report incorrect detection
- `/help` - Show help

**Admin Commands:**
- `/adminsec <password>` - Admin authentication
- `/admin` - Admin panel
- `/viewreports` - View all reports
- `/viewurls` - View checked URLs
- `/systeminfo` - System information
- `/cleardata CONFIRM` - Clear statistics

### API Endpoints

**Authentication:**
- `POST /api/auth/login` - Login and get JWT token

**URL Scanning:**
- `POST /api/scan` - Scan a URL
- `POST /api/report` - Submit a report

**Statistics:**
- `GET /api/stats` - Get statistics
- `GET /api/admin/status` - Get system status (admin)

**Admin:**
- `POST /api/admin/clear` - Clear statistics (admin)
- `GET /api/admin/export` - Export data (admin)

**Health:**
- `GET /api/health` - Health check

## 🏗️ Architecture

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

## 📊 Components

### Backend (`backend/`)
Unified Flask API server serving both web frontend and Telegram bot.

**Features:**
- JWT authentication
- ML model integration
- VirusTotal API integration
- RESTful API endpoints
- Admin management
- Shared database access

**Port:** 5000

### Bot (`bot/`)
Telegram bot for easy URL checking with admin features.

**Features:**
- URL scanning
- Statistics viewing
- Report submission
- Admin panel
- User-friendly interface
- Real-time notifications

### Frontend (`frontend/`)
Modern React web application with Material-UI.

**Features:**
- Dashboard with real-time stats
- URL scanning interface
- Reports management
- Statistics and charts
- Admin controls
- Responsive design

**Port:** 3002

### Data (`data/`)
Centralized data storage for database and ML models.

**Contents:**
- `database/bot_data.db` - Shared SQLite database
- `models/ml_model.pkl` - Trained ML model
- `models/label_encoder.pkl` - Label encoder

## 🧪 Testing

### Run All Tests
```bash
python test_all_components.py
```

### Test Individual Components

**Backend:**
```bash
curl http://localhost:5000/api/health
```

**Frontend:**
```bash
# Open browser
http://localhost:3002
```

**Bot:**
```bash
# Send /start to your bot in Telegram
```

## 📖 Documentation

### Quick Guides
- [START_SYSTEM.md](START_SYSTEM.md) - How to start the system
- [SETUP_GUIDE.md](SETUP_GUIDE.md) - Setup instructions
- [QUICK_REFERENCE_CARD.md](QUICK_REFERENCE_CARD.md) - Quick reference

### Detailed Documentation
- [INDEX.md](INDEX.md) - Complete documentation index
- [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) - Project structure
- [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md) - Migration guide
- [docs/](docs/) - Complete documentation

## 🔒 Security

- JWT authentication for web interface
- Password-based admin authentication for bot
- Secure API endpoints
- Environment-based configuration
- No hardcoded secrets
- Input validation and sanitization

## 🚀 Deployment

For production deployment, see:
- [docs/08_DEPLOYMENT.md](docs/08_DEPLOYMENT.md)
- [docs/DEPLOYMENT_CHECKLIST.md](docs/DEPLOYMENT_CHECKLIST.md)

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

### Code Style
- Python: PEP 8
- JavaScript: ESLint + Prettier
- React: Functional components with hooks

## 📝 Database Schema

### Tables

**vt_cache:**
- `url` (TEXT, PRIMARY KEY)
- `result` (TEXT)
- `timestamp` (INTEGER)

**stats:**
- `key` (TEXT, PRIMARY KEY)
- `value` (INTEGER)

**reports:**
- `id` (INTEGER, PRIMARY KEY)
- `url` (TEXT)
- `report_type` (TEXT)
- `ml_prediction` (TEXT)
- `vt_result` (TEXT)
- `user_id` (INTEGER)
- `timestamp` (INTEGER)
- `notes` (TEXT)

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Troubleshooting
- [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)
- [LOGIN_TROUBLESHOOTING.md](LOGIN_TROUBLESHOOTING.md)
- [START_SYSTEM.md](START_SYSTEM.md)

### Getting Help
1. Check documentation
2. Run `python test_all_components.py`
3. Review logs
4. Open an issue

## 📊 Statistics

- **Components:** 3 (Backend, Bot, Frontend)
- **Database:** 1 shared SQLite
- **ML Models:** 2 files
- **API Endpoints:** 10+
- **Documentation:** 20+ files

## 🎯 Roadmap

- [ ] Multi-language support
- [ ] Advanced ML models
- [ ] Real-time notifications
- [ ] API rate limiting
- [ ] User management system
- [ ] Docker containerization
- [ ] CI/CD pipeline

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- VirusTotal for threat intelligence API
- Telegram for bot platform
- React and Material-UI for frontend
- Flask for backend framework

## 📞 Contact

For questions or support:
- Email: your.email@example.com
- GitHub: @yourusername
- Telegram: @yourusername

---

**Version:** 2.0.0 (Restructured)
**Last Updated:** February 20, 2026
**Status:** ✅ Production Ready

**Made with ❤️ for cybersecurity**
