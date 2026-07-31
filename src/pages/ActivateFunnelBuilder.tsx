import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from '../api/axios';

const funnelImage = "/pricing/funnel.png"; // replace with your actual image path

const plans = [
  { id: "bronze", name: "Basic Plan", price: "$1500", period: "One-Time" },
  { id: "silver", name: "Premium Plan", price: "$499.99", period: "Month" },
  {
    id: "gold",
    name: "Enterprise Plan",
    price: "$999.99",
    period: "Month",
  },
];

export default function ActivateFunnelBuilder() {
  const [selected, setSelected] = useState("premium");
  const navigate = useNavigate();

  const handleActivate = async () => {
    try {
      const response = await api.post(
        "/subscription/create-checkout-session",
        {
          plan: selected,
        }
      );

      if (response.data.success) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      console.error("Subscription Error:", error);
      // Optional fallback
      navigate("/dashboard/campaign/select-type");
    }
  };

  return (
    <section className="w-full bg-white px-6 md:px-12 lg:px-20 py-12 md:py-16">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10 md:gap-6">
        {/* LEFT — 2/3 */}
        <div className="w-full md:w-2/3 flex flex-col gap-6">
          {/* Tag */}
          <div>
            <span className="inline-block border border-gray-300 text-gray-500 text-xs font-medium px-3 py-1 rounded-full">
              Activation
            </span>
          </div>

          {/* Heading & Subtext */}
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
              Activate Funnel Builder
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed max-w-sm">
              Choose a plan to unlock campaigns, enquiries, and real market
              testing for your business.
            </p>
          </div>

          {/* Plan Options */}
          <div className="flex flex-col gap-3">
            {plans.map((plan) => {
              const isSelected = selected === plan.id;
              return (
                <button
                  key={plan.id}
                  onClick={() => setSelected(plan.id)}
                  className={`
                    w-full flex items-center justify-between px-5 py-4 rounded-xl border-2
                    transition-all duration-200 cursor-pointer text-left
                    ${
                      isSelected
                        ? "border-[#c9a030] bg-white shadow-sm"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }
                  `}
                >
                  {/* Radio + Name */}
                  <div className="flex items-center gap-3">
                    {/* Custom radio */}
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors duration-200 ${
                        isSelected ? "border-[#c9a030]" : "border-gray-300"
                      }`}
                    >
                      {isSelected && (
                        <div className="w-2.5 h-2.5 rounded-full bg-[#c9a030]" />
                      )}
                    </div>
                    <span
                      className={`text-sm font-semibold ${
                        isSelected ? "text-gray-900" : "text-gray-600"
                      }`}
                    >
                      {plan.name}
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-1">
                    <span
                      className={`font-bold text-base ${
                        isSelected ? "text-gray-900" : "text-gray-600"
                      }`}
                    >
                      {plan.price}
                    </span>
                    <span className="text-xs text-gray-400">
                      /{plan.period}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* CTA Button */}
          <div>
            <button
              onClick={handleActivate}
              className="bg-[#c9a030] hover:bg-[#b08820] text-white text-sm font-semibold px-7 py-3 rounded-full transition-colors duration-200 cursor-pointer"
            >
              Activate Your Plan
            </button>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center gap-5 mt-1">
            {["Transparent pricing", "No hidden charges", "Cancel anytime"].map(
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

        {/* RIGHT — 1/3 */}
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
