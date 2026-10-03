# PostgreSQL Setup & Migration Guide

This guide provides complete instructions for configuring, migrating, and running the **Malicious URL Detector System** with **PostgreSQL**.

---

## 1. Prerequisites

* **PostgreSQL**: Version 14+ (Tested and verified with **PostgreSQL 18.6 x64**).
* **Python**: 3.8+ with virtual environment (`psycopg2-binary` installed).
* **Node.js**: 16+ for the Vite React frontend.

---

## 2. PostgreSQL Configuration

### 2.1 Starting PostgreSQL Service

If using the installed Windows service:
```powershell
# Check service status
Get-Service -Name postgresql*
```

If using a dedicated local instance:
```powershell
& "C:\Program Files\PostgreSQL\18\bin\pg_ctl.exe" -D "data\postgres_data" start
```

### 2.2 Database and User Creation

Connect via `psql` to create the database and configure the user:
```sql
-- 1. Create database
CREATE DATABASE malicious_url_detector;

-- 2. Configure password for user
ALTER USER postgres WITH PASSWORD 'postgres';

-- 3. Grant privileges
GRANT ALL PRIVILEGES ON DATABASE malicious_url_detector TO postgres;
```

---

## 3. Environment Variables Configuration (`.env`)

Configure your `.env` file in the project root:

```env
# ========================================
# Database Configuration (PostgreSQL)
# ========================================
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/urldb
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=urldb
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres

# ========================================
# Telegram Bot Configuration
# ========================================
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
ADMIN_USER_IDS=123456789
ADMIN_PASSWORD=admin123

# ========================================
# VirusTotal API Configuration
# ========================================
VT_API_KEY=your_virustotal_api_key_here

# ========================================
# Web API & Admin Dashboard Configuration
# ========================================
SECRET_KEY=your-secret-jwt-key
ADMIN_USERNAME=admin
```

> **Note**: For production, change `POSTGRES_PASSWORD`, `SECRET_KEY`, and `ADMIN_PASSWORD` to secure values.

---

## 4. SQLite to PostgreSQL Data Migration

The project includes an automated, idempotent migration script: [migrate_sqlite_to_postgres.py](file:///c:/Users/NAHOM/Downloads/main_zlast_tbot%20%281%29/main_zlast_tbot/migrate_sqlite_to_postgres.py).

### What the Migration Script Does:
1. Verifies the existing SQLite database at `data/database/bot_data.db`.
2. Creates all PostgreSQL tables (`scans`, `user_reports`, `vt_cache`, `stats`, `reports`) and appropriate indexes.
3. Migrates all rows while preserving original IDs, foreign key references, timestamps, and precision.
4. Normalizes ML confidence scores (decodes byte-encoded floats if necessary).
5. Synchronizes PostgreSQL serial sequences (`setval`) with the maximum migrated IDs.
6. Performs automatic row count verification between SQLite and PostgreSQL.

### Running Migration:
```bash
.\venv\Scripts\python.exe migrate_sqlite_to_postgres.py
```

---

## 5. Database Schema Details

### Tables:
* **`scans`**: Stores URL detections.
  * Columns: `id` (PK, SERIAL), `url` (TEXT), `final_verdict` (VARCHAR), `ml_prediction` (VARCHAR), `ml_confidence` (DOUBLE PRECISION), `vt_result` (TEXT), `user_id` (BIGINT), `timestamp` (BIGINT), `source` (VARCHAR).
  * Indexes on `url`, `timestamp`, `user_id`, `final_verdict`.
* **`user_reports`**: Stores false positive/negative feedback.
  * Columns: `id` (PK, SERIAL), `scan_id` (FK -> scans.id), `url` (TEXT), `original_verdict` (VARCHAR), `user_verdict` (VARCHAR), `user_id` (BIGINT), `timestamp` (BIGINT), `notes` (TEXT).
  * Indexes on `scan_id`, `user_id`.
* **`vt_cache`**: Caches VirusTotal lookups.
  * Columns: `url` (PK, TEXT), `result` (TEXT), `verdict` (VARCHAR), `malicious` (INT), `suspicious` (INT), `harmless` (INT), `timestamp` (BIGINT).
* **`stats`**: Key-value statistics counters.
  * Columns: `key` (PK, VARCHAR), `value` (BIGINT).
* **`reports`**: Legacy reports compatibility table.
  * Columns: `id` (PK, SERIAL), `url` (TEXT), `report_type` (VARCHAR), `ml_prediction` (VARCHAR), `vt_result` (TEXT), `user_id` (BIGINT), `timestamp` (BIGINT), `notes` (TEXT).

---

## 6. How to Run the Project

### Option A: Start All Services via Batch File
```cmd
start_all.bat
```
This automatically starts:
1. PostgreSQL server (if not already running)
2. Flask Backend API (`http://localhost:5000`)
3. Telegram Bot
4. Frontend Admin Dashboard (`http://localhost:3002`)

### Option B: Start Services Individually
```bash
# 1. Backend API:
cd backend
..\venv\Scripts\activate
python app.py

# 2. Telegram Bot:
cd bot
..\venv\Scripts\activate
python telegram_bot.py

# 3. Frontend Dashboard:
cd frontend
npm run dev
```

---

## 7. Verification and Testing

### 1. Test All Components:
```bash
.\venv\Scripts\python.exe test_all_components.py
```

### 2. Test Bot Functions Against PostgreSQL:
```bash
.\venv\Scripts\python.exe test_bot_functions.py
```

### 3. Test Flask REST API Endpoints:
```bash
.\venv\Scripts\python.exe test_api_endpoints.py
```

---

## 8. Troubleshooting PostgreSQL Connection Errors

| Issue | Cause | Resolution |
| :--- | :--- | :--- |
| `FATAL: password authentication failed` | Password in `.env` doesn't match PostgreSQL user | Update `POSTGRES_PASSWORD` in `.env` or run `ALTER USER postgres WITH PASSWORD '...';` |
| `Connection refused (10061)` | PostgreSQL is not running or port mismatch | Verify PostgreSQL is running on the port specified in `.env` (5432 or 5433). |
| `No module named psycopg2` | Driver not installed in active environment | Run: `pip install psycopg2-binary` |
| `Database does not exist` | Database hasn't been created yet | Run: `createdb -U postgres malicious_url_detector` or use `psql` to create it |
| `Permission denied` | User lacks database privileges | Run `GRANT ALL PRIVILEGES ON DATABASE malicious_url_detector TO postgres;` |
