import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import api from '../api/axios';

export default function ReviewSubmitCampaign() {
  const navigate = useNavigate();
  const location = useLocation();
  const [campaignData, setCampaignData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  const campaignId = location.state?.campaignId;
  const activeType = location.state?.campaignType || 'reward';

  React.useEffect(() => {
    const fetchReviewData = async () => {
      if (!campaignId) {
        setLoading(false);
        return;
      }
      try {
        const response = await api.get(`/campaigns/${campaignId}/review`);
        if (response.data.success) {
          setCampaignData(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching review data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchReviewData();
  }, [campaignId]);

  const campaignConfig = campaignData?.campaignConfig || location.state?.campaignConfig || {};

  const formatType = (type) => {
    if (type === 'reward') return 'Reward Crowdfunding';
    if (type === 'investment') return 'Investment Crowdfunding';
    if (type === 'donation') return 'Donation / Non-Profit';
    return type;
  };

  const handleEdit = () => {
    navigate('/dashboard/campaign/configure', { state: location.state });
  };

  const handleSubmit = async () => {
    try {
      const campaignId = location.state?.campaignId;
      if (!campaignId) throw new Error('Campaign ID not found');

      const response = await api.put(`/campaigns/${campaignId}/submit`);

      if (response.data.success) {
        navigate('/dashboard/campaign/ready', { state: location.state });
      }
    } catch (error) {
      console.error('Error submitting campaign:', error);
      alert(error.response?.data?.message || 'Failed to submit campaign');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  const businessInfo = campaignData?.businessInfo || location.state?.businessInfo || {};

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

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-12">
          <Link to="/dashboard" className="hover:text-gray-700 transition-colors">Dashboard</Link>
          <span>&gt;</span>
          <span className="text-yellow-600 font-semibold">Submit Campaign Details</span>
        </nav>

        <div className="text-center mb-16">
          <h1 className="text-4xl font-black text-gray-900 mb-3 tracking-tight">
            Review & Submit Campaign
          </h1>
          <p className="text-gray-500 font-medium text-lg">
            Confirm all details for <strong className="text-gray-900">{formatType(activeType)}</strong> before generating your campaign page.
          </p>
        </div>

        <div className="space-y-12">
          {/* Campaign Basics */}
          <div>
            <div className="flex items-center gap-4 mb-6">
              <h2 className="text-xl font-bold text-yellow-600">Campaign Basics</h2>
              <div className="h-px flex-1 bg-gray-100" />
            </div>
            <div className="grid md:grid-cols-2 gap-6 bg-gray-50/50 rounded-2xl p-8 border border-gray-100">
              <div>
                <p className="text-sm font-black text-gray-900 mb-1">Campaign Name</p>
                <p className="text-sm text-gray-500 font-medium">{campaignData?.campaignName || campaignConfig.basics?.name || 'Lorem Ipsum'}</p>
              </div>
              <div>
                <p className="text-sm font-black text-gray-900 mb-1">Campaign Category</p>
                <p className="text-sm text-gray-500 font-medium">{campaignConfig.basics?.category || '-- Choose Category --'}</p>
              </div>
              <div className="md:col-span-2 mt-4">
                <p className="text-sm font-black text-gray-900 mb-1">Short Tagline</p>
                <p className="text-sm text-gray-500 font-medium">{campaignConfig.basics?.tagline || 'A one-line pitch to attract supporters.'}</p>
              </div>
            </div>
          </div>

          {/* Business Information */}
          <div>
            <div className="flex items-center gap-4 mb-6">
              <h2 className="text-xl font-bold text-yellow-600">Business Details</h2>
              <div className="h-px flex-1 bg-gray-100" />
            </div>
            <div className="grid md:grid-cols-2 gap-6 bg-gray-50/50 rounded-2xl p-8 border border-gray-100">
              <div>
                <p className="text-sm font-black text-gray-900 mb-1">Business Name</p>
                <p className="text-sm text-gray-500 font-medium">{businessInfo.businessName}</p>
              </div>
              <div>
                <p className="text-sm font-black text-gray-900 mb-1">Email</p>
                <p className="text-sm text-gray-500 font-medium">{businessInfo.email}</p>
              </div>
            </div>
          </div>

          {/* Funding Goal & Timeline */}
          <div>
            <div className="flex items-center gap-4 mb-6">
              <h2 className="text-xl font-bold text-yellow-600">Funding Goal & Timeline</h2>
              <div className="h-px flex-1 bg-gray-100" />
            </div>
            <div className="grid md:grid-cols-2 gap-6 bg-gray-50/50 rounded-2xl p-8 border border-gray-100">
              <div>
                <p className="text-sm font-black text-gray-900 mb-1">Funding Goal</p>
                <p className="text-sm text-gray-500 font-medium">{campaignConfig.basics?.goal ? `$${campaignConfig.basics.goal}` : 'How much do you want to raise?'}</p>
              </div>
              <div>
                <p className="text-sm font-black text-gray-900 mb-1">Campaign Duration</p>
                <p className="text-sm text-gray-500 font-medium">
                  {campaignConfig.basics?.duration === 36500 || campaignConfig.basics?.duration === '36500'
                    ? 'Always Open'
                    : campaignConfig.basics?.duration
                      ? `${campaignConfig.basics.duration} Days`
                      : '-- Choose Duration --'}
                </p>
              </div>
              {activeType !== 'investment' && (
                <div className="mt-4">
                  <p className="text-sm font-black text-gray-900 mb-1">Campaign Start Date</p>
                  <p className="text-sm text-gray-500 font-medium">
                    {campaignConfig.basics?.startDate 
                      ? new Date(campaignConfig.basics.startDate).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        }) 
                      : 'DD - MM - YYYY'}
                  </p>
                </div>
              )}
              <div className="mt-4">
                <p className="text-sm font-black text-gray-900 mb-1">Accepting Donations / Payments</p>
                <div className="mt-1">
                  {campaignData?.paymentOptionActive ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800">
                      Enabled
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-800">
                      Disabled
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Reward Tiers / Specific section based on type */}
          {activeType === 'reward' && (
            <div>
              <div className="flex items-center gap-4 mb-6">
                <h2 className="text-xl font-bold text-yellow-600">Reward Tiers</h2>
                <div className="h-px flex-1 bg-gray-100" />
              </div>
              {(campaignConfig.rewards?.length > 0 && campaignConfig.rewards[0].title) ? (
                campaignConfig.rewards.map((reward, i) => (
                  <div key={i} className="grid md:grid-cols-2 gap-6 bg-gray-50/50 rounded-2xl p-8 border border-gray-100 mb-4">
                    <div>
                      <p className="text-sm font-black text-gray-900 mb-1">Reward Title</p>
                      <p className="text-sm text-gray-500 font-medium">{reward.title}</p>
                    </div>
                    <div>
                      <p className="text-sm font-black text-gray-900 mb-1">Contribution Amount</p>
                      <p className="text-sm text-gray-500 font-medium">{reward.amount}</p>
                    </div>
                    <div className="md:col-span-2 mt-4">
                      <p className="text-sm font-black text-gray-900 mb-1">Reward Description</p>
                      <p className="text-sm text-gray-500 font-medium leading-relaxed">{reward.description}</p>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm font-black text-gray-900 mb-1">Delivery Date</p>
                      <p className="text-sm text-gray-500 font-medium">{reward.delivery || 'DD - MM - YYYY'}</p>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm font-black text-gray-900 mb-1">Quantity Limit</p>
                      <p className="text-sm text-gray-500 font-medium">{reward.quantity}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-gray-50/50 rounded-2xl p-8 border border-gray-100 text-center text-gray-400 font-medium italic">
                  No reward tiers added.
                </div>
              )}
            </div>
          )}

          {/* Media & Story */}
          <div>
            <div className="flex items-center gap-4 mb-6">
              <h2 className="text-xl font-bold text-yellow-600">Media & Story</h2>
              <div className="h-px flex-1 bg-gray-100" />
            </div>
            <div className="bg-gray-50/50 rounded-2xl p-8 border border-gray-100 space-y-6">
              <div>
                <p className="text-sm font-black text-gray-900 mb-1">Cover Image</p>
                <p className="text-sm text-gray-500 font-medium">{campaignConfig.coverImage ? 'Image Uploaded' : 'No image uploaded'}</p>
              </div>
              <div>
                <p className="text-sm font-black text-gray-900 mb-1">Video URL</p>
                <p className="text-sm text-gray-500 font-medium">{campaignConfig.videoUrl || 'No video URL provided'}</p>
              </div>
              <div>
                <p className="text-sm font-black text-gray-900 mb-1">Brief Story</p>
                <p className="text-sm text-gray-500 font-medium leading-relaxed">
                  {campaignConfig.story || 'No story provided.'}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <button 
              onClick={handleSubmit}
              className="px-8 py-4 rounded-full font-bold text-sm bg-yellow-500 text-white hover:bg-yellow-600 transition-all shadow-md active:scale-95"
            >
              Submit Campaign Details
            </button>
            <button 
              onClick={handleEdit}
              className="px-8 py-4 rounded-full font-bold text-sm bg-white border border-gray-900 text-gray-900 hover:bg-gray-50 transition-all active:scale-95"
            >
              Edit Campaign Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
