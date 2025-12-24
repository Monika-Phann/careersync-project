import { createContext, useContext, useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { authAtom } from '../store/authAtom';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useAtom(authAtom);
  const [initialized, setInitialized] = useState(false);

  // Restore session from localStorage on load
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        const userData = JSON.parse(storedUser);
        setAuth({
          user: userData,
          token: storedToken,
          isAuthenticated: true,
          role: userData.role || 'student'
        });
      }
    } catch (err) {
      console.error('Auth restoration failed', err);
    } finally {
      setInitialized(true);
    }
  }, [setAuth]);

  const login = (userData, accessToken) => {
    // This triggers the Navbar change immediately
    setAuth({
      user: userData,
      token: accessToken,
      isAuthenticated: true,
      role: userData.role || 'student'
    });

    localStorage.setItem('token', accessToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setAuth({
      user: null,
      token: null,
      isAuthenticated: false,
      role: null
    });
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const value = {
    user: auth.user,
    token: auth.token,
    isAuthenticated: auth.isAuthenticated,
    role: auth.role,
    initialized,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}