import { isCoachRole, isSuperAdmin } from './roles';
import {
  getComplimentaryAccess,
  isComplimentaryActive as planComplimentaryActive,
} from './plans';

export function isComplimentaryActive(user) {
  return planComplimentaryActive(user);
}

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
  if (planComplimentaryActive(user)) return true;
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
 * - founders with an active paid, trial, or complimentary plan: always
 */
export function canAccessPremiumFeatures(user) {
  if (!user) return false;
  if (isPremiumStaff(user)) return true;
  if (!hasActiveSubscription(user)) return false;
  return true;
}

/** Where to send a user who cannot use a premium route. */
export function premiumAccessRedirect(user) {
  if (!user) return '/signin';
  if (isPremiumStaff(user)) return null;
  if (!hasActiveSubscription(user)) return '/pricing';
  return null;
}

export const SUBSCRIPTION_REQUIRED_CODE = 'SUBSCRIPTION_REQUIRED';
