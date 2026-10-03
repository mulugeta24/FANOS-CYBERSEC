#!/usr/bin/env python3
"""
SQLite to PostgreSQL Data Migration Script
Migrates all tables and rows from data/database/bot_data.db to PostgreSQL.
Preserves IDs, timestamps, URLs, ML confidence (handles raw float bytes), and relationships.
"""
import os
import sys
import sqlite3
import struct
from dotenv import load_dotenv

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

# Load environment variables
dotenv_path = os.path.join(os.path.dirname(__file__), '.env')
if os.path.exists(dotenv_path):
    load_dotenv(dotenv_path)
load_dotenv()

try:
    import psycopg2
    from psycopg2 import sql
except ImportError:
    print("❌ psycopg2 is not installed. Please run: pip install psycopg2-binary")
    sys.exit(1)

def get_pg_connection():
    database_url = os.getenv("DATABASE_URL")
    if database_url:
        return psycopg2.connect(database_url)
    
    host = os.getenv("POSTGRES_HOST", "localhost")
    port = int(os.getenv("POSTGRES_PORT", "5432"))
    dbname = os.getenv("POSTGRES_DB", "urldb")
    user = os.getenv("POSTGRES_USER", "postgres")
    password = os.getenv("POSTGRES_PASSWORD", "postgres")
    
    return psycopg2.connect(
        host=host,
        port=port,
        dbname=dbname,
        user=user,
        password=password
    )

def create_schema(pg_conn):
    """Create all required PostgreSQL tables and indexes if they do not exist."""
    cur = pg_conn.cursor()
    
    print("📦 Creating PostgreSQL tables and indexes...")
    
    # 1. Scans Table
    cur.execute("""
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
    cur.execute("""
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
    cur.execute("""
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
    cur.execute("""
        CREATE TABLE IF NOT EXISTS stats (
            key VARCHAR(128) PRIMARY KEY,
            value BIGINT DEFAULT 0
        );
    """)
    
        # 5. Legacy Reports Table
        cur.execute("""
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

        # 6. Users Table
        cur.execute("""
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
        
        pg_conn.commit()
        cur.close()
        print("✅ PostgreSQL schema created successfully.")

def normalize_float(val):
    if val is None:
        return None
    if isinstance(val, (float, int)):
        return float(val)
    if isinstance(val, bytes):
        if len(val) == 4:
            return float(struct.unpack('<f', val)[0])
        elif len(val) == 8:
            return float(struct.unpack('<d', val)[0])
    try:
        return float(val)
    except Exception:
        return None

def migrate():
    sqlite_db_path = os.path.join(os.path.dirname(__file__), "data", "database", "bot_data.db")
    if not os.path.exists(sqlite_db_path):
        print(f"❌ SQLite database not found at {sqlite_db_path}")
        return False
        
    print(f"📖 Connecting to SQLite database: {sqlite_db_path}")
    sqlite_conn = sqlite3.connect(sqlite_db_path)
    sqlite_cur = sqlite_conn.cursor()
    
    print("🐘 Connecting to PostgreSQL database...")
    try:
        pg_conn = get_pg_connection()
        print("✅ PostgreSQL connection established.")
    except Exception as e:
        print(f"❌ Failed to connect to PostgreSQL: {e}")
        return False
        
    create_schema(pg_conn)
    pg_cur = pg_conn.cursor()
    
    migration_summary = {}
    
    # --- 1. Migrate scans ---
    print("\n--- Migrating 'scans' table ---")
    sqlite_cur.execute("SELECT id, url, final_verdict, ml_prediction, ml_confidence, vt_result, user_id, timestamp, source FROM scans ORDER BY id")
    scans_rows = sqlite_cur.fetchall()
    migrated_scans = 0
    for r in scans_rows:
        scan_id, url, final_verdict, ml_pred, ml_conf, vt_res, user_id, ts, source = r
        clean_conf = normalize_float(ml_conf)
        pg_cur.execute("""
            INSERT INTO scans (id, url, final_verdict, ml_prediction, ml_confidence, vt_result, user_id, timestamp, source)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT (id) DO UPDATE SET
                url = EXCLUDED.url,
                final_verdict = EXCLUDED.final_verdict,
                ml_prediction = EXCLUDED.ml_prediction,
                ml_confidence = EXCLUDED.ml_confidence,
                vt_result = EXCLUDED.vt_result,
                user_id = EXCLUDED.user_id,
                timestamp = EXCLUDED.timestamp,
                source = EXCLUDED.source;
        """, (scan_id, url, final_verdict, ml_pred, clean_conf, vt_res, user_id, ts, source))
        migrated_scans += 1
    
    # Reset scans sequence
    pg_cur.execute("SELECT setval(pg_get_serial_sequence('scans', 'id'), COALESCE((SELECT MAX(id) FROM scans), 1));")
    pg_conn.commit()
    migration_summary['scans'] = (len(scans_rows), migrated_scans)
    print(f"  Scans: {migrated_scans}/{len(scans_rows)} records migrated.")
    
    # --- 2. Migrate user_reports ---
    print("\n--- Migrating 'user_reports' table ---")
    sqlite_cur.execute("SELECT id, scan_id, url, original_verdict, user_verdict, user_id, timestamp, notes FROM user_reports ORDER BY id")
    user_rep_rows = sqlite_cur.fetchall()
    migrated_user_reports = 0
    for r in user_rep_rows:
        rep_id, scan_id, url, orig_v, user_v, uid, ts, notes = r
        pg_cur.execute("""
            INSERT INTO user_reports (id, scan_id, url, original_verdict, user_verdict, user_id, timestamp, notes)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT (id) DO UPDATE SET
                scan_id = EXCLUDED.scan_id,
                url = EXCLUDED.url,
                original_verdict = EXCLUDED.original_verdict,
                user_verdict = EXCLUDED.user_verdict,
                user_id = EXCLUDED.user_id,
                timestamp = EXCLUDED.timestamp,
                notes = EXCLUDED.notes;
        """, (rep_id, scan_id, url, orig_v, user_v, uid, ts, notes))
        migrated_user_reports += 1
        
    pg_cur.execute("SELECT setval(pg_get_serial_sequence('user_reports', 'id'), COALESCE((SELECT MAX(id) FROM user_reports), 1));")
    pg_conn.commit()
    migration_summary['user_reports'] = (len(user_rep_rows), migrated_user_reports)
    print(f"  User Reports: {migrated_user_reports}/{len(user_rep_rows)} records migrated.")
    
    # --- 3. Migrate vt_cache ---
    print("\n--- Migrating 'vt_cache' table ---")
    sqlite_cur.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='vt_cache'")
    if sqlite_cur.fetchone():
        sqlite_cur.execute("PRAGMA table_info(vt_cache)")
        vt_cols = [c[1] for c in sqlite_cur.fetchall()]
        if 'verdict' in vt_cols:
            sqlite_cur.execute("SELECT url, result, verdict, malicious, suspicious, harmless, timestamp FROM vt_cache")
        else:
            sqlite_cur.execute("SELECT url, result, timestamp FROM vt_cache")
            
        vt_rows = sqlite_cur.fetchall()
        migrated_vt = 0
        for r in vt_rows:
            if len(r) == 7:
                url, res, verd, mal, susp, harm, ts = r
            else:
                url, res, ts = r
                verd, mal, susp, harm = None, 0, 0, 0
                
            pg_cur.execute("""
                INSERT INTO vt_cache (url, result, verdict, malicious, suspicious, harmless, timestamp)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                ON CONFLICT (url) DO UPDATE SET
                    result = EXCLUDED.result,
                    verdict = EXCLUDED.verdict,
                    malicious = EXCLUDED.malicious,
                    suspicious = EXCLUDED.suspicious,
                    harmless = EXCLUDED.harmless,
                    timestamp = EXCLUDED.timestamp;
            """, (url, res, verd, mal, susp, harm, ts))
            migrated_vt += 1
        pg_conn.commit()
        migration_summary['vt_cache'] = (len(vt_rows), migrated_vt)
        print(f"  VirusTotal Cache: {migrated_vt}/{len(vt_rows)} records migrated.")
    else:
        migration_summary['vt_cache'] = (0, 0)

    # --- 4. Migrate stats ---
    print("\n--- Migrating 'stats' table ---")
    sqlite_cur.execute("SELECT key, value FROM stats")
    stats_rows = sqlite_cur.fetchall()
    migrated_stats = 0
    for key, val in stats_rows:
        pg_cur.execute("""
            INSERT INTO stats (key, value)
            VALUES (%s, %s)
            ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
        """, (key, val))
        migrated_stats += 1
    pg_conn.commit()
    migration_summary['stats'] = (len(stats_rows), migrated_stats)
    print(f"  Stats: {migrated_stats}/{len(stats_rows)} records migrated.")

    # --- 5. Migrate reports (legacy) ---
    print("\n--- Migrating 'reports' table ---")
    sqlite_cur.execute("SELECT id, url, report_type, ml_prediction, vt_result, user_id, timestamp, notes FROM reports")
    reports_rows = sqlite_cur.fetchall()
    migrated_reports = 0
    for r in reports_rows:
        rid, url, rtype, ml_pred, vt_res, uid, ts, notes = r
        pg_cur.execute("""
            INSERT INTO reports (id, url, report_type, ml_prediction, vt_result, user_id, timestamp, notes)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT (id) DO UPDATE SET
                url = EXCLUDED.url,
                report_type = EXCLUDED.report_type,
                ml_prediction = EXCLUDED.ml_prediction,
                vt_result = EXCLUDED.vt_result,
                user_id = EXCLUDED.user_id,
                timestamp = EXCLUDED.timestamp,
                notes = EXCLUDED.notes;
        """, (rid, url, rtype, ml_pred, vt_res, uid, ts, notes))
        migrated_reports += 1
    pg_cur.execute("SELECT setval(pg_get_serial_sequence('reports', 'id'), COALESCE((SELECT MAX(id) FROM reports), 1));")
    pg_conn.commit()
    migration_summary['reports'] = (len(reports_rows), migrated_reports)
    print(f"  Reports: {migrated_reports}/{len(reports_rows)} records migrated.")

    # Verification
    print("\n" + "=" * 60)
    print("  MIGRATION VERIFICATION")
    print("=" * 60)
    all_matched = True
    for table, (src_cnt, mig_cnt) in migration_summary.items():
        pg_cur.execute(f"SELECT COUNT(*) FROM {table}")
        pg_cnt = pg_cur.fetchone()[0]
        status = "✅ MATCH" if src_cnt == pg_cnt else "❌ MISMATCH"
        print(f"  {table.ljust(15)}: SQLite={src_cnt} | PostgreSQL={pg_cnt} -> {status}")
        if src_cnt != pg_cnt:
            all_matched = False

    pg_cur.close()
    pg_conn.close()
    sqlite_conn.close()

    if all_matched:
        print("\n🎉 ALL DATA MIGRATED AND VERIFIED SUCCESSFULLY!")
        return True
    else:
        print("\n⚠️ Warning: Some row counts did not match.")
        return False

if __name__ == '__main__':
    success = migrate()
    sys.exit(0 if success else 1)
