# 🧭 Smart Career Path Recommendation System & AI Intelligence Platform (Python Edition)

An AI-powered career intelligence and guidance platform built **predominantly in Python** (>90% of the codebase). The platform synthesizes candidate academic backgrounds, genuine passions, and career aspirations into sequential, actionable roadmaps backed by a curated database of **140+ industry career tracks**, live AI mentorship, diagnostic skill quizzes, and publication-ready 4-page Executive Career Blueprint PDF generation.

---

## 🏗️ System Architecture (100% Python Core)

```text
                                  ┌───────────────────────────────┐
                                  │       Client Browser          │
                                  │   (HTML5 + Tailwind CSS + JS) │
                                  └───────────────┬───────────────┘
                                                  │
                                                  ▼
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│                           FastAPI Full-Stack Python Core Application                            │
│                                                                                                 │
│  • run.py                      -> Single-command application entrypoint                         │
│  • app/main.py                 -> FastAPI application, lifespan, CORS & static mounting        │
│  • app/routers/pages.py        -> Dynamic Jinja2 server-rendered views (/, /dashboard, etc.)    │
│  • app/routers/api.py          -> REST API gateways (/api/recommend, /api/chat, /api/pdf, etc.) │
│                                                                                                 │
│  Core Python Engines (app/core/):                                                               │
│  ├── career_engine.py          -> 140+ Career taxonomy, tokenization & hybrid scoring engine    │
│  ├── resume_parser.py          -> Pure Python PDF text extractor (pypdf + zlib) & skill matcher │
│  ├── pdf_builder.py            -> 4-Page Executive Career Blueprint PDF generator (ReportLab)   │
│  ├── ai_mentor.py              -> Multi-tier 24/7 AI Mentor "V" (Gemini 3.6 Flash & Groq 120B)  │
│  ├── quiz_engine.py            -> Dynamic skill-gap diagnostic test generator                   │
│  └── database.py               -> SQLite persistence for accounts, profiles, and milestones     │
└─────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## ⚡ Tech Stack

- **Core Programming Language**: **Python 3.10+ / 3.14** *(~90% of the entire codebase)*
- **Web Framework**: [FastAPI](https://fastapi.tiangolo.com/) + [Uvicorn](https://www.uvicorn.org/) (Asynchronous, type-safe REST API and web routing)
- **Templating & Presentation**: [Jinja2](https://palletsprojects.com/p/jinja/) with [Tailwind CSS](https://tailwindcss.com/) (Glassmorphism, dark/light theme tokens, 3D button animations)
- **PDF Generation Engine**: [ReportLab](https://www.reportlab.com/) (Generates professional, 4-page print-accurate Executive Career Blueprint PDFs in pure Python)
- **PDF Extraction Engine**: [pypdf](https://pypdf.readthedocs.io/) + Python in-memory `zlib` stream decompressor
- **AI / LLM Multi-Tier Pipeline**:
  - **Google Gemini 3.6 Flash** (High-context career reasoning)
  - **Groq Llama 3 / OSS-120B / Compound** (Ultra-fast real-time chat inference)
  - **Heuristic Offline Fallback** (Deterministic career advisor when offline)
- **Database & Persistence**: [SQLite](https://www.sqlite.org/) (Built-in, zero-configuration local database storing users, profiles, and milestone progress)

---

## ✨ Core Features & Capabilities

### 1. 📄 Pure Python Resume Parser (`POST /api/resume/parse`)
- Upload any standard PDF resume on the assessment screen.
- Employs `pypdf` with a pure Python in-memory `zlib` FlateDecode decompressor fallback and a 350+ industry skill dictionary.
- Automatically parses: Full Name, Degree, Academic Stream, Technical Skills, Frameworks, and Tools.
- Pre-fills all 4 stages of the assessment form instantly while remaining completely editable.

### 2. 🧠 Hybrid Career Recommendation Engine (`POST /api/recommend`)
- Combines keyword extraction, semantic matching, and feature overlap scoring.
- Evaluates academic stream alignment, technical skill overlap percentage, dream role synergy, and preferred work environments.
- Ranks top matches from a curated database of **140+ career tracks spanning 21 industry sectors**.
- Provides a clear breakdown of matching skills vs. skills to develop, estimated salary brackets, and ramp-up timelines.

### 3. 🤖 Dedicated 24/7 AI Career Mentor "V" (`POST /api/chat`)
- An embedded floating AI companion available on every page.
- Powered by Google Gemini 3.6 Flash and Groq ultra-fast inference with conversation context.
- Answers questions on salary negotiations, interview preparation, career transitions, and course recommendations.
- Includes a rich domain-specific offline fallback engine.

### 4. 📄 4-Page Executive Career Blueprint PDF Generator (`POST /api/export/pdf`)
- Single-click export from any career roadmap in pure Python using `reportlab`:
  - **Page 1**: Executive Cover, Candidate Profile Snapshot, Key Metrics & Table of Contents.
  - **Page 2**: Role Overview, Prioritized Skills Matrix, Compensation Tiers by Level, and Certifications.
  - **Page 3**: Sequential Learning Roadmap with numbered milestones, durations, procedures, and learning resources.
  - **Page 4**: Long-Term Career Trajectory, Tactical 30-60-90 Day Action Plan, and Ecosystem Resources.

### 5. 🎯 Interactive Skill-Gap Diagnostic Quiz (`POST /api/quiz/generate` & `/career-path/quiz`)
- Dynamically generates multiple-choice technical diagnostic tests focused on the exact skills identified in your gap analysis.
- Features instant answer verification, detailed technical explanations, and score tier classification.

### 6. ⚖️ Side-by-Side Career Comparison Matrix (`/compare`)
- Select up to 3 careers to compare side-by-side.
- Contrasts match scores, timelines, salary potential, and skill overlap in a unified matrix.

### 7. 📈 Learning Progress Tracker & World Profile Dashboard (`/dashboard`)
- Interactive checkboxes on every milestone of your career roadmap.
- Animated circular completion gauges for Academics, Interests, and Aspirations.
- Persistent user profile sessions with Login, Registration, and Password Recovery.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Python 3.10+** (Python 3.11, 3.12, 3.13, or 3.14)
- **pip** (Python package manager)

---

### 2. Installation & Setup

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Rafi0496/Smart-Career-Path-Recommendation.git
   cd Smart-Career-Path-Recommendation/Mini-Project-main
   ```

2. **Install Python Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure Environment Keys (Optional)**:
   Create a `.env.local` or `.env` file:
   ```ini
   # Groq API Key (Recommended for live AI Assistant "V")
   GROQ_API_KEY=gsk_...

   # Google Gemini API Key (Alternative AI provider)
   GEMINI_API_KEY=...
   ```
   > **Note:** The application includes full standalone fallbacks! If no API keys are provided, all recommendation, quiz, resume parsing, and chat features remain functional.

---

### 3. Launch the Application

Run the single-command Python entrypoint:

```bash
python run.py
```

- **Web Application**: [http://localhost:8000](http://localhost:8000)
- **Interactive Swagger API Documentation**: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 📂 Codebase Structure (Python-First)

```text
Mini-Project-main/
├── run.py                       # Single-command Python entrypoint (`python run.py`)
├── requirements.txt             # Python dependencies (FastAPI, Uvicorn, ReportLab, etc.)
├── .env.example                 # Environment configuration template
├── app/                         # Core Full-Stack Python Package (~90% Python)
│   ├── __init__.py
│   ├── main.py                  # FastAPI app initialization, CORS & static mounting
│   ├── config.py                # Environment and path settings
│   ├── core/                    # Core Python Algorithms & Intelligence Engines
│   │   ├── __init__.py
│   │   ├── career_engine.py     # 140+ Career taxonomy & hybrid scoring algorithm
│   │   ├── resume_parser.py     # Pure Python PDF text extractor & skill taxonomy
│   │   ├── pdf_builder.py       # 4-Page Executive Career Blueprint PDF engine (ReportLab)
│   │   ├── ai_mentor.py         # Multi-tier live AI mentor "V" (Gemini / Groq / Fallback)
│   │   ├── quiz_engine.py       # Diagnostic skill-gap quiz generator
│   │   └── database.py          # SQLite persistence for auth, profiles, and milestones
│   ├── routers/                 # FastAPI Route Handlers
│   │   ├── __init__.py
│   │   ├── pages.py             # Server-rendered HTML routes (/, /dashboard, /assessment, etc.)
│   │   └── api.py               # REST API endpoints (/api/recommend, /api/chat, /api/pdf, etc.)
│   ├── templates/               # Jinja2 HTML Templates (Exact UI Design)
│   │   ├── base.html            # Global layout with Navbar, theme toggle & AI mentor
│   │   ├── index.html           # Landing page
│   │   ├── assessment.html      # 4-stage assessment with resume drag & drop
│   │   ├── dashboard.html       # Analytics, active progress & category explorer
│   │   ├── career_path.html     # Sequential roadmap with milestone checkboxes
│   │   ├── quiz.html            # Interactive skill-gap diagnostic test
│   │   ├── compare.html         # Side-by-side career comparison matrix
│   │   ├── login.html           # User login with password recovery
│   │   └── register.html        # User account creation
│   └── static/                  # Static Assets
│       ├── css/styles.css       # Glassmorphism tokens & animations
│       └── js/
│           ├── app.js           # Client state, theme toggle & storage helpers
│           └── assistant.js     # Floating AI Mentor "V" controller
```

---

## 📜 License

This project is open source and available under the [MIT License](LICENSE).
