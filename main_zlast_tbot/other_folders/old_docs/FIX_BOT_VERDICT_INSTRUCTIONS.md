# Fix Bot Verdict - Instructions ✅

## Problem

The bot is still showing "suspicious" for URLs where VT says "safe" and ML has low confidence. This is because:

1. The bot is running old code (needs restart)
2. The VT cache table has an old structure (needs migration)

## Solution

Follow these steps in order:

### Step 1: Stop the Bot

```bash
# Press Ctrl+C in the bot terminal to stop it
# Or close the bot terminal window
```

### Step 2: Stop the Backend (if running)

```bash
# Press Ctrl+C in the backend terminal to stop it
# Or close the backend terminal window
```

### Step 3: Fix the VT Cache Table

```bash
python fix_vt_cache_table.py
```

**Expected Output:**
```
Fixing VT cache table...
Dropping old vt_cache table...
Creating new vt_cache table...
✅ VT cache table fixed successfully!
   - Old table dropped
   - New table created with correct structure

Please restart the bot and backend for changes to take effect.
```

### Step 4: Restart the Backend

```bash
# Windows
start_backend.bat

# Or directly
python backend/app.py
```

### Step 5: Restart the Bot

```bash
# Windows
start_bot.bat

# Or directly
python bot/telegram_bot.py
```

### Step 6: Test the Bot

Send this to your bot:
```
/check https://google.com
```

**Expected Result:**
```
✅ URL Analysis Results
━━━━━━━━━━━━━━━━━━━━
🔗 https://google.com

📊 Final Verdict: BENIGN
🤖 ML: phishing (69.77%)
🛡️ VT: safe

✅ This URL appears safe.
```

## Verification

### Test Case 1: VT Safe + ML Uncertain
```
URL: https://google.com
VT: safe
ML: phishing (69.77% - below 85%)

Expected: BENIGN ✅
Old (wrong): SUSPICIOUS ❌
```

### Test Case 2: VT Safe + ML Confident
```
URL: https://example.com
VT: safe
ML: benign (95% - above 85%)

Expected: BENIGN ✅
```

### Test Case 3: VT Malicious
```
URL: http://malicious-site.com
VT: malicious
ML: benign (any confidence)

Expected: MALICIOUS ✅
```

### Test Case 4: VT Unavailable + ML Confident
```
URL: http://new-site.com
VT: unavailable
ML: malicious (95% - above 85%)

Expected: MALICIOUS ✅
```

### Test Case 5: VT Unavailable + ML Uncertain
```
URL: http://unknown-site.xyz
VT: unavailable
ML: phishing (70% - below 85%)

Expected: SUSPICIOUS ⚠️
```

## What Changed

### Old Logic (Wrong):
```python
if ml_conf < 0.85:
    if ml_label == "benign":
        return "benign"
    else:
        return "suspicious"  # ❌ Ignores VT safe result
```

### New Logic (Correct):
```python
if ml_conf < 0.85:
    if vt_result == "safe":
        return "benign"  # ✅ Trust VT over uncertain ML
    elif ml_label == "benign":
        return "benign"
    else:
        return "suspicious"  # Only when VT unavailable
```

## Troubleshooting

### Issue: Database is locked
**Solution:** Stop the bot and backend first, then run the fix script.

### Issue: Bot still shows old behavior
**Solution:** Make sure you restarted the bot after fixing the database.

### Issue: VT cache errors in logs
**Solution:** The fix script should resolve this. If not, manually delete the vt_cache table:
```sql
sqlite3 data/database/bot_data.db
DROP TABLE IF EXISTS vt_cache;
.quit
```
Then restart the bot (it will recreate the table).

### Issue: Bot not responding
**Solution:** Check if the bot token is correct in .env file:
```env
TELEGRAM_BOT_TOKEN=your_bot_token_here
```

## Quick Test Script

Create a file `test_verdict.py`:
```python
import sys
sys.path.insert(0, 'backend')

from services.virustotal import get_combined_verdict
from core.ml_detector import MLDetector

detector = MLDetector()

# Test URLs
test_urls = [
    "https://google.com",
    "https://example.com",
    "https://github.com"
]

print("Testing verdict logic...")
print("=" * 60)

for url in test_urls:
    verdict, conf, vt, ml, probs = get_combined_verdict(url, detector)
    print(f"\nURL: {url}")
    print(f"VT: {vt}")
    print(f"ML: {ml} ({conf:.2%})")
    print(f"Final: {verdict}")
    print("-" * 60)
```

Run it:
```bash
python test_verdict.py
```

## Summary

✅ **Steps to fix:**
1. Stop bot and backend
2. Run `python fix_vt_cache_table.py`
3. Restart backend
4. Restart bot
5. Test with `/check https://google.com`

✅ **Expected result:**
- VT safe + ML uncertain → BENIGN (not suspicious)
- Fewer false positives
- Better user experience

The bot will now correctly trust VirusTotal when ML is uncertain!
