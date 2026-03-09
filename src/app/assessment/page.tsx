"use client";

import { useState } from "react";
import Link from "next/link";
import { Compass, ChevronLeft, ChevronRight } from "lucide-react";
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
import { saveProfile, getStoredProfile } from "@/lib/storage";
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
  placeholder,
}: {
  options: string[];
  selected: string[];
  onChange: (v: string[]) => void;
  placeholder: string;
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
          className={`px-3 py-1.5 rounded-lg text-sm border transition ${
            selected.includes(opt)
              ? "bg-primary-600 text-white border-primary-600"
              : "bg-white border-slate-200 text-slate-700 hover:border-primary-300"
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
  const filtered = suggestions.filter(
    (s) => !value.includes(s) && s.toLowerCase().includes(input.trim().toLowerCase())
  ).slice(0, 8);

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
            className="inline-flex items-center gap-1 bg-primary-100 text-primary-800 px-2 py-1 rounded text-sm"
          >
            {item}
            <button type="button" onClick={() => remove(item)} className="hover:text-primary-600">
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
          className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm"
        />
        <button type="button" onClick={() => add()} className="px-4 py-2 bg-slate-100 rounded-lg text-sm font-medium btn-3d">
          Add
        </button>
      </div>
      {showDropdown && filtered.length > 0 && (
        <ul className="absolute z-10 mt-1 w-full max-h-48 overflow-auto rounded-lg border border-slate-200 bg-white shadow-lg py-1">
          {filtered.map((s, i) => (
            <li key={s}>
              <button
                type="button"
                onMouseDown={() => add(s)}
                className={`w-full text-left px-3 py-2 text-sm ${i === highlightIndex ? "bg-primary-50 text-primary-800" : "text-slate-700 hover:bg-slate-50"}`}
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
  const existing = getStoredProfile();
  const [step, setStep] = useState(0);
  const [name, setName] = useState(existing?.name ?? "");
  const [email, setEmail] = useState(existing?.email ?? "");
  const [academics, setAcademics] = useState<AcademicProfile>(
    existing?.academics ?? defaultAcademics
  );
  const [interests, setInterests] = useState<InterestsProfile>(
    existing?.interests ?? defaultInterests
  );
  const [aspirations, setAspirations] = useState<AspirationsProfile>(
    existing?.aspirations ?? defaultAspirations
  );
  const [saving, setSaving] = useState(false);

  const currentStepId = STEPS[step].id;

  const handleSubmit = async () => {
    setSaving(true);
    const profile: UserProfile = {
      id: existing?.id ?? crypto.randomUUID(),
      name: name.trim() || "Anonymous",
      email: email.trim() || "",
      createdAt: existing?.createdAt ?? new Date().toISOString(),
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
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-slate-700 hover:text-primary-600">
            <Compass className="w-7 h-7" />
            <span className="font-semibold">Smart Career Path</span>
          </Link>
          <span className="text-sm text-slate-500">
            Step {step + 1} of {STEPS.length}
          </span>
        </div>
        <div className="max-w-2xl mx-auto px-4 pb-2">
          <div className="flex gap-2">
            {STEPS.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setStep(i)}
                className={`flex-1 h-1.5 rounded-full transition ${
                  i <= step ? "bg-primary-500" : "bg-slate-200"
                }`}
                aria-label={`Go to ${s.title}`}
              />
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <h2 className="text-xl font-semibold text-slate-900 mb-6">
          {STEPS[step].title}
        </h2>

        {currentStepId === "basic" && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name (or nickname)"
                className="w-full rounded-lg border border-slate-200 px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email (optional)</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-lg border border-slate-200 px-3 py-2"
              />
            </div>
          </div>
        )}

        {currentStepId === "academics" && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Education level</label>
              <select
                value={academics.educationLevel}
                onChange={(e) =>
                  setAcademics({ ...academics, educationLevel: e.target.value })
                }
                className="w-full rounded-lg border border-slate-200 px-3 py-2"
              >
                <option value="">Select</option>
                {EDUCATION_LEVELS.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Stream / field</label>
              <input
                type="text"
                value={academics.streamOrField}
                onChange={(e) =>
                  setAcademics({ ...academics, streamOrField: e.target.value })
                }
                placeholder="e.g. Science, Commerce, Arts, CS, etc."
                className="w-full rounded-lg border border-slate-200 px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Subjects you like / are good at</label>
              <TagInputWithSuggestions
                value={academics.subjects}
                onChange={(subjects) => setAcademics({ ...academics, subjects })}
                placeholder="Type to see suggestions..."
                suggestions={SUBJECT_SUGGESTIONS}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Strengths</label>
              <TagInputWithSuggestions
                value={academics.strengths}
                onChange={(strengths) => setAcademics({ ...academics, strengths })}
                placeholder="Type to see suggestions..."
                suggestions={STRENGTH_SUGGESTIONS}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Overall grades / performance</label>
              <input
                type="text"
                value={academics.grades}
                onChange={(e) =>
                  setAcademics({ ...academics, grades: e.target.value })
                }
                placeholder="e.g. Good, Average, Top 10%..."
                className="w-full rounded-lg border border-slate-200 px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Certifications (if any)</label>
              <TagInputWithSuggestions
                value={academics.certifications}
                onChange={(certifications) =>
                  setAcademics({ ...academics, certifications })
                }
                placeholder="Type to see suggestions..."
                suggestions={CERTIFICATION_SUGGESTIONS}
              />
            </div>
          </div>
        )}

        {currentStepId === "interests" && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Interests</label>
              <TagInputWithSuggestions
                value={interests.interests}
                onChange={(interests_list) =>
                  setInterests({ ...interests, interests: interests_list })
                }
                placeholder="Type to see suggestions..."
                suggestions={INTEREST_SUGGESTIONS}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Hobbies</label>
              <TagInputWithSuggestions
                value={interests.hobbies}
                onChange={(hobbies) => setInterests({ ...interests, hobbies })}
                placeholder="Type to see suggestions..."
                suggestions={HOBBY_SUGGESTIONS}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Skills (current)</label>
              <TagInputWithSuggestions
                value={interests.skills}
                onChange={(skills) => setInterests({ ...interests, skills })}
                placeholder="Type to see suggestions..."
                suggestions={SKILL_SUGGESTIONS}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Preferred work style</label>
              <MultiSelect
                options={WORK_STYLES}
                selected={interests.preferredWorkStyle}
                onChange={(preferredWorkStyle) =>
                  setInterests({ ...interests, preferredWorkStyle })
                }
                placeholder="Select"
              />
            </div>
          </div>
        )}

        {currentStepId === "aspirations" && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Dream roles / careers</label>
              <TagInputWithSuggestions
                value={aspirations.dreamRoles}
                onChange={(dreamRoles) =>
                  setAspirations({ ...aspirations, dreamRoles })
                }
                placeholder="Type to see suggestions..."
                suggestions={DREAM_ROLE_SUGGESTIONS}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">What you're willing to do</label>
              <TagInputWithSuggestions
                value={aspirations.willingToDo}
                onChange={(willingToDo) =>
                  setAspirations({ ...aspirations, willingToDo })
                }
                placeholder="Type to see suggestions..."
                suggestions={WILLING_TO_DO_SUGGESTIONS}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Preferred work environment</label>
              <MultiSelect
                options={ENVIRONMENTS}
                selected={aspirations.workEnvironment}
                onChange={(workEnvironment) =>
                  setAspirations({ ...aspirations, workEnvironment })
                }
                placeholder="Select"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Priorities</label>
              <MultiSelect
                options={PRIORITIES}
                selected={aspirations.priorities}
                onChange={(priorities) =>
                  setAspirations({ ...aspirations, priorities })
                }
                placeholder="Select"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Timeline (when you want to start / switch)</label>
              <input
                type="text"
                value={aspirations.timeline}
                onChange={(e) =>
                  setAspirations({ ...aspirations, timeline: e.target.value })
                }
                placeholder="e.g. In 6 months, After graduation..."
                className="w-full rounded-lg border border-slate-200 px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Anything else we should know?</label>
              <textarea
                value={aspirations.additionalNotes}
                onChange={(e) =>
                  setAspirations({ ...aspirations, additionalNotes: e.target.value })
                }
                placeholder="Optional notes..."
                rows={3}
                className="w-full rounded-lg border border-slate-200 px-3 py-2"
              />
            </div>
          </div>
        )}

        <div className="mt-10 flex justify-between">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="flex items-center gap-1 text-slate-600 hover:text-slate-900 disabled:opacity-50"
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </button>
          {step < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              disabled={!canNext}
              className="flex items-center gap-1 bg-primary-600 text-white px-4 py-2 rounded-lg font-medium disabled:opacity-50 btn-3d"
            >
              Next
              <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={saving}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium disabled:opacity-50 btn-3d"
            >
              {saving ? "Saving..." : "Save and go to dashboard"}
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
