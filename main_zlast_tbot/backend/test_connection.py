"""
Safe PostgreSQL Connection Diagnostic Script
Tests connection against localhost:5432 / urldb without printing any credentials.
"""
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))

from core.database import get_db

def test():
    try:
        with get_db() as (conn, cur):
            cur.execute("SELECT 1;")
            print("========================================")
            print("  DATABASE CONNECTION TEST: SUCCESS! ✅")
            print("========================================")
            print("Connected successfully to PostgreSQL:")
            print("  Host:     localhost")
            print("  Port:     5432")
            print("  Database: urldb")
            print("  User:     postgres")
            print("========================================")
            return True
    except Exception as e:
        err = str(e)
        print("========================================")
        print("  DATABASE CONNECTION TEST: FAILED ❌")
        print("========================================")
        if "password authentication failed" in err:
            print("Reason: Password authentication failed for user 'postgres'.")
            print("Action: Please update POSTGRES_PASSWORD in your .env file.")
        elif "Connection refused" in err:
            print("Reason: Connection refused. Ensure PostgreSQL is running on port 5432.")
        elif "database" in err and "does not exist" in err:
            print("Reason: Database 'urldb' does not exist.")
        else:
            print(f"Reason: {type(e).__name__}")
        print("========================================")
        return False

if __name__ == "__main__":
    success = test()
    sys.exit(0 if success else 1)
