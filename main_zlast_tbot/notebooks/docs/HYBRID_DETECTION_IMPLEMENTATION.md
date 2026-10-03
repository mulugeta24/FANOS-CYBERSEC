# Hybrid Detection System Implementation ✅

## Overview
The system now implements the exact hybrid detection design as specified in your documentation.

## Design Implementation

### 3.4.3 Hybrid Detection System

#### URL Feature Extraction
Located in: `backend/core/ml_detector.py`

For every submitted URL, the following 17 features are extracted:
1. `url_length` - Total length of URL
2. `num_dots` - Number of dots in URL
3. `num_hyphens` - Number of hyphens
4. `num_underscores` - Number of underscores
5. `num_slashes` - Number of slashes
6. `num_questionmarks` - Number of question marks
7. `num_equals` - Number of equals signs
8. `num_at` - Number of @ symbols
9. `num_ampersands` - Number of ampersands
10. `num_exclamations` - Number of exclamation marks
11. `num_spaces` - Number of spaces
12. `num_tildes` - Number of tildes
13. `num_commas` - Number of commas
14. `num_plus` - Number of plus signs
15. `num_asterisks` - Number of asterisks
16. `num_hashtags` - Number of hashtags
17. `num_percent` - Number of percent signs

Additional checks:
- Presence of suspicious keywords (login, verify, secure, account, update, confirm, banking, paypal)
- Number of subdomains
- Special character patterns

#### Two-Tiered Analysis

##### Tier 1: VirusTotal API (Primary Source of Truth)
Located in: `backend/services/virustotal.py`

**Process:**
1. **Check SQLite Cache First**
   - Before querying VirusTotal API, check if verdict is cached
   - Cache is valid for 24 hours (configurable)
   - Reduces API calls and improves response time

2. **Query VirusTotal API** (if not cached)
   - Uses VirusTotal API v3
   - Looks up URL using base64 encoding
   - Gets analysis from multiple antivirus engines

3. **Cache Result**
   - Stores verdict in SQLite database
   - Includes malicious/suspicious/harmless counts
   - Timestamp for expiry checking

**Verdict Mapping:**
- `malicious > 0` → "malicious"
- `suspicious > 2` → "suspicious"
- `harmless > 0 or undetected > 0` → "safe"
- `404 (not in database)` → "unavailable"
- `429 (rate limit)` → "rate_limited"
- `timeout/error` → "error"/"timeout"

##### Tier 2: Machine Learning Model (Fast Analysis)
Located in: `backend/core/ml_detector.py`

**Process:**
1. Extract 17 features from URL
2. Feed features to pre-trained XGBoost model
3. Get classification and confidence score
4. Return probabilities for all classes

**Model Output:**
- `ml_label`: Classification (benign, malicious, phishing, defacement)
- `ml_confidence`: Confidence score (0.0 - 1.0)
- `ml_probabilities`: Dict with probabilities for each class

#### Verdict Synthesis Logic

Located in: `backend/services/virustotal.py` → `get_combined_verdict()`

**Implementation follows exact design specification:**

```python
# Rule 1: VirusTotal malicious/suspicious → Override ML
if vt_result == "malicious":
    final_verdict = "malicious"  # VT overrides ML

elif vt_result == "suspicious":
    final_verdict = "suspicious"  # VT overrides ML

# Rule 2: VirusTotal benign/unknown → Use ML model
elif vt_result in ["safe", "unavailable", "error", "timeout", "rate_limited"]:
    
    # Rule 3: ML verdict only if confidence >= threshold (85%)
    if ml_confidence >= 0.85:
        final_verdict = ml_label  # Accept ML verdict
    
    # Rule 4: Low confidence → Label as benign (low confidence)
    else:
        if ml_label == "benign":
            final_verdict = "benign"  # Low confidence benign
        else:
            final_verdict = "suspicious"  # Low confidence malicious → cautious
```

**Decision Tree:**
```
URL Submitted
    ↓
[Extract Features] → ML Model (Tier 2)
    ↓                    ↓
[Check Cache]       [Get ML Prediction]
    ↓                    ↓
[Query VT API] ← [Tier 1]
    ↓
[Verdict Synthesis]
    ↓
    ├─ VT = malicious/suspicious? → Return VT verdict (Override ML)
    ├─ VT = benign/unknown?
    │   ├─ ML confidence >= 85%? → Return ML verdict
    │   └─ ML confidence < 85%? → Return "benign (low confidence)" or "suspicious"
    └─ Final Verdict
```

## Key Features

### 1. Caching System
- **Database:** SQLite (`data/database/bot_data.db`)
- **Table:** `vt_cache`
- **Expiry:** 24 hours (configurable via `CACHE_EXPIRY_HOURS`)
- **Benefits:**
  - Reduces API calls to VirusTotal
  - Faster response for repeated URLs
  - Avoids rate limiting

### 2. Confidence Threshold
- **Default:** 85% (`ml_threshold=0.85`)
- **Configurable:** Can be adjusted per request
- **Purpose:** Ensures ML predictions are reliable before accepting

### 3. Fallback Mechanism
- If VirusTotal unavailable → Use ML model
- If ML low confidence → Label as "suspicious" (cautious approach)
- System always provides a verdict

### 4. Logging
- Detailed logging at each step
- Shows ML prediction, VT result, and final verdict
- Helps with debugging and monitoring

## Example Flow

### Example 1: High Confidence Malicious
```
URL: https://secure-paypal-login.example/verify

[ML] Prediction: phishing, Confidence: 92%
[VT Cache] MISS - No cached result
[VT] Querying API for URL
[VT] URL not in database
[VT] Result: unavailable
[VERDICT] VirusTotal result: unavailable - Using ML model
[VERDICT] ML confidence 92% >= 85% - Accepting ML verdict
[FINAL] Verdict: phishing, ML: phishing (92%), VT: unavailable
```

### Example 2: VirusTotal Override
```
URL: https://known-malware-site.com

[ML] Prediction: benign, Confidence: 78%
[VT Cache] HIT - Using cached verdict: malicious (age: 2.3h)
[VT] Result: malicious
[VERDICT] VirusTotal detected malicious - OVERRIDING ML
[FINAL] Verdict: malicious, ML: benign (78%), VT: malicious
```

### Example 3: Low Confidence
```
URL: https://example.com

[ML] Prediction: benign, Confidence: 65%
[VT Cache] MISS - No cached result
[VT] Querying API for URL
[VT] Results - Malicious: 0, Suspicious: 0, Harmless: 85
[VT] Result: safe
[VERDICT] VirusTotal result: safe - Using ML model
[VERDICT] ML confidence 65% < 85% - Low confidence
[FINAL] Verdict: benign, ML: benign (65%), VT: safe
```

## Configuration

### Environment Variables
```bash
# .env file
VT_API_KEY=your_virustotal_api_key_here
VIRUSTOTAL_API_KEY=your_virustotal_api_key_here  # Alternative name
```

### Adjustable Parameters
```python
# In backend/services/virustotal.py
CACHE_EXPIRY_HOURS = 24  # Cache validity period

# In function calls
ml_threshold = 0.85  # Confidence threshold (85%)
```

## Database Schema

### VT Cache Table
```sql
CREATE TABLE vt_cache (
    url TEXT PRIMARY KEY,
    verdict TEXT NOT NULL,
    malicious INTEGER,
    suspicious INTEGER,
    harmless INTEGER,
    timestamp INTEGER NOT NULL
)
```

## API Response Format

```json
{
  "url": "https://example.com",
  "final_verdict": "benign",
  "ml_prediction": "benign",
  "ml_confidence": 0.92,
  "ml_probs": {
    "benign": 0.92,
    "malicious": 0.03,
    "phishing": 0.03,
    "defacement": 0.02
  },
  "vt_result": "safe",
  "timestamp": "2026-02-20T20:15:30"
}
```

## Benefits of This Design

1. **Accuracy:** VirusTotal's extensive threat intelligence as primary source
2. **Speed:** ML model provides fast analysis, cache reduces API calls
3. **Reliability:** Fallback mechanisms ensure system always works
4. **Efficiency:** Caching reduces API usage and costs
5. **Transparency:** Clear logging shows decision-making process
6. **Flexibility:** Configurable thresholds and parameters

## Testing

### Test URLs
1. **Benign:** `https://google.com`
2. **Phishing:** `https://secure-paypal-login.example/verify`
3. **Unknown:** `https://random-new-site-12345.com`

### Expected Behavior
- Known malicious URLs → VirusTotal overrides ML
- Unknown URLs → ML model with confidence check
- Low confidence → Cautious verdict (suspicious)

## Files Modified

1. `backend/services/virustotal.py` - Hybrid detection logic + caching
2. `backend/core/ml_detector.py` - Feature extraction (17 features)
3. `backend/app.py` - API endpoints using hybrid system
4. `bot/telegram_bot.py` - Bot using hybrid system

## System Status

✅ URL Feature Extraction (17 features)
✅ Tier 1: VirusTotal API with caching
✅ Tier 2: ML Model (XGBoost)
✅ Verdict Synthesis Logic
✅ Confidence Threshold (85%)
✅ Fallback Mechanisms
✅ Detailed Logging
✅ Database Caching

**The hybrid detection system is now fully implemented according to your design specification!**
