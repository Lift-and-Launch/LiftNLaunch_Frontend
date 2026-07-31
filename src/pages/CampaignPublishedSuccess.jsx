import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Check, Copy, ExternalLink, ArrowRight, Sparkles, Globe } from "lucide-react";

function UrlDisplayBox({ title, url, isSplit = false }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`bg-slate-50 border rounded-3xl p-6 text-left relative group transition-all duration-300 hover:shadow-sm ${isSplit ? 'border-yellow-200 bg-yellow-50/20' : 'border-gray-100'}`}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 overflow-hidden">
          <Globe size={20} className={isSplit ? "text-yellow-600 flex-shrink-0 animate-pulse" : "text-gray-400 flex-shrink-0"} />
          <div className="overflow-hidden">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">
              {title}
            </span>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-bold text-gray-800 hover:text-yellow-600 transition-colors truncate block"
            >
              {url}
            </a>
          </div>
        </div>

        <button
          onClick={handleCopy}
          className={`p-4 rounded-2xl border transition-all flex items-center justify-center flex-shrink-0 ${
            copied
              ? "bg-green-50 border-green-200 text-green-600"
              : "bg-white border-gray-100 text-gray-400 hover:text-gray-900 hover:border-gray-200 hover:shadow-md active:scale-95"
          }`}
          title="Copy URL"
        >
          {copied ? <Check size={18} strokeWidth={3} /> : <Copy size={18} />}
        </button>
      </div>
    </div>
  );
}

export default function CampaignPublishedSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const [copied, setCopied] = useState(false);
  const [abTestingEnabled, setAbTestingEnabled] = useState(location.state?.abTestingEnabled || false);

  let campaignId = location.state?.campaignId;
  if (campaignId && typeof campaignId === 'object') {
    campaignId = campaignId._id || campaignId.id;
  }
  const liveUrl = location.state?.slug || `${window.location.origin}/live/${campaignId}`;

  useEffect(() => {
    if (campaignId && location.state?.abTestingEnabled === undefined) {
      const fetchCampaign = async () => {
        try {
          const { default: api } = await import("../api/axios");
          const res = await api.get(`/campaigns/${campaignId}`);
          if (res.data.success && res.data.data) {
            setAbTestingEnabled(!!res.data.data.abTestingEnabled);
          }
        } catch (err) {
          console.error("Failed to fetch campaign details on success page:", err);
        }
      };
      fetchCampaign();
    }
  }, [campaignId, location.state]);

  const handleCopy = () => {
    navigator.clipboard.writeText(liveUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-20 px-6 relative overflow-hidden">
      {/* Decorative gradient blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-yellow-200/30 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-yellow-300/20 blur-[130px] pointer-events-none" />

      <div className="max-w-xl w-full bg-white border border-gray-100 rounded-[3rem] shadow-2xl p-10 md:p-14 relative z-10 text-center">
        {/* Animated Celebration Icon */}
        <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-xl relative animate-bounce-subtle">
          <Sparkles className="text-black w-10 h-10" strokeWidth={2.5} />
          <div className="absolute inset-0 rounded-[2rem] border-4 border-yellow-300 animate-ping opacity-25" />
        </div>

        <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight mb-4">
          Your Site is Live!
        </h1>
        <p className="text-gray-500 font-bold text-base mb-10 leading-relaxed">
          Congratulations! Your customized website has been successfully generated and published. It is now publicly accessible.
        </p>

        {/* Dynamic URL Link Display Box(es) */}
        {abTestingEnabled ? (
          <div className="space-y-4 mb-10">
            <UrlDisplayBox 
              title="Version A Live URL" 
              url={`${window.location.origin}/live/${campaignId}/a`} 
            />
            <UrlDisplayBox 
              title="Version B Live URL" 
              url={`${window.location.origin}/live/${campaignId}/b`} 
            />
          </div>
        ) : (
          <div className="bg-slate-50 border border-gray-100 rounded-3xl p-6 mb-10 text-left relative group">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 overflow-hidden">
                <Globe size={20} className="text-yellow-600 flex-shrink-0" />
                <div className="overflow-hidden">
                  <span className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-1">
                    Live URL Address
                  </span>
                  <a
                    href={liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-bold text-gray-800 hover:text-yellow-600 transition-colors truncate block"
                  >
                    {liveUrl}
                  </a>
                </div>
              </div>

              <button
                onClick={handleCopy}
                className={`p-4 rounded-2xl border transition-all flex items-center justify-center flex-shrink-0 ${
                  copied
                    ? "bg-green-50 border-green-200 text-green-600"
                    : "bg-white border-gray-100 text-gray-400 hover:text-gray-900 hover:border-gray-200 hover:shadow-md active:scale-95"
                }`}
                title="Copy URL"
              >
                {copied ? <Check size={18} strokeWidth={3} /> : <Copy size={18} />}
              </button>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
          <a
            href={liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-8 py-4 bg-yellow-500 hover:bg-yellow-600 text-black font-black text-sm uppercase tracking-widest rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 group active:scale-95"
          >
            Visit Website
            <ExternalLink size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 font-black text-sm uppercase tracking-widest rounded-2xl transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            Back to Dashboard
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
