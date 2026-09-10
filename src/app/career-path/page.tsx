"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import {
  Check,
  ArrowLeft,
  Clock,
  DollarSign,
  BookOpen,
  Target,
  ListOrdered,
  ExternalLink,
  Star,
  Download,
  Sparkles,
  Loader2,
  CheckCircle2,
  Scale,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import {
  getStoredRecommendations,
  getStoredFavorites,
  toggleFavorite,
  getCompletedStepsForCareer,
  toggleStepProgress,
  getActiveUser,
} from "@/lib/storage";
import { getCareerByTitle } from "@/lib/career-engine";
import { downloadCareerPdfInBrowser, openCareerPdfInBrowser } from "@/lib/pdf-generator";
import type { CareerRecommendation, LearningStep } from "@/lib/types";

function StepBlock({
  step,
  isCompleted,
  onToggle,
}: {
  step: LearningStep;
  isCompleted: boolean;
  onToggle: () => void;
}) {
  const hasProcedure = step.procedure && step.procedure.length > 0;
  const hasResources = step.resources && step.resources.length > 0;

  return (
    <div
      className={`rounded-2xl border shadow-sm overflow-hidden transition-all card-3d ${
        isCompleted
          ? "bg-emerald-50/20 dark:bg-[#112224] border-emerald-300/80 dark:border-emerald-800"
          : "bg-white dark:bg-[#131b2e] border-slate-200/80 dark:border-slate-700"
      }`}
    >
      <div
        className={`px-5 py-3.5 border-b flex items-center justify-between gap-3 ${
          isCompleted
            ? "bg-emerald-100/50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800"
            : "bg-slate-50/90 dark:bg-slate-800/90 border-slate-100 dark:border-slate-700"
        }`}
      >
        <div className="flex items-center gap-3">
          <span
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl font-bold text-xs shadow-sm transition-colors ${
              isCompleted
                ? "bg-emerald-600 text-white"
                : "bg-primary-600 text-white shadow-primary-500/20"
            }`}
          >
            {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : step.order}
          </span>
          <h3
            className={`font-bold text-base transition-colors ${
              isCompleted
                ? "text-emerald-950 dark:text-emerald-100 line-through opacity-80"
                : "text-slate-900 dark:text-white"
            }`}
          >
            {step.title}
          </h3>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="text-xs text-slate-600 dark:text-slate-200 font-semibold px-2.5 py-0.5 rounded-full bg-slate-200/70 dark:bg-slate-700 border border-slate-300/60 dark:border-slate-600">
            {step.duration}
          </span>

          {/* Feature 5: Stage Completion Checkbox */}
          <button
            type="button"
            onClick={onToggle}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition btn-3d ${
              isCompleted
                ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                : "bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:border-emerald-500"
            }`}
          >
            <Check className={`w-3.5 h-3.5 ${isCompleted ? "stroke-[3]" : "text-slate-400"}`} />
            <span>{isCompleted ? "Completed" : "Mark Complete"}</span>
          </button>
        </div>
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
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  useEffect(() => {
    if (!title) return;
    const all = getStoredRecommendations();
    const found = all?.find(
      (r) => r.careerTitle.toLowerCase() === title.toLowerCase()
    );
    const resolved = found ?? getCareerByTitle(title);
    setRec(resolved);
    setIsFavorite(getStoredFavorites().includes(title));
    setCompletedSteps(getCompletedStepsForCareer(title));
  }, [title]);

  const handleToggleFavorite = () => {
    if (!rec) return;
    toggleFavorite(rec.careerTitle);
    setIsFavorite(getStoredFavorites().includes(rec.careerTitle));
  };

  const handleToggleStep = (stepOrder: number) => {
    if (!rec) return;
    toggleStepProgress(rec.careerTitle, stepOrder);
    setCompletedSteps(getCompletedStepsForCareer(rec.careerTitle));
  };

  const handleDownloadPdf = () => {
    if (!rec) return;
    setDownloadingPdf(true);
    try {
      const user = getActiveUser();
      downloadCareerPdfInBrowser(rec, user?.name || "Candidate");
    } catch (err) {
      console.error("PDF generation error:", err);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setDownloadingPdf(false);
    }
  };

  const handleOpenPdf = () => {
    if (!rec) return;
    try {
      const user = getActiveUser();
      openCareerPdfInBrowser(rec, user?.name || "Candidate");
    } catch (err) {
      console.error("PDF preview error:", err);
      alert("Failed to preview PDF. Please try downloading it instead.");
    }
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

  const progressPercent = Math.min(
    100,
    Math.round((completedSteps.length / (rec.learningPath.length || 1)) * 100)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-primary-50/20 to-slate-100 dark:from-[#0b0f19] dark:via-[#0f172a] dark:to-[#0b0f19] text-slate-900 dark:text-slate-100 transition-colors duration-300 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Career Title & Actions Banner */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {rec.careerTitle}
              </h1>
              {rec.matchScore > 0 && (
                <span className="rounded-full bg-primary-100 dark:bg-primary-950/80 text-primary-700 dark:text-primary-300 px-3 py-1 text-xs font-bold border border-primary-200 dark:border-primary-800">
                  {rec.matchScore}% match
                </span>
              )}
              {rec.skillOverlapPercent !== undefined && (
                <span className="rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 px-2.5 py-1 text-xs font-bold border border-emerald-200 dark:border-emerald-800">
                  {rec.skillOverlapPercent}% skill overlap
                </span>
              )}
            </div>

            {/* Action Buttons: Favorites, Skill Quiz, Export PDF */}
            <div className="flex flex-wrap items-center gap-2">
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
                <span>{isFavorite ? "Saved" : "Save"}</span>
              </button>

              <Link
                href={`/career-path/quiz?title=${encodeURIComponent(rec.careerTitle)}`}
                className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 px-3 py-1.5 text-xs font-semibold hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition btn-3d"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                <span>Skill Quiz</span>
              </Link>

              <button
                type="button"
                onClick={handleOpenPdf}
                className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-xs font-semibold transition btn-3d"
                title="Preview PDF directly in a new browser tab"
              >
                <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                <span>Preview PDF</span>
              </button>

              <button
                type="button"
                disabled={downloadingPdf}
                onClick={handleDownloadPdf}
                className="inline-flex items-center gap-1.5 rounded-xl bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white px-3.5 py-1.5 text-xs font-semibold shadow-sm transition btn-3d"
                title="Download full roadmap as PDF document"
              >
                {downloadingPdf ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Download className="w-3.5 h-3.5" />
                )}
                <span>{downloadingPdf ? "Exporting..." : "Download PDF"}</span>
              </button>
            </div>
          </div>

          <p className="text-slate-700 dark:text-slate-200 text-sm leading-relaxed">{rec.description}</p>
        </div>

        {/* Feature 5: Progress Bar Card */}
        <div className="mb-8 p-4 rounded-2xl bg-white/90 dark:bg-[#131b2e] border border-slate-200/80 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                Learning Progress: {progressPercent}% Completed
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {completedSteps.length} of {rec.learningPath.length} milestones marked as completed
            </p>
          </div>
          <div className="w-full sm:w-48 h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shrink-0">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-primary-600 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
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
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-bold text-slate-900 dark:text-white text-lg flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              <span>Sequential Learning Path</span>
            </h2>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Click &quot;Mark Complete&quot; as you finish each stage
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-6">
            Follow the steps in order. Each step details what to do, how to do it, and where to learn.
          </p>
          <ol className="space-y-6">
            {rec.learningPath.map((step, index) => (
              <li key={step.order}>
                <StepBlock
                  step={step}
                  isCompleted={completedSteps.includes(step.order)}
                  onToggle={() => handleToggleStep(step.order)}
                />
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
