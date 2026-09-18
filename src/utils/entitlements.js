import api from "../api/axios";
import toast from "react-hot-toast";
import { goToPricing } from "./pricingNavigation";
import { isUserTrialing } from "./subscription";

/**
 * GET /subscription/entitlements — plan limits + feature flags + usage + trial.
 */
export async function fetchEntitlements() {
  const res = await api.get("/subscription/entitlements");
  if (res.data?.success && res.data.data) {
    return res.data.data;
  }
  throw new Error(res.data?.message || "Failed to load entitlements");
}

export function isTrialing(entitlements) {
  return !!(
    entitlements?.isTrialing ||
    entitlements?.subscriptionStatus === "trialing"
  );
}

/** Trial users are treated as approved for campaign create / builder access. */
export function hasCampaignBuilderAccess(user, entitlements) {
  if (isTrialing(entitlements) || isUserTrialing(user)) return true;
  return user?.adminApprovalStatus === "approved";
}

const CHECKOUT_ERROR_MESSAGES = {
  ALREADY_SUBSCRIBED: "You already have an active subscription.",
  TRIAL_STARTER_ONLY: "The free trial is only available on the Starter plan.",
  TRIAL_ALREADY_USED:
    "You've already used your free trial. Continue with a paid Starter plan.",
};

/**
 * Toast + message for Stripe checkout create errors.
 * Returns true if a known checkout code was handled.
 */
export function handleCheckoutError(error) {
  const data = error?.response?.data;
  const code = data?.code;
  const message =
    CHECKOUT_ERROR_MESSAGES[code] ||
    data?.message ||
    "Checkout failed. Please try again.";
  toast.error(message, { duration: 5000 });
  return !!CHECKOUT_ERROR_MESSAGES[code] || !!data?.message;
}

/**
 * Soft visit ping for live landing pages (public, no auth).
 * Debounce once per campaign per browser session.
 */
export async function trackCampaignVisit(campaignId) {
  if (!campaignId) return;
  const key = `visitTracked:${campaignId}`;
  try {
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
  } catch {
    /* ignore storage errors */
  }

  try {
    await api.post("/analytics/visit", { campaignId });
  } catch (err) {
    // Over-cap or network — never hard-break the live page
    const code = err.response?.data?.code;
    if (code !== "PLAN_LIMIT" && code !== "PLAN_REQUIRED") {
      console.warn("Visit tracking failed:", err.message || err);
    }
  }
}

/**
 * Handle 403 PLAN_REQUIRED / PLAN_LIMIT from gated actions.
 * Returns true if the error was a plan gate (caller can skip generic handling).
 */
export function handlePlanGateError(error, { navigate, location } = {}) {
  const data = error?.response?.data;
  const code = data?.code;
  if (code !== "PLAN_REQUIRED" && code !== "PLAN_LIMIT") return false;

  const message =
    data?.upgradeHint ||
    data?.message ||
    (code === "PLAN_LIMIT"
      ? "You've reached your plan limit. Upgrade to continue."
      : "An active plan is required for this action.");

  toast.error(message, { duration: 5000 });

  if (navigate && location) {
    setTimeout(() => goToPricing(navigate, location), 600);
  } else if (navigate) {
    setTimeout(() => navigate("/pricing"), 600);
  }

  return true;
}
