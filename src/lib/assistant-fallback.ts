import { getCareerSummaries, getCareerDetails } from "./career-engine";

const q = (s: string) => s.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();

export interface AssistantContext {
  userName?: string;
  currentCareer?: string;
}

export function getFallbackResponse(userMessage: string, context?: AssistantContext): string {
  const msg = q(userMessage);
  const careers = getCareerSummaries();
  const { currentCareer } = context || {};

  if (msg.length < 2) {
    return "Please ask a question about career paths, how to use this site, or what we recommend. You can also click a suggestion below.";
  }

  // Handle simple greetings dynamically
  if (/^(hi|hello|hey|greetings|hola|howdy)( there)?$/.test(msg)) {
    const greetings = [
      `Hello${context?.userName && context.userName !== 'Anonymous' ? ` ${context.userName}` : ''}! How can I help you today?`,
      `Hi there! I'm here to help you navigate your career path. What would you like to know?`,
      `Greetings! Ask me anything about career recommendations or how to use this platform.`
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  }

  // "This career/path" — user is on a career page
  if (currentCareer && /\b(this|current|viewing|opened|about)\b/.test(msg) && /\b(career|path|role|job)\b/.test(msg) || currentCareer && /\b(explain|tell me more|details|describe|what is)\b/.test(msg)) {
    const details = getCareerDetails(currentCareer);
    if (details) {
      let out = `**${details.title}**\n\n${details.description}\n\n`;
      if (details.simpleSummary) out += `In short: ${details.simpleSummary}\n\n`;
      out += `**Skills you'll build:** ${details.skills.join(", ")}\n\n`;
      out += `**Timeline:** ${details.timeline}\n\n`;
      if (details.salaryRange) out += `**Typical salary range:** ${details.salaryRange}\n\n`;
      out += `**Learning path overview:**\n${details.learningPathSummary.map((s) => `• ${s}`).join("\n")}\n\n`;
      out += `Scroll through the page for the full step-by-step procedure (what to do, how to do it, where to learn).`;
      return out;
    }
  }

  // How to use / get started
  if (/\b(how|what|where|start|begin|use|work|does)\b/.test(msg) && /\b(site|app|this|dashboard|assessment|recommendation)\b/.test(msg)) {
    return "Here's how to use Smart Career Path:\n\n1. **Start Assessment** — Complete the multi-step form (academics, interests, aspirations).\n2. **Dashboard** — View your profile and click \"Generate recommendations\" to get career matches.\n3. **Career path** — Click any recommended career to see a step-by-step learning path (what to do, how to do it, where to learn).\n\nYour data is stored in your browser; no account is required.";
  }
  if (/\b(get started|start|begin|first step)\b/.test(msg)) {
    return "To get started: go to **Start Assessment** from the home page, fill in your academics, interests, and career aspirations, then open your **Dashboard** and click **Generate recommendations**. You'll see top career matches and can open any one for a full learning path.";
  }

  // What careers / which paths
  if (/\b(what career|which career|careers?|paths?|options?|recommend)\b/.test(msg) || (/\b(list|name|types?)\b/.test(msg) && /\b(career|job|path)\b/.test(msg))) {
    const list = careers.map((c) => `• **${c.title}**: ${c.description}`).join("\n\n");
    return `We recommend from these career paths:\n\n${list}\n\nYour top matches depend on your profile. Complete the assessment and generate recommendations on your dashboard to see your personalized list.`;
  }

  // Specific career mentioned by name
  for (const { title, description } of careers) {
    const t = q(title);
    if (msg.includes(t) || title.toLowerCase().split(/\s+/).some((w) => w.length > 3 && msg.includes(w))) {
      const details = getCareerDetails(title);
      if (details && (details.simpleSummary || details.skills.length)) {
        let out = `**${title}**\n\n${description}\n\n`;
        if (details.simpleSummary) out += `${details.simpleSummary}\n\n`;
        out += `Skills: ${details.skills.join(", ")}. Timeline: ${details.timeline}. `;
        if (details.salaryRange) out += details.salaryRange;
        out += `\n\nOpen this path from your dashboard after generating recommendations to see the full learning steps.`;
        return out;
      }
      return `**${title}**\n\n${description}\n\nTo see the full learning path, complete the assessment, generate recommendations on your dashboard, and open "${title}" from your results.`;
    }
  }

  // Assessment / profile
  if (/\b(assessment|profile|form|data|information)\b/.test(msg)) {
    return "The assessment has four steps: Basic info (name), Academics (education, subjects, strengths), Interests (hobbies, skills, work style), and Aspirations (dream roles, priorities, timeline). Your answers are used to match you to career paths. You can edit your profile anytime from the Dashboard.";
  }

  // Learning path / steps
  if (/\b(learning path|steps?|procedure|how to do|where to learn)\b/.test(msg)) {
    return "Each career has a **sequential learning path** with steps. For each step you'll see: **What to do** (goal), **How to do it** (step-by-step procedure), and **Where to learn** (resources). Generate recommendations on your dashboard, then open a career to view its full path.";
  }

  // Match / recommendation logic
  if (/\b(match|recommendation|score|why|based on)\b/.test(msg)) {
    return "Recommendations are based on your academics, interests, and aspirations. We match keywords (e.g. coding, data, design) and your dream roles to career paths and show a match percentage. Each result includes reasons why that path fits you. Generate recommendations on your dashboard after completing the assessment.";
  }

  // Salary / timeline
  if (/\b(salary|pay|money|timeline|duration|how long)\b/.test(msg)) {
    return "Salary ranges and timelines vary by career and are shown on each career path page after you generate recommendations. Typical timelines range from a few months (e.g. digital marketing, data analysis) to several years (e.g. healthcare, teaching) depending on the path.";
  }

  // Suggestions / what can you do
  if (/\b(suggest|suggestion|idea|recommend me|what should)\b/.test(msg)) {
    return "**Suggestions:**\n\n1. Complete the **assessment** if you haven’t — it improves your recommendations.\n2. On the **dashboard**, click **Generate recommendations** to see your top career matches.\n3. Open a career to see the **learning path** and follow the steps in order.\n4. Ask me to **explain a career** by name or \"explain this career\" when you’re on a path page.";
  }

  // Default
  return "I can help with:\n\n• **How to use the site** — assessment, dashboard, and recommendations\n• **What careers we offer** — list and short descriptions\n• **This career** — when you're on a path page, ask \"Explain this career path\"\n• **Learning paths** — what to do, how to do it, where to learn\n• **How recommendations work** — matching and match score\n\nAsk a specific question or click a suggestion below.";
}
