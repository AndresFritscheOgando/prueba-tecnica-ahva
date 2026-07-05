const BASE = 'http://localhost:5252/api/auth';

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  firstName: string | null;
  paternalSurname: string | null;
  maternalSurname: string | null;
  documentType: string | null;
  documentNumber: string | null;
  birthDate: string | null;
  nationality: string | null;
  sex: string | null;
  secondaryEmail: string | null;
  mobilePhone: string | null;
  secondaryPhoneType: string | null;
  secondaryPhone: string | null;
  contractType: string | null;
  contractDate: string | null;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message: string;
  error?: string;
  retryAfterMinutes?: number;
}

export class ApiError extends Error {
  status: number;
  retryAfterMinutes?: number;

  constructor(message: string, status: number, retryAfterMinutes?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.retryAfterMinutes = retryAfterMinutes;
  }
}

async function request<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const envelope: ApiResponse<T> = await res.json();
  if (!res.ok) throw new ApiError(envelope.error ?? 'Ocurrió un error en la solicitud', res.status, envelope.retryAfterMinutes);
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
      throw new Error(message ?? 'No se pudo cerrar sesión');
    }
  },

  refresh: (refreshToken: string) =>
    request<AuthResponse>('/refresh', { refreshToken }),

  me: async (accessToken: string): Promise<UserProfile> => {
    const res = await fetch(`${BASE}/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const envelope: ApiResponse<UserProfile> = await res.json();
    if (!res.ok) throw new ApiError(envelope.error ?? 'No se pudo cargar el perfil', res.status);
    return envelope.data!;
  },

  updateMe: async (accessToken: string, profile: Omit<UserProfile, 'id' | 'username'>): Promise<UserProfile> => {
    const res = await fetch(`${BASE}/me`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(profile),
    });
    const envelope: ApiResponse<UserProfile> = await res.json();
    if (!res.ok) throw new ApiError(envelope.error ?? 'No se pudo actualizar el perfil', res.status);
    return envelope.data!;
  },
};
