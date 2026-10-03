# Deployment Checklist

## Pre-Deployment Verification

### ✅ Environment Setup
- [ ] Python 3.8+ installed
- [ ] Node.js 16+ installed
- [ ] Virtual environment created (`venv/`)
- [ ] All Python dependencies installed (`pip install -r requirements.txt`)
- [ ] All Node dependencies installed (`cd frontend && npm install`)

### ✅ Configuration
- [ ] `.env` file created from `.env.example`
- [ ] `TELEGRAM_BOT_TOKEN` configured
- [ ] `VT_API_KEY` configured (optional but recommended)
- [ ] `SECRET_KEY` set to strong random string
- [ ] `ADMIN_USERNAME` configured
- [ ] `ADMIN_PASSWORD` changed from default
- [ ] `ADMIN_USER_IDS` set for Telegram bot

### ✅ ML Model
- [ ] `ml_model.pkl` exists
- [ ] `label_encoder.pkl` exists
- [ ] Model loads without errors
- [ ] Test prediction works

### ✅ Database
- [ ] Database initializes successfully
- [ ] Tables created properly
- [ ] Can read/write statistics
- [ ] Can store reports

## Development Testing

### Backend API Tests
```bash
# 1. Start API server
venv\Scripts\activate
python api\app.py

# 2. Test health endpoint
curl http://localhost:5000/api/health

# Expected response:
# {
#   "status": "healthy",
#   "ml_model": true,
#   "virustotal": true,
#   "database": true
# }

# 3. Test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"admin\",\"password\":\"admin123\"}"

# Expected: JWT token returned
```

### Frontend Tests
```bash
# 1. Start frontend
cd frontend
npm run dev

# 2. Open browser to http://localhost:3000
# 3. Verify login page loads
# 4. Login with admin credentials
# 5. Check all pages load:
#    - Dashboard
#    - Reports
#    - Statistics
#    - URL Analysis
#    - Settings
# 6. Test URL scanning
# 7. Test logout
```

### Telegram Bot Tests
```bash
# 1. Start bot
venv\Scripts\activate
python bot.py

# 2. In Telegram:
#    - Send /start
#    - Send a URL
#    - Send /stats (if admin)
#    - Send /report
```

## Production Deployment

### Security Hardening
- [ ] Change all default passwords
- [ ] Use strong SECRET_KEY (32+ random characters)
- [ ] Enable HTTPS
- [ ] Configure firewall rules
- [ ] Set up rate limiting
- [ ] Enable CORS only for trusted domains
- [ ] Secure database file permissions
- [ ] Remove debug mode from Flask

### Backend Deployment
```bash
# 1. Install production WSGI server
pip install gunicorn

# 2. Run with gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 api.app:app

# Or use systemd service (Linux):
# Create /etc/systemd/system/url-detector-api.service
```

### Frontend Deployment
```bash
# 1. Build production bundle
cd frontend
npm run build

# 2. Serve with nginx or similar
# Output is in frontend/dist/
```

### Nginx Configuration Example
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # Frontend
    location / {
        root /path/to/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Process Management
```bash
# Use PM2 for Node.js processes
npm install -g pm2

# Start API
pm2 start "gunicorn -w 4 -b 0.0.0.0:5000 api.app:app" --name url-detector-api

# Start bot
pm2 start bot.py --name url-detector-bot --interpreter python

# Save configuration
pm2 save
pm2 startup
```

## Monitoring

### Health Checks
- [ ] API health endpoint responding
- [ ] Frontend accessible
- [ ] Telegram bot responding
- [ ] Database accessible
- [ ] ML model loading

### Logging
- [ ] API logs configured
- [ ] Bot logs configured
- [ ] Error tracking enabled
- [ ] Log rotation configured

### Metrics to Monitor
- [ ] API response times
- [ ] URL scan success rate
- [ ] ML model accuracy
- [ ] VirusTotal API usage
- [ ] Database size
- [ ] Error rates
- [ ] User activity

## Backup Strategy

### What to Backup
- [ ] Database file (`bot_data.db`)
- [ ] ML model files (`ml_model.pkl`, `label_encoder.pkl`)
- [ ] Configuration files (`.env`)
- [ ] Training data (`data/`)
- [ ] Logs

### Backup Schedule
- [ ] Daily database backups
- [ ] Weekly full backups
- [ ] Monthly archive backups
- [ ] Test restore procedure

## Maintenance

### Regular Tasks
- [ ] Monitor system health
- [ ] Review error logs
- [ ] Check disk space
- [ ] Update dependencies
- [ ] Retrain ML model (monthly)
- [ ] Review user reports
- [ ] Clear old logs

### Updates
```bash
# Update Python dependencies
pip install --upgrade -r requirements.txt

# Update Node dependencies
cd frontend
npm update

# Retrain ML model
python train_urls_multiclass.py
```

## Troubleshooting

### API Won't Start
1. Check port 5000 is available
2. Verify `.env` file exists
3. Check ML model files exist
4. Review error logs
5. Test database connection

### Frontend Won't Load
1. Check if built correctly (`npm run build`)
2. Verify API is running
3. Check CORS settings
4. Clear browser cache
5. Check console for errors

### Bot Not Responding
1. Verify bot token
2. Check internet connection
3. Ensure bot is running
4. Check Telegram API status
5. Review bot logs

### ML Model Errors
1. Retrain model: `python train_urls_multiclass.py`
2. Check training data exists
3. Verify scikit-learn version
4. Check model file permissions

## Performance Optimization

### Backend
- [ ] Enable caching for VirusTotal results
- [ ] Use connection pooling for database
- [ ] Implement request rate limiting
- [ ] Optimize ML model inference
- [ ] Use async operations where possible

### Frontend
- [ ] Enable production build optimizations
- [ ] Implement code splitting
- [ ] Use CDN for static assets
- [ ] Enable gzip compression
- [ ] Implement lazy loading

### Database
- [ ] Add indexes for common queries
- [ ] Regular VACUUM operations
- [ ] Archive old data
- [ ] Monitor query performance

## Security Checklist

### Application Security
- [ ] All passwords changed from defaults
- [ ] JWT secret is strong and unique
- [ ] HTTPS enabled
- [ ] CORS properly configured
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention
- [ ] XSS protection
- [ ] CSRF protection

### Infrastructure Security
- [ ] Firewall configured
- [ ] SSH key-based authentication
- [ ] Regular security updates
- [ ] Fail2ban or similar installed
- [ ] Backup encryption enabled
- [ ] Access logs monitored

### API Security
- [ ] Rate limiting enabled
- [ ] Token expiration configured
- [ ] API keys rotated regularly
- [ ] Audit logging enabled

## Compliance

### Data Protection
- [ ] User data handling documented
- [ ] Privacy policy created
- [ ] Data retention policy defined
- [ ] GDPR compliance (if applicable)

### Logging
- [ ] No sensitive data in logs
- [ ] Log retention policy
- [ ] Log access controls

## Post-Deployment

### Verification
- [ ] All services running
- [ ] Health checks passing
- [ ] Monitoring active
- [ ] Backups configured
- [ ] Alerts configured
- [ ] Documentation updated

### User Communication
- [ ] Users notified of deployment
- [ ] Documentation shared
- [ ] Support channels established
- [ ] Feedback mechanism in place

## Rollback Plan

### If Deployment Fails
1. Stop new services
2. Restore previous version
3. Restore database backup
4. Verify old version works
5. Investigate issues
6. Plan redeployment

### Rollback Commands
```bash
# Stop services
pm2 stop all

# Restore database
cp backup/bot_data.db.backup bot_data.db

# Restore code
git checkout previous-version

# Restart services
pm2 restart all
```

---

## Quick Reference

### Start Development
```bash
start.bat
```

### Start Production
```bash
# API
gunicorn -w 4 -b 0.0.0.0:5000 api.app:app

# Bot
python bot.py

# Frontend (already built)
# Serve frontend/dist/ with nginx
```

### Check Status
```bash
# API health
curl http://localhost:5000/api/health

# PM2 status
pm2 status

# Logs
pm2 logs
```

---

**Remember**: Always test in development before deploying to production!
