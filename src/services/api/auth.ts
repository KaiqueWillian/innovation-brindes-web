import { apiFetch } from '@/lib/apiClient';
import { ApiClientError, AuthUser, LoginPayload, LoginResponse } from '@/services/api/types';

const API_PREFIX = '/api/innova-dinamica';
const LOGIN_PATH = `${API_PREFIX}/login/acessar`;

function parseStatusValue(status: unknown): number | null {
  if (typeof status === 'number') {
    return status;
  }

  if (typeof status === 'string' && status.trim() !== '') {
    const parsed = Number(status);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

function parseRawUser(raw: Record<string, unknown>): AuthUser | null {
  const rawUser =
    (raw['dados_usuario'] as Record<string, unknown> | undefined) ??
    (raw.user as Record<string, unknown> | undefined);

  if (!rawUser || typeof rawUser !== 'object') {
    return null;
  }

  const userName = rawUser['nome_usuario'] ?? rawUser.name;
  const username = rawUser['usuario'] ?? rawUser.email ?? rawUser['nome_usuario'];

  return {
    name: typeof userName === 'string' ? userName : undefined,
    username: typeof username === 'string' ? username : undefined
  };
}

export async function login(payload: LoginPayload) {
  const rawResponse = await apiFetch<Record<string, unknown>>(LOGIN_PATH, {
    method: 'POST',
    body: JSON.stringify({
      email: payload.email,
      senha: payload.password
    }),
    skipAuth: true
  });

  const status = parseStatusValue(rawResponse.status);
  const accessToken =
    typeof rawResponse['token_de_acesso'] === 'string' && rawResponse['token_de_acesso'].trim().length > 0
      ? rawResponse['token_de_acesso']
      : typeof rawResponse.accessToken === 'string' && rawResponse.accessToken.trim().length > 0
        ? rawResponse.accessToken
        : '';

  if (status === 0) {
    throw new ApiClientError(
      'Nao foi possivel autenticar com as credenciais informadas. Tente novamente.',
      0
    );
  }

  if (!accessToken) {
    throw new ApiClientError('Token de acesso nao retornado pela API.', 0);
  }

  return {
    status,
    message: typeof rawResponse.message === 'string' ? rawResponse.message : '',
    accessToken,
    user: parseRawUser(rawResponse),
    raw: rawResponse
  } satisfies LoginResponse;
}


