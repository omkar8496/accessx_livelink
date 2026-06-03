const AUTH_KEY_BASE = "atomx.livelink.auth";

function isBrowser() {
  return typeof window !== "undefined";
}

function getBasePath() {
  const raw = process.env.NEXT_PUBLIC_LIVELINK_BASE_PATH ?? "";
  if (!raw) return "";
  const withSlash = raw.startsWith("/") ? raw : `/${raw}`;
  return withSlash.replace(/\/$/, "");
}

function getStorageKey() {
  if (!isBrowser()) return AUTH_KEY_BASE;
  const scope = `${window.location.origin}${getBasePath()}`;
  return `${AUTH_KEY_BASE}:${scope}`;
}

export function saveAuthSession(session) {
  if (!isBrowser()) return;
  const payload = {
    email: session.email,
    token: session.token,
    issuedAt: Date.now()
  };
  window.sessionStorage.setItem(getStorageKey(), JSON.stringify(payload));
}

export function getAuthSession() {
  if (!isBrowser()) return null;
  const raw = window.sessionStorage.getItem(getStorageKey());
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (!parsed?.email || !parsed?.token) return null;
    return parsed;
  } catch (error) {
    console.error("Failed to parse LiveLink auth session", error);
    return null;
  }
}

export function clearAuthSession() {
  if (!isBrowser()) return;
  window.sessionStorage.removeItem(getStorageKey());
}
