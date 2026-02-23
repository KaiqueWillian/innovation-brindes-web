import { getAuthToken } from '@/lib/auth/cookies';
import { useAuthStore } from '@/store/auth.store';
import { ApiClientError } from '@/services/api/types';

const DEFAULT_API_BASE_URL = 'https://apihomolog.innovationbrindes.com.br';
const configuredBaseUrl = (process.env.NEXT_PUBLIC_API_BASE_URL ?? '').trim();
const baseUrl = (configuredBaseUrl || DEFAULT_API_BASE_URL).replace(/\/$/, '');

function buildUrl(path: string) {
  if (/^https?:\/\//.test(path)) {
    return path;
  }

  if (!baseUrl) {
    return path;
  }

  return `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
}

function parseErrorMessage(payload: unknown, fallbackMessage: string) {
  if (!payload || typeof payload !== 'object') {
    return fallbackMessage;
  }

  const data = payload as Record<string, unknown>;
  const candidates = [data.message, data['mensagem'], data.error, data['erro'], data.detail];

  const value = candidates.find((item) => typeof item === 'string' && item.trim().length > 0);
  return typeof value === 'string' ? value : fallbackMessage;
}

function handleUnauthorized() {
  useAuthStore.getState().logout();

  if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
    window.location.replace('/login');
  }
}

interface ApiFetchOptions extends RequestInit {
  skipAuth?: boolean;
}

export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}) {
  const { headers, skipAuth = false, ...rest } = options;
  const token = useAuthStore.getState().token || getAuthToken();

  const requestHeaders = new Headers(headers);
  const isFormData = typeof FormData !== 'undefined' && rest.body instanceof FormData;

  if (!isFormData && !requestHeaders.has('Content-Type')) {
    requestHeaders.set('Content-Type', 'application/json');
  }

  if (token && !skipAuth) {
    requestHeaders.set('Authorization', `Bearer ${token}`);
  }

  try {
    const response = await fetch(buildUrl(path), {
      ...rest,
      headers: requestHeaders
    });

    if (response.status === 401) {
      handleUnauthorized();
      throw new ApiClientError('Sessao expirada. Faca login novamente.', 401);
    }

    if (!response.ok) {
      let message = `Erro ao processar requisicao (status ${response.status}).`;

      try {
        const payload = await response.json();
        message = parseErrorMessage(payload, message);
      } catch {
        // fallback
      }

      throw new ApiClientError(message, response.status);
    }

    if (response.status === 204) {
      return null as T;
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error;
    }

    throw new ApiClientError(
      'Nao foi possivel conectar ao servidor. Verifique sua internet e tente novamente.',
      0
    );
  }
}


