# Smart Career Path Recommendation System

An AI-powered mini project that helps **students** and **anyone confused about their career** by collecting their academics, interests, hobbies, and aspirations, then recommending personalized career paths with step-by-step learning plans.

## Features

- **Landing page** – Clear value proposition and entry points for assessment and dashboard
- **Assessment** – Multi-step form that gathers:
  - Basic info (name, optional email)
  - **Academics**: education level, stream, subjects, strengths, grades, certifications
  - **Interests & hobbies**: interests, hobbies, current skills, preferred work style
  - **Aspirations**: dream roles, what you’re willing to do, work environment, priorities, timeline, notes
- **Dashboard** – Stats overview (academics, interests, aspirations) and one-click “Generate my path”
- **AI recommendations** – Engine matches profile to 9 career paths and returns top 5 with match %
- **Career path view** – For each recommendation: why it fits, skills to build, and a **learning path** (ordered steps with duration and resources)
- **AI Assistant** – Floating chat button on every page. Ask questions about careers, how to use the site, or recommendations. Uses OpenAI when `OPENAI_API_KEY` is set; otherwise a built-in fallback answers from app content.

## Tech stack

- **Next.js 14** (App Router), **TypeScript**, **Tailwind CSS**
- **Lucide React** for icons
- Data stored in **localStorage** (no backend required for the mini project)
- Recommendation logic in `src/lib/career-engine.ts` (rule-based matching; can be swapped for an LLM API later)

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

1. **Start assessment** → Complete all 4 steps → Save.
2. **Dashboard** → See your stats → Click **Generate my path**.
3. Open any recommended career → See the full **learning path** with steps and resources.

## Project structure

```
src/
  app/
    page.tsx           # Landing
    assessment/        # Multi-step assessment form
    dashboard/         # Profile stats + generate recommendations
    career-path/       # Single career learning path view
    api/recommend/     # POST: returns recommendations for a profile
    api/chat/          # POST: AI assistant (OpenAI or fallback)
  components/
    AIAssistant.tsx    # Floating chat UI
  lib/
    assistant-fallback.ts  # Fallback answers when no API key
    types.ts           # UserProfile, CareerRecommendation, etc.
    storage.ts         # localStorage helpers
    career-engine.ts   # Matching + 9 career DB with learning paths
```

## Career paths included

- Software Developer  
- Data Analyst  
- UX/UI Designer  
- Digital Marketer  
- Product Manager  
- Content Writer / Creator  
- Cybersecurity Analyst  
- Healthcare / Allied Health  
- Teacher / Educator  

Each has a description, required skills, timeline, salary range (where applicable), and a 4-step learning path with resources.

## Optional next steps

- Add **OpenAI/Claude API** for more natural-language recommendations and custom learning steps
- Add **auth** (e.g. NextAuth) and **database** to persist profiles across devices
- Add **progress tracking** (mark learning steps complete) and store in localStorage or DB
- Add **export PDF** of the recommended path
