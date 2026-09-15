# Smart Career Path Recommendation System & AI Intelligence Platform

A Python-based career intelligence and guidance platform built with FastAPI, ReportLab, and modern web technologies. The platform synthesizes candidate academic backgrounds, technical proficiencies, interests, and career goals into structured, actionable career roadmaps backed by a curated taxonomy of 144+ industry career tracks, live multi-tier AI mentorship, diagnostic skill assessments, and publication-ready 4-page Executive Career Blueprint PDF generation.

---

## System Architecture

```text
                                  +-------------------------------+
                                  |       Client Browser          |
                                  |   (HTML5 + Tailwind CSS + JS) |
                                  +---------------+---------------+
                                                  |
                                                  | HTTP / JSON / Multipart
                                                  v
+-------------------------------------------------------------------------------------------------+
|                           FastAPI Full-Stack Python Application                                 |
|                                                                                                 |
|  * run.py                      -> Application entrypoint and Uvicorn server launcher            |
|  * app/main.py                 -> FastAPI lifecycle, middleware, CORS, static and router mounts |
|  * app/routers/pages.py        -> Dynamic Jinja2 server-rendered views (/, /dashboard, etc.)    |
|  * app/routers/api.py          -> REST API gateways (/api/recommend, /api/chat, /api/pdf, etc.) |
|                                                                                                 |
|  Core Python Intelligence Engines (app/core/):                                                  |
|  |-- career_engine.py          -> 144+ Career taxonomy, tokenization & hybrid scoring algorithm |
|  |-- resume_parser.py          -> Pure Python PDF text extractor (pypdf + zlib) & skill matcher |
|  |-- pdf_builder.py            -> 4-Page Executive Career Blueprint PDF generator (ReportLab)   |
|  |-- ai_mentor.py              -> Multi-tier AI Mentor "V" (Groq / Gemini / OpenAI / Fallback)  |
|  |-- quiz_engine.py            -> Dynamic skill-gap diagnostic test generator & evaluator       |
|  `-- database.py               -> SQLite / PostgreSQL persistence for auth, progress, and logs  |
+-------------------------------------------------------------------------------------------------+
                                                  |
                         +------------------------+------------------------+
                         |                                                 |
                         v                                                 v
        +---------------------------------+               +---------------------------------+
        |     Local / Remote Database     |               |     External AI Gateways        |
        |  (SQLite / PostgreSQL / Cloud)  |               |  (Groq / Gemini / OpenAI APIs)  |
        +---------------------------------+               +---------------------------------+
```

---

## Technology Stack

- **Primary Backend Language**: Python 3.10+ (compatible with Python 3.11, 3.12, 3.13, 3.14)
- **Web Framework**: FastAPI with Uvicorn (asynchronous, high-performance, type-annotated REST API)
- **Server-Side Templating**: Jinja2 with HTML5 semantic markup
- **Frontend Styling & UI**: Vanilla CSS and Tailwind CSS (glassmorphism design tokens, dark/light theme switching, responsive grid layouts)
- **PDF Generation**: ReportLab (vector-rendered, 4-page print-accurate executive document generator)
- **PDF Extraction**: pypdf with in-memory zlib stream decompression fallback
- **AI & LLM Integration**:
  - Groq API (LLaMA 3.3 70B, LLaMA 3.1 8B, Mixtral 8x7B)
  - Google Gemini API (Gemini 2.0 Flash, Gemini 1.5 Flash, Gemini 1.5 Pro)
  - OpenAI API (GPT-4o-mini, GPT-3.5-turbo)
  - Offline Heuristic Intelligence Engine (structured domain-specific knowledge fallback)
- **Persistence Layer**: SQLite (zero-configuration local database with support for external PostgreSQL / Supabase)

---

## Key Features and Functional Capabilities

### 1. Hybrid Career Recommendation Engine (`POST /api/recommend`)
- Multidimensional matching algorithm combining TF-IDF semantic vector scoring, keyword tokenization, and multi-factor feature weighting.
- Evaluates academic stream alignment, technical skill overlap percentage, dream role synergy, and work environment preferences.
- Evaluates against a curated taxonomy of 144+ career tracks spanning 21 industry sectors:
  - Software Engineering, Artificial Intelligence & Machine Learning, Cloud Architecture, Cybersecurity, Data Engineering & Analytics, DevOps & SRE, UI/UX Design, Product Management, Mobile Development, Blockchain Engineering, Game Development, Embedded Systems, Robotics, Quantum Computing, Healthcare Technology, and Financial Engineering.
- Returns top 5 ranked career matches with comprehensive metadata:
  - Match confidence percentage.
  - Matching skills vs. skills to develop (skill gap analysis).
  - Compensation ranges across career stages.
  - Estimated ramp-up timelines and milestone overviews.

### 2. Native PDF Resume Parser (`POST /api/resume/parse`)
- Upload standard PDF resumes directly on the assessment screen.
- Employs pypdf combined with raw in-memory zlib stream decompressor for complex PDF formats.
- Heuristic skill matching engine scans against a taxonomy of 350+ industry technical skills, frameworks, cloud platforms, and databases.
- Automatically extracts:
  - Full Name and Education Credentials.
  - Academic Stream and Focus Areas.
  - Identified Hard and Soft Skills.
- Instantly pre-fills the 4-stage assessment wizard while allowing candidate adjustments.

### 3. Dedicated 24/7 AI Career Mentor "V" (`POST /api/chat`)
- An embedded floating AI assistant accessible across all platform pages.
- Multi-tier inference routing:
  1. Groq (High-speed LLaMA 3.3 / 3.1 inference).
  2. Google Gemini (Gemini 2.0 / 1.5 Flash).
  3. OpenAI (GPT-4o-mini).
  4. Structured Heuristic Knowledge Engine (guaranteed zero-latency offline availability).
- Context-aware conversations reflecting candidate name, selected career track, and progress state.
- Capable of answering questions on technical architectures, career transitions, salary negotiation tactics, project ideas, and interview preparation.

### 4. 4-Page Executive Career Blueprint PDF Generator (`POST /api/export-pdf`)
- Single-click export of a publication-ready career blueprint built in pure Python using ReportLab:
  - **Page 1: Executive Cover & Profile Overview**: Candidate metadata, key metrics summary, and document table of contents.
  - **Page 2: Role Specifications & Skill Matrix**: Career description, prioritized core vs. secondary skills, compensation tiers by seniority level, and industry-recognized certifications.
  - **Page 3: Sequential Learning Roadmap**: Numbered developmental milestones, estimated durations, actionable implementation steps, and curated learning references.
  - **Page 4: Strategic Trajectory & 30-60-90 Day Plan**: Long-term career progression tiers, tactical execution timeline, and ecosystem resources.

### 5. Interactive Skill-Gap Diagnostic Quiz (`POST /api/quiz/generate` and `POST /api/quiz/submit`)
- Dynamically generates targeted multiple-choice diagnostic assessments based on candidate skill gaps.
- Real-time scoring, instant answer verification with in-depth technical explanations.
- Identifies weak competencies and outputs recommended learning focus areas.

### 6. Side-by-Side Career Comparison Matrix (`/compare`)
- Direct cross-comparison of up to 3 career tracks simultaneously.
- Contrasts match percentages, salary potential, time-to-competency, prerequisite skills, and daily responsibilities in a unified layout.

### 7. Learning Progress Tracker & Dashboard (`/dashboard`)
- Interactive checklist tracking for milestone progress across sequential learning stages.
- Visual completion indicators for Academics, Technical Interests, and Aspirations.
- Persistent activity logging and quiz performance history.

### 8. Authentication & Public Profile Portfolios (`/profile`, `/u/{public_id}`)
- Secure user registration, authentication, password recovery, and cookie-based session persistence.
- Role-based route protection for private sections (`/assessment`, `/dashboard`, `/profile`, `/compare`, `/career-path`).
- Shareable public career profile badge (`/u/{public_id}`) for candidate portfolios.

---

## Directory and File Organization

```text
Mini-Project-main/
|-- run.py                           # Application entrypoint (`python run.py`)
|-- requirements.txt                 # Python dependencies (FastAPI, Uvicorn, ReportLab, etc.)
|-- .env.example                     # Environment configuration reference
|-- career_path.db                   # SQLite database (auto-generated on first run)
|-- Dockerfile                       # Production Docker container configuration
|-- docker-compose.yml               # Multi-container orchestration specification
|-- vercel.json                      # Vercel serverless deployment configuration
|-- app/                             # Main Python Application Package
|   |-- __init__.py
|   |-- main.py                      # FastAPI app initialization, middleware, routes
|   |-- config.py                    # Environment settings and path configurations
|   |-- core/                        # Core Business Logic & AI Engines
|   |   |-- __init__.py
|   |   |-- career_engine.py         # 144+ Career catalog & hybrid scoring algorithm
|   |   |-- resume_parser.py         # PDF text extractor & skill taxonomy parser
|   |   |-- pdf_builder.py           # 4-Page Executive Career Blueprint PDF generator
|   |   |-- ai_mentor.py             # Multi-tier AI Mentor "V" (Groq / Gemini / Fallback)
|   |   |-- quiz_engine.py           # Diagnostic skill quiz generator & evaluator
|   |   `-- database.py              # SQLite / PostgreSQL persistence and activity logging
|   |-- routers/                     # Route Handlers
|   |   |-- __init__.py
|   |   |-- pages.py                 # Server-rendered HTML page routes
|   |   `-- api.py                   # REST API endpoints
|   |-- templates/                   # Jinja2 HTML Templates
|   |   |-- base.html                # Global base layout, navigation, and AI assistant
|   |   |-- index.html               # Landing page
|   |   |-- assessment.html          # 4-stage assessment wizard with resume parser
|   |   |-- dashboard.html           # Main user dashboard, metrics, and career explorer
|   |   |-- career_path.html         # Sequential roadmap view with progress checkboxes
|   |   |-- quiz.html                # Diagnostic skill testing interface
|   |   |-- compare.html             # Multi-career comparison matrix
|   |   |-- profile.html             # User settings and public profile configuration
|   |   |-- public_profile.html      # Publicly accessible candidate portfolio badge
|   |   |-- login.html               # User login form
|   |   |-- register.html            # User account registration form
|   |   `-- forgot_password.html     # Password recovery form
|   `-- static/                      # Static Assets
|       |-- css/styles.css           # Styling tokens, animations, glassmorphism
|       `-- js/
|           |-- app.js               # Client state, theme controller, storage helpers
|           `-- assistant.js         # "Ask V" interactive chat client controller
`-- scripts/                         # Verification and Testing Utilities
    |-- verify_enhancements.py       # Automated integration test suite
    `-- test_resume_accuracy.py      # Resume parser accuracy verification script
```

---

## REST API Reference

| Method | Endpoint | Description | Payload Example |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/recommend` | Generate top 5 career matches | `{"stream": "Computer Science", "skills": ["Python", "Docker"], "interests": ["AI"]}` |
| `POST` | `/api/chat` | Send message to AI Mentor "V" | `{"messages": [{"role": "user", "content": "Hi"}], "context": {"userName": "Alex"}}` |
| `POST` | `/api/resume/parse` | Parse PDF resume file | Multipart Form (`file` or `resume` parameter containing `.pdf`) |
| `POST` | `/api/export-pdf` | Generate 4-Page Executive PDF | `{"career": {...}, "user_name": "Alex Smith", "profile": {...}}` |
| `POST` | `/api/quiz/generate` | Generate skill diagnostic quiz | `{"career_id": "full-stack-dev", "skills_to_develop": ["Docker", "Kubernetes"]}` |
| `POST` | `/api/quiz/submit` | Submit and evaluate quiz | `{"career_id": "full-stack-dev", "quiz_score": 80, "weak_skills": ["Kubernetes"]}` |
| `POST` | `/api/progress/toggle`| Toggle milestone completion | `{"userId": 1, "careerTitle": "Full Stack Developer", "stepOrder": 2}` |
| `GET`  | `/api/careers/titles` | List all 144+ career titles | None |
| `GET`  | `/api/careers/{title}`| Get full metadata for career | URL Path Parameter |
| `POST` | `/api/auth/register`  | Create new user account | `{"name": "Alex", "email": "alex@example.com", "password": "securepassword"}` |
| `POST` | `/api/auth/login`     | Authenticate user | `{"emailOrName": "alex@example.com", "password": "securepassword"}` |
| `POST` | `/api/auth/logout`    | Invalidate user session | None |
| `POST` | `/api/auth/recover`   | Reset account password | `{"email": "alex@example.com", "name": "Alex", "newPassword": "newpassword"}` |

---

## Installation and Setup Guide

### 1. System Requirements
- Python 3.10 or higher
- pip (Python package manager)
- Modern web browser (Chrome, Firefox, Edge, Safari)

## Running the Application

Deployment Link : https://smart-career-path-recommendation.vercel.app/

By using this link you can access the Smart Career Web
---

## Running Verification Tests

The repository contains an automated test suite verifying route authentication gating, registration/login workflows, PDF resume parsing, career catalog indexing, and AI chat endpoints:

```bash
python scripts/verify_enhancements.py
```

Expected Output:
```text
=== 1. Testing Auth Gating for Protected Routes ===
[PASS] Auth gating verified for all protected sections!

=== 2. Testing Registration and Login Flow ===
[PASS] Authenticated access verified for all sections!

=== 3. Testing Resume Parser ===
[PASS] Resume parser successfully extracts skills and profile fields!

=== 4. Testing Compare & Career Metadata Endpoints ===
[PASS] Career catalog and comparison endpoints operational!

=== 5. Testing Ask V Chat Endpoint ===
[PASS] Ask V chatbot responding accurately!

==================================================
>>> ALL 5 VERIFICATION MODULES PASSED 100%! <<<
==================================================
```

---

## Docker Deployment

To build and run the application in a Docker container:

```bash
# Build the Docker image
docker build -t smart-career-path .

# Run the container on port 8000
docker run -d -p 8000:8000 --name smart-career-path-app smart-career-path
```

Or using Docker Compose:

```bash
docker-compose up -d --build
```

---

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.
