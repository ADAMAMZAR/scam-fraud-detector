# Architecture Overview
## Scam Fraud Detector

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React (Vite), Vanilla CSS, Custom GlobalStyles |
| **Backend** | Python FastAPI, Uvicorn |
| **AI / NLP** | Google Gemini 2.5 Flash |
| **Database** | Supabase (PostgreSQL) |
| **Auth (planned)** | Supabase Auth |

---

## Data Flow

```
User submits message
       │
       ▼
AnalysePage.jsx
POST http://localhost:8000/analyze
       │
       ▼
FastAPI  main.py /analyze
       │
       ├──► ai_service.py
       │       └── Gemini 2.5 Flash
       │             └── Returns: { score, verdict, confidence, breakdown, reasons }
       │
       ├──► Supabase: INSERT INTO scans
       │
       └──► Supabase: INSERT INTO scan_reasons
               │
               ▼
       Response returned to frontend
       Result displayed in ResultCard
```

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/health` | Server health check |
| `POST` | `/analyze` | Analyze message via Gemini + persist to DB |
| `GET` | `/history` | Recent scan records |
| `GET` | `/stats` | Aggregate stats for analytics dashboard |
| `GET` | `/settings` | Load user settings from DB |
| `PATCH` | `/settings` | Update settings (dark mode, thresholds) |

---

## Folder Structure

```
scam-fraud-detector/
├── .gitignore
├── README.md
├── docs/                          ← Documentation
│   ├── schema.md                  ← Database schema & SQL
│   ├── requirements_analysis.md   ← Project requirements coverage
│   └── architecture.md            ← This file
├── backend/                       ← FastAPI server
│   ├── .env                       ← API keys (not committed)
│   ├── main.py                    ← FastAPI app + routes
│   ├── ai_service.py              ← Gemini analysis logic
│   ├── supabase_client.py         ← Supabase connection
│   ├── init_db.py                 ← One-time DB setup + seeding
│   ├── fix_rls.py                 ← Disable RLS for dev
│   ├── verify_db.py               ← Verify DB contents
│   ├── seed.sql                   ← SQL seed data reference
│   └── requirements.txt           ← Python dependencies
└── frontend/                      ← React app (Vite)
    └── src/
        ├── App.jsx                ← Root + hash-based routing
        ├── components/
        │   ├── GlobalStyles.jsx   ← Injected CSS + light/dark theme
        │   ├── Sidebar.jsx
        │   ├── Topbar.jsx
        │   ├── MessageDetail.jsx  ← Inline AI re-analysis
        │   ├── VerdictBadge.jsx
        │   ├── ScoreBar.jsx
        │   └── HeatSentence.jsx
        └── pages/
            ├── AnalysePage.jsx    ← Main scan UI → POST /analyze
            ├── MessagesPage.jsx   ← History → GET /history
            ├── AnalyticsPage.jsx  ← Dashboard → GET /stats
            ├── SettingsPage.jsx   ← Settings → GET/PATCH /settings
            └── BatchPage.jsx      ← Batch scan (scaffold)
```
