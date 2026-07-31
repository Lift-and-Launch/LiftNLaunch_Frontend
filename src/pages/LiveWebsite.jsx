import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import CanvasElement from "../components/canvas/CanvasElement";

export default function LiveWebsite() {
  const { campaignId, version } = useParams();
  const [websiteData, setWebsiteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWebsite = async () => {
      try {
        const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
        const versionParam = version ? `?v=${version.toUpperCase()}` : "";
        const response = await axios.get(`${baseURL}/websites/public/${campaignId}${versionParam}`);
        if (response.data.success && response.data.data) {
          setWebsiteData(response.data.data);
        } else {
          setError("Website not found");
        }
      } catch (err) {
        console.error("Failed to load live website:", err);
        setError(err.response?.data?.message || "Failed to load website details.");
      } finally {
        setLoading(false);
      }
    };

    if (campaignId) {
      fetchWebsite();
    }
  }, [campaignId, version]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mb-4" />
        <p className="text-gray-500 font-bold text-sm tracking-widest uppercase">Loading Website...</p>
      </div>
    );
  }

  if (error || !websiteData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-6 text-center">
        <div className="w-20 h-20 bg-red-100 rounded-3xl flex items-center justify-center text-red-500 mb-6 font-black text-2xl">
          !
        </div>
        <h1 className="text-2xl font-black text-gray-900 mb-2">Could Not Load Website</h1>
        <p className="text-gray-500 font-bold text-sm max-w-sm mb-6">
          {error || "The requested website could not be found or is no longer active."}
        </p>
        <a
          href="/"
          className="px-6 py-3 bg-gray-900 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-gray-800 transition-all"
        >
          Go Back Home
        </a>
      </div>
    );
  }

  const elements = websiteData.elements || [];
  const fontFamily = websiteData.globalStyles?.fontFamily || "Inter";

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center py-16 px-4 md:px-8 relative"
      style={{
        fontFamily: `'${fontFamily}', sans-serif`,
        backgroundColor: websiteData.globalStyles?.backgroundColor || "#ffffff",
        color: websiteData.globalStyles?.textColor || "#111827",
      }}
    >
      <div className="w-full max-w-[1000px] space-y-12">
        {elements.length === 0 ? (
          <div className="py-20 text-center text-gray-400 font-bold italic">
            This landing page does not contain any content.
          </div>
        ) : (
          elements.map((element) => {
            const paymentOptionActive = websiteData.campaignId && typeof websiteData.campaignId === "object"
              ? websiteData.campaignId.paymentOptionActive
              : websiteData.paymentOptionActive;

            const isStripeConnected = websiteData.campaignId && typeof websiteData.campaignId === "object" && websiteData.campaignId.user
              ? !!websiteData.campaignId.user.stripeAccountId
              : false;

            return (
              <CanvasElement
                key={element.id}
                element={element}
                isSelected={false}
                isPreviewMode={true}
                paymentOptionActive={paymentOptionActive}
                campaignId={campaignId}
                isStripeConnected={isStripeConnected}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
