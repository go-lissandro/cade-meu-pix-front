import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { api, apiRequest, SESSION_EXPIRED_EVENT, tokenStore, type Tokens } from '@/lib/api';
import { toUser, type ApiUser } from '@/lib/adapters';
import type { User } from '@/types/billing';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  const loadMe = useCallback(async () => {
    setUser(toUser(await api.get<ApiUser>('/users/me')));
  }, []);

  const logout = useCallback(() => {
    tokenStore.clear();
    setUser(null);
    queryClient.clear();
  }, [queryClient]);

  // Restaura a sessão salva ao abrir o app
  useEffect(() => {
    if (!tokenStore.access) {
      setLoading(false);
      return;
    }
    loadMe().catch(() => tokenStore.clear()).finally(() => setLoading(false));
  }, [loadMe]);

  useEffect(() => {
    window.addEventListener(SESSION_EXPIRED_EVENT, logout);
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, logout);
  }, [logout]);

  const login = useCallback(async (email: string, password: string) => {
    const tokens = await apiRequest<Tokens>('POST', '/auth/login', { email, password }, { auth: false });
    tokenStore.set(tokens);
    await loadMe();
  }, [loadMe]);

  const register = useCallback(async (name: string, email: string, password: string) => {
    await apiRequest('POST', '/auth/register', { name, email, password }, { auth: false });
    await login(email, password);
  }, [login]);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth precisa estar dentro de <AuthProvider>');
  return ctx;
};
