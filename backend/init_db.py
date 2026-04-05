"""
init_db.py
Run this script ONCE to set up the Supabase database tables and seed initial data.

Usage:
    cd backend
    python init_db.py

Requirements:
  - .env must have DATABASE_URL set to your Supabase PostgreSQL connection string:
    DATABASE_URL=postgresql://postgres:[YOUR-DB-PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres
"""

import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.environ.get("DATABASE_URL")
if not DATABASE_URL or "YOUR-DB-PASSWORD" in DATABASE_URL:
    print("❌ ERROR: DATABASE_URL is not set or still has a placeholder password.")
    print("   Open backend/.env and replace [YOUR-DB-PASSWORD] with your real Supabase DB password.")
    print("   Find it at: Supabase Dashboard → Project Settings → Database → Connection string")
    exit(1)

# ─── SQL: Create Tables (IF NOT EXISTS) ──────────────────────────────────────

CREATE_TABLES_SQL = """
-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Scans table
CREATE TABLE IF NOT EXISTS scans (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_body TEXT NOT NULL,
    channel      TEXT NOT NULL,
    sender       TEXT,
    score        INTEGER CHECK (score >= 0 AND score <= 100),
    verdict      TEXT CHECK (verdict IN ('SAFE', 'SUSPICIOUS', 'FRAUD')),
    confidence   INTEGER CHECK (confidence >= 0 AND confidence <= 100),
    nlp_score    INTEGER DEFAULT 0,
    url_score    INTEGER DEFAULT 0,
    sender_score INTEGER DEFAULT 0,
    created_at   TIMESTAMPTZ DEFAULT now()
);

-- Scan reasons table
CREATE TABLE IF NOT EXISTS scan_reasons (
    id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scan_id  UUID REFERENCES scans(id) ON DELETE CASCADE,
    text     TEXT NOT NULL,
    category TEXT NOT NULL,
    points   INTEGER NOT NULL
);

-- Settings table
CREATE TABLE IF NOT EXISTS settings (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dark_mode       BOOLEAN DEFAULT TRUE,
    safe_threshold  INTEGER DEFAULT 40,
    fraud_threshold INTEGER DEFAULT 75
);
"""

# ─── SQL: Seed Data ───────────────────────────────────────────────────────────

SEED_SCANS_SQL = """
INSERT INTO scans (message_body, channel, sender, score, verdict, confidence, nlp_score, url_score, sender_score)
VALUES
    (
        'URGENT: Your Maybank account has been temporarily suspended due to suspicious activity. Verify your identity at http://mybnk-secure.xyz immediately.',
        'sms', '+60123456789', 97, 'FRAUD', 99, 38, 30, 29
    ),
    (
        'Congratulations! You have won RM50,000 in the Touch n Go Lucky Draw! Claim your prize: bit.ly/tng-winner',
        'whatsapp', '+60187654321', 95, 'FRAUD', 98, 35, 30, 30
    ),
    (
        'Dear Taxpayer, LHDN has detected an irregularity in your 2025 tax filing. Pay RM 4,200 now or face arrest: http://lhdn-gov-portal.info',
        'email', 'lhdn-notice@gov-my.info', 99, 'FRAUD', 99, 39, 30, 30
    ),
    (
        'Your delivery attempt was unsuccessful. Reschedule within 48 hours to avoid return fees at http://pos-laju-reschd.com',
        'sms', '+60199876543', 74, 'SUSPICIOUS', 85, 22, 28, 24
    ),
    (
        'Hi, are you free this Saturday for the team lunch? We are thinking Damansara Uptown around 12:30pm. Let me know by Friday!',
        'text', '+60111234567', 3, 'SAFE', 99, 1, 0, 2
    ),
    (
        'Your Shopee order #SPX-884421 has been shipped. Expected delivery: 3-5 business days. Track at shopee.com.my/orders.',
        'email', 'promo@shopee.com.my', 8, 'SAFE', 99, 2, 4, 2
    )
RETURNING id, message_body;
"""

SEED_REASONS_SQL_TEMPLATE = """
INSERT INTO scan_reasons (scan_id, text, category, points)
VALUES
    ('{scan_id}', '{text}', '{category}', {points});
"""

# Reasons keyed by message snippet
REASONS_MAP = {
    "Maybank": [
        ("Authority Impersonation (Bank brand used as lure)", "NLP · Intent", 20),
        ("Artificial Scarcity (account suspended threat)", "NLP · Keywords", 18),
        ("High-risk URL with suspicious TLD (.xyz)", "URL · Domain", 30),
    ],
    "Touch n Go": [
        ("Prize Lure (RM50,000 prize)", "NLP · Intent", 25),
        ("Shortened URL used to hide destination", "URL · Domain", 20),
        ("Urgency + reward manipulation", "NLP · Keywords", 10),
    ],
    "LHDN": [
        ("Legal Threat (arrest warrant)", "NLP · Intent", 30),
        ("Authority Impersonation (government body)", "NLP · Intent", 20),
        ("Phishing domain disguised as official", "URL · Domain", 29),
    ],
    "pos-laju-reschd": [
        ("Fake delivery notification pattern", "NLP · Intent", 15),
        ("Suspicious URL mimicking official courier", "URL · Domain", 25),
    ],
}

def main():
    print("🔗 Connecting to Supabase PostgreSQL...")
    try:
        conn = psycopg2.connect(DATABASE_URL)
        conn.autocommit = False
        cursor = conn.cursor()
        print("✅ Connected.")
    except Exception as e:
        print(f"❌ Connection failed: {e}")
        exit(1)

    try:
        # Step 1: Create tables
        print("\n📋 Creating tables (IF NOT EXISTS)...")
        cursor.execute(CREATE_TABLES_SQL)
        print("   ✓ Tables created.")

        # Step 2: Seed scans and collect their IDs
        print("\n🌱 Seeding scan records...")
        cursor.execute(SEED_SCANS_SQL)
        inserted_scans = cursor.fetchall()  # list of (id, message_body)
        print(f"   ✓ Inserted {len(inserted_scans)} scan records.")

        # Step 3: Seed reasons based on message content
        print("\n🔍 Seeding scan reasons...")
        reasons_count = 0
        for scan_id, message_body in inserted_scans:
            for keyword, reasons in REASONS_MAP.items():
                if keyword in message_body:
                    for text, category, points in reasons:
                        # Escape single quotes in text
                        safe_text = text.replace("'", "''")
                        sql = SEED_REASONS_SQL_TEMPLATE.format(
                            scan_id=scan_id,
                            text=safe_text,
                            category=category,
                            points=points
                        )
                        cursor.execute(sql)
                        reasons_count += 1
                    break  # Only match first keyword per scan

        print(f"   ✓ Inserted {reasons_count} reason records.")

        # Commit everything
        conn.commit()
        print("\n🎉 Database setup complete!")
        print("   → Go to your Supabase Dashboard to verify the data.")
        print("   → Refresh the frontend Messages page to see the seeded data.")

    except Exception as e:
        conn.rollback()
        print(f"\n❌ Error during setup: {e}")
        print("   All changes have been rolled back.")
        raise
    finally:
        cursor.close()
        conn.close()

if __name__ == "__main__":
    main()
