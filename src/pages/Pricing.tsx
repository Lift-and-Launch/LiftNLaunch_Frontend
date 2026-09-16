import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";
import Seo from "../seo/Seo";
import { pageSeo } from "../seo/seoConfig";
import { useAuth } from "../context/AuthContext";
import { SAAS_PRICING_TIERS } from "../utils/plans";
import {
  PRICING_RETURN_KEY,
  getPricingReturnPath,
  clearPricingReturnPath,
} from "../utils/pricingNavigation";

function pathFromLocationLike(from?: { pathname?: string; search?: string } | null) {
  if (!from?.pathname || from.pathname.includes("/pricing")) return null;
  return `${from.pathname}${from.search || ""}`;
}

const checkIcon = (
  <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
      clipRule="evenodd"
    />
  </svg>
);

export default function Pricing() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    const fromState = pathFromLocationLike(
      (location.state as { from?: { pathname?: string; search?: string } } | null)?.from
    );
    if (fromState) {
      sessionStorage.setItem(PRICING_RETURN_KEY, fromState);
    }
  }, [location.state]);

  const handleBack = () => {
    const fromState = pathFromLocationLike(
      (location.state as { from?: { pathname?: string; search?: string } } | null)?.from
    );
    const target = fromState || getPricingReturnPath() || "/dashboard";
    clearPricingReturnPath();
    navigate(target, { replace: true });
  };

  const handleGetStarted = async (planId: string) => {
    if (!user) {
      toast.error("Please sign in to continue with checkout.");
      navigate("/signin", { state: { from: location } });
      return;
    }

    setLoadingPlan(planId);
    try {
      const response = await api.post("/subscription/create-checkout-session", {
        plan: planId,
      });

      if (response.data.success && response.data.url) {
        window.location.href = response.data.url;
        return;
      }
      toast.error(response.data?.message || "Could not start checkout.");
    } catch (error: unknown) {
      console.error("Subscription Error:", error);
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || "Checkout failed. Please try again.");
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="w-full bg-white">
      <Seo
        title={pageSeo.pricing.title}
        description={pageSeo.pricing.description}
        path={pageSeo.pricing.path}
      />
      <section className="w-full px-4 pt-4 pb-12 md:pt-5 md:pb-16 border-b-2 border-amber-200">
        <div className="max-w-6xl mx-auto">
          <button
            type="button"
            onClick={handleBack}
            className="text-sm font-semibold text-gray-600 hover:text-gray-900 mb-3"
          >
            ← Back
          </button>

          <div className="text-center mb-6 md:mb-8">
            <p className="text-xs font-semibold text-yellow-600 uppercase tracking-wide mb-1">
              LaunchVault Plans
            </p>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-1.5">
              Choose Your SaaS Plan
            </h1>
            <p className="text-gray-600 text-sm md:text-base max-w-xl mx-auto">
              Campaigns, funnels &amp; Business Coach. 1.5% platform fee on Connect payments.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row items-stretch justify-center gap-5 lg:gap-6 pt-2">
            {SAAS_PRICING_TIERS.map((tier) => {
              const isFeatured = tier.isFeatured;
              const isHovered = hovered === tier.id;
              const busy = loadingPlan === tier.id;

              return (
                <div
                  key={tier.id}
                  onMouseEnter={() => setHovered(tier.id)}
                  onMouseLeave={() => setHovered(null)}
                  className={[
                    "relative flex flex-col rounded-2xl border bg-white w-full lg:max-w-[340px]",
                    "transition-all duration-300 ease-in-out",
                    isFeatured
                      ? "border-yellow-400 shadow-xl ring-2 ring-yellow-400/40 lg:-mt-1 z-10"
                      : "border-gray-200 shadow-md",
                    isHovered && !isFeatured ? "-translate-y-1 shadow-lg" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {tier.isPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-30">
                      <span className="bg-yellow-400 text-black text-[11px] font-semibold px-4 py-1.5 rounded-full shadow-md whitespace-nowrap">
                        Most popular
                      </span>
                    </div>
                  )}

                  <div
                    className={`w-full rounded-t-2xl px-5 py-5 ${
                      isFeatured
                        ? "bg-yellow-400 text-black"
                        : "bg-yellow-50 text-gray-900"
                    }`}
                  >
                    <h2 className="font-bold text-xl">{tier.name}</h2>
                    <div className="mt-2 flex items-baseline gap-1 flex-wrap">
                      <span className="font-extrabold text-3xl">{tier.price}</span>
                      <span
                        className={`text-sm font-medium ${
                          isFeatured ? "text-black/70" : "text-gray-600"
                        }`}
                      >
                        / {tier.period}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col flex-1 px-5 pt-4 pb-5 gap-3">
                    <ul className="flex flex-col gap-2.5 flex-1">
                      {tier.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2">
                          <span className="text-yellow-500 mt-0.5">{checkIcon}</span>
                          <span className="text-sm text-gray-700 leading-snug">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <button
                      type="button"
                      disabled={!!loadingPlan}
                      onClick={() => handleGetStarted(tier.id)}
                      className={`mt-3 w-full py-2.5 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-wait ${
                        isFeatured
                          ? "bg-gray-900 hover:bg-black text-white"
                          : "bg-yellow-400 hover:bg-yellow-500 text-black"
                      }`}
                    >
                      {busy ? "Redirecting…" : "Get Started"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
