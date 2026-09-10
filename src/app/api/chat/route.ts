import { NextResponse } from "next/server";
import { getFallbackResponse } from "@/lib/assistant-fallback";

export const maxDuration = 45;

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface AssistantContext {
  userName?: string;
  currentCareer?: string;
}

const SYSTEM_PROMPT = `
You are "V", an extraordinarily intelligent, inspiring, empathetic, and deeply knowledgeable AI Career Mentor & Polymath Guide for "Smart Career Path".

YOUR CORE IDENTITY & MISSION:
1. UNBOUNDED INTELLIGENCE: You possess deep, comprehensive knowledge across all fields: software engineering, data science, AI/ML, cloud, cybersecurity, product management, design, medicine, finance, business, humanities, science, and life skills.
2. ANSWER ANY QUESTION: You must answer ANY type of question the user asks with clarity, depth, and mastery. You are NOT restricted to site navigation. Whether they ask about complex coding bugs, career roadmaps, salary negotiations, industry trends, science, philosophy, or overcoming imposter syndrome, give them a brilliant, high-value answer.
3. RELENTLESS OPTIMISM & ENCOURAGEMENT: Radiate optimism, warmth, and genuine confidence in the user's potential. Every obstacle has a solution. Celebrate their curiosity, uplift their spirits, and inspire them to dream big and take action.
4. PROBLEM SOLVING & DOUBT CLEARING: Directly diagnose the user's situation. Provide structured, step-by-step solutions with concrete examples, best practices, and actionable advice.
5. PROACTIVE FOLLOW-UP: Never end with a dead-end answer. Always anticipate their next hurdle and offer 1 or 2 exciting, thoughtful follow-up questions or options (e.g., "Would you like to build a quick project to practice this, or explore how to put this on your resume?").
6. FORMATTING: Use clean, beautiful markdown with **bold highlights**, bullet points, numbered steps, and code blocks where helpful to ensure effortless readability.
`.trim();

function buildSystemMessage(context?: AssistantContext): string {
  const parts = [SYSTEM_PROMPT];
  if (context?.userName && context.userName !== "Anonymous" && context.userName !== "Candidate") {
    parts.push(`The user's name is ${context.userName}. Greet or address them warmly and personally by name when appropriate.`);
  }
  if (context?.currentCareer) {
    parts.push(
      `The user is currently exploring the "${context.currentCareer}" career path. ` +
      `If they ask about "this career", "this roadmap", or role specifics, provide deep insights specifically tailored to ${context.currentCareer}.`
    );
  }
  return parts.join("\n\n");
}

/** Attempt 1: Google Gemini API (gemini-3.6-flash) - fast, ultra-smart */
async function tryGemini(
  systemMessage: string,
  messages: Message[]
): Promise<string | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  try {
    const contents = messages.slice(-12).map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    // Ensure the conversation starts with a user turn for Gemini API compliance
    if (contents.length > 0 && contents[0].role === "model") {
      contents.shift();
    }

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: systemMessage }],
          },
          contents: contents.length > 0 ? contents : [{ role: "user", parts: [{ text: "Hello!" }] }],
          generationConfig: {
            temperature: 0.75,
            topP: 0.95,
            maxOutputTokens: 2048,
          },
        }),
        signal: AbortSignal.timeout(18000),
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

/** Attempt 2: Groq API with powerful models (openai/gpt-oss-120b, groq/compound, qwen/qwen3.8-27b) */
async function tryGroq(
  systemMessage: string,
  messages: Message[]
): Promise<string | null> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return null;

  const candidateModels = ["openai/gpt-oss-120b", "groq/compound", "qwen/qwen3.8-27b"];

  for (const model of candidateModels) {
    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: model,
          messages: [
            { role: "system", content: systemMessage },
            ...messages.slice(-12).map((m) => ({ role: m.role, content: m.content })),
          ],
          max_tokens: 2048,
          temperature: 0.75,
          top_p: 0.9,
        }),
        signal: AbortSignal.timeout(15000),
      });

      if (!res.ok) {
        console.warn(`Groq model ${model} failed with status:`, res.status);
        continue;
      }

      const data = (await res.json()) as {
        choices?: { message?: { content?: string } }[];
      };
      const text = data.choices?.[0]?.message?.content?.trim();
      if (text) return text;
    } catch (e) {
      console.warn(`Groq request for ${model} encountered error:`, e);
    }
  }

  return null;
}

/** Attempt 3: OpenAI API (if configured by user) */
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
        max_tokens: 2048,
        temperature: 0.75,
      }),
      signal: AbortSignal.timeout(15000),
    });

    if (!res.ok) {
      return null;
    }

    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    return data.choices?.[0]?.message?.content?.trim() || null;
  } catch {
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

    // Multi-tier AI execution: Gemini 3.6 Flash -> Groq (GPT 120B / Compound) -> OpenAI -> Offline Fallback
    const content =
      (await tryGemini(systemMessage, messages)) ??
      (await tryGroq(systemMessage, messages)) ??
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
