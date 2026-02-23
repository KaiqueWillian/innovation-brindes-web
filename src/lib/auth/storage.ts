const AUTH_LOCAL_STORAGE_KEY = 'innovation-brindes-auth-local';
const AUTH_SESSION_STORAGE_KEY = 'innovation-brindes-auth-session';

export interface StoredAuthUser {
  name?: string;
  username?: string;
}

export interface StoredAuthSession {
  token: string;
  user: StoredAuthUser | null;
  remember: boolean;
}

function canUseBrowserStorage() {
  return typeof window !== 'undefined';
}

function parseStoredSession(value: string | null): StoredAuthSession | null {
  if (!value) {
    return null;
  }

  try {
    const parsed = JSON.parse(value) as Partial<StoredAuthSession> | null;
    const token = typeof parsed?.token === 'string' ? parsed.token : '';

    if (!token.trim()) {
      return null;
    }

    return {
      token,
      user: parsed?.user ?? null,
      remember: Boolean(parsed?.remember)
    };
  } catch {
    return null;
  }
}

export function saveAuthSession(session: Omit<StoredAuthSession, 'remember'>, remember: boolean) {
  if (!canUseBrowserStorage()) {
    return;
  }

  const serialized = JSON.stringify({
    token: session.token,
    user: session.user ?? null,
    remember
  });

  if (remember) {
    localStorage.setItem(AUTH_LOCAL_STORAGE_KEY, serialized);
    sessionStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
    return;
  }

  sessionStorage.setItem(AUTH_SESSION_STORAGE_KEY, serialized);
  localStorage.removeItem(AUTH_LOCAL_STORAGE_KEY);
}

export function hydrateAuthSessionFromStorage() {
  if (!canUseBrowserStorage()) {
    return null;
  }

  const localSession = parseStoredSession(localStorage.getItem(AUTH_LOCAL_STORAGE_KEY));

  if (localSession) {
    return {
      ...localSession,
      remember: true
    } satisfies StoredAuthSession;
  }

  const sessionSession = parseStoredSession(sessionStorage.getItem(AUTH_SESSION_STORAGE_KEY));

  if (!sessionSession) {
    return null;
  }

  return {
    ...sessionSession,
    remember: false
  } satisfies StoredAuthSession;
}

export function clearAuthSessionStorage() {
  if (!canUseBrowserStorage()) {
    return;
  }

  localStorage.removeItem(AUTH_LOCAL_STORAGE_KEY);
  sessionStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
}
