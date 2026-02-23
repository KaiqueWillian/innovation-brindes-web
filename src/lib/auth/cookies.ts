import Cookies from 'js-cookie';
import { AUTH_COOKIE_NAME } from '@/lib/auth/constants';

const REMEMBER_DAYS = 7;

const cookieOptions: Cookies.CookieAttributes = {
  path: '/',
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production'
};

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  return Cookies.get(AUTH_COOKIE_NAME) ?? null;
}

export function setAuthToken(token: string, remember = false) {
  if (!token || typeof window === 'undefined') {
    return;
  }

  if (remember) {
    Cookies.set(AUTH_COOKIE_NAME, token, {
      ...cookieOptions,
      expires: REMEMBER_DAYS
    });
    return;
  }

  Cookies.set(AUTH_COOKIE_NAME, token, cookieOptions);
}

export function removeAuthToken() {
  if (typeof window === 'undefined') {
    return;
  }

  Cookies.remove(AUTH_COOKIE_NAME, { path: '/' });
}


