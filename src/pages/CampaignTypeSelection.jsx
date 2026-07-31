import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Gift, TrendingUp, Heart, ArrowRight, ChevronLeft } from 'lucide-react';
import api from '../api/axios';

const campaignTypes = [
  {
    id: 'reward',
    title: 'Reward Crowdfunding',
    description: 'Offer rewards in exchange for support.',
    icon: <Gift size={24} />,
  },
  {
    id: 'investment',
    title: 'Investment Crowdfunding',
    description: 'Raise funds from investors for equity.',
    icon: <TrendingUp size={24} />,
  },
  {
    id: 'donation',
    title: 'Donations / Non-Profit',
    description: 'Accept donations for causes or social impact.',
    icon: <Heart size={24} />,
  }
];

export default function CampaignTypeSelection() {
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  const { campaignId, hasBusinessInfo } = location.state || {};

  const handleProceed = async () => {
    if (!selected || !campaignId) return;
    
    setLoading(true);
    try {
      const response = await api.put(`/campaigns/${campaignId}/type`, {
        campaignType: selected
      });

      if (response.data.success) {
        if (hasBusinessInfo) {
          // Skip registration and go to configuration
          navigate('/dashboard/campaign/configure', { 
            state: { ...location.state, campaignType: selected } 
          });
        } else {
          // Go to business registration
          navigate('/dashboard/campaign/register-business', { 
            state: { ...location.state, campaignType: selected } 
          });
        }
      }
    } catch (error) {
      console.error('Error updating campaign type:', error);
      alert(error.response?.data?.message || 'Failed to update campaign type');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white py-12 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-12">
          <Link to="/dashboard" className="hover:text-gray-900 transition-colors">Dashboard</Link>
          <span>&gt;</span>
          <span className="text-yellow-600 font-bold">Choose Campaign Type</span>
        </nav>

        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">
            Choose Campaign Type
          </h1>
          <p className="text-gray-500 font-bold text-lg">
            Select the campaign model that best fits your goal.
          </p>
        </div>

        <div className="bg-gray-50/50 rounded-[3rem] p-12 border border-gray-100 shadow-sm">
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {campaignTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelected(type.id)}
                className={`flex flex-col p-8 rounded-[2rem] text-left transition-all duration-300 border-2 ${
                  selected === type.id
                    ? 'border-yellow-500 bg-white shadow-xl scale-105 z-10'
                    : 'border-white bg-white hover:border-gray-100 shadow-sm'
                }`}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-colors ${
                  selected === type.id ? 'bg-yellow-400 text-black' : 'bg-gray-100 text-gray-400'
                }`}>
                  {type.icon}
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-2 leading-tight">
                  {type.title}
                </h3>
                <p className="text-sm font-bold text-gray-400 leading-relaxed">
                  {type.description}
                </p>
              </button>
            ))}
          </div>

          <div className="flex flex-col items-center gap-6">
            <button
              onClick={handleProceed}
              disabled={!selected}
              className={`px-12 py-5 rounded-2xl font-black text-lg transition-all shadow-xl active:scale-95 ${
                selected 
                  ? 'bg-yellow-500 text-black hover:bg-yellow-600' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Proceed to Setup
            </button>
            <Link 
              to="/dashboard" 
              className="flex items-center gap-2 text-sm font-black text-gray-900 uppercase tracking-widest hover:gap-3 transition-all"
            >
              <ChevronLeft size={18} /> Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
