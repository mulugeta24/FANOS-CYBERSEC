# Installation Guide

## Prerequisites

### System Requirements
- Python 3.9 or higher
- 2GB RAM minimum
- 500MB disk space
- Internet connection

### Required Accounts
1. **Telegram Bot Token**
   - Create bot via [@BotFather](https://t.me/botfather)
   - Use `/newbot` command
   - Save the token

2. **VirusTotal API Key** (Optional but recommended)
   - Register at [VirusTotal](https://www.virustotal.com/)
   - Get free API key from account settings

## Step-by-Step Installation

### 1. Clone/Download Project
```bash
git clone <repository-url>
cd main_zlast_tbot
```

### 2. Create Virtual Environment
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Linux/Mac
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Configure Environment Variables
Create a `.env` file in the project root:
```env
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
VT_API_KEY=your_virustotal_api_key_here
```

### 5. Verify ML Model Files
Ensure these files exist:
- `ml_model.pkl` - Trained ML model
- `label_encoder.pkl` - Label encoder for categories

### 6. Initialize Database
```bash
python database.py
```

### 7. Run the Bot
```bash
python bot.py
```

You should see:
```
✅ Database initialized successfully
🤖 Bot is running...
📝 Reporting system enabled
```

## Configuration Options

### Database Configuration
Edit `database.py` to modify:
- `DB_FILE`: Database filename (default: `bot_data.db`)
- Connection timeout settings
- PRAGMA optimizations

### ML Model Configuration
Edit `bot.py` to adjust:
- `DEFAULT_ML_THRESHOLD`: Confidence threshold (default: 0.85)
- Model paths

## Troubleshooting

### Common Issues

**Issue**: "database is locked"
- **Solution**: Already fixed with thread-local connections

**Issue**: "Module not found"
- **Solution**: Ensure virtual environment is activated
- Run: `pip install -r requirements.txt`

**Issue**: "Invalid token"
- **Solution**: Check `.env` file for correct token
- Verify no extra spaces in token

**Issue**: Bot not responding
- **Solution**: Check internet connection
- Verify bot token is valid
- Check Telegram API status

## Deployment

### Production Deployment
1. Use process manager (systemd, supervisor, PM2)
2. Enable logging to file
3. Set up monitoring
4. Configure automatic restarts
5. Use environment-specific configs

### Example systemd service
```ini
[Unit]
Description=URL Detector Bot
After=network.target

[Service]
Type=simple
User=botuser
WorkingDirectory=/path/to/bot
ExecStart=/path/to/venv/bin/python bot.py
Restart=always

[Install]
WantedBy=multi-user.target
```
