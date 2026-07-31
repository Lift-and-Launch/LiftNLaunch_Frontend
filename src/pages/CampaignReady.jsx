import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function CampaignReady() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleGenerate = () => {
    if (user && !user.isSubscribed) {
      navigate('/pricing');
    } else {
      navigate('/dashboard/campaign/builder', { state: location.state });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Top bar */}
      <div className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-end">
          <div className="flex items-center gap-4">
            <button className="text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors">
              Get Support
            </button>
            <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white">
              {/* Profile icon placeholder */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left side text and button */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">
                Your Campaign Page Is Ready
              </h1>
              <p className="text-gray-500 text-lg font-medium">
                We've created a launch-optimized landing page for your campaign.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-yellow-500" size={24} />
                <span className="text-gray-700 font-medium">Auto-generated layout</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-yellow-500" size={24} />
                <span className="text-gray-700 font-medium">Enquiry & conversion optimized</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-yellow-500" size={24} />
                <span className="text-gray-700 font-medium">Mobile & SEO friendly</span>
              </div>
            </div>

            <button 
              onClick={handleGenerate}
              className="px-8 py-4 bg-yellow-500 text-white rounded-full font-bold shadow-md hover:bg-yellow-600 transition-all active:scale-95"
            >
              Generate Landing Page
            </button>
          </div>

          {/* Right side illustration */}
          <div className="bg-orange-50/50 rounded-[3rem] p-8 flex items-center justify-center">
            <img 
              src="/campaign-ready.png" 
              alt="Campaign Ready Illustration" 
              className="max-w-full h-auto object-contain rounded-2xl drop-shadow-xl"
            />
          </div>
        </div>
      </div>

      {/* Bottom accent bar */}
      <div className="fixed bottom-0 left-0 right-0 h-4 bg-gradient-to-r from-yellow-600 to-yellow-800" />
    </div>
  );
}
