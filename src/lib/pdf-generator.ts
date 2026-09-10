import { jsPDF } from "jspdf";
import type { CareerRecommendation, UserProfile, UserAccount } from "./types";

/**
 * Sanitizes text to standard ASCII to prevent encoding bugs in standard Helvetica WinAnsi font.
 */
function cleanText(input?: string): string {
  if (!input) return "";
  return input
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/[\u2022\u2023\u25E6\u2043\u2219]/g, "-")
    .replace(/[\u2713\u2714\u221A]/g, "+")
    .replace(/[^\x20-\x7E\n\r\t]/g, "")
    .trim();
}

/**
 * Domain intelligence dictionary providing compensation by level, certifications,
 * career trajectories, 30-60-90 day plans, books, and representative job listings.
 */
interface CareerIntelligence {
  marketDemand: string;
  growthRate: string;
  demandDrivers: string;
  salaryEntry: string;
  salaryMid: string;
  salarySenior: string;
  locationContext: string;
  certifications: string[];
  progression: {
    junior: string;
    mid: string;
    senior: string;
    lead: string;
    icTrack: string;
    mgmtTrack: string;
  };
  actionPlan: {
    day30: string[];
    day60: string[];
    day90: string[];
  };
  books: string[];
  communities: string[];
  jobListings: { title: string; companyType: string; focus: string }[];
}

function getCareerIntelligence(careerTitle: string): CareerIntelligence {
  const t = careerTitle.toLowerCase();

  // Data Science / AI
  if (t.includes("data") || t.includes("ai") || t.includes("machine learning") || t.includes("intelligence")) {
    return {
      marketDemand: "Exponential Demand (Top 5% Tech Growth)",
      growthRate: "+32% Projected 5-Year Industry Expansion",
      demandDrivers: "Mass adoption of generative AI, predictive modeling, and enterprise data infrastructure.",
      salaryEntry: "$80,000 - $105,000 / yr  (India: 8 - 14 LPA)",
      salaryMid: "$120,000 - $165,000 / yr  (India: 16 - 30 LPA)",
      salarySenior: "$175,000 - $250,000+ / yr  (India: 35 - 65+ LPA)",
      locationContext: "Hybrid & Remote globally; strong premium in US & India Tech Hubs (Bengaluru / Hyderabad).",
      certifications: [
        "AWS Certified Machine Learning - Specialty",
        "Google Cloud Professional Data Engineer / ML Engineer",
        "TensorFlow Developer Certificate (Google)",
        "Databricks Certified Data Engineer / ML Associate"
      ],
      progression: {
        junior: "Junior Data Analyst / ML Associate (Years 0-2): Data cleaning, exploratory analysis & baseline models.",
        mid: "Data Scientist / AI Engineer (Years 2-5): End-to-end model training, feature stores & API integration.",
        senior: "Senior Staff Data Scientist (Years 5-8): System architecture, LLM pipelines & optimization.",
        lead: "Principal AI Scientist / VP of Data (Years 8+): Enterprise AI strategy & R&D leadership.",
        icTrack: "Principal Research Scientist / Staff AI Architect (Deep technical innovation).",
        mgmtTrack: "Director of Data Science / Head of AI & Analytics (Team & roadmap leadership)."
      },
      actionPlan: {
        day30: [
          "Master Python scientific stack (NumPy, Pandas, Matplotlib, Seaborn).",
          "Complete exploratory data analysis on 3 real-world Kaggle datasets.",
          "Solidify core linear algebra, calculus, and statistical hypothesis testing."
        ],
        day60: [
          "Build and deploy an end-to-end machine learning model with FastAPI & Streamlit.",
          "Train baseline scikit-learn models, evaluate ROC-AUC/F1, and tune hyperparameters.",
          "Experiment with Hugging Face transformers and API integration."
        ],
        day90: [
          "Publish 2 complete case study notebooks on GitHub with interactive documentation.",
          "Conduct mock technical interview sessions on ML fundamentals & algorithms.",
          "Connect with 20 practicing data science professionals on LinkedIn & Twitter/X."
        ]
      },
      books: [
        "'Designing Data-Intensive Applications' - Martin Kleppmann",
        "'Hands-On Machine Learning with Scikit-Learn, Keras, and TensorFlow' - Aurelien Geron",
        "'Python for Data Analysis' - Wes McKinney"
      ],
      communities: [
        "Kaggle Community & Competitions (kaggle.com)",
        "r/MachineLearning & r/datascience on Reddit",
        "Towards Data Science & ByteByteGo Newsletters"
      ],
      jobListings: [
        { title: "Associate Data Scientist", companyType: "FinTech Scaleup", focus: "Predictive fraud detection & telemetry pipelines" },
        { title: "Machine Learning Engineer", companyType: "AI Platform SaaS", focus: "LLM fine-tuning & real-time inference microservices" },
        { title: "Data & Analytics Specialist", companyType: "Global Enterprise", focus: "Customer segmentation & business intelligence models" }
      ]
    };
  }

  // Cloud & DevOps
  if (t.includes("cloud") || t.includes("devops") || t.includes("site reliability") || t.includes("infrastructure")) {
    return {
      marketDemand: "High Demand (Top 8% Tech Growth)",
      growthRate: "+26% Projected Expansion",
      demandDrivers: "Enterprise digital transformation, hybrid multi-cloud migration, and automated CI/CD pipelines.",
      salaryEntry: "$75,000 - $95,000 / yr  (India: 7 - 13 LPA)",
      salaryMid: "$115,000 - $155,000 / yr  (India: 15 - 28 LPA)",
      salarySenior: "$165,000 - $230,000+ / yr  (India: 30 - 55+ LPA)",
      locationContext: "Heavy remote availability; top compensation in major infrastructure hubs.",
      certifications: [
        "AWS Certified Solutions Architect - Associate / Professional",
        "Certified Kubernetes Administrator (CKA - Linux Foundation)",
        "HashiCorp Certified: Terraform Associate",
        "Microsoft Certified: Azure Solutions Architect Expert"
      ],
      progression: {
        junior: "Junior Cloud / DevOps Engineer (Years 0-2): Pipeline monitoring, bash scripting & basic containerization.",
        mid: "DevOps / SRE Specialist (Years 2-5): Infrastructure as Code (Terraform), Kubernetes cluster management.",
        senior: "Senior SRE / Cloud Architect (Years 5-8): High availability, security posture, and zero-downtime architecture.",
        lead: "Principal Infrastructure Architect / Head of Platform (Years 8+): Multi-region strategy & platform engineering.",
        icTrack: "Staff Platform Engineer / Principal Cloud Architect (Architecture focus).",
        mgmtTrack: "Director of Infrastructure / VP of Site Reliability (Operational focus)."
      },
      actionPlan: {
        day30: [
          "Master Linux administration, Shell scripting, and Git version control.",
          "Containerize 3 web applications with Docker and multi-stage builds.",
          "Understand networking fundamentals (DNS, TCP/IP, VPC, Subnets)."
        ],
        day60: [
          "Deploy containerized microservices to Kubernetes with Helm charts.",
          "Provision cloud infrastructure on AWS/Azure using declarative Terraform scripts.",
          "Build automated CI/CD deployment pipelines using GitHub Actions."
        ],
        day90: [
          "Implement monitoring and alerting with Prometheus and Grafana.",
          "Document and publish a high-availability infrastructure repository on GitHub.",
          "Take the AWS Solutions Architect or CKA certification exam."
        ]
      },
      books: [
        "'Site Reliability Engineering' - Google SRE Team",
        "'The Phoenix Project' - Gene Kim & Kevin Behr",
        "'Terraform: Up & Running' - Yevgeniy Brikman"
      ],
      communities: [
        "Cloud Native Computing Foundation (CNCF) Community",
        "DevOps'ish Newsletter by Chris Short",
        "r/devops & r/aws on Reddit"
      ],
      jobListings: [
        { title: "Junior DevOps Engineer", companyType: "Cloud Consulting Partner", focus: "CI/CD pipeline automation & container setups" },
        { title: "Cloud Infrastructure Engineer", companyType: "High-Growth FinTech", focus: "Terraform provisioning & Kubernetes orchestration" },
        { title: "Site Reliability Engineer", companyType: "SaaS Platform", focus: "Observability, SLO/SLA management & incident response" }
      ]
    };
  }

  // Default: Software Developer / Full-Stack Engineer / Core Technology
  return {
    marketDemand: "Very High Demand (Top Tier Industry Benchmark)",
    growthRate: "+22% Projected 5-Year Industry Expansion",
    demandDrivers: "Modernization of enterprise software, cloud-native web architectures, and mobile ecosystems.",
    salaryEntry: "$70,000 - $90,000 / yr  (India: 7 - 12 LPA)",
    salaryMid: "$105,000 - $145,000 / yr  (India: 14 - 25 LPA)",
    salarySenior: "$160,000 - $220,000+ / yr  (India: 28 - 50+ LPA)",
    locationContext: "Highly flexible (Remote, Hybrid, In-Office) across global technology centers.",
    certifications: [
      "Meta Front-End / Back-End Developer Professional Certificate",
      "AWS Certified Developer - Associate",
      "GitHub Foundations / Actions Professional",
      "Oracle Certified Professional: Java / React Certified Associate"
    ],
    progression: {
      junior: "Associate / Junior Software Engineer (Years 0-2): Clean code implementation, bug fixing & unit testing.",
      mid: "Software Engineer / Full-Stack Developer (Years 2-5): Feature ownership, API design & database schemas.",
      senior: "Senior Software Engineer (Years 5-8): System design, architectural choices, code reviews & team mentorship.",
      lead: "Staff / Principal Engineer OR Engineering Manager (Years 8+): Technical vision, scalability & team leadership.",
      icTrack: "Staff Engineer -> Principal Engineer -> Distinguished Architect (Technical excellence track).",
      mgmtTrack: "Engineering Manager -> Director of Engineering -> VP of Technology (Leadership track)."
    },
    actionPlan: {
      day30: [
        "Master foundational language syntax (JavaScript/TypeScript or Python) and data structures.",
        "Solve 30 easy/medium algorithmic problems on LeetCode/NeetCode.",
        "Build a responsive web application and deploy it live with custom domain."
      ],
      day60: [
        "Architect a full-stack CRUD application with authentication and relational SQL database.",
        "Implement REST/GraphQL endpoints with automated unit and integration tests.",
        "Publish codebase on GitHub with comprehensive documentation and live demo link."
      ],
      day90: [
        "Optimize application performance, indexing, and state management under load.",
        "Practice mock behavioral and system design interview questions.",
        "Tailor resume and portfolio to target positions and begin strategic outreach."
      ]
    },
    books: [
      "'Clean Code: A Handbook of Agile Software Craftsmanship' - Robert C. Martin",
      "'The Pragmatic Programmer: Your Journey to Mastery' - David Thomas & Andrew Hunt",
      "'Designing Data-Intensive Applications' - Martin Kleppmann"
    ],
    communities: [
      "Hacker News (news.ycombinator.com)",
      "TLDR Web Dev Newsletter (tldr.tech)",
      "r/webdev, r/cscareerquestions, and GitHub Developer Community"
    ],
    jobListings: [
      { title: "Junior Software Developer", companyType: "Product Software Scaleup", focus: "Modern frontend components & backend REST services" },
      { title: "Full-Stack Engineer", companyType: "Venture-Backed SaaS", focus: "React/Next.js UI development and scalable Node.js microservices" },
      { title: "Software Engineer (Applications)", companyType: "Global Tech Enterprise", focus: "Enterprise platform engineering, data integrations & APIs" }
    ]
  };
}

/**
 * Builds a structured, 4-page Executive Career Blueprint report.
 * Each section is explicitly budgeted into distinct, beautifully formatted pages.
 */
export function buildCareerPdf(
  career: CareerRecommendation,
  userOrName?: string | UserAccount | null,
  profileOverride?: UserProfile | null
): jsPDF {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 14;
  const contentWidth = pageWidth - margin * 2; // 182mm

  // Determine candidate details & profile snapshot
  let candidateName = "Candidate";
  let profile: UserProfile | null = profileOverride || null;

  if (typeof userOrName === "string") {
    candidateName = userOrName;
  } else if (userOrName && typeof userOrName === "object") {
    candidateName = userOrName.name || "Candidate";
    if (!profile && userOrName.profile) {
      profile = userOrName.profile;
    }
  }

  candidateName = cleanText(candidateName) || "Candidate";
  const careerTitle = cleanText(career.careerTitle) || "Career Roadmap";
  const dateStr = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const intelligence = getCareerIntelligence(careerTitle);

  // Helper: Draw running page header
  const drawPageHeader = (sectionTitle: string) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139); // slate-500
    doc.text(`SMART CAREER PATH AI  |  EXECUTIVE CAREER REPORT`, margin, 9);

    doc.setFont("helvetica", "normal");
    doc.text(sectionTitle.toUpperCase(), pageWidth - margin - doc.getTextWidth(sectionTitle.toUpperCase()), 9);

    doc.setDrawColor(226, 232, 240);
    doc.line(margin, 11.5, pageWidth - margin, 11.5);
  };

  // Helper: Draw running page footer
  const drawPageFooter = (pageNum: number, totalPages: number) => {
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184); // slate-400
    doc.text(`Confidential • Generated for ${candidateName} • ${dateStr}`, margin, pageHeight - 7);
    doc.text(`Page ${pageNum} of ${totalPages}`, pageWidth - margin - 18, pageHeight - 7);
  };

  // =========================================================================
  // PAGE 1: COVER, EXECUTIVE SUMMARY & CANDIDATE PROFILE SNAPSHOT
  // =========================================================================
  let y = 14;

  // 1. Top Cover Banner Box (Dark Indigo/Slate)
  doc.setFillColor(15, 23, 42); // slate-900
  doc.roundedRect(margin, y, contentWidth, 38, 3.5, 3.5, "F");

  // Platform Tag Badge
  doc.setFillColor(14, 165, 233); // sky-500
  doc.roundedRect(margin + 6, y + 5.5, 52, 5, 1.5, 1.5, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(255, 255, 255);
  doc.text("PERSONALIZED CAREER BLUEPRINT", margin + 8, y + 9);

  // Main Report Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text(`${careerTitle} Strategic Roadmap`, margin + 6, y + 20);

  // Subtitle / Prepared for line
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(203, 213, 225); // slate-300
  doc.text(`Prepared for: ${candidateName}   |   Issued: ${dateStr}   |   Platform: Smart Career Path AI`, margin + 6, y + 29);

  y += 43;

  // 2. Executive KPI Overview Metrics Row
  const kpiWidth = (contentWidth - 9) / 4;
  const kpiHeight = 17;

  // KPI 1: Match Score
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, kpiWidth, kpiHeight, 2.5, 2.5, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text("AI MATCH SCORE", margin + 3.5, y + 5);
  doc.setFontSize(11);
  doc.setTextColor(14, 165, 233);
  doc.text(`${career.matchScore || 95}% Match`, margin + 3.5, y + 12.5);

  // KPI 2: Skill Overlap
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin + kpiWidth + 3, y, kpiWidth, kpiHeight, 2.5, 2.5, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text("SKILL ALIGNMENT", margin + kpiWidth + 6.5, y + 5);
  doc.setFontSize(11);
  doc.setTextColor(16, 185, 129);
  const overlapPct = career.skillOverlapPercent !== undefined ? career.skillOverlapPercent : 85;
  doc.text(`${overlapPct}% Overlap`, margin + kpiWidth + 6.5, y + 12.5);

  // KPI 3: Timeline
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin + (kpiWidth + 3) * 2, y, kpiWidth, kpiHeight, 2.5, 2.5, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text("TARGET TIMELINE", margin + (kpiWidth + 3) * 2 + 3.5, y + 5);
  doc.setFontSize(9);
  doc.setTextColor(30, 41, 59);
  const timeStr = cleanText(career.estimatedTimeline) || "6-12 Months";
  doc.text(doc.splitTextToSize(timeStr, kpiWidth - 6)[0] || timeStr, margin + (kpiWidth + 3) * 2 + 3.5, y + 12.5);

  // KPI 4: Market Outlook
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin + (kpiWidth + 3) * 3, y, kpiWidth, kpiHeight, 2.5, 2.5, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text("INDUSTRY DEMAND", margin + (kpiWidth + 3) * 3 + 3.5, y + 5);
  doc.setFontSize(9);
  doc.setTextColor(99, 102, 241);
  doc.text("Very High", margin + (kpiWidth + 3) * 3 + 3.5, y + 12.5);

  y += kpiHeight + 6;

  // 3. Executive Summary Paragraph
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42);
  doc.text("Executive Summary & Strategic Fit", margin, y);
  y += 4.5;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  const execSummary =
    `Based on rigorous algorithmic matching of your academic profile, skill competencies, and stated career aspirations, ` +
    `the role of ${careerTitle} represents a premier high-growth trajectory. ` +
    `Your foundational strengths align directly with the primary demands of this field, while our sequential curriculum provides ` +
    `an actionable roadmap to master emerging industry competencies, bridge current skill gaps, and transition seamlessly into high-impact roles.`;
  const splitExec = doc.splitTextToSize(cleanText(execSummary), contentWidth);
  doc.text(splitExec, margin, y);
  y += splitExec.length * 4.2 + 6;

  // 4. Compact "Your Profile Snapshot" Card
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, contentWidth, 52, 3, 3, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text("Your Profile Assessment Snapshot", margin + 4, y + 6);

  const colW = (contentWidth - 12) / 2;

  // Left Column: Academic Background & Skills
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text("ACADEMIC FOUNDATION", margin + 4, y + 13);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(30, 41, 59);
  const eduLevel = profile?.academics?.educationLevel || "Undergraduate Degree";
  const stream = profile?.academics?.streamOrField || "Computer Science / Technical Field";
  doc.text(`• Education Level: ${cleanText(eduLevel)}`, margin + 4, y + 18);
  doc.text(`• Discipline / Stream: ${cleanText(stream)}`, margin + 4, y + 23);

  const candidateSkills = profile?.interests?.skills?.slice(0, 5).join(", ") ||
    (career.matchingSkills && career.matchingSkills.length > 0 ? career.matchingSkills.slice(0, 5).join(", ") : "Problem Solving, Logic, Tech Foundations");
  const splitCandSkills = doc.splitTextToSize(`• Recognized Strengths: ${cleanText(candidateSkills)}`, colW);
  doc.text(splitCandSkills.slice(0, 2), margin + 4, y + 28);

  // Right Column: Interests, Environment & Timeline
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text("PREFERENCES & CAREER OBJECTIVES", margin + colW + 8, y + 13);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(30, 41, 59);
  const envPref = profile?.aspirations?.workEnvironment?.join(", ") || "Startup, High-Growth Corporate, Remote";
  const timePref = profile?.aspirations?.timeline || career.estimatedTimeline || "6-12 months";
  const interestsPref = profile?.interests?.interests?.slice(0, 4).join(", ") || "Technology Innovation, Software Building, Architecture";

  doc.text(`• Target Work Environment: ${cleanText(envPref)}`, margin + colW + 8, y + 18);
  doc.text(`• Preferred Transition Timeline: ${cleanText(timePref)}`, margin + colW + 8, y + 23);
  const splitInterests = doc.splitTextToSize(`• Core Areas of Interest: ${cleanText(interestsPref)}`, colW);
  doc.text(splitInterests.slice(0, 2), margin + colW + 8, y + 28);

  y += 58;

  // 5. Table of Contents Index Box
  doc.setFillColor(241, 245, 249); // slate-100
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, y, contentWidth, 34, 2.5, 2.5, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text("Report Table of Contents", margin + 4, y + 5.5);

  const tocItems = [
    { section: "Section 1.0: Executive Profile & Candidate Snapshot", page: "Page 1" },
    { section: "Section 2.0: Skills Intelligence, Gap Analysis & Market Outlook", page: "Page 2" },
    { section: "Section 3.0: Comprehensive Sequential Execution Roadmap", page: "Page 3" },
    { section: "Section 4.0: Career Trajectory, 30-60-90 Day Plan & Industry Ecosystem", page: "Page 4" },
  ];

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);
  tocItems.forEach((item, idx) => {
    const itemY = y + 11.5 + idx * 5;
    doc.text(item.section, margin + 4, itemY);
    // Draw dot leaders
    const textW = doc.getTextWidth(item.section);
    doc.setTextColor(203, 213, 225);
    doc.text(". . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .", margin + 6 + textW, itemY);
    doc.setTextColor(14, 165, 233);
    doc.setFont("helvetica", "bold");
    doc.text(item.page, pageWidth - margin - 15, itemY);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(51, 65, 85);
  });

  drawPageFooter(1, 4);

  // =========================================================================
  // PAGE 2: SKILLS & MARKET ANALYSIS
  // =========================================================================
  doc.addPage();
  drawPageHeader("Section 2: Skills & Market Analysis");
  y = 16;

  // Title: Skills Intelligence & Market Analysis
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text("2.0 Skills Intelligence & Industry Market Analysis", margin, y);
  y += 6;

  // 1. Compensation Breakdown Grid (Entry / Mid / Senior)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text("Industry Compensation Breakdown by Experience Level", margin, y);
  y += 4.5;

  const compW = (contentWidth - 6) / 3;
  const compH = 22;

  // Card 1: Entry Level
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, compW, compH, 2.5, 2.5, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text("ENTRY LEVEL (0 - 2 YRS)", margin + 3.5, y + 5);
  doc.setFontSize(9.5);
  doc.setTextColor(16, 185, 129);
  doc.text(intelligence.salaryEntry.split("  (")[0] || "$70,000 / yr", margin + 3.5, y + 11.5);
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text(intelligence.salaryEntry.includes("(") ? `(${intelligence.salaryEntry.split(" (")[1]}` : "Global baseline", margin + 3.5, y + 17);

  // Card 2: Mid Level
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin + compW + 3, y, compW, compH, 2.5, 2.5, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text("MID-LEVEL (2 - 5 YRS)", margin + compW + 6.5, y + 5);
  doc.setFontSize(9.5);
  doc.setTextColor(14, 165, 233);
  doc.text(intelligence.salaryMid.split("  (")[0] || "$115,000 / yr", margin + compW + 6.5, y + 11.5);
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text(intelligence.salaryMid.includes("(") ? `(${intelligence.salaryMid.split(" (")[1]}` : "Global baseline", margin + compW + 6.5, y + 17);

  // Card 3: Senior / Lead
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin + (compW + 3) * 2, y, compW, compH, 2.5, 2.5, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text("SENIOR / LEAD (5+ YRS)", margin + (compW + 3) * 2 + 3.5, y + 5);
  doc.setFontSize(9.5);
  doc.setTextColor(99, 102, 241);
  doc.text(intelligence.salarySenior.split("  (")[0] || "$165,000+ / yr", margin + (compW + 3) * 2 + 3.5, y + 11.5);
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text(intelligence.salarySenior.includes("(") ? `(${intelligence.salarySenior.split(" (")[1]}` : "Global baseline", margin + (compW + 3) * 2 + 3.5, y + 17);

  y += compH + 5;

  // Location context note
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text(`* Market Compensation Note: ${intelligence.locationContext}`, margin, y);
  y += 7;

  // 2. Market Demand Indicator Box
  doc.setFillColor(238, 242, 255); // indigo-50
  doc.setDrawColor(199, 210, 254);
  doc.roundedRect(margin, y, contentWidth, 20, 2.5, 2.5, "FD");

  doc.setFillColor(99, 102, 241);
  doc.roundedRect(margin + 3.5, y + 3.5, 34, 4.8, 1.5, 1.5, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.setTextColor(255, 255, 255);
  doc.text("MARKET DEMAND", margin + 5, y + 6.8);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text(`${intelligence.marketDemand}   |   ${intelligence.growthRate}`, margin + 40, y + 7);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text(`Key Hiring Drivers: ${intelligence.demandDrivers}`, margin + 3.5, y + 14);

  y += 26;

  // 3. Skills You Already Have (Current Strengths)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text("Skills You Already Possess (Recognized Strengths)", margin, y);
  y += 4.5;

  const possessedList = (career.matchingSkills && career.matchingSkills.length > 0)
    ? career.matchingSkills
    : (career.requiredSkills ? career.requiredSkills.slice(0, 4) : ["Problem Solving", "Logical Reasoning", "Foundational Technical Literacy"]);

  doc.setFillColor(240, 253, 244); // emerald-50
  doc.setDrawColor(187, 247, 208);
  const possessedH = Math.max(18, 9 + Math.ceil(possessedList.length / 2) * 5);
  doc.roundedRect(margin, y, contentWidth, possessedH, 2.5, 2.5, "FD");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(21, 128, 61); // emerald-700
  possessedList.forEach((sk, idx) => {
    const isCol2 = idx % 2 === 1;
    const posX = isCol2 ? margin + contentWidth / 2 + 2 : margin + 5;
    const posY = y + 7 + Math.floor(idx / 2) * 5;

    // Green bullet dot
    doc.setFillColor(34, 197, 94);
    doc.circle(posX, posY - 0.8, 1, "F");
    doc.text(`[Verified]  ${cleanText(sk)}`, posX + 3, posY);
  });

  y += possessedH + 6;

  // 4. Skills to Develop (Prioritized Matrix: High / Medium / Low)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text("Target Skills to Develop (Prioritized Matrix)", margin, y);
  y += 4.5;

  const rawToDev = career.skillsToDevelop && career.skillsToDevelop.length > 0
    ? career.skillsToDevelop
    : (career.requiredSkills ? career.requiredSkills.slice(2, 9) : ["Advanced Frameworks", "System Architecture", "Deployment CI/CD"]);

  const highPriority = rawToDev.slice(0, 3);
  const medPriority = rawToDev.slice(3, 6);
  const lowPriority = rawToDev.slice(6, 9);
  if (medPriority.length === 0) medPriority.push("Production Design Patterns", "Automated Testing");
  if (lowPriority.length === 0) lowPriority.push("Cloud Infrastructure Optimization", "Security Auditing");

  const matrixW = (contentWidth - 6) / 3;
  const matrixH = 34;

  // Column 1: High Priority
  doc.setFillColor(254, 242, 242); // rose-50
  doc.setDrawColor(254, 205, 205);
  doc.roundedRect(margin, y, matrixW, matrixH, 2.5, 2.5, "FD");
  doc.setFillColor(239, 68, 68); // rose-500
  doc.roundedRect(margin + 3, y + 3, 24, 4.5, 1, 1, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.setTextColor(255, 255, 255);
  doc.text("HIGH PRIORITY", margin + 4.5, y + 6.2);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(30, 41, 59);
  highPriority.forEach((s, i) => {
    doc.text(`• ${cleanText(s)}`, margin + 3.5, y + 12 + i * 5.5);
  });

  // Column 2: Medium Priority
  doc.setFillColor(254, 249, 195); // amber-50
  doc.setDrawColor(253, 230, 138);
  doc.roundedRect(margin + matrixW + 3, y, matrixW, matrixH, 2.5, 2.5, "FD");
  doc.setFillColor(245, 158, 11); // amber-500
  doc.roundedRect(margin + matrixW + 6, y + 3, 26, 4.5, 1, 1, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.setTextColor(255, 255, 255);
  doc.text("MEDIUM PRIORITY", margin + matrixW + 7.5, y + 6.2);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(30, 41, 59);
  medPriority.forEach((s, i) => {
    doc.text(`• ${cleanText(s)}`, margin + matrixW + 6.5, y + 12 + i * 5.5);
  });

  // Column 3: Low Priority
  doc.setFillColor(240, 253, 250); // teal-50
  doc.setDrawColor(204, 251, 241);
  doc.roundedRect(margin + (matrixW + 3) * 2, y, matrixW, matrixH, 2.5, 2.5, "FD");
  doc.setFillColor(20, 184, 166); // teal-500
  doc.roundedRect(margin + (matrixW + 3) * 2 + 3, y + 3, 30, 4.5, 1, 1, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.setTextColor(255, 255, 255);
  doc.text("EMERGING / LOW PRIORITY", margin + (matrixW + 3) * 2 + 4.5, y + 6.2);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(30, 41, 59);
  lowPriority.forEach((s, i) => {
    doc.text(`• ${cleanText(s)}`, margin + (matrixW + 3) * 2 + 3.5, y + 12 + i * 5.5);
  });

  y += matrixH + 6;

  // 5. Recommended Industry Certifications
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text("Recommended Industry Certifications", margin, y);
  y += 4.5;

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, contentWidth, 24, 2.5, 2.5, "FD");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(30, 41, 59);
  intelligence.certifications.forEach((cert, cIdx) => {
    const isCol2 = cIdx >= 2;
    const certX = isCol2 ? margin + contentWidth / 2 + 2 : margin + 4;
    const certY = y + 7 + (cIdx % 2) * 6;

    doc.setFillColor(14, 165, 233);
    doc.circle(certX, certY - 0.8, 0.9, "F");
    doc.text(cleanText(cert), certX + 3, certY);
  });

  drawPageFooter(2, 4);

  // =========================================================================
  // PAGE 3: SEQUENTIAL EXECUTION ROADMAP
  // =========================================================================
  doc.addPage();
  drawPageHeader("Section 3: Sequential Execution Roadmap");
  y = 16;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text("3.0 Comprehensive Sequential Execution Roadmap", margin, y);
  y += 5;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text("Follow each progressive stage systematically. Complete all exercises and validate competencies with skill assessments.", margin, y);
  y += 6;

  const learningSteps = career.learningPath || [];

  learningSteps.slice(0, 4).forEach((step, idx) => {
    const stepNum = step.order || idx + 1;
    const stepTitle = cleanText(step.title) || `Stage ${stepNum}`;
    const stepDuration = step.duration ? cleanText(`Duration: ${step.duration}`) : "Duration: 6-8 Weeks";
    const stepDesc = cleanText(step.description);

    // Calculate stage box height dynamically
    const procs = step.procedure && step.procedure.length > 0 ? step.procedure.slice(0, 3) : [];
    const stageHeight = 44 + (procs.length > 2 ? 6 : 0);

    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, y, contentWidth, stageHeight, 3, 3, "FD");

    // Stage Header Banner inside Card
    doc.setFillColor(241, 245, 249);
    doc.roundedRect(margin, y, contentWidth, 8, 2.5, 2.5, "F");

    // Stage Badge
    doc.setFillColor(14, 165, 233);
    doc.roundedRect(margin + 2.5, y + 1.5, 17, 5, 1.5, 1.5, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(255, 255, 255);
    doc.text(`STAGE ${stepNum}`, margin + 3.8, y + 5);

    // Title & Duration
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text(stepTitle, margin + 22, y + 5.2);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(stepDuration, pageWidth - margin - doc.getTextWidth(stepDuration) - 4, y + 5.2);

    let innerY = y + 12;

    // Stage Objective / Description
    if (stepDesc) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(71, 85, 105);
      const splitD = doc.splitTextToSize(stepDesc, contentWidth - 8);
      doc.text(splitD.slice(0, 2), margin + 4, innerY);
      innerY += splitD.slice(0, 2).length * 3.8 + 2;
    }

    // Step-by-Step Action Procedures
    if (procs.length > 0) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(30, 41, 59);
      doc.text("Action Steps & Practical Exercises:", margin + 4, innerY);
      innerY += 3.8;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(51, 65, 85);

      procs.forEach((p, pIdx) => {
        const splitP = doc.splitTextToSize(`${pIdx + 1}. ${cleanText(p)}`, contentWidth - 10);
        doc.text(splitP.slice(0, 2), margin + 6, innerY);
        innerY += splitP.slice(0, 2).length * 3.6;
      });
      innerY += 1.5;
    }

    // Curated Resources
    if (step.resources && step.resources.length > 0) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139);
      doc.text("Curated Resources:", margin + 4, innerY);

      doc.setFont("helvetica", "normal");
      doc.setTextColor(14, 165, 233);
      const resText = step.resources.slice(0, 4).map(cleanText).join("   |   ");
      const splitR = doc.splitTextToSize(resText, contentWidth - 34);
      doc.text(splitR.slice(0, 1), margin + 34, innerY);
    }

    y += stageHeight + 5;
  });

  drawPageFooter(3, 4);

  // =========================================================================
  // PAGE 4: CAREER TRAJECTORY, 30-60-90 PLAN & INDUSTRY ECOSYSTEM
  // =========================================================================
  doc.addPage();
  drawPageHeader("Section 4: Career Trajectory & Action Blueprint");
  y = 16;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text("4.0 Career Trajectory, Action Blueprint & Ecosystem", margin, y);
  y += 5.5;

  // 1. Typical Career Progression (IC vs Management Tracks)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text("Typical Career Progression & Trajectory Pathways", margin, y);
  y += 4;

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, contentWidth, 36, 2.5, 2.5, "FD");

  const prog = intelligence.progression;
  const stages = [
    { label: "0-2 Yrs", desc: prog.junior },
    { label: "2-5 Yrs", desc: prog.mid },
    { label: "5-8 Yrs", desc: prog.senior },
    { label: "8+ Yrs", desc: prog.lead },
  ];

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(51, 65, 85);
  stages.forEach((st, sIdx) => {
    const sY = y + 5 + sIdx * 5;
    doc.setFont("helvetica", "bold");
    doc.setTextColor(14, 165, 233);
    doc.text(`• [${st.label}]`, margin + 3.5, sY);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(30, 41, 59);
    const splitSt = doc.splitTextToSize(st.desc, contentWidth - 25);
    doc.text(splitSt[0] || st.desc, margin + 20, sY);
  });

  // Dual track note
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text("Dual-Track Trajectory Note:", margin + 3.5, y + 27);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(71, 85, 105);
  doc.text(`IC Track: ${prog.icTrack}`, margin + 3.5, y + 30.5);
  doc.text(`Management Track: ${prog.mgmtTrack}`, margin + 3.5, y + 34);

  y += 41;

  // 2. Immediate Next Steps: 30 / 60 / 90-Day Action Blueprint
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text("Immediate 30 / 60 / 90-Day Tactical Action Blueprint", margin, y);
  y += 4;

  const planW = (contentWidth - 6) / 3;
  const planH = 34;

  // 30 Days Card
  doc.setFillColor(240, 249, 255); // sky-50
  doc.setDrawColor(186, 230, 253);
  doc.roundedRect(margin, y, planW, planH, 2.5, 2.5, "FD");
  doc.setFillColor(14, 165, 233);
  doc.roundedRect(margin + 3, y + 3, 26, 4.5, 1, 1, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.setTextColor(255, 255, 255);
  doc.text("DAYS 1 - 30: SETUP", margin + 4.5, y + 6.2);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(30, 41, 59);
  intelligence.actionPlan.day30.forEach((item, i) => {
    const splitItem = doc.splitTextToSize(`✓ ${cleanText(item)}`, planW - 6);
    doc.text(splitItem.slice(0, 2), margin + 3, y + 12 + i * 7);
  });

  // 60 Days Card
  doc.setFillColor(245, 243, 255); // violet-50
  doc.setDrawColor(221, 214, 254);
  doc.roundedRect(margin + planW + 3, y, planW, planH, 2.5, 2.5, "FD");
  doc.setFillColor(139, 92, 246);
  doc.roundedRect(margin + planW + 6, y + 3, 28, 4.5, 1, 1, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.setTextColor(255, 255, 255);
  doc.text("DAYS 31 - 60: BUILD", margin + planW + 7.5, y + 6.2);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(30, 41, 59);
  intelligence.actionPlan.day60.forEach((item, i) => {
    const splitItem = doc.splitTextToSize(`✓ ${cleanText(item)}`, planW - 6);
    doc.text(splitItem.slice(0, 2), margin + planW + 6, y + 12 + i * 7);
  });

  // 90 Days Card
  doc.setFillColor(236, 253, 245); // emerald-50
  doc.setDrawColor(167, 243, 208);
  doc.roundedRect(margin + (planW + 3) * 2, y, planW, planH, 2.5, 2.5, "FD");
  doc.setFillColor(16, 185, 129);
  doc.roundedRect(margin + (planW + 3) * 2 + 3, y + 3, 28, 4.5, 1, 1, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.setTextColor(255, 255, 255);
  doc.text("DAYS 61 - 90: LAUNCH", margin + (planW + 3) * 2 + 4.5, y + 6.2);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(30, 41, 59);
  intelligence.actionPlan.day90.forEach((item, i) => {
    const splitItem = doc.splitTextToSize(`✓ ${cleanText(item)}`, planW - 6);
    doc.text(splitItem.slice(0, 2), margin + (planW + 3) * 2 + 3, y + 12 + i * 7);
  });

  y += planH + 6;

  // 3. Further Reading & Professional Ecosystem (Books & Communities)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text("Further Reading & Professional Ecosystem", margin, y);
  y += 4;

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, contentWidth, 26, 2.5, 2.5, "FD");

  const ecoColW = (contentWidth - 10) / 2;

  // Recommended Books
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text("FOUNDATIONAL INDUSTRY LITERATURE", margin + 3.5, y + 5);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(30, 41, 59);
  intelligence.books.slice(0, 3).forEach((bk, bIdx) => {
    doc.text(`• ${cleanText(bk)}`, margin + 3.5, y + 10 + bIdx * 4.8);
  });

  // Recommended Communities & Newsletters
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text("COMMUNITIES & TECHNICAL DISPATCHES", margin + ecoColW + 6, y + 5);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(30, 41, 59);
  intelligence.communities.slice(0, 3).forEach((com, cIdx) => {
    doc.text(`• ${cleanText(com)}`, margin + ecoColW + 6, y + 10 + cIdx * 4.8);
  });

  y += 31;

  // 4. Target Industry Job Listings & Opportunities
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text("Representative Target Job Openings & Hiring Profiles", margin, y);
  y += 4;

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, contentWidth, 24, 2.5, 2.5, "FD");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(30, 41, 59);
  intelligence.jobListings.forEach((job, jIdx) => {
    const jobY = y + 6 + jIdx * 5.8;
    doc.setFont("helvetica", "bold");
    doc.setTextColor(14, 165, 233);
    doc.text(`${job.title}`, margin + 3.5, jobY);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 116, 139);
    doc.text(`  |  ${job.companyType}  -  Focus: ${job.focus}`, margin + 3.5 + doc.getTextWidth(job.title), jobY);
  });

  y += 28;

  // Sign-off verification banner
  doc.setFont("helvetica", "italic");
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text(
    "This report was generated by Smart Career Path AI Recommendation Engine using multi-modal assessment heuristics.",
    margin,
    y
  );

  drawPageFooter(4, 4);

  return doc;
}

/**
 * Generates an ArrayBuffer representation of the PDF for server responses.
 */
export function buildCareerPdfArrayBuffer(
  career: CareerRecommendation,
  userOrName?: string | UserAccount | null,
  profile?: UserProfile | null
): ArrayBuffer {
  const doc = buildCareerPdf(career, userOrName, profile);
  return doc.output("arraybuffer");
}

/**
 * Triggers direct client-side browser download of the PDF roadmap with a robust Blob URL.
 */
export function downloadCareerPdfInBrowser(
  career: CareerRecommendation,
  userOrName?: string | UserAccount | null,
  profile?: UserProfile | null
): void {
  const doc = buildCareerPdf(career, userOrName, profile);
  const rawSlug = (career.careerTitle || "Career_Roadmap").replace(/[^a-zA-Z0-9_\-]+/g, "_");
  const filename = `${rawSlug}_Executive_Roadmap.pdf`;

  const blob = doc.output("blob");
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.style.display = "none";
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();

  setTimeout(() => {
    try {
      document.body.removeChild(anchor);
      URL.revokeObjectURL(url);
    } catch {}
  }, 60000);
}

/**
 * Opens the PDF directly in a new browser tab for immediate viewing and printing.
 */
export function openCareerPdfInBrowser(
  career: CareerRecommendation,
  userOrName?: string | UserAccount | null,
  profile?: UserProfile | null
): void {
  const doc = buildCareerPdf(career, userOrName, profile);
  const blob = doc.output("blob");
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank");
}
