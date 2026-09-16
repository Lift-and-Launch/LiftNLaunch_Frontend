import { useNavigate, useLocation } from "react-router-dom";
import { goToPricing } from "../utils/pricingNavigation";

const funnelImage = "/pricing/funnel.png";

/**
 * Activation entry point — self-serve checkout lives on /pricing
 * (Starter / Growth / Pro Elite via Stripe Checkout).
 */
export default function ActivateFunnelBuilder() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <section className="w-full bg-white px-6 md:px-12 lg:px-20 py-12 md:py-16 border-b-2 border-amber-200">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10 md:gap-6">
        <div className="w-full md:w-2/3 flex flex-col gap-6">
          <div>
            <span className="inline-block border border-gray-300 text-gray-500 text-xs font-medium px-3 py-1 rounded-full">
              Activation
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
              Activate Funnel Builder
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed max-w-md">
              Choose Starter, Growth, or Pro Elite to unlock campaigns, visits,
              A/B testing (Growth+), and Business Coach — billed monthly via Stripe.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => goToPricing(navigate, location)}
              className="bg-yellow-400 hover:bg-yellow-500 text-black text-sm font-semibold px-7 py-3 rounded-full transition-colors duration-200 cursor-pointer"
            >
              View Plans &amp; Checkout
            </button>
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="border border-gray-300 hover:border-gray-900 text-gray-900 text-sm font-medium px-7 py-3 rounded-full transition-colors duration-200 cursor-pointer"
            >
              Back to Dashboard
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-5 mt-1">
            {["Transparent pricing", "1.5% Connect fee", "Cancel anytime"].map(
              (item) => (
                <div
                  key={item}
                  className="flex items-center gap-1.5 text-gray-500 text-xs"
                >
                  <svg
                    className="w-3.5 h-3.5 text-gray-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {item}
                </div>
              ),
            )}
          </div>
        </div>

        <div className="w-full md:w-1/3 flex items-center justify-center">
          <img
            src={funnelImage}
            alt="Funnel Builder Illustration"
            className="w-full max-w-xs md:max-w-full h-auto object-contain"
          />
        </div>
      </div>
    </section>
  );
}
