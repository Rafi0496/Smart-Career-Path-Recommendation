"use client";

import Link from "next/link";
import {
  Compass,
  GraduationCap,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Target,
  Layers,
  Bot,
  TrendingUp,
  Award,
  CheckCircle2,
  BookOpen,
} from "lucide-react";
import Navbar from "@/components/Navbar";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-primary-50/20 to-emerald-50/30 dark:from-[#090d16] dark:via-slate-900 dark:to-[#090d16] text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <Navbar />

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-20 md:pt-24 md:pb-28">
        <section className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary-100 dark:bg-primary-950/80 border border-primary-200/60 dark:border-primary-800 text-primary-700 dark:text-primary-300 px-4 py-1.5 text-xs sm:text-sm font-semibold mb-6 shadow-sm">
            <Sparkles className="w-4 h-4 text-primary-600 dark:text-primary-400" />
            <span>AI-Powered Career Intelligence</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6 leading-tight">
            Find your true path.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-sky-500 to-emerald-500">
              Build your future.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            For students and ambitious professionals rethinking their trajectory. We synthesize your
            academics, genuine interests, and long-term aspirations into a sequential, actionable
            roadmap to real-world success.
          </p>

          <div className="flex flex-col sm:flex-row gap-3.5 justify-center items-center">
            <Link
              href="/assessment"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-7 py-3.5 rounded-xl font-semibold shadow-lg shadow-primary-500/25 transition-all btn-3d"
            >
              <span>Start Assessment</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 px-7 py-3.5 rounded-xl font-semibold border border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-500 hover:bg-primary-50/50 dark:hover:bg-slate-800 shadow-sm transition-all btn-3d"
            >
              <span>Explore Dashboard</span>
            </Link>
          </div>
        </section>

        {/* Feature Cards Grid */}
        <section className="mt-20 grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div className="glass-panel bg-white/80 dark:bg-slate-900/80 rounded-2xl p-6 border border-slate-200/70 dark:border-slate-800 shadow-sm card-3d">
            <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-950/60 flex items-center justify-center mb-4 text-primary-600 dark:text-primary-400 shadow-inner">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-2">3-Pillar Profile</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              Your academic background, personal passions, and career dreams combined into a unified
              digital World Profile.
            </p>
          </div>

          <div className="glass-panel bg-white/80 dark:bg-slate-900/80 rounded-2xl p-6 border border-slate-200/70 dark:border-slate-800 shadow-sm card-3d">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center mb-4 text-emerald-600 dark:text-emerald-400 shadow-inner">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-2">
              Ranked Recommendations
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              Transparent match percentages, skill breakdown, timeline estimations, and exact reasons
              why each path fits you.
            </p>
          </div>

          <div className="glass-panel bg-white/80 dark:bg-slate-900/80 rounded-2xl p-6 border border-slate-200/70 dark:border-slate-800 shadow-sm card-3d sm:col-span-2 md:col-span-1">
            <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center mb-4 text-amber-600 dark:text-amber-400 shadow-inner">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-2">
              Sequential Roadmaps
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              Numbered, sequential procedures: what to do, how to do it step-by-step, and vetted
              online learning resources.
            </p>
          </div>
        </section>

        {/* ======================================================== */}
        {/* ABOUT SECTION (Professional, Structured, Non-paragraph)   */}
        {/* ======================================================== */}
        <section className="mt-32 pt-16 border-t border-slate-200/80 dark:border-slate-800/80">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>About Smart Career Path</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Intelligent Career Engineering
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-3">
              We replace guesswork and generic advice with structured algorithmic mapping and
              dedicated AI guidance.
            </p>
          </div>

          {/* 4 Professional Pillars Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="glass-panel bg-white/70 dark:bg-slate-900/70 rounded-3xl p-7 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-start gap-4 card-3d">
              <div className="p-3 rounded-2xl bg-primary-100 dark:bg-primary-950 text-primary-600 dark:text-primary-400 shrink-0">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-1.5">
                  1. Tri-Vector Diagnostics
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  Career choices fail when only marks are considered. Our engine synchronizes
                  academic background, organic personal hobbies, and work environment preferences to
                  find paths with high retention and fulfillment.
                </p>
              </div>
            </div>

            <div className="glass-panel bg-white/70 dark:bg-slate-900/70 rounded-3xl p-7 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-start gap-4 card-3d">
              <div className="p-3 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 shrink-0">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-1.5">
                  2. Clear Sequential Procedures
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  No vague slogans. Every recommended path contains ordered milestones complete with
                  exact study materials, project recommendations, and timeline projections from
                  beginner to hireable.
                </p>
              </div>
            </div>

            <div className="glass-panel bg-white/70 dark:bg-slate-900/70 rounded-3xl p-7 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-start gap-4 card-3d">
              <div className="p-3 rounded-2xl bg-cyan-100 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400 shrink-0">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-1.5">
                  3. Dedicated AI Companion "V"
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  Our embedded assistant <strong>V</strong> stays by your side 24/7. Ask V anything
                  about market salaries, what steps to take first, or how to pivot into a new field
                  without starting from scratch.
                </p>
              </div>
            </div>

            <div className="glass-panel bg-white/70 dark:bg-slate-900/70 rounded-3xl p-7 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-start gap-4 card-3d">
              <div className="p-3 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 shrink-0">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-1.5">
                  4. Privacy-First World Profile
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  Each registered user receives an isolated dashboard session. Your data, saved paths,
                  and score metrics remain completely private to your account with zero crossover to
                  unauthenticated guests.
                </p>
              </div>
            </div>
          </div>

          {/* Key Metrics / Impact Statistics */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="glass-panel bg-white/60 dark:bg-slate-900/60 rounded-2xl p-5 border border-slate-200/70 dark:border-slate-800 text-center">
              <div className="text-3xl font-extrabold text-primary-600 dark:text-primary-400 mb-1">
                50+
              </div>
              <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                Curated Career Paths
              </div>
            </div>

            <div className="glass-panel bg-white/60 dark:bg-slate-900/60 rounded-2xl p-5 border border-slate-200/70 dark:border-slate-800 text-center">
              <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mb-1">
                3-Way
              </div>
              <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                Profile Synchronization
              </div>
            </div>

            <div className="glass-panel bg-white/60 dark:bg-slate-900/60 rounded-2xl p-5 border border-slate-200/70 dark:border-slate-800 text-center">
              <div className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 mb-1">
                100%
              </div>
              <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                Actionable Milestones
              </div>
            </div>

            <div className="glass-panel bg-white/60 dark:bg-slate-900/60 rounded-2xl p-5 border border-slate-200/70 dark:border-slate-800 text-center">
              <div className="text-3xl font-extrabold text-amber-600 dark:text-amber-400 mb-1">
                24/7
              </div>
              <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                Guidance by AI "V"
              </div>
            </div>
          </div>

          {/* 3-Step Execution Workflow */}
          <div className="mt-16 glass-panel bg-gradient-to-r from-primary-500/10 via-emerald-500/10 to-indigo-500/10 rounded-3xl p-8 border border-slate-200/80 dark:border-slate-800">
            <h3 className="text-center text-xl font-bold text-slate-900 dark:text-white mb-8">
              How The Platform Works in 3 Steps
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center text-center">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-600 text-white font-bold text-sm mb-3 shadow-md shadow-primary-500/30">
                  1
                </span>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-1">
                  Complete Assessment
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Input your educational background, core strengths, hobbies, and ideal workplace.
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-white font-bold text-sm mb-3 shadow-md shadow-emerald-500/30">
                  2
                </span>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-1">
                  Generate Matches
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  The AI scoring engine calculates match scores and unlocks your personalized World
                  Dashboard.
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-white font-bold text-sm mb-3 shadow-md shadow-indigo-500/30">
                  3
                </span>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-1">
                  Execute Roadmaps
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Follow step-by-step procedures, build required skills, and consult V at every stage.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom CTA Banner */}
          <div className="mt-16 text-center">
            <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-4 px-6 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-md">
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                Ready to map out your career roadmap?
              </span>
              <div className="flex items-center gap-2">
                <Link
                  href="/assessment"
                  className="px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold shadow transition btn-3d"
                >
                  Start Assessment
                </Link>
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition btn-3d"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Modern Footer */}
      <footer className="border-t border-slate-200/80 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md py-10 transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-600 text-white">
              <Compass className="w-4 h-4" />
            </div>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              Smart Career Path
            </span>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <span>AI Career Guidance Engine</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6">
            <Link href="/" className="hover:text-primary-600 dark:hover:text-primary-400 transition">
              Home
            </Link>
            <Link href="/dashboard" className="hover:text-primary-600 dark:hover:text-primary-400 transition">
              Dashboard
            </Link>
            <Link href="/assessment" className="hover:text-primary-600 dark:hover:text-primary-400 transition">
              Assessment
            </Link>
            <Link href="/login" className="hover:text-primary-600 dark:hover:text-primary-400 transition">
              Login
            </Link>
            <Link href="/register" className="hover:text-primary-600 dark:hover:text-primary-400 transition">
              Register
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>AI Assistant V Active</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
