import type {
  UserProfile,
  CareerRecommendation,
  LearningStep,
} from "./types";

const CAREER_DATABASE: Record<
  string,
  {
    description: string;
    simpleSummary?: string;
    skills: string[];
    learningPath: Omit<LearningStep, "completed">[];
    timeline: string;
    salaryRange?: string;
  }
> = {
  "Software Developer": {
    description:
      "Build applications, websites, and systems. Strong fit if you enjoy problem-solving, logic, and technology.",
    simpleSummary: "You'll write code to build apps and websites; great if you like solving problems and logic.",
    skills: ["Programming", "Problem Solving", "Logic", "Collaboration"],
    learningPath: [
      {
        order: 1,
        title: "Learn programming fundamentals",
        description: "Master one language and core programming concepts.",
        procedure: [
          "Choose one language: Python (beginner-friendly) or JavaScript (for web).",
          "Complete an introductory course covering variables, loops, functions, and basic data structures (arrays, objects).",
          "Practice daily with small exercises (e.g. LeetCode easy, Codewars).",
          "Learn basic version control with Git (clone, commit, push).",
        ],
        duration: "2–3 months",
        resources: ["freeCodeCamp", "Codecademy", "CS50 (Harvard)", "Python.org tutorial", "JavaScript.info"],
      },
      {
        order: 2,
        title: "Build web or backend foundations",
        description: "Learn how to build simple web apps or server-side logic.",
        procedure: [
          "For frontend: HTML, CSS, then JavaScript (DOM, fetch). Build a static site, then one with API calls.",
          "For backend: Pick a framework (e.g. Node.js/Express or Python/Flask). Learn REST APIs and a database (SQL or MongoDB).",
          "Complete one guided project (e.g. blog, todo app, weather app).",
        ],
        duration: "2–4 months",
        resources: ["MDN Web Docs", "The Odin Project", "freeCodeCamp Backend course", "SQLZoo", "Postman"],
      },
      {
        order: 3,
        title: "Create a portfolio of projects",
        description: "Build 2–3 projects that demonstrate your skills.",
        procedure: [
          "Define 2–3 projects that solve a real problem or showcase a skill (e.g. API integration, CRUD app, small game).",
          "Build them end-to-end: plan, code, test, and deploy (e.g. Vercel, Netlify, Railway).",
          "Write a short README for each: what it does, how to run it, tech stack.",
          "Push all code to GitHub and add the repo links to your resume and portfolio site.",
        ],
        duration: "2–3 months",
        resources: ["GitHub", "Vercel", "Netlify", "Dev.to portfolio guides", "README templates"],
      },
      {
        order: 4,
        title: "Apply to internships or junior roles",
        description: "Prepare for applications and interviews.",
        procedure: [
          "Polish your resume: list projects with links, tech stack, and 1–2 bullet points each.",
          "Practice algorithm and data-structure problems (arrays, strings, hash maps, simple trees).",
          "Apply to internships and junior developer roles; tailor cover letters to each company.",
          "Practice behavioral questions and “tell me about a project” answers.",
        ],
        duration: "Ongoing",
        resources: ["LinkedIn", "LeetCode", "Pramp", "Glassdoor", "Levels.fyi", "Company career pages"],
      },
    ],
    timeline: "6–12 months to first role (with consistent effort)",
    salaryRange: "Entry: $50k–80k | Mid: $80k–120k",
  },
  "Data Analyst": {
    description:
      "Turn data into insights. Great for people who like numbers, patterns, and clear answers.",
    simpleSummary: "You'll work with numbers and data to find patterns and answer business questions.",
    skills: ["Excel/SQL", "Statistics", "Visualization", "Critical Thinking"],
    learningPath: [
      {
        order: 1,
        title: "Master Excel and spreadsheets",
        description: "Become confident with data cleaning, formulas, and reporting in spreadsheets.",
        procedure: [
          "Learn core formulas: SUM, AVERAGE, IF, VLOOKUP/XLOOKUP, and pivot tables.",
          "Practice cleaning messy data: remove duplicates, handle missing values, standardize formats.",
          "Build 2–3 practice reports (e.g. sales summary, survey summary) with clear takeaways.",
        ],
        duration: "1–2 months",
        resources: ["Google Data Analytics Certificate (Coursera)", "Microsoft Excel documentation", "Chandoo.org", "ExcelJet"],
      },
      {
        order: 2,
        title: "Learn SQL for data extraction",
        description: "Write queries to extract and aggregate data from databases.",
        procedure: [
          "Learn SELECT, WHERE, GROUP BY, ORDER BY, JOINs (INNER, LEFT), and basic subqueries.",
          "Practice on sample databases (e.g. SQLZoo, Mode, Strata Scratch) with real-world-style questions.",
          "Complete 20–30 practice problems; focus on clarity and correct results.",
        ],
        duration: "1–2 months",
        resources: ["Mode SQL Tutorial", "Strata Scratch", "LeetCode SQL", "SQLZoo", "W3Schools SQL"],
      },
      {
        order: 3,
        title: "Build dashboards and visualizations",
        description: "Create clear dashboards that answer business questions.",
        procedure: [
          "Pick one tool: Tableau Public or Power BI (both have free tiers).",
          "Learn connecting to data, building charts (bar, line, scatter, maps), and filters.",
          "Build 2 dashboards using public datasets (e.g. Kaggle); each should answer 2–3 specific questions.",
          "Add short written insights to each dashboard.",
        ],
        duration: "1–2 months",
        resources: ["Tableau Public", "Power BI documentation", "Kaggle datasets", "Makeover Monday"],
      },
      {
        order: 4,
        title: "Create an analysis portfolio and apply",
        description: "Showcase your work and apply to analyst roles.",
        procedure: [
          "Document 2–3 full analyses: business question, data used, steps taken, findings, and recommendation.",
          "Host on GitHub (notebooks + README) or a simple portfolio site; add links to your resume.",
          "Apply to data analyst and business analyst roles; tailor resume and cover letter to each role.",
          "Prepare to discuss your projects and walk through your analysis process in interviews.",
        ],
        duration: "2–3 months",
        resources: ["Kaggle", "GitHub", "LinkedIn", "Indeed", "Data analyst job descriptions"],
      },
    ],
    timeline: "4–8 months to first role",
    salaryRange: "Entry: $45k–65k | Mid: $65k–95k",
  },
  "UX/UI Designer": {
    description:
      "Design products users love. Ideal if you care about people, aesthetics, and usability.",
    simpleSummary: "You'll design how apps and websites look and feel so users have a great experience.",
    skills: ["Design thinking", "Wireframing", "Prototyping", "User Research"],
    learningPath: [
      {
        order: 1,
        title: "Design fundamentals",
        description: "Layout, typography, color, and basic design principles.",
        duration: "1–2 months",
        resources: ["Refactoring UI", "Design course (Coursera/Udemy)"],
      },
      {
        order: 2,
        title: "Figma & prototyping",
        description: "Wireframes, high-fidelity mockups, and clickable prototypes.",
        duration: "2–3 months",
        resources: ["Figma", "YouTube tutorials", "Daily UI challenge"],
      },
      {
        order: 3,
        title: "Portfolio (3–5 projects)",
        description: "Case studies showing process, not just final screens.",
        duration: "2–3 months",
        resources: ["Behance", "Dribbble", "Notion portfolio"],
      },
      {
        order: 4,
        title: "Apply & iterate",
        description: "Internships, freelance, or junior roles; get feedback.",
        duration: "Ongoing",
        resources: ["LinkedIn", "ADPList", "Design communities"],
      },
    ],
    timeline: "6–10 months to first role",
    salaryRange: "Entry: $50k–75k | Mid: $75k–110k",
  },
  "Digital Marketer": {
    description:
      "Grow brands and reach audiences online. Good for creative and analytical minds.",
    simpleSummary: "You'll promote brands online through content, ads, and social media to reach the right people.",
    skills: ["SEO", "Content", "Analytics", "Campaigns", "Communication"],
    learningPath: [
      {
        order: 1,
        title: "Marketing fundamentals",
        description: "Funnels, audience, messaging, and channels.",
        duration: "1–2 months",
        resources: ["HubSpot Academy", "Google Digital Garage"],
      },
      {
        order: 2,
        title: "SEO & content",
        description: "Keywords, on-page SEO, and basic content creation.",
        duration: "1–2 months",
        resources: ["Ahrefs Academy", "Yoast", "Blog practice"],
      },
      {
        order: 3,
        title: "Paid & analytics",
        description: "Google Ads, Meta Ads, and Google Analytics basics.",
        duration: "1–2 months",
        resources: ["Google Skillshop", "Meta Blueprint", "GA4"],
      },
      {
        order: 4,
        title: "Portfolio & first role",
        description: "Run a small campaign or blog; apply to internships/junior roles.",
        duration: "2–3 months",
        resources: ["LinkedIn", "Upwork", "Portfolio site"],
      },
    ],
    timeline: "4–8 months to first role",
    salaryRange: "Entry: $40k–60k | Mid: $60k–90k",
  },
  "Product Manager": {
    description:
      "Define what to build and why. Bridges business, users, and tech.",
    simpleSummary: "You'll decide what features to build, why, and when—connecting users, business, and developers.",
    skills: ["Prioritization", "Stakeholder management", "Roadmapping", "User empathy"],
    learningPath: [
      {
        order: 1,
        title: "Product basics",
        description: "What PMs do, roadmaps, backlogs, and agile.",
        duration: "1–2 months",
        resources: ["Coursera PM courses", "Product School", "Books: Inspired, Cracking PM"],
      },
      {
        order: 2,
        title: "Discovery & framing",
        description: "User research, problem framing, and requirements.",
        duration: "1–2 months",
        resources: ["LinkedIn Learning", "Reforge", "Case studies"],
      },
      {
        order: 3,
        title: "Side project or internal PM",
        description: "Own a small product or feature end-to-end.",
        duration: "2–3 months",
        resources: ["Internal projects", "Volunteer PM", "Startup internships"],
      },
      {
        order: 4,
        title: "Apply to APM / junior PM",
        description: "Prepare PM interviews (behavioral + product sense).",
        duration: "Ongoing",
        resources: ["Lewis Lin", "Exponent", "PM interview prep"],
      },
    ],
    timeline: "6–12 months (often after some industry experience)",
    salaryRange: "Entry: $70k–100k | Mid: $100k–150k",
  },
  "Content Writer / Creator": {
    description:
      "Create written or visual content. For people who love writing, storytelling, or video.",
    simpleSummary: "You'll create articles, videos, or social content to inform or entertain audiences.",
    skills: ["Writing", "Research", "SEO", "Storytelling", "Adaptability"],
    learningPath: [
      {
        order: 1,
        title: "Writing fundamentals",
        description: "Clarity, structure, tone, and audience.",
        duration: "1–2 months",
        resources: ["Writing courses", "Grammarly", "Read widely"],
      },
      {
        order: 2,
        title: "Niche & format",
        description: "Pick a niche (tech, health, finance) and format (blog, video, social).",
        duration: "1 month",
        resources: ["Medium", "Substack", "YouTube"],
      },
      {
        order: 3,
        title: "Portfolio & samples",
        description: "5–10 published pieces or a consistent channel.",
        duration: "2–3 months",
        resources: ["Personal blog", "Guest posts", "Freelance platforms"],
      },
      {
        order: 4,
        title: "Freelance or in-house",
        description: "Apply to content roles or build freelance client base.",
        duration: "Ongoing",
        resources: ["Upwork", "Contently", "LinkedIn", "Newsletter jobs"],
      },
    ],
    timeline: "4–8 months to first paid work",
    salaryRange: "Freelance: variable | In-house: $45k–80k",
  },
  "Cybersecurity Analyst": {
    description:
      "Protect systems and data. For those interested in security, networks, and risk.",
    simpleSummary: "You'll help protect companies' systems and data from attacks and security risks.",
    skills: ["Networking", "Security fundamentals", "Linux", "Analytical thinking"],
    learningPath: [
      {
        order: 1,
        title: "Networking & OS basics",
        description: "TCP/IP, DNS, Linux command line, Windows basics.",
        duration: "2–3 months",
        resources: ["CompTIA Network+", "TryHackMe", "OverTheWire"],
      },
      {
        order: 2,
        title: "Security fundamentals",
        description: "CIA triad, threats, vulnerabilities, basic hardening.",
        duration: "2 months",
        resources: ["Cybrary", "Professor Messer", "NIST guides"],
      },
      {
        order: 3,
        title: "Hands-on practice",
        description: "Labs, CTFs, and a home lab or cloud lab.",
        duration: "2–3 months",
        resources: ["TryHackMe", "HackTheBox", "VulnHub"],
      },
      {
        order: 4,
        title: "Certs & first role",
        description: "Consider Security+, then apply to SOC/analyst roles.",
        duration: "Ongoing",
        resources: ["CompTIA Security+", "LinkedIn", "Indeed"],
      },
    ],
    timeline: "8–14 months to first role",
    salaryRange: "Entry: $55k–85k | Mid: $85k–120k",
  },
  "Healthcare / Allied Health": {
    description:
      "Support patient care and health systems. For people who want meaningful, stable work.",
    simpleSummary: "You'll work in hospitals, clinics, or labs to help patients and keep health systems running.",
    skills: ["Empathy", "Attention to detail", "Communication", "Compliance"],
    learningPath: [
      {
        order: 1,
        title: "Prerequisites & program",
        description: "Choose path (nursing, radiology, lab, admin) and meet education requirements.",
        duration: "Varies (6 months–4 years)",
        resources: ["Local colleges", "Accredited programs", "NAHQ for admin"],
      },
      {
        order: 2,
        title: "Certification / licensure",
        description: "Complete required certs or licenses for your role.",
        duration: "As per program",
        resources: ["State boards", "Professional associations"],
      },
      {
        order: 3,
        title: "Clinical or practical experience",
        description: "Internships, clinicals, or entry-level positions.",
        duration: "As per program",
        resources: ["Hospitals", "Clinics", "Job boards"],
      },
      {
        order: 4,
        title: "Apply to full-time roles",
        description: "Hospitals, clinics, telehealth, public health.",
        duration: "Ongoing",
        resources: ["Indeed", "Hospital career pages", "LinkedIn"],
      },
    ],
    timeline: "1–4 years depending on role",
    salaryRange: "Varies widely by role and region",
  },
  "Teacher / Educator": {
    description:
      "Teach and support learning. For those who enjoy explaining, mentoring, and impact.",
    simpleSummary: "You'll teach students in a classroom or online and help them learn and grow.",
    skills: ["Communication", "Patience", "Organization", "Subject knowledge"],
    learningPath: [
      {
        order: 1,
        title: "Education requirements",
        description: "Check your region for degree and certification requirements.",
        duration: "2–4 years typical",
        resources: ["State education dept", "Teaching programs"],
      },
      {
        order: 2,
        title: "Student teaching / practicum",
        description: "Supervised teaching experience.",
        duration: "1–2 semesters",
        resources: ["University placement", "Schools"],
      },
      {
        order: 3,
        title: "Certification / license",
        description: "Pass required exams and apply for license.",
        duration: "3–6 months",
        resources: ["State exams", "Praxis", "Alternative cert programs"],
      },
      {
        order: 4,
        title: "Apply to schools",
        description: "Public, private, charter, or international.",
        duration: "Ongoing",
        resources: ["School job boards", "Districts", "Indeed"],
      },
    ],
    timeline: "2–5 years to certified role",
    salaryRange: "Varies by level and location",
  },
  "Graphic Designer": {
    description:
      "Create visual content for brands, media, and digital products. Ideal for those who love visuals, typography, and branding.",
    simpleSummary: "You'll create logos, layouts, and visual content for print and digital—great if you love art and branding.",
    skills: ["Adobe Creative Suite", "Typography", "Layout", "Branding", "Visual communication"],
    learningPath: [
      {
        order: 1,
        title: "Design fundamentals and tools",
        description: "Learn layout, color theory, typography, and basic use of Photoshop, Illustrator, and InDesign.",
        duration: "2–3 months",
        resources: ["Adobe Learn", "Canva Design School", "YouTube tutorials", "Skillshare"],
      },
      {
        order: 2,
        title: "Projects and style",
        description: "Build 3–5 projects (logos, posters, social graphics); develop a consistent style.",
        duration: "2–3 months",
        resources: ["Behance", "Dribbble", "99designs", "Daily design challenges"],
      },
      {
        order: 3,
        title: "Portfolio and niche",
        description: "Assemble a portfolio; optionally specialize (branding, motion, print).",
        duration: "1–2 months",
        resources: ["Behance", "Portfolio sites", "LinkedIn"],
      },
      {
        order: 4,
        title: "Freelance or in-house",
        description: "Apply to junior designer or freelance roles; get feedback and iterate.",
        duration: "Ongoing",
        resources: ["Upwork", "Fiverr", "LinkedIn", "Company career pages"],
      },
    ],
    timeline: "6–12 months to first role",
    salaryRange: "Entry: $40k–55k | Mid: $55k–80k",
  },
  "Financial Analyst": {
    description:
      "Analyze financial data and support business decisions. For people who like numbers, Excel, and business.",
    simpleSummary: "You'll analyze financials, build models, and support planning and investment decisions.",
    skills: ["Excel", "Financial modeling", "Analysis", "Accounting basics", "Presentation"],
    learningPath: [
      {
        order: 1,
        title: "Excel and accounting basics",
        description: "Master Excel (formulas, pivot tables, charts) and basic accounting (P&L, balance sheet).",
        duration: "2–3 months",
        resources: ["CFI Excel", "Coursera Accounting", "Corporate Finance Institute"],
      },
      {
        order: 2,
        title: "Financial modeling",
        description: "Build models: DCF, budgeting, and simple valuation.",
        duration: "2–3 months",
        resources: ["Wall Street Prep", "CFI", "Macabacus", "YouTube"],
      },
      {
        order: 3,
        title: "Certifications (optional)",
        description: "Consider FMVA, CFA Level 1, or similar to strengthen profile.",
        duration: "3–6 months",
        resources: ["CFI FMVA", "CFA Institute", "LinkedIn Learning"],
      },
      {
        order: 4,
        title: "Apply to analyst roles",
        description: "Target FP&A, investment analyst, or banking support roles; tailor resume and practice cases.",
        duration: "Ongoing",
        resources: ["LinkedIn", "Indeed", "Company careers", "Glassdoor"],
      },
    ],
    timeline: "6–12 months to first role",
    salaryRange: "Entry: $55k–75k | Mid: $75k–110k",
  },
  "Project Manager": {
    description:
      "Plan, track, and deliver projects on time and within scope. Bridges teams and stakeholders.",
    simpleSummary: "You'll coordinate tasks, timelines, and people so projects get done successfully.",
    skills: ["Planning", "Communication", "Agile/Scrum", "Stakeholder management", "Tools"],
    learningPath: [
      {
        order: 1,
        title: "PM fundamentals",
        description: "Learn project lifecycle, scope, schedule, risk, and basic methodologies (Waterfall, Agile).",
        duration: "1–2 months",
        resources: ["Coursera PM", "Google Project Management Certificate", "PMI resources"],
      },
      {
        order: 2,
        title: "Agile and tools",
        description: "Get comfortable with Scrum, Kanban, and tools like Jira, Asana, or Trello.",
        duration: "1–2 months",
        resources: ["Scrum.org", "Atlassian", "YouTube", "LinkedIn Learning"],
      },
      {
        order: 3,
        title: "Practice and certification",
        description: "Run a small project (work or volunteer) or get CAPM/PMP if eligible.",
        duration: "2–4 months",
        resources: ["PMI CAPM", "Volunteer PM roles", "Internal projects"],
      },
      {
        order: 4,
        title: "Apply to PM roles",
        description: "Target junior PM, coordinator, or associate roles; emphasize delivery and teamwork.",
        duration: "Ongoing",
        resources: ["LinkedIn", "Indeed", "Company career pages"],
      },
    ],
    timeline: "4–8 months to first role",
    salaryRange: "Entry: $55k–75k | Mid: $75k–110k",
  },
  "Human Resources Specialist": {
    description:
      "Support hiring, onboarding, and people operations. For those who enjoy working with people and processes.",
    simpleSummary: "You'll help with recruitment, policies, and employee support so organizations run smoothly.",
    skills: ["Recruitment", "Communication", "HR policies", "Organization", "Empathy"],
    learningPath: [
      {
        order: 1,
        title: "HR fundamentals",
        description: "Learn HR basics: recruitment, onboarding, policies, and employment law essentials.",
        duration: "1–2 months",
        resources: ["SHRM", "Coursera HR", "LinkedIn Learning", "HR blogs"],
      },
      {
        order: 2,
        title: "Recruitment and tools",
        description: "Practice sourcing, screening, and using ATS or recruitment tools.",
        duration: "1–2 months",
        resources: ["LinkedIn Recruiter", "Indeed Hire", "Greenhouse", "YouTube"],
      },
      {
        order: 3,
        title: "Certification (optional)",
        description: "Consider SHRM-CP or PHR to strengthen credibility.",
        duration: "2–4 months",
        resources: ["SHRM", "HRCI", "Study guides"],
      },
      {
        order: 4,
        title: "Apply to HR roles",
        description: "Target HR coordinator, recruiter, or people operations roles.",
        duration: "Ongoing",
        resources: ["LinkedIn", "Indeed", "Company career pages", "SHRM job board"],
      },
    ],
    timeline: "4–8 months to first role",
    salaryRange: "Entry: $45k–60k | Mid: $60k–85k",
  },
};

function normalize(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Keywords that signal interest in a career (partial match on user input) */
const CAREER_KEYWORDS: Record<string, string[]> = {
  "Software Developer": [
    "coding", "programming", "developer", "software", "code", "python", "javascript", "java", "web", "app", "cs", "computer science", "logic", "problem solving", "tech", "algorithm",
  ],
  "Data Analyst": [
    "data", "analytics", "excel", "sql", "numbers", "statistics", "spreadsheet", "dashboard", "reporting", "insight", "analysis", "metrics",
  ],
  "UX/UI Designer": [
    "design", "ui", "ux", "figma", "user experience", "interface", "wireframe", "prototype", "aesthetic", "usability", "creative", "visual",
  ],
  "Digital Marketer": [
    "marketing", "social media", "seo", "content", "brand", "campaign", "ads", "growth", "communication",
  ],
  "Product Manager": [
    "product", "pm", "roadmap", "stakeholder", "prioritization", "agile", "user", "business", "strategy",
  ],
  "Content Writer / Creator": [
    "writing", "content", "writer", "blog", "copy", "storytelling", "creative writing", "video", "youtube", "social",
  ],
  "Cybersecurity Analyst": [
    "security", "cyber", "network", "linux", "ethical hack", "penetration", "infosec",
  ],
  "Healthcare / Allied Health": [
    "health", "healthcare", "medical", "nursing", "patient", "clinical", "hospital", "care",
  ],
  "Teacher / Educator": [
    "teaching", "teacher", "education", "educator", "mentor", "explain", "students", "learning",
  ],
  "Graphic Designer": [
    "graphic", "design", "illustrator", "photoshop", "logo", "branding", "visual", "creative", "typography", "layout",
  ],
  "Financial Analyst": [
    "finance", "financial", "excel", "modeling", "analysis", "accounting", "investment", "numbers", "business",
  ],
  "Project Manager": [
    "project", "pm", "agile", "scrum", "planning", "stakeholder", "delivery", "jira", "coordination",
  ],
  "Human Resources Specialist": [
    "hr", "human resources", "recruitment", "hiring", "people", "onboarding", "employee", "talent",
  ],
};

function tokenize(text: string): string[] {
  return normalize(text).split(" ").filter((s) => s.length > 1);
}

function matchScoreAndReasons(
  profile: UserProfile,
  careerKey: string
): { score: number; reasons: string[] } {
  const career = CAREER_DATABASE[careerKey];
  if (!career) return { score: 0, reasons: [] };

  const reasons: string[] = [];
  let score = 35;

  const allTokens = new Set<string>();
  const addTokens = (arr: string[]) => {
    arr.forEach((s) => tokenize(s).forEach((t) => allTokens.add(t)));
  };
  addTokens(profile.academics.subjects);
  addTokens(profile.academics.strengths);
  addTokens(profile.interests.interests);
  addTokens(profile.interests.hobbies);
  addTokens(profile.interests.skills);
  addTokens(profile.aspirations.dreamRoles);
  addTokens(profile.aspirations.willingToDo);

  const allText = Array.from(allTokens).join(" ");

  // 1) Dream role match (strongest signal)
  const dreamMatch = profile.aspirations.dreamRoles.some((r) => {
    const n = normalize(r);
    const careerN = normalize(careerKey);
    return n.includes(careerN) || careerN.includes(n) || careerKey.toLowerCase().split(/\s+/).some((w) => n.includes(w) && w.length > 3);
  });
  if (dreamMatch) {
    score += 28;
    reasons.push("You listed this (or a very similar role) as a dream career.");
  }

  // 2) Keyword match for this career
  const keywords = CAREER_KEYWORDS[careerKey] ?? [];
  let keywordHits = 0;
  for (const kw of keywords) {
    if (allText.includes(kw) || allTokens.has(kw) || Array.from(allTokens).some((t) => t.includes(kw) || kw.includes(t))) {
      keywordHits++;
    }
  }
  if (keywordHits > 0) {
    const points = Math.min(22, keywordHits * 5);
    score += points;
    if (keywordHits >= 2) reasons.push("Your interests and skills match keywords that fit this career.");
  }

  // 3) Career title words + required skills in profile
  const titleWords = tokenize(careerKey);
  const skillWords = career.skills.flatMap((s) => tokenize(s));
  for (const w of [...titleWords, ...skillWords]) {
    if (w.length < 4) continue;
    if (allTokens.has(w) || allText.includes(w)) {
      score += 3;
      if (!reasons.some((r) => r.includes("skills")))
        reasons.push("Your stated strengths or skills align with what this path needs.");
    }
  }

  // 4) Willing to learn / study
  const willingLearn = profile.aspirations.willingToDo.some((w) => {
    const n = normalize(w);
    return n.includes("learn") || n.includes("study") || n.includes("course") || n.includes("certify");
  });
  if (willingLearn) {
    score += 5;
    reasons.push("You're open to learning new skills—this path has a clear learning plan.");
  }

  // 5) Work style / environment alignment (light boost)
  const pref = [...profile.interests.preferredWorkStyle, ...profile.aspirations.workEnvironment].map(normalize).join(" ");
  if (pref.length > 0) reasons.push("We've considered your preferred work style and environment.");

  if (reasons.length === 0) reasons.push("This path is a possible fit based on your profile; exploring it can help you decide.");
  reasons.push("Structured learning path with steps and resources you can follow.");

  return {
    score: Math.min(98, Math.max(42, score)),
    reasons: Array.from(new Set(reasons)),
  };
}

export function getRecommendations(profile: UserProfile): CareerRecommendation[] {
  const results: CareerRecommendation[] = [];

  for (const [title, data] of Object.entries(CAREER_DATABASE)) {
    const { score, reasons } = matchScoreAndReasons(profile, title);
    results.push({
      careerTitle: title,
      matchScore: score,
      description: data.description,
      simpleSummary: data.simpleSummary,
      whyRecommended: reasons,
      requiredSkills: data.skills,
      learningPath: data.learningPath.map((step) => ({
        ...step,
        completed: false,
      })),
      estimatedTimeline: data.timeline,
      salaryRange: data.salaryRange,
    });
  }

  results.sort((a, b) => b.matchScore - a.matchScore);
  return results.slice(0, 5);
}

export function getCareerSummaries(): { title: string; description: string }[] {
  return Object.entries(CAREER_DATABASE).map(([title, data]) => ({
    title,
    description: data.description,
  }));
}

export function getCareerDetails(careerTitle: string): {
  title: string;
  description: string;
  simpleSummary?: string;
  skills: string[];
  timeline: string;
  salaryRange?: string;
  learningPathSummary: string[];
} | null {
  const key = Object.keys(CAREER_DATABASE).find(
    (k) => k.toLowerCase() === careerTitle.toLowerCase()
  );
  if (!key) return null;
  const data = CAREER_DATABASE[key];
  const steps = data.learningPath.map(
    (s) => `Step ${s.order}: ${s.title} — ${s.duration}`
  );
  return {
    title: key,
    description: data.description,
    simpleSummary: data.simpleSummary,
    skills: data.skills,
    timeline: data.timeline,
    salaryRange: data.salaryRange,
    learningPathSummary: steps,
  };
}

/** Get a full career recommendation by title (e.g. for viewing a saved or direct-linked career). */
export function getCareerByTitle(careerTitle: string): CareerRecommendation | null {
  const key = Object.keys(CAREER_DATABASE).find(
    (k) => k.toLowerCase() === careerTitle.toLowerCase()
  );
  if (!key) return null;
  const data = CAREER_DATABASE[key];
  return {
    careerTitle: key,
    matchScore: 0,
    description: data.description,
    simpleSummary: data.simpleSummary,
    whyRecommended: ["You opened this career path."],
    requiredSkills: data.skills,
    learningPath: data.learningPath.map((step) => ({ ...step, completed: false })),
    estimatedTimeline: data.timeline,
    salaryRange: data.salaryRange,
  };
}
