"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { Compass, Check, ArrowLeft, Clock, DollarSign, BookOpen, Target, ListOrdered, ExternalLink, Star } from "lucide-react";
import { getStoredRecommendations, getStoredFavorites, toggleFavorite } from "@/lib/storage";
import { getCareerByTitle } from "@/lib/career-engine";
import type { CareerRecommendation, LearningStep } from "@/lib/types";

function StepBlock({ step, stepIndex }: { step: LearningStep; stepIndex: number }) {
  const hasProcedure = step.procedure && step.procedure.length > 0;
  const hasResources = step.resources && step.resources.length > 0;

  return (
    <div className="rounded-xl bg-white border border-slate-100 shadow-sm overflow-hidden card-3d">
      <div className="bg-slate-50 px-5 py-3 border-b border-slate-100 flex items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-600 text-white font-semibold text-sm">
          {step.order}
        </span>
        <h3 className="font-semibold text-slate-900">{step.title}</h3>
        <span className="ml-auto text-xs text-slate-500 font-medium">{step.duration}</span>
      </div>
      <div className="p-5 space-y-5">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5" />
            What to do
          </p>
          <p className="text-slate-700">{step.description}</p>
        </div>

        {hasProcedure && (
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <ListOrdered className="w-3.5 h-3.5" />
              How to do it (step-by-step)
            </p>
            <ol className="list-decimal list-inside space-y-2 text-slate-700 text-sm">
              {step.procedure!.map((item, i) => (
                <li key={i} className="pl-1">
                  {item}
                </li>
              ))}
            </ol>
          </div>
        )}

        {hasResources && (
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <ExternalLink className="w-3.5 h-3.5" />
              Where to learn
            </p>
            <ul className="space-y-1.5">
              {step.resources!.map((resource, i) => (
                <li key={i} className="text-sm text-slate-700 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-500 shrink-0" />
                  {resource}
                </li>
              ))}
            </ul>
          </div>
        )}

        {!hasProcedure && !hasResources && (
          <p className="text-sm text-slate-500">Complete this step in order before moving to the next.</p>
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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-slate-600 mb-4">No career selected.</p>
          <Link href="/dashboard" className="text-primary-600 font-medium link-3d">
            Back to dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (!rec) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-slate-600 mb-4">
            Recommendation not found. Generate recommendations from your dashboard first.
          </p>
          <Link href="/dashboard" className="text-primary-600 font-medium link-3d">
            Go to dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-primary-50/20 to-slate-100">
      <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-slate-600 hover:text-primary-600 transition link-3d"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Dashboard</span>
          </Link>
          <Link href="/" className="flex items-center gap-2 text-slate-700 link-3d">
            <Compass className="w-6 h-6" />
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
              {rec.careerTitle}
            </h1>
            {rec.matchScore > 0 && (
              <span className="rounded-full bg-primary-100 text-primary-700 px-3 py-1 text-sm font-medium">
                {rec.matchScore}% match
              </span>
            )}
            <button
              type="button"
              onClick={handleToggleFavorite}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition btn-3d ${isFavorite ? "bg-amber-100 text-amber-800 border border-amber-200" : "bg-slate-100 text-slate-700 border border-slate-200 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200"}`}
            >
              <Star className={`w-4 h-4 ${isFavorite ? "fill-amber-500" : ""}`} />
              {isFavorite ? "Saved" : "Save to favorites"}
            </button>
          </div>
          <p className="text-slate-600">{rec.description}</p>
        </div>

        {rec.simpleSummary && (
          <div className="rounded-2xl bg-primary-50/80 border border-primary-100 p-4 mb-8">
            <p className="text-sm font-medium text-primary-900 mb-1 flex items-center gap-2">
              <Target className="w-4 h-4" />
              Summary
            </p>
            <p className="text-slate-700">{rec.simpleSummary}</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {rec.estimatedTimeline && (
            <div className="rounded-xl bg-white border border-slate-100 shadow-sm p-4 flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Timeline</p>
                <p className="text-slate-800 font-medium">{rec.estimatedTimeline}</p>
              </div>
            </div>
          )}
          {rec.salaryRange && (
            <div className="rounded-xl bg-white border border-slate-100 shadow-sm p-4 flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                <DollarSign className="w-5 h-5 text-emerald-700" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Salary range</p>
                <p className="text-slate-800 font-medium text-sm">{rec.salaryRange}</p>
              </div>
            </div>
          )}
        </div>

        {rec.whyRecommended.length > 0 && (
          <section className="mb-8">
            <h2 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <Check className="w-5 h-5 text-primary-600" />
              Why this path fits you
            </h2>
            <ul className="space-y-2">
              {rec.whyRecommended.map((reason, i) => (
                <li key={i} className="flex items-start gap-2 text-slate-600 text-sm pl-1">
                  <span className="text-primary-500 mt-0.5">•</span>
                  {reason}
                </li>
              ))}
            </ul>
          </section>
        )}

        {rec.requiredSkills.length > 0 && (
          <section className="mb-8">
            <h2 className="font-semibold text-slate-900 mb-3">Skills you will build</h2>
            <div className="flex flex-wrap gap-2">
              {rec.requiredSkills.map((skill) => (
                <span
                  key={skill}
                  className="bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary-600" />
            Sequential learning path
          </h2>
          <p className="text-sm text-slate-600 mb-6">
            Follow the steps in order. Each step includes what to do, how to do it, and where to learn.
          </p>
          <ol className="space-y-6">
            {rec.learningPath.map((step, index) => (
              <li key={step.order}>
                <StepBlock step={step} stepIndex={index} />
              </li>
            ))}
          </ol>
        </section>

        <div className="mt-10 pt-6 border-t border-slate-200">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-primary-600 font-medium hover:underline link-3d"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to recommendations
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
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <p className="text-slate-500">Loading...</p>
        </div>
      }
    >
      <CareerPathContent />
    </Suspense>
  );
}
