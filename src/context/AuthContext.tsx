import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { api, setCsrfToken } from "@/lib/api";
import type { Role, SelfUser } from "@/types/auth";

interface MeResponse {
  user: SelfUser | null;
  csrfToken: string | null;
}

interface AuthContextValue {
  user: SelfUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  isModerator: boolean;
  isAdmin: boolean;
  /** Re-fetch the session from the server. */
  refresh: () => Promise<void>;
  login: (login: string, password: string) => Promise<void>;
  register: (input: {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  /** Replace the cached user (after profile/password updates). */
  setUser: (user: SelfUser) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const ROLE_RANK: Record<Role, number> = { user: 1, moderator: 2, admin: 3 };

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<SelfUser | null>(null);
  const [loading, setLoading] = useState(true);

  const applySession = useCallback((res: MeResponse) => {
    setUserState(res.user ?? null);
    setCsrfToken(res.csrfToken ?? null);
  }, []);

  const refresh = useCallback(async () => {
    try {
      const res = await api.get<MeResponse>("/auth/me");
      applySession(res);
    } catch {
      // Treat any failure (including a missing backend in local dev) as logged
      // out rather than crashing the app.
      setUserState(null);
      setCsrfToken(null);
    } finally {
      setLoading(false);
    }
  }, [applySession]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const login = useCallback(
    async (loginValue: string, password: string) => {
      const res = await api.post<MeResponse>("/auth/login", {
        login: loginValue,
        password,
      });
      applySession(res);
    },
    [applySession],
  );

  const register = useCallback(
    async (input: {
      username: string;
      email: string;
      password: string;
      confirmPassword: string;
    }) => {
      const res = await api.post<MeResponse>("/auth/register", input);
      applySession(res);
    },
    [applySession],
  );

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      setUserState(null);
      setCsrfToken(null);
    }
  }, []);

  const setUser = useCallback((next: SelfUser) => setUserState(next), []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      isAuthenticated: user != null,
      isModerator: user ? ROLE_RANK[user.role] >= ROLE_RANK.moderator : false,
      isAdmin: user ? user.role === "admin" : false,
      refresh,
      login,
      register,
      logout,
      setUser,
    }),
    [user, loading, refresh, login, register, logout, setUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
