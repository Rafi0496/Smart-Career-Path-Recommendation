# Smart Career Path Recommendation System & AI/ML Microservice

An AI-powered, production-grade career guidance platform that helps students and professionals discover tailored career trajectories. The platform pairs a modern **Next.js 14** web application with a dedicated **Python FastAPI ML microservice** acting as the AI/ML intelligence engine.

---

## 🏗️ System Architecture

```text
                                  ┌───────────────────────────────┐
                                  │       Client Browser          │
                                  └───────────────┬───────────────┘
                                                  │
                                                  ▼
                                  ┌───────────────────────────────┐
                                  │   Next.js 14 Frontend & API   │
                                  │   (TypeScript, Tailwind CSS)  │
                                  └───────┬───────────────┬───────┘
                                          │               │
                 Proxy AI Workloads       │               │ Progress Sync
            (HTTP / PYTHON_SERVICE_URL)   │               │ (PostgreSQL / Supabase)
                                          ▼               ▼
┌─────────────────────────────────────────────────────────┐   ┌───────────────────────────┐
│              Python FastAPI ML Microservice             │   │    PostgreSQL Database    │
│                                                         │   │    (learning_progress,    │
│  • Resume Extractor (pdfplumber + spaCy NER)            │   │     user_profiles)        │
│  • Hybrid Recommender (Sentence-Transformers + Cosine)  │   └───────────────────────────┘
│  • Skill-Gap Quiz Engine (Structured Diagnostic LLM)    │
│  • PDF Builder (Jinja2 + WeasyPrint Engine)             │
│  • 140+ Career Embeddings Vector Cache (all-MiniLM-L6)  │
└─────────────────────────────────────────────────────────┘
```

---

## ⚡ Tech Stack

### AI / Machine Learning & Microservice:
- **FastAPI**: Asynchronous Python API microservice framework with high performance.
- **sentence-transformers (`all-MiniLM-L6-v2`)**: Precomputes and caches 384-dimensional dense semantic vectors for 140+ industry career profiles.
- **scikit-learn & numpy**: Cosine similarity computation, matrix normalization, and TF-IDF fallback vectorization.
- **spaCy (`en_core_web_sm`)**: Named Entity Recognition (NER) pipeline for extracting candidate name, educational background, and tenure.
- **pdfplumber**: Extracting structured text, credentials, and tabular data from PDF resumes.
- **WeasyPrint**: Rendering print-accurate, publication-quality PDF career roadmaps from Jinja2 templates.
- **OpenAI API (Optional)**: Dynamic contextual reasoning and grounded skill-gap quiz generation.

### Web Application & Frontend:
- **Next.js 14 (App Router)** & **React 18**
- **TypeScript** & **Tailwind CSS**
- **Lucide React** for icons
- **PostgreSQL / Supabase**: Schema provided in `scripts/schema.sql` for persistent progress tracking.
- **Docker & Docker Compose**: Multi-container orchestration for local development and deployment.

---

## ✨ Core Features

### 1. 📄 ML Resume Parser (`POST /resume/parse`)
- Upload any standard PDF resume on the assessment screen.
- Employs `pdfplumber` for text parsing and spaCy NER combined with a 350+ skill taxonomy.
- Automatically extracts: candidate name, contact, education level, stream of study, technical skills, tools, frameworks, and certifications.
- Pre-fills all 4 stages of the assessment form instantly while remaining completely editable.

### 2. 🧠 Hybrid Recommender Engine (`POST /recommend`)
- Augments rule matching with deep semantic vector search (`all-MiniLM-L6-v2`).
- Computes cosine similarity between the user's holistic profile narrative and 140+ career vectors.
- Calculates an explicit feature score (skill overlap %, dream role bonus, academic alignment).
- Combines them into a weighted **Hybrid Score** (`0.55 * semantic_score + 0.45 * feature_score`).
- Returns normalized `skillOverlapPercent`, identifying matching skills vs. skills to develop, with grounded reasoning.

### 3. 🎯 Interactive Skill-Gap Quiz (`POST /quiz/generate` & `/career-path/quiz`)
- Tailored multiple-choice diagnostic tests generated for the specific skills you need to develop.
- Instant score computation, performance tier classification, and identified skill gap highlights.
- In-memory/disk caching prevents redundant LLM re-generation on repeat requests.

### 4. ⚖️ Side-by-Side Career Comparison View (`/compare`)
- Select up to 3 careers from the dashboard or dropdown to compare side-by-side.
- Contrasts match scores, skill overlap percentages, salary brackets, estimated timelines, and learning milestones.
- Features a dynamic **Comparative Skills Matrix** highlighting common vs. unique skill requirements.

### 5. 📈 Persistent Learning Progress Tracking (`/api/progress`)
- Checkboxes on each stage of the career roadmap to track your learning journey.
- Real-time progress bar reflecting completion percentages.
- Backed by PostgreSQL (`scripts/schema.sql`) with client-side persistence fallback.
- Active roadmaps and completion progress bars are displayed directly on the user dashboard.

### 6. 📥 Publication-Ready PDF Roadmap Export (`POST /export/pdf`)
- Single-click "Download Roadmap PDF" button on any career roadmap.
- Formats roadmap metadata, milestones, procedures, and resources via Jinja2 into a clean PDF via WeasyPrint.

---

## 🚀 Getting Started

### Option A: Docker Compose (Recommended)

Run the frontend, Python microservice, and PostgreSQL database together in one command:

```bash
# Clone the repository
git clone https://github.com/Rafi0496/Smart-Career-Path-Recommendation.git
cd Smart-Career-Path-Recommendation

# Start all three services
docker compose up --build
```

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **FastAPI Microservice Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **PostgreSQL**: `localhost:5432`

---

### Option B: Local Independent Setup

#### 1. Start the Python AI/ML Microservice
```bash
cd python-service
pip install -r requirements.txt
python -m spacy download en_core_web_sm

# Launch FastAPI on port 8000
python main.py
```
*Health check:* [http://localhost:8000/health](http://localhost:8000/health)

#### 2. Start the Next.js Frontend
```bash
# In the project directory
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

---

## 📂 Project Structure

```text
├── Dockerfile                  # Next.js production container
├── docker-compose.yml          # Multi-container orchestration (Web, ML, DB)
├── scripts/
│   ├── export_careers.js       # Exports 140+ careers to JSON
│   └── schema.sql              # PostgreSQL / Supabase migration schema
├── python-service/             # Python FastAPI ML Microservice
│   ├── Dockerfile              # Container with WeasyPrint & Pango/Cairo libs
│   ├── requirements.txt        # FastAPI, spaCy, sentence-transformers, scikit-learn
│   ├── main.py                 # FastAPI application, CORS & Lifespan caching
│   ├── data/
│   │   └── careers.json        # 140+ careers database
│   ├── routers/
│   │   ├── recommend.py        # POST /recommend (Hybrid ML engine)
│   │   ├── resume.py           # POST /resume/parse (spaCy + pdfplumber)
│   │   ├── quiz.py             # POST /quiz/generate (Skill diagnostic)
│   │   └── export.py           # POST /export/pdf (WeasyPrint PDF export)
│   ├── services/
│   │   ├── embeddings.py       # Sentence-transformers vector cache
│   │   ├── matcher.py          # Hybrid recommender & LLM grounding
│   │   ├── resume_extractor.py # PDF text extraction & NER skill matcher
│   │   └── pdf_builder.py      # Jinja2 template & PDF renderer
│   └── templates/
│       └── roadmap.html        # Clean HTML styling for PDF generation
└── src/                        # Next.js 14 Frontend Application
    ├── app/
    │   ├── api/                # Proxy routes (/recommend, /resume/parse, /quiz, /export/pdf)
    │   ├── assessment/         # Multi-step assessment with Resume Auto-Fill
    │   ├── career-path/        # Roadmap with checkboxes & PDF export
    │   │   └── quiz/           # Interactive skill-gap diagnostic test
    │   ├── compare/            # Side-by-side career comparison view
    │   └── dashboard/          # Analytics, active progress & category browser
    ├── components/             # Navbar, ThemeToggle, AIAssistant
    └── lib/                    # storage.ts, career-engine.ts, types.ts
```
