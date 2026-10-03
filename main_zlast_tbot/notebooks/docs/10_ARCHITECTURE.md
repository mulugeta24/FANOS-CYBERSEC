# System Architecture

## Architecture Overview

### Layered Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                       │
│                  (Telegram Bot Interface)                   │
├─────────────────────────────────────────────────────────────┤
│                    Application Layer                        │
│              (Business Logic & Handlers)                    │
├─────────────────────────────────────────────────────────────┤
│                    Service Layer                            │
│         (ML Detection, VT Integration, Utils)               │
├─────────────────────────────────────────────────────────────┤
│                    Data Access Layer                        │
│              (Database Operations)                          │
├─────────────────────────────────────────────────────────────┤
│                    Data Layer                               │
│                  (SQLite Database)                          │
└─────────────────────────────────────────────────────────────┘
```

## Component Architecture

### 1. Presentation Layer

**Components**:
- Telegram Bot API Client
- Command Handlers
- Callback Query Handlers
- Message Handlers

**Responsibilities**:
- Receive user input
- Format responses
- Manage inline keyboards
- Handle user sessions

**Technologies**:
- python-telegram-bot library
- Async/await pattern

---

### 2. Application Layer

**Components**:
- URL Check Handler
- Report Handler
- Statistics Handler
- Session Manager

**Responsibilities**:
- Coordinate between layers
- Implement business rules
- Manage user sessions
- Error handling

**Key Functions**:
```python
check_url_handler()    # Main URL analysis workflow
button_callback()      # Handle report submissions
stats()               # Aggregate and display statistics
report_command()      # Manage reporting interface
```

---

### 3. Service Layer

#### ML Detection Service
**File**: `ml_model.py`

**Components**:
- Feature Extractor
- Model Predictor
- Confidence Calculator

**Workflow**:
```
URL → Extract Features → Model Prediction → Confidence Score
```

#### VirusTotal Integration
**Files**: `vt_api.py`, `vt_cache.py`

**Components**:
- API Client
- Cache Manager
- Result Parser

**Workflow**:
```
URL → Check Cache → [Miss] → API Call → Parse → Cache → Return
      ↓
    [Hit] → Return
```

#### Utils Service
**File**: `utils.py`

**Components**:
- Verdict Combiner
- Decision Logic Engine

**Algorithm**:
```python
if vt_result in ["malicious", "suspicious"]:
    return vt_result
elif ml_label == "phishing" and ml_conf < 0.95:
    return "benign"
elif ml_conf >= threshold:
    return ml_label
else:
    return "benign (low confidence)"
```

---

### 4. Data Access Layer

**File**: `database.py`

**Components**:
- Connection Manager
- Query Builder
- Transaction Handler

**Features**:
- Thread-local connections
- Automatic commit/rollback
- Connection pooling
- Error recovery

**Pattern**: Repository Pattern
```python
class DatabaseRepository:
    - get_stat()
    - increment_stat()
    - get_cache()
    - set_cache()
    - add_report()
    - get_reports()
```

---

### 5. Data Layer

**Technology**: SQLite with WAL mode

**Optimizations**:
- Write-Ahead Logging
- Synchronous=NORMAL
- Busy timeout
- Thread-local connections

---

## Data Flow Diagrams

### URL Check Flow

```
┌──────┐
│ User │
└───┬──┘
    │ 1. Send URL
    ▼
┌────────────┐
│    Bot     │
└─────┬──────┘
      │ 2. Normalize
      ▼
┌────────────┐
│   Utils    │
└─────┬──────┘
      │ 3. Get Combined Verdict
      ├─────────────────┬──────────────┐
      ▼                 ▼              ▼
┌──────────┐      ┌──────────┐   ┌─────────┐
│ VT Cache │      │ VT API   │   │ML Model │
└─────┬────┘      └─────┬────┘   └────┬────┘
      │                 │              │
      │ 4. Results      │              │
      └─────────────────┴──────────────┘
                        │
                        ▼
                  ┌──────────┐
                  │ Combine  │
                  └─────┬────┘
                        │ 5. Final Verdict
                        ▼
                  ┌──────────┐
                  │ Database │
                  │ (Stats)  │
                  └─────┬────┘
                        │ 6. Display
                        ▼
                  ┌──────────┐
                  │   User   │
                  └──────────┘
```

### Report Flow

```
┌──────┐
│ User │
└───┬──┘
    │ 1. Click Button
    ▼
┌────────────┐
│    Bot     │
└─────┬──────┘
      │ 2. Get Session Data
      ▼
┌────────────┐
│  Memory    │
│  (Session) │
└─────┬──────┘
      │ 3. Report Data
      ▼
┌────────────┐
│  Database  │
│  (Reports) │
└─────┬──────┘
      │ 4. Confirmation
      ▼
┌────────────┐
│    User    │
└────────────┘
```

---

## Design Patterns

### 1. Repository Pattern
**Used in**: Database layer
**Purpose**: Abstract data access logic

```python
class DatabaseRepository:
    def get_stat(key): ...
    def increment_stat(key): ...
```

### 2. Singleton Pattern
**Used in**: Database connections (thread-local)
**Purpose**: One connection per thread

```python
_local = threading.local()

def _get_connection():
    if not hasattr(_local, 'connection'):
        _local.connection = sqlite3.connect(...)
    return _local.connection
```

### 3. Strategy Pattern
**Used in**: Verdict combination
**Purpose**: Different decision strategies

```python
def get_combined_verdict(url, detector, threshold):
    # Strategy: VT priority
    if vt_result in ["malicious", "suspicious"]:
        return vt_result
    
    # Strategy: ML with threshold
    if ml_conf >= threshold:
        return ml_label
```

### 4. Facade Pattern
**Used in**: Utils module
**Purpose**: Simplify complex subsystem

```python
def get_combined_verdict(...):
    # Facade for VT + ML + Cache
    vt_result = get_cached(url) or get_vt_report(url)
    ml_result = detector.predict_with_prob(url)
    return combine_results(vt_result, ml_result)
```

---

## Concurrency Model

### Threading Model
```
Main Thread
    │
    ├─ Telegram Polling Thread
    │   ├─ Handler Thread 1
    │   ├─ Handler Thread 2
    │   └─ Handler Thread N
    │
    └─ Database Connections (Thread-local)
```

### Async/Await Pattern
```python
async def check_url_handler(update, context):
    # Async handler
    result = get_combined_verdict(...)  # Sync call
    await update.message.reply_text(...)  # Async call
```

---

## Security Architecture

### Defense Layers

1. **Input Validation**
   - URL normalization
   - SQL injection prevention (parameterized queries)
   - Input sanitization

2. **Authentication**
   - Telegram user verification
   - Bot token security
   - API key protection

3. **Data Protection**
   - Environment variables for secrets
   - File permissions
   - Database encryption (optional)

4. **Rate Limiting**
   - VirusTotal API limits
   - User request throttling (future)

---

## Scalability Considerations

### Current Limitations
- SQLite (single-writer)
- Single-instance deployment
- In-memory session storage

### Scaling Strategies

**Vertical Scaling** (Recommended):
- Increase server resources
- Optimize queries
- Add caching layers

**Horizontal Scaling** (Requires changes):
- Migrate to PostgreSQL
- Implement Redis for sessions
- Load balancer for multiple instances

---

## Performance Optimization

### Database Optimizations
1. WAL mode for concurrent reads
2. Thread-local connections
3. Prepared statements
4. Index optimization

### Caching Strategy
1. VirusTotal results (persistent)
2. Statistics (query optimization)
3. Session data (in-memory)

### Async Operations
1. Non-blocking I/O
2. Concurrent API calls
3. Background tasks

---

## Error Handling Strategy

### Error Hierarchy
```
Exception
    │
    ├─ DatabaseError
    │   ├─ ConnectionError
    │   └─ LockError
    │
    ├─ APIError
    │   ├─ VTAPIError
    │   └─ TelegramAPIError
    │
    └─ ValidationError
        ├─ URLValidationError
        └─ InputValidationError
```

### Recovery Strategies
1. **Retry with backoff**: API failures
2. **Fallback**: Use cached data
3. **Graceful degradation**: Continue without stats
4. **User notification**: Inform about errors
