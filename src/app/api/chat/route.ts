import { NextResponse } from "next/server";
import { getFallbackResponse } from "@/lib/assistant-fallback";

export const maxDuration = 30;

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface AssistantContext {
  userName?: string;
  currentCareer?: string;
}

const SYSTEM_PROMPT = [
  "You are 'V', a highly intelligent, knowledgeable, and enthusiastic AI career navigator for 'Smart Career Path'.",
  "You are an EXPERT on all career paths, industries, technologies, skills, education, and professional development.",
  "You MUST answer ANY question the user asks — whether it's about careers, technology, coding, science, history, general knowledge, or anything else.",
  "When asked about a specific career or role, provide DEEP, DETAILED answers covering: day-to-day responsibilities, required skills (technical and soft), career progression, salary ranges, top companies, industry trends, certifications, interview tips, and learning resources.",
  "When asked technical questions (e.g. 'What is machine learning?', 'How does React work?'), give thorough, educational explanations.",
  "When asked comparison questions (e.g. 'Frontend vs Backend', 'Data Science vs AI'), provide balanced, detailed comparisons.",
  "You are NOT limited to website navigation help. You are a full-featured AI assistant with broad knowledge.",
  "Always respond in a friendly, professional, and encouraging tone. Use markdown formatting with **bold** for emphasis.",
  "Keep responses thorough but well-structured. Use bullet points and sections for long answers.",
  "If the user asks about something you don't know, admit it honestly but try to provide what you can.",
].join(" ");

function buildSystemMessage(context?: AssistantContext): string {
  const parts = [SYSTEM_PROMPT];
  if (context?.userName && context.userName !== "Anonymous") {
    parts.push(`The user's name is ${context.userName}. Address them by name occasionally.`);
  }
  if (context?.currentCareer) {
    parts.push(
      `The user is currently viewing the "${context.currentCareer}" career path page. ` +
      `If they ask about "this career" or "this role", they mean ${context.currentCareer}. ` +
      `Provide extremely detailed information about ${context.currentCareer} including responsibilities, skills, salary, growth, and learning path.`
    );
  }
  return parts.join(" ");
}

/** Attempt 1: Groq API (ultra-fast, Llama 3 models) */
async function tryGroq(
  systemMessage: string,
  messages: Message[]
): Promise<string | null> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return null;

  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemMessage },
          ...messages.slice(-12).map((m) => ({ role: m.role, content: m.content })),
        ],
        max_tokens: 1500,
        temperature: 0.7,
        top_p: 0.9,
      }),
      signal: AbortSignal.timeout(15000),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Groq API error:", res.status, err);
      return null;
    }

    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    return data.choices?.[0]?.message?.content?.trim() || null;
  } catch (e) {
    console.error("Groq request failed:", e);
    return null;
  }
}

/** Attempt 2: Google Gemini API */
async function tryGemini(
  systemMessage: string,
  messages: Message[]
): Promise<string | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  try {
    const geminiMessages = messages.slice(-12).map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: systemMessage }],
          },
          contents: geminiMessages,
          generationConfig: {
            temperature: 0.7,
            topP: 0.9,
            maxOutputTokens: 1500,
          },
        }),
        signal: AbortSignal.timeout(15000),
      }
    );

    if (!res.ok) {
      const err = await res.text();
      console.error("Gemini API error:", res.status, err);
      return null;
    }

    const data = (await res.json()) as {
      candidates?: { content?: { parts?: { text?: string }[] } }[];
    };
    return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || null;
  } catch (e) {
    console.error("Gemini request failed:", e);
    return null;
  }
}

/** Attempt 3: OpenAI API (if user has key) */
async function tryOpenAI(
  systemMessage: string,
  messages: Message[]
): Promise<string | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemMessage },
          ...messages.slice(-12).map((m) => ({ role: m.role, content: m.content })),
        ],
        max_tokens: 1500,
        temperature: 0.7,
      }),
      signal: AbortSignal.timeout(15000),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("OpenAI API error:", res.status, err);
      return null;
    }

    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    return data.choices?.[0]?.message?.content?.trim() || null;
  } catch (e) {
    console.error("OpenAI request failed:", e);
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const messages: Message[] = Array.isArray(body.messages) ? body.messages : [];
    const context: AssistantContext | undefined = body.context;
    const lastUser = messages.filter((m) => m.role === "user").pop();
    const userContent = lastUser?.content?.trim() || "";

    if (!userContent) {
      return NextResponse.json(
        { error: "No user message provided" },
        { status: 400 }
      );
    }

    const systemMessage = buildSystemMessage(context);

    // Try providers in order: Groq (fastest) → Gemini → OpenAI → built-in fallback
    const content =
      (await tryGroq(systemMessage, messages)) ??
      (await tryGemini(systemMessage, messages)) ??
      (await tryOpenAI(systemMessage, messages)) ??
      getFallbackResponse(userContent, context);

    return NextResponse.json({ content });
  } catch (e) {
    console.error("Chat API error:", e);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
