"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { Check, ArrowLeft, Clock, DollarSign, BookOpen, Target, ListOrdered, ExternalLink, Star } from "lucide-react";
import Navbar from "@/components/Navbar";
import { getStoredRecommendations, getStoredFavorites, toggleFavorite } from "@/lib/storage";
import { getCareerByTitle } from "@/lib/career-engine";
import type { CareerRecommendation, LearningStep } from "@/lib/types";

function StepBlock({ step }: { step: LearningStep; stepIndex: number }) {
  const hasProcedure = step.procedure && step.procedure.length > 0;
  const hasResources = step.resources && step.resources.length > 0;

  return (
    <div className="rounded-2xl bg-white dark:bg-[#131b2e] border border-slate-200/80 dark:border-slate-700 shadow-sm overflow-hidden card-3d">
      <div className="bg-slate-50/90 dark:bg-slate-800/90 px-5 py-3.5 border-b border-slate-100 dark:border-slate-700 flex items-center gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary-600 text-white font-bold text-xs shadow-md shadow-primary-500/20">
          {step.order}
        </span>
        <h3 className="font-bold text-slate-900 dark:text-white text-base">{step.title}</h3>
        <span className="ml-auto text-xs text-slate-600 dark:text-slate-200 font-semibold px-2.5 py-0.5 rounded-full bg-slate-200/70 dark:bg-slate-700 border border-slate-300/60 dark:border-slate-600">
          {step.duration}
        </span>
      </div>
      <div className="p-5 sm:p-6 space-y-5">
        <div>
          <p className="text-xs font-bold text-primary-700 dark:text-primary-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-primary-500" />
            <span>What to do</span>
          </p>
          <p className="text-slate-800 dark:text-slate-100 text-sm leading-relaxed font-medium">
            {step.description}
          </p>
        </div>

        {hasProcedure && (
          <div>
            <p className="text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <ListOrdered className="w-3.5 h-3.5 text-emerald-500" />
              <span>How to do it (step-by-step procedure)</span>
            </p>
            <ol className="list-decimal list-inside space-y-2 text-slate-800 dark:text-slate-100 text-sm">
              {step.procedure!.map((item, i) => (
                <li key={i} className="pl-1 leading-relaxed">
                  {item}
                </li>
              ))}
            </ol>
          </div>
        )}

        {hasResources && (
          <div>
            <p className="text-xs font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <ExternalLink className="w-3.5 h-3.5 text-indigo-500" />
              <span>Where to learn</span>
            </p>
            <ul className="space-y-1.5">
              {step.resources!.map((resource, i) => (
                <li key={i} className="text-xs sm:text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-500 shrink-0" />
                  <span>{resource}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {!hasProcedure && !hasResources && (
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Complete this step in order before moving to the next.
          </p>
        )}
      </div>
    </div>
  );
}

function CareerPathContent() {
  const searchParams = useSearchParams();
  const title = searchParams.get("title");
  const [rec, setRec] = useState<CareerRecommendation | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (!title) return;
    const all = getStoredRecommendations();
    const found = all?.find(
      (r) => r.careerTitle.toLowerCase() === title.toLowerCase()
    );
    setRec(found ?? getCareerByTitle(title));
    setIsFavorite(getStoredFavorites().includes(title));
  }, [title]);

  const handleToggleFavorite = () => {
    if (!rec) return;
    toggleFavorite(rec.careerTitle);
    setIsFavorite(getStoredFavorites().includes(rec.careerTitle));
  };

  if (!title) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <p className="text-slate-700 dark:text-slate-300 mb-4">No career selected.</p>
            <Link href="/dashboard" className="text-primary-600 dark:text-primary-400 font-semibold link-3d">
              Back to dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!rec) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <p className="text-slate-700 dark:text-slate-300 mb-4 text-sm">
              Recommendation not found. Generate recommendations from your dashboard first.
            </p>
            <Link href="/dashboard" className="text-primary-600 dark:text-primary-400 font-semibold link-3d">
              Back to dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-primary-50/20 to-slate-100 dark:from-[#0b0f19] dark:via-[#0f172a] dark:to-[#0b0f19] text-slate-900 dark:text-slate-100 transition-colors duration-300 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {rec.careerTitle}
            </h1>
            {rec.matchScore > 0 && (
              <span className="rounded-full bg-primary-100 dark:bg-primary-950/80 text-primary-700 dark:text-primary-300 px-3 py-1 text-xs font-bold border border-primary-200 dark:border-primary-800">
                {rec.matchScore}% match
              </span>
            )}
            <button
              type="button"
              onClick={handleToggleFavorite}
              className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition btn-3d ${
                isFavorite
                  ? "bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-200 border border-amber-300 dark:border-amber-800"
                  : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-amber-300 hover:text-amber-600"
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${isFavorite ? "fill-amber-500 text-amber-500" : ""}`} />
              <span>{isFavorite ? "Saved" : "Save to Favorites"}</span>
            </button>
          </div>
          <p className="text-slate-700 dark:text-slate-200 text-sm leading-relaxed">{rec.description}</p>
        </div>

        {/* High-Contrast Core Summary Card */}
        {rec.simpleSummary && (
          <div className="rounded-2xl bg-primary-50/90 dark:bg-[#15203b] border border-primary-200 dark:border-primary-800/80 p-5 mb-8 shadow-md">
            <p className="text-xs font-bold uppercase tracking-wider text-primary-800 dark:text-primary-300 mb-1.5 flex items-center gap-2">
              <Target className="w-4 h-4 text-primary-600 dark:text-primary-400" />
              <span>Core Summary</span>
            </p>
            <p className="text-slate-800 dark:text-slate-100 text-sm leading-relaxed font-medium">
              {rec.simpleSummary}
            </p>
          </div>
        )}

        {/* Timeline and Salary Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {rec.estimatedTimeline && (
            <div className="rounded-2xl bg-white dark:bg-[#131b2e] border border-slate-200/80 dark:border-slate-700 shadow-sm p-4 flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                  Timeline
                </p>
                <p className="text-slate-900 dark:text-white font-bold text-sm mt-0.5">
                  {rec.estimatedTimeline}
                </p>
              </div>
            </div>
          )}
          {rec.salaryRange && (
            <div className="rounded-2xl bg-white dark:bg-[#131b2e] border border-slate-200/80 dark:border-slate-700 shadow-sm p-4 flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                  Salary Range
                </p>
                <p className="text-slate-900 dark:text-white font-bold text-sm mt-0.5">
                  {rec.salaryRange}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Why Path Fits You */}
        {rec.whyRecommended.length > 0 && (
          <section className="mb-8">
            <h2 className="font-bold text-slate-900 dark:text-white text-base mb-3 flex items-center gap-2">
              <Check className="w-5 h-5 text-emerald-500" />
              <span>Why This Path Fits You</span>
            </h2>
            <ul className="space-y-2">
              {rec.whyRecommended.map((reason, i) => (
                <li key={i} className="flex items-start gap-2.5 text-slate-700 dark:text-slate-200 text-sm pl-1 font-medium">
                  <span className="text-primary-500 mt-0.5 font-bold">•</span>
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Skills You Will Build */}
        {rec.requiredSkills.length > 0 && (
          <section className="mb-8">
            <h2 className="font-bold text-slate-900 dark:text-white text-base mb-3">Skills You Will Build</h2>
            <div className="flex flex-wrap gap-2">
              {rec.requiredSkills.map((skill) => (
                <span
                  key={skill}
                  className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-semibold border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-xl text-xs"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Learning Path Steps */}
        <section>
          <h2 className="font-bold text-slate-900 dark:text-white text-lg mb-2 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            <span>Sequential Learning Path</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-6">
            Follow the steps in order. Each step details what to do, how to do it, and where to learn.
          </p>
          <ol className="space-y-6">
            {rec.learningPath.map((step, index) => (
              <li key={step.order}>
                <StepBlock step={step} stepIndex={index} />
              </li>
            ))}
          </ol>
        </section>

        <div className="mt-12 pt-6 border-t border-slate-200/80 dark:border-slate-800">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 font-semibold hover:underline text-sm link-3d"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Recommendations</span>
          </Link>
        </div>
      </main>
    </div>
  );
}

export default function CareerPathPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-primary-600 border-t-transparent animate-spin" />
        </div>
      }
    >
      <CareerPathContent />
    </Suspense>
  );
}
