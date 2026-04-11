# 🛡️ ScamSense

> **AI-Powered Scam & Fraud Detection Assistant** — Nexperts Academy Problem Statement 1

An intelligent system that protects users from digital threats by analyzing messages, emails, and links using **Google Gemini AI**, with a full **FastAPI** backend and **Supabase** (PostgreSQL) database.

---

## 🚀 Quick Start

### 1. Backend
```bash
cd backend
pip install -r requirements.txt

# Setup .env with your credentials
# Then run once to initialize the database:
python init_db.py
python fix_rls.py

# Start the server
uvicorn main:app --reload
# API running at http://localhost:8000
```

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
# App running at http://localhost:5173
```

### 3. Environment Variables (`backend/.env`)
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
DATABASE_URL=postgresql://postgres:[password]@db.your-project.supabase.co:5432/postgres
GEMINI_API_KEY=your_gemini_key
```

---

## 📖 Documentation

| Document | Description |
|----------|-------------|
| [Requirements Analysis](docs/requirements_analysis.md) | Project requirements vs implementation coverage |
| [Architecture Overview](docs/architecture.md) | System design, data flow, folder structure |
| [Database Schema](docs/schema.md) | Supabase tables, SQL definitions, ER diagram |

---

## ✨ Features

- 🔍 **Real-time AI Analysis** via Gemini 2.5 Flash
- 📊 **0–100 Risk Score** with Fraud / Suspicious / Safe verdict
- 🧠 **AI Explainability** — SHAP-style reason breakdown per scan
- 🗂️ **Multi-Channel Support** — Text, File, URL, SMS, Email, WhatsApp
- 📈 **Analytics Dashboard** — Live stats from Supabase
- 🌙 **Dark / Light Mode** — Persisted to database
- 🔒 **Secure** — API keys server-side only, never in browser

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite |
| Backend | Python FastAPI |
| AI | Google Gemini 2.5 Flash |
| Database | Supabase (PostgreSQL) |