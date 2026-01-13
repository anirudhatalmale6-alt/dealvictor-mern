import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI, usersAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const res = await authAPI.getMe();
        setUser(res.data.user || res.data.data);
        setIsAuthenticated(true);
      } catch (err) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  };

  const login = async (email, password) => {
    try {
      setError(null);
      const res = await authAPI.login({ email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setUser(res.data.user);
      setIsAuthenticated(true);
      return { success: true, data: res.data };
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      setError(message);
      return { success: false, error: message };
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      const res = await authAPI.register(userData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setUser(res.data.user);
      setIsAuthenticated(true);
      return { success: true, data: res.data };
    } catch (err) {
      const message = err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Registration failed';
      setError(message);
      return { success: false, error: message };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (err) {
      // Ignore logout errors
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = (userData) => {
    setUser(prev => ({ ...prev, ...userData }));
    localStorage.setItem('user', JSON.stringify({ ...user, ...userData }));
  };

  const updatePassword = async (currentPassword, newPassword) => {
    try {
      setError(null);
      await authAPI.updatePassword({ currentPassword, newPassword });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Password update failed';
      setError(message);
      return { success: false, error: message };
    }
  };

  const forgotPassword = async (email) => {
    try {
      setError(null);
      await authAPI.forgotPassword(email);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to send reset email';
      setError(message);
      return { success: false, error: message };
    }
  };

  const resetPassword = async (token, password) => {
    try {
      setError(null);
      await authAPI.resetPassword(token, password);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Password reset failed';
      setError(message);
      return { success: false, error: message };
    }
  };

  const updateProfile = async (profileData) => {
    try {
      setError(null);
      const res = await usersAPI.updateProfile(profileData);
      setUser(res.data.data);
      localStorage.setItem('user', JSON.stringify(res.data.data));
      return { success: true, data: res.data.data };
    } catch (err) {
      const message = err.response?.data?.message || 'Profile update failed';
      setError(message);
      return { success: false, error: message };
    }
  };

  const getMembership = async () => {
    try {
      const res = await usersAPI.getMembership();
      return { success: true, data: res.data.data };
    } catch (err) {
      return { success: false, error: err.response?.data?.message };
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      error,
      isAuthenticated,
      isAdmin: user?.role === 'admin' || user?.roles?.includes('admin'),
      isFreelancer: user?.role === 'freelancer' || user?.roles?.includes('freelancer'),
      isSeller: user?.role === 'seller' || user?.roles?.includes('seller'),
      login,
      register,
      logout,
      updateUser,
      updatePassword,
      forgotPassword,
      resetPassword,
      updateProfile,
      getMembership,
      checkAuth,
      clearError
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
