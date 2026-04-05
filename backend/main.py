import os
from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
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
