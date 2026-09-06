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

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  password?: string;
  hasDashboard: boolean;
  profile?: UserProfile;
  recommendations?: CareerRecommendation[];
  favorites?: string[];
  createdAt: string;
  lastLoginAt?: string;
}

export interface CareerRecommendation {
  careerTitle: string;
  matchScore: number;
  /** Normalized percentage of required skills already possessed by user */
  skillOverlapPercent?: number;
  /** Semantic embedding similarity score from sentence-transformers (0-100) */
  semanticScore?: number;
  /** Rule-based feature matching score (0-100) */
  featureScore?: number;
  /** Specific overlapping skills identified in profile */
  matchingSkills?: string[];
  /** Skills candidate needs to develop */
  skillsToDevelop?: string[];
  description: string;
  /** Short "in simple terms" one-liner for quick understanding */
  simpleSummary?: string;
  whyRecommended: string[];
  requiredSkills: string[];
  learningPath: LearningStep[];
  estimatedTimeline: string;
  salaryRange?: string;
}

export interface QuizQuestion {
  skill: string;
  question: string;
  options: string[];
  correct_answer: number;
  explanation: string;
}

export interface LearningProgressRecord {
  careerTitle: string;
  completedSteps: number[];
  lastUpdated: string;
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
