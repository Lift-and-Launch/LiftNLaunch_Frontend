import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { Bot, LayoutTemplate, Rocket, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { TRIAL_PERIOD_DAYS } from "../utils/plans";
import { hasActiveSubscription, isUserTrialing } from "../utils/subscription";

const highlights = [
  {
    icon: LayoutTemplate,
    title: "Campaign builder",
    copy: "Launch pages, funnels & publish tools",
  },
  {
    icon: Bot,
    title: "Business Coach & AI",
    copy: "Strategy help and campaign AI drafts",
  },
  {
    icon: Rocket,
    title: "No charge for 15 days",
    copy: "Card on file at checkout · cancel anytime",
  },
];

/**
 * Landing section: one job — convert visitors into a Starter free trial.
 */
export default function FreeTrialOfferSection() {
  const { user } = useAuth();
  const rootRef = useRef(null);

  useEffect(() => {
    if (!rootRef.current) return;
    gsap.fromTo(
      rootRef.current.querySelectorAll("[data-trial-animate]"),
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: "power2.out" }
    );
  }, []);

  if (user && (isUserTrialing(user) || hasActiveSubscription(user))) {
    return null;
  }

  const primaryTo = user
    ? "/pricing"
    : { pathname: "/signup", state: { from: { pathname: "/pricing" } } };
  const signInTo = {
    pathname: "/signin",
    state: { from: { pathname: "/pricing" } },
  };

  return (
    <section className="w-full border-b-2 border-amber-200 bg-gradient-to-b from-yellow-50 via-white to-white overflow-hidden">
      <div
        ref={rootRef}
        className="max-w-7xl mx-auto px-4 md:px-8 py-14 md:py-20"
      >
        <div className="max-w-3xl mx-auto text-center" data-trial-animate>
          <p className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-amber-700 mb-4">
            <Sparkles size={12} aria-hidden />
            Limited intro offer
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight">
            Start your {TRIAL_PERIOD_DAYS}-day free trial
          </h2>
          <p className="mt-4 text-gray-600 text-base md:text-lg font-medium leading-relaxed">
            Create an account, unlock LaunchVault, and try campaigns, Business Coach,
            and AI tools risk-free. Billing starts after the trial unless you cancel.
          </p>
        </div>

        <ul
          className="mt-10 grid sm:grid-cols-3 gap-6 md:gap-8 max-w-4xl mx-auto"
          data-trial-animate
        >
          {highlights.map(({ icon: Icon, title, copy }) => (
            <li key={title} className="text-center sm:text-left">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-yellow-400 text-black mb-3">
                <Icon size={20} aria-hidden />
              </div>
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-wide">
                {title}
              </h3>
              <p className="mt-1 text-sm text-gray-600 font-medium leading-snug">
                {copy}
              </p>
            </li>
          ))}
        </ul>

        <div
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3"
          data-trial-animate
        >
          <Link
            to={primaryTo}
            className="inline-flex w-full sm:w-auto items-center justify-center px-8 py-3.5 rounded-full bg-yellow-400 hover:bg-yellow-500 text-black text-sm font-black tracking-wide transition-colors cursor-pointer shadow-md"
          >
            {user ? "Start 15-day free trial" : "Join free — start trial"}
          </Link>
          {!user && (
            <Link
              to={signInTo}
              className="inline-flex w-full sm:w-auto items-center justify-center px-8 py-3.5 rounded-full border border-gray-300 hover:border-gray-900 text-gray-900 text-sm font-bold transition-colors cursor-pointer"
            >
              Already have an account? Sign in
            </Link>
          )}
        </div>
        <p
          className="mt-4 text-center text-[11px] font-semibold text-gray-500"
          data-trial-animate
        >
          Starter plan after trial · ${"28.88"}/mo · no Expert add-ons required
        </p>
      </div>
    </section>
  );
}
