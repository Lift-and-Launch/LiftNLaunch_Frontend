import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Check, ShieldCheck, ArrowRight, Sparkles } from "lucide-react";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const { subscribe, user } = useAuth();
  const [animate, setAnimate] = useState(false);
  const [showModal, setShowModal] = useState(true);

  useEffect(() => {
    // Instantly sync local state
    subscribe();
    
    // Trigger entrance animation
    const timer = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#f0ebe0] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Verification Pending Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-gray-100 text-center space-y-6">
            <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto">
              <ShieldCheck className="w-8 h-8 text-yellow-600" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-gray-900 tracking-tight">Account Under Verification</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Your account is under verification. Admin will review within 24 hours and you will get the mail in your registered ID mail once your account is active.
              </p>
            </div>

            <button
              onClick={() => {
                setShowModal(false);
                navigate("/dashboard");
              }}
              className="w-full py-4 bg-[#1a2340] hover:bg-[#253060] text-white rounded-2xl text-sm font-bold transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              Go to Dashboard <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Dynamic Background Gradients */}
      <div className="absolute top-[-10%] right-[-10%] w-[350px] h-[350px] rounded-full bg-[#BB9239]/10 blur-[80px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[350px] h-[350px] rounded-full bg-[#1a2340]/5 blur-[80px] pointer-events-none" />

      {/* Main Success Container */}
      <div
        className={`max-w-md w-full bg-white/70 backdrop-blur-md border border-[#e8dfcc] rounded-3xl shadow-2xl p-8 text-center transition-all duration-1000 ease-out transform ${
          animate ? "translate-y-0 opacity-100 scale-100" : "translate-y-12 opacity-0 scale-95"
        }`}
      >
        {/* Animated Checkmark Badge */}
        <div className="flex justify-center mb-6 relative">
          <div
            className={`w-20 h-20 rounded-full bg-[#BB9239]/10 flex items-center justify-center transition-all duration-700 delay-300 transform ${
              animate ? "scale-100 rotate-0" : "scale-50 rotate-45"
            }`}
          >
            <div className="w-16 h-16 rounded-full bg-[#BB9239] flex items-center justify-center shadow-lg shadow-[#BB9239]/30 relative">
              <Check className="w-8 h-8 text-white stroke-[3px]" />
              
              {/* Outer pulsing ring */}
              <span className="absolute -inset-2 rounded-full border-2 border-[#BB9239] animate-ping opacity-25 pointer-events-none" />
            </div>
          </div>
          
          {/* Floating Sparkle Icons */}
          <Sparkles className={`absolute top-0 right-10 w-5 h-5 text-[#BB9239] animate-bounce transition-all duration-500 delay-500 ${
            animate ? "opacity-100 scale-100" : "opacity-0 scale-0"
          }`} />
        </div>

        {/* Success Typography */}
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
          Payment Successful!
        </h1>
        <p className="text-[#BB9239] text-sm font-semibold tracking-wider uppercase mb-6 flex items-center justify-center gap-1">
          <ShieldCheck className="w-4 h-4" />
          Subscription Activated
        </p>

        {/* Order Details Card */}
        <div className="bg-[#fcfbf9] border border-[#e8dfcc] rounded-2xl p-5 mb-8 text-left">
          <div className="flex justify-between items-center pb-3 border-b border-[#e8dfcc]/50 mb-3">
            <span className="text-gray-500 text-sm">Account Name</span>
            <span className="text-gray-900 font-semibold text-sm">{user?.name || "Member"}</span>
          </div>
          <div className="flex justify-between items-center pb-3 border-b border-[#e8dfcc]/50 mb-3">
            <span className="text-gray-500 text-sm">Status</span>
            <span className="text-yellow-600 bg-yellow-50 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider">
              Pending Review
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500 text-sm">Access Gated Tools</span>
            <span className="text-red-600 font-bold text-xs uppercase tracking-wider bg-red-55/5 px-2.5 py-0.5 rounded-full">
              Awaiting Verification
            </span>
          </div>
        </div>

        {/* Descriptive Message */}
        <p className="text-gray-500 text-sm leading-relaxed mb-8">
          Thank you for choosing Server Neighborhood! Your payment has been received. Your profile is currently under review by our administrator. All website building operations will unlock once approved.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => setShowModal(true)}
            className="w-full py-4 bg-[#1a2340] hover:bg-[#253060] text-white rounded-full text-sm font-bold shadow-lg shadow-[#1a2340]/20 hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer group"
          >
            Review Status
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
}
