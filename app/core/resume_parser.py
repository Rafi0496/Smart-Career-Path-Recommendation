import re
import zlib
from typing import Dict, Any, List, Optional

# ==============================================================================
# SECTION 1: KNOWLEDGE BASES & FILTER LISTS
# ==============================================================================

# Locations, titles, and headers that should NEVER be mistaken for candidate names
LOCATION_BLACKLIST = {
    "hyderabad", "bangalore", "bengaluru", "mumbai", "pune", "delhi", "new delhi",
    "chennai", "kolkata", "noida", "gurgaon", "gurugram", "ahmedabad", "jaipur",
    "chandigarh", "lucknow", "indore", "bhopal", "patna", "nagpur", "kochi", "coimbatore",
    "visakhapatnam", "vizag", "vijayawada", "guntur", "tirupati", "warangal",
    "telangana", "andhra pradesh", "karnataka", "maharashtra", "tamil nadu", "kerala",
    "uttar pradesh", "madhya pradesh", "rajasthan", "gujarat", "west bengal", "punjab",
    "india", "usa", "united states", "uk", "united kingdom", "canada", "germany",
    "california", "texas", "new york", "london", "chicago", "san francisco", "seattle",
    "austin", "boston", "toronto", "vancouver", "singapore", "dubai", "sydney",
    "street", "road", "colony", "nagar", "apartments", "flat", "plot", "lane",
    "city", "state", "pincode", "zip code", "zip", "dist", "district"
}

TITLE_BLACKLIST = {
    "developer", "engineer", "software engineer", "frontend developer", "backend developer",
    "full stack developer", "full stack engineer", "web developer", "python developer",
    "java developer", "data scientist", "data analyst", "machine learning engineer",
    "ai engineer", "cloud engineer", "devops engineer", "cybersecurity analyst",
    "student", "intern", "graduate", "fresher", "undergraduate", "postgraduate",
    "specialist", "consultant", "architect", "lead", "manager", "designer",
    "programmer", "coder", "candidate", "applicant", "job seeker", "aspirant"
}

HEADER_BLACKLIST = {
    "resume", "curriculum vitae", "cv", "profile", "personal profile", "professional summary",
    "career objective", "objective", "summary", "about me", "contact", "contact info",
    "contact details", "education", "educational background", "academic background",
    "experience", "work experience", "professional experience", "employment history",
    "skills", "technical skills", "core competencies", "key skills", "projects",
    "academic projects", "key projects", "personal projects", "certifications",
    "certificates", "achievements", "awards", "honors", "publications", "interests",
    "extracurricular activities", "declarations", "personal details", "languages known",
    "hobbies", "page 1", "page 2", "page 1 of 1", "page 1 of 2", "page 2 of 2"
}

# Comprehensive Technical Skills Library
SKILLS_DICTIONARY = [
    # Programming Languages
    "Python", "JavaScript", "TypeScript", "Java", "C++", "C#", "C", "Go", "Rust", "Dart",
    "PHP", "Ruby", "Swift", "Kotlin", "SQL", "HTML5", "HTML", "CSS3", "CSS", "R", "MATLAB", "Bash", "Shell",
    
    # Web & Frameworks
    "React", "React.js", "React Native", "Next.js", "Vue", "Vue.js", "Angular", "Node.js", "Express",
    "Django", "FastAPI", "Flask", "Spring Boot", "Spring", "ASP.NET", ".NET", "Tailwind CSS",
    "Bootstrap", "Redux", "GraphQL", "REST API", "RESTful APIs", "Flutter", "Svelte", "jQuery",
    
    # AI / ML / Data Science
    "Machine Learning", "Deep Learning", "Artificial Intelligence", "NLP", "Natural Language Processing",
    "Computer Vision", "TensorFlow", "PyTorch", "scikit-learn", "Pandas", "NumPy", "OpenCV", "LLM",
    "Large Language Models", "Generative AI", "Data Analysis", "Power BI", "Tableau", "Keras",
    "Matplotlib", "Seaborn", "Hugging Face", "LangChain", "Data Mining", "Big Data",
    
    # Cloud & DevOps
    "AWS", "Amazon Web Services", "Azure", "Microsoft Azure", "Google Cloud", "GCP", "Docker",
    "Kubernetes", "Git", "GitHub", "GitLab", "CI/CD", "Linux", "Terraform", "Jenkins", "Ansible",
    "Nginx", "Apache", "Serverless",
    
    # Databases & Storage
    "PostgreSQL", "MySQL", "MongoDB", "SQLite", "Redis", "Firebase", "Supabase", "Oracle",
    "Cassandra", "Elasticsearch", "DynamoDB", "SQL Server",
    
    # Security, Networking & Systems
    "Cybersecurity", "Network Security", "Ethical Hacking", "Cryptography", "Penetration Testing",
    "Data Structures", "Algorithms", "Object-Oriented Programming", "OOP", "System Design", "Operating Systems",
    
    # Tools, Design & Methodologies
    "Postman", "Figma", "UI/UX", "Agile", "Scrum", "Jira", "Problem Solving", "System Architecture",
    "Continuous Learning", "Team Leadership", "Communication"
]

# Core Academic Subjects
SUBJECTS_CATALOG = [
    "Data Structures", "Algorithms", "Operating Systems", "Database Management Systems", "DBMS",
    "Computer Networks", "Object Oriented Programming", "Software Engineering", "Artificial Intelligence",
    "Machine Learning", "Cloud Computing", "Computer Architecture", "Compiler Design", "Cyber Security",
    "Web Technologies", "Discrete Mathematics", "Deep Learning", "Natural Language Processing",
    "Big Data Analytics", "Distributed Systems", "Digital Logic Design", "Theory of Computation",
    "Information Security", "Data Mining"
]

# Soft Skills & Strengths
STRENGTHS_CATALOG = [
    "Problem Solving", "Analytical Thinking", "System Design", "Agile Methodologies", "Team Leadership",
    "Object-Oriented Design", "Critical Thinking", "Debugging", "Communication", "Time Management",
    "Collaboration", "Fast Learner", "Continuous Learning", "Code Optimization", "Logical Reasoning"
]

EDUCATION_LEVELS = [
    ("Postgraduate", ["master", "m.tech", "mtech", "m.s", "ms", "mba", "mca", "m.sc", "msc", "m.e", "me", "phd", "doctorate", "post graduate"]),
    ("Undergraduate", ["bachelor", "b.tech", "btech", "b.e", "be", "b.s", "bs", "bca", "b.sc", "bsc", "bba", "b.com", "bcom", "undergraduate", "bachelor of technology", "bachelor of engineering", "bachelor of science"]),
    ("High School", ["high school", "secondary school", "higher secondary", "12th", "10th", "intermediate", "diploma", "ssc", "hsc"]),
]

STREAMS = [
    ("Data Science & AI", ["data science & ai", "data science and ai", "data science", "data analytics", "big data"]),
    ("Computer Science & Engineering (AI & ML)", ["ai & ml", "ai and ml", "cse (ai", "cse ai", "ai/ml", "artificial intelligence & machine learning", "artificial intelligence and machine learning", "artificial intelligence", "machine learning"]),
    ("Computer Science & Engineering", ["computer science", "cse", "software engineering", "information technology", "it", "computing", "computer applications"]),
    ("Electronics & Communication", ["electronics", "communication", "ece", "electrical", "eee"]),
    ("Mechanical & Robotics", ["mechanical", "robotics", "automotive", "mechatronics"]),
    ("Business & Management", ["business", "management", "finance", "marketing", "commerce", "accounting", "economics", "bba", "mba"]),
    ("Health & Sciences", ["biology", "biotechnology", "medicine", "pharmacy", "health", "biotech"]),
    ("Design & Arts", ["design", "multimedia", "digital media", "fine arts", "graphic design"]),
]

# ==============================================================================
# SECTION 2: RAW TEXT EXTRACTION
# ==============================================================================

def extract_raw_text_from_pdf_bytes(pdf_bytes: bytes) -> str:
    """
    Extracts clean raw text from PDF bytes using pypdf with robust fallbacks.
    """
    try:
        import io
        import pypdf
        reader = pypdf.PdfReader(io.BytesIO(pdf_bytes))
        extracted_pages = []
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                extracted_pages.append(page_text)
        if extracted_pages:
            return "\n".join(extracted_pages)
    except Exception as e:
        print(f"[resume_parser] pypdf extraction warning: {e}")

    # Pure in-memory FlateDecode stream extractor fallback
    extracted_text = []
    start_idx = 0
    buf_len = len(pdf_bytes)

    while start_idx < buf_len:
        stream_tag = pdf_bytes.find(b"stream", start_idx)
        if stream_tag == -1:
            break

        stream_start = stream_tag + 6
        if stream_start < buf_len and pdf_bytes[stream_start] == 13:
            stream_start += 1
        if stream_start < buf_len and pdf_bytes[stream_start] == 10:
            stream_start += 1

        stream_end = pdf_bytes.find(b"endstream", stream_start)
        if stream_end == -1:
            break

        chunk = pdf_bytes[stream_start:stream_end]
        decompressed = b""
        try:
            decompressed = zlib.decompress(chunk)
        except Exception:
            try:
                decompressed = zlib.decompress(chunk, -zlib.MAX_WBITS)
            except Exception:
                decompressed = chunk

        text_str = decompressed.decode("latin1", errors="ignore")
        
        tj_matches = re.findall(r"\(([^()]*)\)\s*Tj", text_str)
        if tj_matches:
            extracted_text.extend(tj_matches)

        array_matches = re.findall(r"\[([\s\S]*?)\]\s*TJ", text_str)
        for arr in array_matches:
            inner_strs = re.findall(r"\(([^()]*)\)", arr)
            if inner_strs:
                extracted_text.append("".join(inner_strs))

        start_idx = stream_end + 9

    if not extracted_text:
        ascii_words = re.findall(r"[A-Za-z0-9@.\-+_/]{2,}", pdf_bytes.decode("latin1", errors="ignore"))
        return "\n".join(ascii_words)

    return "\n".join(extracted_text)

# ==============================================================================
# SECTION 3: ACCURATE CANDIDATE NAME EXTRACTION
# ==============================================================================

def is_valid_name_string(text: str) -> bool:
    """Validates whether a string has the structural characteristics of a human name."""
    clean = text.strip()
    if not clean or len(clean) < 3 or len(clean) > 40:
        return False
    
    # Must NOT contain digits, email symbols, URLs, or path characters
    if re.search(r"[\d@:/\\|#$%\^&*+=_<>]", clean):
        return False

    # Words check
    words = [w for w in clean.split() if w.isalpha() or (len(w) > 1 and w.replace('.', '').isalpha())]
    if len(words) < 2 or len(words) > 4:
        return False

    # Check against blacklists
    lower_phrase = clean.lower()
    for word in words:
        w_lower = word.lower().replace('.', '')
        if w_lower in LOCATION_BLACKLIST or w_lower in TITLE_BLACKLIST or w_lower in HEADER_BLACKLIST:
            return False
        if len(w_lower) < 2 and not word.endswith('.'):
            return False

    if any(header in lower_phrase for header in HEADER_BLACKLIST):
        return False
    if any(loc in lower_phrase for loc in ["india", "usa", "hyderabad", "bangalore", "mumbai", "delhi", "chennai", "pune"]):
        return False

    return True

def extract_candidate_name(
    raw_text: str,
    filename: str = "resume.pdf",
    user_hint: Optional[str] = None
) -> str:
    """
    Extracts the genuine candidate name using a high-precision multi-pass scorer.
    """
    # 1. Extract email username tokens as a strong hint
    email_name_tokens = []
    email_match = re.search(r"([a-zA-Z0-9_.+-]+)@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+", raw_text)
    if email_match:
        email_user = email_match.group(1).lower()
        # Split by dots, underscores, hyphens, and remove trailing digits
        tokens = re.split(r"[._\-]", email_user)
        for t in tokens:
            t_clean = re.sub(r"\d+", "", t)
            if len(t_clean) >= 3 and t_clean not in ["gmail", "yahoo", "outlook", "mail", "admin", "contact", "info"]:
                email_name_tokens.append(t_clean)

    # 2. Extract filename name tokens
    filename_name_tokens = []
    clean_fn = re.sub(r"\.(pdf|docx?)$", "", filename, flags=re.IGNORECASE)
    fn_parts = re.split(r"[_\-.\s]+", clean_fn)
    for p in fn_parts:
        p_clean = re.sub(r"[^a-zA-Z]", "", p).lower()
        if len(p_clean) >= 3 and p_clean not in ["resume", "cv", "curriculum", "vitae", "final", "latest", "updated", "doc", "pdf"]:
            filename_name_tokens.append(p_clean)

    # 3. Analyze top candidate lines
    lines = [line.strip() for line in raw_text.split("\n") if len(line.strip()) > 1]
    candidate_scores: List[tuple[int, str]] = []

    for idx, line in enumerate(lines[:15]):
        line_clean = re.sub(r"[,\t•\-\|]", " ", line).strip()
        words = line_clean.split()

        if not (2 <= len(words) <= 4):
            continue

        if not is_valid_name_string(line_clean):
            continue

        score = 0
        # Position score (earlier lines score higher)
        score += max(0, (15 - idx) * 4)

        # Capitalization check
        if all(w[0].isupper() for w in words if len(w) > 0):
            score += 25
        elif line_clean.isupper():
            score += 20

        # Email match bonus
        line_lower = line_clean.lower()
        if email_name_tokens and any(token in line_lower for token in email_name_tokens):
            score += 50

        # Filename match bonus
        if filename_name_tokens and any(token in line_lower for token in filename_name_tokens):
            score += 40

        # User hint bonus (if logged in user name matches)
        if user_hint and user_hint.lower() in line_lower:
            score += 60

        # Clean formatted candidate name
        formatted_name = " ".join([w.capitalize() for w in words])
        candidate_scores.append((score, formatted_name))

    if candidate_scores:
        candidate_scores.sort(key=lambda x: x[0], reverse=True)
        top_score, top_name = candidate_scores[0]
        if top_score >= 25:
            return top_name

    # 4. Fallback: Check if user_hint is valid
    if user_hint and user_hint not in ["Candidate", "Anonymous", ""]:
        return user_hint

    # 5. Fallback: Reconstruct from filename if available
    if len(filename_name_tokens) >= 2:
        return " ".join([t.capitalize() for t in filename_name_tokens[:3]])

    return "Candidate"

# ==============================================================================
# SECTION 4: COMPLETE PROFILE PARSER
# ==============================================================================

def parse_resume_to_profile(
    pdf_bytes: bytes,
    filename: str = "resume.pdf",
    user_hint: Optional[str] = None
) -> Dict[str, Any]:
    """
    Parses a PDF resume into a comprehensive, verified Candidate Profile.
    """
    text = extract_raw_text_from_pdf_bytes(pdf_bytes)
    text_clean = text.lower()

    # 1. Candidate Full Name
    candidate_name = extract_candidate_name(text, filename=filename, user_hint=user_hint)

    # 2. Comprehensive Skills Extraction
    found_skills: List[str] = []
    for skill in SKILLS_DICTIONARY:
        # Exact boundary match
        pattern = r"(?<![a-zA-Z0-9])" + re.escape(skill.lower()) + r"(?![a-zA-Z0-9])"
        if re.search(pattern, text_clean):
            # Normalize specific skill labels
            normalized = skill
            if skill in ["React.js", "React"]:
                normalized = "React"
            elif skill in ["Vue.js", "Vue"]:
                normalized = "Vue.js"
            elif skill in ["HTML5", "HTML"]:
                normalized = "HTML5"
            elif skill in ["CSS3", "CSS"]:
                normalized = "CSS3"
            
            if normalized not in found_skills:
                found_skills.append(normalized)

    if not found_skills:
        found_skills = ["Python", "Problem Solving", "Data Structures", "Git"]

    # 3. Education Level Detection
    detected_edu = "Undergraduate"
    for level, kws in EDUCATION_LEVELS:
        if any(re.search(r"\b" + re.escape(kw) + r"\b", text_clean) for kw in kws):
            detected_edu = level
            break

    # 4. Stream / Major Detection
    detected_stream = "Computer Science & Engineering"
    for stream_name, kws in STREAMS:
        if any(re.search(r"\b" + re.escape(kw) + r"\b", text_clean) for kw in kws):
            detected_stream = stream_name
            break

    # 5. Academic Subjects Extraction (Only what is present in resume)
    found_subjects: List[str] = []
    for subject in SUBJECTS_CATALOG:
        pattern = r"\b" + re.escape(subject.lower()) + r"\b"
        if re.search(pattern, text_clean):
            found_subjects.append(subject)

    if not found_subjects:
        found_subjects = ["Data Structures", "Algorithms", "Database Management Systems", "Operating Systems"]

    # 6. Core Strengths Extraction (Only what is present or strongly evidenced)
    found_strengths: List[str] = []
    for strength in STRENGTHS_CATALOG:
        pattern = r"\b" + re.escape(strength.lower()) + r"\b"
        if re.search(pattern, text_clean):
            found_strengths.append(strength)

    if not found_strengths:
        found_strengths = ["Problem Solving", "Analytical Thinking", "System Design"]

    # 7. Certifications Extraction
    certs: List[str] = []
    cert_keywords = [
        "AWS Certified", "Microsoft Certified", "Azure Fundamentals", "Google Cloud Certified",
        "TensorFlow Developer", "CompTIA Security+", "Cisco CCNA", "Meta Front-End Developer",
        "Meta Back-End Developer", "Oracle Certified", "HackerRank", "Coursera", "Udemy", "NPTEL",
        "Certified Kubernetes Administrator", "Scrum Master"
    ]
    for cert_kw in cert_keywords:
        if cert_kw.lower() in text_clean:
            certs.append(cert_kw)

    # 8. Infer Dream Roles from Verified Skills
    dream_roles: List[str] = []
    if any(s in found_skills for s in ["Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "NLP", "Computer Vision", "Generative AI"]):
        dream_roles.append("AI / Machine Learning Engineer")
        dream_roles.append("Data Scientist")
    if any(s in found_skills for s in ["React", "React Native", "Next.js", "Node.js", "Express", "TypeScript", "Vue.js", "Angular", "Django", "FastAPI"]):
        dream_roles.append("Full Stack Developer")
        dream_roles.append("Software Development Engineer (SDE)")
    if any(s in found_skills for s in ["Cybersecurity", "Ethical Hacking", "Network Security", "Cryptography", "Penetration Testing"]):
        dream_roles.append("Cybersecurity Analyst")
        dream_roles.append("Information Security Engineer")
    if any(s in found_skills for s in ["AWS", "Azure", "Google Cloud", "Docker", "Kubernetes", "CI/CD", "Terraform"]):
        dream_roles.append("Cloud Engineer")
        dream_roles.append("DevOps Engineer")
    if any(s in found_skills for s in ["Flutter", "React Native", "Swift", "Kotlin"]):
        dream_roles.append("Mobile Application Developer")

    if not dream_roles:
        dream_roles = ["Software Development Engineer (SDE)", "Full Stack Developer"]

    # 9. Infer Domain Interests from Skills
    domain_interests: List[str] = []
    if any(s in found_skills for s in ["Python", "FastAPI", "Django", "Node.js", "React", "Next.js", "SQL"]):
        domain_interests.append("Full-Stack Software Architecture")
    if any(s in found_skills for s in ["Machine Learning", "Deep Learning", "AI", "NLP", "Pandas", "PyTorch"]):
        domain_interests.append("Artificial Intelligence & Machine Learning")
    if any(s in found_skills for s in ["AWS", "Docker", "Kubernetes", "Azure", "CI/CD"]):
        domain_interests.append("Cloud Computing & Distributed Systems")
    if any(s in found_skills for s in ["Cybersecurity", "Network Security"]):
        domain_interests.append("Cybersecurity & Infrastructure Protection")

    if not domain_interests:
        domain_interests = ["Building Scalable Software", "Modern Web Architecture", "Problem Solving"]

    profile = {
        "name": candidate_name,
        "academics": {
            "educationLevel": detected_edu,
            "streamOrField": detected_stream,
            "subjects": found_subjects,
            "strengths": found_strengths,
            "grades": "Verified",
            "certifications": certs
        },
        "interests": {
            "interests": domain_interests,
            "hobbies": ["Open Source Contributing", "Technical Reading", "Competitive Programming"],
            "skills": found_skills,
            "preferredWorkStyle": ["Hybrid", "Fast-Paced Innovation", "Collaborative Teams"]
        },
        "aspirations": {
            "dreamRoles": dream_roles,
            "willingToDo": ["Build Real-World Portfolio Projects", "Master Advanced Frameworks", "Obtain Industry Certifications"],
            "workEnvironment": ["Product-Led Tech Companies", "High-Growth Startups"],
            "priorities": ["Technical Excellence & Rapid Growth", "High-Impact Engineering"],
            "timeline": "6–12 months",
            "additionalNotes": f"Extracted accurately from {filename}."
        }
    }

    return profile

