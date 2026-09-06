import os
import json
import logging
from typing import List, Dict, Any, Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

logger = logging.getLogger("python-service.routers.quiz")

router = APIRouter(prefix="/quiz", tags=["Skill-Gap Quiz"])

# In-memory cache for generated quizzes by cache key: f"{career_id}:{skills_hash}"
QUIZ_CACHE: Dict[str, List[Dict[str, Any]]] = {}

# Built-in fallback question bank for key domains to ensure 100% reliability offline
QUESTION_BANK = {
    "python": [
        {
            "question": "Which Python built-in data structure is immutable and ordered?",
            "options": ["List", "Dictionary", "Tuple", "Set"],
            "correct_answer": 2,
            "explanation": "Tuples in Python are ordered collections that cannot be modified after creation (immutable)."
        },
        {
            "question": "What does Python's 'list comprehension' provide?",
            "options": ["A way to run code multi-threaded", "A concise syntax to create lists from existing iterables", "A memory debugging tool", "A method to enforce strict types"],
            "correct_answer": 1,
            "explanation": "List comprehensions offer a concise, readable syntax to generate new lists by transforming or filtering elements."
        }
    ],
    "sql": [
        {
            "question": "Which SQL clause is used to filter the results of an aggregate function after a GROUP BY?",
            "options": ["WHERE", "HAVING", "FILTER", "ORDER BY"],
            "correct_answer": 1,
            "explanation": "HAVING is evaluated after grouping and aggregation, whereas WHERE filters rows before aggregation."
        },
        {
            "question": "What is the primary difference between an INNER JOIN and a LEFT JOIN?",
            "options": ["INNER JOIN returns all rows from both tables", "LEFT JOIN returns all rows from the left table, even if there are no matches in the right table", "INNER JOIN is only used for numerical IDs", "LEFT JOIN drops null values automatically"],
            "correct_answer": 1,
            "explanation": "A LEFT JOIN preserves every record from the left table and fills non-matching columns from the right table with NULL."
        }
    ],
    "machine learning": [
        {
            "question": "Which problem occurs when a model performs exceptionally well on training data but fails to generalize to unseen test data?",
            "options": ["Underfitting", "Overfitting", "Data Drift", "Vanishing Gradients"],
            "correct_answer": 1,
            "explanation": "Overfitting happens when a model learns noise and specific details of the training set rather than the underlying pattern."
        },
        {
            "question": "What is the purpose of cross-validation in machine learning pipelines?",
            "options": ["To speed up GPU training", "To reliably evaluate how well a model generalizes to independent datasets", "To normalize input feature vectors", "To reduce dataset size"],
            "correct_answer": 1,
            "explanation": "k-fold cross-validation partitions the training data into k subsets to reliably estimate model out-of-sample performance."
        }
    ],
    "react": [
        {
            "question": "What is the primary purpose of the 'useEffect' hook in React?",
            "options": ["To create new DOM elements", "To perform side effects such as data fetching, subscriptions, or manual DOM mutations", "To replace Redux for all state management", "To enforce server-side rendering"],
            "correct_answer": 1,
            "explanation": "useEffect lets you synchronize a component with external systems and manage lifecycle side effects."
        },
        {
            "question": "Why should keys be provided when rendering lists in React?",
            "options": ["To style individual items with CSS", "To help React identify which items have changed, been added, or removed during reconciliation", "To sort the array automatically", "To encrypt list data"],
            "correct_answer": 1,
            "explanation": "Keys give elements a stable identity inside an array so React's virtual DOM reconciliation algorithm can update efficiently."
        }
    ],
    "docker": [
        {
            "question": "What is the fundamental difference between a Docker image and a Docker container?",
            "options": ["An image is a running process; a container is a binary file", "An image is an immutable blueprint; a container is a running instance of that image", "Docker images only run on Linux; containers run everywhere", "There is no difference"],
            "correct_answer": 1,
            "explanation": "A Docker image is a read-only template with application code and dependencies. A container is an active, runnable instance of an image."
        }
    ],
    "cybersecurity": [
        {
            "question": "What security principle states that users and processes should only be granted the minimum permissions necessary to complete their task?",
            "options": ["Defense in Depth", "Principle of Least Privilege", "Zero Trust Network Access", "Single Sign-On"],
            "correct_answer": 1,
            "explanation": "The Principle of Least Privilege (PoLP) minimizes potential attack vectors by restricting permissions strictly to what is required."
        }
    ]
}

def generate_questions_llm(career_title: str, skill: str) -> List[Dict[str, Any]]:
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        return []

    try:
        from openai import OpenAI
        client = OpenAI(api_key=api_key)
        prompt = (
            f"Generate 2 multiple-choice technical questions to assess knowledge of the skill '{skill}' "
            f"for an aspiring '{career_title}'. Return ONLY a valid JSON array of objects with keys: "
            f"\"question\" (string), \"options\" (array of 4 distinct strings), \"correct_answer\" (integer index 0-3), "
            f"and \"explanation\" (string explaining why the correct answer is right). Do not include markdown codeblocks or text outside the JSON array."
        )
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.5,
            max_tokens=600,
        )
        content = response.choices[0].message.content.strip()
        # Clean potential markdown backticks
        if content.startswith("```"):
            content = content.split("\n", 1)[1]
            if content.endswith("```"):
                content = content.rsplit("```", 1)[0]
        data = json.loads(content.strip())
        if isinstance(data, list) and len(data) > 0:
            for item in data:
                item["skill"] = skill
            return data
    except Exception as e:
        logger.warning(f"LLM quiz generation failed for skill {skill}: {e}")

    return []

def generate_fallback_questions(career_title: str, skill: str) -> List[Dict[str, Any]]:
    skill_clean = skill.lower().strip()

    # Match in bank
    for bank_key, qs in QUESTION_BANK.items():
        if bank_key in skill_clean or skill_clean in bank_key:
            res = []
            for q in qs:
                copy_q = dict(q)
                copy_q["skill"] = skill
                res.append(copy_q)
            return res

    # Generic high-quality question for any uncovered skill
    return [
        {
            "skill": skill,
            "question": f"When implementing '{skill}' in a production environment, what is the best practice for scalability and maintenance?",
            "options": [
                f"Isolate '{skill}' components with modular interfaces and automated testing",
                f"Combine all logic into a single monolithic script to save network calls",
                f"Disable error handling and logging to improve raw throughput",
                f"Hardcode configuration parameters directly inside the source code"
            ],
            "correct_answer": 0,
            "explanation": f"Modular design, loose coupling, and automated unit testing are standard industry best practices when working with {skill}."
        },
        {
            "skill": skill,
            "question": f"What is a key risk or failure point when neglecting core standards in '{skill}'?",
            "options": [
                "Premature code completion",
                "Technical debt, security vulnerabilities, and unpredictable runtime errors",
                "Excessive automated test coverage",
                "Lower cloud server utilization"
            ],
            "correct_answer": 1,
            "explanation": f"Failing to follow verified standards in {skill} inevitably causes architectural debt and production downtime."
        }
    ]

class QuizRequest(BaseModel):
    career_id: str
    career_title: Optional[str] = "Career Path"
    skills_to_develop: List[str]

@router.post("/generate")
async def generate_quiz(req: QuizRequest):
    """
    Generates an interactive skill-gap quiz tailored to the skills the user needs to develop.
    Results are cached per career so repeated requests load instantly.
    """
    skills = req.skills_to_develop[:4]  # evaluate top 3-4 gap skills
    if not skills:
        skills = ["Foundational Skills", "Problem Solving"]

    cache_key = f"{req.career_id}:" + ",".join(sorted([s.lower() for s in skills]))
    if cache_key in QUIZ_CACHE:
        logger.info(f"Returning cached quiz for {cache_key}")
        return {
            "success": True,
            "career_id": req.career_id,
            "career_title": req.career_title,
            "cached": True,
            "questions": QUIZ_CACHE[cache_key],
        }

    all_questions = []
    for skill in skills:
        qs = generate_questions_llm(req.career_title or req.career_id, skill)
        if not qs:
            qs = generate_fallback_questions(req.career_title or req.career_id, skill)
        all_questions.extend(qs)

    # Cache result
    QUIZ_CACHE[cache_key] = all_questions

    return {
        "success": True,
        "career_id": req.career_id,
        "career_title": req.career_title,
        "cached": False,
        "questions": all_questions,
    }
