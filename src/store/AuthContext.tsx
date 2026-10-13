import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';

const AUTH_KEY = 'lof_staff_auth_v1';
const STAFF_EMAIL = 'bienestar@campus.edu';
const STAFF_PASSWORD = 'bienestar123';

interface AuthContextValue {
  isStaff: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isStaff, setIsStaff] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(AUTH_KEY);
    if (stored === 'true') setIsStaff(true);
  }, []);

  const login = (email: string, password: string) => {
    if (email.trim().toLowerCase() === STAFF_EMAIL && password === STAFF_PASSWORD) {
      setIsStaff(true);
      localStorage.setItem(AUTH_KEY, 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsStaff(false);
    localStorage.removeItem(AUTH_KEY);
  };

  return (
    <AuthContext.Provider value={{ isStaff, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
