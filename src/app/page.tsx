"use client";

import Link from "next/link";
import { Compass, GraduationCap, Sparkles, ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-primary-50/30 to-emerald-50/40">
      <header className="border-b border-slate-200/80 bg-white/70 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="w-8 h-8 text-primary-600" />
            <span className="font-semibold text-lg text-slate-800">
              Smart Career Path
            </span>
          </div>
          <nav className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-slate-600 hover:text-primary-600 text-sm font-medium link-3d"
            >
              Dashboard
            </Link>
            <Link
              href="/assessment"
              className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition shadow-lg shadow-primary-200 btn-3d"
            >
              Start Assessment
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-16 md:py-24">
        <section className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary-100 text-primary-700 px-4 py-1.5 text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            AI-Powered Career Guidance
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-6">
            Find your path.{" "}
            <span className="text-primary-600">Build your future.</span>
          </h1>
          <p className="text-lg text-slate-600 mb-10">
            For students and anyone rethinking their career—we use your
            academics, interests, and aspirations to recommend a learning path
            you can actually follow to success.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/assessment"
              className="inline-flex items-center justify-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-700 transition shadow-lg shadow-primary-200 btn-3d"
            >
              Start Assessment
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 bg-white text-slate-700 px-6 py-3 rounded-xl font-medium border border-slate-200 hover:border-primary-300 hover:bg-primary-50/50 transition btn-3d"
            >
              Dashboard
            </Link>
          </div>
        </section>

        <section className="mt-24 grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 card-3d">
            <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center mb-4">
              <GraduationCap className="w-6 h-6 text-primary-600" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Profile</h3>
            <p className="text-slate-600 text-sm">
              Academics, interests, and aspirations are used to generate personalized career recommendations.
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 card-3d">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center mb-4">
              <Compass className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Recommendations</h3>
            <p className="text-slate-600 text-sm">
              Career paths are ranked by match to your profile with clear reasoning.
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 card-3d">
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-amber-600" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Learning path</h3>
            <p className="text-slate-600 text-sm">
              Each path includes a sequential procedure: what to do, how to do it, and where to learn.
            </p>
          </div>
        </section>

        <section className="mt-20 text-center">
          <p className="text-slate-500 text-sm">
            Data is stored locally in your browser. No account required.
          </p>
        </section>
      </main>
    </div>
  );
}
