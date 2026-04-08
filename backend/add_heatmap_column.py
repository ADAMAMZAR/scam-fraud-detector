"""
add_heatmap_column.py
Adds the heatmap JSONB column to the existing scans table.

Usage:
    cd backend
    python add_heatmap_column.py
"""

import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.environ.get("DATABASE_URL")
if not DATABASE_URL:
    print("❌ ERROR: DATABASE_URL is not set in backend/.env")
    exit(1)

ALTER_SQL = """
ALTER TABLE scans
ADD COLUMN IF NOT EXISTS heatmap JSONB DEFAULT '[]'::jsonb;
"""

def main():
    print("🔗 Connecting to Supabase PostgreSQL...")
    try:
        conn = psycopg2.connect(DATABASE_URL)
        conn.autocommit = True
        cursor = conn.cursor()
        print("✅ Connected.")
    except Exception as e:
        print(f"❌ Connection failed: {e}")
        exit(1)

    try:
        print("\n🔧 Adding heatmap JSONB column to scans table...")
        cursor.execute(ALTER_SQL)
        print("   ✓ heatmap column added (or already existed — no change).")
        print("\n🎉 Migration complete! The /analyze endpoint will now store heatmap data.")
    except Exception as e:
        print(f"\n❌ Migration failed: {e}")
        raise
    finally:
        cursor.close()
        conn.close()

if __name__ == "__main__":
    main()
