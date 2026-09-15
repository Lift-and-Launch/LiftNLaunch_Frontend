import { isCoachRole, isSuperAdmin } from './roles';

/**
 * True when the user has an active paid subscription flag from the server.
 */
export function hasActiveSubscription(user) {
  if (!user) return false;
  return user.isSubscribed === true || user.subscription?.isSubscribed === true;
}

/** Staff who operate coach tools without a founder subscription. */
export function isPremiumStaff(user) {
  const role = user?.role;
  return isCoachRole(role) || isSuperAdmin(role);
}

/**
 * Premium product features (Business Coach, builders, AI):
 * - coaches / superadmins: always
 * - founders: active subscription + admin approval
 */
export function canAccessPremiumFeatures(user) {
  if (!user) return false;
  if (isPremiumStaff(user)) return true;
  if (!hasActiveSubscription(user)) return false;
  return user.adminApprovalStatus === 'approved';
}

/** Where to send a user who cannot use a premium route. */
export function premiumAccessRedirect(user) {
  if (!user) return '/signin';
  if (isPremiumStaff(user)) return null;
  if (!hasActiveSubscription(user)) return '/pricing';
  if (user.adminApprovalStatus !== 'approved') return '/dashboard';
  return null;
}

export const SUBSCRIPTION_REQUIRED_CODE = 'SUBSCRIPTION_REQUIRED';
