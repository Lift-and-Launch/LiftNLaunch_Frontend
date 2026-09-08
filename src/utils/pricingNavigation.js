const PRICING_RETURN_KEY = "pricingReturnTo";

export function getPricingReturnPath() {
  const stored = sessionStorage.getItem(PRICING_RETURN_KEY);
  if (stored && !stored.includes("/pricing")) return stored;
  return null;
}

export function clearPricingReturnPath() {
  sessionStorage.removeItem(PRICING_RETURN_KEY);
}

/** Remember current page, then open pricing (survives Stripe full-page redirects). */
export function goToPricing(navigate, location) {
  const returnTo = `${location.pathname}${location.search || ""}`;
  if (returnTo && !returnTo.includes("/pricing")) {
    sessionStorage.setItem(PRICING_RETURN_KEY, returnTo);
  }
  navigate("/pricing", { state: { from: location } });
}

export { PRICING_RETURN_KEY };
