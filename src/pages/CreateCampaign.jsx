import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { ChevronDown, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { sanitizeBusinessText } from '../utils/formInput';
import { fetchEntitlements, handlePlanGateError } from '../utils/entitlements';
import { canCreateCampaign, isUnlimitedCampaigns } from '../utils/plans';
import { goToPricing } from '../utils/pricingNavigation';

export default function CreateCampaign() {
  const navigate = useNavigate();
  const location = useLocation();
  const [campaignName, setCampaignName] = useState('');
  const [businessProfile, setBusinessProfile] = useState('');
  const [businessProfiles, setBusinessProfiles] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [entitlements, setEntitlements] = useState(null);
  const [loadingEntitlements, setLoadingEntitlements] = useState(true);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await api.get('/campaigns/business-profiles');
        if (response.data.success) {
          setBusinessProfiles(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching business profiles:', error);
      }
    };
    fetchProfiles();
  }, []);

  useEffect(() => {
    const loadEntitlements = async () => {
      setLoadingEntitlements(true);
      try {
        const data = await fetchEntitlements();
        setEntitlements(data);
      } catch (err) {
        console.error('Failed to load entitlements:', err);
      } finally {
        setLoadingEntitlements(false);
      }
    };
    loadEntitlements();
  }, []);

  const selectedBusiness = businessProfiles.find(b => b.id === businessProfile);
  const allowed = canCreateCampaign(entitlements);
  const remaining = entitlements?.usage?.campaignsRemaining;
  const unlimited = isUnlimitedCampaigns(entitlements);

  const handleContinue = async (e) => {
    e.preventDefault();
    if (!campaignName.trim() || !businessProfile) return;

    if (!allowed) {
      toast.error(
        entitlements?.isSubscribed || entitlements?.isTrialing
          ? 'Campaign limit reached. Upgrade your plan to create more.'
          : 'An active plan is required to create campaigns.'
      );
      goToPricing(navigate, location);
      return;
    }

    setLoading(true);
    try {
      const businessId = businessProfile === 'new' ? null : businessProfile;

      const response = await api.post('/campaigns/create', {
        campaignName: campaignName.trim(),
        businessProfileId: businessId
      });

      if (response.data.success) {
        navigate('/dashboard/campaign/select-type', {
          state: {
            campaignId: response.data.data.campaignId,
            campaignName: campaignName.trim(),
            hasBusinessInfo: response.data.data.hasBusinessInfo
          },
        });
      }
    } catch (error) {
      console.error('Error creating campaign:', error);
      if (!handlePlanGateError(error, { navigate, location })) {
        toast.error(error.response?.data?.message || 'Failed to create campaign');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-end">
          <Link
            to="/contact"
            className="text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
          >
            Get Support
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-6">
        <nav className="flex items-center gap-2 text-sm font-medium text-gray-400">
          <Link to="/dashboard" className="hover:text-gray-700 transition-colors">
            Dashboard
          </Link>
          <span className="text-gray-300">&gt;</span>
          <span className="text-yellow-600 font-semibold">Create New Campaign</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16 flex flex-col items-center">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-3">
            Create New Campaign
          </h1>
          <p className="text-gray-400 font-medium text-base">
            Set up a campaign to launch, test, or fund your business idea.
          </p>
          {!loadingEntitlements && entitlements && (
            <p className="mt-3 text-sm font-semibold text-gray-600">
              {unlimited
                ? 'Unlimited campaigns on your plan'
                : typeof remaining === 'number'
                  ? `${remaining} campaign${remaining === 1 ? '' : 's'} remaining on your plan`
                  : entitlements.isSubscribed
                    ? 'Check your plan limits on Profile'
                    : 'Subscribe to create campaigns'}
            </p>
          )}
        </div>

        {!loadingEntitlements && !allowed && (
          <div className="w-full max-w-lg mb-6 rounded-2xl border border-amber-200 bg-yellow-50 p-5 text-center">
            <p className="text-sm font-semibold text-gray-800 mb-3">
              {entitlements?.isSubscribed
                ? "You've hit your campaign limit for this plan."
                : 'An active SaaS plan is required to create campaigns.'}
            </p>
            <button
              type="button"
              onClick={() => goToPricing(navigate, location)}
              className="px-6 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-black text-sm font-bold rounded-full"
            >
              Upgrade Plan
            </button>
          </div>
        )}

        <div className="w-full max-w-lg bg-gray-50 border border-gray-200 rounded-2xl p-8 shadow-sm">
          <form onSubmit={handleContinue} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Campaign Name
              </label>
              <input
                id="campaign-name"
                type="text"
                maxLength={120}
                placeholder="Enter your campaign name"
                value={campaignName}
                onChange={e => setCampaignName(sanitizeBusinessText(e.target.value))}
                required
                disabled={!allowed && !loadingEntitlements}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all text-gray-800 font-medium placeholder-gray-300 text-sm disabled:opacity-60"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Business Profile
              </label>
              <div className="relative">
                <button
                  type="button"
                  id="business-profile-select"
                  onClick={() => setDropdownOpen(prev => !prev)}
                  disabled={!allowed && !loadingEntitlements}
                  className={`w-full px-4 py-3 rounded-lg border bg-white outline-none text-left text-sm font-medium transition-all flex items-center justify-between disabled:opacity-60 ${
                    dropdownOpen
                      ? 'border-yellow-400 ring-2 ring-yellow-400/50'
                      : 'border-gray-200 hover:border-gray-300'
                  } ${selectedBusiness ? 'text-gray-800' : 'text-gray-300'}`}
                >
                  <span>
                    {businessProfile === 'new'
                      ? 'Create New Business...'
                      : selectedBusiness
                      ? selectedBusiness.name
                      : '-- Select business you want to promote --'}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`text-gray-400 transition-transform duration-200 ${
                      dropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {dropdownOpen && (
                  <div className="absolute z-20 top-full mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                    <button
                      type="button"
                      onClick={() => {
                        setBusinessProfile('new');
                        setDropdownOpen(false);
                      }}
                      className={`w-full px-4 py-3 text-left text-sm font-black transition-colors hover:bg-yellow-50 hover:text-yellow-700 border-b border-gray-100 flex items-center gap-2 ${
                        businessProfile === 'new'
                          ? 'bg-yellow-50 text-yellow-700'
                          : 'text-yellow-600'
                      }`}
                    >
                      <Plus size={16} strokeWidth={3} /> Create New Business Profile
                    </button>

                    {businessProfiles.map(bp => (
                      <button
                        key={bp.id}
                        type="button"
                        onClick={() => {
                          setBusinessProfile(bp.id);
                          setDropdownOpen(false);
                        }}
                        className={`w-full px-4 py-3 text-left text-sm font-medium transition-colors hover:bg-yellow-50 hover:text-yellow-700 ${
                          businessProfile === bp.id
                            ? 'bg-yellow-50 text-yellow-700'
                            : 'text-gray-700'
                        }`}
                      >
                        {bp.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !campaignName.trim() || !businessProfile || !allowed}
              className={`w-full py-3 rounded-full font-bold text-sm tracking-wide transition-all shadow-md active:scale-95 ${
                campaignName.trim() && businessProfile && allowed && !loading
                  ? 'bg-yellow-600 hover:bg-yellow-700 text-white cursor-pointer'
                  : 'bg-yellow-300 text-white cursor-not-allowed opacity-60'
              }`}
            >
              {loading ? 'Creating…' : 'Continue'}
            </button>

            <div className="text-center">
              <Link
                to="/dashboard"
                className="text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors"
              >
                ← Back to Dashboard
              </Link>
            </div>
          </form>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 to-yellow-600" />
    </div>
  );
}
