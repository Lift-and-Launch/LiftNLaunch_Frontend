import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Check, ShieldCheck, ArrowRight, Sparkles, Loader2 } from "lucide-react";
import { fetchEntitlements, isTrialing } from "../utils/entitlements";
import { formatPlanLabel } from "../utils/plans";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const { refreshUser, user } = useAuth();
  const [animate, setAnimate] = useState(false);
  const [showModal, setShowModal] = useState(true);
  const [syncing, setSyncing] = useState(true);
  const [planLabel, setPlanLabel] = useState<string | null>(null);
  const [trialActive, setTrialActive] = useState(false);
  const [trialDaysLeft, setTrialDaysLeft] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    const syncAfterCheckout = async () => {
      setSyncing(true);
      // Webhook may lag briefly — refresh user, then entitlements with a short retry.
      await refreshUser();
      let entitlements = null;
      for (let i = 0; i < 4; i++) {
        try {
          entitlements = await fetchEntitlements();
          if (entitlements?.isSubscribed || isTrialing(entitlements)) break;
        } catch {
          /* retry */
        }
        await new Promise((r) => setTimeout(r, 800));
      }
      if (!cancelled) {
        if (entitlements?.plan) {
          setPlanLabel(formatPlanLabel(entitlements.plan));
        }
        if (isTrialing(entitlements)) {
          setTrialActive(true);
          if (typeof entitlements.trialDaysRemaining === "number") {
            setTrialDaysLeft(entitlements.trialDaysRemaining);
          }
        }
        setSyncing(false);
      }
    };

    syncAfterCheckout();
    const timer = setTimeout(() => setAnimate(true), 100);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [refreshUser]);

  const statusLine = syncing
    ? "Syncing your subscription…"
    : trialActive
      ? trialDaysLeft != null
        ? `Your ${trialDaysLeft}-day Starter trial is active. Create campaigns anytime.`
        : "Your Starter free trial is active. Create campaigns anytime."
      : "Your plan is activating. If admin approval is required, builders unlock once your account is approved.";

  return (
    <div className="w-full min-h-screen bg-white flex items-center justify-center px-4 relative overflow-hidden">
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-gray-100 text-center space-y-6">
            <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto">
              <ShieldCheck className="w-8 h-8 text-yellow-600" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-gray-900 tracking-tight">
                {trialActive ? "Trial started" : "Payment Received"}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">{statusLine}</p>
            </div>

            <button
              type="button"
              onClick={() => {
                setShowModal(false);
                navigate("/dashboard");
              }}
              className="w-full py-4 bg-yellow-400 hover:bg-yellow-500 text-black rounded-2xl text-sm font-bold transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              Go to Dashboard <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <div
        className={`max-w-md w-full bg-white border border-amber-100 rounded-3xl shadow-2xl p-8 text-center transition-all duration-1000 ease-out transform ${
          animate ? "translate-y-0 opacity-100 scale-100" : "translate-y-12 opacity-0 scale-95"
        }`}
      >
        <div className="flex justify-center mb-6 relative">
          <div className="w-20 h-20 rounded-full bg-yellow-400/15 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-yellow-400 flex items-center justify-center shadow-lg relative">
              {syncing ? (
                <Loader2 className="w-8 h-8 text-black animate-spin" />
              ) : (
                <Check className="w-8 h-8 text-black stroke-[3px]" />
              )}
            </div>
          </div>
          <Sparkles className="absolute top-0 right-10 w-5 h-5 text-yellow-500 animate-bounce" />
        </div>

        <h1 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
          {trialActive ? "Trial Activated!" : "Payment Successful!"}
        </h1>
        <p className="text-yellow-700 text-sm font-semibold tracking-wider uppercase mb-6 flex items-center justify-center gap-1">
          <ShieldCheck className="w-4 h-4" />
          {planLabel ? `${planLabel} Plan` : "Subscription Activated"}
        </p>

        <div className="bg-yellow-50/50 border border-amber-100 rounded-2xl p-5 mb-8 text-left">
          <div className="flex justify-between items-center pb-3 border-b border-amber-100 mb-3">
            <span className="text-gray-500 text-sm">Account Name</span>
            <span className="text-gray-900 font-semibold text-sm">
              {user?.name || "Member"}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500 text-sm">Plan</span>
            <span className="text-yellow-700 bg-yellow-100 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider">
              {planLabel || "Syncing…"}
              {trialActive ? " · Trial" : ""}
            </span>
          </div>
        </div>

        <p className="text-gray-500 text-sm leading-relaxed mb-8">
          {trialActive
            ? "Thanks for starting your Starter trial. Campaign tools and Business Coach are unlocked for the trial period."
            : "Thank you for choosing Lift & Launch. Your Stripe checkout completed. Campaign tools unlock based on your plan and account approval status."}
        </p>

        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="w-full py-4 bg-gray-900 hover:bg-gray-800 text-white rounded-full text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          Continue to Dashboard
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
