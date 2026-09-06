import re
import io
import logging
from typing import Dict, Any, List, Optional

logger = logging.getLogger("python-service.resume")

# Comprehensive taxonomy of technical skills, frameworks, tools & domains
SKILLS_TAXONOMY = {
    # Programming Languages
    "python", "javascript", "typescript", "java", "c++", "c#", "c", "golang", "go", "rust",
    "php", "ruby", "swift", "kotlin", "scala", "r", "dart", "sql", "html", "css", "bash", "shell",
    # Frameworks & Libraries
    "react", "react.js", "react native", "next.js", "nextjs", "vue", "vue.js", "angular",
    "node.js", "nodejs", "express", "express.js", "django", "fastapi", "flask", "spring boot",
    "spring", "asp.net", "laravel", "ruby on rails", "flutter", "tailwindcss", "tailwind",
    "bootstrap", "redux", "graphql", "rest api", "restful api",
    # Data Science & AI/ML
    "machine learning", "deep learning", "artificial intelligence", "nlp", "natural language processing",
    "computer vision", "tensorflow", "pytorch", "keras", "scikit-learn", "pandas", "numpy",
    "matplotlib", "seaborn", "llm", "large language models", "prompt engineering", "langchain",
    "opencv", "data analysis", "data visualization", "tableau", "power bi", "excel",
    # Cloud & DevOps
    "aws", "amazon web services", "azure", "gcp", "google cloud", "docker", "kubernetes",
    "ci/cd", "git", "github", "gitlab", "terraform", "ansible", "linux", "jenkins",
    "microservices", "serverless", "nginx", "apache",
    # Databases & Big Data
    "postgresql", "postgres", "mysql", "mongodb", "sqlite", "redis", "elasticsearch",
    "cassandra", "dynamodb", "firebase", "supabase", "kafka", "spark", "hadoop",
    # Cybersecurity & Networks
    "cybersecurity", "network security", "penetration testing", "ethical hacking",
    "wireshark", "metasploit", "soc analyst", "cryptography", "firewall", "siem",
    # Design & Product
    "figma", "ui/ux", "wireframing", "prototyping", "adobe xd", "photoshop", "illustrator",
    "user research", "agile", "scrum", "jira", "product management", "system design",
    # Soft & Professional Skills
    "problem solving", "leadership", "communication", "critical thinking", "collaboration",
    "project management", "analytical skills", "time management", "teamwork"
}

CERTIFICATIONS_PATTERNS = [
    r"aws certified [a-zA-Z\s]+",
    r"azure certified [a-zA-Z\s]+",
    r"google cloud certified [a-zA-Z\s]+",
    r"pmp",
    r"cissp",
    r"comptia [a-zA-Z\+\s]+",
    r"cisco certified [a-zA-Z\s]+|ccna|ccnp",
    r"certified scrum master|csm",
    r"hashicorp certified [a-zA-Z\s]+",
    r"certified kubernetes [a-zA-Z\s]+|cka|ckad",
    r"oracle certified [a-zA-Z\s]+",
    r"meta certified [a-zA-Z\s]+",
]

EDUCATION_LEVELS_MAP = [
    ("Postgraduate", ["master", "m.tech", "mtech", "m.s", "ms", "mba", "mca", "m.sc", "msc", "phd", "doctorate"]),
    ("Undergraduate", ["bachelor", "b.tech", "btech", "b.e", "be", "b.s", "bs", "bca", "b.sc", "bsc", "bba", "b.com", "undergraduate"]),
    ("High School", ["high school", "secondary school", "higher secondary", "12th", "10th", "k-12", "diploma"]),
]

STREAMS_MAP = [
    ("Computer Science & Engineering", ["computer science", "cse", "software engineering", "information technology", "it", "computing"]),
    ("Data Science & AI", ["data science", "artificial intelligence", "ai & ml", "machine learning"]),
    ("Electronics & Communication", ["electronics", "communication", "ece", "electrical", "eee"]),
    ("Mechanical Engineering", ["mechanical", "robotics", "automotive"]),
    ("Civil Engineering", ["civil", "construction"]),
    ("Business & Management", ["business administration", "management", "finance", "marketing", "commerce", "accounting"]),
    ("Health & Biological Sciences", ["biology", "biotechnology", "medicine", "pharmacy", "biomedical"]),
    ("Design & Media", ["graphic design", "multimedia", "digital media", "fine arts"]),
]

class ResumeExtractor:
    def __init__(self):
        self.nlp = None
        try:
            import spacy
            try:
                self.nlp = spacy.load("en_core_web_sm")
                logger.info("Loaded spaCy en_core_web_sm model.")
            except Exception:
                logger.warning("en_core_web_sm not found, using blank spacy english model.")
                self.nlp = spacy.blank("en")
        except Exception as e:
            logger.warning(f"spaCy not available: {e}. Falling back to regex parsing.")

    def extract_text_from_pdf(self, file_bytes: bytes) -> str:
        """Extracts plain text from PDF bytes using pdfplumber with pure-Python stream fallback."""
        text = ""
        try:
            import pdfplumber
            with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
                for page in pdf.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n"
            if text.strip():
                return text.strip()
        except Exception as e:
            logger.warning(f"pdfplumber extraction not active: {e}. Running stream extraction fallback...")

        # Pure-Python PDF text stream extractor fallback
        try:
            # Look for text inside PDF parentheses (text) Tj and [(t)(e)(x)(t)] TJ
            matches = re.findall(rb"\((.*?)\)\s*Tj", file_bytes)
            if matches:
                decoded_chunks = [m.decode("utf-8", errors="ignore") for m in matches]
                text = " ".join(decoded_chunks)

            if not text.strip():
                # Extract text between BT (begin text) and ET (end text)
                bt_blocks = re.findall(rb"BT\s*(.*?)\s*ET", file_bytes, re.DOTALL)
                extracted_words = []
                for block in bt_blocks:
                    parens = re.findall(rb"\((.*?)\)", block)
                    for p in parens:
                        extracted_words.append(p.decode("utf-8", errors="ignore"))
                text = " ".join(extracted_words)

            if not text.strip():
                # Raw text decode as last resort
                text = file_bytes.decode("utf-8", errors="ignore")
        except Exception as e:
            logger.warning(f"Stream fallback error: {e}")
            text = file_bytes.decode("utf-8", errors="ignore")

        return text.strip()

    def extract_name(self, text: str) -> str:
        """Extracts candidate name using spaCy NER or first non-empty header line."""
        lines = [line.strip() for line in text.split("\n") if line.strip()]
        if not lines:
            return ""

        # First try spaCy PERSON entities in the first 500 characters
        if self.nlp:
            doc = self.nlp(text[:500])
            for ent in doc.ents:
                if ent.label_ == "PERSON" and len(ent.text.split()) <= 4:
                    cleaned = ent.text.strip()
                    if not any(kw in cleaned.lower() for kw in ["resume", "curriculum", "vitae", "profile", "contact"]):
                        return cleaned

        # Fallback to the very first meaningful title line
        first_line = lines[0]
        if len(first_line.split()) <= 4 and not any(kw in first_line.lower() for kw in ["resume", "cv", "page"]):
            return re.sub(r"[^a-zA-Z\s]", "", first_line).strip()

        return ""

    def extract_email_and_phone(self, text: str) -> Dict[str, str]:
        email_match = re.search(r"[\w\.-]+@[\w\.-]+\.\w+", text)
        phone_match = re.search(r"(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}", text)
        return {
            "email": email_match.group(0) if email_match else "",
            "phone": phone_match.group(0) if phone_match else "",
        }

    def extract_education(self, text: str) -> Dict[str, str]:
        text_lower = text.lower()
        edu_level = "Undergraduate"  # default
        for level, keywords in EDUCATION_LEVELS_MAP:
            if any(re.search(r"\b" + re.escape(kw) + r"\b", text_lower) for kw in keywords):
                edu_level = level
                break

        stream = "Computer Science"
        for st_name, keywords in STREAMS_MAP:
            if any(re.search(r"\b" + re.escape(kw) + r"\b", text_lower) for kw in keywords):
                stream = st_name
                break

        return {"educationLevel": edu_level, "streamOrField": stream}

    def extract_skills(self, text: str) -> List[str]:
        text_lower = text.lower()
        matched = []
        for skill in SKILLS_TAXONOMY:
            # Word boundary matching
            pattern = r"(?<!\w)" + re.escape(skill) + r"(?!\w)"
            if re.search(pattern, text_lower):
                # Capitalize nicely
                matched.append(skill.title() if len(skill) > 3 else skill.upper())
        # Deduplicate while preserving order
        seen = set()
        deduped = []
        for s in matched:
            norm = s.lower()
            if norm not in seen:
                seen.add(norm)
                deduped.append(s)
        return deduped

    def extract_certifications(self, text: str) -> List[str]:
        text_lower = text.lower()
        certs = []
        for pat in CERTIFICATIONS_PATTERNS:
            matches = re.findall(pat, text_lower, re.IGNORECASE)
            for m in matches:
                certs.append(m.title())
        return list(set(certs))

    def extract_years_experience(self, text: str) -> int:
        exp_match = re.search(r"(\d+)\+?\s*(?:years|yrs)\s*(?:of)?\s*experience", text, re.IGNORECASE)
        if exp_match:
            try:
                return int(exp_match.group(1))
            except Exception:
                pass
        return 0

    def parse_resume(self, file_bytes: bytes) -> Dict[str, Any]:
        """Runs full parsing pipeline on PDF file bytes and formats assessment payload."""
        text = self.extract_text_from_pdf(file_bytes)
        name = self.extract_name(text)
        contact = self.extract_email_and_phone(text)
        edu = self.extract_education(text)
        skills = self.extract_skills(text)
        certs = self.extract_certifications(text)
        exp_years = self.extract_years_experience(text)

        # Infer dream roles from top skills and stream
        dream_roles = []
        skills_set = set(s.lower() for s in skills)
        if "react" in skills_set or "next.js" in skills_set or "node.js" in skills_set or "javascript" in skills_set:
            dream_roles.append("Full Stack Developer")
        if "machine learning" in skills_set or "python" in skills_set or "data science" in skills_set:
            dream_roles.append("AI & Machine Learning Engineer")
        if "aws" in skills_set or "docker" in skills_set or "kubernetes" in skills_set:
            dream_roles.append("Cloud & DevOps Engineer")
        if "cybersecurity" in skills_set or "network security" in skills_set:
            dream_roles.append("Cybersecurity Analyst")
        if "figma" in skills_set or "ui/ux" in skills_set:
            dream_roles.append("UX/UI Designer")
        if not dream_roles:
            dream_roles.append("Software Developer")

        # Top subjects
        subjects = []
        if "Computer" in edu["streamOrField"]:
            subjects = ["Data Structures & Algorithms", "Database Management", "Web Technologies"]
        elif "Data" in edu["streamOrField"]:
            subjects = ["Applied Statistics", "Machine Learning", "Linear Algebra"]
        else:
            subjects = [edu["streamOrField"], "Core Fundamentals"]

        # Strengths
        strengths = [s for s in skills if s.lower() in ["problem solving", "leadership", "system design", "critical thinking", "analytical skills"]]
        if not strengths:
            strengths = ["Problem Solving", "Technical Execution"]

        # Construct full assessment-compatible JSON
        return {
            "name": name or "Candidate",
            "email": contact["email"],
            "academics": {
                "educationLevel": edu["educationLevel"],
                "streamOrField": edu["streamOrField"],
                "subjects": subjects,
                "strengths": strengths,
                "grades": "",
                "certifications": certs,
            },
            "interests": {
                "interests": [edu["streamOrField"], "Technology Innovation", "Software Building"],
                "hobbies": ["Coding Projects", "Continuous Learning"],
                "skills": skills[:15] if skills else ["Programming", "Problem Solving"],
                "preferredWorkStyle": ["Remote", "Hybrid"],
            },
            "aspirations": {
                "dreamRoles": dream_roles[:3],
                "willingToDo": ["Take Online Specializations", "Build End-to-End Projects", "Obtain Professional Certifications"],
                "workEnvironment": ["Startup", "Corporate"],
                "priorities": ["Growth & Learning", "Salary & Benefits"],
                "timeline": "6-12 months",
                "additionalNotes": f"Extracted automatically from resume ({len(skills)} skills detected, ~{exp_years} yrs exp).",
            },
            "parsedDetails": {
                "detectedName": name,
                "detectedEmail": contact["email"],
                "detectedPhone": contact["phone"],
                "skillCount": len(skills),
                "experienceYears": exp_years,
                "certificationsCount": len(certs),
            }
        }

resume_extractor = ResumeExtractor()
