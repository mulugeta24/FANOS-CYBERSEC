# Database Schema Documentation

## Overview
The system uses SQLite as the embedded database with Write-Ahead Logging (WAL) mode for improved concurrency.

## Database File
- **Filename**: `bot_data.db`
- **Location**: Project root directory
- **Mode**: WAL (Write-Ahead Logging)
- **Encoding**: UTF-8

## Tables

### 1. stats
Stores system-wide statistics and counters.

```sql
CREATE TABLE stats (
    key TEXT PRIMARY KEY,
    value INTEGER DEFAULT 0
);
```

**Columns**:
- `key` (TEXT, PRIMARY KEY): Statistic identifier
- `value` (INTEGER): Counter value

**Common Keys**:
- `total_checked`: Total URLs analyzed
- `malicious`: Count of malicious detections
- `reports_benign`: Count of benign reports
- `reports_malicious`: Count of malicious reports
- `reports_phishing`: Count of phishing reports
- `reports_defacement`: Count of defacement reports

**Indexes**: Primary key on `key`

**Example Data**:
```
key                  | value
---------------------|-------
total_checked        | 1523
malicious            | 234
reports_benign       | 45
reports_malicious    | 12
reports_phishing     | 8
reports_defacement   | 3
```

---

### 2. vt_cache
Caches VirusTotal API results to reduce API calls and improve response time.

```sql
CREATE TABLE vt_cache (
    url TEXT PRIMARY KEY,
    result TEXT,
    timestamp INTEGER
);
```

**Columns**:
- `url` (TEXT, PRIMARY KEY): Full URL that was checked
- `result` (TEXT): VirusTotal verdict (malicious/suspicious/benign/unknown)
- `timestamp` (INTEGER): Unix timestamp of cache entry

**Indexes**: Primary key on `url`

**Cache Duration**: No automatic expiration (can be implemented)

**Example Data**:
```
url                          | result     | timestamp
----------------------------|------------|------------
http://example.com          | benign     | 1708387200
http://malicious-site.com   | malicious  | 1708387300
http://phishing-site.com    | suspicious | 1708387400
```

---

### 3. reports
Stores user feedback and classification reports.

```sql
CREATE TABLE reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    url TEXT NOT NULL,
    report_type TEXT NOT NULL,
    ml_prediction TEXT,
    vt_result TEXT,
    user_id INTEGER,
    timestamp INTEGER DEFAULT (strftime('%s', 'now')),
    notes TEXT
);
```

**Columns**:
- `id` (INTEGER, PRIMARY KEY): Auto-incrementing report ID
- `url` (TEXT, NOT NULL): URL that was reported
- `report_type` (TEXT, NOT NULL): User's classification
  - Values: `benign`, `malicious`, `phishing`, `defacement`
- `ml_prediction` (TEXT): ML model's prediction at time of check
- `vt_result` (TEXT): VirusTotal result at time of check
- `user_id` (INTEGER): Telegram user ID
- `timestamp` (INTEGER): Unix timestamp of report
- `notes` (TEXT): Additional context or comments

**Indexes**: 
- Primary key on `id`
- Consider adding index on `report_type` for statistics queries
- Consider adding index on `user_id` for user-specific queries

**Example Data**:
```
id | url                    | report_type | ml_prediction | vt_result  | user_id   | timestamp  | notes
---|------------------------|-------------|---------------|------------|-----------|------------|------------------
1  | http://example.com     | benign      | benign        | benign     | 123456789 | 1708387200 | User confirmed...
2  | http://bad-site.com    | malicious   | benign        | suspicious | 987654321 | 1708387300 | User classified...
3  | http://phish-site.com  | phishing    | phishing      | malicious  | 123456789 | 1708387400 | User classified...
```

---

## Entity Relationship Diagram

```
┌─────────────────┐
│     stats       │
├─────────────────┤
│ key (PK)        │
│ value           │
└─────────────────┘

┌─────────────────┐
│   vt_cache      │
├─────────────────┤
│ url (PK)        │
│ result          │
│ timestamp       │
└─────────────────┘

┌─────────────────┐
│    reports      │
├─────────────────┤
│ id (PK)         │
│ url             │
│ report_type     │
│ ml_prediction   │
│ vt_result       │
│ user_id         │
│ timestamp       │
│ notes           │
└─────────────────┘
```

## Database Operations

### Connection Management
- **Thread-local connections**: Each thread maintains its own connection
- **Autocommit mode**: `isolation_level=None` for automatic commits
- **Timeout**: 30 seconds for lock acquisition
- **Busy timeout**: 30000ms for retry on busy database

### PRAGMA Settings
```sql
PRAGMA journal_mode=WAL;        -- Write-Ahead Logging
PRAGMA synchronous=NORMAL;      -- Balance safety and speed
PRAGMA busy_timeout=30000;      -- 30 second busy timeout
```

### Common Queries

**Get Statistic**:
```sql
SELECT value FROM stats WHERE key = ?;
```

**Increment Statistic**:
```sql
INSERT INTO stats (key, value) VALUES (?, 1) 
ON CONFLICT(key) DO UPDATE SET value = value + 1;
```

**Get Cached Result**:
```sql
SELECT result FROM vt_cache WHERE url = ?;
```

**Set Cache**:
```sql
INSERT INTO vt_cache (url, result, timestamp) 
VALUES (?, ?, strftime('%s', 'now')) 
ON CONFLICT(url) DO UPDATE SET 
    result = ?, 
    timestamp = strftime('%s', 'now');
```

**Add Report**:
```sql
INSERT INTO reports (url, report_type, ml_prediction, vt_result, user_id, notes)
VALUES (?, ?, ?, ?, ?, ?);
```

**Get Report Statistics**:
```sql
SELECT report_type, COUNT(*) as count
FROM reports
GROUP BY report_type;
```

## Performance Considerations

### Indexes
Current indexes are sufficient for small to medium datasets. For large datasets, consider:
- Index on `reports.timestamp` for time-based queries
- Index on `reports.user_id` for user analytics
- Index on `vt_cache.timestamp` for cache cleanup

### Maintenance
- **Vacuum**: Run periodically to reclaim space
- **Analyze**: Update statistics for query optimizer
- **Cache cleanup**: Implement periodic cleanup of old cache entries

### Backup Strategy
```bash
# Online backup (WAL mode)
sqlite3 bot_data.db ".backup bot_data_backup.db"

# Or use file copy when bot is stopped
cp bot_data.db bot_data_backup.db
```
