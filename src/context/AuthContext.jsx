import React, { createContext, useContext, useState, useEffect } from 'react';

import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const savedUser = localStorage.getItem('neighborhood_user');
      if (savedUser) {
        try {
          const userData = JSON.parse(savedUser);
          // Verify token with backend
          const response = await api.get('/auth/me');
          if (response.data.success) {
            setUser({ ...userData, ...response.data.user });
          } else {
            localStorage.removeItem('neighborhood_user');
          }
        } catch (error) {
          console.error('Auth verification failed:', error);
          localStorage.removeItem('neighborhood_user');
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/signin', { email, password });
      if (response.data.success) {
        const userData = {
          ...response.data.user,
          token: response.data.token,
          isSubscribed: response.data.user.isSubscribed || false,
        };
        setUser(userData);
        localStorage.setItem('neighborhood_user', JSON.stringify(userData));
        return { success: true };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  };

  const register = async (name, email, password, confirmPassword) => {
    try {
      const response = await api.post('/auth/signup', { 
        name, 
        email, 
        password, 
        confirmPassword 
      });
      if (response.data.success) {
        return { success: true, message: response.data.message };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, message: error.response?.data?.message || 'Signup failed' };
    }
  };

  const subscribe = async (plan = 'silver') => {
    if (user) {
      try {
        const response = await api.post('/subscription/activate', { plan });
        if (response.data.success) {
          const updatedUser = { ...user, isSubscribed: true };
          setUser(updatedUser);
          localStorage.setItem('neighborhood_user', JSON.stringify(updatedUser));
          return true;
        }
      } catch (error) {
        console.error('Failed to activate subscription on server:', error);
      }
      const updatedUser = { ...user, isSubscribed: true };
      setUser(updatedUser);
      localStorage.setItem('neighborhood_user', JSON.stringify(updatedUser));
      return true;
    }
    return false;
  };

  const refreshUser = async () => {
    try {
      const response = await api.get('/auth/me');
      if (response.data.success) {
        const savedUser = localStorage.getItem('neighborhood_user');
        const userData = savedUser ? JSON.parse(savedUser) : {};
        const updatedUser = { ...userData, ...response.data.user };
        setUser(updatedUser);
        localStorage.setItem('neighborhood_user', JSON.stringify(updatedUser));
        return updatedUser;
      }
    } catch (error) {
      console.error('Failed to refresh user details:', error);
    }
    return null;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('neighborhood_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, subscribe, refreshUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
