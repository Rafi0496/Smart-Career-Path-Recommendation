"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import {
  Scale,
  ArrowLeft,
  Check,
  X,
  Plus,
  Trash2,
  Clock,
  DollarSign,
  BookOpen,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import {
  getComparisonList,
  toggleComparison,
  clearComparison,
  getStoredRecommendations,
} from "@/lib/storage";
import { getCareerByTitle, CAREER_DATABASE } from "@/lib/career-engine";
import type { CareerRecommendation } from "@/lib/types";

function CompareContent() {
  const [compareTitles, setCompareTitles] = useState<string[]>([]);
  const [careers, setCareers] = useState<CareerRecommendation[]>([]);
  const [availableTitles, setAvailableTitles] = useState<string[]>([]);
  const [selectedToAdd, setSelectedToAdd] = useState("");

  useEffect(() => {
    const list = getComparisonList();
    setCompareTitles(list);

    // Populate all available titles from database
    const titles = Object.keys(CAREER_DATABASE).sort();
    setAvailableTitles(titles);

    // Resolve career details for compared careers
    loadComparedCareers(list);
  }, []);

  const loadComparedCareers = (titles: string[]) => {
    const stored = getStoredRecommendations() || [];
    const resolved: CareerRecommendation[] = [];

    for (const title of titles) {
      const match = stored.find(
        (r) => r.careerTitle.toLowerCase() === title.toLowerCase()
      );
      if (match) {
        resolved.push(match);
      } else {
        const fallback = getCareerByTitle(title);
        if (fallback) resolved.push(fallback);
      }
    }
    setCareers(resolved);
  };

  const handleRemove = (title: string) => {
    const updated = toggleComparison(title);
    setCompareTitles(updated);
    loadComparedCareers(updated);
  };

  const handleAdd = (title: string) => {
    if (!title || compareTitles.includes(title)) return;
    const updated = toggleComparison(title);
    setCompareTitles(updated);
    loadComparedCareers(updated);
    setSelectedToAdd("");
  };

  const handleClearAll = () => {
    clearComparison();
    setCompareTitles([]);
    setCareers([]);
  };

  // Compute common and unique skills across compared careers
  const allSkillsLists = careers.map((c) => new Set(c.requiredSkills.map((s) => s.toLowerCase())));
  const allUniqueSkills = Array.from(
    new Set(careers.flatMap((c) => c.requiredSkills))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-primary-50/20 to-slate-100 dark:from-[#0b0f19] dark:via-[#0f172a] dark:to-[#0b0f19] text-slate-900 dark:text-slate-100 transition-colors duration-300 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-primary-600 dark:text-primary-400 mb-1">
              <Scale className="w-4 h-4" />
              <span>Side-by-Side Analysis</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Career Path Comparison
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
              Compare requirements, timelines, salary outlooks, and learning milestones side-by-side.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {careers.length > 0 && (
              <button
                type="button"
                onClick={handleClearAll}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold hover:text-rose-600 dark:hover:text-rose-400 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            )}
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-sm transition btn-3d"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Dashboard</span>
            </Link>
          </div>
        </div>

        {/* Add Career Dropdown (up to 3) */}
        {careers.length < 3 && (
          <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-sm mb-8 flex flex-col sm:flex-row items-center gap-3">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 shrink-0">
              Add a career to compare (Max 3):
            </span>
            <select
              value={selectedToAdd}
              onChange={(e) => setSelectedToAdd(e.target.value)}
              className="flex-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
            >
              <option value="">-- Choose a career from 140+ database --</option>
              {availableTitles
                .filter((t) => !compareTitles.includes(t))
                .map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
            </select>
            <button
              type="button"
              disabled={!selectedToAdd}
              onClick={() => handleAdd(selectedToAdd)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-primary-600 hover:bg-primary-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-sm transition btn-3d"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add to Comparison</span>
            </button>
          </div>
        )}

        {careers.length === 0 ? (
          <div className="glass-panel bg-white/90 dark:bg-slate-900/90 rounded-3xl p-12 text-center border border-slate-200/80 dark:border-slate-800 shadow-xl max-w-lg mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-primary-100 dark:bg-primary-950/80 text-primary-600 dark:text-primary-400 flex items-center justify-center mx-auto mb-4">
              <Scale className="w-7 h-7" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No Careers Selected</h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-6">
              Select 2 or 3 careers from your dashboard recommendations or use the dropdown above to contrast career paths.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow-md transition btn-3d"
            >
              <span>Explore Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-8 animate-fade-in-up">
            {/* Side-by-Side Cards Grid */}
            <div
              className={`grid gap-4 sm:gap-6 ${
                careers.length === 1
                  ? "grid-cols-1 max-w-md mx-auto"
                  : careers.length === 2
                  ? "grid-cols-1 md:grid-cols-2"
                  : "grid-cols-1 md:grid-cols-3"
              }`}
            >
              {careers.map((career) => (
                <div
                  key={career.careerTitle}
                  className="rounded-3xl bg-white dark:bg-[#131b2e] border border-slate-200/80 dark:border-slate-700/80 shadow-md p-5 sm:p-6 flex flex-col relative card-3d"
                >
                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => handleRemove(career.careerTitle)}
                    className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    title="Remove from comparison"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  {/* Title & Badges */}
                  <div className="pr-6 mb-4">
                    <h2 className="text-lg font-extrabold text-slate-900 dark:text-white leading-tight mb-2">
                      {career.careerTitle}
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {career.matchScore > 0 && (
                        <span className="px-2.5 py-0.5 rounded-full bg-primary-100 dark:bg-primary-950/80 text-primary-700 dark:text-primary-300 text-[11px] font-bold border border-primary-200 dark:border-primary-800">
                          {career.matchScore}% Match
                        </span>
                      )}
                      {career.skillOverlapPercent !== undefined && (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold border border-emerald-200 dark:border-emerald-800">
                          {career.skillOverlapPercent}% Skill Overlap
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-5 line-clamp-3">
                    {career.description}
                  </p>

                  {/* Key Metrics */}
                  <div className="space-y-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 mb-5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        <span>Timeline</span>
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {career.estimatedTimeline || "6-12 Months"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-1.5">
                        <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Salary Range</span>
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {career.salaryRange || "Industry Standard"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                        <span>Roadmap Milestones</span>
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {career.learningPath.length} Sequential Stages
                      </span>
                    </div>
                  </div>

                  {/* Core Required Skills */}
                  <div className="mb-5 flex-1">
                    <span className="text-[11px] uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400 block mb-2">
                      Required Skills
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {career.requiredSkills.map((s) => (
                        <span
                          key={s}
                          className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-[11px] font-medium border border-slate-200 dark:border-slate-700"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Learning Path Stages Summary */}
                  <div className="mb-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400 block mb-2">
                      Key Milestone Stages
                    </span>
                    <ol className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                      {career.learningPath.map((step) => (
                        <li key={step.order} className="flex items-start gap-1.5 leading-snug">
                          <span className="font-bold text-primary-600 dark:text-primary-400 shrink-0">
                            {step.order}.
                          </span>
                          <span className="truncate">{step.title}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 flex flex-col gap-2">
                    <Link
                      href={`/career-path?title=${encodeURIComponent(career.careerTitle)}`}
                      className="inline-flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-sm transition btn-3d"
                    >
                      <span>View Full Roadmap</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <Link
                      href={`/career-path/quiz?title=${encodeURIComponent(career.careerTitle)}`}
                      className="inline-flex items-center justify-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold px-4 py-2 rounded-xl transition hover:border-primary-400"
                    >
                      <Sparkles className="w-3 h-3 text-primary-500" />
                      <span>Take Skill Quiz</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Matrix: Skill Overlap Across Selected Roles */}
            {careers.length > 1 && (
              <div className="p-6 rounded-3xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-md">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-4 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary-500" />
                  <span>Comparative Skills Matrix</span>
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase text-[10px] tracking-wider">
                        <th className="py-2.5 px-3">Skill Requirement</th>
                        {careers.map((c) => (
                          <th key={c.careerTitle} className="py-2.5 px-3 font-bold text-slate-800 dark:text-slate-200">
                            {c.careerTitle}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                      {allUniqueSkills.slice(0, 15).map((skill) => (
                        <tr key={skill} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30">
                          <td className="py-2 px-3 font-semibold text-slate-800 dark:text-slate-200">{skill}</td>
                          {careers.map((c) => {
                            const hasSkill = c.requiredSkills.some(
                              (s) => s.toLowerCase() === skill.toLowerCase()
                            );
                            return (
                              <td key={c.careerTitle} className="py-2 px-3">
                                {hasSkill ? (
                                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                                    <Check className="w-3 h-3" />
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400">
                                    <X className="w-3 h-3" />
                                  </span>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-primary-600 border-t-transparent animate-spin" />
        </div>
      }
    >
      <CompareContent />
    </Suspense>
  );
}
