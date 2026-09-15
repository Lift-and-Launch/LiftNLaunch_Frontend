import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

import api from '../api/axios';
import {
  isAdminRole,
  USER_STORAGE_KEY,
  readPendingOtpSession,
  isPendingAdminSession,
} from '../utils/roles';

const AuthContext = createContext();

const persistSession = (userData) => {
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
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
      const savedUser = localStorage.getItem(USER_STORAGE_KEY);
      if (!savedUser) {
        setLoading(false);
        return;
      }

      try {
        const userData = JSON.parse(savedUser);

        if (userData.otpRequired || (isAdminRole(userData.role) && !userData.adminOtpVerified)) {
          const pending = { ...userData, otpRequired: true, adminOtpVerified: false };
          setUser(pending);
          persistSession(pending);
          setLoading(false);
          return;
        }

        const response = await api.get('/auth/me');
        if (response.data.success) {
          const apiUser = response.data.user || {};
          const subscribed =
            apiUser.isSubscribed ?? apiUser.subscription?.isSubscribed ?? false;
          const merged = {
            ...userData,
            ...apiUser,
            isSubscribed: Boolean(subscribed),
            subscription: apiUser.subscription || null,
            token: userData.token,
          };
          if (isAdminRole(merged.role) && !userData.adminOtpVerified) {
            setUser({ ...merged, otpRequired: true, adminOtpVerified: false });
          } else {
            setUser({
              ...merged,
              otpRequired: false,
              adminOtpVerified: userData.adminOtpVerified || !isAdminRole(merged.role),
            });
          }
        } else {
          localStorage.removeItem(USER_STORAGE_KEY);
        }
      } catch (error) {
        if (error.response?.data?.otpRequired) {
          const userData = JSON.parse(savedUser);
          setUser({ ...userData, otpRequired: true });
        } else {
          console.error('Auth verification failed:', error);
          localStorage.removeItem(USER_STORAGE_KEY);
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

      if (data.otpRequired || isAdminRole(role)) {
        const userData = buildSession(data, {
          otpRequired: true,
          adminOtpVerified: false,
          challengeId: data.challengeId ? String(data.challengeId) : null,
        });
        if (import.meta.env.DEV && data.devOtp) {
          console.info('[admin otp][dev only]', data.devOtp);
        }
        setUser(userData);
        persistSession(userData);

        if (!userData.challengeId && userData.token) {
          try {
            const otpRes = await api.post('/admin/auth/otp/request', {});
            if (otpRes.data?.challengeId) {
              userData.challengeId = otpRes.data.challengeId;
              if (import.meta.env.DEV && otpRes.data.devOtp) {
                console.info('[admin otp][dev only]', otpRes.data.devOtp);
              }
              setUser({ ...userData });
              persistSession(userData);
            }
          } catch (otpError) {
            console.error('Admin OTP request failed:', otpError);
          }
        }

        return { success: true, otpRequired: true };
      }

      if (data.success) {
        const userData = buildSession(data, {
          otpRequired: false,
          adminOtpVerified: false,
          challengeId: null,
        });
        setUser(userData);
        persistSession(userData);
        return { success: true };
      }

      return { success: false, message: data.message };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  };

  const verifyAdminOtp = async (code) => {
    const stored = user || JSON.parse(localStorage.getItem(USER_STORAGE_KEY) || 'null');
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

      if (data.token) {
        const userData = {
          ...stored,
          ...(data.user || {}),
          token: data.token,
          otpRequired: false,
          adminOtpVerified: true,
          challengeId: null,
          isSubscribed: data.user?.isSubscribed ?? stored.isSubscribed,
        };
        setUser(userData);
        persistSession(userData);
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
    const stored = user || JSON.parse(localStorage.getItem(USER_STORAGE_KEY) || 'null');
    if (!stored?.token) {
      return { success: false, message: 'No admin verification is pending. Sign in again.' };
    }

    try {
      const response = await api.post('/admin/auth/otp/request', {});
      const data = response.data;

      if (data.challengeId) {
        const updated = {
          ...stored,
          challengeId: data.challengeId,
          otpRequired: true,
        };
        if (import.meta.env.DEV && data.devOtp) {
          console.info('[admin otp][dev only]', data.devOtp);
        }
        setUser(updated);
        persistSession(updated);
        return { success: true };
      }

      return { success: false, message: data.message || 'Could not resend the code.' };
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
    try {
      const response = await api.post('/subscription/activate', { plan });
      if (response.data.success) {
        const apiUser = response.data.user || {};
        const updatedUser = {
          ...user,
          ...apiUser,
          isSubscribed: true,
          adminApprovalStatus:
            apiUser.adminApprovalStatus || user.adminApprovalStatus || 'pending',
          subscription: {
            ...(user.subscription || {}),
            isSubscribed: true,
            plan: plan || user.subscription?.plan || 'silver',
            subscriptionStatus: 'active',
          },
        };
        setUser(updatedUser);
        persistSession(updatedUser);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to activate subscription on server:', error);
      // Never spoof premium access locally if the API rejects activation.
      return false;
    }
  };

  const refreshUser = async () => {
    try {
      const response = await api.get('/auth/me');
      if (response.data.success) {
        const savedUser = localStorage.getItem(USER_STORAGE_KEY);
        const userData = savedUser ? JSON.parse(savedUser) : {};
        const apiUser = response.data.user || {};
        const subscribed =
          apiUser.isSubscribed ?? apiUser.subscription?.isSubscribed ?? false;
        const updatedUser = {
          ...userData,
          ...apiUser,
          // Server is source of truth for entitlement — ignore local spoofing.
          isSubscribed: Boolean(subscribed),
          subscription: apiUser.subscription || userData.subscription || null,
          token: userData.token,
          otpRequired: user?.otpRequired || false,
          adminOtpVerified: user?.adminOtpVerified || false,
        };
        setUser(updatedUser);
        persistSession(updatedUser);
        return updatedUser;
      }
    } catch (error) {
      console.error('Failed to refresh user details:', error);
    }
    return null;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(USER_STORAGE_KEY);
  };

  const needsAdminOtp = Boolean(
    isAdminRole(user?.role) && !user?.adminOtpVerified,
  );

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
        restorePendingOtp,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
