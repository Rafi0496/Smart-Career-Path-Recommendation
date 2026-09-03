"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { X, Send, Loader2, Sparkles, MessageSquare } from "lucide-react";
import { getActiveUser } from "@/lib/storage";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

function renderAssistantText(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-slate-900 dark:text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

/**
 * Custom Logo for "V" AI Assistant
 */
function VLogo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "w-6 h-6 text-xs",
    md: "w-8 h-8 text-sm",
    lg: "w-10 h-10 text-base",
  }[size];

  return (
    <div
      className={`relative ${sizeClasses} rounded-xl bg-gradient-to-tr from-cyan-500 via-primary-600 to-indigo-600 flex items-center justify-center font-black text-white shadow-md shadow-primary-500/30 select-none`}
    >
      <span className="tracking-tighter font-extrabold italic font-mono">V</span>
      <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 border border-white dark:border-slate-900" />
    </div>
  );
}

export default function AIAssistant() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showHint, setShowHint] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentCareer = pathname === "/career-path" ? searchParams.get("title") || undefined : undefined;
  const [userName, setUserName] = useState<string | undefined>(undefined);

  useEffect(() => {
    const active = getActiveUser();
    // Strictly read from active logged-in user; if none, keep undefined
    setUserName(active?.name);
  }, [open, pathname]);

  const context = { userName, currentCareer };

  const suggestedQuestions = [
    ...(currentCareer ? [`Explain more about ${currentCareer}`, "What should I do first in this path?"] : []),
    "What careers do you recommend?",
    "How do I get started?",
    "How does the matching work?",
    "What is the learning path?",
  ].filter((v, i, a) => a.indexOf(v) === i).slice(0, 5);

  // Generate initial welcome message whenever assistant is opened
  useEffect(() => {
    if (open && messages.length === 0) {
      let welcome = "";
      if (userName && userName.trim()) {
        welcome = `Hello, ${userName.trim()}! I'm **V**, your AI career assistant. `;
      } else {
        welcome = "Hello! I'm **V**, your AI career assistant. ";
      }

      if (currentCareer) {
        welcome += `You're viewing **${currentCareer}**. Ask V anything about this path, required skills, or your learning roadmap!`;
      } else {
        welcome += "I can help with career paths, how to use this site, and explore your recommendations. What would you like to know?";
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
      const content = data.content || "I couldn't generate a response. Please try asking V again.";
      setMessages((m) => [...m, { role: "assistant", content }]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Something went wrong. Please check your connection and ask V again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Acknowledgment Hint for V */}
      {showHint && !open && (
        <aside
          aria-label="AI Assistant Tip"
          className="fixed bottom-24 right-6 z-40 max-w-xs animate-page-enter transition-all duration-300"
        >
          <div className="relative rounded-2xl bg-white/95 dark:bg-slate-900/95 p-3.5 shadow-xl border border-primary-200 dark:border-primary-500/40 backdrop-blur-md">
            <div className="flex items-start gap-2.5">
              <VLogo size="sm" />
              <div className="flex-1 text-xs">
                <div className="flex items-center gap-1 font-semibold text-primary-600 dark:text-primary-400">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Meet V</span>
                </div>
                <p className="text-slate-700 dark:text-slate-300 mt-0.5 leading-snug">
                  Ask <strong>V</strong> anything you want about career paths, skills, or your roadmap!
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setShowHint(false);
                    setOpen(true);
                  }}
                  className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-primary-600 dark:text-primary-400 hover:underline"
                >
                  <MessageSquare className="w-3 h-3" />
                  Ask V now
                </button>
              </div>
              <button
                type="button"
                onClick={() => setShowHint(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
                aria-label="Dismiss hint"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* Floating Action Button */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-cyan-600 via-primary-600 to-indigo-600 text-white shadow-xl hover:shadow-primary-500/40 transition-all duration-300 btn-3d group"
        aria-label="Open V AI assistant"
      >
        <div className="relative flex items-center justify-center">
          <span className="font-extrabold italic text-xl font-mono tracking-tighter">V</span>
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-primary-600 animate-pulse" />
        </div>
      </button>

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-40 flex w-[calc(100vw-2rem)] max-w-md flex-col rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 shadow-2xl overflow-hidden backdrop-blur-xl animate-page-enter">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/80 px-5 py-3.5">
            <div className="flex items-center gap-3">
              <VLogo size="md" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 dark:text-white text-base">V</span>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-primary-100 dark:bg-primary-950/80 text-primary-700 dark:text-primary-300">
                    AI Career Navigator
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Ready to guide you
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-700/60 transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex flex-col max-h-[min(70vh,460px)]">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Acknowledgement banner inside chat */}
              <div className="p-2.5 rounded-xl bg-primary-50/60 dark:bg-primary-950/40 border border-primary-100 dark:border-primary-900/40 text-[12px] text-slate-600 dark:text-slate-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary-600 dark:text-primary-400 shrink-0" />
                <span>
                  Ask <strong>V</strong> anything you want about careers, skills, certifications, or how to use the site.
                </span>
              </div>

              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                      msg.role === "user"
                        ? "bg-primary-600 text-white shadow-sm"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 shadow-sm border border-slate-200/50 dark:border-slate-700/50"
                    }`}
                  >
                    {msg.role === "assistant" ? (
                      <div className="whitespace-pre-wrap leading-relaxed">
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
                  <div className="rounded-2xl bg-slate-100 dark:bg-slate-800 px-4 py-2.5 border border-slate-200/50 dark:border-slate-700/50">
                    <Loader2 className="w-4 h-4 animate-spin text-primary-500" />
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Suggestions */}
            {suggestedQuestions.length > 0 && messages.length <= 1 && (
              <div className="px-4 pb-2">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
                  Suggested topics for V:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {suggestedQuestions.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => send(q)}
                      disabled={loading}
                      className="text-left text-xs px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-primary-50 dark:hover:bg-primary-950/60 hover:text-primary-600 dark:hover:text-primary-400 hover:border-primary-200 transition btn-3d"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Form */}
            <form
              className="border-t border-slate-100 dark:border-slate-800 p-3 bg-white dark:bg-slate-900"
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
                  placeholder="Ask V about careers, skills, or roadmaps..."
                  className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-40 transition btn-3d shadow-md shadow-primary-500/20"
                  aria-label="Send message to V"
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
