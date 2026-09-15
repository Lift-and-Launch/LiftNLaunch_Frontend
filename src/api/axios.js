import axios from 'axios';
import { USER_STORAGE_KEY } from '../utils/roles';
import { SUBSCRIPTION_REQUIRED_CODE } from '../utils/subscription';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

function readStoredSession() {
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;
    return parsed;
  } catch {
    localStorage.removeItem(USER_STORAGE_KEY);
    return null;
  }
}

// Attach auth token — never trust client-edited subscription flags for auth.
api.interceptors.request.use(
  (config) => {
    const user = readStoredSession();
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
    const code = error.response?.data?.code;
    const message = String(error.response?.data?.message || '').toLowerCase();
    const path = window.location.pathname || '';

    if (status === 401) {
      localStorage.removeItem(USER_STORAGE_KEY);
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
