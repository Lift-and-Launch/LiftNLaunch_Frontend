import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { isSuperAdmin } from '../utils/roles';
import {
  Users,
  FileText,
  CreditCard,
  ShieldCheck,
  MessageCircle,
  Tag,
  BarChart3,
  NotebookPen,
  HelpCircle,
  Wrench,
  LayoutDashboard,
  LogOut,
  Plus,
  Trash2,
  Megaphone,
  CheckCircle2,
  Sparkles,
  Star,
  Rocket,
  ArrowRight,
  Clock,
  ShieldAlert,
} from 'lucide-react';
import CreateCampaignForm from '../components/CreateCampaignForm';
import api from '../api/axios';
import AdminDashboardView from '../components/AdminDashboardView';

const scrollToSection = (id) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user && isSuperAdmin(user.role)) {
      navigate(user.adminOtpVerified ? '/admin/dashboard' : '/admin/verify-otp', { replace: true });
    }
  }, [user, navigate]);

  if (!user) {
    navigate('/signin');
    return null;
  }

  if (isSuperAdmin(user.role)) {
    return null;
  }

  return <UserDashboardView logout={logout} user={user} />;
}

const UserDashboardView = ({ logout, user }) => {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [stripeClientId, setStripeClientId] = React.useState('');

  // Google Ads states
  const [googleAccounts, setGoogleAccounts] = React.useState([]);
  const [selectedAccount, setSelectedAccount] = React.useState('');
  const [loadingAccounts, setLoadingAccounts] = React.useState(false);
  const [adMsg, setAdMsg] = React.useState('');

  // Meta Ads states
  const [metaAccounts, setMetaAccounts] = React.useState([]);
  const [selectedMetaAccount, setSelectedMetaAccount] = React.useState('');
  const [loadingMetaAccounts, setLoadingMetaAccounts] = React.useState(false);
  const [metaMsg, setMetaMsg] = React.useState('');

  React.useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await api.get('/campaigns');
        if (response.data.success) {
          setCampaigns(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching campaigns:', error);
      } finally {
        setLoading(false);
      }
    };
    const fetchStripeConfig = async () => {
      try {
        const response = await api.get('/payments/config');
        if (response.data.success) {
          setStripeClientId(response.data.stripeClientId);
        }
      } catch (error) {
        console.error('Error fetching Stripe config:', error);
      }
    };
    fetchCampaigns();
    if (!user.stripeAccountId) {
      fetchStripeConfig();
    }
  }, [user.stripeAccountId]);

  // Google Ads accounts fetching
  React.useEffect(() => {
    if (user.googleRefreshToken && !user.googleAdAccountId) {
      const fetchAccounts = async () => {
        setLoadingAccounts(true);
        try {
          const response = await api.get('/ads/google/accounts');
          if (response.data.success && response.data.data) {
            setGoogleAccounts(response.data.data);
            if (response.data.data.length > 0) {
              setSelectedAccount(response.data.data[0]);
            }
          }
        } catch (error) {
          console.error('Error fetching Google Ads accounts:', error);
        } finally {
          setLoadingAccounts(false);
        }
      };
      fetchAccounts();
    }
  }, [user.googleRefreshToken, user.googleAdAccountId]);

  // Meta Ads accounts fetching
  React.useEffect(() => {
    if (user.metaAccessToken && !user.metaAdAccountId) {
      const fetchMetaAccounts = async () => {
        setLoadingMetaAccounts(true);
        try {
          const response = await api.get('/ads/meta/accounts');
          if (response.data.success && response.data.data) {
            setMetaAccounts(response.data.data);
            if (response.data.data.length > 0) {
              setSelectedMetaAccount(response.data.data[0].id);
            }
          }
        } catch (error) {
          console.error('Error fetching Meta Ads accounts:', error);
        } finally {
          setLoadingMetaAccounts(false);
        }
      };
      fetchMetaAccounts();
    }
  }, [user.metaAccessToken, user.metaAdAccountId]);

  const handleConnectGoogleAds = async () => {
    try {
      const response = await api.get('/ads/google/auth-url');
      if (response.data.success && response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      console.error('Failed to get Google Ads auth URL:', error);
      alert('Failed to connect Google Ads.');
    }
  };

  const handleLinkGoogleAccount = async () => {
    if (!selectedAccount) return;
    try {
      const response = await api.post('/ads/google/select-account', {
        customerId: selectedAccount
      });
      if (response.data.success) {
        setAdMsg('Google Ad Account linked successfully! Reloading...');
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } catch (error) {
      console.error('Failed to link account:', error);
      alert('Failed to link account.');
    }
  };

  const handleConnectMetaAds = async () => {
    try {
      const response = await api.get('/ads/meta/auth-url');
      if (response.data.success && response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      console.error('Failed to get Meta Ads auth URL:', error);
      alert('Failed to connect Meta Ads.');
    }
  };

  const handleLinkMetaAccount = async () => {
    if (!selectedMetaAccount) return;
    try {
      const response = await api.post('/ads/meta/select-account', {
        adAccountId: selectedMetaAccount
      });
      if (response.data.success) {
        setMetaMsg('Meta Ad Account linked successfully! Reloading...');
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } catch (error) {
      console.error('Failed to link Meta account:', error);
      alert('Failed to link Meta account.');
    }
  };

  const handleTogglePayment = async (campaignId, currentVal) => {
    const newVal = !currentVal;
    if (newVal && !user.stripeAccountId) {
      alert("Please connect your Stripe account first under the 'Stripe Connection' card to enable donations.");
      return;
    }
    try {
      const response = await api.put(`/campaigns/${campaignId}/toggle-payment`, {
        paymentOptionActive: newVal
      });
      if (response.data.success) {
        setCampaigns(prev => prev.map(c => 
          c._id === campaignId ? { ...c, paymentOptionActive: response.data.data.paymentOptionActive } : c
        ));
      }
    } catch (error) {
      console.error('Error toggling payment option:', error);
      alert('Failed to update donation settings');
    }
  };

  const handleDeleteCampaign = async (campaignId, campaignName) => {
    if (!window.confirm(`Are you sure you want to delete the campaign "${campaignName}"? This will permanently delete the campaign and its website configuration.`)) {
      return;
    }
    try {
      const response = await api.delete(`/campaigns/${campaignId}`);
      if (response.data.success) {
        setCampaigns(prev => prev.filter(c => c._id !== campaignId));
      }
    } catch (error) {
      console.error('Error deleting campaign:', error);
      alert(error.response?.data?.message || 'Failed to delete campaign');
    }
  };

  const handleEditCampaign = (campaign) => {
    const campaignId = campaign._id || campaign.id;

    if (user.isSubscribed && user.adminApprovalStatus !== 'approved') {
      alert("Your account is currently under review by our admin team. You cannot edit or build campaign websites until approved.");
      return;
    }

    if (campaign.status === 'pending') {
      alert("This campaign is currently pending admin approval. You will be able to access the landing page builder once approved.");
      return;
    }

    if (campaign.status !== 'draft') {
      if (user && !user.isSubscribed) {
        navigate('/pricing');
      } else {
        navigate('/dashboard/campaign/builder', { state: { campaignId, campaignType: campaign.campaignType } });
      }
    } else {
      if (!campaign.businessInfo || !campaign.businessInfo.businessName) {
        navigate('/dashboard/campaign/register-business', { state: { campaignId, campaignType: campaign.campaignType } });
      } else if (!campaign.campaignConfig) {
        navigate('/dashboard/campaign/configure', { state: { campaignId, campaignType: campaign.campaignType } });
      } else {
        navigate('/dashboard/campaign/review', { state: { campaignId, campaignType: campaign.campaignType } });
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'completed': return 'bg-blue-500';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
       <div className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
             <div className="flex items-center gap-3">
                <LayoutDashboard size={24} className="text-yellow-500" />
                <h1 className="text-xl font-black text-gray-900 tracking-tight uppercase">Workspace</h1>
             </div>
             <div className="flex items-center gap-6">
               <div className="flex items-center gap-2 px-4 py-1.5 bg-gray-100 rounded-full">
                  <div className={`w-2 h-2 rounded-full ${user.isSubscribed ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                    {user.isSubscribed ? 'Subscribed' : 'Free Account'}
                  </span>
               </div>
               <button onClick={logout} className="flex items-center gap-2 text-sm font-black text-gray-400 hover:text-red-500 transition-colors uppercase tracking-widest cursor-pointer">
                  <LogOut size={16} /> Sign Out
               </button>
             </div>
          </div>
       </div>

       <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12">
          {/* Personalized Greeting Header */}
          <div className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
             <div>
                <h2 className="text-3xl font-black text-gray-900 tracking-tight">Welcome back, {user.name}! 👋</h2>
                <p className="text-gray-400 font-bold text-sm mt-1">Here is the active summary of your workspace, connected ad accounts, and traffic metrics.</p>
             </div>
             {user.isSubscribed && (
               <div className="flex items-center gap-2 self-start sm:self-center px-4 py-2.5 bg-gradient-to-r from-yellow-400/10 to-orange-500/10 border border-yellow-500/20 rounded-2xl text-xs font-black text-yellow-600 uppercase tracking-wide">
                 <Star size={14} className="text-yellow-500 fill-yellow-500" /> Premium Subscriber
               </div>
             )}
          </div>

          {user.isSubscribed && user.adminApprovalStatus === 'pending' && (
            <div className="mb-10 bg-amber-50 border border-amber-250 rounded-[2rem] p-8 flex flex-col md:flex-row items-center gap-6 shadow-sm">
              <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600 shrink-0">
                <Clock size={32} />
              </div>
              <div className="space-y-1 text-center md:text-left">
                <h3 className="text-lg font-black text-amber-900 uppercase tracking-tight">Account Review Pending</h3>
                <p className="text-sm text-amber-700/80 font-bold leading-relaxed">
                  Our admin team is currently reviewing your account subscription details. The campaign and landing page builders will unlock automatically once your account review is approved.
                </p>
              </div>
            </div>
          )}

          {user.isSubscribed && user.adminApprovalStatus === 'rejected' && (
            <div className="mb-10 bg-rose-50 border border-rose-250 rounded-[2rem] p-8 flex flex-col md:flex-row items-center gap-6 shadow-sm">
              <div className="w-16 h-16 bg-rose-100 rounded-2xl flex items-center justify-center text-rose-600 shrink-0">
                <ShieldAlert size={32} className="animate-pulse" />
              </div>
              <div className="space-y-1 text-center md:text-left">
                <h3 className="text-lg font-black text-rose-900 uppercase tracking-tight">Verification Request Rejected</h3>
                <p className="text-sm text-rose-700/80 font-bold leading-relaxed">
                  Your verification request has been rejected. Please review our guidelines or contact support at support@neighborhood.com to resolve this.
                </p>
              </div>
            </div>
          )}

          {/* Main Hero Section */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
             <div 
               className="md:col-span-2 group relative overflow-hidden bg-white p-12 rounded-[3.5rem] shadow-xl hover:shadow-2xl transition-all border border-gray-100"
             >
                <div className="relative z-10 flex flex-col h-full justify-between">
                   <div>
                      <div className="flex items-center gap-2 text-yellow-600 font-black uppercase text-xs tracking-widest mb-6">
                         <Rocket size={16} /> Launch Center
                      </div>
                      <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-none tracking-tighter">
                         Your next big <br/>
                         <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">Breakthrough</span> starts here.
                      </h2>
                      <p className="text-gray-400 font-bold text-lg mb-12 max-w-md leading-relaxed">
                         Turn your idea into a funded reality using our proprietary 5-step campaign model.
                      </p>
                   </div>
                   
                   <div className="flex flex-wrap gap-4">
                      <button 
                        onClick={() => {
                          if (user.isSubscribed && user.adminApprovalStatus !== 'approved') {
                            alert("Your account is currently under review by our admin team. You cannot create new campaigns until approved.");
                            return;
                          }
                          navigate('/dashboard/campaign/create');
                        }}
                        className="px-10 py-5 bg-yellow-500 text-black rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-yellow-600 shadow-xl transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
                      >
                         Create New Campaign <ArrowRight size={18} />
                      </button>
                      {!user.isSubscribed && (
                        <button 
                          onClick={() => navigate('/pricing')}
                          className="px-10 py-5 bg-gray-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-black transition-all flex items-center gap-2 cursor-pointer"
                        >
                           Upgrade Plan
                        </button>
                      )}
                      {user.isSubscribed && (
                        <button 
                          onClick={() => navigate('/dashboard/profile')}
                          className="px-10 py-5 bg-indigo-600 hover:bg-indigo-750 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all flex items-center gap-2 cursor-pointer shadow-lg"
                        >
                           View Subscription <Star size={16} />
                        </button>
                      )}
                   </div>
                </div>

                {/* Decorative background element */}
                <div className="absolute top-0 right-0 w-1/2 h-full opacity-[0.03] select-none pointer-events-none group-hover:scale-110 transition-transform duration-[2s]">
                   <Rocket size={400} className="translate-x-32" />
                </div>
             </div>

             <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-black p-12 rounded-[3.5rem] flex flex-col justify-between text-white shadow-2xl relative overflow-hidden group border border-indigo-500/10">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                <div>
                   <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-8 border border-white/10">
                      <CreditCard size={24} className="text-indigo-400" />
                   </div>
                   {user.stripeAccountId ? (
                     <>
                       <h3 className="text-2xl font-black mb-4 tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">Stripe Connected</h3>
                       <p className="text-gray-400 font-bold text-sm leading-relaxed mb-6">
                         Your account is linked and ready to accept donations. Payments will flow directly into your connected Stripe account.
                       </p>
                       <div className="p-4 bg-slate-900/60 rounded-2xl border border-white/5 font-mono text-[10px] text-slate-400 mb-2 truncate">
                         ID: {user.stripeAccountId}
                       </div>
                     </>
                   ) : (
                     <>
                       <h3 className="text-2xl font-black mb-4 tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">Stripe Connect</h3>
                       <p className="text-gray-400 font-bold text-sm leading-relaxed">
                         Connect your Stripe account to enable live donations. Keep 95% of what you raise with our flat 5% platform fee.
                       </p>
                     </>
                   )}
                </div>
                {user.stripeAccountId ? (
                  <div className="w-full py-4 text-center bg-green-500/10 border border-green-500/20 text-green-400 rounded-2xl font-black text-xs uppercase tracking-[0.2em] cursor-default">
                     ✅ Linked
                  </div>
                ) : (
                  <a
                    href={stripeClientId ? `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${stripeClientId}&scope=read_write&state=${encodeURIComponent(window.location.pathname)}&redirect_uri=${window.location.origin}/stripe-callback` : '#'}
                    onClick={(e) => {
                      if (!stripeClientId) {
                        e.preventDefault();
                        alert("Stripe is not configured yet. Please wait or verify your server configuration.");
                      }
                    }}
                    className="w-full py-5 text-center bg-white text-black hover:bg-indigo-400 hover:text-black rounded-2xl font-black transition-all text-xs uppercase tracking-[0.2em] shadow-lg block cursor-pointer"
                  >
                     Connect Stripe
                  </a>
                )}
             </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
             <div className="lg:col-span-2 space-y-12">
                <div>
                   <h3 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-4">
                      <div className="w-2 h-8 bg-yellow-500 rounded-full" />
                      Active Campaigns
                   </h3>
                   {loading ? (
                     <div className="bg-white rounded-[2.5rem] p-12 border border-gray-100 shadow-sm flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
                     </div>
                   ) : campaigns.length > 0 ? (
                     <div className="grid gap-8">
                       {campaigns.map((campaign) => (
                         <div 
                           key={campaign._id} 
                           className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-6 relative overflow-hidden group"
                         >
                           {/* Card Header: Type Badge & Status indicator */}
                           <div className="flex justify-between items-center">
                             <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                               campaign.campaignType === 'reward' ? 'bg-blue-50 text-blue-600' :
                               campaign.campaignType === 'donation' ? 'bg-emerald-50 text-emerald-600' :
                               'bg-indigo-50 text-indigo-600'
                             }`}>
                               {campaign.campaignType}
                             </span>
                             
                             <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-50 border border-gray-100 rounded-full">
                               <span className={`w-1.5 h-1.5 rounded-full ${
                                 campaign.status === 'active' ? 'bg-green-500 animate-pulse' :
                                 campaign.status === 'draft' ? 'bg-gray-400' : 'bg-yellow-500'
                               }`} />
                               <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">{campaign.status}</span>
                             </div>
                           </div>

                           {/* Card Body: Info & Live Site */}
                           <div className="space-y-4">
                             <div>
                               <h4 className="text-xl font-black text-gray-900 leading-tight mb-1">{campaign.campaignName}</h4>
                               <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                 {campaign.businessInfo?.businessName || 'No Business Profile linked'}
                               </span>
                             </div>

                             {/* Website link preview box */}
                             {campaign.status === "active" && (
                               <div className="p-4 bg-slate-50 rounded-2xl border border-gray-100 space-y-2">
                                 <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider block">Live Destination Link</span>
                                 {campaign.abTestingEnabled ? (
                                   <div className="flex flex-col sm:flex-row gap-3">
                                     <a
                                       href={`${window.location.origin}/live/${campaign._id}/a`}
                                       target="_blank"
                                       rel="noopener noreferrer"
                                       className="px-3 py-1.5 bg-white border border-gray-150 rounded-xl text-[10px] font-black text-blue-600 hover:text-blue-700 transition-colors uppercase tracking-wide flex items-center gap-1 shadow-sm cursor-pointer"
                                     >
                                       🌐 Version A
                                     </a>
                                     <a
                                       href={`${window.location.origin}/live/${campaign._id}/b`}
                                       target="_blank"
                                       rel="noopener noreferrer"
                                       className="px-3 py-1.5 bg-white border border-gray-150 rounded-xl text-[10px] font-black text-indigo-600 hover:text-indigo-700 transition-colors uppercase tracking-wide flex items-center gap-1 shadow-sm cursor-pointer"
                                     >
                                       🌐 Version B
                                     </a>
                                   </div>
                                 ) : (
                                   <a
                                     href={`${window.location.origin}/live/${campaign._id}`}
                                     target="_blank"
                                     rel="noopener noreferrer"
                                     className="inline-flex px-3 py-1.5 bg-white border border-gray-150 rounded-xl text-[10px] font-black text-yellow-600 hover:text-yellow-700 transition-colors uppercase tracking-wide items-center gap-1 shadow-sm cursor-pointer"
                                   >
                                     🌐 Live Website
                                   </a>
                                 )}
                               </div>
                             )}
                           </div>

                           {/* Card Footer Actions Panel */}
                           <div className="pt-6 border-t border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                             {/* Gated Donate/Payment Toggle */}
                             <div className="flex items-center gap-3 bg-gray-50 px-4 py-2.5 rounded-2xl border border-gray-100 w-fit">
                               <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Accept Donations</span>
                               <button
                                 id={`togglePayment-${campaign._id}`}
                                 type="button"
                                 onClick={() => handleTogglePayment(campaign._id, campaign.paymentOptionActive)}
                                 className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                   campaign.paymentOptionActive ? 'bg-yellow-500' : 'bg-gray-250'
                                 }`}
                               >
                                 <span
                                   className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                     campaign.paymentOptionActive ? 'translate-x-5' : 'translate-x-0'
                                   }`}
                                 />
                               </button>
                             </div>

                             <div className="flex items-center gap-2 justify-end">
                               <button
                                 id={`aiAssistant-${campaign._id}`}
                                 onClick={() => {
                                   if (user.isSubscribed && user.adminApprovalStatus !== 'approved') {
                                     alert("Your account is currently under review by our admin team. AI tools unlock after approval.");
                                     return;
                                   }
                                   navigate(`/dashboard/campaign/${campaign._id}/ai`);
                                 }}
                                 className="px-4 py-3 bg-yellow-50 text-yellow-700 rounded-xl hover:bg-yellow-100 transition-all active:scale-95 flex items-center gap-2 font-black text-[10px] uppercase tracking-wider cursor-pointer"
                                 title="Campaign AI Assistant"
                               >
                                 <Sparkles size={16} /> AI
                               </button>
                               {campaign.status === "active" && (
                                 <button
                                   id={`promoteCampaign-${campaign._id}`}
                                   onClick={() => navigate(`/dashboard/campaign/${campaign._id}/promote`)}
                                   className="px-4 py-3 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 hover:text-indigo-700 transition-all active:scale-95 flex items-center gap-2 font-black text-[10px] uppercase tracking-wider cursor-pointer"
                                   title="Promote with Ads"
                                 >
                                   <Rocket size={16} /> Promote
                                 </button>
                               )}
                               <button
                                 id={`deleteCampaign-${campaign._id}`}
                                 onClick={() => handleDeleteCampaign(campaign._id, campaign.campaignName)}
                                 className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 hover:text-red-650 transition-all active:scale-95 cursor-pointer"
                                 title="Delete Campaign"
                               >
                                 <Trash2 size={16} />
                               </button>
                               <button 
                                 id={`editCampaignBuilder-${campaign._id}`}
                                 onClick={() => handleEditCampaign(campaign)}
                                 className="p-3 bg-gray-900 text-white rounded-xl hover:bg-black transition-all cursor-pointer flex items-center gap-2 font-black text-[10px] uppercase tracking-wider"
                                 title="Edit campaign"
                               >
                                 Manage <ArrowRight size={16} />
                               </button>
                             </div>
                           </div>
                         </div>
                       ))}
                     </div>
                   ) : (
                     <div className="bg-white rounded-[2.5rem] p-12 border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
                        <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center text-gray-200 mb-6">
                           <BarChart3 size={40} />
                        </div>
                        <h4 className="text-xl font-black text-gray-900 mb-2">No active campaigns yet</h4>
                        <p className="text-gray-400 font-bold text-sm max-w-xs mb-8">Ready to launch? Start by choosing your campaign type above.</p>
                        <button 
                          onClick={() => navigate('/dashboard/campaign/create')}
                          className="text-xs font-black text-yellow-600 uppercase tracking-widest hover:text-yellow-700 transition-colors cursor-pointer"
                        >
                          Launch First Campaign →
                        </button>
                     </div>
                   )}
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                   <div className="bg-gray-900 text-white p-10 rounded-[2.5rem] space-y-6 shadow-xl relative overflow-hidden group">
                      <div className="w-12 h-12 bg-yellow-400 rounded-2xl flex items-center justify-center text-black mb-2 shadow-lg">
                        <NotebookPen size={24} />
                      </div>
                      <h4 className="font-black text-xl tracking-tighter">Storytelling is key</h4>
                      <p className="text-gray-400 font-bold text-sm leading-relaxed">Successful campaigns often have a strong personal narrative. Make sure to clearly explain the "Why" behind your project.</p>
                      <button className="flex items-center gap-2 text-yellow-400 text-xs font-black uppercase tracking-[0.2em] pt-4 group-hover:gap-4 transition-all cursor-pointer">
                        Learn more <ArrowRight size={14} />
                      </button>
                   </div>

                   <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 space-y-6 shadow-sm">
                      <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-900 mb-2">
                        <ShieldCheck size={24} />
                      </div>
                      <h4 className="font-black text-xl tracking-tighter text-gray-900">Security & Trust</h4>
                      <p className="text-gray-400 font-bold text-sm leading-relaxed">Verify your business identity to increase backer trust and unlock higher funding limits.</p>
                      <button className="flex items-center gap-2 text-gray-900 text-xs font-black uppercase tracking-[0.2em] pt-4 hover:gap-4 transition-all cursor-pointer">
                        Get Verified <ArrowRight size={14} />
                      </button>
                   </div>
                </div>
             </div>

             <div className="space-y-8">
                {/* Google Ads Integration Card */}
                <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
                   <h3 className="text-xl font-black text-gray-900 flex items-center gap-3 uppercase tracking-tight">
                      <Megaphone className="text-indigo-600" size={20} /> Google Ads Integration
                   </h3>
                   
                   {user.googleAdAccountId ? (
                     <div className="space-y-4">
                       <div className="flex items-center gap-2 text-green-600 font-bold text-xs uppercase tracking-widest">
                          <CheckCircle2 size={16} /> Google Ads Linked
                       </div>
                       <p className="text-gray-400 font-bold text-xs leading-relaxed">
                          Your workspace is linked to Google Ad Account:
                       </p>
                       <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 font-mono text-xs text-gray-600 truncate">
                          ID: {user.googleAdAccountId.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')}
                       </div>
                       <button
                         onClick={handleConnectGoogleAds}
                         className="w-full py-3 bg-gray-900 text-white hover:bg-black rounded-xl font-black text-[10px] uppercase tracking-widest transition-all cursor-pointer"
                       >
                          Switch Account
                       </button>
                     </div>
                   ) : user.googleRefreshToken ? (
                     <div className="space-y-4">
                       <p className="text-gray-400 font-bold text-xs leading-relaxed">
                          OAuth authenticated. Select which Customer ID to use for running search ads:
                       </p>
                       {loadingAccounts ? (
                         <div className="text-center py-2 text-xs font-bold text-gray-400">Loading your ad accounts...</div>
                       ) : googleAccounts.length > 0 ? (
                         <div className="space-y-4">
                           <select
                             value={selectedAccount}
                             onChange={(e) => setSelectedAccount(e.target.value)}
                             className="w-full px-4 py-3 border border-gray-200 rounded-xl font-bold text-sm focus:border-yellow-500 focus:outline-none"
                           >
                             {googleAccounts.map((acc) => (
                               <option key={acc} value={acc}>
                                 {acc.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')}
                               </option>
                             ))}
                           </select>
                           <button
                             onClick={handleLinkGoogleAccount}
                             className="w-full py-3 bg-yellow-500 text-black hover:bg-yellow-600 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all cursor-pointer"
                           >
                              Confirm Link Account
                           </button>
                         </div>
                       ) : (
                         <div className="space-y-4">
                           <p className="text-red-500 text-xs font-bold">No active Google Ads accounts found. Make sure billing is setup in your Google Ads account.</p>
                           <button
                             onClick={handleConnectGoogleAds}
                             className="w-full py-3 bg-gray-900 text-white hover:bg-black rounded-xl font-black text-[10px] uppercase tracking-widest transition-all cursor-pointer"
                           >
                              Retry Connection
                           </button>
                         </div>
                       )}
                       {adMsg && <p className="text-green-600 text-xs font-bold text-center mt-2">{adMsg}</p>}
                     </div>
                   ) : (
                     <div className="space-y-4">
                       <p className="text-gray-400 font-bold text-xs leading-relaxed">
                          Link your Google Ads account to launch search campaigns directly targeting your published landing pages.
                       </p>
                       <button
                         onClick={handleConnectGoogleAds}
                         className="w-full py-3 bg-indigo-600 text-white hover:bg-indigo-750 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all cursor-pointer"
                       >
                          Connect Google Ads
                       </button>
                     </div>
                   )}
                </div>

                {/* Meta Ads Integration Card */}
                <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
                   <h3 className="text-xl font-black text-gray-900 flex items-center gap-3 uppercase tracking-tight">
                      <Megaphone className="text-indigo-600" size={20} /> Meta Ads Integration
                   </h3>
                   
                   {user.metaAdAccountId ? (
                     <div className="space-y-4">
                       <div className="flex items-center gap-2 text-green-600 font-bold text-xs uppercase tracking-widest">
                          <CheckCircle2 size={16} /> Meta Ads Linked
                       </div>
                       <p className="text-gray-400 font-bold text-xs leading-relaxed">
                          Your workspace is linked to Meta Ad Account:
                       </p>
                       <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 font-mono text-xs text-gray-600 truncate">
                          ID: {user.metaAdAccountId}
                       </div>
                       <button
                         onClick={handleConnectMetaAds}
                         className="w-full py-3 bg-gray-900 text-white hover:bg-black rounded-xl font-black text-[10px] uppercase tracking-widest transition-all cursor-pointer"
                       >
                          Switch Account
                       </button>
                     </div>
                   ) : user.metaAccessToken ? (
                     <div className="space-y-4">
                       <p className="text-gray-400 font-bold text-xs leading-relaxed">
                          OAuth authenticated. Select which Meta Ad Account to use:
                       </p>
                       {loadingMetaAccounts ? (
                         <div className="text-center py-2 text-xs font-bold text-gray-400">Loading your ad accounts...</div>
                       ) : metaAccounts.length > 0 ? (
                         <div className="space-y-4">
                           <select
                             value={selectedMetaAccount}
                             onChange={(e) => setSelectedMetaAccount(e.target.value)}
                             className="w-full px-4 py-3 border border-gray-200 rounded-xl font-bold text-sm focus:border-yellow-500 focus:outline-none"
                           >
                             {metaAccounts.map((acc) => (
                               <option key={acc.id} value={acc.id}>
                                 {acc.name} ({acc.id})
                               </option>
                             ))}
                           </select>
                           <button
                             onClick={handleLinkMetaAccount}
                             className="w-full py-3 bg-yellow-500 text-black hover:bg-yellow-600 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all cursor-pointer"
                           >
                              Confirm Link Account
                           </button>
                         </div>
                       ) : (
                         <div className="space-y-4">
                           <p className="text-red-500 text-xs font-bold">No active Meta Ad accounts found. Make sure billing is setup in your Meta Ads Manager.</p>
                           <button
                             onClick={handleConnectMetaAds}
                             className="w-full py-3 bg-gray-900 text-white hover:bg-black rounded-xl font-black text-[10px] uppercase tracking-widest transition-all cursor-pointer"
                           >
                              Retry Connection
                           </button>
                         </div>
                       )}
                       {metaMsg && <p className="text-green-600 text-xs font-bold text-center mt-2">{metaMsg}</p>}
                     </div>
                   ) : (
                     <div className="space-y-4">
                       <p className="text-gray-400 font-bold text-xs leading-relaxed">
                          Link your Meta Ads account to launch Facebook/Instagram campaigns directly targeting your published landing pages.
                       </p>
                       <button
                         onClick={handleConnectMetaAds}
                         className="w-full py-3 bg-blue-600 text-white hover:bg-blue-700 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all cursor-pointer"
                       >
                          Connect Meta Ads
                       </button>
                     </div>
                   )}
                </div>

                {/* Statistics Card (Horizontal Content layout) */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                   <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3 uppercase tracking-tight">
                      Statistics
                   </h3>
                   <div className="grid grid-cols-3 gap-4">
                      {/* Followers */}
                      <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col justify-between h-28">
                        <div>
                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider mb-1">Followers</p>
                          <p className="text-lg font-black text-gray-900 leading-none">2,481</p>
                        </div>
                        <div className="px-1.5 py-0.5 bg-green-100 text-green-600 rounded text-[8px] font-black w-fit">+12%</div>
                      </div>
                      
                      {/* Views */}
                      <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col justify-between h-28">
                        <div>
                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider mb-1">Views</p>
                          <p className="text-lg font-black text-gray-900 leading-none">12.5K</p>
                        </div>
                        <div className="px-1.5 py-0.5 bg-green-100 text-green-600 rounded text-[8px] font-black w-fit">+8%</div>
                      </div>

                      {/* Engagement */}
                      <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col justify-between h-28">
                        <div>
                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider mb-1">Engagement</p>
                          <p className="text-lg font-black text-gray-900 leading-none">84%</p>
                        </div>
                        <div className="px-1.5 py-0.5 bg-yellow-100 text-yellow-600 rounded text-[8px] font-black w-fit">Stable</div>
                      </div>
                   </div>
                   
                   <div className="mt-6 pt-6 border-t border-gray-50">
                      <button className="w-full py-4 bg-gray-50 hover:bg-gray-100 text-gray-900 rounded-2xl font-black text-xs uppercase tracking-widest transition-all cursor-pointer">
                        View Detailed Reports
                      </button>
                   </div>
                </div>

                {/* Subscribed/Upgrade block */}
                {user.isSubscribed ? (
                  <div className="p-1 bg-gradient-to-br from-indigo-500 to-purple-650 rounded-[2.5rem]">
                     <div className="bg-white p-10 rounded-[2.2rem] text-center space-y-4">
                        <Sparkles size={32} className="mx-auto text-indigo-600 mb-2" fill="currentColor" />
                        <h4 className="font-black text-lg text-gray-900 leading-tight">Premium Active</h4>
                        <p className="text-gray-400 font-bold text-xs px-2 leading-relaxed">
                          All templates, search indexing, custom meta tags, and A/B split-tests are fully unlocked.
                        </p>
                        <button 
                          onClick={() => navigate('/dashboard/profile')}
                          className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:shadow-xl transition-all cursor-pointer"
                        >
                          View Subscription
                        </button>
                     </div>
                  </div>
                 ) : (
                  <div className="p-1 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-[2.5rem]">
                     <div className="bg-white p-10 rounded-[2.2rem] text-center">
                        <Star size={32} className="mx-auto text-yellow-500 mb-4" fill="currentColor" />
                        <h4 className="font-black text-lg text-gray-900 mb-2">Try Premium Builder</h4>
                        <p className="text-gray-400 font-bold text-xs mb-6 px-4">Unlock advanced drag & drop sections and custom SEO slugs.</p>
                        <button 
                          onClick={() => navigate('/pricing')}
                          className="w-full py-4 bg-yellow-500 text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:shadow-xl transition-all cursor-pointer"
                        >
                          Upgrade Now
                        </button>
                     </div>
                  </div>
                 )}
             </div>
          </div>
       </main>
    </div>
  );
};
