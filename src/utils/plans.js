import api from "../api/axios";

/** SaaS plan ids sold via Stripe checkout (excludes Expert add-ons). */
export const SAAS_PLAN_IDS = [
  "starter",
  "growth",
  "pro_elite",
  "coach_starter",
  "coach_growth",
  "coach_pro_elite",
  "bundle_growth",
  "bundle_elite",
];

export const PLAN_LABELS = {
  starter: "LaunchVault Starter",
  growth: "LaunchVault Growth",
  pro_elite: "LaunchVault Pro Elite",
  coach_starter: "Coach Starter",
  coach_growth: "Coach Growth",
  coach_pro_elite: "Coach Pro Elite",
  bundle_growth: "Growth Bundle",
  bundle_elite: "Elite Bundle",
  none: "Free",
  free: "Free",
};

export function formatPlanLabel(plan) {
  if (!plan) return PLAN_LABELS.none;
  const key = String(plan).toLowerCase();
  return PLAN_LABELS[key] || plan;
}

export const TRIAL_PERIOD_DAYS = 15;

/** Fallback display metadata when GET /subscription/plans is unavailable. */
export const SAAS_PRICING_TIERS = [
  {
    id: "starter",
    family: "launchvault",
    familyLabel: "LaunchVault",
    name: "Starter",
    price: "$39",
    priceAmount: 39,
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
    family: "launchvault",
    familyLabel: "LaunchVault",
    name: "Growth",
    price: "$149",
    priceAmount: 149,
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
    family: "launchvault",
    familyLabel: "LaunchVault",
    name: "Pro Elite",
    price: "$299",
    priceAmount: 299,
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
  {
    id: "coach_starter",
    family: "coach",
    familyLabel: "Coach & Validation",
    name: "Starter",
    price: "$49",
    priceAmount: 49,
    period: "month",
    isPopular: false,
    isFeatured: false,
    trialEligible: false,
    paidCta: "Buy Coach Starter",
    features: [
      "Business Coach only",
      "No campaigns or visit allowances",
      "Case-based coaching & service plans",
    ],
  },
  {
    id: "coach_growth",
    family: "coach",
    familyLabel: "Coach & Validation",
    name: "Growth",
    price: "$129",
    priceAmount: 129,
    period: "month",
    isPopular: true,
    isFeatured: true,
    trialEligible: false,
    paidCta: "Buy Coach Growth",
    features: [
      "Business Coach only",
      "No campaigns or visit allowances",
      "Expanded coaching capacity",
    ],
  },
  {
    id: "coach_pro_elite",
    family: "coach",
    familyLabel: "Coach & Validation",
    name: "Pro Elite",
    price: "$249",
    priceAmount: 249,
    period: "month",
    isPopular: false,
    isFeatured: false,
    trialEligible: false,
    paidCta: "Buy Coach Pro Elite",
    features: [
      "Business Coach only",
      "No campaigns or visit allowances",
      "Highest Coach tier",
    ],
  },
  {
    id: "bundle_growth",
    family: "bundle",
    familyLabel: "Bundles",
    name: "Growth Bundle",
    price: "$222",
    priceAmount: 222,
    period: "month",
    isPopular: true,
    isFeatured: true,
    trialEligible: false,
    paidCta: "Buy Growth Bundle",
    features: [
      "LaunchVault Growth limits",
      "Business Coach included",
      "5 campaigns · 10,000 visits / month",
    ],
  },
  {
    id: "bundle_elite",
    family: "bundle",
    familyLabel: "Bundles",
    name: "Elite Bundle",
    price: "$439",
    priceAmount: 439,
    period: "month",
    isPopular: false,
    isFeatured: false,
    trialEligible: false,
    paidCta: "Buy Elite Bundle",
    features: [
      "LaunchVault Pro Elite limits",
      "Business Coach included",
      "Unlimited campaigns · 50,000 visits / month",
    ],
  },
];

export const PRICING_FAMILIES = [
  {
    id: "launchvault",
    label: "LaunchVault",
    description: "Campaigns, landing pages, visits & Business Coach",
  },
  {
    id: "coach",
    label: "Coach & Validation",
    description: "Business Coach only — no campaigns or visits",
  },
  {
    id: "bundle",
    label: "Bundles",
    description: "LaunchVault limits plus Business Coach",
  },
];

function formatMoneyPrice(amount, currency = "usd") {
  if (typeof amount !== "number" || Number.isNaN(amount)) return null;
  const dollars = amount > 1000 ? amount / 100 : amount;
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: String(currency || "usd").toUpperCase(),
      maximumFractionDigits: dollars % 1 === 0 ? 0 : 2,
    }).format(dollars);
  } catch {
    return `$${dollars % 1 === 0 ? dollars : dollars.toFixed(2)}`;
  }
}

function normalizeApiPlan(raw) {
  if (!raw || typeof raw !== "object") return null;
  const id = String(raw.id || raw.plan || raw.planId || "").toLowerCase();
  if (!id || id === "bronze" || id === "silver" || id === "gold") return null;

  const amount =
    typeof raw.priceAmount === "number"
      ? raw.priceAmount
      : typeof raw.amount === "number"
        ? raw.amount
        : typeof raw.price === "number"
          ? raw.price
          : typeof raw.unitAmount === "number"
            ? raw.unitAmount / 100
            : null;

  const priceLabel =
    (typeof raw.priceLabel === "string" && raw.priceLabel) ||
    (typeof raw.displayPrice === "string" && raw.displayPrice) ||
    (typeof raw.price === "string" && raw.price.startsWith("$") ? raw.price : null) ||
    formatMoneyPrice(amount, raw.currency);

  return {
    id,
    name: raw.name || raw.label || null,
    price: priceLabel,
    priceAmount: amount,
    period: raw.period || raw.interval || "month",
    family: raw.family || null,
    features: Array.isArray(raw.features) ? raw.features : null,
    trialEligible: raw.trialEligible,
  };
}

function extractPlansList(payload) {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.plans)) return payload.plans;
  if (Array.isArray(payload.items)) return payload.items;
  const nested = [];
  for (const key of ["launchVault", "launchvault", "coach", "bundles", "bundle"]) {
    if (Array.isArray(payload[key])) nested.push(...payload[key]);
  }
  return nested;
}

/**
 * GET /subscription/plans (public) — merge live amounts onto local display metadata.
 * Never hardcode checkout prices when the API responds.
 */
export async function fetchSubscriptionPlans() {
  const res = await api.get("/subscription/plans");
  const root = res.data?.data ?? res.data;
  const apiPlans = extractPlansList(root)
    .map(normalizeApiPlan)
    .filter(Boolean);
  const byId = Object.fromEntries(apiPlans.map((p) => [p.id, p]));

  const addOns = Array.isArray(root?.addOns)
    ? root.addOns
    : Array.isArray(res.data?.addOns)
      ? res.data.addOns
      : [];

  const tiers = SAAS_PRICING_TIERS.map((fallback) => {
    const api = byId[fallback.id];
    if (!api) return { ...fallback };
    return {
      ...fallback,
      name: api.name || fallback.name,
      price: api.price || fallback.price,
      priceAmount:
        typeof api.priceAmount === "number" ? api.priceAmount : fallback.priceAmount,
      period: api.period || fallback.period,
      features: api.features?.length ? api.features : fallback.features,
      trialEligible:
        typeof api.trialEligible === "boolean"
          ? api.trialEligible
          : fallback.trialEligible,
    };
  });

  // Include any unexpected checkoutable plans from API (still skip Expert add-ons).
  for (const api of apiPlans) {
    if (tiers.some((t) => t.id === api.id)) continue;
    if (!SAAS_PLAN_IDS.includes(api.id)) continue;
    tiers.push({
      id: api.id,
      family: api.family || "launchvault",
      familyLabel: api.family || "Plans",
      name: api.name || formatPlanLabel(api.id),
      price: api.price || "—",
      priceAmount: api.priceAmount,
      period: api.period || "month",
      isPopular: false,
      isFeatured: false,
      trialEligible: !!api.trialEligible,
      paidCta: `Buy ${api.name || formatPlanLabel(api.id)}`,
      features: api.features || [],
    });
  }

  return { tiers, addOns, fromApi: apiPlans.length > 0 };
}

export function getTiersByFamily(tiers = SAAS_PRICING_TIERS) {
  return PRICING_FAMILIES.map((family) => ({
    ...family,
    tiers: tiers.filter((t) => t.family === family.id),
  })).filter((group) => group.tiers.length > 0);
}

/** CTA label for a pricing tier given entitlements (hides trial when trialUsed). */
export function getPlanCheckoutCta(tier, entitlements) {
  if (!tier) return "Get Started";
  if (tier.id === "starter" && tier.trialEligible && !entitlements?.trialUsed) {
    return tier.trialCta || "Start 15-day free trial";
  }
  return tier.paidCta || "Get Started";
}

/** Whether LaunchVault Starter checkout should request a trial. */
export function shouldRequestStarterTrial(entitlements) {
  return !entitlements?.trialUsed;
}

export function isUnlimitedCampaigns(entitlements) {
  if (!entitlements) return false;
  const plan = String(entitlements.plan || "").toLowerCase();
  if (plan === "pro_elite" || plan === "bundle_elite") return true;
  const max = entitlements.maxCampaigns ?? entitlements.limits?.maxCampaigns;
  if (max == null || max === -1) return true;
  if (typeof max === "string" && /unlimited/i.test(max)) return true;
  return false;
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

/** Complimentary grant object from auth/me or entitlements. */
export function getComplimentaryAccess(source) {
  if (!source) return null;
  return (
    source.complimentaryAccess ||
    source.subscription?.complimentaryAccess ||
    null
  );
}

export function isComplimentaryActive(source) {
  const c = getComplimentaryAccess(source);
  return c?.status === "active";
}

export function isComplimentaryScheduled(source) {
  const c = getComplimentaryAccess(source);
  return c?.status === "scheduled";
}
