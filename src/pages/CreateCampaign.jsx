import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronDown, Plus } from 'lucide-react';
import api from '../api/axios';

export default function CreateCampaign() {
  const navigate = useNavigate();
  const [campaignName, setCampaignName] = useState('');
  const [businessProfile, setBusinessProfile] = useState('');
  const [businessProfiles, setBusinessProfiles] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const selectedBusiness = businessProfiles.find(b => b.id === businessProfile);

  const handleContinue = async (e) => {
    e.preventDefault();
    if (!campaignName.trim() || !businessProfile) return;
    
    setLoading(true);
    try {
      // If "new" is selected, we pass null as businessProfileId to backend
      const businessId = businessProfile === 'new' ? null : businessProfile;
      
      const response = await api.post('/campaigns/create', {
        campaignName: campaignName.trim(),
        businessProfileId: businessId
      });

      if (response.data.success) {
        // Pass the collected data forward to the Campaign Type Selection step
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
      alert(error.response?.data?.message || 'Failed to create campaign');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Top bar */}
      <div className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-end">
          <button className="text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors">
            Get Support
          </button>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 pt-6">
        <nav className="flex items-center gap-2 text-sm font-medium text-gray-400">
          <Link to="/dashboard" className="hover:text-gray-700 transition-colors">
            Dashboard
          </Link>
          <span className="text-gray-300">&gt;</span>
          <span className="text-yellow-600 font-semibold">Create New Campaign</span>
        </nav>
      </div>

      {/* Page content */}
      <div className="max-w-7xl mx-auto px-6 py-16 flex flex-col items-center">
        {/* Heading */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-3">
            Create New Campaign
          </h1>
          <p className="text-gray-400 font-medium text-base">
            Set up a campaign to launch, test, or fund your business idea.
          </p>
        </div>

        {/* Card */}
        <div className="w-full max-w-lg bg-gray-50 border border-gray-200 rounded-2xl p-8 shadow-sm">
          <form onSubmit={handleContinue} className="space-y-6">
            {/* Campaign Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Campaign Name
              </label>
              <input
                id="campaign-name"
                type="text"
                placeholder="Enter your campaign name"
                value={campaignName}
                onChange={e => setCampaignName(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all text-gray-800 font-medium placeholder-gray-300 text-sm"
              />
            </div>

            {/* Business Profile */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Business Profile
              </label>
              <div className="relative">
                <button
                  type="button"
                  id="business-profile-select"
                  onClick={() => setDropdownOpen(prev => !prev)}
                  className={`w-full px-4 py-3 rounded-lg border bg-white outline-none text-left text-sm font-medium transition-all flex items-center justify-between ${
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

                {/* Dropdown list */}
                {dropdownOpen && (
                  <div className="absolute z-20 top-full mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-1">
                    {/* Add New Business Option */}
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

            {/* Continue button */}
            <button
              type="submit"
              disabled={!campaignName.trim() || !businessProfile}
              className={`w-full py-3 rounded-full font-bold text-sm tracking-wide transition-all shadow-md active:scale-95 ${
                campaignName.trim() && businessProfile
                  ? 'bg-yellow-600 hover:bg-yellow-700 text-white cursor-pointer'
                  : 'bg-yellow-300 text-white cursor-not-allowed opacity-60'
              }`}
            >
              Continue
            </button>

            {/* Back link */}
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

      {/* Bottom accent bar */}
      <div className="fixed bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 to-yellow-600" />
    </div>
  );
}
