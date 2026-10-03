# Troubleshooting Guide

## Common Issues and Solutions

### 1. "Not Found - The requested URL was not found on the server"

This error typically occurs when:

#### Problem: Frontend not running or wrong URL
**Solution:**
```bash
# Start the frontend
cd frontend
npm run dev

# Access at: http://localhost:3000 (NOT port 5000)
```

#### Problem: Accessing API directly in browser
**Solution:**
- API runs on http://localhost:5000 (backend only)
- Frontend runs on http://localhost:3000 (user interface)
- Always use http://localhost:3000 for the web interface

#### Problem: Wrong route in browser
**Solution:**
- Use: http://localhost:3000
- NOT: http://localhost:5000
- NOT: http://localhost:3000/api

### 2. Login Page Not Loading

#### Check if frontend is running:
```bash
cd frontend
npm run dev
```

#### Check if dependencies are installed:
```bash
cd frontend
npm install
```

#### Clear browser cache:
- Press Ctrl+Shift+Delete
- Clear cached images and files
- Reload page

### 3. "Cannot connect to API" Error

#### Check if API server is running:
```bash
venv\Scripts\activate
python api\app.py
```

#### Verify API is healthy:
```bash
curl http://localhost:5000/api/health
```

Should return:
```json
{
  "status": "healthy",
  "ml_model": true,
  "virustotal": true,
  "database": true
}
```

#### Check CORS settings:
In `api/app.py`, verify CORS is enabled:
```python
CORS(app)
```

### 4. Login Fails with "Invalid credentials"

#### Check credentials in .env:
```
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

#### Default credentials:
- Username: `admin`
- Password: `admin123`

#### If you changed them:
- Use your custom credentials
- Check for typos in .env file

### 5. ML Model Not Loading

#### Error: "ML model not available"

**Solution:**
```bash
# Retrain the model
python train_urls_multiclass.py
```

#### Check if model files exist:
- `ml_model.pkl`
- `label_encoder.pkl`

#### Verify training data:
- `data/raw/dataset.csv` should exist

### 6. VirusTotal API Not Working

#### Check API key in .env:
```
VT_API_KEY=your_actual_api_key_here
```

#### Test API key:
```bash
curl -H "x-apikey: YOUR_API_KEY" https://www.virustotal.com/api/v3/domains/google.com
```

#### Note:
- System works without VT API
- Only ML predictions will be used
- Get free API key at: https://www.virustotal.com/

### 7. Telegram Bot Not Responding

#### Check bot token in .env:
```
TELEGRAM_BOT_TOKEN=your_bot_token_here
```

#### Verify bot is running:
```bash
venv\Scripts\activate
python bot.py
```

#### Test bot:
1. Find your bot on Telegram
2. Send `/start`
3. Should receive welcome message

#### Get bot token:
1. Message @BotFather on Telegram
2. Create new bot or use existing
3. Copy token to .env

### 8. Port Already in Use

#### Error: "Address already in use"

**For API (port 5000):**
```bash
# Windows - Find and kill process
netstat -ano | findstr :5000
taskkill /PID <process_id> /F
```

**For Frontend (port 3000):**
```bash
# Windows - Find and kill process
netstat -ano | findstr :3000
taskkill /PID <process_id> /F
```

**Change ports:**
- API: Edit `api/app.py`, change port in `app.run()`
- Frontend: Edit `frontend/vite.config.js`, change `server.port`

### 9. Database Errors

#### Error: "Database locked"

**Solution:**
```bash
# Stop all processes using database
# Delete lock files
del bot_data.db-shm
del bot_data.db-wal

# Restart services
```

#### Error: "No such table"

**Solution:**
```bash
# Reinitialize database
python -c "import database; database.init_db()"
```

### 10. Frontend Build Errors

#### Error during `npm run build`

**Solution:**
```bash
cd frontend

# Clear cache
rm -rf node_modules
rm package-lock.json

# Reinstall
npm install

# Try build again
npm run build
```

### 11. Python Import Errors

#### Error: "ModuleNotFoundError"

**Solution:**
```bash
# Activate virtual environment
venv\Scripts\activate

# Install requirements
pip install -r requirements.txt

# If still failing, recreate venv
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

### 12. JWT Token Errors

#### Error: "Token is invalid"

**Solution:**
1. Logout and login again
2. Clear browser localStorage
3. Check SECRET_KEY in .env is set
4. Restart API server

#### Clear localStorage:
```javascript
// In browser console (F12)
localStorage.clear()
// Reload page
```

## Quick Fixes

### Complete Reset

If nothing works, try a complete reset:

```bash
# 1. Stop all services
# Close all terminal windows

# 2. Clean up
del bot_data.db
del bot_data.db-shm
del bot_data.db-wal

# 3. Reinstall Python dependencies
venv\Scripts\activate
pip install --force-reinstall -r requirements.txt

# 4. Reinstall Node dependencies
cd frontend
rm -rf node_modules
npm install
cd ..

# 5. Retrain ML model
python train_urls_multiclass.py

# 6. Start fresh
start.bat
```

### Verify Installation

Run this checklist:

```bash
# 1. Check Python
python --version
# Should be 3.8+

# 2. Check Node
node --version
# Should be 16+

# 3. Check virtual environment
venv\Scripts\activate
python -c "import flask; print('Flask OK')"
python -c "import sklearn; print('sklearn OK')"

# 4. Check Node modules
cd frontend
npm list react
# Should show react@18.x.x

# 5. Check files exist
dir ml_model.pkl
dir label_encoder.pkl
dir .env
```

## Getting Help

### Check Logs

**API Logs:**
- Look at terminal where `python api\app.py` is running
- Check for error messages

**Frontend Logs:**
- Look at terminal where `npm run dev` is running
- Check browser console (F12)

**Bot Logs:**
- Look at terminal where `python bot.py` is running

### Debug Mode

Enable debug mode for more information:

**API:**
```python
# In api/app.py
app.run(debug=True, host='0.0.0.0', port=5000)
```

**Frontend:**
```javascript
// In browser console
localStorage.setItem('debug', 'true')
```

### Common Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| "CORS error" | API not running or wrong URL | Start API, check URL |
| "Network Error" | API not accessible | Check API is running on port 5000 |
| "401 Unauthorized" | Not logged in or token expired | Login again |
| "403 Forbidden" | Not admin user | Use admin credentials |
| "500 Internal Server Error" | Server error | Check API logs |
| "Module not found" | Missing dependency | Run `pip install -r requirements.txt` |

## Still Having Issues?

1. **Check Documentation:**
   - README.md
   - START_HERE.md
   - docs/ folder

2. **Verify Environment:**
   - .env file configured correctly
   - All dependencies installed
   - Correct Python/Node versions

3. **Review Logs:**
   - API terminal output
   - Frontend terminal output
   - Browser console (F12)

4. **Test Components Individually:**
   - Test API: `curl http://localhost:5000/api/health`
   - Test Frontend: Open http://localhost:3000
   - Test Bot: Send message on Telegram

5. **Try Clean Install:**
   - Follow DEPLOYMENT_CHECKLIST.md
   - Start from scratch if needed

---

## Quick Command Reference

### Start Everything
```bash
start.bat
```

### Start Individual Components
```bash
# API only
venv\Scripts\activate
python api\app.py

# Frontend only
cd frontend
npm run dev

# Bot only
venv\Scripts\activate
python bot.py
```

### Check Status
```bash
# API health
curl http://localhost:5000/api/health

# Frontend
# Open http://localhost:3000 in browser

# Bot
# Send /start to bot on Telegram
```

### Stop Services
```bash
# Press Ctrl+C in each terminal window
```

---

**Remember**: Most issues are solved by ensuring both API (port 5000) and Frontend (port 3000) are running!
