"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import { getStoredProfile } from "@/lib/storage";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

function renderAssistantText(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} className="font-semibold text-slate-800">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

export default function AIAssistant() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentCareer = pathname === "/career-path" ? searchParams.get("title") || undefined : undefined;
  const [userName, setUserName] = useState<string | undefined>(undefined);
  useEffect(() => {
    setUserName(getStoredProfile()?.name);
  }, [open, pathname]);
  const context = { userName, currentCareer };

  const suggestedQuestions = [
    ...(currentCareer ? [`Explain more about ${currentCareer}`, "What should I do first in this path?"] : []),
    "What careers do you recommend?",
    "How do I get started?",
    "How does the matching work?",
    "What is the learning path?",
  ].filter((v, i, a) => a.indexOf(v) === i).slice(0, 5);

  useEffect(() => {
    if (open && messages.length === 0) {
      let welcome = "Hello";
      if (userName && userName !== "Anonymous") welcome += `, ${userName}`;
      welcome += "! I'm your career assistant. ";
      if (currentCareer) {
        welcome += `You're viewing **${currentCareer}**. Ask me to explain this path or anything about the site.`;
      } else {
        welcome += "I can help with career paths, how to use this site, and your recommendations. What would you like to know?";
      }
      setMessages([{ role: "assistant", content: welcome }]);
    }
  }, [open, messages.length, userName, currentCareer]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const send = async (textOverride?: string) => {
    const text = (textOverride ?? input.trim()).trim();
    if (!text || loading) return;
    if (!textOverride) setInput("");
    const userMsg: ChatMessage = { role: "user", content: text };
    setMessages((m) => [...m, userMsg]);
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({ role: m.role, content: m.content })),
          context,
        }),
      });
      const data = await res.json();
      const content = data.content || "I couldn't generate a response. Please try again.";
      setMessages((m) => [...m, { role: "assistant", content }]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Something went wrong. Please check your connection and try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary-600 text-white shadow-lg hover:bg-primary-700 transition-all btn-3d"
        aria-label="Open AI assistant"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-40 flex w-full max-w-md flex-col rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-4 py-3">
            <span className="font-semibold text-slate-900">AI Assistant</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="p-2 rounded-lg text-slate-500 hover:bg-slate-200 transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex flex-col max-h-[min(70vh,420px)]">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                      msg.role === "user"
                        ? "bg-primary-600 text-white"
                        : "bg-slate-100 text-slate-800"
                    }`}
                  >
                    {msg.role === "assistant" ? (
                      <div className="whitespace-pre-wrap">
                        {renderAssistantText(msg.content)}
                      </div>
                    ) : (
                      msg.content
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="rounded-2xl bg-slate-100 px-4 py-2.5">
                    <Loader2 className="w-4 h-4 animate-spin text-slate-500" />
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
            {suggestedQuestions.length > 0 && messages.length <= 1 && (
              <div className="px-4 pb-2">
                <p className="text-xs font-medium text-slate-500 mb-2">Suggestions:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestedQuestions.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => send(q)}
                      disabled={loading}
                      className="text-left text-xs px-3 py-1.5 rounded-lg bg-primary-50 text-primary-700 border border-primary-100 hover:bg-primary-100 transition btn-3d"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <form
              className="border-t border-slate-100 p-3"
              onSubmit={(e) => {
                e.preventDefault();
                send();
              }}
            >
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about careers or how to use the site..."
                  className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 btn-3d"
                  aria-label="Send"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
