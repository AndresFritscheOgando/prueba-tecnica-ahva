import { createContext, useContext, useState, type ReactNode } from 'react';
import { toast } from 'sonner';
import { ApiError, authApi, type AuthResponse } from '../api/auth';

function toErrorMessage(err: unknown, fallback: string): string {
  if (err instanceof TypeError) {
    return 'No se pudo conectar con el servidor. Verifica tu conexión e intenta nuevamente.';
  }
  return err instanceof Error ? err.message : fallback;
}

const SESSION_EXPIRED_MESSAGE =
  'Su sesión ha expirado debido a inactividad. Por favor, inicie sesión nuevamente.';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
}

interface AuthContextValue extends AuthState {
  setSession: (res: AuthResponse) => void;
  clearSession: () => void;
  authFetch: <T>(fn: (accessToken: string) => Promise<T>) => Promise<T>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(() => ({
    accessToken: sessionStorage.getItem('accessToken'),
    refreshToken: sessionStorage.getItem('refreshToken'),
  }));

  function save(res: AuthResponse) {
    sessionStorage.setItem('accessToken', res.accessToken);
    sessionStorage.setItem('refreshToken', res.refreshToken);
    setState({ accessToken: res.accessToken, refreshToken: res.refreshToken });
  }

  function clear() {
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('refreshToken');
    setState({ accessToken: null, refreshToken: null });
  }

  async function logout() {
    try {
      if (state.accessToken) await authApi.logout(state.accessToken);
    } catch (err) {
      toast.error(toErrorMessage(err, 'No se pudo cerrar sesión'));
    } finally {
      clear();
    }
  }

  async function authFetch<T>(fn: (accessToken: string) => Promise<T>): Promise<T> {
    try {
      return await fn(state.accessToken!);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401 && state.refreshToken) {
        try {
          const res = await authApi.refresh(state.refreshToken);
          save(res);
          return await fn(res.accessToken);
        } catch {
          clear();
          toast.error(SESSION_EXPIRED_MESSAGE);
          throw err;
        }
      }
      throw err;
    }
  }

  return (
    <AuthContext.Provider value={{ ...state, setSession: save, clearSession: clear, authFetch, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}
