import { useState, useEffect } from 'react';
import { AuthContext } from './auth-context';
import { authApi } from '../api/client';

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    try {
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const login = async (email, password) => {
    const data = await authApi.login({ email, password });
    if (data.token) {
      setToken(data.token);
      localStorage.setItem('token', data.token);
    }
    if (data.user) {
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
  };

  const register = async (username, email, password) => {
    const data = await authApi.register({ username, email, password });
    return data;
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } finally {
      setToken('');
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: Boolean(token && user),
        login,
        register,
        logout,
        theme,
        toggleTheme,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
