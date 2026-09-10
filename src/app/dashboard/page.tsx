"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Compass,
  GraduationCap,
  Heart,
  Target,
  Sparkles,
  ArrowRight,
  RefreshCw,
  ChevronRight,
  X,
  Pencil,
  Star,
  LogIn,
  UserPlus,
  FileEdit,
  ShieldCheck,
  Scale,
  CheckCircle2,
  BookOpen,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import {
  getActiveUser,
  getStoredRecommendations,
  getStoredFavorites,
  saveRecommendations,
  getComparisonList,
  toggleComparison,
  clearComparison,
  getAllCareerProgress,
  getCareerProgressPercent,
} from "@/lib/storage";
import { getCategorizedCareers } from "@/lib/career-engine";
import type { UserProfile, CareerRecommendation, UserAccount } from "@/lib/types";

type DetailPanel = "academics" | "interests" | "aspirations" | null;

function CircularStat({
  label,
  percent,
  color,
  icon: Icon,
  detail,
  onClick,
}: {
  label: string;
  percent: number;
  color: string;
  icon: React.ElementType;
  detail: string;
  onClick?: () => void;
}) {
  const pct = Math.min(100, Math.max(0, percent));
  const circumference = 2 * Math.PI * 42;
  const strokeDash = (pct / 100) * circumference;

  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative flex flex-col items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-2xl p-3 hover:bg-slate-100/60 dark:hover:bg-slate-800/60 transition-all card-3d"
    >
      <div className="relative w-28 h-28 transition-transform duration-300 group-hover:scale-105">
        <svg className="w-full h-full ring-progress" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-slate-200 dark:text-slate-700"
          />
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - strokeDash}
            strokeLinecap="round"
            className={`transition-all duration-700 ${color}`}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 shadow-md flex items-center justify-center border border-slate-100 dark:border-slate-700 group-hover:shadow-lg transition-shadow">
            <Icon className="w-6 h-6 text-slate-700 dark:text-slate-200" />
          </div>
        </div>
      </div>
      <span className="mt-3 text-sm font-bold text-slate-800 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
        {label}
      </span>
      <span className="text-xs font-medium text-slate-600 dark:text-slate-300">{Math.round(pct)}% complete</span>
      <span
        className="text-xs font-semibold text-slate-700 dark:text-slate-100 bg-slate-200/70 dark:bg-slate-800 px-2 py-0.5 rounded-md mt-1.5 max-w-[130px] truncate border border-slate-300/60 dark:border-slate-700"
        title={detail}
      >
        {detail}
      </span>
    </button>
  );
}

function DetailModal({
  panel,
  profile,
  onClose,
}: {
  panel: DetailPanel;
  profile: UserProfile;
  onClose: () => void;
}) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!panel) return null;

  const panelConfig = {
    academics: {
      title: "Academic Background",
      subtitle: "Your formal education, stream, subjects & strengths",
      icon: GraduationCap,
      color: "text-primary-500",
      bg: "bg-primary-500/10 dark:bg-primary-500/20",
    },
    interests: {
      title: "Interests & Skills Profile",
      subtitle: "Personal passions, hobbies, technical skills & work style",
      icon: Heart,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10 dark:bg-emerald-500/20",
    },
    aspirations: {
      title: "Career Aspirations & Goals",
      subtitle: "Target dream roles, preferred environment, priorities & timeline",
      icon: Target,
      color: "text-amber-500",
      bg: "bg-amber-500/10 dark:bg-amber-500/20",
    },
  }[panel];

  const IconComponent = panelConfig.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Dark overlay behind the modal — no blur so the modal and page stay crisp */}
      <div
        className="fixed inset-0 bg-black/60 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Crystal clear modal dialog card */}
      <div
        className="relative z-10 bg-white dark:bg-[#111927] rounded-3xl shadow-2xl max-w-xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-slate-200 dark:border-slate-800 animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900/90">
          <div className="flex items-center gap-3.5">
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${panelConfig.bg} ${panelConfig.color} shadow-sm shrink-0`}>
              <IconComponent className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                {panelConfig.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {panelConfig.subtitle}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/assessment"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-primary-600 hover:bg-primary-700 text-white shadow-sm shadow-primary-500/20 transition btn-3d"
            >
              <Pencil className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Edit Details</span>
            </Link>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5 text-sm">
          {panel === "academics" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                    Education Level
                  </span>
                  <span className="text-slate-900 dark:text-white font-bold text-base">
                    {profile.academics?.educationLevel || "Not specified"}
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                    Stream / Major
                  </span>
                  <span className="text-slate-900 dark:text-white font-bold text-base">
                    {profile.academics?.streamOrField || "Not specified"}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2.5">
                  Academic Performance / Grades
                </span>
                <span className="text-slate-800 dark:text-slate-100 font-medium">
                  {profile.academics?.grades || "Not provided"}
                </span>
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2">
                  Key Subjects
                </span>
                <div className="flex flex-wrap gap-2">
                  {profile.academics?.subjects && profile.academics.subjects.length > 0 ? (
                    profile.academics.subjects.map((subj) => (
                      <span
                        key={subj}
                        className="px-3 py-1 rounded-xl bg-primary-50 dark:bg-primary-950/70 text-primary-700 dark:text-primary-300 font-medium text-xs border border-primary-200/80 dark:border-primary-800/60"
                      >
                        {subj}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-400 dark:text-slate-500 text-xs italic">No subjects added</span>
                  )}
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2">
                  Key Strengths
                </span>
                <div className="flex flex-wrap gap-2">
                  {profile.academics?.strengths && profile.academics.strengths.length > 0 ? (
                    profile.academics.strengths.map((str) => (
                      <span
                        key={str}
                        className="px-3 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 font-medium text-xs border border-emerald-200/80 dark:border-emerald-800/60"
                      >
                        {str}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-400 dark:text-slate-500 text-xs italic">No strengths added</span>
                  )}
                </div>
              </div>

              {profile.academics?.certifications && profile.academics.certifications.length > 0 && (
                <div>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2">
                    Certifications
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {profile.academics.certifications.map((cert) => (
                      <span
                        key={cert}
                        className="px-3 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 font-medium text-xs border border-indigo-200/80 dark:border-indigo-800/60"
                      >
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {panel === "interests" && (
            <div className="space-y-4">
              <div>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2">
                  Personal Interests & Passions
                </span>
                <div className="flex flex-wrap gap-2">
                  {profile.interests?.interests && profile.interests.interests.length > 0 ? (
                    profile.interests.interests.map((item) => (
                      <span
                        key={item}
                        className="px-3 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 font-medium text-xs border border-emerald-200/80 dark:border-emerald-800/60"
                      >
                        {item}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-400 dark:text-slate-500 text-xs italic">No personal interests set</span>
                  )}
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2">
                  Hobbies & Free-Time Activities
                </span>
                <div className="flex flex-wrap gap-2">
                  {profile.interests?.hobbies && profile.interests.hobbies.length > 0 ? (
                    profile.interests.hobbies.map((hob) => (
                      <span
                        key={hob}
                        className="px-3 py-1 rounded-xl bg-sky-50 dark:bg-sky-950/70 text-sky-700 dark:text-sky-300 font-medium text-xs border border-sky-200/80 dark:border-sky-800/60"
                      >
                        {hob}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-400 dark:text-slate-500 text-xs italic">No hobbies listed</span>
                  )}
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2">
                  Current Skills
                </span>
                <div className="flex flex-wrap gap-2">
                  {profile.interests?.skills && profile.interests.skills.length > 0 ? (
                    profile.interests.skills.map((sk) => (
                      <span
                        key={sk}
                        className="px-3 py-1 rounded-xl bg-primary-50 dark:bg-primary-950/70 text-primary-700 dark:text-primary-300 font-medium text-xs border border-primary-200/80 dark:border-primary-800/60"
                      >
                        {sk}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-400 dark:text-slate-500 text-xs italic">No skills listed</span>
                  )}
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2">
                  Preferred Work Style
                </span>
                <div className="flex flex-wrap gap-2">
                  {profile.interests?.preferredWorkStyle && profile.interests.preferredWorkStyle.length > 0 ? (
                    profile.interests.preferredWorkStyle.map((ws) => (
                      <span
                        key={ws}
                        className="px-3 py-1 rounded-xl bg-violet-50 dark:bg-violet-950/70 text-violet-700 dark:text-violet-300 font-medium text-xs border border-violet-200/80 dark:border-violet-800/60"
                      >
                        {ws}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-400 dark:text-slate-500 text-xs italic">No work style preference</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {panel === "aspirations" && (
            <div className="space-y-4">
              <div>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2">
                  Target Dream Roles
                </span>
                <div className="flex flex-wrap gap-2">
                  {profile.aspirations?.dreamRoles && profile.aspirations.dreamRoles.length > 0 ? (
                    profile.aspirations.dreamRoles.map((role) => (
                      <span
                        key={role}
                        className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/70 text-amber-800 dark:text-amber-200 font-bold text-xs border border-amber-200/80 dark:border-amber-800/60 flex items-center gap-1.5"
                      >
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        <span>{role}</span>
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-400 dark:text-slate-500 text-xs italic">No dream roles chosen</span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                    Target Timeline
                  </span>
                  <span className="text-slate-900 dark:text-white font-bold text-sm">
                    {profile.aspirations?.timeline || "Flexible"}
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                    Environment
                  </span>
                  <span className="text-slate-900 dark:text-white font-medium text-sm">
                    {profile.aspirations?.workEnvironment?.length
                      ? profile.aspirations.workEnvironment.join(", ")
                      : "Any"}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2">
                  Willing To Learn & Do
                </span>
                <div className="flex flex-wrap gap-2">
                  {profile.aspirations?.willingToDo && profile.aspirations.willingToDo.length > 0 ? (
                    profile.aspirations.willingToDo.map((item) => (
                      <span
                        key={item}
                        className="px-3 py-1 rounded-xl bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 font-medium text-xs border border-blue-200/80 dark:border-blue-800/60"
                      >
                        {item}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-400 dark:text-slate-500 text-xs italic">None specified</span>
                  )}
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2">
                  Key Priorities
                </span>
                <div className="flex flex-wrap gap-2">
                  {profile.aspirations?.priorities && profile.aspirations.priorities.length > 0 ? (
                    profile.aspirations.priorities.map((item) => (
                      <span
                        key={item}
                        className="px-3 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 font-medium text-xs border border-indigo-200/80 dark:border-indigo-800/60"
                      >
                        {item}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-400 dark:text-slate-500 text-xs italic">None specified</span>
                  )}
                </div>
              </div>

              {profile.aspirations?.additionalNotes && (
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                    Additional Notes
                  </span>
                  <p className="text-slate-700 dark:text-slate-300 text-xs sm:text-sm">
                    {profile.aspirations.additionalNotes}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/70 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [activeUser, setActiveUser] = useState<UserAccount | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [recommendations, setRecommendations] = useState<CareerRecommendation[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [detailPanel, setDetailPanel] = useState<DetailPanel>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [categories, setCategories] = useState<Record<string, { title: string; description: string }[]>>({});
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [compareList, setCompareList] = useState<string[]>([]);
  const [progressData, setProgressData] = useState<Record<string, number[]>>({});

  useEffect(() => {
    setMounted(true);
    const user = getActiveUser();
    setActiveUser(user);
    if (user && user.hasDashboard && user.profile) {
      setProfile(user.profile);
      setRecommendations(user.recommendations || getStoredRecommendations());
      setFavorites(user.favorites || getStoredFavorites());
    } else {
      setProfile(null);
      setRecommendations(null);
      setFavorites([]);
    }
    setCategories(getCategorizedCareers());
    setCompareList(getComparisonList());
    setProgressData(getAllCareerProgress());
  }, []);

  const handleToggleCompare = (title: string) => {
    const next = toggleComparison(title);
    setCompareList(next);
  };

  const generateRecommendations = async () => {
    if (!profile) return;
    setLoading(true);
    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      const data = await res.json();
      if (data.recommendations) {
        setRecommendations(data.recommendations);
        saveRecommendations(data.recommendations);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary-600 border-t-transparent animate-spin" />
      </div>
    );
  }

  // =========================================================================
  // Case 1: USER IS NOT LOGGED IN
  // =========================================================================
  if (!activeUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-primary-50/20 to-emerald-50/30 dark:from-[#0b0f19] dark:via-[#0f172a] dark:to-[#0b0f19] text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-300">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-4 py-16">
          <div className="relative text-center max-w-lg glass-panel bg-white/90 dark:bg-[#131b2e] rounded-3xl p-8 sm:p-10 shadow-2xl border border-slate-200/80 dark:border-slate-700 animate-fade-in-up">
            <div className="w-16 h-16 rounded-2xl bg-primary-100 dark:bg-primary-950/70 text-primary-600 dark:text-primary-400 flex items-center justify-center mx-auto mb-5 shadow-inner">
              <Compass className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
              Access Your Career Dashboard
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
              Your personalized World Dashboard holds your academic assessment, career recommendations,
              and sequential learning paths. Sign in or create an account to view or build your profile.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/login?redirect=/dashboard"
                className="inline-flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-5 py-3 rounded-xl font-semibold shadow-lg shadow-primary-500/25 transition btn-3d text-sm"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </Link>
              <Link
                href="/register?redirect=/dashboard"
                className="inline-flex items-center justify-center gap-2 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-500 px-5 py-3 rounded-xl font-semibold shadow-sm transition btn-3d text-sm"
              >
                <UserPlus className="w-4 h-4" />
                <span>Create an Account</span>
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // =========================================================================
  // Case 2: LOGGED IN USER, BUT NO DASHBOARD CREATED YET
  // =========================================================================
  if (!profile || !activeUser.hasDashboard) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-primary-50/20 to-emerald-50/30 dark:from-[#0b0f19] dark:via-[#0f172a] dark:to-[#0b0f19] text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-300">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-4 py-16">
          <div className="relative text-center max-w-lg glass-panel bg-white/90 dark:bg-[#131b2e] rounded-3xl p-8 sm:p-10 shadow-2xl border border-slate-200/80 dark:border-slate-700 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-xs font-semibold mb-6 border border-amber-200/70 dark:border-amber-800">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Dashboard Status: Not Created Yet</span>
            </div>

            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary-500 to-indigo-600 text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-500/25">
              <GraduationCap className="w-8 h-8" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Welcome, {activeUser.name}!
            </h1>

            <p className="text-slate-600 dark:text-slate-200 text-sm sm:text-base mb-8 leading-relaxed">
              You haven't created your Career Dashboard yet. Enter your academic background, genuine interests,
              and dream aspirations to unlock your personalized career paths and roadmaps.
            </p>

            <Link
              href="/assessment"
              className="inline-flex items-center justify-center gap-2.5 bg-primary-600 hover:bg-primary-700 text-white px-7 py-3.5 rounded-xl font-bold shadow-xl shadow-primary-500/25 transition btn-3d text-sm sm:text-base w-full sm:w-auto"
            >
              <span>Create Your Dashboard (Enter Details)</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <p className="text-xs text-slate-400 dark:text-slate-400 mt-6">
              Takes approximately 3 minutes • Powered by AI Navigator V
            </p>
          </div>
        </main>
      </div>
    );
  }

  // =========================================================================
  // Case 3: LOGGED IN USER WITH DASHBOARD CREATED
  // =========================================================================
  const academicScore =
    (profile.academics?.educationLevel ? 1 : 0) * 25 +
    Math.min(25, (profile.academics?.subjects?.length || 0) * 8) +
    Math.min(25, (profile.academics?.strengths?.length || 0) * 8) +
    (profile.academics?.grades ? 25 : 0);
  const academicMax = 100;

  const interestScore =
    Math.min(34, (profile.interests?.interests?.length || 0) * 10) +
    Math.min(33, (profile.interests?.hobbies?.length || 0) * 10) +
    Math.min(33, (profile.interests?.skills?.length || 0) * 10);
  const interestMax = 100;

  const aspirationScore =
    Math.min(30, (profile.aspirations?.dreamRoles?.length || 0) * 15) +
    Math.min(25, (profile.aspirations?.willingToDo?.length || 0) * 10) +
    Math.min(15, (profile.aspirations?.workEnvironment?.length || 0) * 8) +
    Math.min(15, (profile.aspirations?.priorities?.length || 0) * 8) +
    (profile.aspirations?.timeline ? 15 : 0);
  const aspirationMax = 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-primary-50/20 to-emerald-50/30 dark:from-[#0b0f19] dark:via-[#0f172a] dark:to-[#0b0f19] text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <Navbar />

      {detailPanel && profile && (
        <DetailModal panel={detailPanel} profile={profile} onClose={() => setDetailPanel(null)} />
      )}

      <main className="relative max-w-5xl mx-auto px-4 sm:px-6 py-10">
        {/* Dashboard Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-200/80 dark:border-slate-800">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-950/70 text-primary-700 dark:text-primary-300 text-xs font-semibold mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>World Profile Verified</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {profile.name}
            </h1>
            <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">
              Personalized career overview, profile metrics, and actionable recommendations.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/assessment"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-primary-500/25 transition btn-3d"
              title="Click to alter or update your academic and career details"
            >
              <Pencil className="w-4 h-4" />
              <span>Edit Profile Details</span>
            </Link>
          </div>
        </div>

        {/* High-Contrast Alter Details Banner */}
        <div className="mb-8 p-5 rounded-2xl bg-slate-100/90 dark:bg-[#15203b] border border-slate-300/80 dark:border-slate-700 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-primary-100 dark:bg-primary-900/60 text-primary-700 dark:text-primary-300 shrink-0">
              <FileEdit className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                Need to Update or Alter Your Details?
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-200 mt-1 leading-relaxed">
                Keep your academic scores, preferred work style, and dream roles fresh anytime to get the most accurate AI matches.
              </p>
            </div>
          </div>
          <Link
            href="/assessment"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-primary-500/25 transition btn-3d shrink-0"
          >
            <Pencil className="w-3.5 h-3.5" />
            <span>Alter Details Now</span>
          </Link>
        </div>

        {/* Profile Completeness & Career Engine Section */}
        <section className="mb-12 flex flex-col lg:flex-row gap-6">
          <div className="flex-1 glass-panel bg-white/90 dark:bg-[#131b2e] rounded-3xl p-6 border border-slate-200/80 dark:border-slate-700 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                <span>Profile Completeness</span>
              </h2>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-300">
                Click any metric for details
              </span>
            </div>

            <div className="flex flex-wrap justify-around gap-6">
              <CircularStat
                label="Academics"
                percent={(academicScore / academicMax) * 100}
                color="text-primary-500"
                icon={GraduationCap}
                detail={profile.academics?.educationLevel || profile.academics?.subjects?.[0] || "Not set"}
                onClick={() => setDetailPanel("academics")}
              />
              <CircularStat
                label="Interests"
                percent={(interestScore / interestMax) * 100}
                color="text-emerald-500"
                icon={Heart}
                detail={profile.interests?.interests?.[0] || profile.interests?.hobbies?.[0] || "Not set"}
                onClick={() => setDetailPanel("interests")}
              />
              <CircularStat
                label="Aspirations"
                percent={(aspirationScore / aspirationMax) * 100}
                color="text-amber-500"
                icon={Target}
                detail={profile.aspirations?.dreamRoles?.[0] || "Not set"}
                onClick={() => setDetailPanel("aspirations")}
              />
            </div>
          </div>

          <div className="w-full lg:w-1/3 glass-panel bg-white/90 dark:bg-[#131b2e] rounded-3xl p-6 border border-slate-200/80 dark:border-slate-700 shadow-lg flex flex-col justify-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-primary-100 dark:bg-primary-950/70 text-primary-600 dark:text-primary-400 flex items-center justify-center mx-auto mb-3 shadow-inner">
              <Sparkles className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Career Engine
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-200 mb-5 leading-relaxed">
              {recommendations && recommendations.length > 0
                ? "Your profile has been analyzed. Update your details to generate fresh insights."
                : "Match your profile against 50+ career paths and receive a structured procedure."}
            </p>
            <button
              type="button"
              onClick={generateRecommendations}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-xl font-semibold disabled:opacity-60 transition shadow-md shadow-primary-500/25 btn-3d text-sm"
            >
              {loading ? (
                "Calculating Matches..."
              ) : recommendations?.length ? (
                <>
                  <RefreshCw className="w-4 h-4" />
                  <span>Regenerate Recommendations</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Recommendations</span>
                </>
              )}
            </button>
          </div>
        </section>

        {/* Recommendations Section */}
        <section className="mb-16">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            <span>Top Recommendations for You</span>
          </h2>

          {recommendations && recommendations.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {recommendations.map((rec) => (
                <Link
                  key={rec.careerTitle}
                  href={`/career-path?title=${encodeURIComponent(rec.careerTitle)}`}
                  className="group block preserve-3d"
                >
                  <div className="glass-panel bg-white/90 dark:bg-[#131b2e] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-primary-300 dark:hover:border-primary-500 card-3d flex flex-col h-full">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition">
                        {rec.careerTitle}
                      </h3>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span className="rounded-full bg-primary-100 dark:bg-primary-950/80 text-primary-700 dark:text-primary-300 px-2.5 py-0.5 text-xs font-bold">
                          {rec.matchScore}%
                        </span>
                        {rec.skillOverlapPercent !== undefined && (
                          <span className="rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 text-[10px] font-bold">
                            {rec.skillOverlapPercent}% Overlap
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-200 line-clamp-2 mb-4 leading-relaxed flex-1">
                      {rec.description}
                    </p>
                    <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-100 dark:border-slate-800">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleToggleCompare(rec.careerTitle);
                        }}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold transition ${
                          compareList.includes(rec.careerTitle)
                            ? "bg-indigo-600 text-white shadow-sm"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                        }`}
                      >
                        <Scale className="w-3 h-3" />
                        <span>{compareList.includes(rec.careerTitle) ? "Comparing" : "Compare"}</span>
                      </button>
                      <span className="inline-flex items-center gap-1 text-primary-600 dark:text-primary-400 text-xs font-bold">
                        <span>View Path</span>
                        <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="glass-panel bg-white/70 dark:bg-[#131b2e] rounded-3xl p-10 text-center border border-slate-200 dark:border-slate-700 border-dashed shadow-sm">
              <p className="text-slate-500 dark:text-slate-300 text-sm">
                {loading
                  ? "Generating personalized recommendations..."
                  : "Click 'Generate Recommendations' above to calculate your top career matches and step-by-step learning procedures."}
              </p>
            </div>
          )}
        </section>

        {/* Feature 5: Active Learning Roadmaps & Progress */}
        {Object.keys(progressData).length > 0 && (
          <section className="mb-16">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <span>Active Learning Roadmaps & Progress</span>
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {Object.entries(progressData).map(([cTitle, completedSteps]) => {
                const pct = Math.round((completedSteps.length / 4) * 100);
                return (
                  <Link
                    key={cTitle}
                    href={`/career-path?title=${encodeURIComponent(cTitle)}`}
                    className="p-4 rounded-2xl bg-white dark:bg-[#131b2e] border border-slate-200/80 dark:border-slate-700 shadow-sm hover:border-emerald-400 transition card-3d block"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm truncate">
                        {cTitle}
                      </h4>
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        {pct}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-1.5">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-primary-600 transition-all duration-300"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                      {completedSteps.length} of 4 stages completed
                    </p>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Favorites / Saved Careers */}
        {favorites.length > 0 && (
          <section className="mb-16">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500" />
              <span>Saved Careers</span>
            </h2>
            <div className="flex flex-wrap gap-2">
              {favorites.map((title) => (
                <Link
                  key={title}
                  href={`/career-path?title=${encodeURIComponent(title)}`}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 px-4 py-2 text-xs font-semibold text-amber-800 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-amber-950/70 transition btn-3d"
                >
                  <span>{title}</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Browse All Careers by Category */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <Compass className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span>Browse Careers by Category</span>
          </h2>
          <div className="space-y-3">
            {Object.entries(categories).map(([cat, careers]) => (
              <div
                key={cat}
                className="glass-panel bg-white/80 dark:bg-[#131b2e] rounded-2xl border border-slate-200/80 dark:border-slate-700 shadow-sm overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setExpandedCategory(expandedCategory === cat ? null : cat)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition"
                >
                  <span className="font-bold text-slate-800 dark:text-white text-sm sm:text-base">
                    {cat} ({careers.length})
                  </span>
                  <ChevronRight
                    className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${
                      expandedCategory === cat ? "rotate-90" : ""
                    }`}
                  />
                </button>

                {expandedCategory === cat && (
                  <div className="px-6 pb-6 pt-2 border-t border-slate-100 dark:border-slate-800 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                    {careers.map((c) => (
                      <Link
                        key={c.title}
                        href={`/career-path?title=${encodeURIComponent(c.title)}`}
                        className="block p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-700 bg-white/90 dark:bg-slate-800/90 hover:border-primary-300 dark:hover:border-primary-500 hover:shadow-md transition group"
                      >
                        <h4 className="font-semibold text-slate-800 dark:text-white text-sm mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400">
                          {c.title}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-300 line-clamp-2">
                          {c.description}
                        </p>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Bottom Prominent Edit Profile Callout */}
        <div className="mt-12 text-center pt-8 border-t border-slate-200/80 dark:border-slate-800">
          <Link
            href="/assessment"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-primary-50 dark:hover:bg-primary-950/60 text-slate-700 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 border border-slate-200 dark:border-slate-700 font-semibold text-sm transition btn-3d"
          >
            <Pencil className="w-4 h-4" />
            <span>Altering your details? Edit Full Profile</span>
          </Link>
        </div>

        {/* Sticky Career Comparison Bar */}
        {compareList.length > 0 && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-xl w-[92%] glass-panel bg-white/95 dark:bg-slate-900/95 border border-primary-500/60 rounded-2xl p-3.5 shadow-2xl flex items-center justify-between gap-3 animate-fade-in-up">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-primary-100 dark:bg-primary-900/60 text-primary-600 dark:text-primary-300 flex items-center justify-center shrink-0">
                <Scale className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  {compareList.length} Career{compareList.length > 1 ? "s" : ""} Selected for Comparison
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[200px] sm:max-w-xs">
                  {compareList.join(", ")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  clearComparison();
                  setCompareList([]);
                }}
                className="text-xs text-slate-500 hover:text-rose-500 font-semibold px-2 py-1 transition"
              >
                Clear
              </button>
              <Link
                href="/compare"
                className="inline-flex items-center gap-1.5 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md transition btn-3d"
              >
                <span>Compare Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
