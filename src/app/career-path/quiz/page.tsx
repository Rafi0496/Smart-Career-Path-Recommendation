"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Sparkles,
  BookOpen,
  Award,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { getStoredRecommendations } from "@/lib/storage";
import { getCareerByTitle } from "@/lib/career-engine";
import type { CareerRecommendation, QuizQuestion } from "@/lib/types";

function QuizContent() {
  const searchParams = useSearchParams();
  const title = searchParams.get("title") || "Software Developer";

  const [career, setCareer] = useState<CareerRecommendation | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const all = getStoredRecommendations();
    const found = all?.find(
      (r) => r.careerTitle.toLowerCase() === title.toLowerCase()
    );
    const resolvedCareer = found ?? getCareerByTitle(title);
    setCareer(resolvedCareer);

    // Skills to test: prioritize skillsToDevelop, else requiredSkills
    const targetSkills =
      resolvedCareer?.skillsToDevelop && resolvedCareer.skillsToDevelop.length > 0
        ? resolvedCareer.skillsToDevelop
        : resolvedCareer?.requiredSkills?.slice(0, 3) || ["Core Fundamentals"];

    fetchQuiz(resolvedCareer?.careerTitle || title, targetSkills);
  }, [title]);

  const fetchQuiz = async (careerTitle: string, skills: string[]) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/quiz/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          career_id: careerTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          career_title: careerTitle,
          skills_to_develop: skills,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load quiz");
      if (data.questions && data.questions.length > 0) {
        setQuestions(data.questions);
      } else {
        throw new Error("No quiz questions returned.");
      }
    } catch (e: any) {
      setError(e.message || "Failed to load quiz");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (questionIdx: number, optionIdx: number) => {
    if (submitted) return;
    setUserAnswers((prev) => ({ ...prev, [questionIdx]: optionIdx }));
  };

  const calculateResults = () => {
    let correctCount = 0;
    const weakSkills = new Set<string>();

    questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correct_answer) {
        correctCount++;
      } else {
        weakSkills.add(q.skill);
      }
    });

    const scorePercent = Math.round((correctCount / (questions.length || 1)) * 100);
    return {
      correctCount,
      total: questions.length,
      scorePercent,
      weakSkills: Array.from(weakSkills),
    };
  };

  const handleRetake = () => {
    setUserAnswers({});
    setSubmitted(false);
    setCurrentIndex(0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] flex flex-col items-center justify-center p-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary-600 mb-3" />
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          Generating AI Skill-Gap Assessment for {title}...
        </p>
      </div>
    );
  }

  if (error || questions.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-xl mx-auto px-4 py-16 text-center">
          <div className="glass-panel bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl">
            <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Quiz Unavailable</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">{error || "Could not generate questions."}</p>
            <Link
              href={`/career-path?title=${encodeURIComponent(title)}`}
              className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow-md transition btn-3d"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Career Path</span>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const results = submitted ? calculateResults() : null;
  const currentQ = questions[currentIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-primary-50/20 to-slate-100 dark:from-[#0b0f19] dark:via-[#0f172a] dark:to-[#0b0f19] text-slate-900 dark:text-slate-100 transition-colors duration-300 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-2xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header Breadcrumb */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <Link
            href={`/career-path?title=${encodeURIComponent(title)}`}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to {title} Roadmap</span>
          </Link>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-950/80 text-primary-700 dark:text-primary-300 text-xs font-bold border border-primary-200 dark:border-primary-800">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Skill-Gap Diagnostic</span>
          </div>
        </div>

        {!submitted ? (
          <div className="glass-panel bg-white/90 dark:bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xl animate-fade-in-up">
            {/* Quiz Progress */}
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 mb-3">
              <span>
                Question {currentIndex + 1} of {questions.length}
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-primary-600 dark:text-primary-400 font-bold">
                Skill: {currentQ.skill}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mb-6">
              <div
                className="h-full bg-gradient-to-r from-primary-600 to-indigo-600 transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              />
            </div>

            {/* Question prompt */}
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-6 leading-relaxed">
              {currentQ.question}
            </h2>

            {/* Multiple Choice Options */}
            <div className="space-y-3 mb-8">
              {currentQ.options.map((option, optIdx) => {
                const isSelected = userAnswers[currentIndex] === optIdx;
                return (
                  <button
                    key={optIdx}
                    type="button"
                    onClick={() => handleSelectOption(currentIndex, optIdx)}
                    className={`w-full text-left p-4 rounded-2xl border text-xs sm:text-sm font-medium transition-all duration-200 flex items-start gap-3.5 card-3d ${
                      isSelected
                        ? "bg-primary-50 dark:bg-primary-950/60 border-primary-600 dark:border-primary-500 text-primary-900 dark:text-primary-200 shadow-sm"
                        : "bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-primary-300 dark:hover:border-primary-600"
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                        isSelected
                          ? "bg-primary-600 text-white"
                          : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                      }`}
                    >
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <span className="pt-0.5 leading-relaxed">{option}</span>
                  </button>
                );
              })}
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>

              {currentIndex < questions.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                  className="inline-flex items-center gap-1.5 bg-primary-600 hover:bg-primary-700 text-white px-5 py-2 rounded-xl text-xs font-semibold shadow-sm transition btn-3d"
                >
                  <span>Next Question</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setSubmitted(true)}
                  className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-xl text-xs font-semibold shadow-md transition btn-3d"
                >
                  <span>Submit Diagnostic</span>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Submission Results & Skill-Gap Breakdown */
          <div className="space-y-6 animate-fade-in-up">
            <div className="glass-panel bg-white/90 dark:bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xl text-center">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4 shadow-inner">
                <Award className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-1">
                Diagnostic Complete!
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
                Target Role: <strong className="text-slate-700 dark:text-slate-200">{title}</strong>
              </p>

              <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto mb-6">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
                  <span className="text-xs uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400">
                    Accuracy Score
                  </span>
                  <p className="text-2xl font-extrabold text-primary-600 dark:text-primary-400 mt-1">
                    {results?.scorePercent}%
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
                  <span className="text-xs uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400">
                    Correct Answers
                  </span>
                  <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                    {results?.correctCount} / {results?.total}
                  </p>
                </div>
              </div>

              {/* Skills Needing Work */}
              {results && results.weakSkills.length > 0 ? (
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/80 text-left mb-6">
                  <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-xs uppercase tracking-wider mb-2">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Identified Skill Gaps to Focus On</span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 mb-3">
                    Based on your incorrect answers, these skills should be prioritized in your learning roadmap:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {results.weakSkills.map((s) => (
                      <span
                        key={s}
                        className="px-3 py-1 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 font-bold text-xs border border-amber-300 dark:border-amber-700"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/80 text-left mb-6 text-emerald-800 dark:text-emerald-200 text-xs">
                  <strong className="block font-bold mb-1">Excellent Domain Mastery!</strong>
                  You demonstrated strong technical comprehension across all evaluated skills for this career.
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  type="button"
                  onClick={handleRetake}
                  className="inline-flex items-center justify-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-primary-300 px-5 py-2.5 rounded-xl text-xs font-semibold shadow-sm transition btn-3d"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Retake Diagnostic</span>
                </button>
                <Link
                  href={`/career-path?title=${encodeURIComponent(title)}`}
                  className="inline-flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl text-xs font-semibold shadow-md transition btn-3d"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Resume Learning Path</span>
                </Link>
              </div>
            </div>

            {/* Detailed Question Review */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Detailed Answer Key & Explanations
              </h3>
              {questions.map((q, idx) => {
                const selected = userAnswers[idx];
                const isCorrect = selected === q.correct_answer;
                return (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                        Q{idx + 1} ({q.skill})
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-md ${
                          isCorrect
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300"
                            : "bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300"
                        }`}
                      >
                        {isCorrect ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        <span>{isCorrect ? "Correct" : "Incorrect"}</span>
                      </span>
                    </div>

                    <p className="text-sm font-semibold text-slate-900 dark:text-white leading-relaxed">
                      {q.question}
                    </p>

                    <div className="text-xs space-y-1">
                      <p className="text-slate-600 dark:text-slate-400">
                        Your answer:{" "}
                        <span className={isCorrect ? "text-emerald-600 font-bold" : "text-rose-600 font-bold"}>
                          {selected !== undefined ? q.options[selected] : "Not answered"}
                        </span>
                      </p>
                      {!isCorrect && (
                        <p className="text-slate-600 dark:text-slate-400">
                          Correct answer:{" "}
                          <span className="text-emerald-600 font-bold">{q.options[q.correct_answer]}</span>
                        </p>
                      )}
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                      <strong className="text-primary-700 dark:text-primary-300">Explanation: </strong>
                      {q.explanation}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function QuizPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
        </div>
      }
    >
      <QuizContent />
    </Suspense>
  );
}
