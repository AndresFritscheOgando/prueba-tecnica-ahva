const BASE = 'http://localhost:5252/api/auth';

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message: string;
  error?: string;
}

async function request<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const envelope: ApiResponse<T> = await res.json();
  if (!res.ok) throw new Error(envelope.error ?? 'Request failed');
  return envelope.data!;
}

export const authApi = {
  register: (username: string, email: string, password: string) =>
    request<AuthResponse>('/register', { username, email, password }),

  login: (username: string, password: string) =>
    request<AuthResponse>('/login', { username, password }),

  logout: async (accessToken: string) => {
    const res = await fetch(`${BASE}/logout`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) {
      const message = await res
        .json()
        .then((envelope: ApiResponse<never>) => envelope.error)
        .catch(() => undefined);
      throw new Error(message ?? 'Logout failed');
    }
  },

  refresh: (refreshToken: string) =>
    request<AuthResponse>('/refresh', { refreshToken }),
};
