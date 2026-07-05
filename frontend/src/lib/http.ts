import axios from 'axios';

const BASE = 'http://localhost:5252/api/auth';

export interface ApiEnvelope<T> {
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

export const http = axios.create({ baseURL: BASE });

http.interceptors.response.use(
  (response) => response,
  (error) => {
    const envelope = error.response?.data as ApiEnvelope<never> | undefined;
    throw new ApiError(
      envelope?.error ?? 'Ocurrió un error en la solicitud',
      error.response?.status ?? 0,
      envelope?.retryAfterMinutes,
    );
  },
);
