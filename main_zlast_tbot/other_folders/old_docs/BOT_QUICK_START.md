# Telegram Bot - Quick Start Guide 🚀

## Start the Bot

```bash
# Windows
start_bot.bat

# Or directly
python bot/telegram_bot.py
```

## User Commands

### Basic Usage
```
/start          - Welcome message and command list
/help           - Show all available commands
/stats          - View detection statistics
```

### Check URLs
```
# Method 1: Use /check command
/check https://example.com

# Method 2: Just paste the URL
https://example.com
```

### Report Results
```
/report         - Report incorrect detection
                  (Shows buttons for feedback)
```

## Admin Commands

### Authenticate
```
/adminsec your_password_here
```

### Admin Panel
```
/admin          - View admin panel
/viewreports    - View user feedback reports
/viewreports 20 - View last 20 reports
/viewurls       - View recently checked URLs
/systeminfo     - System health and statistics
/cleardata CONFIRM - Clear all statistics (requires CONFIRM)
```

## Example Session

### Regular User
```
User: /start
Bot: 🔎 Malicious URL Detector Bot
     Welcome, John!
     Simply paste a URL to check for threats!
     ...

User: https://suspicious-site.com
Bot: 🔍 Analyzing URL...
     🚨 URL Analysis Results
     ━━━━━━━━━━━━━━━━━━━━
     🔗 https://suspicious-site.com
     
     📊 Final Verdict: MALICIOUS
     🤖 ML: malicious (92.5%)
     🛡️ VT: malicious
     
     ⚠️ WARNING: This URL appears dangerous!
     Do not visit or share this link.
     
     [📝 Report Result]

User: /stats
Bot: 📊 Detection Statistics
     ━━━━━━━━━━━━━━━━━━━━
     🔍 Total URLs checked: 150
     🚨 Malicious detections: 45
     ✅ Safe URLs: 105
     
     📝 Breakdown by Type:
     ✅ Benign: 105
     🚨 Malicious: 30
     🎣 Phishing: 10
     ⚠️ Defacement: 5
```

### Admin User
```
Admin: /adminsec admin123
Bot: ✅ Admin Authentication Successful!
     Welcome, Admin John!
     
     🔧 Admin Commands:
     /admin - Admin panel
     /viewreports - View all user reports
     ...

Admin: /admin
Bot: 🔧 Admin Panel
     ━━━━━━━━━━━━━━━━━━━━
     
     📊 System Statistics:
     • Total URLs checked: 150
     • Malicious detections: 45
     • Safe URLs: 105
     • User feedback reports: 12
     
     📝 Recent Scans:
     • MALICIOUS: https://bad-site.com...
     • BENIGN: https://google.com...
     • PHISHING: https://fake-bank.com...
     
     🔧 Admin Commands:
     /viewreports - View user feedback reports
     /viewurls - View recently checked URLs
     /systeminfo - System information
     /cleardata CONFIRM - Clear statistics

Admin: /systeminfo
Bot: 🖥️ System Information
     ━━━━━━━━━━━━━━━━━━━━
     
     🤖 ML Model: ✅ LOADED
     🛡️ VirusTotal: ✅ ENABLED
     💾 Database: ✅ CONNECTED
     
     📊 Detection Statistics:
        Total checks: 150
        Malicious: 45
        Safe: 105
     
     📝 Breakdown by Type:
        Benign: 105
        Malicious: 30
        Phishing: 10
        Defacement: 5
```

## Rate Limiting

- **Limit**: 10 requests per 60 seconds per user
- **Message**: "⚠️ Rate limit exceeded! Please wait a moment..."
- **Purpose**: Prevents spam and abuse

## Error Messages

### Common Errors
```
⚠️ Please provide a valid URL.
→ URL is too short or invalid format

⚠️ ML model not available.
→ ML model failed to load, contact admin

⚠️ Error while checking URL.
→ Temporary error, try again

⚠️ Rate limit exceeded!
→ Too many requests, wait 60 seconds

❌ Access denied.
→ Admin command requires authentication
```

## Tips

### For Users
1. Just paste URLs directly - no need for /check
2. Use /report if you think the result is wrong
3. Check /stats to see overall detection rates
4. URLs are analyzed with both ML and VirusTotal

### For Admins
1. Authenticate with /adminsec first
2. Use /systeminfo to check system health
3. Review /viewreports regularly for model improvement
4. Use /cleardata CONFIRM carefully - it deletes all stats

## Configuration

### Environment Variables (.env file)
```env
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz
ADMIN_PASSWORD=your_secure_password_here
VT_API_KEY=your_virustotal_api_key_here
```

### Default Settings
- ML Confidence Threshold: 85%
- Rate Limit: 10 requests / 60 seconds
- Max URL Length: 2000 characters
- VirusTotal Cache: 24 hours

## Troubleshooting

### Bot Not Responding
1. Check if bot is running: `python bot/telegram_bot.py`
2. Verify TELEGRAM_BOT_TOKEN in .env
3. Check internet connection
4. Look for errors in console

### ML Model Errors
1. Check if model files exist in `data/models/`
2. Files needed: `ml_model.pkl`, `label_encoder.pkl`
3. Bot will fallback to VirusTotal-only if ML fails

### Database Errors
1. Check if `data/database/` directory exists
2. Verify file permissions
3. Database file: `data/database/bot_data.db`

### Admin Authentication Failed
1. Check ADMIN_PASSWORD in .env
2. Password is case-sensitive
3. No spaces before/after password

## Support

Need help? Check these files:
- `BOT_PRODUCTION_READY.md` - Detailed documentation
- `TELEGRAM_BOT_FINAL_STATUS.md` - Status and test results
- Console logs - Error messages and debugging info

---

**Quick Reference**
- Start: `python bot/telegram_bot.py`
- User commands: `/start`, `/help`, `/stats`, `/report`
- Admin auth: `/adminsec password`
- Admin commands: `/admin`, `/viewreports`, `/systeminfo`
- Just paste URLs to check them!
