import { create } from 'zustand';
import { getAuthToken, removeAuthToken, setAuthToken } from '@/lib/auth/cookies';
import {
  clearAuthSessionStorage,
  hydrateAuthSessionFromStorage,
  saveAuthSession
} from '@/lib/auth/storage';

interface AuthUser {
  name?: string;
  username?: string;
}

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  loginSuccess: (input: { token: string; user?: AuthUser | null; remember: boolean }) => void;
  logout: () => void;
  hydrateFromStorage: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isAuthenticated: false,
  loginSuccess: ({ token, user = null, remember }) => {
    setAuthToken(token, remember);
    saveAuthSession({ token, user }, remember);
    set({
      token,
      user,
      isAuthenticated: true
    });
  },
  logout: () => {
    removeAuthToken();
    clearAuthSessionStorage();
    set({
      token: null,
      user: null,
      isAuthenticated: false
    });
  },
  hydrateFromStorage: () => {
    const tokenFromCookie = getAuthToken();
    const session = hydrateAuthSessionFromStorage();

    if (!session?.token) {
      if (tokenFromCookie) {
        removeAuthToken();
      }

      set({
        token: null,
        user: null,
        isAuthenticated: false
      });
      return;
    }

    if (!tokenFromCookie || tokenFromCookie !== session.token) {
      setAuthToken(session.token, Boolean(session.remember));
    }

    set({
      token: session.token,
      user: session.user ?? null,
      isAuthenticated: true
    });
  }
}));


