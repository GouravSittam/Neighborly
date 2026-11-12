import { createContext, use, useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { api } from "@/lib/api";

export interface User {
  id: number;
  email: string;
  name?: string;
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  /** Throws on failure so callers can show the error. */
  login: (email: string, password: string) => Promise<void>;
  /** Creates the account, then signs in. Throws on failure. */
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore the session (if any) from the HTTP-only cookie on mount.
  useEffect(() => {
    let cancelled = false;
    api<{ user: User }>("/api/me")
      .then((data) => !cancelled && setUser(data.user))
      .catch(() => !cancelled && setUser(null))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const data = await api<{ user: User }>("/api/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      setUser(data.user);
    },
    [],
  );

  const signup = useCallback(
    async (name: string, email: string, password: string) => {
      await api("/api/signup", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
      });
      await login(email, password);
    },
    [login],
  );

  const logout = useCallback(async () => {
    await api("/api/logout", { method: "POST" }).catch(() => {});
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, loading, login, signup, logout }),
    [user, loading, login, signup, logout],
  );

  return <AuthContext value={value}>{children}</AuthContext>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = use(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
