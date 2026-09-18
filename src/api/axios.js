import axios from 'axios';
import {
  USER_STORAGE_KEY,
  ADMIN_OTP_SESSION_KEY,
  readPendingOtpSession,
  isSuperAdmin,
} from '../utils/roles';
import { SUBSCRIPTION_REQUIRED_CODE } from '../utils/subscription';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://liftnlaunch-backend.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

const readStoredUser = () => {
  const pending = readPendingOtpSession();
  if (pending?.token) {
    return pending;
  }

  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    if (raw) {
      const user = JSON.parse(raw);
      if (user?.token) {
        if (isSuperAdmin(user.role) && !user.adminOtpVerified) {
          return null;
        }
        return user;
      }
    }
  } catch {
    localStorage.removeItem(USER_STORAGE_KEY);
  }

  return null;
};

// Attach auth token — never trust client-edited subscription flags for auth.
api.interceptors.request.use(
  (config) => {
    const user = readStoredUser();
    if (user?.token && typeof user.token === 'string') {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const data = error.response?.data;
    const code = data?.code;
    const message = String(data?.message || '').toLowerCase();
    const path = window.location.pathname || '';
    const url = error.config?.url || '';
    const onOtpPage = path.startsWith('/admin/verify-otp');
    const hasPendingOtp = Boolean(readPendingOtpSession());
    const skipAuthRedirect =
      url.includes('/auth/signin') ||
      url.includes('/auth/signup') ||
      url.includes('/admin/auth/otp') ||
      url.includes('/auth/me');

    if (status === 403 && data?.otpRequired) {
      if (!onOtpPage) {
        window.location.href = '/admin/verify-otp';
      }
      return Promise.reject(error);
    }

    if (status === 401 && !skipAuthRedirect && !onOtpPage && !hasPendingOtp) {
      localStorage.removeItem(USER_STORAGE_KEY);
      sessionStorage.removeItem(ADMIN_OTP_SESSION_KEY);
      if (!path.startsWith('/signin') && !path.startsWith('/signup')) {
        window.location.href = '/signin';
      }
      return Promise.reject(error);
    }

    // Server-enforced premium gate — bounce free users off AI/premium API usage.
    const subscriptionBlocked =
      status === 403 &&
      (code === SUBSCRIPTION_REQUIRED_CODE ||
        message.includes('premium subscription') ||
        message.includes('subscription is required'));

    if (
      subscriptionBlocked &&
      path.startsWith('/dashboard') &&
      !path.startsWith('/pricing')
    ) {
      window.location.href = '/pricing';
    }

    return Promise.reject(error);
  }
);

export default api;
