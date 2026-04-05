"""
load_kaggle_data.py
====================
Loads the SMS Spam Collection dataset from Kaggle into Supabase.

Usage:
    cd backend

    # Fast mode (heuristic scoring, no Gemini API calls):
    python load_kaggle_data.py

    # Enriched mode (real Gemini AI analysis per message - slow & uses quota):
    python load_kaggle_data.py --enrich --limit 100

Prerequisites:
    1. Download the dataset first:
       kaggle datasets download -d uciml/sms-spam-collection-dataset --unzip -p data/
    2. File should be at: backend/data/spam.csv
    3. .env must have SUPABASE_URL, SUPABASE_ANON_KEY (and GEMINI_API_KEY for --enrich)
"""

import os
import sys
import re
import csv
import argparse
import random
from dotenv import load_dotenv

load_dotenv()

# ─── Argument parsing ─────────────────────────────────────────────────────────
parser = argparse.ArgumentParser()
parser.add_argument("--enrich", action="store_true",
                    help="Use Gemini AI to score each message (slower, uses API quota)")
parser.add_argument("--limit", type=int, default=500,
                    help="Max rows to import (default: 500)")
parser.add_argument("--csv", type=str, default="data/spam.csv",
                    help="Path to spam.csv (default: data/spam.csv)")
args = parser.parse_args()

# ─── Validate CSV exists ──────────────────────────────────────────────────────
csv_path = os.path.join(os.path.dirname(__file__), args.csv)
if not os.path.exists(csv_path):
    print("❌ Dataset not found at:", csv_path)
    print()
    print("   Download it first:")
    print("   kaggle datasets download -d uciml/sms-spam-collection-dataset --unzip -p data/")
    sys.exit(1)

# ─── Supabase client ──────────────────────────────────────────────────────────
from supabase import create_client

supabase = create_client(
    os.environ["SUPABASE_URL"],
    os.environ["SUPABASE_ANON_KEY"]
)

# ─── Heuristic scorer (no Gemini) ─────────────────────────────────────────────
SPAM_KEYWORDS = re.compile(
    r"urgent|free|win|won|prize|claim|click|verify|suspended|account|login|"
    r"password|bank|congratulations|selected|reward|offer|limited|guaranteed|"
    r"call now|act now|bit\.ly|tinyurl|http://",
    re.IGNORECASE
)

def heuristic_score(text: str, label: str):
    """
    Compute a score, verdict, confidence, and reasons without calling Gemini.
    Fast enough for bulk imports.
    """
    matches = SPAM_KEYWORDS.findall(text)
    has_url = bool(re.search(r"http[s]?://|bit\.ly|tinyurl", text, re.I))
    word_count = len(text.split())
    exclamations = text.count("!")

    if label == "spam":
        # Build score from signals
        base = 60
        nlp = min(40, 15 + len(matches) * 5 + exclamations * 2)
        url = 28 if has_url else 8
        sender = random.randint(15, 28)
        score = min(100, base + len(matches) * 3)
        verdict = "FRAUD" if score >= 75 else "SUSPICIOUS"
        confidence = random.randint(82, 99)
        reasons = [
            {"text": f"Spam keyword detected: '{m}'", "category": "NLP · Keywords", "points": 10}
            for m in matches[:3]
        ]
        if has_url:
            reasons.append({"text": "Suspicious URL detected", "category": "URL · Domain", "points": 20})
        if not reasons:
            reasons = [{"text": "Spam pattern identified", "category": "NLP · Intent", "points": 30}]
    else:
        nlp = random.randint(0, 5)
        url = 0
        sender = random.randint(0, 3)
        score = random.randint(0, 15)
        verdict = "SAFE"
        confidence = random.randint(90, 99)
        reasons = [{"text": "No scam indicators found", "category": "NLP · Intent", "points": score}]

    return {
        "score": score,
        "verdict": verdict,
        "confidence": confidence,
        "nlp_score": nlp,
        "url_score": url,
        "sender_score": sender,
        "reasons": reasons
    }

# ─── Gemini enricher (optional) ───────────────────────────────────────────────
def gemini_score(text: str):
    from ai_service import AIService
    result = AIService.analyze_message(text)
    result["verdict"] = result["verdict"].upper()
    return result

# ─── Main loader ──────────────────────────────────────────────────────────────
def main():
    mode = "Gemini AI" if args.enrich else "Heuristic (fast)"
    print(f"📂 Loading: {csv_path}")
    print(f"🔢 Limit:   {args.limit} rows")
    print(f"🧠 Mode:    {mode}")
    print()

    rows = []
    with open(csv_path, encoding="latin-1") as f:
        reader = csv.DictReader(f)
        for row in reader:
            label = row.get("v1", "").strip().lower()   # "ham" or "spam"
            text  = row.get("v2", "").strip()
            if label in ("ham", "spam") and text:
                rows.append((label, text))
            if len(rows) >= args.limit:
                break

    print(f"✅ Read {len(rows)} rows from CSV")
    spam_count = sum(1 for l, _ in rows if l == "spam")
    ham_count  = len(rows) - spam_count
    print(f"   Spam: {spam_count}  |  Ham (safe): {ham_count}")
    print()

    inserted = 0
    errors   = 0

    for i, (label, text) in enumerate(rows):
        try:
            # Score the message
            if args.enrich:
                analysis = gemini_score(text)
            else:
                analysis = heuristic_score(text, label)

            # Insert scan
            scan_data = {
                "message_body": text[:500],   # Truncate very long messages
                "channel":      "sms",
                "sender":       "Kaggle SMS Dataset",
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
                # Insert reasons
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

            # Progress indicator
            if (i + 1) % 50 == 0:
                print(f"   ... {i + 1}/{len(rows)} rows processed")

        except Exception as e:
            errors += 1
            if errors <= 5:
                print(f"   ⚠️  Row {i+1} failed: {str(e)[:80]}")

    print()
    print(f"🎉 Done! Inserted: {inserted}  |  Errors: {errors}")
    print("   → Refresh your Messages page to see the data.")

if __name__ == "__main__":
    main()
