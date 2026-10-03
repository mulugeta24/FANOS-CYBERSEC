# API Reference

## Bot Commands

### User Commands

#### /start
**Description**: Initialize bot and display welcome message
**Usage**: `/start`
**Response**: Welcome message with command list
**Example**:
```
User: /start
Bot: 🔎 Malicious URL Detector

Simply paste a URL to check for threats!

Commands:
/check <url> - Check a URL
/stats - View statistics
/report - Report false positive/negative
/help - Show this message
```

#### /help
**Description**: Display help information and available commands
**Usage**: `/help`
**Response**: Detailed command descriptions

#### /check <url>
**Description**: Check a specific URL for threats
**Usage**: `/check <url>`
**Parameters**:
- `url`: URL to check (with or without http/https)
**Example**:
```
User: /check example.com
Bot: ✅ URL Analysis Results
━━━━━━━━━━━━━━━━━━━━
🔗 URL: http://example.com

📊 Final Verdict: BENIGN
🤖 ML Prediction: benign
🛡️ VirusTotal: benign
```

#### /stats
**Description**: View detection and reporting statistics
**Usage**: `/stats`
**Response**: Statistical summary
**Example**:
```
📊 Detection Statistics
━━━━━━━━━━━━━━━━━━━━
🔍 Total URLs checked: 1523
🚨 Malicious detections: 234

📝 User Reports:
✅ Benign: 45
🚨 Malicious: 12
🎣 Phishing: 8
⚠️ Defacement: 3
```

#### /report
**Description**: Report classification for last checked URL
**Usage**: `/report`
**Preconditions**: Must have checked a URL in current session
**Response**: Report interface with category buttons

---

## Python API

### database.py

#### init_db()
```python
def init_db() -> None
```
**Description**: Initialize database with required tables
**Returns**: None
**Side Effects**: Creates database file and tables if not exist

#### get_stat(key: str) -> int
```python
def get_stat(key: str) -> int
```
**Description**: Retrieve a statistic value
**Parameters**:
- `key`: Statistic identifier
**Returns**: Integer value (0 if not found)
**Example**:
```python
total = database.get_stat("total_checked")
```

#### increment_stat(key: str) -> None
```python
def increment_stat(key: str) -> None
```
**Description**: Increment a statistic counter
**Parameters**:
- `key`: Statistic identifier
**Side Effects**: Creates key if not exists, increments by 1

#### get_cache(url: str) -> str | None
```python
def get_cache(url: str) -> str | None
```
**Description**: Retrieve cached VirusTotal result
**Parameters**:
- `url`: URL to lookup
**Returns**: Result string or None if not cached

#### set_cache(url: str, result: str) -> None
```python
def set_cache(url: str, result: str) -> None
```
**Description**: Store VirusTotal result in cache
**Parameters**:
- `url`: URL to cache
- `result`: Result to store

#### add_report(...) -> int
```python
def add_report(
    url: str,
    report_type: str,
    ml_prediction: str = None,
    vt_result: str = None,
    user_id: int = None,
    notes: str = None
) -> int
```
**Description**: Add user report to database
**Parameters**:
- `url`: Reported URL
- `report_type`: Category (benign/malicious/phishing/defacement)
- `ml_prediction`: ML model's prediction
- `vt_result`: VirusTotal result
- `user_id`: Telegram user ID
- `notes`: Additional notes
**Returns**: Report ID

#### get_reports(limit: int = 50) -> list
```python
def get_reports(limit: int = 50) -> list
```
**Description**: Retrieve recent reports
**Parameters**:
- `limit`: Maximum number of reports
**Returns**: List of report tuples

#### get_report_stats() -> dict
```python
def get_report_stats() -> dict
```
**Description**: Get aggregated report statistics
**Returns**: Dictionary mapping report_type to count

---

### ml_model.py

#### MLDetector.__init__(model_path, label_encoder_path)
```python
def __init__(self, model_path: str, label_encoder_path: str)
```
**Description**: Initialize ML detector with trained model
**Parameters**:
- `model_path`: Path to pickled model file
- `label_encoder_path`: Path to pickled label encoder

#### MLDetector.predict(url: str) -> str
```python
def predict(self, url: str) -> str
```
**Description**: Predict URL category
**Parameters**:
- `url`: URL to classify
**Returns**: Category label

#### MLDetector.predict_with_prob(url: str) -> tuple
```python
def predict_with_prob(self, url: str) -> tuple
```
**Description**: Predict with confidence scores
**Parameters**:
- `url`: URL to classify
**Returns**: Tuple of (label, confidence, probabilities_dict)

---

### utils.py

#### get_combined_verdict(url, detector, ml_threshold) -> tuple
```python
def get_combined_verdict(
    url: str,
    detector: MLDetector,
    ml_threshold: float = 0.85
) -> tuple
```
**Description**: Combine ML and VirusTotal results
**Parameters**:
- `url`: URL to analyze
- `detector`: MLDetector instance
- `ml_threshold`: Confidence threshold for ML
**Returns**: Tuple of (final_verdict, ml_conf, vt_result, ml_label, ml_probs)
**Logic**:
1. Check VirusTotal (cached or API)
2. Run ML prediction
3. If VT says malicious/suspicious, use VT result
4. If phishing with <95% confidence, mark as benign
5. If ML confidence >= threshold, use ML result
6. Otherwise, mark as "benign (low confidence)"

---

### vt_api.py

#### get_vt_report(url: str) -> str
```python
def get_vt_report(url: str) -> str
```
**Description**: Query VirusTotal API for URL report
**Parameters**:
- `url`: URL to check
**Returns**: Result string (malicious/suspicious/benign/unknown)
**Raises**: Exception on API errors

---

### vt_cache.py

#### get_cached(url: str) -> str | None
```python
def get_cached(url: str) -> str | None
```
**Description**: Get cached VirusTotal result with URL normalization
**Parameters**:
- `url`: URL to lookup
**Returns**: Cached result or None

#### set_cache(url: str, result: str) -> None
```python
def set_cache(url: str, result: str) -> None
```
**Description**: Cache VirusTotal result with validation
**Parameters**:
- `url`: URL to cache
- `result`: Result to store (must be valid category)

---

## External APIs

### VirusTotal API v3

**Endpoint**: `https://www.virustotal.com/api/v3/urls`

**Authentication**: API Key in header
```
x-apikey: YOUR_API_KEY
```

**Rate Limits**:
- Free tier: 4 requests/minute
- Premium: Higher limits

**Request**:
```http
POST /api/v3/urls
Content-Type: application/x-www-form-urlencoded

url=http://example.com
```

**Response**:
```json
{
  "data": {
    "id": "url_id",
    "attributes": {
      "last_analysis_stats": {
        "malicious": 0,
        "suspicious": 0,
        "harmless": 85
      }
    }
  }
}
```
