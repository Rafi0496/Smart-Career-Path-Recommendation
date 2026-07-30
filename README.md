# Smart Career Path Recommendation System

An AI-powered mini project that helps **students** and **anyone confused about their career** by collecting their academics, interests, hobbies, and aspirations, then recommending personalized career paths with step-by-step learning plans.

## Features

- **Landing page** – Clear value proposition and entry points for assessment and dashboard
- **Assessment** – Multi-step form that gathers:
  - Basic info (name, optional email)
  - **Academics**: education level, stream, subjects, strengths, grades, certifications
  - **Interests & hobbies**: interests, hobbies, current skills, preferred work style
  - **Aspirations**: dream roles, what you’re willing to do, work environment, priorities, timeline, notes
  - *Note: Features dynamic auto-suggestions while typing for interests, hobbies, skills, and dream roles based on our extensive career database.*
- **Dashboard** – A fully interactive and premium dashboard featuring:
  - **Profile Completeness Analytics**: Persistent, clean visualizations of your Academic, Interest, and Aspiration scores.
  - **Career Engine Panel**: An action-oriented panel that guides you to generate or refine your recommendations.
  - **Categorized Career Browser**: A built-in accordion UI to browse all 130+ available career paths categorized by industry.
- **AI recommendations** – Engine matches your profile against an extensive database of 130+ career paths and returns the top 5 with match percentages and reasons.
- **Career path view** – For each recommendation: why it fits, skills to build, and a **learning path** (ordered steps with duration and resources).
- **AI Assistant** – Floating chat button on every page. Ask questions about careers, how to use the site, or recommendations. Uses OpenAI when `OPENAI_API_KEY` is set; otherwise a built-in fallback answers from app content.

## Tech stack

- **Next.js 14** (App Router), **TypeScript**, **Tailwind CSS**
- **Lucide React** for icons
- Data stored in **localStorage** (no backend required for the mini project)
- Recommendation logic in `src/lib/career-engine.ts` 

## Getting started
Open:"https://smart-career-path-recommendation.vercel.app/"

1. **Start assessment** → Complete all 4 steps → Save.
2. **Dashboard** → See your profile completeness stats → Click **Generate recommendations**.
3. **Explore** → View your top 5 recommendations or scroll down to browse careers by category.
4. **Learn** → Open any recommended career to see the full **learning path** with actionable steps and resources.

## Project structure

```text
src/
  app/
    page.tsx           # Landing
    assessment/        # Multi-step assessment form
    dashboard/         # Premium dashboard (Stats, engine, category browser)
    career-path/       # Single career learning path view
    api/recommend/     # POST: returns recommendations for a profile
    api/chat/          # POST: AI assistant (OpenAI or fallback)
  components/
    AIAssistant.tsx    # Floating chat UI
  lib/
    assistant-fallback.ts  # Fallback answers when no API key
    types.ts           # UserProfile, CareerRecommendation, etc.
    storage.ts         # localStorage helpers
    career-engine.ts   # Core engine containing 130+ careers, matching logic, and categorization
    suggestions.ts     # Data for the assessment form's auto-suggest feature
```

## Career paths included

The `CAREER_DATABASE` has been vastly expanded and organized. It now includes **over 130 detailed career paths** across major industries:

- **Software & Development** (Full Stack, Backend, Mobile, DevOps, etc.)
- **Artificial Intelligence & Data Science** (AI Engineer, Data Scientist, NLP, etc.)
- **Cybersecurity** (Ethical Hacker, SOC Analyst, Security Engineer, etc.)
- **Cloud Computing & Networking**
- **UI/UX & Design**
- **Business & Management**
- **Finance & Accounting**
- **Healthcare** (Doctor, Nurse, Psychologist, etc.)
- **Engineering, Law, Content, Digital Marketing, and more!**

Each path includes a description, required skills, timeline, salary range (where applicable), and a structured 4-step learning path with resources.
