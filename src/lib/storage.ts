import type { UserProfile, CareerRecommendation, UserAccount } from "./types";

const STORAGE_KEYS = {
  USERS: "career_path_users_v2",
  ACTIVE_USER_ID: "career_path_active_user_id_v2",
  PROFILE: "career_path_user_profile",
  RECOMMENDATIONS: "career_path_recommendations",
  FAVORITES: "career_path_favorites",
  THEME: "career_path_theme",
  LOGIN_TOAST: "career_path_login_toast",
};

/**
 * Migration helper: if an old single-user profile exists in legacy storage,
 * migrate it into the users registry so the existing user's data is preserved
 * as an "old user", but do NOT automatically force it on unauthenticated visitors.
 */
function initializeLegacyMigration(users: UserAccount[]): UserAccount[] {
  if (typeof window === "undefined") return users;
  try {
    const legacyProfileRaw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (legacyProfileRaw && users.length === 0) {
      const legacyProfile = JSON.parse(legacyProfileRaw) as UserProfile;
      if (legacyProfile && legacyProfile.name && legacyProfile.name !== "Anonymous") {
        const legacyRecsRaw = localStorage.getItem(STORAGE_KEYS.RECOMMENDATIONS);
        const legacyRecs = legacyRecsRaw ? JSON.parse(legacyRecsRaw) : undefined;
        const legacyFavsRaw = localStorage.getItem(STORAGE_KEYS.FAVORITES);
        const legacyFavs = legacyFavsRaw ? JSON.parse(legacyFavsRaw) : [];

        const migratedUser: UserAccount = {
          id: legacyProfile.id || "legacy-user-1",
          name: legacyProfile.name,
          email: legacyProfile.email || "user@example.com",
          password: "password123", // default demo password for old user
          hasDashboard: true,
          profile: legacyProfile,
          recommendations: legacyRecs,
          favorites: legacyFavs,
          createdAt: legacyProfile.createdAt || new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
        };
        users.push(migratedUser);
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
        // Clear global legacy keys so visitors don't leak this profile
        localStorage.removeItem(STORAGE_KEYS.PROFILE);
        localStorage.removeItem(STORAGE_KEYS.RECOMMENDATIONS);
        localStorage.removeItem(STORAGE_KEYS.FAVORITES);
      }
    }
  } catch (e) {
    console.error("Migration error:", e);
  }
  return users;
}

export function getAllUsers(): UserAccount[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USERS);
    let users = raw ? (JSON.parse(raw) as UserAccount[]) : [];
    if (users.length === 0) {
      users = initializeLegacyMigration(users);
    }
    return users;
  } catch {
    return [];
  }
}

export function saveAllUsers(users: UserAccount[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
}

export function getActiveUser(): UserAccount | null {
  if (typeof window === "undefined") return null;
  try {
    const activeId = localStorage.getItem(STORAGE_KEYS.ACTIVE_USER_ID);
    if (!activeId) return null;
    const users = getAllUsers();
    return users.find((u) => u.id === activeId) || null;
  } catch {
    return null;
  }
}

export function setActiveUser(user: UserAccount | null): void {
  if (typeof window === "undefined") return;
  if (user) {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_USER_ID, user.id);
  } else {
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_USER_ID);
  }
}

export function registerUser(name: string, email: string, password?: string): { success: boolean; error?: string; user?: UserAccount } {
  if (!name.trim() || !email.trim()) {
    return { success: false, error: "Name and email are required." };
  }
  const users = getAllUsers();
  const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase().trim());
  if (existing) {
    return { success: false, error: "An account with this email already exists. Please log in." };
  }

  const newUser: UserAccount = {
    id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `user-${Date.now()}`,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    password: password?.trim() || "",
    hasDashboard: false, // New user hasn't created dashboard yet
    profile: undefined,
    recommendations: undefined,
    favorites: [],
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
  };

  users.push(newUser);
  saveAllUsers(users);
  setActiveUser(newUser);
  setLoginToast(`Welcome, ${newUser.name}! Your account has been created.`);
  return { success: true, user: newUser };
}

export function loginUser(emailOrName: string, password?: string): { success: boolean; error?: string; user?: UserAccount } {
  const query = emailOrName.trim().toLowerCase();
  if (!query) {
    return { success: false, error: "Please enter your email or name." };
  }
  const users = getAllUsers();
  const found = users.find(
    (u) => u.email.toLowerCase() === query || u.name.toLowerCase() === query
  );

  if (!found) {
    return { success: false, error: "User not found. Please check your credentials or register." };
  }

  // If password was set, verify it
  if (found.password && password && found.password !== password.trim()) {
    return { success: false, error: "Incorrect password. Please try again." };
  }

  found.lastLoginAt = new Date().toISOString();
  saveAllUsers(users);
  setActiveUser(found);
  setLoginToast(`Welcome back, ${found.name}! You are logged into your World Profile.`);
  return { success: true, user: found };
}

export function verifyUserForRecovery(email: string, fullName: string): { success: boolean; user?: UserAccount; error?: string } {
  const queryEmail = email.trim().toLowerCase();
  const queryName = fullName.trim().toLowerCase();

  if (!queryEmail || !queryName) {
    return { success: false, error: "Please enter both your registered email and full name." };
  }

  const users = getAllUsers();
  const found = users.find(
    (u) => u.email.toLowerCase() === queryEmail && u.name.toLowerCase() === queryName
  );

  if (!found) {
    return { success: false, error: "Authentication failed. No matching account found with that email and name." };
  }

  return { success: true, user: found };
}

export function updateUserPassword(userId: string, newPassword: string): { success: boolean; error?: string } {
  if (!newPassword || newPassword.length < 4) {
    return { success: false, error: "Password must be at least 4 characters long." };
  }

  const users = getAllUsers();
  const user = users.find((u) => u.id === userId);
  if (!user) {
    return { success: false, error: "User account not found." };
  }

  user.password = newPassword.trim();
  saveAllUsers(users);
  return { success: true };
}

export function logoutUser(): void {
  if (typeof window === "undefined") return;
  setActiveUser(null);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("auth-change"));
  }
}

export function setLoginToast(message: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.LOGIN_TOAST, message);
}

export function getAndClearLoginToast(): string | null {
  if (typeof window === "undefined") return null;
  const msg = localStorage.getItem(STORAGE_KEYS.LOGIN_TOAST);
  if (msg) {
    localStorage.removeItem(STORAGE_KEYS.LOGIN_TOAST);
  }
  return msg;
}

export function getStoredProfile(): UserProfile | null {
  const active = getActiveUser();
  if (active && active.hasDashboard && active.profile) {
    return active.profile;
  }
  return null;
}

export function saveProfile(profile: UserProfile): void {
  const active = getActiveUser();
  if (active) {
    const users = getAllUsers();
    const index = users.findIndex((u) => u.id === active.id);
    if (index !== -1) {
      users[index].hasDashboard = true;
      users[index].profile = profile;
      saveAllUsers(users);
      setActiveUser(users[index]);
    }
  } else {
    // If not logged in, create an account automatically or temporary user
    const users = getAllUsers();
    const tempUser: UserAccount = {
      id: profile.id || `user-${Date.now()}`,
      name: profile.name || "Career Explorer",
      email: profile.email || "explorer@example.com",
      hasDashboard: true,
      profile,
      recommendations: [],
      favorites: [],
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };
    users.push(tempUser);
    saveAllUsers(users);
    setActiveUser(tempUser);
  }
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("auth-change"));
  }
}

export function getStoredRecommendations(): CareerRecommendation[] | null {
  const active = getActiveUser();
  if (active && active.recommendations && active.recommendations.length > 0) {
    return active.recommendations;
  }
  return null;
}

export function saveRecommendations(recommendations: CareerRecommendation[]): void {
  const active = getActiveUser();
  if (active) {
    const users = getAllUsers();
    const index = users.findIndex((u) => u.id === active.id);
    if (index !== -1) {
      users[index].recommendations = recommendations;
      saveAllUsers(users);
      setActiveUser(users[index]);
    }
  }
}

export function getStoredFavorites(): string[] {
  const active = getActiveUser();
  if (active && active.favorites) {
    return active.favorites;
  }
  return [];
}

export function toggleFavorite(careerTitle: string): void {
  const active = getActiveUser();
  if (!active) return;
  const users = getAllUsers();
  const index = users.findIndex((u) => u.id === active.id);
  if (index === -1) return;

  const current = users[index].favorites || [];
  const next = current.includes(careerTitle)
    ? current.filter((t) => t !== careerTitle)
    : [...current, careerTitle];
  users[index].favorites = next;
  saveAllUsers(users);
  setActiveUser(users[index]);
}

export function getStoredTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  try {
    const theme = localStorage.getItem(STORAGE_KEYS.THEME);
    if (theme === "dark" || theme === "light") return theme;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  } catch {
    return "light";
  }
}

export function saveStoredTheme(theme: "light" | "dark"): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.THEME, theme);
  if (theme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}

export function clearAll(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEYS.ACTIVE_USER_ID);
  localStorage.removeItem(STORAGE_KEYS.PROFILE);
  localStorage.removeItem(STORAGE_KEYS.RECOMMENDATIONS);
  localStorage.removeItem(STORAGE_KEYS.FAVORITES);
}
