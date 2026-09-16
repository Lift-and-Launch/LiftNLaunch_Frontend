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

export const SAAS_PRICING_TIERS = [
  {
    id: "starter",
    name: "Starter",
    price: "$28.88",
    period: "month",
    isPopular: false,
    isFeatured: false,
    features: [
      "1 campaign (funnel)",
      "Up to 1,000 visits / month",
      "CSV export",
      "Business Coach included",
      "Platform fee 1.5% on Connect payments",
    ],
  },
  {
    id: "growth",
    name: "Growth",
    price: "$111",
    period: "month",
    isPopular: true,
    isFeatured: true,
    features: [
      "Up to 5 campaigns",
      "Up to 10,000 visits / month",
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
    features: [
      "Unlimited campaigns",
      "Up to 50,000 visits / month",
      "Everything in Growth",
      "Integrations, white-label, team access",
      "Business Coach included",
    ],
  },
];

export function isUnlimitedCampaigns(entitlements) {
  if (!entitlements) return false;
  return (
    entitlements.maxCampaigns == null || entitlements.usage?.campaignsRemaining == null
  );
}

export function canCreateCampaign(entitlements) {
  if (!entitlements?.isSubscribed) return false;
  if (isUnlimitedCampaigns(entitlements)) return true;
  const remaining = entitlements.usage?.campaignsRemaining;
  if (typeof remaining === "number") return remaining > 0;
  const max = entitlements.maxCampaigns;
  const used = entitlements.usage?.campaignsUsed ?? 0;
  return typeof max === "number" ? used < max : false;
}

export function canUseAbTesting(entitlements) {
  return !!entitlements?.features?.abTesting;
}

export function canUseBusinessCoach(entitlements) {
  return !!entitlements?.isSubscribed && !!entitlements?.features?.businessCoach;
}
