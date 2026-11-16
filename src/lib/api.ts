/**
 * Cliente HTTP da API do Cadê Meu Pix.
 * Guarda os tokens no localStorage e renova o access token com o refresh token
 * automaticamente quando a API responde 401.
 */
export const API_URL: string =
  (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') ||
  'http://localhost:8000/api/v1';

const ACCESS_KEY = 'cmp_access_token';
const REFRESH_KEY = 'cmp_refresh_token';

export interface Tokens {
  access_token: string;
  refresh_token: string;
}

export const tokenStore = {
  get access() {
    return localStorage.getItem(ACCESS_KEY);
  },
  get refresh() {
    return localStorage.getItem(REFRESH_KEY);
  },
  set(tokens: Tokens) {
    localStorage.setItem(ACCESS_KEY, tokens.access_token);
    localStorage.setItem(REFRESH_KEY, tokens.refresh_token);
  },
  clear() {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },
};

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

/** Converte o "detail" do FastAPI (texto ou lista de erros de validação) em mensagem legível. */
export function errorMessage(detail: unknown, fallback: string): string {
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail)) {
    return detail
      .map((d) => (d && typeof d === 'object' && 'msg' in d ? String((d as { msg: unknown }).msg) : String(d)))
      .map((m) => m.replace(/^Value error, /, ''))
      .join('; ');
  }
  return fallback;
}

/** Disparado quando a sessão expira de vez; o AuthContext escuta e desloga. */
export const SESSION_EXPIRED_EVENT = 'cmp:session-expired';

let refreshing: Promise<boolean> | null = null;

async function refreshTokens(): Promise<boolean> {
  const refresh = tokenStore.refresh;
  if (!refresh) return false;
  // várias requisições podem receber 401 ao mesmo tempo: renova uma vez só
  refreshing ??= fetch(`${API_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: refresh }),
  })
    .then(async (res) => {
      if (!res.ok) return false;
      tokenStore.set(await res.json());
      return true;
    })
    .catch(() => false)
    .finally(() => {
      refreshing = null;
    });
  return refreshing;
}

type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export async function apiRequest<T>(
  method: Method,
  path: string,
  body?: unknown,
  { auth = true, retry = true }: { auth?: boolean; retry?: boolean } = {},
): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (auth && tokenStore.access) headers.Authorization = `Bearer ${tokenStore.access}`;

  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiError(0, 'Não foi possível conectar à API. Verifique se o servidor está no ar.');
  }

  if ((res.status === 401 || res.status === 403) && auth && retry) {
    if (await refreshTokens()) return apiRequest<T>(method, path, body, { auth, retry: false });
    tokenStore.clear();
    window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
  }

  if (res.status === 204) return undefined as T;

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new ApiError(res.status, errorMessage(data?.detail, `Erro ${res.status} ao chamar a API.`));
  }
  return data as T;
}

export const api = {
  get: <T>(path: string) => apiRequest<T>('GET', path),
  post: <T>(path: string, body?: unknown) => apiRequest<T>('POST', path, body),
  put: <T>(path: string, body?: unknown) => apiRequest<T>('PUT', path, body),
  patch: <T>(path: string, body?: unknown) => apiRequest<T>('PATCH', path, body),
};
