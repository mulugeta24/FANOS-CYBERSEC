# Deployment Guide

## Deployment Options

### 1. Local Development
Best for: Testing and development

**Setup**:
```bash
python bot.py
```

**Pros**:
- Easy to debug
- Fast iteration
- No deployment complexity

**Cons**:
- Not suitable for production
- Requires computer to stay on
- No automatic restart

---

### 2. VPS Deployment (Recommended)
Best for: Production use

#### Providers
- DigitalOcean
- Linode
- AWS EC2
- Google Cloud Compute
- Azure VM

#### Requirements
- Ubuntu 20.04+ or similar
- 1GB RAM minimum
- Python 3.9+
- Stable internet connection

#### Setup Steps

**1. Connect to VPS**:
```bash
ssh user@your-server-ip
```

**2. Install Dependencies**:
```bash
sudo apt update
sudo apt install python3 python3-pip python3-venv git -y
```

**3. Clone Project**:
```bash
git clone <repository-url>
cd main_zlast_tbot
```

**4. Setup Virtual Environment**:
```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

**5. Configure Environment**:
```bash
nano .env
# Add your tokens
```

**6. Test Run**:
```bash
python bot.py
```

---

### 3. Systemd Service (Production)

**Create Service File**:
```bash
sudo nano /etc/systemd/system/urlbot.service
```

**Service Configuration**:
```ini
[Unit]
Description=Malicious URL Detector Bot
After=network.target

[Service]
Type=simple
User=botuser
WorkingDirectory=/home/botuser/main_zlast_tbot
Environment="PATH=/home/botuser/main_zlast_tbot/venv/bin"
ExecStart=/home/botuser/main_zlast_tbot/venv/bin/python bot.py
Restart=always
RestartSec=10

# Logging
StandardOutput=append:/var/log/urlbot/output.log
StandardError=append:/var/log/urlbot/error.log

[Install]
WantedBy=multi-user.target
```

**Create Log Directory**:
```bash
sudo mkdir -p /var/log/urlbot
sudo chown botuser:botuser /var/log/urlbot
```

**Enable and Start Service**:
```bash
sudo systemctl daemon-reload
sudo systemctl enable urlbot
sudo systemctl start urlbot
```

**Check Status**:
```bash
sudo systemctl status urlbot
```

**View Logs**:
```bash
sudo journalctl -u urlbot -f
```

---

### 4. Docker Deployment

**Dockerfile**:
```dockerfile
FROM python:3.9-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY . .

# Run bot
CMD ["python", "bot.py"]
```

**docker-compose.yml**:
```yaml
version: '3.8'

services:
  urlbot:
    build: .
    container_name: url_detector_bot
    restart: unless-stopped
    env_file:
      - .env
    volumes:
      - ./bot_data.db:/app/bot_data.db
      - ./logs:/app/logs
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

**Build and Run**:
```bash
docker-compose up -d
```

**View Logs**:
```bash
docker-compose logs -f
```

---

## Monitoring

### 1. Basic Monitoring

**Check if Running**:
```bash
ps aux | grep bot.py
```

**Monitor Logs**:
```bash
tail -f /var/log/urlbot/output.log
```

### 2. Advanced Monitoring

**Install Monitoring Tools**:
```bash
pip install prometheus-client
```

**Add Health Check Endpoint** (optional):
```python
from prometheus_client import start_http_server, Counter

# Add metrics
url_checks = Counter('url_checks_total', 'Total URL checks')
```

### 3. Alerting

**Setup Email Alerts**:
```bash
# Install mailutils
sudo apt install mailutils -y

# Create alert script
nano /home/botuser/alert.sh
```

```bash
#!/bin/bash
if ! systemctl is-active --quiet urlbot; then
    echo "URL Bot is down!" | mail -s "Bot Alert" admin@example.com
fi
```

**Add to Crontab**:
```bash
crontab -e
# Add: */5 * * * * /home/botuser/alert.sh
```

---

## Backup Strategy

### 1. Database Backup

**Manual Backup**:
```bash
sqlite3 bot_data.db ".backup bot_data_$(date +%Y%m%d).db"
```

**Automated Backup Script**:
```bash
#!/bin/bash
# backup.sh

BACKUP_DIR="/home/botuser/backups"
DATE=$(date +%Y%m%d_%H%M%S)
DB_FILE="/home/botuser/main_zlast_tbot/bot_data.db"

mkdir -p $BACKUP_DIR
sqlite3 $DB_FILE ".backup $BACKUP_DIR/bot_data_$DATE.db"

# Keep only last 7 days
find $BACKUP_DIR -name "bot_data_*.db" -mtime +7 -delete
```

**Schedule Backup**:
```bash
crontab -e
# Add: 0 2 * * * /home/botuser/backup.sh
```

### 2. Full System Backup
```bash
tar -czf bot_backup_$(date +%Y%m%d).tar.gz \
    main_zlast_tbot/ \
    --exclude='venv' \
    --exclude='__pycache__'
```

---

## Security Best Practices

### 1. Environment Variables
- Never commit `.env` file
- Use strong, unique tokens
- Rotate API keys periodically

### 2. File Permissions
```bash
chmod 600 .env
chmod 644 bot_data.db
```

### 3. Firewall Configuration
```bash
# Allow SSH
sudo ufw allow 22/tcp

# Enable firewall
sudo ufw enable
```

### 4. Regular Updates
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Update Python packages
pip install --upgrade -r requirements.txt
```

---

## Scaling Considerations

### Horizontal Scaling
- Not recommended (SQLite limitation)
- Consider PostgreSQL for multi-instance deployment

### Vertical Scaling
- Increase VPS resources
- Optimize database queries
- Implement connection pooling

### Performance Optimization
1. **Database**:
   - Regular VACUUM
   - Proper indexing
   - Cache cleanup

2. **Application**:
   - Async operations
   - Request throttling
   - Error handling

3. **External APIs**:
   - Respect rate limits
   - Implement exponential backoff
   - Cache aggressively

---

## Troubleshooting

### Bot Not Starting
```bash
# Check logs
sudo journalctl -u urlbot -n 50

# Check Python errors
python bot.py

# Verify environment
source venv/bin/activate
python -c "import telegram; print('OK')"
```

### Database Locked
```bash
# Check for zombie processes
ps aux | grep bot.py

# Kill if necessary
pkill -f bot.py

# Restart service
sudo systemctl restart urlbot
```

### High Memory Usage
```bash
# Check memory
free -h

# Monitor process
top -p $(pgrep -f bot.py)

# Restart if needed
sudo systemctl restart urlbot
```
