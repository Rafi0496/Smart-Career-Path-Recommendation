import type { UserProfile, CareerRecommendation } from "./types";

const STORAGE_KEYS = {
  PROFILE: "career_path_user_profile",
  RECOMMENDATIONS: "career_path_recommendations",
  FAVORITES: "career_path_favorites",
};

export function getStoredProfile(): UserProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    return raw ? (JSON.parse(raw) as UserProfile) : null;
  } catch {
    return null;
  }
}

export function saveProfile(profile: UserProfile): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
}

export function getStoredRecommendations(): CareerRecommendation[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.RECOMMENDATIONS);
    return raw ? (JSON.parse(raw) as CareerRecommendation[]) : null;
  } catch {
    return null;
  }
}

export function saveRecommendations(recommendations: CareerRecommendation[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.RECOMMENDATIONS, JSON.stringify(recommendations));
}

export function getStoredFavorites(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function toggleFavorite(careerTitle: string): void {
  if (typeof window === "undefined") return;
  const current = getStoredFavorites();
  const next = current.includes(careerTitle)
    ? current.filter((t) => t !== careerTitle)
    : [...current, careerTitle];
  localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(next));
}

export function clearAll(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEYS.PROFILE);
  localStorage.removeItem(STORAGE_KEYS.RECOMMENDATIONS);
  localStorage.removeItem(STORAGE_KEYS.FAVORITES);
}
