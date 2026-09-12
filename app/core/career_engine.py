import json
import re
from pathlib import Path
from typing import Dict, List, Any, Optional

# Load careers dataset
_local_data = Path(__file__).resolve().parent.parent / "data" / "careers.json"
_service_data = Path(__file__).resolve().parent.parent.parent / "python-service" / "data" / "careers.json"
CAREERS_FILE = _local_data if _local_data.exists() else _service_data

CATEGORIES: Dict[str, List[str]] = {
    'Software & Development': [
        'Software Developer', 'Full Stack Developer', 'Frontend Developer', 'Backend Developer',
        'Mobile App Developer', 'Game Developer', 'Software Engineer', 'DevOps Engineer',
        'Embedded Systems Engineer', 'Blockchain Developer', 'AR/VR Developer'
    ],
    'Artificial Intelligence & Data Science': [
        'Data Analyst', 'AI Engineer', 'Machine Learning Engineer', 'Deep Learning Engineer',
        'Data Scientist', 'Business Intelligence Analyst', 'NLP Engineer', 'Computer Vision Engineer',
        'Robotics Engineer', 'Prompt Engineer'
    ],
    'Cybersecurity': [
        'Cybersecurity Analyst', 'Ethical Hacker', 'Penetration Tester', 'SOC Analyst',
        'Security Engineer', 'Digital Forensics Expert', 'Cloud Security Engineer', 'Information Security Analyst'
    ],
    'Cloud Computing': [
        'Cloud Engineer', 'Cloud Architect', 'AWS Engineer', 'Azure Engineer',
        'Google Cloud Engineer', 'Site Reliability Engineer (SRE)'
    ],
    'Networking': [
        'Network Engineer', 'Network Administrator', 'System Administrator', 'Telecom Engineer'
    ],
    'UI/UX & Design': [
        'UX/UI Designer', 'UI Designer', 'UX Designer', 'Product Designer',
        'Graphic Designer', 'Motion Graphics Designer', 'Animator'
    ],
    'Business & Management': [
        'Product Manager', 'Project Manager', 'Business Analyst', 'Operations Manager',
        'HR Manager', 'Marketing Manager', 'Sales Manager', 'Human Resources Specialist'
    ],
    'Finance & Accounting': [
        'Financial Analyst', 'Chartered Accountant', 'Investment Banker', 'Tax Consultant',
        'Auditor', 'Risk Analyst'
    ],
    'Healthcare': [
        'Healthcare / Allied Health', 'Doctor', 'Dentist', 'Pharmacist', 'Nurse',
        'Physiotherapist', 'Medical Lab Technician', 'Nutritionist', 'Psychologist'
    ],
    'Engineering': [
        'Mechanical Engineer', 'Civil Engineer', 'Electrical Engineer', 'Electronics Engineer',
        'Aerospace Engineer', 'Automobile Engineer', 'Chemical Engineer', 'Petroleum Engineer'
    ],
    'Government Jobs': [
        'IAS', 'IPS', 'IFS', 'SSC Officer', 'Banking Officer', 'Railway Officer',
        'Defence Officer', 'Police Officer', 'Postal Officer'
    ],
    'Research & Education': [
        'Teacher / Educator', 'Professor', 'Lecturer', 'Research Scientist',
        'School Teacher', 'Educational Consultant'
    ],
    'Law': [
        'Lawyer', 'Judge', 'Legal Advisor', 'Corporate Lawyer', 'Public Prosecutor'
    ],
    'Digital Marketing': [
        'Digital Marketer', 'SEO Specialist', 'SEM Specialist', 'Social Media Manager',
        'Content Strategist', 'Brand Manager', 'Email Marketing Specialist'
    ],
    'Content & Media': [
        'Content Writer / Creator', 'Content Writer', 'Technical Writer', 'Copywriter',
        'Journalist', 'News Anchor', 'Video Editor', 'Photographer', 'Cinematographer'
    ],
    'Entrepreneurship': [
        'Startup Founder', 'Business Owner', 'Franchise Owner', 'E-commerce Seller'
    ],
    'Creative Arts': [
        'Musician', 'Singer', 'Actor', 'Dancer', 'Fashion Designer', 'Interior Designer'
    ],
    'Agriculture & Environment': [
        'Agricultural Scientist', 'Agronomist', 'Environmental Engineer', 'Forestry Officer', 'Wildlife Biologist'
    ],
    'Hospitality & Tourism': [
        'Hotel Manager', 'Chef', 'Event Manager', 'Travel Consultant', 'Airline Cabin Crew'
    ],
    'Sports & Fitness': [
        'Athlete', 'Fitness Trainer', 'Sports Coach', 'Sports Nutritionist', 'Sports Psychologist'
    ],
    'Emerging Technologies': [
        'Quantum Computing Engineer', 'IoT Engineer', 'Edge Computing Engineer',
        'Web3 Developer', 'AI Product Manager', 'AI Research Scientist'
    ]
}

def normalize(text: str) -> str:
    """Lowercase and strip punctuation."""
    if not text:
        return ""
    return re.sub(r"[^a-zA-Z0-9\s]", " ", text).lower().strip()

def tokenize(text: str) -> List[str]:
    """Tokenizes string into clean keywords of length > 2."""
    return [t for t in normalize(text).split() if len(t) > 2]

class CareerEngine:
    def __init__(self):
        self.careers: Dict[str, Dict[str, Any]] = {}
        self.category_map: Dict[str, str] = {}
        self._load_careers()

    def _load_careers(self):
        if not CAREERS_FILE.exists():
            return

        with open(CAREERS_FILE, "r", encoding="utf-8") as f:
            raw_list = json.load(f)

        for c in raw_list:
            title = c.get("title", "")
            if not title:
                continue
            self.careers[title] = {
                "id": c.get("id", normalize(title).replace(" ", "-")),
                "title": title,
                "careerTitle": title,
                "description": c.get("description", ""),
                "simpleSummary": c.get("simpleSummary", f"A rewarding career as a {title}."),
                "skills": c.get("skills", ["Problem Solving", "Communication"]),
                "requiredSkills": c.get("skills", ["Problem Solving", "Communication"]),
                "learningPath": c.get("learningPath", []),
                "timeline": c.get("timeline", "6–12 months"),
                "estimatedTimeline": c.get("timeline", "6–12 months"),
                "salaryRange": c.get("salaryRange", "Entry: $50k–80k | Mid: $80k–120k"),
            }

        # Build reverse category mapping
        for cat, roles in CATEGORIES.items():
            for role in roles:
                self.category_map[role.lower()] = cat

    def get_category_for_career(self, title: str) -> str:
        t_low = title.lower()
        if t_low in self.category_map:
            return self.category_map[t_low]
        for cat_role, cat_name in self.category_map.items():
            if cat_role in t_low or t_low in cat_role:
                return cat_name
        return "Software & Development"

    def match_score_and_reasons(self, profile: Dict[str, Any], career_title: str) -> Dict[str, Any]:
        career = self.careers.get(career_title)
        if not career:
            return {"score": 40, "reasons": []}

        reasons = []
        score = 36.0

        academics = profile.get("academics", {})
        interests = profile.get("interests", {})
        aspirations = profile.get("aspirations", {})

        user_skills = [normalize(s) for s in interests.get("skills", []) if s]
        user_strengths = [normalize(s) for s in academics.get("strengths", []) if s]
        user_subjects = [normalize(s) for s in academics.get("subjects", []) if s]
        user_interests = [normalize(s) for s in interests.get("interests", []) if s]
        dream_roles = [normalize(r) for r in aspirations.get("dreamRoles", []) if r]
        willing = [normalize(w) for w in aspirations.get("willingToDo", []) if w]

        all_user_tokens = set()
        for group in [user_skills, user_strengths, user_subjects, user_interests, dream_roles, willing]:
            for item in group:
                for token in tokenize(item):
                    all_user_tokens.add(token)

        career_norm = normalize(career_title)
        career_tokens = set(tokenize(career_title))
        career_skills = career.get("skills", [])

        # 1. Dream role match (High impact: +28)
        is_dream_match = any(
            career_norm in r or r in career_norm or any(t in r for t in career_tokens if len(t) > 3)
            for r in dream_roles
        )
        if is_dream_match:
            score += 28.0
            reasons.append("You listed this (or a very closely aligned field) as your dream role.")

        # 2. Skill overlap points (Up to +24)
        matching_count = 0
        for req in career_skills:
            req_norm = normalize(req)
            if any(req_norm in u or u in req_norm for u in (user_skills + user_strengths)):
                matching_count += 1
            elif any(t in all_user_tokens for t in tokenize(req) if len(t) > 3):
                matching_count += 0.5

        if matching_count > 0:
            overlap_pts = min(24.0, matching_count * 6.5)
            score += overlap_pts
            reasons.append("Your technical competencies and strengths strongly intersect with this role's requirements.")

        # 3. Academic Stream & Field Alignment (+10)
        stream = normalize(academics.get("streamOrField", ""))
        if stream:
            category = self.get_category_for_career(career_title).lower()
            if any(token in category or category in token for token in tokenize(stream)):
                score += 10.0
                reasons.append(f"Your educational stream ({academics.get('streamOrField')}) directly supports this specialization.")

        # 4. Willing to learn / Upskilling readiness (+6)
        if any("learn" in w or "bootcamp" in w or "course" in w or "project" in w for w in willing):
            score += 6.0
            reasons.append("You indicated an active willingness to learn modern tools—this track provides step-by-step milestones.")

        # 5. Work environment and style (+4)
        work_env = aspirations.get("workEnvironment", [])
        if work_env:
            score += 4.0
            reasons.append(f"Aligned with your preferred work environments: {', '.join(work_env[:2])}.")

        # Defaults if sparse
        if len(reasons) == 0:
            reasons.append("A high-potential pathway based on your profile keywords and market trends.")
        reasons.append("Includes sequentially ordered procedures and vetted learning resources.")

        final_score = int(min(98, max(42, round(score))))
        return {
            "score": final_score,
            "reasons": list(dict.fromkeys(reasons))
        }

    def get_recommendations(self, profile: Dict[str, Any], limit: int = 5) -> List[Dict[str, Any]]:
        results = []
        interests = profile.get("interests", {})
        academics = profile.get("academics", {})

        user_skills_raw = set(
            [s.strip().lower() for s in interests.get("skills", []) if s] +
            [s.strip().lower() for s in academics.get("strengths", []) if s]
        )

        for title, data in self.careers.items():
            match_info = self.match_score_and_reasons(profile, title)
            req_skills = data.get("skills", [])

            matching_skills = []
            skills_to_develop = []

            for req in req_skills:
                req_low = req.lower().strip()
                if any(req_low in u or u in req_low for u in user_skills_raw):
                    matching_skills.append(req)
                else:
                    skills_to_develop.append(req)

            overlap_pct = round((len(matching_skills) / len(req_skills)) * 100) if req_skills else 0

            results.append({
                "careerTitle": title,
                "matchScore": match_info["score"],
                "description": data["description"],
                "simpleSummary": data.get("simpleSummary", ""),
                "whyRecommended": match_info["reasons"],
                "requiredSkills": req_skills,
                "matchingSkills": matching_skills,
                "skillsToDevelop": skills_to_develop,
                "skillOverlapPercent": overlap_pct,
                "learningPath": [
                    {**step, "completed": False} for step in data.get("learningPath", [])
                ],
                "estimatedTimeline": data.get("timeline", "6–12 months"),
                "salaryRange": data.get("salaryRange", "Entry: $50k–80k | Mid: $80k–120k")
            })

        results.sort(key=lambda x: x["matchScore"], reverse=True)
        return results[:limit]

    def get_career_by_title(self, title: str) -> Optional[Dict[str, Any]]:
        for t, data in self.careers.items():
            if t.lower() == title.lower():
                raw_skills = data.get("skills", [])
                raw_timeline = data.get("timeline", "6–12 months")
                return {
                    "id": data.get("id", normalize(t).replace(" ", "-")),
                    "title": t,
                    "careerTitle": t,
                    "matchScore": 0,
                    "description": data["description"],
                    "simpleSummary": data.get("simpleSummary", ""),
                    "whyRecommended": ["Selected directly from career explorer."],
                    "skills": raw_skills,
                    "requiredSkills": raw_skills,
                    "matchingSkills": [],
                    "skillsToDevelop": raw_skills,
                    "skillOverlapPercent": 0,
                    "learningPath": [
                        {**step, "completed": False} for step in data.get("learningPath", [])
                    ],
                    "timeline": raw_timeline,
                    "estimatedTimeline": raw_timeline,
                    "salaryRange": data.get("salaryRange", "Entry: $50k–80k | Mid: $80k–120k")
                }
        return None

    def get_categorized_careers(self) -> Dict[str, List[Dict[str, str]]]:
        result: Dict[str, List[Dict[str, str]]] = {}
        for cat in CATEGORIES.keys():
            result[cat] = []

        for title, data in self.careers.items():
            cat = self.get_category_for_career(title)
            if cat not in result:
                result[cat] = []
            result[cat].append({
                "title": title,
                "description": data["description"]
            })

        return {k: v for k, v in result.items() if len(v) > 0}

    def get_all_titles(self) -> List[str]:
        return sorted(list(self.careers.keys()))

career_engine = CareerEngine()
