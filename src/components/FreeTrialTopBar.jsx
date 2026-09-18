import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Sparkles, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { TRIAL_PERIOD_DAYS } from "../utils/plans";
import { hasActiveSubscription, isUserTrialing } from "../utils/subscription";

const DISMISS_KEY = "lnl_dismiss_trial_topbar";

/**
 * Slim announcement bar for marketing pages — drives visitors to the 15-day trial.
 */
export default function FreeTrialTopBar() {
  const { user } = useAuth();
  const location = useLocation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(DISMISS_KEY) === "1") {
        setVisible(false);
        return;
      }
    } catch {
      /* ignore */
    }
    // Hide on app/dashboard surfaces
    if (location.pathname.startsWith("/dashboard") || location.pathname.startsWith("/admin")) {
      setVisible(false);
      return;
    }
    if (user && (isUserTrialing(user) || hasActiveSubscription(user))) {
      setVisible(false);
      return;
    }
    setVisible(true);
  }, [user, location.pathname]);

  if (!visible) return null;

  const ctaTo = user
    ? "/pricing"
    : { pathname: "/signup", state: { from: { pathname: "/pricing" } } };

  return (
    <div className="relative w-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-400 text-black">
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-center">
        <p className="text-xs sm:text-sm font-bold tracking-tight flex items-center justify-center gap-1.5 flex-wrap">
          <Sparkles size={14} className="shrink-0" aria-hidden />
          <span>
            New: Try LaunchVault free for {TRIAL_PERIOD_DAYS} days — Campaigns, Business Coach &amp; AI
          </span>
        </p>
        <Link
          to={ctaTo}
          className="inline-flex items-center rounded-full bg-gray-900 hover:bg-black text-white text-[10px] sm:text-xs font-black uppercase tracking-widest px-4 py-1.5 transition-colors cursor-pointer shrink-0"
        >
          Start free trial
        </Link>
      </div>
      <button
        type="button"
        aria-label="Dismiss trial announcement"
        onClick={() => {
          try {
            sessionStorage.setItem(DISMISS_KEY, "1");
          } catch {
            /* ignore */
          }
          setVisible(false);
        }}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full text-black/70 hover:text-black hover:bg-black/10 cursor-pointer"
      >
        <X size={14} />
      </button>
    </div>
  );
}
