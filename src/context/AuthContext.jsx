import React, { createContext, useContext, useEffect, useState } from 'react';
import { login as apiLogin } from '../api/authApi';
import { apiClient } from '../api/apiClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // try to load current user if token exists
    const token = localStorage.getItem('authToken');
    if (!token) {
      setLoading(false);
      return;
    }
    apiClient('/auth/me')
      .then((u) => setUser(u))
      .catch(() => {
        // token invalid or expired, clear it
        localStorage.removeItem('authToken');
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const data = await apiLogin(email, password);
    const token = data?.accessToken || data?.token || null;
    if (!token) {
      throw new Error('Authentication failed: missing token');
    }
    localStorage.setItem('authToken', token);
    if (data?.expiresIn) {
      const expiresAt = Date.now() + Number(data.expiresIn || 0);
      localStorage.setItem('authTokenExpiresAt', String(expiresAt));
    }
    try {
      const u = await apiClient('/auth/me');
      setUser(u);
      return u;
    } catch (err) {
      // if /auth/me fails after login, clear token and propagate error
      localStorage.removeItem('authToken');
      throw err;
    }
  };

  const register = async (payload) => {
    // call backend register endpoint
    const res = await apiClient('/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res;
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authTokenExpiresAt');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
