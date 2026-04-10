"""
create_batch_jobs_table.py
==========================
One-time migration: creates the batch_jobs table in Supabase.

Usage:
    cd backend
    venv\\Scripts\\python create_batch_jobs_table.py
"""

import os
from dotenv import load_dotenv

load_dotenv()

from supabase import create_client

supabase = create_client(
    os.environ["SUPABASE_URL"],
    os.environ["SUPABASE_ANON_KEY"],
)

# We'll use the REST API to insert a dummy row to verify the table exists,
# but first we need to create it via the Supabase SQL editor or psycopg2.
# Since DATABASE_URL may not always be set, we check for the table by trying
# a select, and print instructions if it doesn't exist.

print("Checking if batch_jobs table exists...")

try:
    result = supabase.table("batch_jobs").select("id").limit(1).execute()
    print("✅ batch_jobs table already exists.")
except Exception as e:
    if "relation" in str(e).lower() and "does not exist" in str(e).lower():
        print("❌ batch_jobs table does not exist.")
        print()
        print("Please run the following SQL in your Supabase SQL Editor:")
        print("(Dashboard → SQL Editor → New Query)")
        print()
        print("""
CREATE TABLE IF NOT EXISTS batch_jobs (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at   TIMESTAMPTZ DEFAULT NOW(),
    status       TEXT DEFAULT 'queued',   -- queued | processing | complete | failed | cancelled
    total        INTEGER DEFAULT 0,
    completed    INTEGER DEFAULT 0,
    failed_count INTEGER DEFAULT 0,
    file_name    TEXT,
    results_json JSONB
);
        """.strip())
        print()
        print("After running the SQL, re-run this script to verify.")
    else:
        print(f"Unexpected error: {e}")
