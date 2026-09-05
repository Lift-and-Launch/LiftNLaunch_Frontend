/** Backend only defines `superadmin` as the admin role (see feat/admin-otp). */
export const isSuperAdmin = (role) => role === 'superadmin';

/** @deprecated Prefer isSuperAdmin — backend has no separate `admin` role. */
export const isAdminRole = isSuperAdmin;

export const USER_STORAGE_KEY = 'neighborhood_user';
export const ADMIN_OTP_SESSION_KEY = 'neighborhood_admin_otp_pending';

export const isPendingAdminSession = (user) =>
  Boolean(user && isSuperAdmin(user.role) && !user.adminOtpVerified);

export const readPendingOtpSession = () => {
  try {
    const raw = sessionStorage.getItem(ADMIN_OTP_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    sessionStorage.removeItem(ADMIN_OTP_SESSION_KEY);
    return null;
  }
};

export const hasPendingAdminOtp = (user) =>
  isPendingAdminSession(user) || isPendingAdminSession(readPendingOtpSession());

/** Parse POST /admin/auth/otp/request response (payload nested under `data`). */
export const parseOtpRequestPayload = (responseData) =>
  responseData?.data ?? responseData ?? null;
