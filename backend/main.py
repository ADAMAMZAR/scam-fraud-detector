import os
from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, timedelta, timezone
from collections import defaultdict
from dotenv import load_dotenv

# Local Imports
from supabase_client import supabase
from ai_service import AIService

# Load environment variables
load_dotenv()

app = FastAPI(title="Scam Fraud Detector API")

# Enable CORS for the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Pydantic Models ─────────────────────────────────────────────────────────

class ScanRequest(BaseModel):
    message: str
    channel: str = "text"
    sender: Optional[str] = None

class ScanResponse(BaseModel):
    id: str
    score: int
    verdict: str
    confidence: int
    breakdown: dict
    reasons: List[dict]
    heatmap: List[dict]
    created_at: str

# ─── API Routes ──────────────────────────────────────────────────────────────

@app.get("/health")
def health_check():
    """Confirms the API is online."""
    return {"status": "ok", "timestamp": datetime.now().isoformat()}

@app.post("/analyze", response_model=ScanResponse)
async def analyze_message(request: ScanRequest):
    """
    1. Analyzes a message via Gemini.
    2. Persists the result to Supabase.
    3. Returns the full analysis.
    """
    try:
        # Step 1: Analyze via Gemini
        analysis = AIService.analyze_message(request.message)
        
        # Step 2: Prepare data for Supabase
        scan_data = {
            "message_body": request.message,
            "channel": request.channel,
            "sender": request.sender,
            "score": analysis["score"],
            "verdict": analysis["verdict"].upper(),   # Normalize: "Fraud" → "FRAUD"
            "confidence": analysis["confidence"],
            "nlp_score": analysis["breakdown"].get("NLP", 0),
            "url_score": analysis["breakdown"].get("URL", 0),
            "sender_score": analysis["breakdown"].get("Sender", 0),
            "heatmap": analysis.get("heatmap", []),
        }
        
        # Step 3: Insert into Supabase 'scans' table
        result = supabase.table("scans").insert(scan_data).execute()
        
        if not result.data:
            raise HTTPException(status_code=500, detail="Database insertion failed.")

        # Step 4: Insert Reasons (if any)
        scan_id = result.data[0]["id"]
        if analysis.get("reasons"):
            reasons_data = [
                {
                    "scan_id": scan_id,
                    "text": reason["text"],
                    "category": reason["category"],
                    "points": reason["points"]
                } for reason in analysis["reasons"]
            ]
            supabase.table("scan_reasons").insert(reasons_data).execute()
            
        return {
            "id": scan_id,
            **analysis,
            "heatmap": analysis.get("heatmap", []),
            "created_at": result.data[0].get("created_at")
        }

    except Exception as e:
        print(f"Analysis failed: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/history")
async def get_history(limit: int = 20):
    """Fetches recently analyzed messages from Supabase."""
    try:
        result = supabase.table("scans").select("*").order("created_at", desc=True).limit(limit).execute()
        return result.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/stats")
async def get_stats():
    """Calculates aggregate statistics for the dashboard."""
    try:
        # Fetch all scans to calculate stats (simple approach for now)
        result = supabase.table("scans").select("verdict, channel").execute()
        data = result.data
        
        scams = len([d for d in data if d["verdict"] == "FRAUD"])
        suspicious = len([d for d in data if d["verdict"] == "SUSPICIOUS"])
        safe = len([d for d in data if d["verdict"] == "SAFE"])
        
        # Channel distribution
        channels = {}
        for d in data:
            ch = d["channel"]
            channels[ch] = channels.get(ch, 0) + 1
            
        channel_data = [{"name": k.capitalize(), "value": v} for k, v in channels.items()]
        
        return {
            "total": len(data),
            "scams": scams,
            "suspicious": suspicious,
            "safe": safe,
            "channels": channel_data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/analytics/summary")
async def get_analytics_summary(time_range: str = "7d"):
    """
    Returns rich analytics data for charts:
    - trend[]:    daily scam/suspicious/safe counts over the selected range
    - tactics[]:  tactic frequency across all scans in range
    - channels[]: message count per channel
    - anomaly:    spike detection vs 7-day average
    """
    try:
        # Determine day window
        days_map = {"1d": 1, "7d": 7, "30d": 30, "90d": 90}
        days = days_map.get(time_range, 7)
        since = (datetime.now(timezone.utc) - timedelta(days=days)).isoformat()

        result = supabase.table("scans") \
            .select("verdict, channel, created_at, heatmap") \
            .gte("created_at", since) \
            .order("created_at") \
            .execute()
        data = result.data or []

        # ── Trend: group by date ──────────────────────────────────────────────
        trend_map = defaultdict(lambda: {"scam": 0, "suspicious": 0, "safe": 0})
        for row in data:
            day = row["created_at"][:10]  # "YYYY-MM-DD"
            v   = row.get("verdict", "")
            if v == "FRAUD":       trend_map[day]["scam"]       += 1
            elif v == "SUSPICIOUS": trend_map[day]["suspicious"] += 1
            elif v == "SAFE":       trend_map[day]["safe"]       += 1

        # Fill every day in range (even zero days)
        trend = []
        for i in range(days):
            day = (datetime.now(timezone.utc) - timedelta(days=days - 1 - i)).strftime("%Y-%m-%d")
            entry = trend_map.get(day, {"scam": 0, "suspicious": 0, "safe": 0})
            trend.append({"date": day, **entry})

        # ── Tactics: extract from heatmap JSONB ───────────────────────────────
        tactic_counts = defaultdict(int)
        for row in data:
            heatmap = row.get("heatmap") or []
            for sentence in heatmap:
                t = sentence.get("tactic")
                if t and t != "NEUTRAL":
                    tactic_counts[t] += 1

        tactics = sorted(
            [{"tactic": k, "count": v} for k, v in tactic_counts.items()],
            key=lambda x: x["count"], reverse=True
        )[:8]  # top 8 tactics

        # ── Channels ──────────────────────────────────────────────────────────
        channel_counts = defaultdict(int)
        for row in data:
            ch = row.get("channel") or "unknown"
            channel_counts[ch.capitalize()] += 1

        channels = sorted(
            [{"channel": k, "count": v} for k, v in channel_counts.items()],
            key=lambda x: x["count"], reverse=True
        )

        # ── Anomaly: compare today's rate to 7-day average ───────────────────
        today_str  = datetime.now(timezone.utc).strftime("%Y-%m-%d")
        today_rows = [r for r in data if r["created_at"][:10] == today_str]
        today_scam = sum(1 for r in today_rows if r.get("verdict") == "FRAUD")
        today_rate = (today_scam / len(today_rows)) if today_rows else 0

        # 7-day average (excluding today)
        past_rows = [r for r in data if r["created_at"][:10] != today_str]
        past_scam = sum(1 for r in past_rows if r.get("verdict") == "FRAUD")
        avg_rate  = (past_scam / len(past_rows)) if past_rows else 0
        ratio     = round(today_rate / avg_rate, 2) if avg_rate > 0 else 0

        anomaly = {
            "detected":    ratio >= 2.0 and len(today_rows) >= 3,
            "ratio":       ratio,
            "today_rate":  round(today_rate, 2),
            "avg_7d_rate": round(avg_rate, 2),
        }

        return {
            "range":    time_range,
            "total":    len(data),
            "trend":    trend,
            "tactics":  tactics,
            "channels": channels,
            "anomaly":  anomaly,
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/settings")
async def get_settings():
    """Fetches application settings from Supabase. Returns defaults if none exist."""
    try:
        result = supabase.table("settings").select("*").limit(1).execute()
        if result.data:
            return result.data[0]
        # No settings row yet — return defaults
        return {"dark_mode": True, "safe_threshold": 40, "fraud_threshold": 75}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.patch("/settings")
async def update_settings(payload: dict = Body(...)):
    """Upserts application settings in Supabase."""
    try:
        result = supabase.table("settings").select("id").limit(1).execute()
        if result.data:
            # Update existing row
            row_id = result.data[0]["id"]
            supabase.table("settings").update(payload).eq("id", row_id).execute()
        else:
            # Insert first row
            supabase.table("settings").insert(payload).execute()
        return {"ok": True, **payload}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Entrypoint
if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
