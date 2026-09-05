import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import api from '../api/axios';
import { 
  CheckCircle2, 
  Globe, 
  Search, 
  BarChart3, 
  ArrowRight, 
  ChevronLeft,
  Settings,
  ShieldCheck
} from 'lucide-react';

export default function PublishCampaign() {
  const navigate = useNavigate();
  const location = useLocation();
  let campaignId = location.state?.campaignId;
  if (campaignId && typeof campaignId === 'object') {
    campaignId = campaignId._id || campaignId.id;
  }

  const [abTestingEnabled, setAbTestingEnabled] = useState(false);
  const [formData, setFormData] = useState({
    slug: campaignId ? `${window.location.origin}/live/${campaignId}` : 'https://www.liftandlaunch.co/your-campaign-name',
    metaTitle: '',
    metaDescription: '',
    allowIndexing: true,
    keepPrivate: false,
    enableAnalytics: true,
    trackFormSubmissions: true
  });

  useEffect(() => {
    if (campaignId) {
      const fetchCampaignDetails = async () => {
        try {
          const res = await api.get(`/campaigns/${campaignId}`);
          if (res.data.success && res.data.data) {
            setAbTestingEnabled(!!res.data.data.abTestingEnabled);
          }
        } catch (err) {
          console.error("Failed to fetch campaign details for publish:", err);
        }
      };
      fetchCampaignDetails();
      setFormData(prev => ({
        ...prev,
        slug: `${window.location.origin}/live/${campaignId}`
      }));
    }
  }, [campaignId]);

  const handleLaunch = async () => {
    try {
      if (!campaignId) {
        alert("No campaign ID found to publish. Please go back and try again.");
        return;
      }
      
      const response = await api.put(`/campaigns/${campaignId}/publish`);
      if (response.data.success) {
        navigate('/dashboard/campaign/published-success', {
          state: {
            campaignId,
            slug: `${window.location.origin}/live/${campaignId}`,
            abTestingEnabled: abTestingEnabled
          }
        });
      }
    } catch (error) {
      console.error("Failed to publish campaign:", error);
      alert(error.response?.data?.message || "Failed to publish campaign");
    }
  };

  return (
    <div className="min-h-screen bg-white py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm font-bold text-gray-400 mb-12">
          <Link to="/dashboard" className="hover:text-gray-900 transition-colors">Dashboard</Link>
          <span>&gt;</span>
          <span className="text-yellow-600 font-black">Publish Campaign Page</span>
        </nav>

        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">
            Publish Your Campaign
          </h1>
          <p className="text-gray-500 font-bold text-lg">
            Review final settings, optimize for search engines, and make your campaign live.
          </p>
        </div>

        <div className="space-y-12">
          {/* Campaign Readiness Checklist */}
          <section className="bg-gray-50/50 rounded-[3rem] p-12 border border-gray-100 flex flex-col md:flex-row gap-12 items-center">
             <div className="flex-1 space-y-6">
               <h2 className="text-2xl font-black text-gray-900">Campaign Readiness</h2>
               <div className="space-y-4">
                  {[
                    "Campaign details completed",
                    "Enquiry form connected",
                    "Landing page designed",
                    "Preview reviewed"
                  ].map((check, i) => (
                    <div key={i} className="flex items-center gap-3">
                       <CheckCircle2 size={22} className="text-yellow-500" strokeWidth={3} />
                       <span className="font-bold text-gray-900">{check}</span>
                    </div>
                  ))}
               </div>
             </div>
             <div className="w-full md:w-72 aspect-video bg-white rounded-3xl border border-gray-100 shadow-xl p-4 overflow-hidden group">
                <div className="w-full h-full bg-yellow-50/50 rounded-2xl flex items-center justify-center relative overflow-hidden">
                   <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 to-transparent" />
                   <div className="w-3/4 h-3/4 bg-white rounded-xl shadow-lg p-4 space-y-2 translate-y-4 group-hover:translate-y-2 transition-transform duration-700">
                      <div className="h-2 w-1/2 bg-gray-100 rounded-full" />
                      <div className="h-2 w-full bg-gray-50 rounded-full" />
                      <div className="h-20 w-full bg-gray-50 rounded-xl" />
                   </div>
                </div>
             </div>
          </section>

          {/* SEO & Meta Informations */}
          <section className="bg-gray-50/50 rounded-[3rem] p-12 border border-gray-100 space-y-8">
             <div className="flex items-center gap-4 mb-2">
               <div className="h-[2px] w-8 bg-yellow-500" />
               <h2 className="text-xl font-black text-gray-900 uppercase tracking-widest leading-none">SEO and Meta Informations</h2>
             </div>

              <div>
                <label className="block text-sm font-black text-gray-900 mb-2 uppercase tracking-wide">
                  Campaign URL Slug
                </label>
                {abTestingEnabled ? (
                  <div className="grid gap-6">
                    <div>
                      <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest block mb-1">Version A URL</span>
                      <div className="relative">
                        <input 
                         type="text" 
                         className="w-full px-6 py-4 rounded-xl border border-gray-200 bg-gray-50 font-bold text-gray-400 cursor-not-allowed select-all"
                         value={`${window.location.origin}/live/${campaignId}/a`}
                         readOnly
                        />
                        <Globe size={18} className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300" />
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest block mb-1">Version B URL</span>
                      <div className="relative">
                        <input 
                         type="text" 
                         className="w-full px-6 py-4 rounded-xl border border-gray-200 bg-gray-50 font-bold text-gray-400 cursor-not-allowed select-all"
                         value={`${window.location.origin}/live/${campaignId}/b`}
                         readOnly
                        />
                        <Globe size={18} className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <input 
                     type="text" 
                     className="w-full px-6 py-4 rounded-xl border border-gray-200 bg-gray-50 font-bold text-gray-400 cursor-not-allowed select-all"
                     value={formData.slug}
                     readOnly
                    />
                    <Globe size={18} className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300" />
                  </div>
                )}
              </div>

             <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-black text-gray-900 uppercase tracking-wide">Meta Title</label>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Max 60 characters</span>
                  </div>
                  <input 
                    type="text" 
                    placeholder="Launch ABC - Smart solution for small Business"
                    className="w-full px-6 py-4 rounded-xl border border-gray-200 bg-white font-bold"
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-black text-gray-900 uppercase tracking-wide text-xs">Meta Description</label>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Max 160 characters</span>
                  </div>
                  <textarea 
                    rows={3}
                    placeholder="Discover how XYZ helps small businesses grow faster. Join our campaign and be part of the launch."
                    className="w-full px-6 py-4 rounded-xl border border-gray-200 bg-white font-bold resize-none"
                  />
                </div>
             </div>
          </section>

          {/* Indexing & Tracking */}
          <div className="grid md:grid-cols-2 gap-8">
             <section className="bg-gray-50/50 rounded-[3rem] p-10 border border-gray-100">
                <div className="flex items-center gap-4 mb-8">
                   <div className="h-[2px] w-6 bg-yellow-500" />
                   <h2 className="text-base font-black text-gray-900 uppercase tracking-[0.2em] leading-none">Search Engine Indexing</h2>
                </div>
                <div className="space-y-4">
                  <label className="flex items-start gap-4 cursor-pointer group">
                     <input type="checkbox" checked={formData.allowIndexing} className="mt-1 w-5 h-5 accent-yellow-500 rounded" />
                     <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-900 group-hover:text-yellow-600 transition-colors">Allow Search Engines To Index This Page (Recommended)</span>
                     </div>
                  </label>
                  <label className="flex items-start gap-4 cursor-pointer group">
                     <input type="checkbox" checked={formData.keepPrivate} className="mt-1 w-5 h-5 accent-yellow-500 rounded" />
                     <span className="text-sm font-bold text-gray-700 group-hover:text-yellow-600 transition-colors">Keep Private (Preview-Only)</span>
                  </label>
                </div>
             </section>

             <section className="bg-gray-50/50 rounded-[3rem] p-10 border border-gray-100">
                <div className="flex items-center gap-4 mb-8">
                   <div className="h-[2px] w-6 bg-yellow-500" />
                   <h2 className="text-base font-black text-gray-900 uppercase tracking-[0.2em] leading-none text-xs">Tracking & Analytics</h2>
                </div>
                <div className="space-y-4">
                  <label className="flex items-start gap-4 cursor-pointer group">
                     <input type="checkbox" checked={formData.enableAnalytics} className="mt-1 w-5 h-5 accent-yellow-500 rounded" />
                     <span className="text-sm font-bold text-gray-900 group-hover:text-yellow-600 transition-colors">Enable Page Analytics</span>
                  </label>
                  <label className="flex items-start gap-4 cursor-pointer group">
                     <input type="checkbox" checked={formData.trackFormSubmissions} className="mt-1 w-5 h-5 accent-yellow-500 rounded" />
                     <span className="text-sm font-bold text-gray-700 group-hover:text-yellow-600 transition-colors">Track Form Submissions</span>
                  </label>
                </div>
             </section>
          </div>

          <div className="flex flex-col items-center gap-8 pt-8">
             <label className="flex items-center gap-3 cursor-pointer p-4 rounded-2xl bg-gray-50/50 border border-gray-100 hover:border-yellow-200 transition-all">
                <input type="checkbox" className="w-5 h-5 accent-yellow-500 rounded" />
                <span className="text-sm font-black text-gray-900 uppercase tracking-tight">I Confirm That All Campaign Details Are Accurate And Ready To Go Live.</span>
             </label>

             <div className="flex items-center gap-6">
                <button 
                  onClick={() => navigate(-1)}
                  className="px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest text-gray-900 border border-gray-200 hover:bg-gray-100 transition-all flex items-center gap-2"
                >
                  <ChevronLeft size={18} /> Back To Preview
                </button>
                <button 
                  onClick={handleLaunch}
                  className="px-16 py-5 rounded-2xl font-black text-sm uppercase tracking-widest bg-yellow-500 text-black hover:bg-yellow-600 transition-all shadow-2xl flex items-center gap-2 active:scale-95"
                >
                  Publish Campaign <ArrowRight size={18} />
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
