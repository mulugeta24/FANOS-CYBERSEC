"""
Unified PostgreSQL Database Module for URL Detector System
Exclusively powered by PostgreSQL with connection pooling, transaction safety,
and optimized queries.
"""
import os
import sys
import time
import logging
import threading
from contextlib import contextmanager
from dotenv import load_dotenv

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

# Ensure environment variables are loaded
dotenv_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), '.env')
if os.path.exists(dotenv_path):
    load_dotenv(dotenv_path, override=True)
load_dotenv(override=True)

log = logging.getLogger(__name__)

# PostgreSQL driver
try:
    import psycopg2
    from psycopg2 import pool, extras
except ImportError as e:
    raise ImportError("psycopg2 is required. Please install it using: pip install psycopg2-binary") from e

# Connection pool for PostgreSQL
_pg_pool = None
_pool_lock = threading.Lock()
_local = threading.local()

def _get_pg_pool():
    """Initialize or retrieve the PostgreSQL threaded connection pool."""
    global _pg_pool
    if _pg_pool is None:
        with _pool_lock:
            if _pg_pool is None:
                host = os.getenv("POSTGRES_HOST", "localhost")
                port = int(os.getenv("POSTGRES_PORT", "5432"))
                dbname = os.getenv("POSTGRES_DB", "urldb")
                user = os.getenv("POSTGRES_USER", "postgres")
                password = os.getenv("POSTGRES_PASSWORD")

                database_url = os.getenv("DATABASE_URL")
                
                # If POSTGRES_PASSWORD is provided in .env, connect with explicit credentials
                if password is not None:
                    _pg_pool = pool.ThreadedConnectionPool(
                        1, 20,
                        host=host,
                        port=port,
                        dbname=dbname,
                        user=user,
                        password=password
                    )
                elif database_url:
                    _pg_pool = pool.ThreadedConnectionPool(1, 20, dsn=database_url)
                else:
                    _pg_pool = pool.ThreadedConnectionPool(
                        1, 20,
                        host=host,
                        port=port,
                        dbname=dbname,
                        user=user,
                        password=""
                    )
    return _pg_pool

@contextmanager
def get_db():
    """
    Context manager providing a PostgreSQL connection and cursor.
    Auto-commits on success and rolls back on exception.
    """
    p = _get_pg_pool()
    conn = p.getconn()
    conn.autocommit = False
    cur = conn.cursor()
    try:
        yield conn, cur
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        cur.close()
        p.putconn(conn)

class CompatibilityCursor:
    """Translates any legacy '?' placeholders to PostgreSQL '%s'."""
    def __init__(self, real_cursor):
        self._real = real_cursor

    def execute(self, query, params=None):
        if query and "?" in query:
            query = query.replace("?", "%s")
        if params is not None:
            return self._real.execute(query, params)
        return self._real.execute(query)

    def fetchone(self):
        return self._real.fetchone()

    def fetchall(self):
        return self._real.fetchall()

    def fetchmany(self, size=None):
        return self._real.fetchmany(size)

    @property
    def lastrowid(self):
        return getattr(self._real, 'lastrowid', None)

    def close(self):
        return self._real.close()

class CompatibilityConnection:
    """Backwards-compatible connection wrapper for legacy callers."""
    def __init__(self, real_conn):
        self._real = real_conn

    def cursor(self):
        return CompatibilityCursor(self._real.cursor())

    def commit(self):
        return self._real.commit()

    def rollback(self):
        return self._real.rollback()

    def close(self):
        pass

def _get_connection():
    """Get a thread-local PostgreSQL connection for backwards compatibility."""
    if not hasattr(_local, 'pg_conn') or _local.pg_conn is None or _local.pg_conn.closed:
        p = _get_pg_pool()
        _local.pg_conn = p.getconn()
        _local.pg_conn.autocommit = True
    return CompatibilityConnection(_local.pg_conn)

def is_postgres():
    """Always returns True as the system exclusively uses PostgreSQL."""
    return True

def init_db():
    """Initializes all PostgreSQL tables, sequences, and indexes."""
    with get_db() as (conn, c):
        # 1. Scans Table
        c.execute("""
            CREATE TABLE IF NOT EXISTS scans (
                id SERIAL PRIMARY KEY,
                url TEXT NOT NULL,
                final_verdict VARCHAR(64) NOT NULL,
                ml_prediction VARCHAR(64),
                ml_confidence DOUBLE PRECISION,
                vt_result TEXT,
                user_id BIGINT,
                timestamp BIGINT DEFAULT EXTRACT(EPOCH FROM NOW())::BIGINT,
                source VARCHAR(64)
            );
            CREATE INDEX IF NOT EXISTS idx_scans_url ON scans(url);
            CREATE INDEX IF NOT EXISTS idx_scans_timestamp ON scans(timestamp);
            CREATE INDEX IF NOT EXISTS idx_scans_user_id ON scans(user_id);
            CREATE INDEX IF NOT EXISTS idx_scans_final_verdict ON scans(final_verdict);
        """)

        # 2. User Reports Table
        c.execute("""
            CREATE TABLE IF NOT EXISTS user_reports (
                id SERIAL PRIMARY KEY,
                scan_id INTEGER REFERENCES scans(id) ON DELETE SET NULL,
                url TEXT NOT NULL,
                original_verdict VARCHAR(64),
                user_verdict VARCHAR(64) NOT NULL,
                user_id BIGINT,
                timestamp BIGINT DEFAULT EXTRACT(EPOCH FROM NOW())::BIGINT,
                notes TEXT
            );
            CREATE INDEX IF NOT EXISTS idx_user_reports_scan_id ON user_reports(scan_id);
            CREATE INDEX IF NOT EXISTS idx_user_reports_user_id ON user_reports(user_id);
        """)

        # 3. VirusTotal Cache Table
        c.execute("""
            CREATE TABLE IF NOT EXISTS vt_cache (
                url TEXT PRIMARY KEY,
                result TEXT,
                verdict VARCHAR(64),
                malicious INTEGER DEFAULT 0,
                suspicious INTEGER DEFAULT 0,
                harmless INTEGER DEFAULT 0,
                timestamp BIGINT DEFAULT EXTRACT(EPOCH FROM NOW())::BIGINT
            );
        """)

        # 4. Statistics Table
        c.execute("""
            CREATE TABLE IF NOT EXISTS stats (
                key VARCHAR(128) PRIMARY KEY,
                value BIGINT DEFAULT 0
            );
        """)

        # 5. Legacy Reports Table
        c.execute("""
            CREATE TABLE IF NOT EXISTS reports (
                id SERIAL PRIMARY KEY,
                url TEXT NOT NULL,
                report_type VARCHAR(64) NOT NULL,
                ml_prediction VARCHAR(64),
                vt_result TEXT,
                user_id BIGINT,
                timestamp BIGINT DEFAULT EXTRACT(EPOCH FROM NOW())::BIGINT,
                notes TEXT
            );
        """)

        # 6. Users Table for Sign Up and Sign In Authentication
        c.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(100) UNIQUE NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                is_admin BOOLEAN DEFAULT FALSE,
                created_at BIGINT DEFAULT EXTRACT(EPOCH FROM NOW())::BIGINT
            );
            CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
            CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
        """)
        
        db_name = os.getenv('POSTGRES_DB', 'urldb')
        print(f"✅ PostgreSQL database initialized successfully: {db_name}")

# ============================================================================
# User Authentication & Management Operations
# ============================================================================

def create_user(username, email, password_hash, is_admin=False):
    """Create a new user in the PostgreSQL database."""
    with get_db() as (conn, c):
        c.execute("""
            INSERT INTO users (username, email, password_hash, is_admin)
            VALUES (%s, %s, %s, %s)
            RETURNING id, username, email, is_admin, created_at;
        """, (username, email, password_hash, is_admin))
        row = c.fetchone()
        if row:
            return {
                'id': row[0],
                'username': row[1],
                'email': row[2],
                'is_admin': bool(row[3]),
                'created_at': row[4]
            }

def get_user_by_username(username):
    """Retrieve a user by username."""
    with get_db() as (conn, c):
        c.execute("""
            SELECT id, username, email, password_hash, is_admin, created_at
            FROM users
            WHERE LOWER(username) = LOWER(%s)
        """, (username,))
        row = c.fetchone()
        if not row:
            return None
        return {
            'id': row[0],
            'username': row[1],
            'email': row[2],
            'password_hash': row[3],
            'is_admin': bool(row[4]),
            'created_at': row[5]
        }

def get_user_by_email(email):
    """Retrieve a user by email."""
    with get_db() as (conn, c):
        c.execute("""
            SELECT id, username, email, password_hash, is_admin, created_at
            FROM users
            WHERE LOWER(email) = LOWER(%s)
        """, (email,))
        row = c.fetchone()
        if not row:
            return None
        return {
            'id': row[0],
            'username': row[1],
            'email': row[2],
            'password_hash': row[3],
            'is_admin': bool(row[4]),
            'created_at': row[5]
        }

def get_user_by_id(user_id):
    """Retrieve a user by ID."""
    with get_db() as (conn, c):
        c.execute("""
            SELECT id, username, email, password_hash, is_admin, created_at
            FROM users
            WHERE id = %s
        """, (user_id,))
        row = c.fetchone()
        if not row:
            return None
        return {
            'id': row[0],
            'username': row[1],
            'email': row[2],
            'password_hash': row[3],
            'is_admin': bool(row[4]),
            'created_at': row[5]
        }

# ============================================================================
# Statistics & Caching Operations
# ============================================================================

def get_stat(key):
    """Retrieves a single statistic from the database."""
    with get_db() as (conn, c):
        c.execute("SELECT value FROM stats WHERE key = %s", (key,))
        result = c.fetchone()
        return result[0] if result else 0

def increment_stat(key):
    """Increments a statistic in PostgreSQL using upsert."""
    with get_db() as (conn, c):
        c.execute("""
            INSERT INTO stats (key, value) VALUES (%s, 1)
            ON CONFLICT(key) DO UPDATE SET value = stats.value + 1
        """, (key,))

def get_cache(url):
    """Retrieves a cached result from the database."""
    with get_db() as (conn, c):
        c.execute("SELECT result FROM vt_cache WHERE url = %s", (url,))
        result = c.fetchone()
        return result[0] if result else None

def set_cache(url, result):
    """Stores a result in the cache."""
    with get_db() as (conn, c):
        c.execute("""
            INSERT INTO vt_cache (url, result, timestamp)
            VALUES (%s, %s, EXTRACT(EPOCH FROM NOW())::BIGINT)
            ON CONFLICT(url) DO UPDATE SET
                result = EXCLUDED.result,
                timestamp = EXTRACT(EPOCH FROM NOW())::BIGINT
        """, (url, result))

def get_cached_verdict(url, expiry_hours=24):
    """
    Check if URL verdict is cached in vt_cache and still valid.
    Returns: verdict string or None
    """
    with get_db() as (conn, c):
        c.execute("SELECT verdict, timestamp FROM vt_cache WHERE url = %s", (url,))
        row = c.fetchone()
        if not row:
            return None
        verdict, ts = row
        if verdict is None:
            return None
        age_hours = (time.time() - ts) / 3600.0
        if age_hours < expiry_hours:
            return verdict
        return None

def cache_verdict(url, verdict, malicious=0, suspicious=0, harmless=0):
    """Cache VirusTotal verdict for future lookups."""
    with get_db() as (conn, c):
        now_ts = int(time.time())
        c.execute("""
            INSERT INTO vt_cache (url, verdict, malicious, suspicious, harmless, timestamp)
            VALUES (%s, %s, %s, %s, %s, %s)
            ON CONFLICT(url) DO UPDATE SET
                verdict = EXCLUDED.verdict,
                malicious = EXCLUDED.malicious,
                suspicious = EXCLUDED.suspicious,
                harmless = EXCLUDED.harmless,
                timestamp = EXCLUDED.timestamp
        """, (url, verdict, malicious, suspicious, harmless, now_ts))

# ============================================================================
# Scans & Reports Operations
# ============================================================================

def add_report(url, report_type, ml_prediction=None, vt_result=None, user_id=None, notes=None):
    """Add a user report for false positive/negative or missed detection."""
    with get_db() as (conn, c):
        c.execute("""
            INSERT INTO reports (url, report_type, ml_prediction, vt_result, user_id, notes)
            VALUES (%s, %s, %s, %s, %s, %s)
            RETURNING id;
        """, (url, report_type, ml_prediction, vt_result, user_id, notes))
        return c.fetchone()[0]

def add_scan(url, final_verdict, ml_prediction, ml_confidence, vt_result, user_id=None, source="web"):
    """Add a URL scan result (automatic detection)."""
    if ml_confidence is not None:
        try:
            ml_confidence = float(ml_confidence)
        except Exception:
            pass

    with get_db() as (conn, c):
        c.execute("""
            INSERT INTO scans (url, final_verdict, ml_prediction, ml_confidence, vt_result, user_id, source)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            RETURNING id;
        """, (url, final_verdict, ml_prediction, ml_confidence, vt_result, user_id, source))
        return c.fetchone()[0]

def add_user_report(url, original_verdict, user_verdict, user_id=None, scan_id=None, notes=None):
    """Add a user report (feedback on detection)."""
    with get_db() as (conn, c):
        c.execute("""
            INSERT INTO user_reports (scan_id, url, original_verdict, user_verdict, user_id, notes)
            VALUES (%s, %s, %s, %s, %s, %s)
            RETURNING id;
        """, (scan_id, url, original_verdict, user_verdict, user_id, notes))
        return c.fetchone()[0]

def get_scans(limit=100):
    """Get recent scans."""
    with get_db() as (conn, c):
        c.execute("""
            SELECT id, url, final_verdict, ml_prediction, vt_result, user_id, timestamp, source
            FROM scans
            ORDER BY timestamp DESC
            LIMIT %s
        """, (limit,))
        return c.fetchall()

def get_scan_by_id(scan_id):
    """Get ml_prediction and vt_result for a specific scan."""
    with get_db() as (conn, c):
        c.execute("""
            SELECT ml_prediction, vt_result
            FROM scans
            WHERE id = %s
        """, (scan_id,))
        return c.fetchone()

def get_user_reports(limit=100):
    """Get user reports (feedback)."""
    with get_db() as (conn, c):
        c.execute("""
            SELECT id, scan_id, url, original_verdict, user_verdict, user_id, timestamp, notes
            FROM user_reports
            ORDER BY timestamp DESC
            LIMIT %s
        """, (limit,))
        return c.fetchall()

def get_reports(limit=50):
    """Get recent legacy reports."""
    with get_db() as (conn, c):
        c.execute("""
            SELECT id, url, report_type, ml_prediction, vt_result, user_id, timestamp, notes
            FROM reports
            ORDER BY timestamp DESC
            LIMIT %s
        """, (limit,))
        return c.fetchall()

def get_report_stats():
    """Get statistics about reports."""
    with get_db() as (conn, c):
        c.execute("""
            SELECT report_type, COUNT(*) as count
            FROM reports
            GROUP BY report_type
        """)
        return dict(c.fetchall())

def close_db_connections():
    """Close thread-local and pooled database connections."""
    global _pg_pool
    if hasattr(_local, 'pg_conn') and _local.pg_conn is not None:
        try:
            _local.pg_conn.close()
            _local.pg_conn = None
        except Exception:
            pass

    if _pg_pool is not None:
        try:
            _pg_pool.closeall()
            _pg_pool = None
        except Exception:
            pass

def clear_all_stats():
    """Clear all statistics (admin function)."""
    with get_db() as (conn, c):
        c.execute("DELETE FROM stats")
        print("✅ Statistics cleared")

def clear_all_data():
    """Clear ALL data from database (admin function) - USE WITH CAUTION!"""
    with get_db() as (conn, c):
        c.execute("TRUNCATE TABLE scans, user_reports, reports, stats, vt_cache, users RESTART IDENTITY CASCADE;")
        print("✅ All data cleared from PostgreSQL database and sequences reset.")

def get_accurate_stats():
    """
    Get accurate statistics calculated from scans table.
    """
    with get_db() as (conn, c):
        c.execute("SELECT COUNT(*) FROM scans")
        total_checked = c.fetchone()[0]

        c.execute("""
            SELECT final_verdict, COUNT(*) 
            FROM scans 
            GROUP BY final_verdict
        """)
        by_type = dict(c.fetchall())

        c.execute("""
            SELECT COUNT(*) FROM scans 
            WHERE final_verdict IN ('malicious', 'phishing', 'defacement', 'suspicious')
        """)
        malicious_count = c.fetchone()[0]

        c.execute("""
            SELECT COUNT(*) FROM scans 
            WHERE final_verdict = 'benign'
        """)
        benign_count = c.fetchone()[0]

        # Get daily activity for last 7 days
        c.execute("""
            SELECT 
                TO_CHAR(TO_TIMESTAMP(timestamp), 'YYYY-MM-DD') as date,
                COUNT(*) as total,
                SUM(CASE WHEN final_verdict IN ('malicious', 'phishing', 'defacement', 'suspicious') THEN 1 ELSE 0 END) as malicious,
                SUM(CASE WHEN final_verdict = 'benign' THEN 1 ELSE 0 END) as benign,
                SUM(CASE WHEN final_verdict = 'phishing' THEN 1 ELSE 0 END) as phishing,
                SUM(CASE WHEN final_verdict = 'defacement' THEN 1 ELSE 0 END) as defacement
            FROM scans
            WHERE timestamp >= EXTRACT(EPOCH FROM (NOW() - INTERVAL '7 days'))::BIGINT
            GROUP BY TO_CHAR(TO_TIMESTAMP(timestamp), 'YYYY-MM-DD')
            ORDER BY date DESC
        """)

        daily_activity = []
        for row in c.fetchall():
            daily_activity.append({
                'date': row[0],
                'total': int(row[1] or 0),
                'malicious': int(row[2] or 0),
                'benign': int(row[3] or 0),
                'phishing': int(row[4] or 0),
                'defacement': int(row[5] or 0)
            })

        return {
            'total_checked': total_checked,
            'malicious_count': malicious_count,
            'benign_count': benign_count,
            'by_type': by_type,
            'daily_activity': daily_activity
        }
