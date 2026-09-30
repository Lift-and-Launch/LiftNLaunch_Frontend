import { isCoachRole, isSuperAdmin } from './roles';
import {
  getComplimentaryAccess,
  isComplimentaryActive,
} from './plans';

/** True when subscription is in Stripe trial (from /auth/me or entitlements merge). */
export function isUserTrialing(user) {
  if (!user) return false;
  return !!(
    user.isTrialing ||
    user.subscriptionStatus === 'trialing' ||
    user.subscription?.status === 'trialing' ||
    user.subscription?.subscriptionStatus === 'trialing'
  );
}

/**
 * True when the user has an active paid subscription, complimentary Pro Elite, or trial.
 * Paid plan wins while active; complimentary does not stack on top of it in the UI.
 */
export function hasActiveSubscription(user) {
  if (!user) return false;
  if (isUserTrialing(user)) return true;
  if (isComplimentaryActive(user)) return true;
  return user.isSubscribed === true || user.subscription?.isSubscribed === true;
}

/** Expose complimentary grant for Profile / banners. */
export function getUserComplimentaryAccess(user) {
  return getComplimentaryAccess(user);
}

/** Staff who operate coach tools without a founder subscription. */
export function isPremiumStaff(user) {
  const role = user?.role;
  return isCoachRole(role) || isSuperAdmin(role);
}

/**
 * Premium product features (Business Coach, builders, AI):
 * - coaches / superadmins: always
 * - founders on trial: always (auto-approved during trial)
 * - founders on complimentary Pro Elite: always (admin-granted)
 * - founders: active subscription + admin approval
 */
export function canAccessPremiumFeatures(user) {
  if (!user) return false;
  if (isPremiumStaff(user)) return true;
  if (!hasActiveSubscription(user)) return false;
  if (isUserTrialing(user)) return true;
  if (isComplimentaryActive(user)) return true;
  return user.adminApprovalStatus === 'approved';
}

/** Where to send a user who cannot use a premium route. */
export function premiumAccessRedirect(user) {
  if (!user) return '/signin';
  if (isPremiumStaff(user)) return null;
  if (!hasActiveSubscription(user)) return '/pricing';
  if (isUserTrialing(user) || isComplimentaryActive(user)) return null;
  if (user.adminApprovalStatus !== 'approved') return '/dashboard';
  return null;
}

export const SUBSCRIPTION_REQUIRED_CODE = 'SUBSCRIPTION_REQUIRED';
