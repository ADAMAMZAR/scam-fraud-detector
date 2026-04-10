import os
import uuid
from fastapi import FastAPI, HTTPException, Body, UploadFile, File, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, timedelta, timezone
from collections import defaultdict
from dotenv import load_dotenv
import csv
import io
import json

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

class BatchItem(BaseModel):
    message: str
    channel: str = "text"
    sender: Optional[str] = None

class BatchRequest(BaseModel):
    items: List[BatchItem]

class AsyncBatchRequest(BaseModel):
    items: List[BatchItem]
    file_name: Optional[str] = None

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
        analysis = AIService.analyze_message(
            request.message, 
            channel=request.channel, 
            sender=request.sender or "Unknown"
        )
        
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

@app.post("/batch-analyze")
async def batch_analyze(request: BatchRequest):
    """
    Analyzes a batch of messages sequentially.
    Returns a list of results (same schema as /analyze) plus an index.
    Failed items include an 'error' key instead of a full result.
    """
    results = []
    for idx, item in enumerate(request.items):
        try:
            analysis = AIService.analyze_message(
                item.message,
                channel=item.channel,
                sender=item.sender or "Batch Upload"
            )
            scan_data = {
                "message_body": item.message,
                "channel": item.channel,
                "sender": item.sender,
                "score": analysis["score"],
                "verdict": analysis["verdict"].upper(),
                "confidence": analysis["confidence"],
                "nlp_score": analysis["breakdown"].get("NLP", 0),
                "url_score": analysis["breakdown"].get("URL", 0),
                "sender_score": analysis["breakdown"].get("Sender", 0),
                "heatmap": analysis.get("heatmap", []),
            }
            result = supabase.table("scans").insert(scan_data).execute()
            scan_id = result.data[0]["id"] if result.data else None

            if analysis.get("reasons") and scan_id:
                reasons_data = [
                    {"scan_id": scan_id, "text": r["text"], "category": r["category"], "points": r["points"]}
                    for r in analysis["reasons"]
                ]
                supabase.table("scan_reasons").insert(reasons_data).execute()

            results.append({
                "index": idx,
                "id": scan_id,
                "message": item.message[:120],
                "channel": item.channel,
                "sender": item.sender,
                **analysis,
                "created_at": result.data[0].get("created_at") if result.data else None,
            })
        except Exception as e:
            results.append({
                "index": idx,
                "message": item.message[:120],
                "channel": item.channel,
                "error": str(e),
                "score": 0,
                "verdict": "ERROR",
            })
    return {"total": len(results), "results": results}

# ─── Async Batch Endpoints ────────────────────────────────────────────────────

async def _run_batch_job(job_id: str, items: list):
    """
    Background task: processes each item in the batch, updating the job
    record in Supabase after every item so the frontend can poll progress.
    """
    total = len(items)
    completed = 0
    failed = 0
    results = []

    # Mark as processing
    supabase.table("batch_jobs").update({
        "status": "processing",
        "total": total,
    }).eq("id", job_id).execute()

    for idx, item in enumerate(items):
        # Check for cancellation
        job_row = supabase.table("batch_jobs").select("status").eq("id", job_id).execute()
        if job_row.data and job_row.data[0]["status"] == "cancelled":
            break

        try:
            analysis = AIService.analyze_message(
                item["message"],
                channel=item.get("channel", "text"),
                sender=item.get("sender") or "Batch Upload"
            )
            scan_data = {
                "message_body": item["message"][:500],
                "channel":      item.get("channel", "text"),
                "sender":       item.get("sender"),
                "score":        analysis["score"],
                "verdict":      analysis["verdict"].upper(),
                "confidence":   analysis["confidence"],
                "nlp_score":    analysis["breakdown"].get("NLP", 0),
                "url_score":    analysis["breakdown"].get("URL", 0),
                "sender_score": analysis["breakdown"].get("Sender", 0),
                "heatmap":      analysis.get("heatmap", []),
            }
            result = supabase.table("scans").insert(scan_data).execute()
            scan_id = result.data[0]["id"] if result.data else None

            if analysis.get("reasons") and scan_id:
                reasons_data = [
                    {"scan_id": scan_id, "text": r["text"], "category": r["category"], "points": r["points"]}
                    for r in analysis["reasons"]
                ]
                supabase.table("scan_reasons").insert(reasons_data).execute()

            results.append({
                "index":      idx,
                "id":         scan_id,
                "message":    item["message"][:120],
                "channel":    item.get("channel", "text"),
                "sender":     item.get("sender"),
                "score":      analysis["score"],
                "verdict":    analysis["verdict"].upper(),
                "confidence": analysis["confidence"],
                "breakdown":  analysis.get("breakdown", {}),
                "reasons":    analysis.get("reasons", []),
            })
            completed += 1

        except Exception as e:
            results.append({
                "index":   idx,
                "message": item["message"][:120],
                "channel": item.get("channel", "text"),
                "verdict": "ERROR",
                "score":   0,
                "error":   str(e)[:200],
            })
            failed += 1

        # Update progress after every item
        supabase.table("batch_jobs").update({
            "completed":    completed,
            "failed_count": failed,
        }).eq("id", job_id).execute()

    # Final update
    final_status = "complete"
    job_row = supabase.table("batch_jobs").select("status").eq("id", job_id).execute()
    if job_row.data and job_row.data[0]["status"] == "cancelled":
        final_status = "cancelled"

    supabase.table("batch_jobs").update({
        "status":       final_status,
        "completed":    completed,
        "failed_count": failed,
        "results_json": results,
    }).eq("id", job_id).execute()


@app.post("/v1/analyse/batch")
async def async_batch_analyse(
    request: AsyncBatchRequest,
    background_tasks: BackgroundTasks,
):
    """
    Creates a batch job and starts processing in the background.
    Returns job_id immediately — frontend polls GET /v1/jobs/{job_id}.
    """
    if not request.items:
        raise HTTPException(status_code=400, detail="No items provided.")
    if len(request.items) > 200:
        raise HTTPException(status_code=400, detail="Max 200 items per batch.")

    # Create job record in Supabase
    job_data = {
        "status":     "queued",
        "total":      len(request.items),
        "completed":  0,
        "file_name":  request.file_name,
    }
    result = supabase.table("batch_jobs").insert(job_data).execute()
    if not result.data:
        raise HTTPException(status_code=500, detail="Failed to create job record.")

    job_id = result.data[0]["id"]

    # Serialise items for the background task (Pydantic → plain dicts)
    items_dict = [{"message": it.message, "channel": it.channel, "sender": it.sender}
                  for it in request.items]

    # Fire the background task
    background_tasks.add_task(_run_batch_job, job_id, items_dict)

    return {
        "job_id":    job_id,
        "total":     len(request.items),
        "status":    "queued",
    }


@app.get("/v1/jobs/{job_id}")
async def get_job_status(job_id: str):
    """
    Returns current status of a batch job.
    Frontend polls this every ~2s until status == 'complete' or 'failed'.
    """
    try:
        result = supabase.table("batch_jobs").select("*").eq("id", job_id).execute()
        if not result.data:
            raise HTTPException(status_code=404, detail="Job not found.")
        job = result.data[0]
        return {
            "job_id":      job["id"],
            "status":      job["status"],           # queued|processing|complete|failed|cancelled
            "total":       job["total"],
            "completed":   job["completed"],
            "failed":      job["failed_count"],
            "results":     job.get("results_json") or [],
            "created_at":  job["created_at"],
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/v1/jobs/{job_id}/cancel")
async def cancel_job(job_id: str):
    """
    Signals the background task to stop after the current item.
    """
    result = supabase.table("batch_jobs").select("status").eq("id", job_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Job not found.")
    current = result.data[0]["status"]
    if current in ("complete", "failed", "cancelled"):
        raise HTTPException(status_code=400, detail=f"Job already {current}.")
    supabase.table("batch_jobs").update({"status": "cancelled"}).eq("id", job_id).execute()
    return {"ok": True, "job_id": job_id, "status": "cancelled"}

@app.post("/parse-file")
async def parse_file(file: UploadFile = File(...)):
    """
    Parses a CSV or PDF file and returns structured rows for preview.
    CSV: expects columns 'message', 'channel' (optional), 'sender' (optional).
    PDF: extracts text, splits by blank lines or sentences into rows.
    """
    filename = file.filename or ""
    content_type = file.content_type or ""

    try:
        file_bytes = await file.read()

        # ── CSV ──────────────────────────────────────────────────────────────
        if filename.endswith(".csv") or "csv" in content_type:
            text = file_bytes.decode("utf-8", errors="replace")
            reader = csv.DictReader(io.StringIO(text))
            rows = []
            for i, row in enumerate(reader):
                # Try to map common column names
                message = (row.get("message") or row.get("text")  or
                           row.get("body")    or row.get("content") or "").strip()
                channel = (row.get("channel") or "text").strip().lower()
                sender  = (row.get("sender")  or row.get("from") or "").strip()
                if message:
                    rows.append({"index": i, "message": message, "channel": channel, "sender": sender})
            return {"type": "csv", "total": len(rows), "rows": rows[:200]}

        # ── PDF ──────────────────────────────────────────────────────────────
        elif filename.endswith(".pdf") or "pdf" in content_type:
            try:
                import pypdf
                reader = pypdf.PdfReader(io.BytesIO(file_bytes))
                text = "\n".join(page.extract_text() or "" for page in reader.pages)
            except ImportError:
                # Fallback: basic raw text extraction
                text = file_bytes.decode("latin-1", errors="replace")

            # Split into chunks by blank lines
            chunks = [c.strip() for c in text.split("\n\n") if c.strip() and len(c.strip()) > 10]
            rows = [{"index": i, "message": chunk[:500], "channel": "text", "sender": ""}
                    for i, chunk in enumerate(chunks[:200])]
            return {"type": "pdf", "total": len(rows), "rows": rows}

        else:
            raise HTTPException(status_code=400, detail="Only CSV and PDF files are supported.")

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze-image", response_model=ScanResponse)
async def analyze_image(file: UploadFile = File(...)):
    """
    Accepts an image file (screenshot) and analyzes it for scam/fraud.
    Uses Gemini Vision to extract text and detect malicious patterns.
    """
    # Validate file type
    allowed_types = {"image/jpeg", "image/png", "image/webp", "image/gif"}
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type: {file.content_type}. Please upload JPG, PNG, or WEBP."
        )

    try:
        # Read file bytes
        image_bytes = await file.read()

        # Step 1: Analyze image via Gemini Vision
        analysis = AIService.analyze_image(image_bytes, mime_type=file.content_type)

        # Step 2: Use extracted text as the message body
        extracted_text = analysis.get("extracted_text", "[Image content — text could not be extracted]")

        # Step 3: Persist to Supabase
        scan_data = {
            "message_body": extracted_text[:2000],  # Truncate long extracted text
            "channel": "image",
            "sender": file.filename or "Image Upload",
            "score": analysis["score"],
            "verdict": analysis["verdict"].upper(),
            "confidence": analysis["confidence"],
            "nlp_score": analysis["breakdown"].get("NLP", 0),
            "url_score": analysis["breakdown"].get("URL", 0),
            "sender_score": analysis["breakdown"].get("Sender", 0),
            "heatmap": analysis.get("heatmap", []),
        }

        result = supabase.table("scans").insert(scan_data).execute()

        if not result.data:
            raise HTTPException(status_code=500, detail="Database insertion failed.")

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
            **{k: v for k, v in analysis.items() if k != "extracted_text"},
            "heatmap": analysis.get("heatmap", []),
            "created_at": result.data[0].get("created_at")
        }

    except HTTPException:
        raise
    except Exception as e:
        print(f"Image analysis failed: {str(e)}")
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
