import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

export default function StripeCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const [status, setStatus] = useState("loading"); // loading, success, error
  const [message, setMessage] = useState("Connecting your Stripe account...");
  const [details, setDetails] = useState("Please wait while we finalize your account integration.");

  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");
  const stateVal = searchParams.get("state") || "/dashboard";

  useEffect(() => {
    const handleCallback = async () => {
      if (error) {
        setStatus("error");
        setMessage("Connection Failed");
        setDetails(errorDescription || "You declined or Stripe cancelled the integration request.");
        return;
      }

      if (!code) {
        setStatus("error");
        setMessage("Invalid Callback");
        setDetails("No authorization code was provided by Stripe.");
        return;
      }

      try {
        setStatus("loading");
        setMessage("Exchanging authorization code...");
        const response = await api.post("/payments/stripe/connect", { code });

        if (response.data.success) {
          setStatus("success");
          setMessage("Stripe Connected!");
          setDetails("Your account is now ready to receive donations. Redirecting you back...");
          
          // Refresh user context so the app knows Stripe is connected
          await refreshUser();

          // Auto-redirect back to dashboard or state page
          setTimeout(() => {
            navigate(stateVal);
          }, 3000);
        } else {
          setStatus("error");
          setMessage("Connection Failed");
          setDetails(response.data.message || "An error occurred during account linking.");
        }
      } catch (err) {
        console.error("Stripe callback exchange failed:", err);
        setStatus("error");
        setMessage("Server Connection Error");
        setDetails(err.response?.data?.message || "Failed to communicate with our server. Please try again.");
      }
    };

    handleCallback();
  }, [code, error, errorDescription, navigate, stateVal, refreshUser]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-xl text-center space-y-8">
        
        {/* Visual Indicator */}
        <div className="flex justify-center">
          {status === "loading" && (
            <div className="relative flex items-center justify-center">
              <Loader2 className="w-16 h-16 text-yellow-500 animate-spin" />
              <div className="absolute w-20 h-20 rounded-full border-4 border-yellow-500/10 animate-pulse" />
            </div>
          )}

          {status === "success" && (
            <div className="w-20 h-20 bg-green-50 rounded-3xl flex items-center justify-center text-green-500 shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>
          )}

          {status === "error" && (
            <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center text-red-500 shadow-inner">
              <AlertCircle className="w-10 h-10" />
            </div>
          )}
        </div>

        {/* Text Details */}
        <div className="space-y-3">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">{message}</h2>
          <p className="text-slate-400 font-bold text-sm leading-relaxed max-w-xs mx-auto">
            {details}
          </p>
        </div>

        {/* Interactive Action (Only on error or manual redirect) */}
        {status === "error" ? (
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all"
          >
            Back to Dashboard
          </button>
        ) : status === "success" ? (
          <button
            onClick={() => navigate(stateVal)}
            className="w-full py-4 bg-green-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-green-600 transition-all shadow-md"
          >
            Go Now
          </button>
        ) : (
          <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest animate-pulse">
            Do not close this page
          </div>
        )}
      </div>
    </div>
  );
}
