import React, { useState } from 'react';
import { 
  Rocket, 
  Target, 
  MousePointer2, 
  CreditCard, 
  PartyPopper, 
  BarChart3, 
  Settings,
  ArrowRight,
  Globe,
  Bell,
  Mail,
  ChevronRight
} from 'lucide-react';

const funnelSteps = [
  { id: 'landing', label: 'Landing Page', icon: <MousePointer2 />, description: 'Capture initial interest and traffic.' },
  { id: 'reservation', label: 'Reservation', icon: <Target />, description: 'The $1 VIP Bridge to filter buyers.' },
  { id: 'checkout', label: 'Checkout', icon: <CreditCard />, description: 'Secure landing for the reservation fee.' },
  { id: 'thankyou', label: 'Thank You', icon: <PartyPopper />, description: 'Onboarding superfans into community.' },
  { id: 'launch', label: 'Launch Prep', icon: <Rocket />, description: 'Final outreach and day-one conversion.' }
];

export default function FunnelTool() {
  const [activeStep, setActiveStep] = useState('landing');
  const [campaignId, setCampaignId] = useState(null);
  const [funnelData, setFunnelData] = useState({
    landing: { title: '', headline: '', cta: 'Join the VIP list' },
    reservation: { deposit: '1.00', benefit: 'Get 40% OFF at Launch' },
  });

  React.useEffect(() => {
    const fetchFunnel = async () => {
      try {
        const { default: api } = await import('../api/axios');
        // First get the latest campaign
        const campRes = await api.get('/campaigns');
        if (campRes.data.success && campRes.data.data.length > 0) {
          const cid = campRes.data.data[0].id;
          setCampaignId(cid);
          
          // Then fetch the funnel for it
          const funRes = await api.get(`/funnels/${cid}`);
          if (funRes.data.success && funRes.data.data) {
            setFunnelData({
              landing: funRes.data.data.landing || { title: '', headline: '', cta: 'Join the VIP list' },
              reservation: funRes.data.data.reservation || { deposit: '1.00', benefit: 'Get 40% OFF at Launch' }
            });
          }
        }
      } catch (err) {
        console.error("Error fetching funnel", err);
      }
    };
    fetchFunnel();
  }, []);

  const handlePublish = async () => {
    if (!campaignId) return;
    try {
      const { default: api } = await import('../api/axios');
      await api.put(`/funnels/${campaignId}`, funnelData);
      alert("Funnel saved successfully!");
    } catch (err) {
      console.error("Error saving funnel", err);
      alert("Error saving funnel");
    }
  };

  const handleInputChange = (step, field, value) => {
    setFunnelData(prev => ({
      ...prev,
      [step]: { ...prev[step], [field]: value }
    }));
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-100 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex justify-between items-center mb-10">
            <div>
              <div className="flex items-center gap-2 text-yellow-600 font-black uppercase text-xs tracking-widest mb-2">
                <BarChart3 size={14} /> Campaign Funnel Master
              </div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">Project: Urban Sustainable Drone</h1>
            </div>
            <div className="flex items-center gap-3">
               <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-xl font-bold text-sm hover:bg-gray-50 transition-all shadow-sm">
                  <Globe size={18} /> Preview Live
               </button>
               <button onClick={handlePublish} className="flex items-center gap-2 px-6 py-2.5 bg-black text-white rounded-xl font-black text-sm hover:scale-105 transition-all shadow-lg">
                  Publish Changes
               </button>
            </div>
          </div>

          {/* Stepper */}
          <div className="flex items-center justify-between gap-4">
            {funnelSteps.map((step, i) => (
              <React.Fragment key={step.id}>
                <button 
                  onClick={() => setActiveStep(step.id)}
                  className={`flex items-center gap-3 p-4 rounded-2xl transition-all border flex-1 text-left ${
                    activeStep === step.id 
                    ? 'border-yellow-400 bg-yellow-400/5 shadow-inner' 
                    : 'border-transparent hover:bg-gray-100/50'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                    activeStep === step.id ? 'bg-yellow-400 text-black' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {React.cloneElement(step.icon, { size: 20 })}
                  </div>
                  <div className="hidden lg:block">
                    <p className={`text-sm font-black uppercase tracking-tight ${activeStep === step.id ? 'text-gray-900' : 'text-gray-400'}`}>
                        {step.label}
                    </p>
                    <p className="text-[10px] text-gray-400 font-bold">Step {i + 1}</p>
                  </div>
                </button>
                {i < funnelSteps.length - 1 && <ChevronRight className="text-gray-200 hidden md:block" size={16} />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
           <div className="lg:col-span-2 space-y-8">
              <div className="bg-gray-50 rounded-[2rem] p-8 border border-gray-100">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-3">
                        <Settings size={24} className="text-yellow-500" /> 
                        Configure {funnelSteps.find(s => s.id === activeStep).label}
                    </h3>
                    <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-black uppercase tracking-widest">
                        Working Draft
                    </div>
                </div>

                <div className="space-y-6">
                  {activeStep === 'landing' && (
                    <>
                      <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Headline Hook</label>
                        <input 
                          type="text" 
                          value={funnelData.landing.headline}
                          onChange={(e) => handleInputChange('landing', 'headline', e.target.value)}
                          placeholder="e.g. The most versatile tactical drone ever built"
                          className="w-full px-5 py-4 bg-white border border-gray-100 rounded-2xl font-bold outline-none ring-yellow-400/50 focus:ring-4 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Subheadline / Pitch</label>
                        <textarea 
                          value={funnelData.landing.subheadline}
                          onChange={(e) => handleInputChange('landing', 'subheadline', e.target.value)}
                          placeholder="Why should people care about your launch?"
                          className="w-full px-5 py-4 bg-white border border-gray-100 rounded-2xl font-bold outline-none ring-yellow-400/50 focus:ring-4 transition-all min-h-[120px]"
                        ></textarea>
                      </div>
                    </>
                  )}
                  {activeStep === 'reservation' && (
                    <>
                       <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Deposit Amount (£)</label>
                            <input 
                              type="number" 
                              value={funnelData.reservation.deposit}
                              onChange={(e) => handleInputChange('reservation', 'deposit', e.target.value)}
                              className="w-full px-5 py-4 bg-white border border-gray-100 rounded-2xl font-bold outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">VIP Discount (%)</label>
                            <input 
                              type="text" 
                              value={funnelData.reservation.benefit}
                              onChange={(e) => handleInputChange('reservation', 'benefit', e.target.value)}
                              placeholder="e.g. 40% OFF"
                              className="w-full px-5 py-4 bg-white border border-gray-100 rounded-2xl font-bold outline-none"
                            />
                          </div>
                       </div>
                    </>
                  )}
                  <div className="pt-4">
                    <button className="w-full py-4 bg-yellow-400 text-black font-black rounded-2xl hover:bg-yellow-500 transition-colors flex items-center justify-center gap-2">
                        Next Step <ArrowRight size={20} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Analytics Preview */}
              <div className="grid md:grid-cols-2 gap-6">
                 <div className="p-8 bg-black text-white rounded-[2rem] shadow-xl">
                    <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4">Total Reserved</p>
                    <div className="flex items-baseline gap-2">
                       <span className="text-5xl font-black">128</span>
                       <span className="text-yellow-400 font-bold">+12 today</span>
                    </div>
                 </div>
                 <div className="p-8 bg-blue-600 text-white rounded-[2rem] shadow-xl">
                    <p className="text-xs font-black text-blue-300 uppercase tracking-widest mb-4">Conversion Rate</p>
                    <div className="flex items-baseline gap-2">
                       <span className="text-5xl font-black">4.2%</span>
                       <span className="text-blue-100 font-bold">Top 5%</span>
                    </div>
                 </div>
              </div>
           </div>

           <div className="space-y-8">
              <div className="p-8 bg-white border border-gray-100 rounded-[2rem] shadow-sm">
                 <h4 className="text-lg font-black text-gray-900 mb-6 uppercase tracking-tight">Quick Actions</h4>
                 <div className="space-y-3">
                    <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group">
                       <div className="flex items-center gap-3">
                          <Mail size={18} className="text-blue-500" />
                          <span className="text-sm font-bold text-gray-700">Send VIP Update</span>
                       </div>
                       <ChevronRight size={16} className="text-gray-300 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group">
                       <div className="flex items-center gap-3">
                          <Bell size={18} className="text-orange-500" />
                          <span className="text-sm font-bold text-gray-700">Push Notifications</span>
                       </div>
                       <ChevronRight size={16} className="text-gray-300 group-hover:translate-x-1 transition-transform" />
                    </button>
                 </div>
              </div>

              <div className="p-10 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-[2rem] shadow-2xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -mr-16 -mt-16 blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
                 <div className="relative z-10">
                    <h4 className="text-2xl font-black text-black mb-4 uppercase leading-tight">Need Expert Strategy?</h4>
                    <p className="text-black/70 font-bold text-sm mb-6 leading-relaxed">Book a 1-on-1 milestone call with a LaunchBoom certified mentor.</p>
                    <button className="w-full py-4 bg-black text-white font-black rounded-2xl hover:bg-black/80 transition-all shadow-xl">
                       Schedule Call
                    </button>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
