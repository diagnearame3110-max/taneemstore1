import React, { createContext, useContext, useState } from 'react';
import { ADMIN_USER } from '../data/adminUser';

const LS_AUTH = 'taneem_admin_token';

interface AuthContextValue {
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return !!localStorage.getItem(LS_AUTH);
    } catch {
      return false;
    }
  });

  function login(email: string, password: string): boolean {
    if (email === ADMIN_USER.email && password === ADMIN_USER.password) {
      try {
        localStorage.setItem(LS_AUTH, 'taneem-fake-token');
      } catch {}
      setIsAuthenticated(true);
      return true;
    }
    return false;
  }

  function logout() {
    try {
      localStorage.removeItem(LS_AUTH);
    } catch {}
    setIsAuthenticated(false);
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
