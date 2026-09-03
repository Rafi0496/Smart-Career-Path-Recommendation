"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  LogIn,
  KeyRound,
  Mail,
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  ArrowLeft,
  User,
  Unlock,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import {
  loginUser,
  getActiveUser,
  verifyUserForRecovery,
  updateUserPassword,
} from "@/lib/storage";
import type { UserAccount } from "@/lib/types";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get("redirect") || "/dashboard";

  // Login view states
  const [viewMode, setViewMode] = useState<"login" | "forgot">("login");
  const [emailOrName, setEmailOrName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Forgot password flow states
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [recoveryName, setRecoveryName] = useState("");
  const [recoveryStep, setRecoveryStep] = useState<"verify" | "authenticated">("verify");
  const [recoveredUser, setRecoveredUser] = useState<UserAccount | null>(null);
  const [showRecoveredPassword, setShowRecoveredPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [recoveryError, setRecoveryError] = useState("");
  const [recoverySuccess, setRecoverySuccess] = useState("");

  useEffect(() => {
    const active = getActiveUser();
    if (active) {
      router.push(redirectTarget);
    }
  }, [router, redirectTarget]);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = loginUser(emailOrName, password);
    if (!result.success) {
      setError(result.error || "Login failed. Please check your credentials.");
      setLoading(false);
      return;
    }

    window.dispatchEvent(new Event("auth-change"));
    router.push(redirectTarget);
  };

  const handleVerifyIdentity = (e: React.FormEvent) => {
    e.preventDefault();
    setRecoveryError("");
    setRecoverySuccess("");

    const result = verifyUserForRecovery(recoveryEmail, recoveryName);
    if (!result.success || !result.user) {
      setRecoveryError(result.error || "Authentication failed. No matching account found.");
      return;
    }

    setRecoveredUser(result.user);
    setRecoveryStep("authenticated");
    setRecoverySuccess("Identity verified successfully! You can view your last password or set a new one.");
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setRecoveryError("");

    if (!recoveredUser) return;
    if (newPassword.length < 4) {
      setRecoveryError("Password must be at least 4 characters.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setRecoveryError("New passwords do not match.");
      return;
    }

    const res = updateUserPassword(recoveredUser.id, newPassword);
    if (!res.success) {
      setRecoveryError(res.error || "Failed to update password.");
      return;
    }

    // Auto-login with the new password
    loginUser(recoveredUser.email, newPassword);
    window.dispatchEvent(new Event("auth-change"));
    router.push(redirectTarget);
  };

  const handleUseLastPasswordToLogin = () => {
    if (!recoveredUser) return;
    setEmailOrName(recoveredUser.email);
    setPassword(recoveredUser.password || "");
    setViewMode("login");
    // Trigger login directly
    loginUser(recoveredUser.email, recoveredUser.password || "");
    window.dispatchEvent(new Event("auth-change"));
    router.push(redirectTarget);
  };

  return (
    <div className="w-full max-w-md">
      <div className="glass-panel bg-white/95 dark:bg-[#131b2e] rounded-3xl p-7 sm:p-9 border border-slate-200/80 dark:border-slate-700 shadow-2xl animate-fade-in-up">
        {/* =========================================================================
            VIEW 1: STANDARD LOGIN
           ========================================================================= */}
        {viewMode === "login" && (
          <>
            <div className="text-center mb-8">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-100 dark:bg-primary-950/90 text-primary-600 dark:text-primary-300 mb-3 shadow-inner">
                <LogIn className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                Welcome Back
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                Sign in to access your World Profile & recommendations
              </p>
            </div>

            {error && (
              <div className="mb-6 flex items-center gap-2.5 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/70 text-rose-700 dark:text-rose-200 text-sm animate-fade-in-up">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-200 mb-1.5">
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
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setViewMode("forgot");
                      setRecoveryStep("verify");
                      setRecoveryError("");
                      setRecoverySuccess("");
                      if (emailOrName.includes("@")) {
                        setRecoveryEmail(emailOrName);
                      }
                    }}
                    className="text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 pl-10 pr-10 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
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

            <div className="mt-6 text-center text-sm text-slate-600 dark:text-slate-300">
              New here?{" "}
              <Link
                href={`/register${redirectTarget !== "/dashboard" ? `?redirect=${encodeURIComponent(redirectTarget)}` : ""}`}
                className="font-semibold text-primary-600 dark:text-primary-400 hover:underline"
              >
                Create an account
              </Link>
            </div>
          </>
        )}

        {/* =========================================================================
            VIEW 2: FORGOT PASSWORD SECTION (AUTHENTICATION & RECOVERY)
           ========================================================================= */}
        {viewMode === "forgot" && (
          <div>
            <div className="flex items-center gap-2 mb-6">
              <button
                type="button"
                onClick={() => setViewMode("login")}
                className="p-1.5 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                title="Back to Login"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Password Recovery
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-300">
                  Authenticate your account to view or reset your password
                </p>
              </div>
            </div>

            {recoveryError && (
              <div className="mb-5 flex items-center gap-2.5 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/70 text-rose-700 dark:text-rose-200 text-xs sm:text-sm animate-fade-in-up">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{recoveryError}</span>
              </div>
            )}

            {recoverySuccess && (
              <div className="mb-5 flex items-center gap-2.5 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900/70 text-emerald-800 dark:text-emerald-200 text-xs sm:text-sm animate-fade-in-up">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <span>{recoverySuccess}</span>
              </div>
            )}

            {/* STEP 1: AUTHENTICATE IDENTITY */}
            {recoveryStep === "verify" && (
              <form onSubmit={handleVerifyIdentity} className="space-y-4">
                <div className="p-3.5 rounded-2xl bg-primary-50 dark:bg-[#16233f] border border-primary-200 dark:border-primary-800/80 text-xs text-slate-700 dark:text-slate-200 mb-2">
                  <div className="flex items-center gap-2 font-semibold text-primary-900 dark:text-primary-300 mb-1">
                    <ShieldCheck className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                    <span>Authentication Step</span>
                  </div>
                  Enter your registered email and the full name on your account to verify your identity.
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-200 mb-1.5">
                    Registered Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={recoveryEmail}
                      onChange={(e) => setRecoveryEmail(e.target.value)}
                      placeholder="e.g. john@example.com"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-200 mb-1.5">
                    Account Owner Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={recoveryName}
                      onChange={(e) => setRecoveryName(e.target.value)}
                      placeholder="e.g. Shaik Rafi"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 rounded-xl shadow-lg shadow-primary-500/25 transition btn-3d mt-2 text-sm"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Authenticate & Recover Password</span>
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => setViewMode("login")}
                    className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 underline"
                  >
                    Remembered it? Back to Login
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2: AUTHENTICATED -> KNOW LAST PASSWORD OR CREATE NEW ONE */}
            {recoveryStep === "authenticated" && recoveredUser && (
              <div className="space-y-6">
                {/* Option A: Know Your Old / Last Password */}
                <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                      <Unlock className="w-3.5 h-3.5 text-amber-500" />
                      <span>Your Last / Current Password</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowRecoveredPassword(!showRecoveredPassword)}
                      className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
                    >
                      {showRecoveredPassword ? (
                        <>
                          <EyeOff className="w-3.5 h-3.5" />
                          <span>Hide</span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-3.5 h-3.5" />
                          <span>Reveal Password</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="flex items-center justify-between bg-white dark:bg-slate-900 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 mb-3">
                    <span className="font-mono text-base font-bold text-slate-900 dark:text-white tracking-wider">
                      {showRecoveredPassword
                        ? recoveredUser.password || "No password set"
                        : "••••••••••••"}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleUseLastPasswordToLogin}
                    className="w-full flex items-center justify-center gap-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-white font-semibold py-2 rounded-xl transition text-xs btn-3d"
                  >
                    <span>Sign In With This Password</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Option B: Create a New Password */}
                <form onSubmit={handleUpdatePassword} className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-700">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                    Or Create a New Password:
                  </p>

                  <div>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password (min 4 chars)"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                    />
                  </div>

                  <div>
                    <input
                      type="password"
                      required
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary-600 to-emerald-600 hover:from-primary-700 hover:to-emerald-700 text-white font-bold py-2.5 rounded-xl shadow-md transition btn-3d text-sm"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Save New Password & Sign In</span>
                  </button>
                </form>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => setViewMode("login")}
                    className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 underline"
                  >
                    ← Return to standard login
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-primary-50/20 to-emerald-50/30 dark:from-[#0b0f19] dark:via-[#0f172a] dark:to-[#0b0f19] text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-300">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-4 py-12">
        <Suspense fallback={<div className="w-8 h-8 rounded-full border-2 border-primary-600 border-t-transparent animate-spin" />}>
          <LoginForm />
        </Suspense>
      </main>
    </div>
  );
}
