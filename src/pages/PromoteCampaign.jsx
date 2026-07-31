import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Rocket, TrendingUp, Megaphone, Globe, BarChart3, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function PromoteCampaign() {
  const { id: campaignId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [campaign, setCampaign] = useState(null);
  const [adCampaign, setAdCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Platform selection state
  const [activePlatform, setActivePlatform] = useState("google"); // "google" | "meta"

  // Form states
  const [dailyBudget, setDailyBudget] = useState(10);
  const [headline, setHeadline] = useState("");
  const [description, setDescription] = useState("");
  const [targetVersion, setTargetVersion] = useState("split");

  // Fetch campaign and active ad details based on active platform
  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccessMsg("");
      
      const campRes = await api.get(`/campaigns/${campaignId}`);
      if (campRes.data.success) {
        setCampaign(campRes.data.data);
        // Pre-populate ad copy defaults from campaign details
        setHeadline(campRes.data.data.campaignName || "");
        setDescription(campRes.data.data.businessInfo?.description?.substring(0, 90) || "");
      }

      // Only attempt to fetch metrics if the platform is linked
      const isLinked = activePlatform === "google" ? user?.googleAdAccountId : user?.metaAdAccountId;
      if (isLinked) {
        const adRes = await api.get(`/ads/${activePlatform}/metrics/${campaignId}`);
        if (adRes.data.success && adRes.data.data && adRes.data.data.adGroupId) {
          setAdCampaign(adRes.data.data);
        } else {
          setAdCampaign(null);
        }
      } else {
        setAdCampaign(null);
      }
    } catch (err) {
      console.error(err);
      setError(`Failed to fetch campaign and ${activePlatform === "google" ? "Google" : "Meta"} ads details.`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [campaignId, activePlatform]);

  const handleLaunch = async (e) => {
    e.preventDefault();
    if (!headline || !description || !dailyBudget) {
      setError("Please fill out all ad fields.");
      return;
    }

    setSubmitting(true);
    setError("");
    setSuccessMsg("");

    try {
      const response = await api.post(`/ads/${activePlatform}/launch`, {
        campaignId,
        dailyBudget,
        headline,
        description,
        targetVersion
      });

      if (response.data.success) {
        setSuccessMsg(`${activePlatform === "google" ? "Google Search" : "Meta"} Ad launched successfully!`);
        setAdCampaign(response.data.data);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || `Failed to launch campaign. Ensure your ${activePlatform === "google" ? "Google" : "Meta"} Ads account is fully configured.`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="animate-spin text-yellow-500" size={32} />
      </div>
    );
  }

  // Connection check guard for the currently selected platform
  const isLinked = activePlatform === "google" ? user?.googleAdAccountId : user?.metaAdAccountId;

  if (!user || !isLinked) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-6">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Navigation & Header */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2 text-sm font-black text-gray-500 hover:text-black uppercase tracking-widest transition-colors"
            >
              <ArrowLeft size={16} /> Back to Workspace
            </button>
          </div>

          {/* Campaign Info Header */}
          <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-yellow-600 mb-1 block">Active Promotion</span>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">{campaign?.campaignName}</h1>
              <p className="text-gray-400 font-bold text-sm mt-1">{campaign?.businessInfo?.businessName}</p>
            </div>
          </div>

          {/* Platform Tabs */}
          <div className="flex gap-4 border-b border-gray-150 pb-4">
            <button
              onClick={() => setActivePlatform("google")}
              className={`px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
                activePlatform === "google"
                  ? "bg-indigo-600 text-white shadow-lg"
                  : "bg-white text-gray-400 hover:text-gray-900 border border-gray-100 shadow-sm"
              }`}
            >
              Google Ads
            </button>
            <button
              onClick={() => setActivePlatform("meta")}
              className={`px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
                activePlatform === "meta"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-white text-gray-400 hover:text-gray-900 border border-gray-100 shadow-sm"
              }`}
            >
              Meta Ads
            </button>
          </div>

          <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-xl text-center space-y-6 max-w-md mx-auto">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto text-red-500">
               <AlertCircle size={32} />
            </div>
            <h2 className="text-2xl font-black text-gray-900">{activePlatform === "google" ? "Google" : "Meta"} Ads Not Linked</h2>
            <p className="text-gray-400 font-bold text-sm leading-relaxed">
               You need to link your {activePlatform === "google" ? "Google" : "Meta"} Ads account on the dashboard before promoting this campaign on this platform.
            </p>
            <button
              onClick={() => navigate("/dashboard")}
              className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-black transition-all shadow-lg cursor-pointer"
            >
               Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const liveUrl = `${window.location.origin}/live/${campaignId}`;
  const ctr = adCampaign?.impressions > 0 
    ? ((adCampaign.clicks / adCampaign.impressions) * 100).toFixed(2) 
    : "0.00";

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Navigation & Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-sm font-black text-gray-500 hover:text-black uppercase tracking-widest transition-colors"
          >
            <ArrowLeft size={16} /> Back to Workspace
          </button>
          
          <div className="flex items-center gap-2 px-4 py-1.5 bg-indigo-50 border border-indigo-100 rounded-full">
            <Globe className="text-indigo-600" size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">
              {activePlatform === "google" ? "Google Ads Engine" : "Meta Ads Engine"}
            </span>
          </div>
        </div>

        {/* Campaign Info Header */}
        <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-yellow-600 mb-1 block">Active Promotion</span>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">{campaign?.campaignName}</h1>
            <p className="text-gray-400 font-bold text-sm mt-1">{campaign?.businessInfo?.businessName}</p>
          </div>
          <a
            href={liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-gray-950 hover:bg-black text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all"
          >
            Preview Landing Page
          </a>
        </div>

        {/* Platform Tabs */}
        <div className="flex gap-4 border-b border-gray-150 pb-4">
          <button
            onClick={() => setActivePlatform("google")}
            className={`px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
              activePlatform === "google"
                ? "bg-indigo-600 text-white shadow-lg"
                : "bg-white text-gray-400 hover:text-gray-900 border border-gray-100 shadow-sm"
            }`}
          >
            Google Ads
          </button>
          <button
            onClick={() => setActivePlatform("meta")}
            className={`px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
              activePlatform === "meta"
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-white text-gray-400 hover:text-gray-900 border border-gray-100 shadow-sm"
            }`}
          >
            Meta Ads
          </button>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 font-medium">
            ⚠️ {error}
          </div>
        )}

        {successMsg && (
          <div className="p-4 bg-green-50 text-green-700 rounded-2xl border border-green-100 font-medium flex items-center gap-2">
            <CheckCircle2 size={18} /> {successMsg}
          </div>
        )}

        {/* Dynamic Display: Form vs Metrics */}
        {adCampaign ? (
          /* Active Ad Metrics Section */
          <div className="grid md:grid-cols-3 gap-8">
            
            {/* Stats Cards */}
            <div className="md:col-span-2 space-y-6">
              <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                <BarChart3 size={20} className="text-indigo-600" /> Real-time Performance Metrics
              </h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Ad Impressions</p>
                  <p className="text-3xl font-black text-gray-900">{adCampaign.impressions.toLocaleString()}</p>
                </div>
                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Ad Clicks</p>
                  <p className="text-3xl font-black text-gray-900 text-indigo-600">{adCampaign.clicks.toLocaleString()}</p>
                </div>
                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Spend to Date</p>
                  <p className="text-3xl font-black text-gray-900">${adCampaign.spend.toFixed(2)}</p>
                </div>
                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Click-Through-Rate</p>
                  <p className="text-3xl font-black text-green-600">{ctr}%</p>
                </div>
              </div>

              {/* Campaign settings summary */}
              <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-4">
                <h3 className="font-black text-lg text-gray-900">Campaign Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm font-bold">
                  <div>
                    <span className="text-gray-400 block text-xs">Daily Budget</span>
                    <span>${adCampaign.dailyBudget} USD / day</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-xs">Status</span>
                    <span className="text-green-600 capitalize">{adCampaign.status}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Google / Meta Ad Preview card */}
            <div className="space-y-6">
              <h2 className="text-xl font-black text-gray-900">Live Ad Preview</h2>
              
              {activePlatform === "google" ? (
                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm space-y-4">
                  <span className="text-[9px] font-black tracking-widest uppercase text-gray-400 block">Google Search Result</span>
                  
                  <div className="font-sans space-y-1">
                    <div className="text-xs text-gray-500 flex items-center gap-1">
                      <span>{window.location.hostname}</span>
                      <span>› live</span>
                      <span>› {campaignId}</span>
                    </div>
                    <div className="text-xl text-blue-800 hover:underline font-medium cursor-pointer line-clamp-1">
                      {adCampaign.adText}
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                      {description}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-gray-150 shadow-sm font-sans text-gray-900 overflow-hidden">
                  {/* FB Header */}
                  <div className="p-3 flex items-center gap-2">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-600 text-xs">
                       {campaign?.campaignName?.substring(0,2).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold text-xs hover:underline cursor-pointer leading-tight">{campaign?.campaignName}</div>
                      <div className="text-[9px] text-gray-400 flex items-center gap-0.5 font-bold">
                         Sponsored · 🌐
                      </div>
                    </div>
                  </div>
                  {/* Message Body */}
                  <p className="px-3 pb-2 text-[11px] leading-normal text-gray-700 line-clamp-3">
                     {description}
                  </p>
                  {/* Creative Placeholder */}
                  <div className="bg-slate-100 aspect-video flex flex-col items-center justify-center text-gray-400 border-y border-gray-100">
                     <Megaphone size={24} className="mb-1 text-gray-300" />
                     <span className="text-[9px] font-black uppercase tracking-wider">Campaign Creative Image</span>
                  </div>
                  {/* FB Bottom Details */}
                  <div className="p-3 bg-gray-50 flex justify-between items-center border-t border-gray-100">
                    <div>
                      <span className="text-[8px] font-bold text-gray-400 uppercase tracking-wider block">{window.location.hostname}</span>
                      <span className="font-bold text-[11px] text-gray-900 line-clamp-1">{adCampaign.adText}</span>
                    </div>
                    <button className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-900 text-[9px] font-black uppercase tracking-wider rounded transition-all">
                      Learn More
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        ) : (
          /* Ad Builder Form Section */
          <div className="grid md:grid-cols-2 gap-8">
            
            {/* Launch Form */}
            <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
              <h2 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                <Megaphone className="text-indigo-600" size={24} /> Configure {activePlatform === "google" ? "Search" : "Feed"} Ad
              </h2>
              <p className="text-gray-400 font-bold text-sm">
                Create a high-converting {activePlatform === "google" ? "text ad appearing at the top of Google search pages." : "image ad appearing in Facebook/Instagram news feeds."}
              </p>

              <form onSubmit={handleLaunch} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400 block">Ad Headline (Max 30 chars)</label>
                  <input
                    type="text"
                    maxLength={30}
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    placeholder="Enter short punchy header"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl font-bold text-sm focus:border-yellow-500 focus:outline-none"
                    required
                  />
                  <div className="text-right text-[10px] font-bold text-gray-400">
                    {headline.length}/30
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400 block">Ad Description (Max 90 chars)</label>
                  <textarea
                    maxLength={90}
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Briefly describe what you offer..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl font-bold text-sm focus:border-yellow-500 focus:outline-none"
                    required
                  />
                  <div className="text-right text-[10px] font-bold text-gray-400">
                    {description.length}/90
                  </div>
                </div>

                {campaign?.abTestingEnabled && (
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 block">Target Landing Page URL</label>
                    <select
                      value={targetVersion}
                      onChange={(e) => setTargetVersion(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl font-bold text-sm focus:border-yellow-500 focus:outline-none"
                    >
                      <option value="split">Split Test 50/50 Routing (Target: /live/{campaignId})</option>
                      <option value="A">Version A Only (Target: /live/{campaignId}/A)</option>
                      <option value="B">Version B Only (Target: /live/{campaignId}/B)</option>
                    </select>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400 block">Daily Budget Limit (USD)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-3.5 font-bold text-gray-400">$</span>
                    <input
                      type="number"
                      min={5}
                      max={500}
                      value={dailyBudget}
                      onChange={(e) => setDailyBudget(Number(e.target.value))}
                      className="w-full pl-8 pr-16 py-3 border border-gray-200 rounded-xl font-bold text-sm focus:border-yellow-500 focus:outline-none"
                      required
                    />
                    <span className="absolute right-4 top-3.5 font-bold text-xs text-gray-400 uppercase tracking-widest">USD / Day</span>
                  </div>
                  <span className="text-[10px] font-bold text-gray-400 mt-1 block">Minimum $5 / day. You can stop or pause at any time.</span>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 bg-yellow-500 text-black hover:bg-yellow-600 disabled:bg-gray-200 disabled:text-gray-400 rounded-2xl font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="animate-spin" size={18} /> Deploying Campaign...
                    </>
                  ) : (
                    <>
                      Launch Ad Campaign <Rocket size={18} />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Interactive Mockup */}
            <div className="space-y-6">
              <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                <TrendingUp size={20} className="text-yellow-600" /> Interactive Mockup
              </h2>
              
              {activePlatform === "google" ? (
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
                  <div>
                    <span className="text-[9px] font-black tracking-widest uppercase text-gray-400 block mb-2">Google Desktop Search Layout</span>
                    <div className="border border-gray-100 p-6 rounded-2xl bg-gray-50/50 space-y-2 font-sans">
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <span>{window.location.hostname}</span>
                        <span>› live</span>
                        <span>› {campaignId}</span>
                      </div>
                      <div className="text-xl text-blue-800 hover:underline font-medium cursor-pointer line-clamp-1">
                        {headline || "Your Ad Headline Appears Here"}
                      </div>
                      <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                        {description || "Write a compelling description outlining your campaign story, rewards, and goals."}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-gray-50 pt-6 space-y-4 text-xs font-bold text-gray-400">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                      Targeting: Mobile & Desktop Searches
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                      Destinations: Direct to Campaign Website
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
                  <div>
                    <span className="text-[9px] font-black tracking-widest uppercase text-gray-400 block mb-2">Facebook News Feed Layout</span>
                    <div className="border border-gray-150 rounded-2xl bg-white shadow-sm font-sans text-gray-905 overflow-hidden">
                      {/* FB Header */}
                      <div className="p-4 flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-600 text-sm">
                           {campaign?.campaignName?.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-sm hover:underline cursor-pointer leading-tight">{campaign?.campaignName}</div>
                          <div className="text-[10px] text-gray-400 flex items-center gap-1 font-bold">
                             Sponsored · 🌐
                          </div>
                        </div>
                      </div>
                      {/* Message Body */}
                      <p className="px-4 pb-3 text-xs leading-relaxed text-gray-700">
                         {description || "Write a compelling description outlining your campaign story, rewards, and goals."}
                      </p>
                      {/* Creative Image Placeholder */}
                      <div className="bg-slate-100 aspect-video flex flex-col items-center justify-center text-gray-400 border-y border-gray-100">
                         <Megaphone size={32} className="mb-2 text-gray-300" />
                         <span className="text-[10px] font-black uppercase tracking-wider">Campaign Creative Image</span>
                      </div>
                      {/* FB Bottom Details */}
                      <div className="p-4 bg-gray-50 flex justify-between items-center border-t border-gray-100">
                        <div>
                          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">{window.location.hostname}</span>
                          <span className="font-bold text-sm text-gray-900 line-clamp-1">{headline || "Your Ad Headline"}</span>
                        </div>
                        <button className="px-4 py-2 bg-gray-255 text-gray-900 text-[10px] font-black uppercase tracking-wider rounded-lg border border-gray-200">
                          Learn More
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-50 pt-6 space-y-4 text-xs font-bold text-gray-400">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                      Targeting: Facebook & Instagram User Feeds
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                      Audience: Target Interests & Demographics
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
