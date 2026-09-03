"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import type {
  UserProfile,
  AcademicProfile,
  InterestsProfile,
  AspirationsProfile,
} from "@/lib/types";
import {
  EDUCATION_LEVELS,
  WORK_STYLES,
  ENVIRONMENTS,
  PRIORITIES,
} from "@/lib/types";
import { saveProfile, getStoredProfile, getActiveUser } from "@/lib/storage";
import {
  SUBJECT_SUGGESTIONS,
  STRENGTH_SUGGESTIONS,
  INTEREST_SUGGESTIONS,
  HOBBY_SUGGESTIONS,
  SKILL_SUGGESTIONS,
  DREAM_ROLE_SUGGESTIONS,
  WILLING_TO_DO_SUGGESTIONS,
  CERTIFICATION_SUGGESTIONS,
} from "@/lib/suggestions";

const defaultAcademics: AcademicProfile = {
  educationLevel: "",
  streamOrField: "",
  subjects: [],
  strengths: [],
  grades: "",
  certifications: [],
};

const defaultInterests: InterestsProfile = {
  interests: [],
  hobbies: [],
  skills: [],
  preferredWorkStyle: [],
};

const defaultAspirations: AspirationsProfile = {
  dreamRoles: [],
  willingToDo: [],
  workEnvironment: [],
  priorities: [],
  timeline: "",
  additionalNotes: "",
};

const STEPS = [
  { id: "basic", title: "Basic info" },
  { id: "academics", title: "Academics" },
  { id: "interests", title: "Interests & hobbies" },
  { id: "aspirations", title: "Aspirations" },
];

function MultiSelect({
  options,
  selected,
  onChange,
}: {
  options: string[];
  selected: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}) {
  const toggle = (opt: string) => {
    if (selected.includes(opt)) onChange(selected.filter((x) => x !== opt));
    else onChange([...selected, opt]);
  };
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => toggle(opt)}
          className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium border transition ${
            selected.includes(opt)
              ? "bg-primary-600 text-white border-primary-600 shadow-sm"
              : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-primary-300 dark:hover:border-primary-500"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

function TagInputWithSuggestions({
  value,
  onChange,
  placeholder,
  suggestions = [],
}: {
  value: string[];
  onChange: (v: string[]) => void;
  placeholder: string;
  suggestions?: string[];
}) {
  const [input, setInput] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(0);
  const filtered = suggestions
    .filter((s) => !value.includes(s) && s.toLowerCase().includes(input.trim().toLowerCase()))
    .slice(0, 8);

  const add = (item?: string) => {
    const t = (item ?? input.trim()).trim();
    if (t && !value.includes(t)) {
      onChange([...value, t]);
      setInput("");
      setShowDropdown(false);
      setHighlightIndex(0);
    }
  };

  const remove = (item: string) => onChange(value.filter((x) => x !== item));

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (showDropdown && filtered.length > 0) {
        add(filtered[highlightIndex]);
      } else {
        add();
      }
      return;
    }
    if (showDropdown && filtered.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlightIndex((i) => (i + 1) % filtered.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlightIndex((i) => (i - 1 + filtered.length) % filtered.length);
      } else if (e.key === "Escape") {
        setShowDropdown(false);
      }
    }
  };

  return (
    <div className="relative">
      <div className="flex flex-wrap gap-2 mb-2">
        {value.map((item) => (
          <span
            key={item}
            className="inline-flex items-center gap-1.5 bg-primary-100 dark:bg-primary-950/80 text-primary-800 dark:text-primary-300 px-2.5 py-1 rounded-lg text-xs font-semibold"
          >
            {item}
            <button
              type="button"
              onClick={() => remove(item)}
              className="hover:text-primary-600 dark:hover:text-primary-200 font-bold ml-1"
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2 relative">
        <input
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setShowDropdown(true);
            setHighlightIndex(0);
          }}
          onFocus={() => input.trim() && setShowDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
        />
        <button
          type="button"
          onClick={() => add()}
          className="px-4 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-sm font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition btn-3d"
        >
          Add
        </button>
      </div>
      {showDropdown && filtered.length > 0 && (
        <ul className="absolute z-20 mt-1 w-full max-h-48 overflow-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xl py-1">
          {filtered.map((s, i) => (
            <li key={s}>
              <button
                type="button"
                onMouseDown={() => add(s)}
                className={`w-full text-left px-3.5 py-2 text-xs sm:text-sm font-medium ${
                  i === highlightIndex
                    ? "bg-primary-50 dark:bg-primary-950/60 text-primary-700 dark:text-primary-300"
                    : "text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                }`}
              >
                {s}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function AssessmentPage() {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [academics, setAcademics] = useState<AcademicProfile>(defaultAcademics);
  const [interests, setInterests] = useState<InterestsProfile>(defaultInterests);
  const [aspirations, setAspirations] = useState<AspirationsProfile>(defaultAspirations);
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const active = getActiveUser();
    const existing = getStoredProfile();

    if (active) {
      setName(active.name || "");
      setEmail(active.email || "");
    }
    if (existing) {
      if (existing.name && !name) setName(existing.name);
      if (existing.email && !email) setEmail(existing.email);
      if (existing.academics) setAcademics(existing.academics);
      if (existing.interests) setInterests(existing.interests);
      if (existing.aspirations) setAspirations(existing.aspirations);
    }
    setLoaded(true);
  }, []);

  const currentStepId = STEPS[step].id;

  const handleSubmit = async () => {
    setSaving(true);
    const active = getActiveUser();
    const profile: UserProfile = {
      id: active?.id ?? crypto.randomUUID(),
      name: name.trim() || active?.name || "Career Explorer",
      email: email.trim() || active?.email || "",
      createdAt: new Date().toISOString(),
      academics,
      interests,
      aspirations,
    };
    saveProfile(profile);
    setSaving(false);
    window.location.href = "/dashboard";
  };

  const canNext =
    (currentStepId === "basic" && name.trim()) ||
    currentStepId === "academics" ||
    currentStepId === "interests" ||
    currentStepId === "aspirations";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-primary-50/20 to-emerald-50/30 dark:from-[#090d16] dark:via-slate-900 dark:to-[#090d16] text-slate-900 dark:text-slate-100 transition-colors duration-300 flex flex-col">
      <Navbar />

      {/* Step Progress Bar */}
      <div className="w-full border-b border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
            <span>
              Step {step + 1} of {STEPS.length}: {STEPS[step].title}
            </span>
            <span>{Math.round(((step + 1) / STEPS.length) * 100)}% Completed</span>
          </div>
          <div className="flex gap-2">
            {STEPS.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setStep(i)}
                className={`flex-1 h-2 rounded-full transition-all duration-300 ${
                  i <= step
                    ? "bg-gradient-to-r from-primary-600 to-indigo-600"
                    : "bg-slate-200 dark:bg-slate-700"
                }`}
                aria-label={`Go to ${s.title}`}
              />
            ))}
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-8 sm:py-12">
        <div className="glass-panel bg-white/85 dark:bg-slate-900/85 rounded-3xl p-6 sm:p-9 border border-slate-200/80 dark:border-slate-800 shadow-xl animate-page-enter">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
            {STEPS[step].title}
          </h2>

          {currentStepId === "basic" && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Full Name or Nickname <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-800/90 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Email Address (optional)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-800/90 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                />
              </div>
            </div>
          )}

          {currentStepId === "academics" && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Education Level
                </label>
                <select
                  value={academics.educationLevel}
                  onChange={(e) =>
                    setAcademics({ ...academics, educationLevel: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                >
                  <option value="">Select Level</option>
                  {EDUCATION_LEVELS.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Stream / Field of Study
                </label>
                <input
                  type="text"
                  value={academics.streamOrField}
                  onChange={(e) =>
                    setAcademics({ ...academics, streamOrField: e.target.value })
                  }
                  placeholder="e.g. Computer Science, Commerce, Biology, Arts"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Subjects You Excel At or Enjoy
                </label>
                <TagInputWithSuggestions
                  value={academics.subjects}
                  onChange={(subjects) => setAcademics({ ...academics, subjects })}
                  placeholder="Type to see suggestions..."
                  suggestions={SUBJECT_SUGGESTIONS}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Key Strengths
                </label>
                <TagInputWithSuggestions
                  value={academics.strengths}
                  onChange={(strengths) => setAcademics({ ...academics, strengths })}
                  placeholder="Type strengths (e.g. Problem Solving)..."
                  suggestions={STRENGTH_SUGGESTIONS}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Overall Grades / Performance
                </label>
                <input
                  type="text"
                  value={academics.grades}
                  onChange={(e) =>
                    setAcademics({ ...academics, grades: e.target.value })
                  }
                  placeholder="e.g. Distinction, 3.8 GPA, 85%, Top 10%"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Certifications (if any)
                </label>
                <TagInputWithSuggestions
                  value={academics.certifications}
                  onChange={(certifications) =>
                    setAcademics({ ...academics, certifications })
                  }
                  placeholder="e.g. AWS Certified, Python Basics..."
                  suggestions={CERTIFICATION_SUGGESTIONS}
                />
              </div>
            </div>
          )}

          {currentStepId === "interests" && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Interests & Passions
                </label>
                <TagInputWithSuggestions
                  value={interests.interests}
                  onChange={(interests_list) =>
                    setInterests({ ...interests, interests: interests_list })
                  }
                  placeholder="e.g. Artificial Intelligence, Design..."
                  suggestions={INTEREST_SUGGESTIONS}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Hobbies
                </label>
                <TagInputWithSuggestions
                  value={interests.hobbies}
                  onChange={(hobbies) => setInterests({ ...interests, hobbies })}
                  placeholder="e.g. Gaming, Reading, Video Editing..."
                  suggestions={HOBBY_SUGGESTIONS}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Current Skills
                </label>
                <TagInputWithSuggestions
                  value={interests.skills}
                  onChange={(skills) => setInterests({ ...interests, skills })}
                  placeholder="e.g. Python, Public Speaking, Figma..."
                  suggestions={SKILL_SUGGESTIONS}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  Preferred Work Style
                </label>
                <MultiSelect
                  options={WORK_STYLES}
                  selected={interests.preferredWorkStyle}
                  onChange={(preferredWorkStyle) =>
                    setInterests({ ...interests, preferredWorkStyle })
                  }
                />
              </div>
            </div>
          )}

          {currentStepId === "aspirations" && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Dream Roles / Careers
                </label>
                <TagInputWithSuggestions
                  value={aspirations.dreamRoles}
                  onChange={(dreamRoles) =>
                    setAspirations({ ...aspirations, dreamRoles })
                  }
                  placeholder="e.g. Software Architect, Product Manager..."
                  suggestions={DREAM_ROLE_SUGGESTIONS}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  What You're Willing To Do
                </label>
                <TagInputWithSuggestions
                  value={aspirations.willingToDo}
                  onChange={(willingToDo) =>
                    setAspirations({ ...aspirations, willingToDo })
                  }
                  placeholder="e.g. Relocate, Take online bootcamp..."
                  suggestions={WILLING_TO_DO_SUGGESTIONS}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  Preferred Work Environment
                </label>
                <MultiSelect
                  options={ENVIRONMENTS}
                  selected={aspirations.workEnvironment}
                  onChange={(workEnvironment) =>
                    setAspirations({ ...aspirations, workEnvironment })
                  }
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  Top Priorities
                </label>
                <MultiSelect
                  options={PRIORITIES}
                  selected={aspirations.priorities}
                  onChange={(priorities) =>
                    setAspirations({ ...aspirations, priorities })
                  }
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Target Timeline
                </label>
                <input
                  type="text"
                  value={aspirations.timeline}
                  onChange={(e) =>
                    setAspirations({ ...aspirations, timeline: e.target.value })
                  }
                  placeholder="e.g. Within 6 months, Upon graduation"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Additional Aspirations or Constraints (optional)
                </label>
                <textarea
                  value={aspirations.additionalNotes}
                  onChange={(e) =>
                    setAspirations({ ...aspirations, additionalNotes: e.target.value })
                  }
                  placeholder="Any additional background, goals, or constraints..."
                  rows={3}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                />
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="mt-10 flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 transition"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            {step < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s + 1)}
                disabled={!canNext}
                className="flex items-center gap-1.5 bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold disabled:opacity-40 transition shadow-md shadow-primary-500/25 btn-3d"
              >
                <span>Continue</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={saving}
                className="flex items-center gap-2 bg-gradient-to-r from-primary-600 to-emerald-600 hover:from-primary-700 hover:to-emerald-700 text-white px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold disabled:opacity-50 transition shadow-lg shadow-primary-500/25 btn-3d"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{saving ? "Saving Profile..." : "Save & Open World Dashboard"}</span>
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
