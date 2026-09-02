import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

import api from '../api/axios';
import {
  isSuperAdmin,
  isPendingAdminSession,
  hasPendingAdminOtp,
  parseOtpRequestPayload,
  USER_STORAGE_KEY,
  ADMIN_OTP_SESSION_KEY,
  readPendingOtpSession,
} from '../utils/roles';

const AuthContext = createContext();

const persistVerifiedSession = (userData) => {
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
  sessionStorage.removeItem(ADMIN_OTP_SESSION_KEY);
};

const persistPendingOtpSession = (userData) => {
  sessionStorage.setItem(ADMIN_OTP_SESSION_KEY, JSON.stringify(userData));
  localStorage.removeItem(USER_STORAGE_KEY);
};

const clearAllSessions = () => {
  localStorage.removeItem(USER_STORAGE_KEY);
  sessionStorage.removeItem(ADMIN_OTP_SESSION_KEY);
};

const buildSession = (payload, extras = {}) => ({
  ...payload.user,
  token: payload.token,
  isSubscribed: payload.user?.isSubscribed || false,
  ...extras,
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const cancelAdminOtp = useCallback(() => {
    setUser(null);
    clearAllSessions();
  }, []);

  const restorePendingOtp = useCallback(() => {
    const pending = readPendingOtpSession();
    if (pending && isPendingAdminSession(pending)) {
      setUser(pending);
      return true;
    }
    return false;
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      const pending = readPendingOtpSession();
      if (pending && isPendingAdminSession(pending)) {
        setUser(pending);
        setLoading(false);
        return;
      }

      const savedUser = localStorage.getItem(USER_STORAGE_KEY);
      if (!savedUser) {
        setLoading(false);
        return;
      }

      try {
        const userData = JSON.parse(savedUser);

        if (isPendingAdminSession(userData)) {
          clearAllSessions();
          setLoading(false);
          return;
        }

        const response = await api.get('/auth/me');
        if (response.data.success) {
          setUser({
            ...userData,
            ...response.data.user,
            otpRequired: false,
            adminOtpVerified: true,
          });
        } else {
          clearAllSessions();
        }
      } catch (error) {
        if (!readPendingOtpSession()) {
          console.error('Auth verification failed:', error);
          clearAllSessions();
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/signin', { email, password });
      const data = response.data;
      const role = data.user?.role;

      // Backend feat/admin-otp: only superadmin sign-in returns otpRequired + pending JWT
      if (data.otpRequired) {
        const userData = buildSession(data, {
          otpRequired: true,
          adminOtpVerified: false,
          challengeId: data.challengeId ? String(data.challengeId) : null,
        });
        setUser(userData);
        persistPendingOtpSession(userData);

        if (!userData.challengeId && userData.token) {
          try {
            const otpRes = await api.post('/admin/auth/otp/request', {});
            const otpPayload = parseOtpRequestPayload(otpRes.data);
            if (otpPayload?.challengeId) {
              userData.challengeId = String(otpPayload.challengeId);
              setUser({ ...userData });
              persistPendingOtpSession(userData);
            }
          } catch (otpError) {
            console.error('Admin OTP request failed:', otpError);
          }
        }

        return { success: true, otpRequired: true };
      }

      if (isSuperAdmin(role)) {
        return {
          success: false,
          message: 'Superadmin login requires OTP verification. Please try again.',
        };
      }

      if (data.success) {
        const userData = buildSession(data, {
          otpRequired: false,
          adminOtpVerified: true,
          challengeId: null,
        });
        setUser(userData);
        persistVerifiedSession(userData);
        return { success: true };
      }

      return { success: false, message: data.message };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  };

  const verifyAdminOtp = async (code) => {
    const stored = user || readPendingOtpSession();
    if (!stored?.token || !stored?.challengeId) {
      return { success: false, message: 'No admin verification is pending. Sign in again.' };
    }

    const normalized = String(code || '').replace(/\D/g, '');
    if (normalized.length !== 6) {
      return { success: false, message: 'Enter the 6-digit code from your email.' };
    }

    try {
      const response = await api.post('/admin/auth/otp/verify', {
        challengeId: stored.challengeId,
        code: normalized,
      });
      const data = response.data;

      if (data.success && data.token) {
        let userData = {
          ...stored,
          ...(data.user || {}),
          token: data.token,
          otpRequired: false,
          adminOtpVerified: true,
          challengeId: null,
          isSubscribed: data.user?.isSubscribed ?? stored.isSubscribed,
        };

        try {
          const meRes = await api.get('/auth/me');
          if (meRes.data.success && meRes.data.user) {
            userData = {
              ...userData,
              ...meRes.data.user,
              token: data.token,
              otpRequired: false,
              adminOtpVerified: true,
              challengeId: null,
            };
          }
        } catch (meError) {
          console.warn('Could not refresh profile after OTP verify:', meError);
        }

        setUser(userData);
        persistVerifiedSession(userData);
        return { success: true };
      }

      return { success: false, message: data.message || 'Invalid verification code' };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Invalid verification code',
      };
    }
  };

  const resendAdminOtp = async () => {
    const stored = user || readPendingOtpSession();
    if (!stored?.token) {
      return { success: false, message: 'No admin verification is pending. Sign in again.' };
    }

    try {
      const response = await api.post('/admin/auth/otp/request', {});
      const payload = parseOtpRequestPayload(response.data);

      if (payload?.challengeId) {
        const updated = {
          ...stored,
          challengeId: String(payload.challengeId),
          otpRequired: true,
          adminOtpVerified: false,
        };
        setUser(updated);
        persistPendingOtpSession(updated);
        return { success: true };
      }

      return { success: false, message: response.data?.message || 'Could not resend the code.' };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Could not resend the verification code.',
      };
    }
  };

  const register = async (name, email, password, confirmPassword) => {
    try {
      const response = await api.post('/auth/signup', {
        name,
        email,
        password,
        confirmPassword,
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
    if (!user) return false;
    if (isSuperAdmin(user.role) && !user.adminOtpVerified) return false;

    try {
      const response = await api.post('/subscription/activate', { plan });
      if (response.data.success) {
        const updatedUser = { ...user, isSubscribed: true };
        setUser(updatedUser);
        persistVerifiedSession(updatedUser);
        return true;
      }
    } catch (error) {
      console.error('Failed to activate subscription on server:', error);
    }
    const updatedUser = { ...user, isSubscribed: true };
    setUser(updatedUser);
    persistVerifiedSession(updatedUser);
    return true;
  };

  const refreshUser = async () => {
    if (isPendingAdminSession(user)) return null;

    try {
      const response = await api.get('/auth/me');
      if (response.data.success) {
        const savedUser = localStorage.getItem(USER_STORAGE_KEY);
        const userData = savedUser ? JSON.parse(savedUser) : {};
        const updatedUser = {
          ...userData,
          ...response.data.user,
          otpRequired: false,
          adminOtpVerified: true,
        };
        setUser(updatedUser);
        persistVerifiedSession(updatedUser);
        return updatedUser;
      }
    } catch (error) {
      console.error('Failed to refresh user details:', error);
    }
    return null;
  };

  const logout = () => {
    setUser(null);
    clearAllSessions();
  };

  const needsAdminOtp = hasPendingAdminOtp(user);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        subscribe,
        refreshUser,
        loading,
        needsAdminOtp,
        verifyAdminOtp,
        resendAdminOtp,
        cancelAdminOtp,
        restorePendingOtp,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
