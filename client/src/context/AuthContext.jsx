import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, logoutUser } from '../services/auth';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [accessToken, setAccessToken] = useState(() => {
    return localStorage.getItem('accessToken') || null;
  });

  const [loading, setLoading] = useState(true); // ✅ loader state

  // ✅ Sync state to localStorage
  useEffect(() => {
    if (user && accessToken) {
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('accessToken', accessToken);
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
    }
  }, [user, accessToken]);

  // ✅ Initial user refresh on load
  useEffect(() => {
    const fetchUser = async () => {
      if (accessToken) {
        try {
          const res = await api.get('/auth/user');
          setUser(res.data);
        } catch (err) {
          console.error('❌ Failed to refresh user:', err);
          setUser(null);
          setAccessToken(null);
        }
      }
      setLoading(false); // ✅ Done loading
    };
    fetchUser();
  }, []);

  const login = async (email, password) => {
    try {
      const { token, user } = await loginUser(email, password);
      setAccessToken(token);
      setUser(user);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Login failed' };
    }
  };

  const register = async (name, email, password) => {
    try {
      await registerUser(name, email, password);
      return await login(email, password);
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Registration failed' };
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.log('Logout error:', err);
    } finally {
      setAccessToken(null);
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
    }
  };

  const refreshUser = async () => {
    try {
      const res = await api.get('/auth/user');
      setUser(res.data);
    } catch (err) {
      console.error('Failed to refresh user:', err);
    }
  };

  const value = {
    user,
    accessToken,
    login,
    register,
    logout,
    refreshUser,
    isAuthenticated: !!user && !!accessToken,
    loading, // ✅ expose this
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
