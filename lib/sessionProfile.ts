import { ProfileData } from "./linkedinPdfParser";

const SESSION_KEY = "cv_profile";

export function saveProfileToSession(profile: ProfileData): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(profile));
}

export function loadProfileFromSession(): ProfileData | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as ProfileData;
  } catch {
    return null;
  }
}

export function clearProfileFromSession(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(SESSION_KEY);
}
