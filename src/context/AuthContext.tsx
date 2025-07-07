import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import type { User } from '../types/types';

/* ------------------------------------------------------------------ */
/*  public API                                                         */
/* ------------------------------------------------------------------ */
interface AuthCtx {
  user: User | null;
  loading: boolean;
  login(email: string, pwd: string): Promise<string | null>; // returns error‑text or null
  logout(): void;
  updateUser(u: User): void;
}

const AuthContext = createContext<AuthCtx>({} as AuthCtx);
export const useAuth = () => useContext(AuthContext);

/* ------------------------------------------------------------------ */
/*  provider                                                           */
/* ------------------------------------------------------------------ */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser]       = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  /* 1️⃣  hydrate session once ------------------------------------- */
  useEffect(() => {
    const cached = localStorage.getItem('currentUser');
    if (cached) setUser(JSON.parse(cached));
    setLoading(false);
  }, []);

  /* 2️⃣  login ----------------------------------------------------- */
  const login = useCallback(
    async (email: string, pwd: string): Promise<string | null> => {
      setLoading(true);

      const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
      const found = users.find(
        u =>
          u.email.trim().toLowerCase() === email.trim().toLowerCase() &&
          u.password === pwd,
      );

      if (!found) {
        setLoading(false);
        return 'Invalid e‑mail or password';
      }

      localStorage.setItem('currentUser', JSON.stringify(found));
      setUser(found);
      setLoading(false);
      return null; // success
    },
    [],
  );

  /* 3️⃣  logout ---------------------------------------------------- */
  const logout = useCallback(() => {
    localStorage.removeItem('currentUser');
    setUser(null);
  }, []);

  /* 4️⃣  update user + keep session in sync ------------------------ */
  const updateUser = useCallback(
    (updated: User) => {
      const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
      localStorage.setItem(
        'users',
        JSON.stringify(users.map(u => (u.id === updated.id ? updated : u))),
      );
      if (user?.id === updated.id) {
        localStorage.setItem('currentUser', JSON.stringify(updated));
        setUser(updated);
      }
    },
    [user],
  );

  /* 5️⃣  context value -------------------------------------------- */
  const value: AuthCtx = { user, loading, login, logout, updateUser };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
