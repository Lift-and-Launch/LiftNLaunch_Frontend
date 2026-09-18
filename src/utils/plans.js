/** SaaS plan ids and display helpers (Starter / Growth / Pro Elite). */

export const SAAS_PLAN_IDS = ["starter", "growth", "pro_elite"];

export const PLAN_LABELS = {
  starter: "Starter",
  growth: "Growth",
  pro_elite: "Pro Elite",
  none: "Free",
  free: "Free",
};

export function formatPlanLabel(plan) {
  if (!plan) return PLAN_LABELS.none;
  const key = String(plan).toLowerCase();
  return PLAN_LABELS[key] || plan;
}

export const TRIAL_PERIOD_DAYS = 15;

export const SAAS_PRICING_TIERS = [
  {
    id: "starter",
    name: "Starter",
    price: "$28.88",
    period: "month",
    isPopular: false,
    isFeatured: false,
    trialEligible: true,
    trialCta: "Start 15-day free trial",
    paidCta: "Subscribe to Starter",
    features: [
      "15-day free trial (first time)",
      "1 campaign · 1,000 visits / month",
      "CSV export",
      "Business Coach included",
      "1.5% Connect platform fee",
    ],
  },
  {
    id: "growth",
    name: "Growth",
    price: "$111",
    period: "month",
    isPopular: true,
    isFeatured: true,
    trialEligible: false,
    paidCta: "Buy Growth",
    features: [
      "5 campaigns · 10,000 visits / month",
      "A/B testing",
      "CRM tools + branding options",
      "Priority support",
      "Business Coach included",
    ],
  },
  {
    id: "pro_elite",
    name: "Pro Elite",
    price: "$243",
    period: "month",
    isPopular: false,
    isFeatured: false,
    trialEligible: false,
    paidCta: "Buy Pro Elite",
    features: [
      "Unlimited campaigns · 50,000 visits / month",
      "Everything in Growth",
      "Integrations, white-label, team access",
      "Business Coach included",
    ],
  },
];

/** CTA label for a pricing tier given entitlements (hides trial when trialUsed). */
export function getPlanCheckoutCta(tier, entitlements) {
  if (!tier) return "Get Started";
  if (tier.id === "starter" && tier.trialEligible && !entitlements?.trialUsed) {
    return tier.trialCta || "Start 15-day free trial";
  }
  return tier.paidCta || "Get Started";
}

/** Whether Starter checkout should request a trial (backend also auto-skips if used). */
export function shouldRequestStarterTrial(entitlements) {
  return !entitlements?.trialUsed;
}

export function isUnlimitedCampaigns(entitlements) {
  if (!entitlements) return false;
  // Only Pro Elite-style plans omit a campaign cap
  return entitlements.maxCampaigns == null;
}

export function canCreateCampaign(entitlements) {
  if (!entitlements) return false;
  const hasPlan =
    !!entitlements.isSubscribed ||
    entitlements.isTrialing ||
    entitlements.subscriptionStatus === "trialing";
  if (!hasPlan) return false;
  if (isUnlimitedCampaigns(entitlements)) return true;
  const remaining = entitlements.usage?.campaignsRemaining;
  if (typeof remaining === "number") return remaining > 0;
  const max = entitlements.maxCampaigns;
  const used = entitlements.usage?.campaignsUsed ?? 0;
  return typeof max === "number" ? used < max : true;
}

export function canUseAbTesting(entitlements) {
  return !!entitlements?.features?.abTesting;
}

export function canUseBusinessCoach(entitlements) {
  return !!entitlements?.isSubscribed && !!entitlements?.features?.businessCoach;
}
