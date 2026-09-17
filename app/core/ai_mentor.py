import re
import random
import httpx
from typing import List, Dict, Any, Optional
from app.config import settings
from app.core.career_engine import career_engine

SYSTEM_PROMPT = """
You are "V", an extraordinarily intelligent, inspiring, empathetic, and deeply knowledgeable career mentor and navigator for "CareerAxis".

YOUR CORE IDENTITY & MISSION:
1. UNBOUNDED INTELLIGENCE: You possess deep, comprehensive knowledge across all fields: software engineering, data science, AI/ML, cloud computing, cybersecurity, product management, system design, medicine, finance, business, humanities, science, and essential life skills.
2. ANSWER ANY QUESTION: Answer ANY question the user asks with clarity, depth, and mastery. Whether they ask about complex coding challenges, career roadmaps, salary benchmarks, industry trends, technical architectures, or interview strategies, give them a brilliant, high-value, actionable answer.
3. RELENTLESS OPTIMISM: Radiate optimism, warmth, and genuine confidence in the user's professional potential.
4. ACTIONABLE INSIGHTS: Provide structured, step-by-step solutions with concrete examples and practical execution tips.
5. PROACTIVE FOLLOW-UP: Never end with a dead-end answer. Offer 1 or 2 relevant follow-up suggestions.
6. FORMATTING: Use clean, beautiful markdown with bold highlights, bullet points, numbered steps, and syntax-highlighted code blocks where appropriate.
""".strip()

def clean_query(text: str) -> str:
    return re.sub(r"[^a-zA-Z0-9\s]", " ", text).lower().strip()

def get_heuristic_fallback(user_message: str, context: Optional[Dict[str, Any]] = None) -> str:
    msg = clean_query(user_message)
    user_name = context.get("userName") if context else None
    current_career = context.get("currentCareer") if context else None
    name_str = f" **{user_name}**" if user_name and user_name not in ["Anonymous", "Candidate", "Professional", ""] else ""

    if len(msg) < 2:
        return f"Hello{name_str}! I'm **V**, your AI career navigator. What career path, technical skill, or roadmap strategy would you like to explore today?"

    # 1. Greetings
    if re.match(r"^(hi|hello|hey|greetings|hola|howdy|good morning|good afternoon|good evening|yo)( there)?$", msg):
        options = [
            f"Hello{name_str}! I'm **V**, your personal AI career mentor. Ready to map out your dream career, master high-leverage skills, or optimize your roadmap? What would you like to tackle today?",
            f"Hi{name_str}! Great to connect with you. I'm **V**. Whether you're exploring our 140+ career tracks, preparing for technical interviews, or planning a skill roadmap, I'm here to guide you step-by-step. How can I help?",
            f"Hey{name_str}! **V** here. Ready to accelerate your professional journey? Tell me what field or skill you're targeting!"
        ]
        return random.choice(options)

    # 2. Market In-Demand Skills
    if any(k in msg for k in ["demand", "top skill", "highest market", "market skill", "trending skill", "in demand"]):
        return (
            f"### 🚀 Top High-Demand Technical Skills in Today's Market\n\n"
            f"Based on real-time industry analytics across tech, cloud, and engineering sectors:\n\n"
            f"1. **Artificial Intelligence & LLM Engineering**\n"
            f"   • *Key Technologies:* Python, PyTorch, LangChain, RAG architectures, Vector DBs (Chroma/Pinecone), Prompt Engineering.\n\n"
            f"2. **Cloud Architecture & DevOps**\n"
            f"   • *Key Technologies:* AWS/Azure/GCP, Docker, Kubernetes, Terraform (IaC), CI/CD pipelines.\n\n"
            f"3. **Modern Full-Stack Development**\n"
            f"   • *Key Technologies:* TypeScript, React/Next.js, FastAPI, Node.js, PostgreSQL, Tailwind CSS.\n\n"
            f"4. **Cybersecurity & Cloud Security**\n"
            f"   • *Key Technologies:* Zero Trust architectures, SIEM/SOC, Penetration Testing, IAM, OWASP Top 10.\n\n"
            f"5. **Data Engineering & Real-Time Streaming**\n"
            f"   • *Key Technologies:* Apache Kafka, Spark, dbt, Snowflake, SQL optimization.\n\n"
            f"💡 *Pro Tip:* Pair deep domain expertise in one pillar with foundational cloud + Git proficiency for maximum hiring leverage."
        )

    # 3. Roadmap Strategy (30-60-90 Day)
    if any(k in msg for k in ["roadmap", "30 60 90", "day plan", "learning path", "how to structure", "study plan"]):
        career_focus = current_career if current_career else "your chosen specialization"
        return (
            f"### 📅 High-Impact 30-60-90 Day Roadmap Framework\n\n"
            f"Here is the battle-tested roadmap execution blueprint for **{career_focus}**:\n\n"
            f"**Phase 1: Days 1–30 — Core Foundations & Syntax Fluency**\n"
            f"• Master the foundational language/stack principles (data structures, async programming, API protocols).\n"
            f"• Set up a professional Git workflow with semantic commit conventions.\n"
            f"• *Milestone:* Ship 2 small micro-projects proving core competency.\n\n"
            f"**Phase 2: Days 31–60 — System Architecture & Production Deployment**\n"
            f"• Integrate relational/vector databases, authentication (JWT/OAuth), and Docker containerization.\n"
            f"• Build a full-featured capstone project with automated CI/CD and cloud hosting.\n"
            f"• *Milestone:* Deploy a live, production-grade app with README documentation and public URL.\n\n"
            f"**Phase 3: Days 61–90 — Portfolio Optimization & Interview Mastery**\n"
            f"• Benchmark and optimize database queries and system latency.\n"
            f"• Complete 50+ targeted LeetCode / system design / behavioral scenario simulations.\n"
            f"• *Milestone:* Export your Executive Career Blueprint and begin tailored outbound networking.\n\n"
            f"Would you like tailored milestone recommendations for a specific career path?"
        )

    # 4. Resume & PDF Parsing Guidance
    if any(k in msg for k in ["resume", "cv", "pdf", "parse", "upload"]):
        return (
            f"### 📄 Resume Optimization & Parser Insights\n\n"
            f"Our **CareerAxis Resume Engine** automatically extracts:\n"
            f"• **Hard Technical Skills:** Programming languages, frameworks, databases, and cloud tools.\n"
            f"• **Domain Experience:** Experience years, education background, and focus areas.\n"
            f"• **Career Gap Analysis:** Missing competencies required for target senior roles.\n\n"
            f"**Tips for Maximum ATS & Matching Score:**\n"
            f"1. Use standard section headers: *Experience*, *Education*, *Technical Skills*, *Projects*.\n"
            f"2. Quantify achievements using the Google X-Y-Z formula (*Accomplished [X], as measured by [Y], by doing [Z]*).\n"
            f"3. Upload your PDF directly on the **Assessment** page to auto-fill your profile in seconds!"
        )

    # 5. Salary & Compensation Insights
    if any(k in msg for k in ["salary", "compensation", "pay", "earning", "package", "ctc"]):
        if current_career:
            c = career_engine.get_career_by_title(current_career)
            if c:
                return (
                    f"### 💰 Compensation Benchmark for **{c['careerTitle']}**\n\n"
                    f"• **Market Band:** {c.get('salaryRange', 'Competitive ($95,000 - $160,000+)')}\n"
                    f"• **Ramp-Up Timeline:** {c.get('estimatedTimeline', '6–12 months')}\n"
                    f"• **High-Leverage Multipliers:** Experience with cloud deployment, distributed systems, and AI integration directly push offers into the upper quartile.\n\n"
                    f"You can view complete salary breakdowns and milestones on your **Dashboard**."
                )
        return (
            f"### 💼 Market Compensation & Salary Strategy\n\n"
            f"Tech compensation bands vary by specialization, seniority, and scale:\n"
            f"• **Entry Level (0–2 yrs):** $75,000 – $115,000 / ₹8L – ₹18L\n"
            f"• **Mid-Level (2–5 yrs):** $115,000 – $165,000 / ₹18L – ₹35L\n"
            f"• **Senior / Staff (5+ yrs):** $165,000 – $240,000+ / ₹35L – ₹65L+\n\n"
            f"Select any of our 140+ curated career tracks on the Dashboard to see track-specific salary ranges and milestone expectations."
        )

    # 6. Current career context matches
    if current_career and any(w in msg for w in ["this", "current", "role", "career", "milestone", "path", "explain"]):
        c = career_engine.get_career_by_title(current_career)
        if c:
            steps_summary = "\n".join([f"• Stage {s['order']}: **{s['title']}** ({s['duration']})" for s in c.get('learningPath', [])[:4]])
            return (
                f"### 🎯 Strategic Insights for **{c['careerTitle']}**\n\n"
                f"{c['description']}\n\n"
                f"**Market Compensation:** {c.get('salaryRange', 'Competitive')}\n"
                f"**Estimated Ramp-Up:** {c.get('estimatedTimeline', '6–12 months')}\n\n"
                f"**Key Skills Required:** {', '.join(c.get('requiredSkills', []))}\n\n"
                f"**Sequential Roadmap Overview:**\n{steps_summary}\n\n"
                f"Would you like recommendations on specific projects to build for this track?"
            )

    # 7. Specific career title lookup in 140+ database
    for title in career_engine.get_all_titles():
        if title.lower() in msg:
            c = career_engine.get_career_by_title(title)
            if c:
                steps_summary = "\n".join([f"• Stage {s.get('order', i+1)}: **{s.get('title', '')}** ({s.get('duration', '2-4 wks')})" for i, s in enumerate(c.get('learningPath', [])[:4])])
                return (
                    f"### 🌟 **{c['careerTitle']}** Overview\n\n"
                    f"{c['description']}\n\n"
                    f"• **Market Salary Band:** {c.get('salaryRange', 'Competitive')}\n"
                    f"• **Estimated Timeline:** {c.get('estimatedTimeline', '6–12 months')}\n"
                    f"• **Core Competencies:** {', '.join(c.get('requiredSkills', []))}\n\n"
                    f"**Milestone Path:**\n{steps_summary}\n\n"
                    f"Click **View Roadmap** on your Dashboard to track your progress and take technical readiness quizzes for this role!"
                )

    # 8. Technology Specific Answers (Python, JS, React, Docker, AI, etc.)
    tech_map = {
        "python": ("Python", "FastAPI/Django, PyTorch/TensorFlow, Pandas, Poetry, AsyncIO", "Backend Web Dev, AI/Machine Learning, Data Engineering, Automation"),
        "javascript": ("JavaScript / TypeScript", "React, Next.js, Node.js, Express, TypeScript, Tailwind CSS", "Modern Full-Stack Web Development, Frontend Engineering"),
        "react": ("React & Next.js", "Server Components, Redux Toolkit, Tailwind CSS, TanStack Query, Next.js App Router", "Frontend and Full-Stack Web Applications"),
        "docker": ("Docker & Containerization", "Multi-stage builds, Docker Compose, Container networking, Security scanning", "DevOps, Cloud-Native Microservices, Production Deployments"),
        "kubernetes": ("Kubernetes (K8s)", "Pods, Deployments, Services, Helm charts, Ingress controllers, GitOps (ArgoCD)", "Scalable Cloud Orchestration, Platform Engineering"),
        "ai": ("Artificial Intelligence / Machine Learning", "PyTorch, HuggingFace, RAG pipelines, LangChain, Embeddings, LoRA Fine-Tuning", "AI Engineer, Machine Learning Engineer, Data Scientist"),
        "cloud": ("Cloud Computing (AWS / Azure / GCP)", "IAM, EC2/S3/Lambda, Serverless, VPC networking, CloudWatch, Terraform", "Cloud Architect, Cloud Engineer, DevOps Specialist"),
        "cyber": ("Cybersecurity", "Network security, Penetration testing, Cryptography, OWASP Top 10, SIEM, Incident response", "Security Analyst, Penetration Tester, DevSecOps")
    }

    for key, (name, skills, domains) in tech_map.items():
        if key in msg:
            return (
                f"### 🛠️ Strategic Guide for **{name}**\n\n"
                f"• **Key Frameworks & Tools:** {skills}\n"
                f"• **Target Career Paths:** {domains}\n\n"
                f"**Recommended Action Steps:**\n"
                f"1. **Core Proficiency:** Build a robust, working project incorporating testing and clean code principles.\n"
                f"2. **Portfolio Piece:** Publish your repository with clear setup documentation and architecture diagrams.\n"
                f"3. **Skill Diagnostic:** Take the skill quiz on your dashboard to benchmark your knowledge.\n\n"
                f"Would you like roadmap recommendations for any of these career paths?"
            )

    # 9. How Platform Works
    if any(w in msg for w in ["how", "start", "begin", "work", "use", "platform", "app"]):
        return (
            "Here's how **CareerAxis** works:\n\n"
            "1. **Complete Assessment**: Enter your background, technical interests, and goals (or upload a PDF resume for instant parsing).\n"
            "2. **Get Hybrid Recommendations**: Our Python AI engine ranks the top 5 matches out of 140+ career tracks.\n"
            "3. **Execute Your Roadmap**: Follow stage-by-stage learning milestones with interactive checklist tracking.\n"
            "4. **Diagnostic Quizzes**: Test your knowledge on required skills and identify areas for improvement.\n"
            "5. **Export PDF Blueprint**: Download an executive-ready career blueprint anytime."
        )

    # 10. General Career Mentor Guidance
    return (
        f"### 💡 Career Insights on **{user_message.strip()}**\n\n"
        "To achieve rapid career growth and breakthrough results:\n\n"
        "1. **Focus on High-Leverage Fundamentals**: Master core architectures and problem-solving patterns rather than superficial tools.\n"
        "2. **Build Verifiable Proof of Work**: Deploy 2 production-grade projects solving real-world domain challenges.\n"
        "3. **Measure Readiness Continuously**: Benchmark your knowledge through diagnostic assessments and milestone tracking.\n\n"
        "What specific career track or technical milestone would you like to explore next?"
    )

async def ask_groq(system_prompt: str, messages: List[Dict[str, str]]) -> Optional[str]:
    api_key = settings.GROQ_API_KEY
    if not api_key:
        return None

    candidate_models = [
        "llama-3.3-70b-versatile",
        "llama-3.1-8b-instant",
        "llama3-70b-8192",
        "mixtral-8x7b-32768",
        "gemma2-9b-it"
    ]
    
    formatted_messages = [{"role": "system", "content": system_prompt}]
    for m in messages[-8:]:
        role = "assistant" if m.get("role") in ["assistant", "model"] else "user"
        formatted_messages.append({"role": role, "content": str(m.get("content", ""))})

    for model in candidate_models:
        try:
            url = "https://api.groq.com/openai/v1/chat/completions"
            headers = {"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}
            payload = {
                "model": model,
                "messages": formatted_messages,
                "max_tokens": 1500,
                "temperature": 0.7
            }
            async with httpx.AsyncClient(timeout=10.0) as client:
                resp = await client.post(url, headers=headers, json=payload)
                if resp.status_code == 200:
                    data = resp.json()
                    choices = data.get("choices", [])
                    if choices:
                        text = choices[0].get("message", {}).get("content", "")
                        if text and len(text.strip()) > 0:
                            return text.strip()
        except Exception as e:
            continue
    return None

async def ask_gemini(system_prompt: str, messages: List[Dict[str, str]]) -> Optional[str]:
    api_key = settings.GEMINI_API_KEY
    if not api_key:
        return None

    candidate_models = ["gemini-2.0-flash", "gemini-1.5-flash", "gemini-1.5-pro"]

    contents = []
    for m in messages[-8:]:
        role = "model" if m.get("role") in ["assistant", "model"] else "user"
        contents.append({"role": role, "parts": [{"text": str(m.get("content", ""))}]})

    if contents and contents[0]["role"] == "model":
        contents.pop(0)

    if not contents:
        contents = [{"role": "user", "parts": [{"text": "Hello!"}]}]

    for model in candidate_models:
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
            payload = {
                "system_instruction": {"parts": [{"text": system_prompt}]},
                "contents": contents,
                "generationConfig": {"temperature": 0.7, "maxOutputTokens": 1500}
            }
            async with httpx.AsyncClient(timeout=10.0) as client:
                resp = await client.post(url, json=payload)
                if resp.status_code == 200:
                    data = resp.json()
                    candidates = data.get("candidates", [])
                    if candidates:
                        parts = candidates[0].get("content", {}).get("parts", [])
                        if parts and "text" in parts[0]:
                            return parts[0]["text"].strip()
        except Exception as e:
            continue
    return None

async def ask_openai(system_prompt: str, messages: List[Dict[str, str]]) -> Optional[str]:
    api_key = settings.OPENAI_API_KEY
    if not api_key:
        return None

    candidate_models = ["gpt-4o-mini", "gpt-3.5-turbo"]
    formatted_messages = [{"role": "system", "content": system_prompt}]
    for m in messages[-8:]:
        role = "assistant" if m.get("role") in ["assistant", "model"] else "user"
        formatted_messages.append({"role": role, "content": str(m.get("content", ""))})

    for model in candidate_models:
        try:
            url = "https://api.openai.com/v1/chat/completions"
            headers = {"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}
            payload = {
                "model": model,
                "messages": formatted_messages,
                "max_tokens": 1500,
                "temperature": 0.7
            }
            async with httpx.AsyncClient(timeout=10.0) as client:
                resp = await client.post(url, headers=headers, json=payload)
                if resp.status_code == 200:
                    data = resp.json()
                    choices = data.get("choices", [])
                    if choices:
                        text = choices[0].get("message", {}).get("content", "")
                        if text and len(text.strip()) > 0:
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
        if context.get("userName") and context["userName"] not in ["Anonymous", "Candidate", "Professional", ""]:
            sys_parts.append(f"The candidate's name is {context['userName']}. Address them warmly.")
        if context.get("currentCareer"):
            sys_parts.append(f"The candidate is exploring the '{context['currentCareer']}' career track.")

    full_system = "\n\n".join(sys_parts)

    # 1. Try Groq (Fastest LLM)
    res = await ask_groq(full_system, messages)
    if res:
        return res

    # 2. Try Gemini
    res = await ask_gemini(full_system, messages)
    if res:
        return res

    # 3. Try OpenAI
    res = await ask_openai(full_system, messages)
    if res:
        return res

    # 4. High-Quality Deterministic Heuristic & Knowledge Fallback
    return get_heuristic_fallback(last_query, context)
