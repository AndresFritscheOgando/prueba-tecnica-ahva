import { createContext, useContext, useState, type ReactNode } from 'react';
import { toast } from 'sonner';
import { authApi, type AuthResponse } from '../api/auth';

function toErrorMessage(err: unknown, fallback: string): string {
  if (err instanceof TypeError) {
    return 'No se pudo conectar con el servidor. Verifica tu conexión e intenta nuevamente.';
  }
  return err instanceof Error ? err.message : fallback;
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
}

interface AuthContextValue extends AuthState {
  setSession: (res: AuthResponse) => void;
  register: (username: string, email: string, password: string) => Promise<void>;
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

  async function register(username: string, email: string, password: string) {
    try {
      save(await authApi.register(username, email, password));
    } catch (err) {
      toast.error(toErrorMessage(err, 'No se pudo completar el registro'));
    }
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

  return (
    <AuthContext.Provider value={{ ...state, setSession: save, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}
