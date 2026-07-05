import { createContext, useContext, useState, type ReactNode } from 'react';
import { authApi, type AuthResponse } from '../api/auth';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
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

  async function login(email: string, password: string) {
    save(await authApi.login(email, password));
  }

  async function register(username: string, email: string, password: string) {
    save(await authApi.register(username, email, password));
  }

  async function logout() {
    if (state.accessToken) await authApi.logout(state.accessToken);
    clear();
  }

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
