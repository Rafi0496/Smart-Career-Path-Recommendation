"use client";

import { useEffect, useState } from "react";
import { Sparkles, X, CheckCircle } from "lucide-react";
import { getAndClearLoginToast } from "@/lib/storage";

export default function LoginAcknowledgement() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const checkToast = () => {
      const msg = getAndClearLoginToast();
      if (msg) {
        setToastMessage(msg);
        setVisible(true);
        const timer = setTimeout(() => {
          setVisible(false);
        }, 5000);
        return () => clearTimeout(timer);
      }
    };

    checkToast();
    window.addEventListener("auth-change", checkToast);
    return () => window.removeEventListener("auth-change", checkToast);
  }, []);

  if (!visible || !toastMessage) return null;

  return (
    <div className="fixed top-5 right-5 z-50 max-w-md animate-page-enter">
      <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-primary-300 dark:border-primary-500/50 shadow-2xl backdrop-blur-md">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-primary-600 to-emerald-500 text-white shadow-md shadow-primary-500/20">
          <CheckCircle className="w-5 h-5" />
        </div>
        <div className="flex-1 pr-1">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            Session Acknowledged
          </div>
          <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
            {toastMessage}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setVisible(false)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          aria-label="Dismiss toast"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
