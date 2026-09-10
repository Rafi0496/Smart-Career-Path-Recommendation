import { NextResponse } from "next/server";

export const maxDuration = 45;

const SKILLS_DICTIONARY = [
  "JavaScript", "TypeScript", "Python", "Java", "C++", "C#", "C", "Go", "Rust", "PHP", "Ruby", "Swift", "Kotlin", "SQL", "HTML", "CSS",
  "React", "React Native", "Next.js", "Vue", "Angular", "Node.js", "Express", "Django", "FastAPI", "Flask", "Spring Boot", "Tailwind CSS", "Redux", "GraphQL", "REST API",
  "Machine Learning", "Deep Learning", "Artificial Intelligence", "NLP", "Computer Vision", "TensorFlow", "PyTorch", "scikit-learn", "Pandas", "NumPy", "OpenCV", "LLM", "Data Analysis", "Power BI", "Tableau",
  "AWS", "Azure", "Google Cloud", "Docker", "Kubernetes", "Git", "GitHub", "CI/CD", "Linux", "Terraform",
  "PostgreSQL", "MySQL", "MongoDB", "SQLite", "Redis", "Firebase", "Supabase",
  "Cybersecurity", "Network Security", "Ethical Hacking", "Cryptography",
  "Figma", "UI/UX", "System Design", "Agile", "Scrum",
  "Problem Solving", "Leadership", "Communication", "Teamwork", "Analytical Skills", "Critical Thinking"
];

const EDUCATION_LEVELS = [
  { level: "Postgraduate", keywords: ["master", "m.tech", "mtech", "ms", "mba", "mca", "m.sc", "msc", "phd", "doctorate"] },
  { level: "Undergraduate", keywords: ["bachelor", "b.tech", "btech", "b.e", "be", "bs", "bca", "b.sc", "bsc", "bba", "b.com", "undergraduate", "degree"] },
  { level: "High School", keywords: ["high school", "secondary school", "higher secondary", "12th", "10th", "intermediate", "diploma"] },
];

const STREAMS = [
  { stream: "Computer Science & Engineering", keywords: ["computer science", "cse", "software engineering", "information technology", "it", "computing"] },
  { stream: "Data Science & AI", keywords: ["data science", "artificial intelligence", "ai & ml", "machine learning", "data analytics"] },
  { stream: "Electronics & Communication", keywords: ["electronics", "communication", "ece", "electrical", "eee"] },
  { stream: "Mechanical & Robotics", keywords: ["mechanical", "robotics", "automotive", "mechatronics"] },
  { stream: "Business & Management", keywords: ["business", "management", "finance", "marketing", "commerce", "accounting", "economics"] },
  { stream: "Health & Sciences", keywords: ["biology", "biotechnology", "medicine", "pharmacy", "health"] },
  { stream: "Design & Arts", keywords: ["design", "multimedia", "digital media", "fine arts", "graphic"] },
];

/** Extract raw text from PDF buffer using pdf-parse */
async function extractTextFromPdf(buffer: ArrayBuffer): Promise<string> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { PDFParse } = require("pdf-parse");
    const parser = new PDFParse(new Uint8Array(buffer));
    const result = await parser.getText();
    return result?.text || "";
  } catch (err) {
    console.warn("pdf-parse extraction warning:", err);
    // Fallback: extract visible text streams with regex
    const str = Buffer.from(buffer).toString("latin1");
    const matches = str.match(/\(([^)]+)\)\s*Tj/g);
    if (matches) {
      return matches.map((m) => m.replace(/^\(|\)\s*Tj$/g, "")).join(" ");
    }
    return "";
  }
}

/** Deterministic Regex & NLP parsing fallback */
function extractProfileFromText(text: string) {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);

  // 1. Detect Email
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const email = emailMatch ? emailMatch[0] : "";

  // 2. Detect Name
  let name = "";
  for (const line of lines.slice(0, 8)) {
    const cleaned = line.replace(/[^a-zA-Z\s]/g, "").trim();
    if (cleaned.length >= 3 && cleaned.length <= 35 && !line.includes("@") && !/resume|curriculum|vitae|contact|phone/i.test(cleaned)) {
      name = cleaned;
      break;
    }
  }

  // 3. Detect Education Level
  const lowerText = text.toLowerCase();
  let educationLevel = "Undergraduate";
  for (const edu of EDUCATION_LEVELS) {
    if (edu.keywords.some((k) => lowerText.includes(k))) {
      educationLevel = edu.level;
      break;
    }
  }

  // 4. Detect Stream / Major
  let streamOrField = "Computer Science & Engineering";
  for (const st of STREAMS) {
    if (st.keywords.some((k) => lowerText.includes(k))) {
      streamOrField = st.stream;
      break;
    }
  }

  // 5. Detect Skills from Taxonomy
  const matchedSkills: string[] = [];
  for (const skill of SKILLS_DICTIONARY) {
    const pattern = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&")}\\b`, "i");
    if (pattern.test(text)) {
      matchedSkills.push(skill);
    }
  }

  // 6. Infer Subjects & Strengths
  let subjects = ["Data Structures & Algorithms", "Database Management", "Web Technologies"];
  if (streamOrField.includes("Data")) {
    subjects = ["Applied Statistics", "Machine Learning", "Linear Algebra"];
  } else if (streamOrField.includes("Business")) {
    subjects = ["Financial Analysis", "Project Management", "Strategic Marketing"];
  }

  const strengths = matchedSkills.filter((s) =>
    ["Problem Solving", "Leadership", "System Design", "Communication", "Analytical Skills", "Critical Thinking"].includes(s)
  );
  if (strengths.length === 0) {
    strengths.push("Problem Solving", "Technical Execution");
  }

  // 7. Certifications detection
  const certMatches = text.match(/(aws certified[^\n,]+|azure certified[^\n,]+|meta certified[^\n,]+|google cloud certified[^\n,]+|pmp|cissp|comptia[^\n,]+)/gi) || [];
  const certifications = Array.from(new Set(certMatches.map((c) => c.trim())));

  // 8. Dream Roles inference
  const dreamRoles = [];
  if (matchedSkills.includes("React") || matchedSkills.includes("Node.js") || matchedSkills.includes("JavaScript")) {
    dreamRoles.push("Software Developer", "Full-Stack Engineer");
  }
  if (matchedSkills.includes("Machine Learning") || matchedSkills.includes("Python") || matchedSkills.includes("Data Analysis")) {
    dreamRoles.push("Data Scientist", "AI Engineer");
  }
  if (matchedSkills.includes("AWS") || matchedSkills.includes("Docker") || matchedSkills.includes("Kubernetes")) {
    dreamRoles.push("Cloud / DevOps Engineer");
  }
  if (dreamRoles.length === 0) {
    dreamRoles.push("Software Developer", "Technology Consultant");
  }

  return {
    name: name || "Candidate",
    email: email,
    academics: {
      educationLevel,
      streamOrField,
      subjects,
      strengths,
      grades: "",
      certifications,
    },
    interests: {
      interests: [streamOrField, "Technology Innovation", "Digital Solutions"],
      hobbies: ["Building Projects", "Continuous Learning"],
      skills: matchedSkills.length > 0 ? matchedSkills.slice(0, 15) : ["Programming", "Problem Solving", "Logic"],
      preferredWorkStyle: ["Remote", "Hybrid"],
    },
    aspirations: {
      dreamRoles: dreamRoles.slice(0, 3),
      willingToDo: ["Build Real-World Portfolio Projects", "Master Advanced Frameworks", "Pursue Industry Certifications"],
      workEnvironment: ["Startup", "Corporate"],
      priorities: ["Growth & Learning", "Salary & Benefits"],
      timeline: "6-12 months",
      additionalNotes: `Auto-extracted from resume (${matchedSkills.length} skills recognized).`,
    },
    parsedDetails: {
      detectedName: name,
      detectedEmail: email,
      skillCount: matchedSkills.length,
    },
  };
}

/** Gemini AI powered resume parsing */
async function parseResumeWithGemini(text: string) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  try {
    const prompt = `
Extract and structure the candidate profile from this resume text into JSON format:

RESUME TEXT:
${text.slice(0, 6000)}
`.trim();

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: {
            parts: [
              {
                text: `You are an expert HR and technical recruiter. Parse the candidate resume text accurately into strictly valid JSON matching this schema:
{
  "name": string,
  "email": string,
  "educationLevel": "Undergraduate" | "Postgraduate" | "High School" | "Vocational" | "Self-taught / Other",
  "streamOrField": string,
  "subjects": string[],
  "strengths": string[],
  "certifications": string[],
  "skills": string[],
  "interests": string[],
  "dreamRoles": string[],
  "workEnvironment": string[],
  "priorities": string[],
  "timeline": string
}`,
              },
            ],
          },
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: {
            response_mime_type: "application/json",
            temperature: 0.2,
          },
        }),
        signal: AbortSignal.timeout(15000),
      }
    );

    if (!res.ok) return null;

    const data = await res.json();
    const rawJson = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawJson) return null;

    const parsed = JSON.parse(rawJson);
    return {
      name: parsed.name || "Candidate",
      email: parsed.email || "",
      academics: {
        educationLevel: parsed.educationLevel || "Undergraduate",
        streamOrField: parsed.streamOrField || "Computer Science & Engineering",
        subjects: Array.isArray(parsed.subjects) && parsed.subjects.length > 0 ? parsed.subjects : ["Core Fundamentals"],
        strengths: Array.isArray(parsed.strengths) && parsed.strengths.length > 0 ? parsed.strengths : ["Problem Solving"],
        grades: "",
        certifications: Array.isArray(parsed.certifications) ? parsed.certifications : [],
      },
      interests: {
        interests: Array.isArray(parsed.interests) && parsed.interests.length > 0 ? parsed.interests : [parsed.streamOrField || "Technology"],
        hobbies: ["Hands-on Projects", "Skill Development"],
        skills: Array.isArray(parsed.skills) && parsed.skills.length > 0 ? parsed.skills : ["Problem Solving"],
        preferredWorkStyle: ["Remote", "Hybrid"],
      },
      aspirations: {
        dreamRoles: Array.isArray(parsed.dreamRoles) && parsed.dreamRoles.length > 0 ? parsed.dreamRoles : ["Software Developer"],
        willingToDo: ["Build Real-World Projects", "Obtain Professional Certifications"],
        workEnvironment: Array.isArray(parsed.workEnvironment) && parsed.workEnvironment.length > 0 ? parsed.workEnvironment : ["Startup", "Corporate"],
        priorities: Array.isArray(parsed.priorities) && parsed.priorities.length > 0 ? parsed.priorities : ["Growth & Learning", "Salary & Benefits"],
        timeline: parsed.timeline || "6-12 months",
        additionalNotes: "Extracted via Gemini AI resume intelligence.",
      },
      parsedDetails: {
        detectedName: parsed.name,
        detectedEmail: parsed.email,
        skillCount: Array.isArray(parsed.skills) ? parsed.skills.length : 0,
      },
    };
  } catch (err) {
    console.warn("Gemini resume parsing failed, falling back:", err);
    return null;
  }
}

/** Groq AI powered resume parsing fallback */
async function parseResumeWithGroq(text: string) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return null;

  try {
    const prompt = `Parse this resume text and return JSON only:
${text.slice(0, 5000)}`;

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-120b",
        messages: [
          {
            role: "system",
            content: `You are an expert resume parser. Extract candidate details and output strictly valid JSON:
{
  "name": string,
  "email": string,
  "educationLevel": "Undergraduate" | "Postgraduate" | "High School",
  "streamOrField": string,
  "subjects": string[],
  "strengths": string[],
  "certifications": string[],
  "skills": string[],
  "interests": string[],
  "dreamRoles": string[]
}`,
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.2,
        response_format: { type: "json_object" },
      }),
      signal: AbortSignal.timeout(12000),
    });

    if (!res.ok) return null;

    const data = await res.json();
    const rawContent = data.choices?.[0]?.message?.content;
    if (!rawContent) return null;

    const parsed = JSON.parse(rawContent);
    return {
      name: parsed.name || "Candidate",
      email: parsed.email || "",
      academics: {
        educationLevel: parsed.educationLevel || "Undergraduate",
        streamOrField: parsed.streamOrField || "Computer Science & Engineering",
        subjects: Array.isArray(parsed.subjects) ? parsed.subjects : ["Computer Fundamentals"],
        strengths: Array.isArray(parsed.strengths) ? parsed.strengths : ["Problem Solving"],
        grades: "",
        certifications: Array.isArray(parsed.certifications) ? parsed.certifications : [],
      },
      interests: {
        interests: Array.isArray(parsed.interests) ? parsed.interests : ["Technology"],
        hobbies: ["Coding", "Reading Tech Blogs"],
        skills: Array.isArray(parsed.skills) ? parsed.skills : ["Problem Solving"],
        preferredWorkStyle: ["Remote", "Hybrid"],
      },
      aspirations: {
        dreamRoles: Array.isArray(parsed.dreamRoles) ? parsed.dreamRoles : ["Software Engineer"],
        willingToDo: ["Build Real-World Projects"],
        workEnvironment: ["Startup", "Corporate"],
        priorities: ["Growth & Learning", "Salary & Benefits"],
        timeline: "6-12 months",
        additionalNotes: "Extracted via Groq AI resume parsing.",
      },
      parsedDetails: {
        detectedName: parsed.name,
        detectedEmail: parsed.email,
        skillCount: Array.isArray(parsed.skills) ? parsed.skills.length : 0,
      },
    };
  } catch (err) {
    console.warn("Groq resume parsing failed, falling back:", err);
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded. Please upload a PDF resume." },
        { status: 400 }
      );
    }

    if (!file.name.toLowerCase().endsWith(".pdf")) {
      return NextResponse.json(
        { error: "Invalid file type. Only PDF resumes are supported." },
        { status: 400 }
      );
    }

    const fileBuffer = await file.arrayBuffer();
    if (fileBuffer.byteLength === 0) {
      return NextResponse.json(
        { error: "Uploaded PDF file is empty." },
        { status: 400 }
      );
    }

    // Step 1: Extract text from PDF buffer
    const text = await extractTextFromPdf(fileBuffer);

    // Step 2: Extract candidate profile using multi-tier intelligence
    // Tier 1: Gemini 3.6 Flash (state-of-the-art accuracy)
    // Tier 2: Groq 120B
    // Tier 3: Deterministic NLP & Keyword extraction
    let profile = null;
    if (text && text.trim().length > 20) {
      profile =
        (await parseResumeWithGemini(text)) ||
        (await parseResumeWithGroq(text)) ||
        extractProfileFromText(text);
    } else {
      profile = extractProfileFromText(file.name);
    }

    return NextResponse.json({
      success: true,
      filename: file.name,
      profile,
    });
  } catch (err: any) {
    console.error("Resume parse error:", err);
    return NextResponse.json(
      {
        error: "Failed to parse resume. Please fill the assessment form manually.",
        details: err?.message,
      },
      { status: 500 }
    );
  }
}
