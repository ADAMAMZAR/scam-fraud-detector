"""
load_email_data.py
==================
Loads the Fraudulent Email Corpus (Kaggle) into Supabase as scam email records,
plus a set of realistic synthetic safe (ham) email records for channel balance.

Usage:
    cd backend

    # Load 500 fraud + 200 safe emails (default):
    python load_email_data.py

    # Custom limits:
    python load_email_data.py --fraud-limit 2000 --safe-limit 500

    # Specify a different file path:
    python load_email_data.py --file data/emails/fradulent_emails.txt

Prerequisites:
    1. Download the dataset:
       kaggle datasets download -d rtatman/fraudulent-email-corpus --unzip -p data/emails/
    2. File should be at: backend/data/emails/fradulent_emails.txt
    3. .env must have SUPABASE_URL, SUPABASE_ANON_KEY
"""

import os
import sys
import re
import email as em
import argparse
import random
from datetime import datetime, timedelta, timezone
from dotenv import load_dotenv

load_dotenv()

# ─── Argument parsing ─────────────────────────────────────────────────────────
parser = argparse.ArgumentParser()
parser.add_argument("--fraud-limit", type=int, default=500,
                    help="Max fraudulent emails to import (default: 500)")
parser.add_argument("--safe-limit",  type=int, default=200,
                    help="Number of synthetic safe emails to generate (default: 200)")
parser.add_argument("--file", type=str, default="data/emails/fradulent_emails.txt",
                    help="Path to fradulent_emails.txt")
args = parser.parse_args()

# ─── Validate file ────────────────────────────────────────────────────────────
email_path = os.path.join(os.path.dirname(__file__), args.file)
if not os.path.exists(email_path):
    print("❌ Email corpus not found at:", email_path)
    print()
    print("   Download it first:")
    print("   kaggle datasets download -d rtatman/fraudulent-email-corpus --unzip -p data/emails/")
    sys.exit(1)

# ─── Supabase client ──────────────────────────────────────────────────────────
from supabase import create_client

supabase = create_client(
    os.environ["SUPABASE_URL"],
    os.environ["SUPABASE_ANON_KEY"],
)

# ─── Spam keyword heuristic scorer ────────────────────────────────────────────
SPAM_KEYWORDS = re.compile(
    r"urgent|million|transfer|funds|bank account|beneficiary|inheritance|"
    r"confidential|strictly|secret|attorney|barrister|solicitor|prince|"
    r"government|decree|lottery|won|prize|claim|verify|suspended|password|"
    r"click here|act now|limited|guaranteed|offshore|diplomatic|consignment|"
    r"next of kin|died|deceased|widow|orphan|charity|god bless",
    re.IGNORECASE,
)

URL_RE = re.compile(r"http[s]?://|bit\.ly|tinyurl|\.(xyz|info|tk|ml|ga|cf)", re.IGNORECASE)


def heuristic_score_spam(text: str, subject: str):
    """Score a known-spam email heuristically."""
    combined = f"{subject} {text}"
    matches = SPAM_KEYWORDS.findall(combined)
    has_url  = bool(URL_RE.search(combined))
    exclamations = combined.count("!")
    caps_ratio = sum(1 for c in text if c.isupper()) / max(len(text), 1)

    base    = 65
    keyword_bonus = min(25, len(matches) * 4)
    caps_bonus    = min(8, int(caps_ratio * 20))
    url_bonus     = 15 if has_url else 0
    excl_bonus    = min(5, exclamations)
    score   = min(100, base + keyword_bonus + caps_bonus + url_bonus + excl_bonus)
    verdict = "FRAUD" if score >= 75 else "SUSPICIOUS"

    nlp     = min(40, 15 + len(matches) * 3 + caps_bonus)
    url     = 25 if has_url else random.randint(0, 8)
    sender  = random.randint(16, 28)
    confidence = random.randint(82, 99)

    reasons = []
    for kw in list(set(m.lower() for m in matches[:3])):
        reasons.append({
            "text":     f"Scam keyword detected: '{kw}'",
            "category": "NLP · Keywords",
            "points":   random.randint(8, 15),
        })
    if has_url:
        reasons.append({
            "text":     "Suspicious or shortened URL in email body",
            "category": "URL · Domain",
            "points":   20,
        })
    if caps_ratio > 0.3:
        reasons.append({
            "text":     "Excessive use of capital letters (pressure tactic)",
            "category": "NLP · Intent",
            "points":   10,
        })
    if not reasons:
        reasons.append({
            "text":     "419 / advance-fee fraud pattern detected",
            "category": "NLP · Intent",
            "points":   35,
        })

    return {
        "score":      score,
        "verdict":    verdict,
        "confidence": confidence,
        "nlp_score":  nlp,
        "url_score":  url,
        "sender_score": sender,
        "reasons":    reasons,
    }


# ─── Safe email templates ──────────────────────────────────────────────────────
# Realistic work / transactional emails that are clearly safe

SAFE_TEMPLATES = [
    # Work emails
    ("hr@company.com",         "Team lunch this Friday",              "Hi everyone, quick reminder about the team lunch at 12:30pm on Friday at Level 3 pantry. Please RSVP by Thursday noon. Looking forward to seeing everyone!"),
    ("noreply@shopee.com.my",  "Your order has been shipped",         "Your Shopee order #SPX-{n} has been dispatched. Estimated delivery: 3-5 working days. Track your parcel at shopee.com.my/orders using your tracking number."),
    ("support@grab.com",       "Your ride receipt",                   "Thanks for riding with Grab! Your trip from KLCC to Bangsar has been completed. Total charged: RM14.50 to your GrabPay wallet. Rate your driver: ⭐⭐⭐⭐⭐"),
    ("noreply@myeg.com.my",    "Road tax renewal reminder",           "Your vehicle road tax (plate: {plate}) is due for renewal on {date}. Renew easily at myeg.com.my or any JPJ counter. No action needed if already renewed."),
    ("billing@unifi.com.my",   "Your Unifi bill is ready",            "Your Unifi monthly bill of RM149.00 for account #{n} is ready. Payment is due by the 15th. View your bill at unifi.com.my/billing. Auto-billing is active."),
    ("alerts@maybank2u.com",   "Transaction alert",                   "A purchase of RM23.90 at 99 Speedmart has been charged to your Maybank debit card ending 4821. If this wasn't you, call 1-300-88-6688 immediately."),
    ("noreply@poslaju.com.my", "Parcel out for delivery",             "Your parcel EF{n}MY is out for delivery today. Please ensure someone is available to receive it. If missed, collection is available at your nearest Pos Malaysia outlet."),
    ("team@slack.com",         "New message in #general",             "You have 5 unread messages in #general from your team. Click to view: Your workspace is active and syncing normally."),
    ("no-reply@jobstreet.com", "New job match: Software Engineer",    "Based on your profile, we found 3 new job matches in Kuala Lumpur: Software Engineer at TechCorp (RM6,000-9,000), Backend Dev at FinTech Startup (RM7,000-10,000)."),
    ("receipts@grab.com",      "GrabFood order confirmed",            "Your GrabFood order from McDonald's Bangsar South has been confirmed. Estimated delivery: 25-35 minutes. Order total: RM32.80 including delivery fee."),
    ("noreply@cimbclicks.com", "Fund transfer successful",            "Your fund transfer of RM500.00 to account ending 7744 (Tan Wei Ming) was successful. Transaction ref: TXN{n}. Check it at CIMB Clicks."),
    ("admin@zoom.us",          "Your meeting starts in 10 minutes",   "Reminder: Your meeting 'Weekly Standup' starts at 10:00 AM. Join link: zoom.us/j/{n}. Meeting ID: {n} | Password: secure123"),
    ("no-reply@google.com",    "Security alert: New sign-in",         "Your Google Account was signed in from Chrome on Windows in Kuala Lumpur, Malaysia. If this was you, no action needed. If not, review your account security."),
    ("support@lazada.com.my",  "Return request approved",             "Your return request for Order #{n} has been approved. Please drop off your item at any Lazada return point within 7 days. Refund will be processed in 5-10 business days."),
    ("hr@company.com",         "Leave application approved",          "Your annual leave application for 12-14 April 2026 has been approved by your manager. Your remaining leave balance is 8 days. Have a great break!"),
]


def random_plate():
    letters = "ABCDEFGHJKLMNPQRSTUVWXYZ"
    return f"W{''.join(random.choices('0123456789', k=4))}{random.choice(letters)}"


def random_date():
    d = datetime.now() + timedelta(days=random.randint(30, 180))
    return d.strftime("%d %B %Y")


def generate_safe_emails(count: int):
    """Generate realistic safe email records."""
    records = []
    for i in range(count):
        tpl = random.choice(SAFE_TEMPLATES)
        sender, subject, body = tpl
        n = random.randint(100000, 999999)
        body    = body.replace("{n}", str(n)).replace("{plate}", random_plate()).replace("{date}", random_date())
        subject = subject.replace("{n}", str(n))

        nlp    = random.randint(0, 6)
        url    = random.randint(0, 4)
        sender_score = random.randint(0, 3)
        score  = random.randint(2, 18)

        records.append({
            "message":    body,
            "sender":     sender,
            "subject":    subject,
            "label":      "ham",
            "score":      score,
            "verdict":    "SAFE",
            "confidence": random.randint(90, 99),
            "nlp_score":  nlp,
            "url_score":  url,
            "sender_score": sender_score,
            "reasons":    [{"text": "No scam indicators found", "category": "NLP · Intent", "points": score}],
        })
    return records


# ─── Parse fraudulent email corpus ────────────────────────────────────────────
def parse_fraud_emails(path: str, limit: int):
    """Parse the mbox-style fradulent_emails.txt file."""
    with open(path, encoding="latin-1") as f:
        content = f.read()

    # Split on mbox separator
    raw_parts = re.split(r'\nFrom \S+[^\n]*\n', content)
    records = []

    for raw in raw_parts:
        if len(records) >= limit:
            break
        if not raw.strip():
            continue
        try:
            msg     = em.message_from_string(raw)
            sender  = msg.get("From", "unknown@email.com")
            subject = msg.get("Subject", "(no subject)")

            # Clean up sender — strip angle brackets and quoted names
            sender = re.sub(r'^.*<([^>]+)>.*$', r'\1', sender).strip()
            sender = sender[:100] if sender else "unknown@email.com"

            # Extract plain text body
            body = ""
            if msg.is_multipart():
                for part in msg.walk():
                    if part.get_content_type() == "text/plain":
                        payload = part.get_payload(decode=True)
                        if payload:
                            body = payload.decode("latin-1", errors="replace")
                            break
            else:
                payload = msg.get_payload(decode=True)
                if payload:
                    body = payload.decode("latin-1", errors="replace")
                else:
                    body = str(msg.get_payload())

            # Clean body — remove excessive whitespace, strip blank lines
            body = re.sub(r'\r\n', '\n', body)
            body = re.sub(r'\n{3,}', '\n\n', body).strip()

            # Combine subject + body for display
            full_text = f"Subject: {subject}\n\n{body}"

            if len(body) < 20:   # Skip near-empty bodies
                continue

            records.append({
                "message": full_text[:1000],
                "sender":  sender,
                "label":   "spam",
            })
        except Exception:
            continue

    return records


# ─── Main ─────────────────────────────────────────────────────────────────────
def main():
    print(f"📧 Email Corpus Loader")
    print(f"   Fraud emails to load : {args.fraud_limit}")
    print(f"   Safe emails to gen   : {args.safe_limit}")
    print()

    # Step 1: Parse fraud emails
    print(f"📂 Parsing: {email_path}")
    fraud_records = parse_fraud_emails(email_path, args.fraud_limit)
    print(f"✅ Parsed {len(fraud_records)} fraudulent emails")

    # Step 2: Generate safe emails
    safe_records = generate_safe_emails(args.safe_limit)
    print(f"✅ Generated {len(safe_records)} safe email records")
    print()

    all_records = fraud_records + safe_records
    random.shuffle(all_records)   # Mix fraud + safe together

    inserted = 0
    errors   = 0

    for i, rec in enumerate(all_records):
        try:
            label = rec["label"]

            # Score
            if label == "spam":
                analysis = heuristic_score_spam(rec["message"], rec.get("subject", ""))
            else:
                analysis = {
                    "score":      rec["score"],
                    "verdict":    rec["verdict"],
                    "confidence": rec["confidence"],
                    "nlp_score":  rec["nlp_score"],
                    "url_score":  rec["url_score"],
                    "sender_score": rec["sender_score"],
                    "reasons":    rec["reasons"],
                }

            # Insert scan
            scan_data = {
                "message_body": rec["message"][:500],
                "channel":      "email",
                "sender":       rec.get("sender", "unknown@email.com"),
                "score":        analysis["score"],
                "verdict":      analysis["verdict"],
                "confidence":   analysis["confidence"],
                "nlp_score":    analysis["nlp_score"],
                "url_score":    analysis["url_score"],
                "sender_score": analysis["sender_score"],
            }
            result = supabase.table("scans").insert(scan_data).execute()

            if result.data:
                scan_id = result.data[0]["id"]
                reasons_data = [
                    {
                        "scan_id":  scan_id,
                        "text":     r["text"],
                        "category": r["category"],
                        "points":   r["points"],
                    }
                    for r in analysis.get("reasons", [])
                ]
                if reasons_data:
                    supabase.table("scan_reasons").insert(reasons_data).execute()
                inserted += 1

            if (i + 1) % 50 == 0:
                print(f"   ... {i + 1}/{len(all_records)} processed")

        except Exception as e:
            errors += 1
            if errors <= 5:
                print(f"   ⚠️  Record {i+1} failed: {str(e)[:80]}")

    print()
    print(f"🎉 Done!")
    print(f"   Inserted : {inserted}")
    print(f"   Errors   : {errors}")
    print(f"   → Email channel now has rich data in your analytics dashboard.")


if __name__ == "__main__":
    main()
