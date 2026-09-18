import api from "../api/axios";
import toast from "react-hot-toast";
import { goToPricing } from "./pricingNavigation";

/**
 * GET /subscription/entitlements — plan limits + feature flags + usage.
 */
export async function fetchEntitlements() {
  const res = await api.get("/subscription/entitlements");
  if (res.data?.success && res.data.data) {
    return res.data.data;
  }
  throw new Error(res.data?.message || "Failed to load entitlements");
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
    // Delay slightly so toast is visible, then offer pricing
    setTimeout(() => goToPricing(navigate, location), 600);
  } else if (navigate) {
    setTimeout(() => navigate("/pricing"), 600);
  }

  return true;
}
