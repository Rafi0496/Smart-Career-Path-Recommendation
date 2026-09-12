import re
import random
import httpx
from typing import List, Dict, Any, Optional
from app.config import settings
from app.core.career_engine import career_engine

SYSTEM_PROMPT = """
You are "V", an extraordinarily intelligent, inspiring, empathetic, and deeply knowledgeable AI Career Mentor & Polymath Guide for "Smart Career Path".

YOUR CORE IDENTITY & MISSION:
1. UNBOUNDED INTELLIGENCE: You possess deep, comprehensive knowledge across all fields: software engineering, data science, AI/ML, cloud, cybersecurity, product management, design, medicine, finance, business, humanities, science, and life skills.
2. ANSWER ANY QUESTION: Answer ANY question the user asks with clarity, depth, and mastery. Whether they ask about complex coding bugs, career roadmaps, salary negotiations, industry trends, science, philosophy, or overcoming imposter syndrome, give them a brilliant, high-value answer.
3. RELENTLESS OPTIMISM: Radiate optimism, warmth, and genuine confidence in the user's potential.
4. PROBLEM SOLVING: Provide structured, step-by-step solutions with concrete examples and actionable advice.
5. PROACTIVE FOLLOW-UP: Never end with a dead-end answer. Offer 1 or 2 exciting follow-up options.
6. FORMATTING: Use clean, beautiful markdown with bold highlights, bullet points, numbered steps, and code blocks where helpful.
""".strip()

def clean_query(text: str) -> str:
    return re.sub(r"[^a-zA-Z0-9\s]", " ", text).lower().strip()

def get_heuristic_fallback(user_message: str, context: Optional[Dict[str, Any]] = None) -> str:
    msg = clean_query(user_message)
    user_name = context.get("userName") if context else None
    current_career = context.get("currentCareer") if context else None

    if len(msg) < 2:
        return "Please ask a question about career paths, recommended skills, or how to use the dashboard."

    # Greetings
    if re.match(r"^(hi|hello|hey|greetings|hola|howdy)( there)?$", msg):
        name_str = f" {user_name}" if user_name and user_name != "Anonymous" else ""
        options = [
            f"Hello{name_str}! I'm **V**, your AI career navigator. How can I assist your career growth today?",
            f"Hi there! I'm **V**, ready to help you navigate tech career paths, roadmaps, and interview preparations. What would you like to explore?",
            f"Greetings! I'm **V**. Ask me anything about job roles, technical skills, salary expectations, or learning strategies."
        ]
        return random.choice(options)

    # Current career context
    if current_career and any(w in msg for w in ["this", "current", "role", "career", "salary", "milestone", "path"]):
        c = career_engine.get_career_by_title(current_career)
        if c:
            steps_summary = "\n".join([f"• Stage {s['order']}: **{s['title']}** ({s['duration']})" for s in c.get('learningPath', [])[:4]])
            return (
                f"### Strategic Insights for **{c['careerTitle']}**\n\n"
                f"{c['description']}\n\n"
                f"**Market Compensation:** {c.get('salaryRange', 'Competitive')}\n"
                f"**Estimated Ramp-Up:** {c.get('estimatedTimeline', '6–12 months')}\n\n"
                f"**Key Skills Needed:** {', '.join(c.get('requiredSkills', []))}\n\n"
                f"**Sequential Roadmap Overview:**\n{steps_summary}\n\n"
                f"Would you like advice on which project to build first for this path?"
            )

    # Getting started / How it works
    if any(w in msg for w in ["how", "start", "begin", "work", "use"]) and any(w in msg for w in ["site", "app", "system", "platform", "dashboard"]):
        return (
            "Here's how **Smart Career Path** works:\n\n"
            "1. **Start Assessment**: Enter your academic stream, technical interests, and dream roles (or upload a PDF resume to auto-fill).\n"
            "2. **Explore Recommendations**: The engine ranks 140+ career tracks matching your strengths.\n"
            "3. **Execute Your Roadmap**: Follow sequential milestones, track progress with checkboxes, and download the Executive Blueprint PDF.\n"
            "4. **Take Diagnostic Quizzes**: Verify your technical readiness on skills you need to develop."
        )

    # Career recommendations inquiry
    if any(w in msg for w in ["recommend", "careers", "paths", "options", "jobs"]):
        return (
            "We analyze over **140 curated careers** across 21 industry sectors: Software, AI/ML, Cloud, Cybersecurity, "
            "Data Science, Product Management, Healthcare, Engineering, and more!\n\n"
            "Complete your 4-step assessment on the Assessment page to view your top 5 ranked career matches."
        )

    # Specific career check
    for title in career_engine.get_all_titles():
        if title.lower() in msg:
            c = career_engine.get_career_by_title(title)
            if c:
                return (
                    f"**{c['careerTitle']} Overview**\n\n"
                    f"{c['description']}\n\n"
                    f"• **Typical Compensation:** {c.get('salaryRange', 'Competitive')}\n"
                    f"• **Timeline:** {c.get('estimatedTimeline', '6–12 months')}\n"
                    f"• **Core Skills:** {', '.join(c.get('requiredSkills', []))}\n\n"
                    f"You can open this track directly from the Career Explorer on your Dashboard to view the full roadmap."
                )

    # General polymath response
    return (
        f"That's a great question regarding **{user_message.strip()}**.\n\n"
        "To achieve rapid career progress:\n"
        "1. **Master High-Leverage Fundamentals**: Focus on core principles rather than ephemeral syntax.\n"
        "2. **Build Verifiable Proof of Work**: Deploy 2 end-to-end projects solving real problems.\n"
        "3. **Network Intentionally**: Share your learnings publicly and connect with practitioners in your target field.\n\n"
        "Would you like me to tailor a specific learning milestone or project idea around this?"
    )

async def ask_gemini(system_prompt: str, messages: List[Dict[str, str]]) -> Optional[str]:
    api_key = settings.GEMINI_API_KEY
    if not api_key:
        return None

    try:
        contents = []
        for m in messages[-10:]:
            role = "model" if m["role"] == "assistant" else "user"
            contents.append({"role": role, "parts": [{"text": m["content"]}]})

        if contents and contents[0]["role"] == "model":
            contents.pop(0)

        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key={api_key}"
        payload = {
            "system_instruction": {"parts": [{"text": system_prompt}]},
            "contents": contents if contents else [{"role": "user", "parts": [{"text": "Hello!"}]}],
            "generationConfig": {"temperature": 0.75, "maxOutputTokens": 2048}
        }

        async with httpx.AsyncClient(timeout=15.0) as client:
            resp = await client.post(url, json=payload)
            if resp.status_code == 200:
                data = resp.json()
                text = data["candidates"][0]["content"]["parts"][0]["text"]
                return text.strip()
    except Exception as e:
        print(f"[ai_mentor] Gemini error: {e}")
    return None

async def ask_groq(system_prompt: str, messages: List[Dict[str, str]]) -> Optional[str]:
    api_key = settings.GROQ_API_KEY
    if not api_key:
        return None

    candidate_models = ["openai/gpt-oss-120b", "groq/compound", "qwen/qwen3.8-27b"]
    for model in candidate_models:
        try:
            url = "https://api.groq.com/openai/v1/chat/completions"
            headers = {"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}
            payload = {
                "model": model,
                "messages": [{"role": "system", "content": system_prompt}] + [
                    {"role": m["role"], "content": m["content"]} for m in messages[-10:]
                ],
                "max_tokens": 2048,
                "temperature": 0.75
            }
            async with httpx.AsyncClient(timeout=14.0) as client:
                resp = await client.post(url, headers=headers, json=payload)
                if resp.status_code == 200:
                    data = resp.json()
                    text = data["choices"][0]["message"]["content"]
                    if text:
                        return text.strip()
        except Exception:
            continue
    return None

async def get_mentor_response(
    messages: List[Dict[str, str]],
    context: Optional[Dict[str, Any]] = None
) -> str:
    user_msgs = [m for m in messages if m.get("role") == "user"]
    last_query = user_msgs[-1]["content"] if user_msgs else ""

    sys_parts = [SYSTEM_PROMPT]
    if context:
        if context.get("userName") and context["userName"] not in ["Anonymous", "Candidate"]:
            sys_parts.append(f"The candidate's name is {context['userName']}. Address them warmly.")
        if context.get("currentCareer"):
            sys_parts.append(f"The candidate is exploring the '{context['currentCareer']}' career path.")

    full_system = "\n\n".join(sys_parts)

    # 1. Try Gemini 3.6 Flash
    res = await ask_gemini(full_system, messages)
    if res:
        return res

    # 2. Try Groq (OSS 120B / Compound)
    res = await ask_groq(full_system, messages)
    if res:
        return res

    # 3. Deterministic Heuristic Fallback
    return get_heuristic_fallback(last_query, context)
