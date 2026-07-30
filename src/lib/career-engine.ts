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

  "Full Stack Developer": {
    description: "A rewarding career in Software & Development as a Full Stack Developer.",
    simpleSummary: "You will work as a Full Stack Developer in the Software & Development industry.",
    skills: ["Software and Development Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of Full Stack Developer.", procedure: ["Research Full Stack Developer fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice Software and Development skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your Full Stack Developer projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "Frontend Developer": {
    description: "A rewarding career in Software & Development as a Frontend Developer.",
    simpleSummary: "You will work as a Frontend Developer in the Software & Development industry.",
    skills: ["Software and Development Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of Frontend Developer.", procedure: ["Research Frontend Developer fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice Software and Development skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your Frontend Developer projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "Backend Developer": {
    description: "A rewarding career in Software & Development as a Backend Developer.",
    simpleSummary: "You will work as a Backend Developer in the Software & Development industry.",
    skills: ["Software and Development Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of Backend Developer.", procedure: ["Research Backend Developer fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice Software and Development skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your Backend Developer projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "Mobile App Developer": {
    description: "A rewarding career in Software & Development as a Mobile App Developer.",
    simpleSummary: "You will work as a Mobile App Developer in the Software & Development industry.",
    skills: ["Software and Development Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of Mobile App Developer.", procedure: ["Research Mobile App Developer fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice Software and Development skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your Mobile App Developer projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "Game Developer": {
    description: "A rewarding career in Software & Development as a Game Developer.",
    simpleSummary: "You will work as a Game Developer in the Software & Development industry.",
    skills: ["Software and Development Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of Game Developer.", procedure: ["Research Game Developer fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice Software and Development skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your Game Developer projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "Software Engineer": {
    description: "A rewarding career in Software & Development as a Software Engineer.",
    simpleSummary: "You will work as a Software Engineer in the Software & Development industry.",
    skills: ["Software and Development Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of Software Engineer.", procedure: ["Research Software Engineer fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice Software and Development skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your Software Engineer projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "DevOps Engineer": {
    description: "A rewarding career in Software & Development as a DevOps Engineer.",
    simpleSummary: "You will work as a DevOps Engineer in the Software & Development industry.",
    skills: ["Software and Development Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of DevOps Engineer.", procedure: ["Research DevOps Engineer fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice Software and Development skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your DevOps Engineer projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "Embedded Systems Engineer": {
    description: "A rewarding career in Software & Development as a Embedded Systems Engineer.",
    simpleSummary: "You will work as a Embedded Systems Engineer in the Software & Development industry.",
    skills: ["Software and Development Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of Embedded Systems Engineer.", procedure: ["Research Embedded Systems Engineer fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice Software and Development skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your Embedded Systems Engineer projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "Blockchain Developer": {
    description: "A rewarding career in Software & Development as a Blockchain Developer.",
    simpleSummary: "You will work as a Blockchain Developer in the Software & Development industry.",
    skills: ["Software and Development Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of Blockchain Developer.", procedure: ["Research Blockchain Developer fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice Software and Development skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your Blockchain Developer projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "AR/VR Developer": {
    description: "A rewarding career in Software & Development as a AR/VR Developer.",
    simpleSummary: "You will work as a AR/VR Developer in the Software & Development industry.",
    skills: ["Software and Development Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of AR/VR Developer.", procedure: ["Research AR/VR Developer fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice Software and Development skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your AR/VR Developer projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "AI Engineer": {
    description: "A rewarding career in Artificial Intelligence & Data Science as a AI Engineer.",
    simpleSummary: "You will work as a AI Engineer in the Artificial Intelligence & Data Science industry.",
    skills: ["Artificial Intelligence and Data Science Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of AI Engineer.", procedure: ["Research AI Engineer fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice Artificial Intelligence and Data Science skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your AI Engineer projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "Machine Learning Engineer": {
    description: "A rewarding career in Artificial Intelligence & Data Science as a Machine Learning Engineer.",
    simpleSummary: "You will work as a Machine Learning Engineer in the Artificial Intelligence & Data Science industry.",
    skills: ["Artificial Intelligence and Data Science Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of Machine Learning Engineer.", procedure: ["Research Machine Learning Engineer fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice Artificial Intelligence and Data Science skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your Machine Learning Engineer projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "Deep Learning Engineer": {
    description: "A rewarding career in Artificial Intelligence & Data Science as a Deep Learning Engineer.",
    simpleSummary: "You will work as a Deep Learning Engineer in the Artificial Intelligence & Data Science industry.",
    skills: ["Artificial Intelligence and Data Science Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of Deep Learning Engineer.", procedure: ["Research Deep Learning Engineer fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice Artificial Intelligence and Data Science skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your Deep Learning Engineer projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "Data Scientist": {
    description: "A rewarding career in Artificial Intelligence & Data Science as a Data Scientist.",
    simpleSummary: "You will work as a Data Scientist in the Artificial Intelligence & Data Science industry.",
    skills: ["Artificial Intelligence and Data Science Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of Data Scientist.", procedure: ["Research Data Scientist fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice Artificial Intelligence and Data Science skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your Data Scientist projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "Business Intelligence Analyst": {
    description: "A rewarding career in Artificial Intelligence & Data Science as a Business Intelligence Analyst.",
    simpleSummary: "You will work as a Business Intelligence Analyst in the Artificial Intelligence & Data Science industry.",
    skills: ["Artificial Intelligence and Data Science Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of Business Intelligence Analyst.", procedure: ["Research Business Intelligence Analyst fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice Artificial Intelligence and Data Science skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your Business Intelligence Analyst projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "NLP Engineer": {
    description: "A rewarding career in Artificial Intelligence & Data Science as a NLP Engineer.",
    simpleSummary: "You will work as a NLP Engineer in the Artificial Intelligence & Data Science industry.",
    skills: ["Artificial Intelligence and Data Science Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of NLP Engineer.", procedure: ["Research NLP Engineer fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice Artificial Intelligence and Data Science skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your NLP Engineer projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "Computer Vision Engineer": {
    description: "A rewarding career in Artificial Intelligence & Data Science as a Computer Vision Engineer.",
    simpleSummary: "You will work as a Computer Vision Engineer in the Artificial Intelligence & Data Science industry.",
    skills: ["Artificial Intelligence and Data Science Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of Computer Vision Engineer.", procedure: ["Research Computer Vision Engineer fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice Artificial Intelligence and Data Science skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your Computer Vision Engineer projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "Robotics Engineer": {
    description: "A rewarding career in Artificial Intelligence & Data Science as a Robotics Engineer.",
    simpleSummary: "You will work as a Robotics Engineer in the Artificial Intelligence & Data Science industry.",
    skills: ["Artificial Intelligence and Data Science Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of Robotics Engineer.", procedure: ["Research Robotics Engineer fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice Artificial Intelligence and Data Science skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your Robotics Engineer projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "Prompt Engineer": {
    description: "A rewarding career in Artificial Intelligence & Data Science as a Prompt Engineer.",
    simpleSummary: "You will work as a Prompt Engineer in the Artificial Intelligence & Data Science industry.",
    skills: ["Artificial Intelligence and Data Science Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of Prompt Engineer.", procedure: ["Research Prompt Engineer fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice Artificial Intelligence and Data Science skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your Prompt Engineer projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "Ethical Hacker": {
    description: "A rewarding career in Cybersecurity as a Ethical Hacker.",
    simpleSummary: "You will work as a Ethical Hacker in the Cybersecurity industry.",
    skills: ["Cybersecurity Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of Ethical Hacker.", procedure: ["Research Ethical Hacker fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice Cybersecurity skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your Ethical Hacker projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "Penetration Tester": {
    description: "A rewarding career in Cybersecurity as a Penetration Tester.",
    simpleSummary: "You will work as a Penetration Tester in the Cybersecurity industry.",
    skills: ["Cybersecurity Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of Penetration Tester.", procedure: ["Research Penetration Tester fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice Cybersecurity skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your Penetration Tester projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "SOC Analyst": {
    description: "A rewarding career in Cybersecurity as a SOC Analyst.",
    simpleSummary: "You will work as a SOC Analyst in the Cybersecurity industry.",
    skills: ["Cybersecurity Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of SOC Analyst.", procedure: ["Research SOC Analyst fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice Cybersecurity skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your SOC Analyst projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "Security Engineer": {
    description: "A rewarding career in Cybersecurity as a Security Engineer.",
    simpleSummary: "You will work as a Security Engineer in the Cybersecurity industry.",
    skills: ["Cybersecurity Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of Security Engineer.", procedure: ["Research Security Engineer fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice Cybersecurity skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your Security Engineer projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "Digital Forensics Expert": {
    description: "A rewarding career in Cybersecurity as a Digital Forensics Expert.",
    simpleSummary: "You will work as a Digital Forensics Expert in the Cybersecurity industry.",
    skills: ["Cybersecurity Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of Digital Forensics Expert.", procedure: ["Research Digital Forensics Expert fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice Cybersecurity skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your Digital Forensics Expert projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "Cloud Security Engineer": {
    description: "A rewarding career in Cybersecurity as a Cloud Security Engineer.",
    simpleSummary: "You will work as a Cloud Security Engineer in the Cybersecurity industry.",
    skills: ["Cybersecurity Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of Cloud Security Engineer.", procedure: ["Research Cloud Security Engineer fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice Cybersecurity skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your Cloud Security Engineer projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "Information Security Analyst": {
    description: "A rewarding career in Cybersecurity as a Information Security Analyst.",
    simpleSummary: "You will work as a Information Security Analyst in the Cybersecurity industry.",
    skills: ["Cybersecurity Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of Information Security Analyst.", procedure: ["Research Information Security Analyst fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice Cybersecurity skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your Information Security Analyst projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "Cloud Engineer": {
    description: "A rewarding career in Cloud Computing as a Cloud Engineer.",
    simpleSummary: "You will work as a Cloud Engineer in the Cloud Computing industry.",
    skills: ["Cloud Computing Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of Cloud Engineer.", procedure: ["Research Cloud Engineer fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice Cloud Computing skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your Cloud Engineer projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "Cloud Architect": {
    description: "A rewarding career in Cloud Computing as a Cloud Architect.",
    simpleSummary: "You will work as a Cloud Architect in the Cloud Computing industry.",
    skills: ["Cloud Computing Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of Cloud Architect.", procedure: ["Research Cloud Architect fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice Cloud Computing skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your Cloud Architect projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "AWS Engineer": {
    description: "A rewarding career in Cloud Computing as a AWS Engineer.",
    simpleSummary: "You will work as a AWS Engineer in the Cloud Computing industry.",
    skills: ["Cloud Computing Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of AWS Engineer.", procedure: ["Research AWS Engineer fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice Cloud Computing skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your AWS Engineer projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "Azure Engineer": {
    description: "A rewarding career in Cloud Computing as a Azure Engineer.",
    simpleSummary: "You will work as a Azure Engineer in the Cloud Computing industry.",
    skills: ["Cloud Computing Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of Azure Engineer.", procedure: ["Research Azure Engineer fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice Cloud Computing skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your Azure Engineer projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "Google Cloud Engineer": {
    description: "A rewarding career in Cloud Computing as a Google Cloud Engineer.",
    simpleSummary: "You will work as a Google Cloud Engineer in the Cloud Computing industry.",
    skills: ["Cloud Computing Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of Google Cloud Engineer.", procedure: ["Research Google Cloud Engineer fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice Cloud Computing skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your Google Cloud Engineer projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "Site Reliability Engineer (SRE)": {
    description: "A rewarding career in Cloud Computing as a Site Reliability Engineer (SRE).",
    simpleSummary: "You will work as a Site Reliability Engineer (SRE) in the Cloud Computing industry.",
    skills: ["Cloud Computing Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of Site Reliability Engineer (SRE).", procedure: ["Research Site Reliability Engineer (SRE) fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice Cloud Computing skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your Site Reliability Engineer (SRE) projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "Network Engineer": {
    description: "A rewarding career in Networking as a Network Engineer.",
    simpleSummary: "You will work as a Network Engineer in the Networking industry.",
    skills: ["Networking Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of Network Engineer.", procedure: ["Research Network Engineer fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice Networking skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your Network Engineer projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "Network Administrator": {
    description: "A rewarding career in Networking as a Network Administrator.",
    simpleSummary: "You will work as a Network Administrator in the Networking industry.",
    skills: ["Networking Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of Network Administrator.", procedure: ["Research Network Administrator fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice Networking skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your Network Administrator projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "System Administrator": {
    description: "A rewarding career in Networking as a System Administrator.",
    simpleSummary: "You will work as a System Administrator in the Networking industry.",
    skills: ["Networking Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of System Administrator.", procedure: ["Research System Administrator fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice Networking skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your System Administrator projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "Telecom Engineer": {
    description: "A rewarding career in Networking as a Telecom Engineer.",
    simpleSummary: "You will work as a Telecom Engineer in the Networking industry.",
    skills: ["Networking Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of Telecom Engineer.", procedure: ["Research Telecom Engineer fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice Networking skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your Telecom Engineer projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "UI Designer": {
    description: "A rewarding career in UI/UX & Design as a UI Designer.",
    simpleSummary: "You will work as a UI Designer in the UI/UX & Design industry.",
    skills: ["UI/UX and Design Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of UI Designer.", procedure: ["Research UI Designer fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice UI/UX and Design skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your UI Designer projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "UX Designer": {
    description: "A rewarding career in UI/UX & Design as a UX Designer.",
    simpleSummary: "You will work as a UX Designer in the UI/UX & Design industry.",
    skills: ["UI/UX and Design Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of UX Designer.", procedure: ["Research UX Designer fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice UI/UX and Design skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your UX Designer projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "Product Designer": {
    description: "A rewarding career in UI/UX & Design as a Product Designer.",
    simpleSummary: "You will work as a Product Designer in the UI/UX & Design industry.",
    skills: ["UI/UX and Design Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of Product Designer.", procedure: ["Research Product Designer fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice UI/UX and Design skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your Product Designer projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "Motion Graphics Designer": {
    description: "A rewarding career in UI/UX & Design as a Motion Graphics Designer.",
    simpleSummary: "You will work as a Motion Graphics Designer in the UI/UX & Design industry.",
    skills: ["UI/UX and Design Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of Motion Graphics Designer.", procedure: ["Research Motion Graphics Designer fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice UI/UX and Design skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your Motion Graphics Designer projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "Animator": {
    description: "A rewarding career in UI/UX & Design as a Animator.",
    simpleSummary: "You will work as a Animator in the UI/UX & Design industry.",
    skills: ["UI/UX and Design Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of Animator.", procedure: ["Research Animator fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice UI/UX and Design skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your Animator projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "Business Analyst": {
    description: "A rewarding career in Business & Management as a Business Analyst.",
    simpleSummary: "You will work as a Business Analyst in the Business & Management industry.",
    skills: ["Business and Management Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of Business Analyst.", procedure: ["Research Business Analyst fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice Business and Management skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your Business Analyst projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "Operations Manager": {
    description: "A rewarding career in Business & Management as a Operations Manager.",
    simpleSummary: "You will work as a Operations Manager in the Business & Management industry.",
    skills: ["Business and Management Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of Operations Manager.", procedure: ["Research Operations Manager fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice Business and Management skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your Operations Manager projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "HR Manager": {
    description: "A rewarding career in Business & Management as a HR Manager.",
    simpleSummary: "You will work as a HR Manager in the Business & Management industry.",
    skills: ["Business and Management Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of HR Manager.", procedure: ["Research HR Manager fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice Business and Management skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your HR Manager projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "Marketing Manager": {
    description: "A rewarding career in Business & Management as a Marketing Manager.",
    simpleSummary: "You will work as a Marketing Manager in the Business & Management industry.",
    skills: ["Business and Management Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of Marketing Manager.", procedure: ["Research Marketing Manager fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice Business and Management skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your Marketing Manager projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "Sales Manager": {
    description: "A rewarding career in Business & Management as a Sales Manager.",
    simpleSummary: "You will work as a Sales Manager in the Business & Management industry.",
    skills: ["Business and Management Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of Sales Manager.", procedure: ["Research Sales Manager fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice Business and Management skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your Sales Manager projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "Chartered Accountant": {
    description: "A rewarding career in Finance & Accounting as a Chartered Accountant.",
    simpleSummary: "You will work as a Chartered Accountant in the Finance & Accounting industry.",
    skills: ["Finance and Accounting Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of Chartered Accountant.", procedure: ["Research Chartered Accountant fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice Finance and Accounting skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your Chartered Accountant projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "Investment Banker": {
    description: "A rewarding career in Finance & Accounting as a Investment Banker.",
    simpleSummary: "You will work as a Investment Banker in the Finance & Accounting industry.",
    skills: ["Finance and Accounting Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of Investment Banker.", procedure: ["Research Investment Banker fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice Finance and Accounting skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your Investment Banker projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "Tax Consultant": {
    description: "A rewarding career in Finance & Accounting as a Tax Consultant.",
    simpleSummary: "You will work as a Tax Consultant in the Finance & Accounting industry.",
    skills: ["Finance and Accounting Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of Tax Consultant.", procedure: ["Research Tax Consultant fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice Finance and Accounting skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your Tax Consultant projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "Auditor": {
    description: "A rewarding career in Finance & Accounting as a Auditor.",
    simpleSummary: "You will work as a Auditor in the Finance & Accounting industry.",
    skills: ["Finance and Accounting Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of Auditor.", procedure: ["Research Auditor fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice Finance and Accounting skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your Auditor projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "Risk Analyst": {
    description: "A rewarding career in Finance & Accounting as a Risk Analyst.",
    simpleSummary: "You will work as a Risk Analyst in the Finance & Accounting industry.",
    skills: ["Finance and Accounting Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of Risk Analyst.", procedure: ["Research Risk Analyst fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice Finance and Accounting skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your Risk Analyst projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "Doctor": {
    description: "A rewarding career in Healthcare as a Doctor.",
    simpleSummary: "You will work as a Doctor in the Healthcare industry.",
    skills: ["Healthcare Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of Doctor.", procedure: ["Research Doctor fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice Healthcare skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your Doctor projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "Dentist": {
    description: "A rewarding career in Healthcare as a Dentist.",
    simpleSummary: "You will work as a Dentist in the Healthcare industry.",
    skills: ["Healthcare Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of Dentist.", procedure: ["Research Dentist fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice Healthcare skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your Dentist projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "Pharmacist": {
    description: "A rewarding career in Healthcare as a Pharmacist.",
    simpleSummary: "You will work as a Pharmacist in the Healthcare industry.",
    skills: ["Healthcare Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of Pharmacist.", procedure: ["Research Pharmacist fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice Healthcare skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your Pharmacist projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "Nurse": {
    description: "A rewarding career in Healthcare as a Nurse.",
    simpleSummary: "You will work as a Nurse in the Healthcare industry.",
    skills: ["Healthcare Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of Nurse.", procedure: ["Research Nurse fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice Healthcare skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your Nurse projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "Physiotherapist": {
    description: "A rewarding career in Healthcare as a Physiotherapist.",
    simpleSummary: "You will work as a Physiotherapist in the Healthcare industry.",
    skills: ["Healthcare Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of Physiotherapist.", procedure: ["Research Physiotherapist fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice Healthcare skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your Physiotherapist projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "Medical Lab Technician": {
    description: "A rewarding career in Healthcare as a Medical Lab Technician.",
    simpleSummary: "You will work as a Medical Lab Technician in the Healthcare industry.",
    skills: ["Healthcare Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of Medical Lab Technician.", procedure: ["Research Medical Lab Technician fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice Healthcare skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your Medical Lab Technician projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "Nutritionist": {
    description: "A rewarding career in Healthcare as a Nutritionist.",
    simpleSummary: "You will work as a Nutritionist in the Healthcare industry.",
    skills: ["Healthcare Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of Nutritionist.", procedure: ["Research Nutritionist fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice Healthcare skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your Nutritionist projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "Psychologist": {
    description: "A rewarding career in Healthcare as a Psychologist.",
    simpleSummary: "You will work as a Psychologist in the Healthcare industry.",
    skills: ["Healthcare Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of Psychologist.", procedure: ["Research Psychologist fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice Healthcare skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your Psychologist projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "Mechanical Engineer": {
    description: "A rewarding career in Engineering as a Mechanical Engineer.",
    simpleSummary: "You will work as a Mechanical Engineer in the Engineering industry.",
    skills: ["Engineering Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of Mechanical Engineer.", procedure: ["Research Mechanical Engineer fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice Engineering skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your Mechanical Engineer projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "Civil Engineer": {
    description: "A rewarding career in Engineering as a Civil Engineer.",
    simpleSummary: "You will work as a Civil Engineer in the Engineering industry.",
    skills: ["Engineering Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of Civil Engineer.", procedure: ["Research Civil Engineer fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice Engineering skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your Civil Engineer projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "Electrical Engineer": {
    description: "A rewarding career in Engineering as a Electrical Engineer.",
    simpleSummary: "You will work as a Electrical Engineer in the Engineering industry.",
    skills: ["Engineering Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of Electrical Engineer.", procedure: ["Research Electrical Engineer fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice Engineering skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your Electrical Engineer projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "Electronics Engineer": {
    description: "A rewarding career in Engineering as a Electronics Engineer.",
    simpleSummary: "You will work as a Electronics Engineer in the Engineering industry.",
    skills: ["Engineering Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of Electronics Engineer.", procedure: ["Research Electronics Engineer fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice Engineering skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your Electronics Engineer projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "Aerospace Engineer": {
    description: "A rewarding career in Engineering as a Aerospace Engineer.",
    simpleSummary: "You will work as a Aerospace Engineer in the Engineering industry.",
    skills: ["Engineering Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of Aerospace Engineer.", procedure: ["Research Aerospace Engineer fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice Engineering skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your Aerospace Engineer projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "Automobile Engineer": {
    description: "A rewarding career in Engineering as a Automobile Engineer.",
    simpleSummary: "You will work as a Automobile Engineer in the Engineering industry.",
    skills: ["Engineering Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of Automobile Engineer.", procedure: ["Research Automobile Engineer fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice Engineering skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your Automobile Engineer projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "Chemical Engineer": {
    description: "A rewarding career in Engineering as a Chemical Engineer.",
    simpleSummary: "You will work as a Chemical Engineer in the Engineering industry.",
    skills: ["Engineering Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of Chemical Engineer.", procedure: ["Research Chemical Engineer fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice Engineering skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your Chemical Engineer projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "Petroleum Engineer": {
    description: "A rewarding career in Engineering as a Petroleum Engineer.",
    simpleSummary: "You will work as a Petroleum Engineer in the Engineering industry.",
    skills: ["Engineering Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of Petroleum Engineer.", procedure: ["Research Petroleum Engineer fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice Engineering skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your Petroleum Engineer projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "IAS": {
    description: "A rewarding career in Government Jobs as a IAS.",
    simpleSummary: "You will work as a IAS in the Government Jobs industry.",
    skills: ["Government Jobs Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of IAS.", procedure: ["Research IAS fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice Government Jobs skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your IAS projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "IPS": {
    description: "A rewarding career in Government Jobs as a IPS.",
    simpleSummary: "You will work as a IPS in the Government Jobs industry.",
    skills: ["Government Jobs Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of IPS.", procedure: ["Research IPS fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice Government Jobs skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your IPS projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "IFS": {
    description: "A rewarding career in Government Jobs as a IFS.",
    simpleSummary: "You will work as a IFS in the Government Jobs industry.",
    skills: ["Government Jobs Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of IFS.", procedure: ["Research IFS fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice Government Jobs skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your IFS projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "SSC Officer": {
    description: "A rewarding career in Government Jobs as a SSC Officer.",
    simpleSummary: "You will work as a SSC Officer in the Government Jobs industry.",
    skills: ["Government Jobs Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of SSC Officer.", procedure: ["Research SSC Officer fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice Government Jobs skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your SSC Officer projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "Banking Officer": {
    description: "A rewarding career in Government Jobs as a Banking Officer.",
    simpleSummary: "You will work as a Banking Officer in the Government Jobs industry.",
    skills: ["Government Jobs Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of Banking Officer.", procedure: ["Research Banking Officer fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice Government Jobs skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your Banking Officer projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "Railway Officer": {
    description: "A rewarding career in Government Jobs as a Railway Officer.",
    simpleSummary: "You will work as a Railway Officer in the Government Jobs industry.",
    skills: ["Government Jobs Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of Railway Officer.", procedure: ["Research Railway Officer fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice Government Jobs skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your Railway Officer projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "Defence Officer": {
    description: "A rewarding career in Government Jobs as a Defence Officer.",
    simpleSummary: "You will work as a Defence Officer in the Government Jobs industry.",
    skills: ["Government Jobs Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of Defence Officer.", procedure: ["Research Defence Officer fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice Government Jobs skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your Defence Officer projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "Police Officer": {
    description: "A rewarding career in Government Jobs as a Police Officer.",
    simpleSummary: "You will work as a Police Officer in the Government Jobs industry.",
    skills: ["Government Jobs Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of Police Officer.", procedure: ["Research Police Officer fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice Government Jobs skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your Police Officer projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "Postal Officer": {
    description: "A rewarding career in Government Jobs as a Postal Officer.",
    simpleSummary: "You will work as a Postal Officer in the Government Jobs industry.",
    skills: ["Government Jobs Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of Postal Officer.", procedure: ["Research Postal Officer fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice Government Jobs skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your Postal Officer projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "Professor": {
    description: "A rewarding career in Research & Education as a Professor.",
    simpleSummary: "You will work as a Professor in the Research & Education industry.",
    skills: ["Research and Education Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of Professor.", procedure: ["Research Professor fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice Research and Education skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your Professor projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "Lecturer": {
    description: "A rewarding career in Research & Education as a Lecturer.",
    simpleSummary: "You will work as a Lecturer in the Research & Education industry.",
    skills: ["Research and Education Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of Lecturer.", procedure: ["Research Lecturer fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice Research and Education skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your Lecturer projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "Research Scientist": {
    description: "A rewarding career in Research & Education as a Research Scientist.",
    simpleSummary: "You will work as a Research Scientist in the Research & Education industry.",
    skills: ["Research and Education Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of Research Scientist.", procedure: ["Research Research Scientist fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice Research and Education skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your Research Scientist projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "School Teacher": {
    description: "A rewarding career in Research & Education as a School Teacher.",
    simpleSummary: "You will work as a School Teacher in the Research & Education industry.",
    skills: ["Research and Education Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of School Teacher.", procedure: ["Research School Teacher fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice Research and Education skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your School Teacher projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "Educational Consultant": {
    description: "A rewarding career in Research & Education as a Educational Consultant.",
    simpleSummary: "You will work as a Educational Consultant in the Research & Education industry.",
    skills: ["Research and Education Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of Educational Consultant.", procedure: ["Research Educational Consultant fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice Research and Education skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your Educational Consultant projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "Lawyer": {
    description: "A rewarding career in Law as a Lawyer.",
    simpleSummary: "You will work as a Lawyer in the Law industry.",
    skills: ["Law Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of Lawyer.", procedure: ["Research Lawyer fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice Law skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your Lawyer projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "Judge": {
    description: "A rewarding career in Law as a Judge.",
    simpleSummary: "You will work as a Judge in the Law industry.",
    skills: ["Law Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of Judge.", procedure: ["Research Judge fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice Law skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your Judge projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "Legal Advisor": {
    description: "A rewarding career in Law as a Legal Advisor.",
    simpleSummary: "You will work as a Legal Advisor in the Law industry.",
    skills: ["Law Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of Legal Advisor.", procedure: ["Research Legal Advisor fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice Law skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your Legal Advisor projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "Corporate Lawyer": {
    description: "A rewarding career in Law as a Corporate Lawyer.",
    simpleSummary: "You will work as a Corporate Lawyer in the Law industry.",
    skills: ["Law Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of Corporate Lawyer.", procedure: ["Research Corporate Lawyer fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice Law skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your Corporate Lawyer projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "Public Prosecutor": {
    description: "A rewarding career in Law as a Public Prosecutor.",
    simpleSummary: "You will work as a Public Prosecutor in the Law industry.",
    skills: ["Law Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of Public Prosecutor.", procedure: ["Research Public Prosecutor fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice Law skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your Public Prosecutor projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "SEO Specialist": {
    description: "A rewarding career in Digital Marketing as a SEO Specialist.",
    simpleSummary: "You will work as a SEO Specialist in the Digital Marketing industry.",
    skills: ["Digital Marketing Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of SEO Specialist.", procedure: ["Research SEO Specialist fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice Digital Marketing skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your SEO Specialist projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "SEM Specialist": {
    description: "A rewarding career in Digital Marketing as a SEM Specialist.",
    simpleSummary: "You will work as a SEM Specialist in the Digital Marketing industry.",
    skills: ["Digital Marketing Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of SEM Specialist.", procedure: ["Research SEM Specialist fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice Digital Marketing skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your SEM Specialist projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "Social Media Manager": {
    description: "A rewarding career in Digital Marketing as a Social Media Manager.",
    simpleSummary: "You will work as a Social Media Manager in the Digital Marketing industry.",
    skills: ["Digital Marketing Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of Social Media Manager.", procedure: ["Research Social Media Manager fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice Digital Marketing skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your Social Media Manager projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "Content Strategist": {
    description: "A rewarding career in Digital Marketing as a Content Strategist.",
    simpleSummary: "You will work as a Content Strategist in the Digital Marketing industry.",
    skills: ["Digital Marketing Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of Content Strategist.", procedure: ["Research Content Strategist fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice Digital Marketing skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your Content Strategist projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "Brand Manager": {
    description: "A rewarding career in Digital Marketing as a Brand Manager.",
    simpleSummary: "You will work as a Brand Manager in the Digital Marketing industry.",
    skills: ["Digital Marketing Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of Brand Manager.", procedure: ["Research Brand Manager fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice Digital Marketing skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your Brand Manager projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "Email Marketing Specialist": {
    description: "A rewarding career in Digital Marketing as a Email Marketing Specialist.",
    simpleSummary: "You will work as a Email Marketing Specialist in the Digital Marketing industry.",
    skills: ["Digital Marketing Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of Email Marketing Specialist.", procedure: ["Research Email Marketing Specialist fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice Digital Marketing skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your Email Marketing Specialist projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "Content Writer": {
    description: "A rewarding career in Content & Media as a Content Writer.",
    simpleSummary: "You will work as a Content Writer in the Content & Media industry.",
    skills: ["Content and Media Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of Content Writer.", procedure: ["Research Content Writer fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice Content and Media skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your Content Writer projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "Technical Writer": {
    description: "A rewarding career in Content & Media as a Technical Writer.",
    simpleSummary: "You will work as a Technical Writer in the Content & Media industry.",
    skills: ["Content and Media Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of Technical Writer.", procedure: ["Research Technical Writer fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice Content and Media skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your Technical Writer projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "Copywriter": {
    description: "A rewarding career in Content & Media as a Copywriter.",
    simpleSummary: "You will work as a Copywriter in the Content & Media industry.",
    skills: ["Content and Media Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of Copywriter.", procedure: ["Research Copywriter fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice Content and Media skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your Copywriter projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "Journalist": {
    description: "A rewarding career in Content & Media as a Journalist.",
    simpleSummary: "You will work as a Journalist in the Content & Media industry.",
    skills: ["Content and Media Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of Journalist.", procedure: ["Research Journalist fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice Content and Media skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your Journalist projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "News Anchor": {
    description: "A rewarding career in Content & Media as a News Anchor.",
    simpleSummary: "You will work as a News Anchor in the Content & Media industry.",
    skills: ["Content and Media Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of News Anchor.", procedure: ["Research News Anchor fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice Content and Media skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your News Anchor projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "Video Editor": {
    description: "A rewarding career in Content & Media as a Video Editor.",
    simpleSummary: "You will work as a Video Editor in the Content & Media industry.",
    skills: ["Content and Media Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of Video Editor.", procedure: ["Research Video Editor fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice Content and Media skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your Video Editor projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "Photographer": {
    description: "A rewarding career in Content & Media as a Photographer.",
    simpleSummary: "You will work as a Photographer in the Content & Media industry.",
    skills: ["Content and Media Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of Photographer.", procedure: ["Research Photographer fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice Content and Media skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your Photographer projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "Cinematographer": {
    description: "A rewarding career in Content & Media as a Cinematographer.",
    simpleSummary: "You will work as a Cinematographer in the Content & Media industry.",
    skills: ["Content and Media Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of Cinematographer.", procedure: ["Research Cinematographer fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice Content and Media skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your Cinematographer projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "Startup Founder": {
    description: "A rewarding career in Entrepreneurship as a Startup Founder.",
    simpleSummary: "You will work as a Startup Founder in the Entrepreneurship industry.",
    skills: ["Entrepreneurship Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of Startup Founder.", procedure: ["Research Startup Founder fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice Entrepreneurship skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your Startup Founder projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "Business Owner": {
    description: "A rewarding career in Entrepreneurship as a Business Owner.",
    simpleSummary: "You will work as a Business Owner in the Entrepreneurship industry.",
    skills: ["Entrepreneurship Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of Business Owner.", procedure: ["Research Business Owner fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice Entrepreneurship skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your Business Owner projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "Franchise Owner": {
    description: "A rewarding career in Entrepreneurship as a Franchise Owner.",
    simpleSummary: "You will work as a Franchise Owner in the Entrepreneurship industry.",
    skills: ["Entrepreneurship Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of Franchise Owner.", procedure: ["Research Franchise Owner fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice Entrepreneurship skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your Franchise Owner projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "E-commerce Seller": {
    description: "A rewarding career in Entrepreneurship as a E-commerce Seller.",
    simpleSummary: "You will work as a E-commerce Seller in the Entrepreneurship industry.",
    skills: ["Entrepreneurship Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of E-commerce Seller.", procedure: ["Research E-commerce Seller fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice Entrepreneurship skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your E-commerce Seller projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "Musician": {
    description: "A rewarding career in Creative Arts as a Musician.",
    simpleSummary: "You will work as a Musician in the Creative Arts industry.",
    skills: ["Creative Arts Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of Musician.", procedure: ["Research Musician fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice Creative Arts skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your Musician projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "Singer": {
    description: "A rewarding career in Creative Arts as a Singer.",
    simpleSummary: "You will work as a Singer in the Creative Arts industry.",
    skills: ["Creative Arts Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of Singer.", procedure: ["Research Singer fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice Creative Arts skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your Singer projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "Actor": {
    description: "A rewarding career in Creative Arts as a Actor.",
    simpleSummary: "You will work as a Actor in the Creative Arts industry.",
    skills: ["Creative Arts Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of Actor.", procedure: ["Research Actor fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice Creative Arts skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your Actor projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "Dancer": {
    description: "A rewarding career in Creative Arts as a Dancer.",
    simpleSummary: "You will work as a Dancer in the Creative Arts industry.",
    skills: ["Creative Arts Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of Dancer.", procedure: ["Research Dancer fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice Creative Arts skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your Dancer projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "Fashion Designer": {
    description: "A rewarding career in Creative Arts as a Fashion Designer.",
    simpleSummary: "You will work as a Fashion Designer in the Creative Arts industry.",
    skills: ["Creative Arts Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of Fashion Designer.", procedure: ["Research Fashion Designer fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice Creative Arts skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your Fashion Designer projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "Interior Designer": {
    description: "A rewarding career in Creative Arts as a Interior Designer.",
    simpleSummary: "You will work as a Interior Designer in the Creative Arts industry.",
    skills: ["Creative Arts Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of Interior Designer.", procedure: ["Research Interior Designer fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice Creative Arts skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your Interior Designer projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "Agricultural Scientist": {
    description: "A rewarding career in Agriculture & Environment as a Agricultural Scientist.",
    simpleSummary: "You will work as a Agricultural Scientist in the Agriculture & Environment industry.",
    skills: ["Agriculture and Environment Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of Agricultural Scientist.", procedure: ["Research Agricultural Scientist fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice Agriculture and Environment skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your Agricultural Scientist projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "Agronomist": {
    description: "A rewarding career in Agriculture & Environment as a Agronomist.",
    simpleSummary: "You will work as a Agronomist in the Agriculture & Environment industry.",
    skills: ["Agriculture and Environment Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of Agronomist.", procedure: ["Research Agronomist fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice Agriculture and Environment skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your Agronomist projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "Environmental Engineer": {
    description: "A rewarding career in Agriculture & Environment as a Environmental Engineer.",
    simpleSummary: "You will work as a Environmental Engineer in the Agriculture & Environment industry.",
    skills: ["Agriculture and Environment Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of Environmental Engineer.", procedure: ["Research Environmental Engineer fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice Agriculture and Environment skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your Environmental Engineer projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "Forestry Officer": {
    description: "A rewarding career in Agriculture & Environment as a Forestry Officer.",
    simpleSummary: "You will work as a Forestry Officer in the Agriculture & Environment industry.",
    skills: ["Agriculture and Environment Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of Forestry Officer.", procedure: ["Research Forestry Officer fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice Agriculture and Environment skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your Forestry Officer projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "Wildlife Biologist": {
    description: "A rewarding career in Agriculture & Environment as a Wildlife Biologist.",
    simpleSummary: "You will work as a Wildlife Biologist in the Agriculture & Environment industry.",
    skills: ["Agriculture and Environment Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of Wildlife Biologist.", procedure: ["Research Wildlife Biologist fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice Agriculture and Environment skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your Wildlife Biologist projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "Hotel Manager": {
    description: "A rewarding career in Hospitality & Tourism as a Hotel Manager.",
    simpleSummary: "You will work as a Hotel Manager in the Hospitality & Tourism industry.",
    skills: ["Hospitality and Tourism Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of Hotel Manager.", procedure: ["Research Hotel Manager fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice Hospitality and Tourism skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your Hotel Manager projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "Chef": {
    description: "A rewarding career in Hospitality & Tourism as a Chef.",
    simpleSummary: "You will work as a Chef in the Hospitality & Tourism industry.",
    skills: ["Hospitality and Tourism Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of Chef.", procedure: ["Research Chef fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice Hospitality and Tourism skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your Chef projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "Event Manager": {
    description: "A rewarding career in Hospitality & Tourism as a Event Manager.",
    simpleSummary: "You will work as a Event Manager in the Hospitality & Tourism industry.",
    skills: ["Hospitality and Tourism Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of Event Manager.", procedure: ["Research Event Manager fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice Hospitality and Tourism skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your Event Manager projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "Travel Consultant": {
    description: "A rewarding career in Hospitality & Tourism as a Travel Consultant.",
    simpleSummary: "You will work as a Travel Consultant in the Hospitality & Tourism industry.",
    skills: ["Hospitality and Tourism Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of Travel Consultant.", procedure: ["Research Travel Consultant fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice Hospitality and Tourism skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your Travel Consultant projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "Airline Cabin Crew": {
    description: "A rewarding career in Hospitality & Tourism as a Airline Cabin Crew.",
    simpleSummary: "You will work as a Airline Cabin Crew in the Hospitality & Tourism industry.",
    skills: ["Hospitality and Tourism Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of Airline Cabin Crew.", procedure: ["Research Airline Cabin Crew fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice Hospitality and Tourism skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your Airline Cabin Crew projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "Athlete": {
    description: "A rewarding career in Sports & Fitness as a Athlete.",
    simpleSummary: "You will work as a Athlete in the Sports & Fitness industry.",
    skills: ["Sports and Fitness Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of Athlete.", procedure: ["Research Athlete fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice Sports and Fitness skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your Athlete projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "Fitness Trainer": {
    description: "A rewarding career in Sports & Fitness as a Fitness Trainer.",
    simpleSummary: "You will work as a Fitness Trainer in the Sports & Fitness industry.",
    skills: ["Sports and Fitness Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of Fitness Trainer.", procedure: ["Research Fitness Trainer fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice Sports and Fitness skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your Fitness Trainer projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "Sports Coach": {
    description: "A rewarding career in Sports & Fitness as a Sports Coach.",
    simpleSummary: "You will work as a Sports Coach in the Sports & Fitness industry.",
    skills: ["Sports and Fitness Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of Sports Coach.", procedure: ["Research Sports Coach fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice Sports and Fitness skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your Sports Coach projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "Sports Nutritionist": {
    description: "A rewarding career in Sports & Fitness as a Sports Nutritionist.",
    simpleSummary: "You will work as a Sports Nutritionist in the Sports & Fitness industry.",
    skills: ["Sports and Fitness Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of Sports Nutritionist.", procedure: ["Research Sports Nutritionist fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice Sports and Fitness skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your Sports Nutritionist projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "Sports Psychologist": {
    description: "A rewarding career in Sports & Fitness as a Sports Psychologist.",
    simpleSummary: "You will work as a Sports Psychologist in the Sports & Fitness industry.",
    skills: ["Sports and Fitness Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of Sports Psychologist.", procedure: ["Research Sports Psychologist fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice Sports and Fitness skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your Sports Psychologist projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "Quantum Computing Engineer": {
    description: "A rewarding career in Emerging Technologies as a Quantum Computing Engineer.",
    simpleSummary: "You will work as a Quantum Computing Engineer in the Emerging Technologies industry.",
    skills: ["Emerging Technologies Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of Quantum Computing Engineer.", procedure: ["Research Quantum Computing Engineer fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice Emerging Technologies skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your Quantum Computing Engineer projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "IoT Engineer": {
    description: "A rewarding career in Emerging Technologies as a IoT Engineer.",
    simpleSummary: "You will work as a IoT Engineer in the Emerging Technologies industry.",
    skills: ["Emerging Technologies Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of IoT Engineer.", procedure: ["Research IoT Engineer fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice Emerging Technologies skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your IoT Engineer projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "Edge Computing Engineer": {
    description: "A rewarding career in Emerging Technologies as a Edge Computing Engineer.",
    simpleSummary: "You will work as a Edge Computing Engineer in the Emerging Technologies industry.",
    skills: ["Emerging Technologies Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of Edge Computing Engineer.", procedure: ["Research Edge Computing Engineer fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice Emerging Technologies skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your Edge Computing Engineer projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "Web3 Developer": {
    description: "A rewarding career in Emerging Technologies as a Web3 Developer.",
    simpleSummary: "You will work as a Web3 Developer in the Emerging Technologies industry.",
    skills: ["Emerging Technologies Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of Web3 Developer.", procedure: ["Research Web3 Developer fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice Emerging Technologies skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your Web3 Developer projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "AI Product Manager": {
    description: "A rewarding career in Emerging Technologies as a AI Product Manager.",
    simpleSummary: "You will work as a AI Product Manager in the Emerging Technologies industry.",
    skills: ["Emerging Technologies Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of AI Product Manager.", procedure: ["Research AI Product Manager fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice Emerging Technologies skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your AI Product Manager projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },
  "AI Research Scientist": {
    description: "A rewarding career in Emerging Technologies as a AI Research Scientist.",
    simpleSummary: "You will work as a AI Research Scientist in the Emerging Technologies industry.",
    skills: ["Emerging Technologies Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of AI Research Scientist.", procedure: ["Research AI Research Scientist fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice Emerging Technologies skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your AI Research Scientist projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
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

  "Full Stack Developer": ["full stack developer", "software", "development"],
  "Frontend Developer": ["frontend developer", "software", "development"],
  "Backend Developer": ["backend developer", "software", "development"],
  "Mobile App Developer": ["mobile app developer", "software", "development"],
  "Game Developer": ["game developer", "software", "development"],
  "Software Engineer": ["software engineer", "software", "development"],
  "DevOps Engineer": ["devops engineer", "software", "development"],
  "Embedded Systems Engineer": ["embedded systems engineer", "software", "development"],
  "Blockchain Developer": ["blockchain developer", "software", "development"],
  "AR/VR Developer": ["ar/vr developer", "software", "development"],
  "AI Engineer": ["ai engineer", "artificial", "intelligence", "data", "science"],
  "Machine Learning Engineer": ["machine learning engineer", "artificial", "intelligence", "data", "science"],
  "Deep Learning Engineer": ["deep learning engineer", "artificial", "intelligence", "data", "science"],
  "Data Scientist": ["data scientist", "artificial", "intelligence", "data", "science"],
  "Business Intelligence Analyst": ["business intelligence analyst", "artificial", "intelligence", "data", "science"],
  "NLP Engineer": ["nlp engineer", "artificial", "intelligence", "data", "science"],
  "Computer Vision Engineer": ["computer vision engineer", "artificial", "intelligence", "data", "science"],
  "Robotics Engineer": ["robotics engineer", "artificial", "intelligence", "data", "science"],
  "Prompt Engineer": ["prompt engineer", "artificial", "intelligence", "data", "science"],
  "Ethical Hacker": ["ethical hacker", "cybersecurity"],
  "Penetration Tester": ["penetration tester", "cybersecurity"],
  "SOC Analyst": ["soc analyst", "cybersecurity"],
  "Security Engineer": ["security engineer", "cybersecurity"],
  "Digital Forensics Expert": ["digital forensics expert", "cybersecurity"],
  "Cloud Security Engineer": ["cloud security engineer", "cybersecurity"],
  "Information Security Analyst": ["information security analyst", "cybersecurity"],
  "Cloud Engineer": ["cloud engineer", "cloud", "computing"],
  "Cloud Architect": ["cloud architect", "cloud", "computing"],
  "AWS Engineer": ["aws engineer", "cloud", "computing"],
  "Azure Engineer": ["azure engineer", "cloud", "computing"],
  "Google Cloud Engineer": ["google cloud engineer", "cloud", "computing"],
  "Site Reliability Engineer (SRE)": ["site reliability engineer (sre)", "cloud", "computing"],
  "Network Engineer": ["network engineer", "networking"],
  "Network Administrator": ["network administrator", "networking"],
  "System Administrator": ["system administrator", "networking"],
  "Telecom Engineer": ["telecom engineer", "networking"],
  "UI Designer": ["ui designer", "design"],
  "UX Designer": ["ux designer", "design"],
  "Product Designer": ["product designer", "design"],
  "Motion Graphics Designer": ["motion graphics designer", "design"],
  "Animator": ["animator", "design"],
  "Business Analyst": ["business analyst", "business", "management"],
  "Operations Manager": ["operations manager", "business", "management"],
  "HR Manager": ["hr manager", "business", "management"],
  "Marketing Manager": ["marketing manager", "business", "management"],
  "Sales Manager": ["sales manager", "business", "management"],
  "Chartered Accountant": ["chartered accountant", "finance", "accounting"],
  "Investment Banker": ["investment banker", "finance", "accounting"],
  "Tax Consultant": ["tax consultant", "finance", "accounting"],
  "Auditor": ["auditor", "finance", "accounting"],
  "Risk Analyst": ["risk analyst", "finance", "accounting"],
  "Doctor": ["doctor", "healthcare"],
  "Dentist": ["dentist", "healthcare"],
  "Pharmacist": ["pharmacist", "healthcare"],
  "Nurse": ["nurse", "healthcare"],
  "Physiotherapist": ["physiotherapist", "healthcare"],
  "Medical Lab Technician": ["medical lab technician", "healthcare"],
  "Nutritionist": ["nutritionist", "healthcare"],
  "Psychologist": ["psychologist", "healthcare"],
  "Mechanical Engineer": ["mechanical engineer", "engineering"],
  "Civil Engineer": ["civil engineer", "engineering"],
  "Electrical Engineer": ["electrical engineer", "engineering"],
  "Electronics Engineer": ["electronics engineer", "engineering"],
  "Aerospace Engineer": ["aerospace engineer", "engineering"],
  "Automobile Engineer": ["automobile engineer", "engineering"],
  "Chemical Engineer": ["chemical engineer", "engineering"],
  "Petroleum Engineer": ["petroleum engineer", "engineering"],
  "IAS": ["ias", "government", "jobs"],
  "IPS": ["ips", "government", "jobs"],
  "IFS": ["ifs", "government", "jobs"],
  "SSC Officer": ["ssc officer", "government", "jobs"],
  "Banking Officer": ["banking officer", "government", "jobs"],
  "Railway Officer": ["railway officer", "government", "jobs"],
  "Defence Officer": ["defence officer", "government", "jobs"],
  "Police Officer": ["police officer", "government", "jobs"],
  "Postal Officer": ["postal officer", "government", "jobs"],
  "Professor": ["professor", "research", "education"],
  "Lecturer": ["lecturer", "research", "education"],
  "Research Scientist": ["research scientist", "research", "education"],
  "School Teacher": ["school teacher", "research", "education"],
  "Educational Consultant": ["educational consultant", "research", "education"],
  "Lawyer": ["lawyer", ""],
  "Judge": ["judge", ""],
  "Legal Advisor": ["legal advisor", ""],
  "Corporate Lawyer": ["corporate lawyer", ""],
  "Public Prosecutor": ["public prosecutor", ""],
  "SEO Specialist": ["seo specialist", "digital", "marketing"],
  "SEM Specialist": ["sem specialist", "digital", "marketing"],
  "Social Media Manager": ["social media manager", "digital", "marketing"],
  "Content Strategist": ["content strategist", "digital", "marketing"],
  "Brand Manager": ["brand manager", "digital", "marketing"],
  "Email Marketing Specialist": ["email marketing specialist", "digital", "marketing"],
  "Content Writer": ["content writer", "content", "media"],
  "Technical Writer": ["technical writer", "content", "media"],
  "Copywriter": ["copywriter", "content", "media"],
  "Journalist": ["journalist", "content", "media"],
  "News Anchor": ["news anchor", "content", "media"],
  "Video Editor": ["video editor", "content", "media"],
  "Photographer": ["photographer", "content", "media"],
  "Cinematographer": ["cinematographer", "content", "media"],
  "Startup Founder": ["startup founder", "entrepreneurship"],
  "Business Owner": ["business owner", "entrepreneurship"],
  "Franchise Owner": ["franchise owner", "entrepreneurship"],
  "E-commerce Seller": ["e-commerce seller", "entrepreneurship"],
  "Musician": ["musician", "creative", "arts"],
  "Singer": ["singer", "creative", "arts"],
  "Actor": ["actor", "creative", "arts"],
  "Dancer": ["dancer", "creative", "arts"],
  "Fashion Designer": ["fashion designer", "creative", "arts"],
  "Interior Designer": ["interior designer", "creative", "arts"],
  "Agricultural Scientist": ["agricultural scientist", "agriculture", "environment"],
  "Agronomist": ["agronomist", "agriculture", "environment"],
  "Environmental Engineer": ["environmental engineer", "agriculture", "environment"],
  "Forestry Officer": ["forestry officer", "agriculture", "environment"],
  "Wildlife Biologist": ["wildlife biologist", "agriculture", "environment"],
  "Hotel Manager": ["hotel manager", "hospitality", "tourism"],
  "Chef": ["chef", "hospitality", "tourism"],
  "Event Manager": ["event manager", "hospitality", "tourism"],
  "Travel Consultant": ["travel consultant", "hospitality", "tourism"],
  "Airline Cabin Crew": ["airline cabin crew", "hospitality", "tourism"],
  "Athlete": ["athlete", "sports", "fitness"],
  "Fitness Trainer": ["fitness trainer", "sports", "fitness"],
  "Sports Coach": ["sports coach", "sports", "fitness"],
  "Sports Nutritionist": ["sports nutritionist", "sports", "fitness"],
  "Sports Psychologist": ["sports psychologist", "sports", "fitness"],
  "Quantum Computing Engineer": ["quantum computing engineer", "emerging", "technologies"],
  "IoT Engineer": ["iot engineer", "emerging", "technologies"],
  "Edge Computing Engineer": ["edge computing engineer", "emerging", "technologies"],
  "Web3 Developer": ["web3 developer", "emerging", "technologies"],
  "AI Product Manager": ["ai product manager", "emerging", "technologies"],
  "AI Research Scientist": ["ai research scientist", "emerging", "technologies"],
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

export function getCategorizedCareers(): Record<string, { title: string; description: string }[]> {
  const categories: Record<string, { title: string; description: string }[]> = {};
  
  const manualMap: Record<string, string> = {
    'Software Developer': 'Software & Development',
    'Data Analyst': 'Artificial Intelligence & Data Science',
    'UX/UI Designer': 'UI/UX & Design',
    'Digital Marketer': 'Digital Marketing',
    'Product Manager': 'Business & Management',
    'Content Writer / Creator': 'Content & Media',
    'Cybersecurity Analyst': 'Cybersecurity',
    'Healthcare / Allied Health': 'Healthcare',
    'Teacher / Educator': 'Research & Education',
    'Graphic Designer': 'UI/UX & Design',
    'Financial Analyst': 'Finance & Accounting',
    'Project Manager': 'Business & Management',
    'Human Resources Specialist': 'Business & Management'
  };

  for (const [title, data] of Object.entries(CAREER_DATABASE)) {
    let category = 'Other';
    if (manualMap[title]) {
      category = manualMap[title];
    } else {
      const match = data.description.match(/A rewarding career in (.*?) as a/);
      if (match && match[1]) {
        category = match[1];
      }
    }
    
    if (!categories[category]) {
      categories[category] = [];
    }
    categories[category].push({ title, description: data.description });
  }
  
  return categories;
}
