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
 * Decent, modern SVG Logo for "V" AI Assistant
 */
export function VLogo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      className={`${className} shrink-0 drop-shadow-sm select-none`}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="vGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0284c7" />
          <stop offset="50%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#4f46e5" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="12" fill="url(#vGrad)" />
      <path
        d="M11 13L20 29L29 13H24.5L20 22.2L15.5 13H11Z"
        fill="white"
      />
      <circle cx="20" cy="9.5" r="1.8" fill="#38bdf8" />
    </svg>
  );
}

export default function AIAssistant() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentCareer = pathname === "/career-path" ? searchParams.get("title") || undefined : undefined;
  const [userName, setUserName] = useState<string | undefined>(undefined);

  useEffect(() => {
    const active = getActiveUser();
    setUserName(active?.name);
  }, [open, pathname]);

  // Professional Hint: ONLY POPS UP ONCE EVER for 4.5 seconds, then disappears permanently
  useEffect(() => {
    if (typeof window === "undefined") return;
    const hasSeenHint = localStorage.getItem("v_assistant_intro_seen");
    if (!hasSeenHint) {
      // Show briefly on first visit
      setShowHint(true);
      const timer = setTimeout(() => {
        setShowHint(false);
        localStorage.setItem("v_assistant_intro_seen", "true");
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, []);

  const dismissHint = () => {
    setShowHint(false);
    if (typeof window !== "undefined") {
      localStorage.setItem("v_assistant_intro_seen", "true");
    }
  };

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
      {/* Floating Acknowledgment Hint for V: Only pops up once, professional, auto-dismisses */}
      {showHint && !open && (
        <aside
          aria-label="AI Assistant Introduction"
          className="fixed bottom-24 right-6 z-40 max-w-sm animate-fade-in-up transition-opacity duration-500"
        >
          <div className="rounded-2xl bg-white/95 dark:bg-slate-900/95 p-3.5 shadow-xl border border-slate-200/80 dark:border-slate-800 backdrop-blur-md flex items-center gap-3">
            <VLogo className="w-7 h-7" />
            <div className="flex-1 text-xs">
              <span className="font-bold text-slate-900 dark:text-white">Meet V</span>
              <p className="text-slate-600 dark:text-slate-400 mt-0.5 leading-snug">
                Ask V questions about career roadmaps, skills, and advice anytime.
              </p>
            </div>
            <button
              type="button"
              onClick={dismissHint}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </aside>
      )}

      {/* Floating Action Button */}
      <button
        type="button"
        onClick={() => {
          dismissHint();
          setOpen((o) => !o);
        }}
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary-600 to-indigo-600 text-white shadow-xl hover:shadow-primary-500/30 transition-all duration-300 btn-3d group"
        aria-label="Open V AI assistant"
      >
        <VLogo className="w-8 h-8 group-hover:scale-105 transition-transform" />
      </button>

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-40 flex w-[calc(100vw-2rem)] max-w-md flex-col rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-[#111827]/95 shadow-2xl overflow-hidden backdrop-blur-xl animate-fade-in-up">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900/90 px-5 py-3.5">
            <div className="flex items-center gap-3">
              <VLogo className="w-8 h-8" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 dark:text-white text-base">V</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-300">
                    AI Career Navigator
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Active Assistant
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex flex-col max-h-[min(70vh,460px)]">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="p-3 rounded-2xl bg-primary-50 dark:bg-[#16223d] border border-primary-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-100 flex items-center gap-2.5 shadow-sm">
                <Sparkles className="w-4 h-4 text-primary-600 dark:text-primary-300 shrink-0" />
                <span>Ask <strong className="font-bold text-slate-900 dark:text-white">V</strong> about career roadmaps, skill milestones, or site navigation.</span>
              </div>

              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                      msg.role === "user"
                        ? "bg-primary-600 text-white shadow-sm font-medium"
                        : "bg-slate-100 dark:bg-[#162035] text-slate-900 dark:text-slate-100 shadow-sm border border-slate-200/60 dark:border-slate-700"
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
                  <div className="rounded-2xl bg-slate-100 dark:bg-slate-800 px-4 py-2.5 border border-slate-200/60 dark:border-slate-700/60">
                    <Loader2 className="w-4 h-4 animate-spin text-primary-500" />
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Suggested Question Chips */}
            {suggestedQuestions.length > 0 && messages.length <= 1 && (
              <div className="px-4 pb-2">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
                  Suggested topics:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {suggestedQuestions.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => send(q)}
                      disabled={loading}
                      className="text-left text-xs px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 hover:bg-primary-50 dark:hover:bg-slate-700 hover:text-primary-600 dark:hover:text-primary-300 transition btn-3d"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Form */}
            <form
              className="border-t border-slate-100 dark:border-slate-800 p-3 bg-white dark:bg-[#111827]"
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
                  className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition"
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
