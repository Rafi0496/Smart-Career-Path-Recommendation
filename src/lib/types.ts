export interface AcademicProfile {
  educationLevel: string;
  streamOrField: string;
  subjects: string[];
  strengths: string[];
  grades: string;
  certifications: string[];
}

export interface InterestsProfile {
  interests: string[];
  hobbies: string[];
  skills: string[];
  preferredWorkStyle: string[];
}

export interface AspirationsProfile {
  dreamRoles: string[];
  willingToDo: string[];
  workEnvironment: string[];
  priorities: string[];
  timeline: string;
  additionalNotes: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  academics: AcademicProfile;
  interests: InterestsProfile;
  aspirations: AspirationsProfile;
}

export interface CareerRecommendation {
  careerTitle: string;
  matchScore: number;
  description: string;
  /** Short "in simple terms" one-liner for quick understanding */
  simpleSummary?: string;
  whyRecommended: string[];
  requiredSkills: string[];
  learningPath: LearningStep[];
  estimatedTimeline: string;
  salaryRange?: string;
}

export interface LearningStep {
  order: number;
  title: string;
  description: string;
  /** Step-by-step procedure (how to do it). Shown as numbered list. */
  procedure?: string[];
  duration: string;
  resources: string[];
  completed?: boolean;
}

export const EDUCATION_LEVELS = [
  "High School",
  "Undergraduate",
  "Postgraduate",
  "Vocational",
  "Self-taught / Other",
];

export const WORK_STYLES = [
  "Remote",
  "Office",
  "Hybrid",
  "Freelance",
  "Entrepreneurship",
];

export const ENVIRONMENTS = [
  "Startup",
  "Corporate",
  "Government",
  "Non-profit",
  "Education",
  "Research",
];

export const PRIORITIES = [
  "Growth & Learning",
  "Work-Life Balance",
  "Salary & Benefits",
  "Impact & Purpose",
  "Creativity",
  "Stability",
];
