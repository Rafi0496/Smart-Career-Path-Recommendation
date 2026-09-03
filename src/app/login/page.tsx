"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Compass, LogIn, KeyRound, Mail, AlertCircle, ArrowRight, CheckCircle2, Eye, EyeOff } from "lucide-react";
import Navbar from "@/components/Navbar";
import { loginUser, getAllUsers, getActiveUser } from "@/lib/storage";
import type { UserAccount } from "@/lib/types";

export default function LoginPage() {
  const router = useRouter();
  const [emailOrName, setEmailOrName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [savedUsers, setSavedUsers] = useState<UserAccount[]>([]);

  useEffect(() => {
    // If already logged in, redirect to dashboard
    const active = getActiveUser();
    if (active) {
      router.push("/dashboard");
    }
    setSavedUsers(getAllUsers());
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = loginUser(emailOrName, password);
    if (!result.success) {
      setError(result.error || "Login failed. Please check your credentials.");
      setLoading(false);
      return;
    }

    // Success
    window.dispatchEvent(new Event("auth-change"));
    router.push("/dashboard");
  };

  const handleQuickLogin = (user: UserAccount) => {
    setEmailOrName(user.email);
    if (user.password) {
      setPassword(user.password);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-primary-50/20 to-emerald-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-md">
          {/* Main Card */}
          <div className="glass-panel bg-white/85 dark:bg-slate-900/85 rounded-3xl p-7 sm:p-9 border border-slate-200/80 dark:border-slate-800 shadow-xl">
            <div className="text-center mb-8">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-100 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 mb-3 shadow-inner">
                <LogIn className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                Welcome Back
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Sign in to access your World Profile & recommendations
              </p>
            </div>

            {error && (
              <div className="mb-6 flex items-center gap-2.5 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 text-sm animate-page-enter">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Email or Username
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={emailOrName}
                    onChange={(e) => setEmailOrName(e.target.value)}
                    placeholder="e.g. john@example.com or John"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-800/90 pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-800/90 pl-10 pr-10 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 rounded-xl shadow-lg shadow-primary-500/25 transition disabled:opacity-60 btn-3d mt-2"
              >
                <span>{loading ? "Signing in..." : "Sign In to Dashboard"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Saved Accounts helper if any exist */}
            {savedUsers.length > 0 && (
              <div className="mt-6 pt-5 border-t border-slate-200/80 dark:border-slate-800">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
                  Existing Registered Users on this browser:
                </p>
                <div className="flex flex-wrap gap-2">
                  {savedUsers.map((u) => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => handleQuickLogin(u)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-primary-50 dark:hover:bg-primary-950/60 hover:text-primary-600 dark:hover:text-primary-400 border border-slate-200 dark:border-slate-700 transition"
                      title={`Click to fill ${u.email}`}
                    >
                      <CheckCircle2 className="w-3 h-3 text-primary-500" />
                      <span>{u.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Register link */}
            <div className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
              New here?{" "}
              <Link
                href="/register"
                className="font-semibold text-primary-600 dark:text-primary-400 hover:underline"
              >
                Create a new account
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
