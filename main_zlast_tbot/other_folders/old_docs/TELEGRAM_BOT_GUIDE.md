# 🤖 Telegram Bot User Guide

## Overview

The Malicious URL Detector Bot allows users to check URLs for threats directly through Telegram. It features two user levels: regular users and admins.

---

## 🌟 For Regular Users

### Getting Started

1. **Start the bot**
   ```
   /start
   ```
   - No password required!
   - You can immediately start checking URLs

2. **Check a URL**
   - Just paste any URL:
     ```
     https://example.com
     ```
   - Or use the command:
     ```
     /check https://example.com
     ```

3. **View Results**
   - Get instant analysis with:
     - 📊 Final verdict
     - 🤖 ML prediction
     - 🛡️ VirusTotal result
     - ⚠️ Safety recommendations

4. **Report Results**
   - Click "📝 Report Result" button after checking
   - Or use `/report` command
   - Select the correct category:
     - ✅ Benign (safe)
     - 🚨 Malicious (dangerous)
     - 🎣 Phishing (scam)
     - ⚠️ Defacement (hacked site)

### Available Commands

```
/start - Start the bot
/check <url> - Check a URL
/stats - View detection statistics
/report - Report last checked URL
/help - Show help message
```

### Example Usage

```
User: https://google.com

Bot: ✅ URL Analysis Results
━━━━━━━━━━━━━━━━━━━━
🔗 https://google.com

📊 Final Verdict: BENIGN
🤖 ML Prediction: benign (95.2%)
🛡️ VirusTotal: benign

✅ This URL appears to be safe.

[📝 Report Result]
```

---

## 🔧 For Admins

### Admin Authentication

1. **Authenticate as admin**
   ```
   /adminsec <password>
   ```
   - Use the password from your `.env` file
   - Default: `admin123` (change this!)

2. **Successful authentication**
   ```
   ✅ Admin Authentication Successful!
   
   Welcome, Admin!
   
   🔧 Admin Commands:
   /admin - Admin panel
   /viewreports - View all user reports
   /viewurls - View recently checked URLs
   /cleardata - Clear statistics
   /systeminfo - System information
   ```

### Admin Commands

#### View Admin Panel
```
/admin
```
Shows:
- System statistics
- Recent reports
- User counts
- Available commands

#### View All Reports
```
/viewreports
/viewreports 20  # View last 20 reports
```
Shows:
- User-submitted reports
- URL classifications
- ML and VT results
- User IDs

#### View Checked URLs
```
/viewurls
```
Shows:
- Recently checked URLs
- Verdicts
- User IDs
- Detection details

#### System Information
```
/systeminfo
```
Shows:
- ML model status
- VirusTotal status
- Database statistics
- User counts
- Configuration status

#### Clear Statistics
```
/cleardata CONFIRM
```
- ⚠️ WARNING: Deletes all statistics!
- Requires CONFIRM parameter
- Preserves database structure

### Admin Features

1. **Monitor User Activity**
   - See all checked URLs
   - View user reports
   - Track detection accuracy

2. **System Management**
   - Check system health
   - View configuration
   - Clear old data

3. **User Reports**
   - Review false positives
   - Improve detection accuracy
   - Track user feedback

---

## 📊 Statistics

### For All Users
```
/stats
```
Shows:
- Total URLs checked
- Malicious detections
- Safe URLs
- Report breakdown by category

### Example Output
```
📊 Detection Statistics
━━━━━━━━━━━━━━━━━━━━
🔍 Total URLs checked: 1523
🚨 Malicious detections: 234
✅ Safe URLs: 1289

📝 User Reports:
✅ Benign: 45
🚨 Malicious: 12
🎣 Phishing: 8
⚠️ Defacement: 3
```

---

## 🎯 Best Practices

### For Users

1. **Check Before Clicking**
   - Always check suspicious URLs before visiting
   - Share the bot with friends for safety

2. **Report Incorrect Results**
   - Help improve detection accuracy
   - Use the report feature after each check

3. **Stay Safe**
   - Don't visit URLs marked as malicious
   - Be cautious with "suspicious" verdicts

### For Admins

1. **Secure Your Password**
   - Change default admin password
   - Don't share admin credentials
   - Use strong, unique password

2. **Monitor Regularly**
   - Check reports weekly
   - Review system health
   - Update ML model monthly

3. **Backup Data**
   - Export reports regularly
   - Keep statistics for analysis
   - Document false positives

---

## 🔐 Security

### User Privacy
- User IDs are hashed in reports
- URLs are not shared publicly
- No personal data collected

### Admin Security
- Password-protected admin access
- Separate authentication from regular users
- Logged admin actions

---

## 🐛 Troubleshooting

### Bot Not Responding
1. Check if bot is running
2. Verify bot token in `.env`
3. Check internet connection
4. Contact administrator

### Can't Authenticate as Admin
1. Verify password in `.env` file
2. Check for typos
3. Ensure ADMIN_PASSWORD is set
4. Try `/adminsec <password>` again

### URL Check Fails
1. Verify URL format (include http:// or https://)
2. Check if ML model is loaded
3. Try again in a few seconds
4. Contact admin if persists

### Report Not Working
1. Check a URL first
2. Use `/report` command
3. Or click "Report Result" button
4. Contact admin if issue persists

---

## 📱 Quick Reference

### Regular User Flow
```
1. /start
2. Paste URL
3. View results
4. Click "Report Result" (optional)
5. Select category
```

### Admin Flow
```
1. /adminsec <password>
2. /admin (view panel)
3. /viewreports (check reports)
4. /viewurls (monitor activity)
5. /systeminfo (check health)
```

---

## 💡 Tips

### For Users
- You can check multiple URLs in a row
- No need to use `/check` - just paste URLs
- Report helps improve the system
- Check URLs before sharing them

### For Admins
- Review reports regularly for false positives
- Monitor system info for issues
- Clear old data periodically
- Keep admin password secure
- Check logs for suspicious activity

---

## 🆘 Support

### Need Help?
1. Use `/help` command in bot
2. Check this guide
3. Contact system administrator
4. Review main documentation

### Admin Support
1. Check logs in terminal
2. Review `TROUBLESHOOTING.md`
3. Check system status with `/systeminfo`
4. Verify configuration in `.env`

---

## 🎉 Features Summary

### ✅ User Features
- Instant URL checking
- No authentication required
- ML + VirusTotal analysis
- Easy reporting system
- Statistics viewing

### ✅ Admin Features
- Password-protected access
- View all reports
- Monitor checked URLs
- System information
- Clear statistics
- User activity tracking

---

**Bot is ready to use! Start checking URLs now! 🚀**
