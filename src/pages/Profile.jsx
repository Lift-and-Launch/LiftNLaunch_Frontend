import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import {
  User as UserIcon,
  Mail,
  Shield,
  Calendar,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Megaphone,
  Globe,
  Loader2,
  ChevronLeft
} from "lucide-react";
import api from "../api/axios";

export default function Profile() {
  const { user, refreshUser, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [refreshing, setRefreshing] = useState(false);
  const [businesses, setBusinesses] = useState([]);
  const [loadingBiz, setLoadingBiz] = useState(false);

  useEffect(() => {
    const init = async () => {
      setRefreshing(true);
      await refreshUser();
      setRefreshing(false);
    };
    init();
  }, []);

  useEffect(() => {
    const fetchBiz = async () => {
      try {
        setLoadingBiz(true);
        const res = await api.get('/campaigns/business-profiles');
        if (res.data.success) {
          setBusinesses(res.data.data);
        }
      } catch (err) {
        console.error("Failed to load business profiles:", err);
      } finally {
        setLoadingBiz(false);
      }
    };
    if (user) {
      fetchBiz();
    }
  }, [user]);

  if (authLoading || (!user && refreshing)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-yellow-500" size={32} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-6 text-center">
        <div className="max-w-md space-y-4">
          <AlertCircle className="text-red-500 mx-auto" size={48} />
          <h2 className="text-2xl font-black text-gray-900">Access Denied</h2>
          <p className="text-gray-400 font-bold text-sm">Please sign in to view your profile settings.</p>
          <button
            onClick={() => navigate("/signin")}
            className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-md cursor-pointer"
          >
            Go to Sign In
          </button>
        </div>
      </div>
    );
  }

  // Calculate remaining days
  const isSubscribed = user.isSubscribed || user.subscription?.isSubscribed;
  const currentPeriodEnd = user.subscription?.currentPeriodEnd;
  const planName = user.subscription?.plan || "Free";
  const subStatus = user.subscription?.subscriptionStatus || "inactive";

  let daysLeft = 0;
  let formattedExpiry = "N/A";
  if (currentPeriodEnd) {
    const expiryDate = new Date(currentPeriodEnd);
    formattedExpiry = expiryDate.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const diffTime = expiryDate.getTime() - new Date().getTime();
    daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  const getPlanBadgeStyles = (plan) => {
    switch (plan?.toLowerCase()) {
      case "gold":
        return "bg-gradient-to-r from-amber-400 to-yellow-600 text-white shadow-yellow-250/30";
      case "silver":
        return "bg-gradient-to-r from-slate-400 to-slate-600 text-white shadow-slate-205/30";
      case "bronze":
        return "bg-gradient-to-r from-amber-600 to-orange-700 text-white shadow-orange-250/30";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Breadcrumbs / Back button */}
        <div className="flex items-center justify-between">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 text-sm font-black text-gray-500 hover:text-black uppercase tracking-widest transition-colors cursor-pointer"
          >
            <ChevronLeft size={16} /> Back to Dashboard
          </Link>
          {refreshing && (
            <span className="text-[10px] font-black text-yellow-600 uppercase tracking-widest flex items-center gap-1.5">
              <Loader2 className="animate-spin" size={12} /> Syncing profile...
            </span>
          )}
        </div>

        {/* Profile Card Header */}
        <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 sm:p-10 shadow-sm relative overflow-hidden flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-black font-black text-3xl shadow-lg flex-shrink-0">
            {user.name?.substring(0, 2).toUpperCase() || <UserIcon size={36} />}
          </div>
          
          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 justify-center sm:justify-start">
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">{user.name}</h1>
              <span className="px-3 py-1 text-[9px] font-black tracking-widest uppercase rounded-full bg-indigo-50 text-indigo-600 self-center">
                {user.role}
              </span>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-xs font-bold text-gray-400 justify-center sm:justify-start">
              <span className="flex items-center gap-1 justify-center sm:justify-start">
                <Mail size={14} className="text-gray-400" /> {user.email}
              </span>
              <span className="flex items-center gap-1 justify-center sm:justify-start">
                <Shield size={14} className="text-gray-400" /> Account Status: 
                <span className={user.adminApprovalStatus === "approved" ? "text-green-600 animate-pulse font-black" : "text-yellow-600 font-black"}>
                  {user.adminApprovalStatus?.toUpperCase() || "AWAITING APPROVAL"}
                </span>
              </span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Left Column: Subscription details */}
          <div className="md:col-span-2 space-y-8">
            <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 sm:p-10 shadow-sm space-y-8">
              <div>
                <span className="text-[10px] font-black uppercase text-yellow-600 tracking-widest block mb-1">Billing Overview</span>
                <h3 className="text-xl font-black text-gray-900 tracking-tight">Your Subscription</h3>
              </div>

              {isSubscribed ? (
                <div className="space-y-6">
                  
                  {/* Subscription card visual */}
                  <div className={`p-6 rounded-3xl ${getPlanBadgeStyles(planName)} flex items-center justify-between shadow-lg relative overflow-hidden group`}>
                    <div className="space-y-1 relative z-10">
                      <span className="text-[9px] font-black uppercase tracking-widest opacity-80">Active Plan</span>
                      <h4 className="text-2xl font-black uppercase tracking-tight">{planName} Premium</h4>
                      <p className="text-[10px] font-bold opacity-90">Auto-renews next cycle</p>
                    </div>
                    <CreditCard size={48} className="opacity-15 absolute right-6 top-1/2 -translate-y-1/2" />
                  </div>

                  <div className="grid grid-cols-2 gap-6 pt-4 border-t border-gray-50">
                    <div className="space-y-1">
                      <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest block">Subscription Status</span>
                      <div className="flex items-center gap-1.5 text-xs font-black text-green-600 uppercase">
                        <CheckCircle2 size={16} /> {subStatus}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest block">Renewal Date</span>
                      <div className="flex items-center gap-1.5 text-xs font-black text-gray-800">
                        <Calendar size={16} className="text-gray-400" /> {formattedExpiry}
                      </div>
                    </div>
                  </div>

                  {/* Remaining days visualization bar */}
                  <div className="space-y-3 pt-4 border-t border-gray-50">
                    <div className="flex justify-between items-end">
                      <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Time Remaining</span>
                      <span className="text-sm font-black text-gray-900">
                        {daysLeft > 0 ? `${daysLeft} Days Left` : "Expired / Suspended"}
                      </span>
                    </div>
                    
                    <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${
                          daysLeft > 10 ? "bg-green-500" : daysLeft > 5 ? "bg-yellow-500" : "bg-red-500"
                        }`}
                        style={{ width: `${Math.min(100, Math.max(0, (daysLeft / 30) * 100))}%` }}
                      />
                    </div>
                    <p className="text-[10px] font-bold text-gray-400 leading-relaxed">
                      Your subscription gives you access to full drag-and-drop templates, custom domain mapping, split testing dashboards, and active ad campaign deployment.
                    </p>
                  </div>

                </div>
              ) : (
                <div className="space-y-6 text-center py-6">
                  <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 mx-auto">
                    <CreditCard size={28} />
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-black text-gray-950">No Active Plan Connected</h4>
                    <p className="text-gray-400 font-bold text-xs max-w-sm mx-auto">
                      Upgrade to unlock custom domains, split tests, Google Ads OAuth, and advanced layout designs.
                    </p>
                  </div>
                  <button
                    onClick={() => navigate("/pricing")}
                    className="px-8 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
                  >
                    View Pricing Plans
                  </button>
                </div>
              )}
            </div>

            {/* Business profiles list section */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 sm:p-10 shadow-sm space-y-6">
              <div>
                <span className="text-[10px] font-black uppercase text-yellow-600 tracking-widest block mb-1">Company Directory</span>
                <h3 className="text-xl font-black text-gray-900 tracking-tight">Your Businesses</h3>
              </div>

              {loadingBiz ? (
                <div className="text-center py-6 text-xs text-gray-400 font-bold">Loading registered profiles...</div>
              ) : businesses.length > 0 ? (
                <div className="grid gap-4">
                  {businesses.map((biz) => (
                    <div key={biz.id || biz._id} className="p-5 bg-gray-50 border border-gray-100 rounded-2xl flex justify-between items-center hover:border-yellow-300 transition-colors">
                      <div className="space-y-1">
                        <h4 className="font-black text-gray-900 text-sm">{biz.businessName}</h4>
                        <p className="text-[10px] font-bold text-gray-400 truncate max-w-xs">{biz.category} · {biz.city || 'No City'}</p>
                      </div>
                      <Globe size={18} className="text-gray-400" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                  <p className="text-xs font-bold text-gray-400">No business profiles created yet.</p>
                </div>
              )}
            </div>

          </div>

          {/* Right Column: Linked Integrations */}
          <div className="space-y-8">
            <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm space-y-6">
              <h3 className="font-black text-lg text-gray-900">Connections</h3>

              <div className="space-y-4">
                {/* Stripe Connected Status */}
                <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl space-y-2">
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">Stripe Payouts</span>
                  {user.stripeAccountId ? (
                    <div className="flex items-center gap-2 text-xs font-black text-green-600 uppercase">
                      <CheckCircle2 size={16} /> Linked
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-xs font-black text-yellow-600 uppercase">
                      <AlertCircle size={16} /> Unlinked
                    </div>
                  )}
                </div>

                {/* Google Ads Connected Status */}
                <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl space-y-2">
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">Google Ads Account</span>
                  {user.googleAdAccountId ? (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs font-black text-green-600 uppercase">
                        <CheckCircle2 size={16} /> Linked
                      </div>
                      <span className="text-[9px] font-bold text-gray-400 font-mono block truncate">ID: {user.googleAdAccountId}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-xs font-black text-yellow-600 uppercase">
                      <AlertCircle size={16} /> Unlinked
                    </div>
                  )}
                </div>

                {/* Meta Ads Connected Status */}
                <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl space-y-2">
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">Meta Ads Account</span>
                  {user.metaAdAccountId ? (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs font-black text-green-600 uppercase">
                        <CheckCircle2 size={16} /> Linked
                      </div>
                      <span className="text-[9px] font-bold text-gray-400 font-mono block truncate">ID: {user.metaAdAccountId}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-xs font-black text-yellow-600 uppercase">
                      <AlertCircle size={16} /> Unlinked
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Support section */}
            <div className="bg-gray-900 text-white rounded-[2.5rem] p-8 space-y-4 shadow-xl">
              <Megaphone size={28} className="text-yellow-400" />
              <h4 className="font-black text-lg tracking-tight">Need assistance?</h4>
              <p className="text-gray-400 font-medium text-xs leading-relaxed">
                Our support team is available to assist with custom templates, ad account syncing, or stripe configurations.
              </p>
              <a 
                href="mailto:support@liftandlaunch.com" 
                className="inline-block pt-2 text-yellow-400 text-xs font-black uppercase tracking-wider hover:underline"
              >
                Contact Support →
              </a>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
