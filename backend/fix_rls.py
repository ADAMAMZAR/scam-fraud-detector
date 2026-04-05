"""
fix_rls.py
Disables Row Level Security (RLS) on dev tables so the Supabase anon key can read/write data.
Run this once after init_db.py.
"""
import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

FIX_RLS_SQL = """
-- Disable RLS on all tables (dev mode - no auth required)
ALTER TABLE scans DISABLE ROW LEVEL SECURITY;
ALTER TABLE scan_reasons DISABLE ROW LEVEL SECURITY;
ALTER TABLE settings DISABLE ROW LEVEL SECURITY;

-- Also grant access to anon and service roles
GRANT ALL ON scans TO anon, authenticated, service_role;
GRANT ALL ON scan_reasons TO anon, authenticated, service_role;
GRANT ALL ON settings TO anon, authenticated, service_role;
"""

def main():
    print("🔧 Fixing Row Level Security (RLS) for dev environment...")
    try:
        conn = psycopg2.connect(os.environ["DATABASE_URL"])
        conn.autocommit = True
        cur = conn.cursor()
        cur.execute(FIX_RLS_SQL)
        cur.close()
        conn.close()
        print("✅ RLS disabled. The Supabase anon key can now read/write all tables.")
    except Exception as e:
        print(f"❌ Failed: {e}")

if __name__ == "__main__":
    main()
