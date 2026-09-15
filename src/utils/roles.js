export const isSuperAdmin = (role) => role === 'superadmin';

/** @deprecated Prefer isSuperAdmin — backend has no separate `admin` role. */
export const isAdminRole = isSuperAdmin;

export const isCoachRole = (role) => role === 'coach' || role === 'superadmin';

export const canApproveCoachPlan = (role) => isCoachRole(role);

/** Soft-delete case: founders (non-coach) and superadmin; staff coach role gets 403. */
export function canDeleteCoachCase(user) {
  if (!user?.role) return false;
  if (isSuperAdmin(user.role)) return true;
  if (user.role === 'coach') return false;
  return true;
}

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
