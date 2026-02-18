import React, { createContext, useContext, useEffect, useState } from 'react';
import { getAccount, login as appwriteLogin, register as appwriteRegister, logout as appwriteLogout } from '../utils/appwrite';

type AuthContextValue = {
  user: any | null;
  setUser: (u: any | null) => void;
  login: (email: string, password: string) => Promise<any>;
  register: (email: string, password: string, name?: string) => Promise<any>;
  logout: () => Promise<any>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const acc = await getAccount();
      if (mounted) setUser(acc);
    })();
    return () => { mounted = false; };
  }, []);

  const login = async (email: string, password: string) => {
    const res = await appwriteLogin(email, password);
    const acc = await getAccount();
    setUser(acc);
    return res;
  };

  const register = async (email: string, password: string, name?: string) => {
    const res = await appwriteRegister(email, password, name);
    // create session after registration handled by LoginScreen usually
    const acc = await getAccount();
    setUser(acc);
    return res;
  };

  const logout = async () => {
    const res = await appwriteLogout();
    setUser(null);
    return res;
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export default useAuth;
