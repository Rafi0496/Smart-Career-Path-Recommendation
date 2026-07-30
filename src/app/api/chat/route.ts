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

    const apiKey = process.env.OPENAI_API_KEY;
    const systemContext = [
      "You are a highly intelligent and helpful AI assistant for 'Smart Career Path'.",
      "While your primary domain is career recommendation, you must think beyond the main topic and answer ANY query given by the user.",
      "If the user says 'Hi' or asks general knowledge questions, answer them naturally and dynamically.",
      context?.userName && `The user's name is ${context.userName}. Greet them by name when relevant.`,
      context?.currentCareer && `The user is currently viewing the "${context.currentCareer}" career path page. If they ask to "explain this career", give a detailed explanation of ${context.currentCareer}.`,
    ].filter(Boolean).join(" ");

    if (apiKey) {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: systemContext },
            ...messages.slice(-10).map((m) => ({ role: m.role, content: m.content })),
          ],
          max_tokens: 600,
          temperature: 0.7,
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        console.error("OpenAI API error:", res.status, err);
        return NextResponse.json(
          { content: getFallbackResponse(userContent, context) },
          { status: 200 }
        );
      }

      const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
      const content = data.choices?.[0]?.message?.content?.trim() || getFallbackResponse(userContent, context);
      return NextResponse.json({ content });
    }

    const content = getFallbackResponse(userContent, context);
    return NextResponse.json({ content });
  } catch (e) {
    console.error("Chat API error:", e);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
