import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { fetchEntitlements, isTrialing } from "../utils/entitlements";

/**
 * Shows “Free trial — X days left” when entitlements.isTrialing.
 * Compact strip for dashboard / profile surfaces.
 */
export default function TrialBanner({ className = "" }) {
  const [entitlements, setEntitlements] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchEntitlements();
        if (!cancelled) setEntitlements(data);
      } catch {
        /* non-blocking */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!isTrialing(entitlements)) return null;

  const days =
    typeof entitlements.trialDaysRemaining === "number"
      ? entitlements.trialDaysRemaining
      : null;
  const label =
    days == null
      ? "Free trial active"
      : days <= 0
        ? "Free trial ending today"
        : `Free trial — ${days} day${days === 1 ? "" : "s"} left`;

  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 ${className}`}
      role="status"
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
          <Sparkles size={18} />
        </div>
        <div>
          <p className="text-sm font-black text-amber-950 tracking-tight">{label}</p>
          <p className="text-xs font-semibold text-amber-800/80 mt-0.5">
            Starter access is unlocked during your trial. Billing starts when it ends unless you cancel.
          </p>
        </div>
      </div>
      <Link
        to="/pricing"
        className="shrink-0 self-start sm:self-center text-[10px] font-black uppercase tracking-widest text-amber-900 hover:text-black"
      >
        View plans →
      </Link>
    </div>
  );
}
