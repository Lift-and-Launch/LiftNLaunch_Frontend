import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from '../api/axios';
import Seo from "../seo/Seo";
import { pageSeo } from "../seo/seoConfig";

const bronzegold = "/pricing/bronze-gold.png";
const silverImg = "/pricing/silver.png";

const checkIcon = (
  <svg
    className="w-4 h-4 flex-shrink-0"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
      clipRule="evenodd"
    />
  </svg>
);

interface Tier {
  id: string;
  name: string;
  price: string;
  period: string;
  features: string[];
  isPopular: boolean;
  isFeatured: boolean;
  cardBg: string;
  headerBg: string;
  btnClass: string;
  checkColor: string;
  imgSrc: string;
  textColor: string;
  headingColor: string;
}

const tiers: Tier[] = [
  {
    id: "bronze",
    name: "Bronze",
    price: "$1500",
    period: "One-Time",
    features: [
      "Up to 5 bookings per month",
      "Basic customer support",
      "Standard cleaning services",
      "Email notifications",
    ],
    isPopular: false,
    isFeatured: false,
    cardBg: "#e8dfcc",
    headerBg: "#e8dfcc",
    btnClass: "bg-[#1a2340] hover:bg-[#253060] text-white",
    checkColor: "text-gray-800",
    imgSrc: bronzegold,
    textColor: "text-gray-900",
    headingColor: "text-white",
  },
  {
    id: "silver",
    name: "Silver",
    price: "$499.99",
    period: "Month",
    features: [
      "3-month min + monthly management",
      "Priority customer support",
      "Premium cleaning services",
      "Premium cleaning services",
      "Loyalty points rewards",
      "Loyalty points rewards",
    ],
    isPopular: true,
    isFeatured: true,
    cardBg: "#BB9239",
    headerBg: "#BB9239",
    btnClass: "bg-white hover:bg-gray-100 text-[#5c4a20] font-semibold",
    checkColor: "text-[#c9a84c]",
    imgSrc: silverImg,
    textColor: "text-white",
    headingColor: "text-white",
  },
  {
    id: "gold",
    name: "Gold",
    price: "$999.99",
    period: "Month",
    features: [
      "Setup + monthly + perf fee",
      "Basic customer support",
      "Standard cleaning services",
      "Email notifications",
    ],
    isPopular: false,
    isFeatured: false,
    cardBg: "#e8dfcc",
    headerBg: "#e8dfcc",
    btnClass: "bg-[#1a2340] hover:bg-[#253060] text-white",
    checkColor: "text-gray-800",
    imgSrc: bronzegold,
    textColor: "text-gray-900",
    headingColor: "text-white",
  },
];

export default function ConsultationTiers() {
  const [hovered, setHovered] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }
    navigate("/dashboard");
  };

  const handleGetStarted = async (planId: string) => {
    try {
      const response = await api.post(
        "/subscription/create-checkout-session",
        {
          plan: planId,
        }
      );

      if (response.data.success) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      console.error("Subscription Error:", error);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#f0ebe0]">
      <Seo
        title={pageSeo.pricing.title}
        description={pageSeo.pricing.description}
        path={pageSeo.pricing.path}
      />
      <section className="w-full flex flex-col items-center px-4 py-20 pb-28">
        <div className="w-full max-w-6xl px-2 mb-6">
          <button
            type="button"
            onClick={handleBack}
            className="text-sm font-semibold text-gray-700 hover:text-gray-900"
          >
            ← Back
          </button>
        </div>
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Choose Consultation Tier
          </h1>
          <p className="text-gray-500 text-base md:text-lg">
            Select the level of consultation support you need.
          </p>
        </div>

        {/* Cards wrapper */}
        <div className="w-full max-w-6xl px-2 pt-8">
          <div className="flex flex-col lg:flex-row items-center lg:items-stretch justify-center gap-8">
            {tiers.map((tier) => {
              const isFeatured = tier.isFeatured;
              const isHovered = hovered === tier.id;

              return (
                <div
                  key={tier.id}
                  onMouseEnter={() => setHovered(tier.id)}
                  onMouseLeave={() => setHovered(null)}
                  style={{ backgroundColor: tier.cardBg }}
                  className={[
                    "relative flex flex-col rounded-2xl",
                    "transition-all duration-300 ease-in-out",
                    isFeatured
                      ? "w-full lg:w-[380px] shadow-2xl lg:scale-[1.06] lg:-mt-4 z-10"
                      : "w-full lg:w-[320px] shadow-lg",
                    isHovered && !isFeatured ? "-translate-y-2 shadow-xl" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {/* Most Popular Badge */}
                  {tier.isPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-30">
                      <span className="bg-[#1a2340] text-white text-xs font-semibold px-5 py-2 rounded-full shadow-lg whitespace-nowrap">
                        Most popular
                      </span>
                    </div>
                  )}

                  {/* Image Header */}
                  <div
                    className="w-full relative rounded-t-2xl overflow-hidden flex-shrink-0"
                    style={{
                      height: isFeatured ? "140px" : "120px",
                      backgroundColor: tier.headerBg,
                    }}
                  >
                    <img
                      src={tier.imgSrc}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover"
                      style={{ opacity: 0.6 }}
                    />
                    <div className="absolute inset-0 flex items-center justify-start px-6 z-10">
                      <h2
                        className={`font-bold drop-shadow ${tier.headingColor}`}
                        style={{ fontSize: isFeatured ? "1.8rem" : "1.6rem" }}
                      >
                        {tier.name}
                      </h2>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="flex flex-col flex-1 px-6 pt-5 pb-7 gap-4">
                    {/* Price */}
                    <div className="flex items-baseline gap-1 flex-wrap">
                      <span
                        className={`font-extrabold ${tier.textColor}`}
                        style={{ fontSize: isFeatured ? "2.2rem" : "1.9rem" }}
                      >
                        {tier.price}
                      </span>
                      <span
                        className={`text-sm font-medium ${tier.textColor}/80`}
                      >
                        /{tier.period}
                      </span>
                    </div>

                    {/* Divider */}
                    <div
                      className={`h-px ${tier.textColor === "text-gray-900" ? "bg-gray-400" : "bg-white/25"} w-full`}
                    />

                    {/* Features */}
                    <ul className="flex flex-col gap-3 flex-1">
                      {tier.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2.5">
                          <span className={tier.checkColor}>{checkIcon}</span>
                          <span className={`text-sm ${tier.textColor}/90`}>
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA Button */}
                    <button
                      onClick={() => handleGetStarted(tier.id)}
                      className={`mt-6 w-full py-3 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer ${tier.btnClass}`}
                    >
                      Get Started
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
