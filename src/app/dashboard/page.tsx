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
} from "lucide-react";
import { getStoredProfile, getStoredRecommendations, getStoredFavorites } from "@/lib/storage";
import type { UserProfile, CareerRecommendation } from "@/lib/types";

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
      className="group relative flex flex-col items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-full card-3d"
    >
      <div className="relative w-28 h-28 transition-transform duration-300 group-hover:scale-110">
        <svg className="w-full h-full ring-progress" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-slate-200"
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
          <div className="w-14 h-14 rounded-full bg-white/90 shadow-lg flex items-center justify-center border border-slate-100 group-hover:shadow-xl transition-shadow">
            <Icon className="w-6 h-6 text-slate-700" />
          </div>
        </div>
      </div>
      <span className="mt-3 text-sm font-medium text-slate-700 group-hover:text-slate-900">
        {label}
      </span>
      <span className="text-xs text-slate-500">{Math.round(pct)}% complete</span>
      <span className="text-xs text-slate-400 mt-0.5 max-w-[120px] truncate" title={detail}>{detail}</span>
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
  if (!panel) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h3 className="text-lg font-semibold text-slate-900">
            {panel === "academics" && "Academic profile"}
            {panel === "interests" && "Interests & skills"}
            {panel === "aspirations" && "Career aspirations"}
          </h3>
          <div className="flex items-center gap-2">
            <Link
              href="/assessment"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-primary-600 hover:bg-primary-50 btn-3d"
            >
              <Pencil className="w-4 h-4" />
              Edit profile
            </Link>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="p-5 overflow-y-auto flex-1">
          {panel === "academics" && (
            <dl className="space-y-4">
              <div>
                <dt className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Education level</dt>
                <dd className="text-slate-800">{profile.academics.educationLevel || "—"}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Stream / field</dt>
                <dd className="text-slate-800">{profile.academics.streamOrField || "—"}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Subjects</dt>
                <dd className="text-slate-800">
                  {profile.academics.subjects.length ? profile.academics.subjects.join(", ") : "—"}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Strengths</dt>
                <dd className="text-slate-800">
                  {profile.academics.strengths.length ? profile.academics.strengths.join(", ") : "—"}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Grades / performance</dt>
                <dd className="text-slate-800">{profile.academics.grades || "—"}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Certifications</dt>
                <dd className="text-slate-800">
                  {profile.academics.certifications.length ? profile.academics.certifications.join(", ") : "—"}
                </dd>
              </div>
            </dl>
          )}
          {panel === "interests" && (
            <dl className="space-y-4">
              <div>
                <dt className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Interests</dt>
                <dd className="text-slate-800">
                  {profile.interests.interests.length ? profile.interests.interests.join(", ") : "—"}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Hobbies</dt>
                <dd className="text-slate-800">
                  {profile.interests.hobbies.length ? profile.interests.hobbies.join(", ") : "—"}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Skills</dt>
                <dd className="text-slate-800">
                  {profile.interests.skills.length ? profile.interests.skills.join(", ") : "—"}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Preferred work style</dt>
                <dd className="text-slate-800">
                  {profile.interests.preferredWorkStyle.length ? profile.interests.preferredWorkStyle.join(", ") : "—"}
                </dd>
              </div>
            </dl>
          )}
          {panel === "aspirations" && (
            <dl className="space-y-4">
              <div>
                <dt className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Dream roles</dt>
                <dd className="text-slate-800">
                  {profile.aspirations.dreamRoles.length ? profile.aspirations.dreamRoles.join(", ") : "—"}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Willing to do</dt>
                <dd className="text-slate-800">
                  {profile.aspirations.willingToDo.length ? profile.aspirations.willingToDo.join(", ") : "—"}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Work environment</dt>
                <dd className="text-slate-800">
                  {profile.aspirations.workEnvironment.length ? profile.aspirations.workEnvironment.join(", ") : "—"}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Priorities</dt>
                <dd className="text-slate-800">
                  {profile.aspirations.priorities.length ? profile.aspirations.priorities.join(", ") : "—"}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Timeline</dt>
                <dd className="text-slate-800">{profile.aspirations.timeline || "—"}</dd>
              </div>
              {profile.aspirations.additionalNotes && (
                <div>
                  <dt className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Notes</dt>
                  <dd className="text-slate-800">{profile.aspirations.additionalNotes}</dd>
                </div>
              )}
            </dl>
          )}
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [recommendations, setRecommendations] = useState<CareerRecommendation[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [detailPanel, setDetailPanel] = useState<DetailPanel>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    setProfile(getStoredProfile());
    setRecommendations(getStoredRecommendations());
    setFavorites(getStoredFavorites());
  }, []);

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
        if (typeof window !== "undefined")
          localStorage.setItem("career_path_recommendations", JSON.stringify(data.recommendations));
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-primary-50/20 to-emerald-50/30 flex items-center justify-center px-4 perspective-1000">
        <div className="absolute inset-0 overflow-hidden">
          <div className="dashboard-orb w-96 h-96 bg-primary-300 absolute -top-32 -right-32 animate-pulse-glow" />
          <div className="dashboard-orb w-80 h-80 bg-emerald-300 absolute bottom-20 -left-20 animate-float" />
        </div>
        <div className="relative text-center max-w-md glass-panel rounded-3xl p-8 shadow-2xl border border-white/50">
          <Compass className="w-16 h-16 text-primary-500 mx-auto mb-4 opacity-90" />
          <h1 className="text-xl font-semibold text-slate-900 mb-2">No profile yet</h1>
          <p className="text-slate-600 mb-6">
            Complete the assessment to view your profile overview and receive career recommendations.
          </p>
          <Link
            href="/assessment"
            className="inline-flex items-center gap-2 bg-primary-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-primary-700 transition shadow-lg shadow-primary-200 btn-3d"
          >
            Start assessment
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  const academicScore =
    (profile.academics.educationLevel ? 1 : 0) * 25 +
    Math.min(25, profile.academics.subjects.length * 8) +
    Math.min(25, profile.academics.strengths.length * 8) +
    (profile.academics.grades ? 25 : 0);
  const academicMax = 100;
  const interestScore =
    Math.min(34, profile.interests.interests.length * 10) +
    Math.min(33, profile.interests.hobbies.length * 10) +
    Math.min(33, profile.interests.skills.length * 10);
  const aspirationScore =
    Math.min(40, profile.aspirations.dreamRoles.length * 15) +
    Math.min(30, profile.aspirations.willingToDo.length * 10) +
    Math.min(30, profile.aspirations.priorities.length * 10);
  const aspirationMax = 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-primary-50/20 to-emerald-50/30 relative overflow-hidden">
      {detailPanel && profile && (
        <DetailModal panel={detailPanel} profile={profile} onClose={() => setDetailPanel(null)} />
      )}

      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="dashboard-orb w-[500px] h-[500px] bg-primary-200 absolute -top-40 -right-40 animate-float" />
        <div className="dashboard-orb w-[400px] h-[400px] bg-emerald-200 absolute top-1/2 -left-32 animate-pulse-glow" />
        <div className="dashboard-orb w-[300px] h-[300px] bg-violet-200 absolute bottom-0 right-1/3 animate-float" style={{ animationDelay: "-2s" }} />
      </div>

      <header className="relative border-b border-white/40 bg-white/60 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-slate-700 hover:text-primary-600 transition link-3d">
            <Compass className="w-7 h-7" />
            <span className="font-semibold">Smart Career Path</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/assessment" className="text-slate-600 hover:text-primary-600 text-sm font-medium link-3d">
              Edit profile
            </Link>
            <Link href="/" className="text-slate-600 hover:text-primary-600 text-sm font-medium link-3d">
              Home
            </Link>
          </div>
        </div>
      </header>

      <main className="relative max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-1">
          {profile.name}
        </h1>
        <p className="text-slate-600 mb-10">
          Profile overview and career recommendations.
        </p>

        <section className="flex flex-wrap justify-center gap-12 sm:gap-16 mb-14">
          <CircularStat
            label="Academics"
            percent={(academicScore / academicMax) * 100}
            color="text-primary-500"
            icon={GraduationCap}
            detail={profile.academics.educationLevel || profile.academics.subjects[0] || "Not set"}
            onClick={() => setDetailPanel("academics")}
          />
          <CircularStat
            label="Interests"
            percent={interestScore}
            color="text-emerald-500"
            icon={Heart}
            detail={profile.interests.interests[0] || profile.interests.hobbies[0] || "Not set"}
            onClick={() => setDetailPanel("interests")}
          />
          <CircularStat
            label="Aspirations"
            percent={(aspirationScore / aspirationMax) || 0}
            color="text-amber-500"
            icon={Target}
            detail={profile.aspirations.dreamRoles[0] || "Not set"}
            onClick={() => setDetailPanel("aspirations")}
          />
        </section>

        <section className="perspective-1000 mb-12 flex justify-center">
          <div
            className="relative w-full max-w-md preserve-3d"
            style={{
              transform: hoveredCard === -1 ? "rotateX(2deg) rotateY(-2deg) translateZ(10px)" : undefined,
            }}
          >
            <div
              onMouseEnter={() => setHoveredCard(-1)}
              onMouseLeave={() => setHoveredCard(null)}
              className="glass-panel rounded-3xl p-8 shadow-xl border border-white/60 text-center transition-all duration-300 card-3d"
            >
              <Sparkles className="w-12 h-12 text-primary-500 mx-auto mb-4" />
              <h2 className="text-lg font-semibold text-slate-900 mb-2">
                Generate recommendations
              </h2>
              <p className="text-sm text-slate-600 mb-6">
                Match your profile to career paths and receive a structured learning plan.
              </p>
              <button
                type="button"
                onClick={generateRecommendations}
                disabled={loading}
                className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-700 disabled:opacity-60 transition shadow-lg shadow-primary-200 btn-3d"
              >
                {loading ? (
                  "Generating..."
                ) : recommendations?.length ? (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    Regenerate
                  </>
                ) : (
                  "Generate recommendations"
                )}
              </button>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary-600" />
            Career recommendations
          </h2>

          {recommendations && recommendations.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {recommendations.map((rec, i) => (
                <Link
                  key={rec.careerTitle}
                  href={`/career-path?title=${encodeURIComponent(rec.careerTitle)}`}
                  onMouseEnter={() => setHoveredCard(i)}
                  onMouseLeave={() => setHoveredCard(null)}
                  className="group block preserve-3d"
                >
                  <div
                    className="glass-panel rounded-2xl p-5 border border-white/50 shadow-lg transition-all duration-300 card-3d hover:border-primary-200"
                    style={{
                      transform: hoveredCard === i ? "rotateX(2deg) rotateY(-2deg) translateZ(8px)" : undefined,
                    }}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-slate-900 group-hover:text-primary-700 transition">
                        {rec.careerTitle}
                      </h3>
                      <span className="shrink-0 rounded-full bg-primary-100 text-primary-700 px-2 py-0.5 text-xs font-medium">
                        {rec.matchScore}%
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 line-clamp-2 mb-3">
                      {rec.description}
                    </p>
                    <span className="inline-flex items-center gap-1 text-primary-600 text-sm font-medium">
                      View learning path
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="glass-panel rounded-2xl p-10 text-center border border-white/50 shadow-lg">
              <p className="text-slate-500">
                {loading
                  ? "Generating recommendations..."
                  : "Generate recommendations above to view personalized career paths and learning plans."}
              </p>
            </div>
          )}
        </section>

        {favorites.length > 0 && (
          <section className="mt-10">
            <h2 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500" />
              Saved careers
            </h2>
            <div className="flex flex-wrap gap-2">
              {favorites.map((title) => (
                <Link
                  key={title}
                  href={`/career-path?title=${encodeURIComponent(title)}`}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-amber-50 border border-amber-100 px-4 py-2 text-sm font-medium text-amber-800 hover:bg-amber-100 transition link-3d"
                >
                  {title}
                  <ChevronRight className="w-4 h-4" />
                </Link>
              ))}
            </div>
          </section>
        )}

        <div className="mt-10 text-center">
          <Link href="/assessment" className="text-primary-600 hover:underline text-sm font-medium link-3d">
            Edit profile
          </Link>
        </div>
      </main>
    </div>
  );
}
