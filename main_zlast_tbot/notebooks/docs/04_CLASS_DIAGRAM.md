# Class Diagram

## UML Class Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         Bot Module                          │
├─────────────────────────────────────────────────────────────┤
│ - TOKEN: str                                                │
│ - detector: MLDetector                                      │
│ - DEFAULT_ML_THRESHOLD: float = 0.85                        │
│ - user_last_check: dict                                     │
├─────────────────────────────────────────────────────────────┤
│ + normalize_url(url: str): str                              │
│ + start(update, context): async                             │
│ + help_command(update, context): async                      │
│ + stats(update, context): async                             │
│ + report_command(update, context): async                    │
│ + check_url_handler(update, context): async                 │
│ + button_callback(update, context): async                   │
│ + main(): void                                              │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ uses
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      MLDetector                             │
├─────────────────────────────────────────────────────────────┤
│ - model: sklearn.Model                                      │
│ - label_encoder: LabelEncoder                               │
│ - model_path: str                                           │
│ - label_encoder_path: str                                   │
├─────────────────────────────────────────────────────────────┤
│ + __init__(model_path, label_encoder_path)                  │
│ + extract_features(url: str): array                         │
│ + predict(url: str): str                                    │
│ + predict_with_prob(url: str): tuple                        │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ uses
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      Utils Module                           │
├─────────────────────────────────────────────────────────────┤
│ + get_combined_verdict(url, detector, threshold): tuple     │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ uses
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    VT Cache Module                          │
├─────────────────────────────────────────────────────────────┤
│ + get_cached(url: str): str                                 │
│ + set_cache(url: str, result: str): void                    │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ uses
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     VT API Module                           │
├─────────────────────────────────────────────────────────────┤
│ - VT_API_KEY: str                                           │
│ - VT_API_URL: str                                           │
├─────────────────────────────────────────────────────────────┤
│ + get_vt_report(url: str): str                              │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ uses
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Database Module                          │
├─────────────────────────────────────────────────────────────┤
│ - DB_FILE: str = "bot_data.db"                              │
│ - _local: threading.local                                   │
├─────────────────────────────────────────────────────────────┤
│ + _get_connection(): Connection                             │
│ + init_db(): void                                           │
│ + get_stat(key: str): int                                   │
│ + increment_stat(key: str): void                            │
│ + get_cache(url: str): str                                  │
│ + set_cache(url: str, result: str): void                    │
│ + add_report(...): int                                      │
│ + get_reports(limit: int): list                             │
│ + get_report_stats(): dict                                  │
│ + close_db_connections(): void                              │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ manages
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    SQLite Database                          │
├─────────────────────────────────────────────────────────────┤
│ Table: stats                                                │
│   - key: TEXT (PK)                                          │
│   - value: INTEGER                                          │
├─────────────────────────────────────────────────────────────┤
│ Table: vt_cache                                             │
│   - url: TEXT (PK)                                          │
│   - result: TEXT                                            │
│   - timestamp: INTEGER                                      │
├─────────────────────────────────────────────────────────────┤
│ Table: reports                                              │
│   - id: INTEGER (PK, AUTOINCREMENT)                         │
│   - url: TEXT                                               │
│   - report_type: TEXT                                       │
│   - ml_prediction: TEXT                                     │
│   - vt_result: TEXT                                         │
│   - user_id: INTEGER                                        │
│   - timestamp: INTEGER                                      │
│   - notes: TEXT                                             │
└─────────────────────────────────────────────────────────────┘
```

## Class Relationships

### Composition
- Bot → MLDetector (Bot owns detector instance)
- Database → SQLite (Database manages SQLite connection)

### Dependency
- Bot → Database (Bot uses database functions)
- Bot → Utils (Bot uses utility functions)
- Utils → VT Cache (Utils uses cache functions)
- Utils → VT API (Utils queries VirusTotal)
- VT Cache → Database (Cache uses database)

### Association
- User ↔ Bot (User interacts with bot)
- Bot ↔ Telegram API (Bot communicates via API)
