"""
Fix VT Cache Table Structure
Drops old table and recreates with correct structure
"""
import sqlite3
import os

db_path = os.path.join("data", "database", "bot_data.db")

print("Fixing VT cache table...")

try:
    conn = sqlite3.connect(db_path)
    c = conn.cursor()
    
    # Drop old table
    print("Dropping old vt_cache table...")
    c.execute("DROP TABLE IF EXISTS vt_cache")
    
    # Create new table with correct structure
    print("Creating new vt_cache table...")
    c.execute("""
        CREATE TABLE vt_cache (
            url TEXT PRIMARY KEY,
            verdict TEXT NOT NULL,
            malicious INTEGER,
            suspicious INTEGER,
            harmless INTEGER,
            timestamp INTEGER NOT NULL
        )
    """)
    
    conn.commit()
    conn.close()
    
    print("✅ VT cache table fixed successfully!")
    print("   - Old table dropped")
    print("   - New table created with correct structure")
    print("\nPlease restart the bot and backend for changes to take effect.")
    
except Exception as e:
    print(f"❌ Error fixing table: {e}")
    import traceback
    traceback.print_exc()
