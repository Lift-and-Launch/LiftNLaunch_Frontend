import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Trash2, 
  Globe, 
  Mail, 
  Linkedin, 
  Video as VideoIcon,
  FileText
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function CampaignConfiguration() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const activeType = location.state?.campaignType || 'reward';
  const businessInfo = location.state?.businessInfo || {};

  const [formData, setFormData] = useState({
    basics: {
      name: '',
      category: '',
      tagline: '',
      goal: '',
      duration: '',
      startDate: '',
      guidingStrategy: '',
    },
    // Reward Specific
    rewards: [{ title: '', amount: '', description: '', delivery: '', quantity: '' }],
    // Investment Specific
    legalName: '',
    regNumber: '',
    country: '',
    minInvestment: '',
    equity: '',
    revenue: '',
    burnRate: '',
    team: [{ name: '', role: '', bio: '', linkedin: '' }],
    // Donation Specific
    mission: '',
    urgency: 'Moderate',
    problem: '',
    howItHelps: '',
    // Media
    videoUrl: '',
    story: '',
    coverImage: ''
  });

  const [paymentOptionActive, setPaymentOptionActive] = useState(false);
  const [loadingCampaign, setLoadingCampaign] = useState(true);
  const [errors, setErrors] = useState({});
  const [stripeClientId, setStripeClientId] = useState('');
  const [showStrategyHelper, setShowStrategyHelper] = useState(false);

  useEffect(() => {
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
    if (user && !user.stripeAccountId) {
      fetchStripeConfig();
    }
  }, [user]);

  useEffect(() => {
    const fetchCampaign = async () => {
      const queryParams = new URLSearchParams(location.search);
      const campaignId = location.state?.campaignId || queryParams.get('campaignId');
      if (!campaignId) {
        setLoadingCampaign(false);
        return;
      }
      try {
        const response = await api.get(`/campaigns/${campaignId}`);
        if (response.data.success && response.data.data) {
          const campaign = response.data.data;
          if (typeof campaign.paymentOptionActive !== 'undefined') {
            setPaymentOptionActive(campaign.paymentOptionActive);
          }
          if (campaign.campaignConfig) {
            const config = campaign.campaignConfig;
            setFormData(prev => ({
              ...prev,
              basics: {
                name: config.basics?.name || '',
                category: config.basics?.category || '',
                tagline: config.basics?.tagline || '',
                goal: config.basics?.goal || '',
                duration: config.basics?.duration === 36500 || config.basics?.duration === '36500' 
                  ? 'forever' 
                  : config.basics?.duration || '',
                startDate: config.basics?.startDate ? config.basics.startDate.split('T')[0] : '',
                guidingStrategy: config.basics?.guidingStrategy || '',
              },
              videoUrl: config.videoUrl || '',
              story: config.story || '',
              coverImage: config.coverImage || '',
              rewards: config.rewards && config.rewards.length > 0 
                ? config.rewards 
                : [{ title: '', amount: '', description: '', delivery: '', quantity: '' }],
              legalName: config.legalName || '',
              regNumber: config.regNumber || '',
              country: config.country || '',
              minInvestment: config.minInvestment || '',
              equity: config.equity || '',
              revenue: config.revenue || '',
              burnRate: config.burnRate || '',
              team: config.team && config.team.length > 0 
                ? config.team 
                : [{ name: '', role: '', bio: '', linkedin: '' }],
              mission: config.mission || '',
              urgency: config.urgency || 'Moderate',
              problem: config.problem || '',
              howItHelps: config.howItHelps || '',
            }));
          }
        }
      } catch (error) {
        console.error('Error fetching campaign details:', error);
      } finally {
        setLoadingCampaign(false);
      }
    };
    fetchCampaign();
  }, [location.state?.campaignId]);

  const validateForm = () => {
    const newErrors = {};
    
    // Common Basics
    if (!formData.basics.name?.trim()) {
      newErrors.name = "Campaign name is required";
    } else if (formData.basics.name.trim().length < 3) {
      newErrors.name = "Campaign name must be at least 3 characters";
    }
    
    if (!formData.basics.category) {
      newErrors.category = "Campaign category is required";
    }
    
    if (!formData.basics.tagline?.trim()) {
      newErrors.tagline = "Tagline is required";
    }

    if (!formData.basics.guidingStrategy) {
      newErrors.guidingStrategy = "Guiding strategy is required";
    }

    const goalNum = Number(formData.basics.goal);
    if (!formData.basics.goal) {
      newErrors.goal = "Goal amount is required";
    } else if (isNaN(goalNum) || goalNum <= 0) {
      newErrors.goal = "Goal amount must be a number greater than 0";
    }

    // Type Specific
    if (activeType === 'reward') {
      if (!formData.basics.duration) {
        newErrors.duration = "Duration is required";
      }
      if (!formData.basics.startDate) {
        newErrors.startDate = "Start date is required";
      }
      
      // Validate rewards
      const rewardErrors = [];
      formData.rewards.forEach((reward, index) => {
        const rErr = {};
        if (!reward.title?.trim()) rErr.title = "Title is required";
        const amt = Number(reward.amount);
        if (!reward.amount) rErr.amount = "Amount is required";
        else if (isNaN(amt) || amt <= 0) rErr.amount = "Amount must be greater than 0";
        if (!reward.description?.trim()) rErr.description = "Description is required";
        if (!reward.delivery) rErr.delivery = "Delivery date is required";
        const qty = Number(reward.quantity);
        if (!reward.quantity) rErr.quantity = "Quantity limit is required";
        else if (isNaN(qty) || qty <= 0) rErr.quantity = "Quantity must be greater than 0";
        
        if (Object.keys(rErr).length > 0) {
          rewardErrors[index] = rErr;
        }
      });
      if (rewardErrors.length > 0) {
        newErrors.rewards = rewardErrors;
      }
    } else if (activeType === 'donation') {
      if (!formData.basics.duration) {
        newErrors.duration = "Duration is required";
      }
      if (!formData.problem?.trim()) {
        newErrors.problem = "Problem description is required";
      }
      if (!formData.howItHelps?.trim()) {
        newErrors.howItHelps = "How donations help description is required";
      }
    } else if (activeType === 'investment') {
      if (!formData.legalName?.trim()) {
        newErrors.legalName = "Legal company name is required";
      }
      if (!formData.regNumber?.trim()) {
        newErrors.regNumber = "Registration number is required";
      }
      if (!formData.country?.trim()) {
        newErrors.country = "Country of incorporation is required";
      }
      const minInv = Number(formData.minInvestment);
      if (!formData.minInvestment) {
        newErrors.minInvestment = "Minimum investment is required";
      } else if (isNaN(minInv) || minInv <= 0) {
        newErrors.minInvestment = "Minimum investment must be greater than 0";
      }
      const eq = Number(formData.equity);
      if (!formData.equity) {
        newErrors.equity = "Equity percentage is required";
      } else if (isNaN(eq) || eq <= 0 || eq > 100) {
        newErrors.equity = "Equity must be a percentage between 0 and 100";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (!validateForm()) return;

    try {
      const campaignId = location.state?.campaignId;
      if (!campaignId) throw new Error('Campaign ID not found');

      // Prepare payload based on type
      const payload = {
        campaignType: activeType,
        paymentOptionActive: paymentOptionActive,
        campaignConfig: {
          basics: {
            ...formData.basics,
            goal: Number(formData.basics.goal),
            duration: activeType === 'investment' 
              ? 365 
              : (formData.basics.duration === 'forever' ? 36500 : Number(formData.basics.duration || 30)),
            startDate: activeType === 'reward' 
              ? formData.basics.startDate 
              : new Date().toISOString().split('T')[0]
          },
          videoUrl: formData.videoUrl,
          story: formData.story,
          coverImage: formData.coverImage,
          ...(activeType === 'reward' && { rewards: formData.rewards }),
          ...(activeType === 'investment' && {
            legalName: formData.legalName,
            regNumber: formData.regNumber,
            country: formData.country,
            minInvestment: formData.minInvestment,
            equity: formData.equity,
            revenue: formData.revenue,
            burnRate: formData.burnRate,
            team: formData.team
          }),
          ...(activeType === 'donation' && {
            mission: formData.mission,
            urgency: formData.urgency,
            problem: formData.problem,
            howItHelps: formData.howItHelps
          })
        }
      };

      const response = await api.put(`/campaigns/${campaignId}/configure`, payload);

      if (response.data.success) {
        navigate('/dashboard/campaign/review', { 
          state: { 
            ...location.state, 
            campaignConfig: payload.campaignConfig 
          } 
        });
      }
    } catch (error) {
      console.error('Error configuring campaign:', error);
      alert(error.response?.data?.message || 'Failed to configure campaign');
    }
  };

  const updateBasics = (field, value) => {
    setFormData({
      ...formData,
      basics: { ...formData.basics, [field]: value }
    });
  };

  const updateReward = (index, field, value) => {
    const newRewards = [...formData.rewards];
    newRewards[index] = { ...newRewards[index], [field]: value };
    setFormData({ ...formData, rewards: newRewards });
  };

  const updateTeam = (index, field, value) => {
    const newTeam = [...formData.team];
    newTeam[index] = { ...newTeam[index], [field]: value };
    setFormData({ ...formData, team: newTeam });
  };

  const addReward = () => {
    setFormData({...formData, rewards: [...formData.rewards, { title: '', amount: '', description: '', delivery: '', quantity: '' }]});
  };

  const removeReward = (index) => {
    setFormData({...formData, rewards: formData.rewards.filter((_, i) => i !== index)});
  };

  const addTeamMember = () => {
    setFormData({...formData, team: [...formData.team, { name: '', role: '', bio: '', linkedin: '' }]});
  };

  const renderSectionHeader = (title) => (
    <div className="flex items-center gap-4 mb-8">
      <div className="h-[2px] w-8 bg-yellow-500" />
      <h2 className="text-xl font-bold text-gray-900 uppercase tracking-widest">{title}</h2>
    </div>
  );

  if (loadingCampaign) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm font-bold text-gray-400 mb-12">
          <Link to="/dashboard" className="hover:text-gray-700 transition-colors">Dashboard</Link>
          <span>&gt;</span>
          <span className="text-gray-700">Choose Campaign Type</span>
          <span>&gt;</span>
          <span className="text-yellow-600 font-black">Setup Fields</span>
        </nav>

        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">
            Setup fields for {activeType.charAt(0).toUpperCase() + activeType.slice(1).replace('-', ' ')}
          </h1>
        </div>

        <div className="space-y-16">
          {/* Section: Campaign Basics */}
          <section className="bg-gray-50/50 rounded-[3rem] p-12 border border-gray-100">
            {renderSectionHeader("Campaign Basics")}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <label htmlFor="basicsName" className="block text-sm font-black text-gray-900 mb-2 uppercase tracking-wide">Campaign Name</label>
                <input 
                  id="basicsName"
                  type="text" 
                  placeholder="This will appear on your public campaign page."
                  className={`w-full px-6 py-4 rounded-xl border bg-white font-bold transition-all ${
                    errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-yellow-500'
                  }`}
                  value={formData.basics.name}
                  onChange={e => updateBasics('name', e.target.value)}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1 font-bold">{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="basicsCategory" className="block text-sm font-black text-gray-900 mb-2 uppercase tracking-wide">Campaign Category</label>
                <select 
                  id="basicsCategory"
                  className={`w-full px-6 py-4 rounded-xl border bg-white font-bold transition-all ${
                    errors.category ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-yellow-500'
                  }`}
                  value={formData.basics.category}
                  onChange={e => updateBasics('category', e.target.value)}
                >
                  <option value="">-- Choose Category --</option>
                  <option value="Technology">Technology</option>
                  <option value="Social Good">Social Good</option>
                  <option value="Creative Arts">Creative Arts</option>
                </select>
                {errors.category && <p className="text-red-500 text-xs mt-1 font-bold">{errors.category}</p>}
              </div>
            </div>
            <div>
              <label htmlFor="basicsTagline" className="block text-sm font-black text-gray-900 mb-2 uppercase tracking-wide">Short Tagline</label>
              <input 
                id="basicsTagline"
                type="text" 
                placeholder="A one-line pitch to attract supporters."
                className={`w-full px-6 py-4 rounded-xl border bg-white font-bold transition-all ${
                  errors.tagline ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-yellow-500'
                }`}
                value={formData.basics.tagline}
                onChange={e => updateBasics('tagline', e.target.value)}
              />
              {errors.tagline && <p className="text-red-500 text-xs mt-1 font-bold">{errors.tagline}</p>}
            </div>

            <div className="mt-8">
              <div className="flex items-center gap-2 mb-2">
                <label htmlFor="basicsGuidingStrategy" className="block text-sm font-black text-gray-900 uppercase tracking-wide">Guiding Campaign Strategy</label>
                <button
                  type="button"
                  onClick={() => setShowStrategyHelper(true)}
                  className="w-5 h-5 rounded-full bg-gray-200 text-gray-600 hover:bg-yellow-400 hover:text-black flex items-center justify-center font-black text-xs cursor-pointer transition-colors shadow-sm font-sans"
                  title="Strategy Guide Details"
                >
                  i
                </button>
              </div>
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="w-full md:w-1/2">
                  <select
                    id="basicsGuidingStrategy"
                    className={`w-full px-6 py-4 rounded-xl border bg-white font-bold transition-all cursor-pointer ${
                      errors.guidingStrategy ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-yellow-500'
                    }`}
                    value={formData.basics.guidingStrategy}
                    onChange={e => updateBasics('guidingStrategy', e.target.value)}
                  >
                    <option value="">-- Choose Guiding Strategy --</option>
                    <option value="CrowdStarter">CrowdStarter</option>
                    <option value="CrowdValidator">CrowdValidator</option>
                    <option value="CrowdScaler">CrowdScaler</option>
                    <option value="CrowdFinisher">CrowdFinisher</option>
                    <option value="CrowdPatron">CrowdPatron</option>
                  </select>
                  {errors.guidingStrategy && <p className="text-red-500 text-xs mt-1 font-bold">{errors.guidingStrategy}</p>}
                </div>
                
                {formData.basics.guidingStrategy && (
                  <div className="flex-1 bg-yellow-50/40 border border-yellow-200 p-6 rounded-2xl text-xs text-gray-700 font-bold space-y-2 animate-fade-in">
                    <span className="text-[10px] font-black uppercase text-yellow-750 tracking-wider block">Strategy Highlights: {formData.basics.guidingStrategy}</span>
                    {formData.basics.guidingStrategy === "CrowdStarter" && (
                      <ul className="list-disc pl-4 space-y-1 font-medium text-gray-600">
                        <li>Leans primarily on the founder's personal network assets.</li>
                        <li>Achieved with a minimal or zero marketing budget.</li>
                        <li>Depends heavily on network size and financial capacity.</li>
                        <li>Raises tend to be smaller ($10k or less).</li>
                      </ul>
                    )}
                    {formData.basics.guidingStrategy === "CrowdValidator" && (
                      <ul className="list-disc pl-4 space-y-1 font-medium text-gray-600">
                        <li>Focuses on market proof-of-concept and number of unique backers.</li>
                        <li>Collects beta testers, user feedback, and drives research.</li>
                        <li>Ideal for Reg CF "Testing the Waters" launch pre-runs.</li>
                      </ul>
                    )}
                    {formData.basics.guidingStrategy === "CrowdScaler" && (
                      <ul className="list-disc pl-4 space-y-1 font-medium text-gray-600">
                        <li>High customer-acquisition focus via digital marketing.</li>
                        <li>Marketing intensive (requires spend of up to 25% of goal raise).</li>
                        <li>Depends on pre-launch lists, advertising, and PR outreach.</li>
                      </ul>
                    )}
                    {formData.basics.guidingStrategy === "CrowdFinisher" && (
                      <ul className="list-disc pl-4 space-y-1 font-medium text-gray-600">
                        <li>Leverages existing customer goodwill, fans, vendors, and partners.</li>
                        <li>Amplified by marketing dollars to boost close capacity.</li>
                        <li>Popular for established brands, gaming projects, or local expansions.</li>
                      </ul>
                    )}
                    {formData.basics.guidingStrategy === "CrowdPatron" && (
                      <ul className="list-disc pl-4 space-y-1 font-medium text-gray-600">
                        <li>Ongoing, recurring monthly patronage instead of a single event.</li>
                        <li>Excellent for creators, artists, bloggers, and newsletter/media publishers.</li>
                        <li>Pledges repeat monthly over a longer term.</li>
                      </ul>
                    )}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Type Specific Sections */}
          {activeType === 'reward' && (
            <>
              <section className="bg-gray-50/50 rounded-[3rem] p-12 border border-gray-100">
                {renderSectionHeader("Funding Goal & Timeline")}
                <div className="grid md:grid-cols-3 gap-6">
                   <div>
                     <label htmlFor="basicsGoal" className="block text-sm font-black text-gray-900 mb-2 uppercase tracking-wide">Funding Goal</label>
                     <input 
                      id="basicsGoal"
                      type="number" 
                      placeholder="Goal amount" 
                      className={`w-full px-6 py-4 rounded-xl border bg-white font-bold transition-all ${
                        errors.goal ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-yellow-500'
                      }`}
                      value={formData.basics.goal}
                      onChange={e => updateBasics('goal', e.target.value)}
                     />
                     {errors.goal && <p className="text-red-500 text-xs mt-1 font-bold">{errors.goal}</p>}
                   </div>
                   <div>
                     <label htmlFor="basicsDuration" className="block text-sm font-black text-gray-900 mb-2 uppercase tracking-wide">Campaign Duration</label>
                     <select 
                      id="basicsDuration"
                      className={`w-full px-6 py-4 rounded-xl border bg-white font-bold transition-all ${
                        errors.duration ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-yellow-500'
                      }`}
                      value={formData.basics.duration}
                      onChange={e => updateBasics('duration', e.target.value)}
                     >
                        <option value="">-- Choose Duration --</option>
                        <option value="30">30 Days</option>
                        <option value="60">60 Days</option>
                        <option value="90">90 Days</option>
                     </select>
                     {errors.duration && <p className="text-red-500 text-xs mt-1 font-bold">{errors.duration}</p>}
                   </div>
                   <div>
                     <label htmlFor="basicsStartDate" className="block text-sm font-black text-gray-900 mb-2 uppercase tracking-wide">Campaign Start Date</label>
                     <input 
                      id="basicsStartDate"
                      type="date" 
                      className={`w-full px-6 py-4 rounded-xl border bg-white font-bold transition-all ${
                        errors.startDate ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-yellow-500'
                      }`}
                      value={formData.basics.startDate}
                      onChange={e => updateBasics('startDate', e.target.value)}
                     />
                     {errors.startDate && <p className="text-red-500 text-xs mt-1 font-bold">{errors.startDate}</p>}
                   </div>
                </div>
              </section>

              <section className="bg-gray-50/50 rounded-[3rem] p-12 border border-gray-100">
                 <div className="flex justify-between items-center mb-12">
                   {renderSectionHeader("Reward Tiers")}
                   <button onClick={addReward} className="flex items-center gap-2 bg-yellow-500 text-black px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-yellow-600 transition-all shadow-lg active:scale-95">
                     <Plus size={16} /> Add Reward Tier
                   </button>
                 </div>
                 
                 <div className="space-y-8">
                   {formData.rewards.map((reward, index) => (
                     <div key={index} className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm relative group">
                       {formData.rewards.length > 1 && (
                         <button onClick={() => removeReward(index)} className="absolute top-8 right-8 text-gray-300 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100">
                           <Trash2 size={20} />
                         </button>
                       )}
                       <div className="grid md:grid-cols-2 gap-8 mb-8">
                          <div>
                            <label htmlFor={`rewardTitle-${index}`} className="block text-sm font-black text-gray-900 mb-2 uppercase tracking-wide">Reward Title</label>
                            <input 
                              id={`rewardTitle-${index}`}
                              type="text" 
                              className={`w-full px-6 py-4 rounded-xl border bg-gray-50 font-bold transition-all ${
                                errors.rewards?.[index]?.title ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-yellow-500'
                              }`}
                              value={reward.title}
                              onChange={e => updateReward(index, 'title', e.target.value)}
                            />
                            {errors.rewards?.[index]?.title && <p className="text-red-500 text-xs mt-1 font-bold">{errors.rewards[index].title}</p>}
                          </div>
                          <div>
                            <label htmlFor={`rewardAmount-${index}`} className="block text-sm font-black text-gray-900 mb-2 uppercase tracking-wide">Contribution Amount</label>
                            <input 
                              id={`rewardAmount-${index}`}
                              type="number" 
                              className={`w-full px-6 py-4 rounded-xl border bg-gray-50 font-bold transition-all ${
                                errors.rewards?.[index]?.amount ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-yellow-500'
                              }`}
                              value={reward.amount}
                              onChange={e => updateReward(index, 'amount', e.target.value)}
                            />
                            {errors.rewards?.[index]?.amount && <p className="text-red-500 text-xs mt-1 font-bold">{errors.rewards[index].amount}</p>}
                          </div>
                       </div>
                       <div className="mb-8">
                          <label htmlFor={`rewardDescription-${index}`} className="block text-sm font-black text-gray-900 mb-2 uppercase tracking-wide">Reward Description</label>
                          <textarea 
                            id={`rewardDescription-${index}`}
                            rows={3} 
                            className={`w-full px-6 py-4 rounded-xl border bg-gray-50 font-bold transition-all resize-none ${
                              errors.rewards?.[index]?.description ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-yellow-500'
                            }`}
                            value={reward.description}
                            onChange={e => updateReward(index, 'description', e.target.value)}
                          />
                          {errors.rewards?.[index]?.description && <p className="text-red-500 text-xs mt-1 font-bold">{errors.rewards[index].description}</p>}
                       </div>
                       <div className="grid md:grid-cols-2 gap-8">
                          <div>
                            <label htmlFor={`rewardDelivery-${index}`} className="block text-sm font-black text-gray-900 mb-2 uppercase tracking-wide">Delivery Date</label>
                            <input 
                              id={`rewardDelivery-${index}`}
                              type="date" 
                              className={`w-full px-6 py-4 rounded-xl border bg-gray-50 font-bold transition-all ${
                                errors.rewards?.[index]?.delivery ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-yellow-500'
                              }`}
                              value={reward.delivery}
                              onChange={e => updateReward(index, 'delivery', e.target.value)}
                            />
                            {errors.rewards?.[index]?.delivery && <p className="text-red-500 text-xs mt-1 font-bold">{errors.rewards[index].delivery}</p>}
                          </div>
                          <div>
                            <label htmlFor={`rewardQuantity-${index}`} className="block text-sm font-black text-gray-900 mb-2 uppercase tracking-wide">Quantity Limit</label>
                            <input 
                              id={`rewardQuantity-${index}`}
                              type="number" 
                              className={`w-full px-6 py-4 rounded-xl border bg-gray-50 font-bold transition-all ${
                                errors.rewards?.[index]?.quantity ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-yellow-500'
                              }`}
                              value={reward.quantity}
                              onChange={e => updateReward(index, 'quantity', e.target.value)}
                            />
                            {errors.rewards?.[index]?.quantity && <p className="text-red-500 text-xs mt-1 font-bold">{errors.rewards[index].quantity}</p>}
                          </div>
                       </div>
                     </div>
                   ))}
                 </div>
              </section>
            </>
          )}

          {activeType === 'investment' && (
            <>
              <section className="bg-gray-50/50 rounded-[3rem] p-12 border border-gray-100">
                {renderSectionHeader("Company Information")}
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                   <div>
                     <label htmlFor="legalName" className="block text-sm font-black text-gray-900 mb-2 uppercase tracking-wide">Legal Company Name</label>
                     <input 
                      id="legalName"
                      type="text" 
                      placeholder="Enter Legal Company Name" 
                      className={`w-full px-6 py-4 rounded-xl border bg-white font-bold transition-all ${
                        errors.legalName ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-yellow-500'
                      }`}
                      value={formData.legalName}
                      onChange={e => setFormData({...formData, legalName: e.target.value})}
                     />
                     {errors.legalName && <p className="text-red-500 text-xs mt-1 font-bold">{errors.legalName}</p>}
                   </div>
                   <div>
                     <label htmlFor="regNumber" className="block text-sm font-black text-gray-900 mb-2 uppercase tracking-wide">Registration Number</label>
                     <input 
                      id="regNumber"
                      type="text" 
                      className={`w-full px-6 py-4 rounded-xl border bg-white font-bold transition-all ${
                        errors.regNumber ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-yellow-500'
                      }`}
                      value={formData.regNumber}
                      onChange={e => setFormData({...formData, regNumber: e.target.value})}
                     />
                     {errors.regNumber && <p className="text-red-500 text-xs mt-1 font-bold">{errors.regNumber}</p>}
                   </div>
                </div>
                <div>
                  <label htmlFor="countryOfInc" className="block text-sm font-black text-gray-900 mb-2 uppercase tracking-wide">Country of Incorporation</label>
                  <input 
                    id="countryOfInc"
                    type="text" 
                    className={`w-full px-6 py-4 rounded-xl border bg-white font-bold transition-all ${
                      errors.country ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-yellow-500'
                    }`}
                    value={formData.country}
                    onChange={e => setFormData({...formData, country: e.target.value})}
                  />
                  {errors.country && <p className="text-red-500 text-xs mt-1 font-bold">{errors.country}</p>}
                </div>
              </section>

              <section className="bg-gray-50/50 rounded-[3rem] p-12 border border-gray-100">
                {renderSectionHeader("Investment Details")}
                <div className="grid md:grid-cols-3 gap-6">
                   <div>
                     <label htmlFor="basicsGoal" className="block text-sm font-black text-gray-900 mb-2 uppercase tracking-wide">Target Raise Amount</label>
                     <input 
                      id="basicsGoal"
                      type="number" 
                      placeholder="Goal amount" 
                      className={`w-full px-6 py-4 rounded-xl border bg-white font-bold transition-all ${
                        errors.goal ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-yellow-500'
                      }`}
                      value={formData.basics.goal}
                      onChange={e => updateBasics('goal', e.target.value)}
                     />
                     {errors.goal && <p className="text-red-500 text-xs mt-1 font-bold">{errors.goal}</p>}
                   </div>
                   <div>
                     <label htmlFor="minInvestment" className="block text-sm font-black text-gray-900 mb-2 uppercase tracking-wide">Minimum Investment</label>
                     <input 
                      id="minInvestment"
                      type="number" 
                      className={`w-full px-6 py-4 rounded-xl border bg-white font-bold transition-all ${
                        errors.minInvestment ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-yellow-500'
                      }`}
                      value={formData.minInvestment}
                      onChange={e => setFormData({...formData, minInvestment: e.target.value})}
                     />
                     {errors.minInvestment && <p className="text-red-500 text-xs mt-1 font-bold">{errors.minInvestment}</p>}
                   </div>
                   <div>
                     <label htmlFor="equityOffered" className="block text-sm font-black text-gray-900 mb-2 uppercase tracking-wide">Equity Offered (%)</label>
                     <input 
                      id="equityOffered"
                      type="number" 
                      className={`w-full px-6 py-4 rounded-xl border bg-white font-bold transition-all ${
                        errors.equity ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-yellow-500'
                      }`}
                      value={formData.equity}
                      onChange={e => setFormData({...formData, equity: e.target.value})}
                     />
                     {errors.equity && <p className="text-red-500 text-xs mt-1 font-bold">{errors.equity}</p>}
                   </div>
                </div>
              </section>
            </>
          )}

          {activeType === 'donation' && (
            <>
              <section className="bg-gray-50/50 rounded-[3rem] p-12 border border-gray-100">
                {renderSectionHeader("Fundraising Goal")}
                <div className="grid md:grid-cols-3 gap-6">
                   <div>
                     <label htmlFor="basicsGoal" className="block text-sm font-black text-gray-900 mb-2 uppercase tracking-wide">Donation Goal</label>
                     <input 
                      id="basicsGoal"
                      type="number" 
                      placeholder="Goal amount" 
                      className={`w-full px-6 py-4 rounded-xl border bg-white font-bold transition-all ${
                        errors.goal ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-yellow-500'
                      }`}
                      value={formData.basics.goal}
                      onChange={e => updateBasics('goal', e.target.value)}
                     />
                     {errors.goal && <p className="text-red-500 text-xs mt-1 font-bold">{errors.goal}</p>}
                   </div>
                   <div>
                     <label htmlFor="basicsDuration" className="block text-sm font-black text-gray-900 mb-2 uppercase tracking-wide">Campaign Duration</label>
                     <select 
                      id="basicsDuration"
                      className={`w-full px-6 py-4 rounded-xl border bg-white font-bold transition-all ${
                        errors.duration ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-yellow-500'
                      }`}
                      value={formData.basics.duration}
                      onChange={e => updateBasics('duration', e.target.value)}
                     >
                        <option value="">-- Choose Duration --</option>
                        <option value="30">30 Days</option>
                        <option value="60">60 Days</option>
                        <option value="90">90 Days</option>
                        <option value="forever">Always Open</option>
                     </select>
                     {errors.duration && <p className="text-red-500 text-xs mt-1 font-bold">{errors.duration}</p>}
                   </div>
                   <div>
                     <label htmlFor="donationUrgency" className="block text-sm font-black text-gray-900 mb-2 uppercase tracking-wide">Urgency Level</label>
                     <select 
                      id="donationUrgency"
                      className="w-full px-6 py-4 rounded-xl border border-gray-200 bg-white font-bold"
                      value={formData.urgency}
                      onChange={e => setFormData({...formData, urgency: e.target.value})}
                     >
                        <option value="Moderate">Moderate</option>
                        <option value="High">High</option>
                        <option value="Critical">Critical</option>
                     </select>
                   </div>
                </div>
              </section>

              <section className="bg-gray-50/50 rounded-[3rem] p-12 border border-gray-100">
                {renderSectionHeader("Impact Story")}
                <div className="space-y-8">
                  <div>
                    <label htmlFor="problemDesc" className="block text-sm font-black text-gray-900 mb-2 uppercase tracking-wide">Problem Description</label>
                    <textarea 
                      id="problemDesc"
                      rows={4} 
                      className={`w-full px-6 py-4 rounded-xl border bg-white font-bold resize-none transition-all ${
                        errors.problem ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-yellow-500'
                      }`}
                      value={formData.problem}
                      onChange={e => setFormData({...formData, problem: e.target.value})}
                    />
                    {errors.problem && <p className="text-red-500 text-xs mt-1 font-bold">{errors.problem}</p>}
                  </div>
                  <div>
                    <label htmlFor="howDonationsHelp" className="block text-sm font-black text-gray-900 mb-2 uppercase tracking-wide">How Donations Help</label>
                    <textarea 
                      id="howDonationsHelp"
                      rows={4} 
                      className={`w-full px-6 py-4 rounded-xl border bg-white font-bold resize-none transition-all ${
                        errors.howItHelps ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-yellow-500'
                      }`}
                      value={formData.howItHelps}
                      onChange={e => setFormData({...formData, howItHelps: e.target.value})}
                    />
                    {errors.howItHelps && <p className="text-red-500 text-xs mt-1 font-bold">{errors.howItHelps}</p>}
                  </div>
                </div>
              </section>
            </>
          )}



          {/* Common Section: Media & Story */}
          <section className="bg-gray-50/50 rounded-[3rem] p-12 border border-gray-100">
             {renderSectionHeader("Media & Story")}
             <div className="space-y-8">
                <div>
                  <label className="block text-sm font-black text-gray-900 mb-2 uppercase tracking-wide">Cover Image upload</label>
                  <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 flex flex-col items-center justify-center gap-4 bg-white/50 hover:bg-white transition-all cursor-pointer group">
                    <div className="bg-gray-100 px-6 py-2 rounded-lg font-black text-xs uppercase tracking-widest text-gray-600 group-hover:bg-yellow-500 group-hover:text-black transition-all">Upload Image</div>
                  </div>
                </div>
                <div>
                  <label htmlFor="videoUrl" className="block text-sm font-black text-gray-900 mb-2 uppercase tracking-wide">Video URL input (Optional)</label>
                  <div className="relative">
                    <input 
                      id="videoUrl"
                      type="text" 
                      placeholder="Type your URL here" 
                      className="w-full px-6 py-4 rounded-xl border border-gray-200 bg-white font-bold pl-12"
                      value={formData.videoUrl}
                      onChange={e => setFormData({...formData, videoUrl: e.target.value})}
                    />
                    <VideoIcon size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                </div>
                <div>
                  <label htmlFor="storyText" className="block text-sm font-black text-gray-900 mb-2 uppercase tracking-wide">Brief Story</label>
                  <div className="border border-gray-200 rounded-2xl bg-white overflow-hidden">
                    <div className="flex items-center gap-4 px-6 py-3 border-b border-gray-100 bg-gray-50/50">
                       <select className="bg-transparent font-bold text-sm outline-none">
                         <option>Paragraph</option>
                         <option>Heading 1</option>
                       </select>
                       <div className="w-[1px] h-4 bg-gray-200 mx-2" />
                       <button className="text-gray-400 hover:text-black font-black">B</button>
                       <button className="text-gray-400 hover:text-black italic">I</button>
                       <button className="text-gray-400 hover:text-black underline">U</button>
                    </div>
                    <textarea 
                      id="storyText"
                      rows={8} 
                      className="w-full px-6 py-4 font-bold outline-none resize-none"
                      value={formData.story}
                      onChange={e => setFormData({...formData, story: e.target.value})}
                    />
                  </div>
                </div>
             </div>
          </section>

          {/* Navigation */}
          <div className="flex flex-col items-center gap-6 pt-12">
             <button 
              id="btnSaveNext"
              onClick={handleNext}
              className="px-16 py-6 rounded-2xl font-black text-xl bg-yellow-500 text-black hover:bg-yellow-600 transition-all shadow-2xl active:scale-95 flex items-center gap-2 uppercase tracking-widest"
             >
              Save and Next <ChevronRight size={24} />
             </button>
             <Link to="/dashboard" className="flex items-center gap-2 text-sm font-black text-gray-900 hover:gap-3 transition-all uppercase tracking-widest">
               <ChevronLeft size={18} /> Back to Dashboard
             </Link>
          </div>
        </div>
      </div>

      {/* Strategy Helper popover modal */}
      {showStrategyHelper && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl sm:rounded-[2.5rem] p-6 sm:p-10 max-w-2xl w-full shadow-2xl space-y-6 my-4 sm:my-8 max-h-[90vh] overflow-y-auto animate-scale-up relative font-sans text-xs">
            <button
              onClick={() => setShowStrategyHelper(false)}
              className="absolute top-8 right-8 text-gray-400 hover:text-black transition-colors cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div>
              <span className="text-[9px] font-black uppercase text-yellow-600 tracking-widest block mb-1">Interactive Strategy Guide</span>
              <h3 className="text-2xl font-black text-gray-900 tracking-tight leading-tight">Guiding Campaign Strategies</h3>
              <p className="text-gray-400 font-bold text-xs mt-1 leading-relaxed">
                Review the 5 strategies below to identify the most suitable fundraising approach for your business model.
              </p>
            </div>

            <div className="space-y-6">
              
              {/* CrowdStarter */}
              <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100 space-y-2">
                <span className="text-[10px] font-black uppercase text-yellow-750 tracking-wider block">1. CrowdStarter</span>
                <p className="font-bold text-gray-800 text-xs">
                  A campaign to pre-launch or launch a business where the campaign will primarily lean on an entrepreneur’s personal network resources.
                </p>
                <ul className="list-disc pl-4 space-y-1 font-medium text-gray-600 text-[11px]">
                  <li>Can be accomplished with a small marketing budget - or no marketing budget at all.</li>
                  <li>Success will depend on the size, quality and financial capacity of the founder or founding team’s network.</li>
                  <li>Campaign raises tend to be smaller ($10k or less).</li>
                  <li>Can be used as a stepping stone to other funding sources.</li>
                </ul>
              </div>

              {/* CrowdValidator */}
              <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100 space-y-2">
                <span className="text-[10px] font-black uppercase text-yellow-750 tracking-wider block">2. CrowdValidator</span>
                <p className="font-bold text-gray-800 text-xs">
                  A campaign focused on proof of concept or market validation for a product or business concept.
                </p>
                <ul className="list-disc pl-4 space-y-1 font-medium text-gray-600 text-[11px]">
                  <li>Campaign goals are more focused on the number of backers than funds raised.</li>
                  <li>May also be focused on gathering beta testers, getting user feedback, or research and development.</li>
                  <li>Campaign raises tend to be smaller since the focus is primarily on the number of backers and not on funds raised.</li>
                  <li>Reg CF “Testing the Waters” Campaigns may also fit into this category.</li>
                </ul>
              </div>

              {/* CrowdScaler */}
              <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100 space-y-2">
                <span className="text-[10px] font-black uppercase text-yellow-750 tracking-wider block">3. CrowdScaler</span>
                <p className="font-bold text-gray-800 text-xs">
                  A campaign that uses crowdfunding specifically to acquire new customers.
                </p>
                <ul className="list-disc pl-4 space-y-1 font-medium text-gray-600 text-[11px]">
                  <li>Most marketing-intensive campaign - requiring a marketing spend of up to 25% of funds raised.</li>
                  <li>Campaign raises tend to be larger due to the emphasis on reaching new customers and supporters.</li>
                  <li>Relies on generating a strong pre-launch email list via digital marketing strategies, events or PR before the campaign launches.</li>
                  <li>Businesses with innovative products and universal appeal often raise more funding.</li>
                </ul>
              </div>

              {/* CrowdFinisher */}
              <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100 space-y-2">
                <span className="text-[10px] font-black uppercase text-yellow-750 tracking-wider block">4. CrowdFinisher</span>
                <p className="font-bold text-gray-800 text-xs">
                  A campaign that collects on the goodwill a business has generated in the community among its existing customers and fans.
                </p>
                <ul className="list-disc pl-4 space-y-1 font-medium text-gray-600 text-[11px]">
                  <li>Success depends on the size, quality, and financial capacity of the business’s network and founding team's professional connections.</li>
                  <li>Accomplished with a small marketing budget, but success will be amplified by applying marketing dollars.</li>
                  <li>Campaign raises vary depending on the network size. Popular for gaming/board game communities.</li>
                </ul>
              </div>

              {/* CrowdPatron */}
              <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100 space-y-2">
                <span className="text-[10px] font-black uppercase text-yellow-750 tracking-wider block">5. CrowdPatron</span>
                <p className="font-bold text-gray-800 text-xs">
                  A campaign organized as recurring financial support from customers and fans in exchange for regular access to exclusive content or rewards.
                </p>
                <ul className="list-disc pl-4 space-y-1 font-medium text-gray-600 text-[11px]">
                  <li>Rather than a one-time event, these campaigns are ongoing, recurring monthly funding events.</li>
                  <li>Success depends on the size, quality, and capacity of creator’s personal and business networks.</li>
                  <li>Funding is often in smaller amounts pledged monthly over a longer period (popular for writers, artists, podcasters).</li>
                </ul>
              </div>

            </div>

            <button
              onClick={() => setShowStrategyHelper(false)}
              className="w-full py-4 bg-gray-900 hover:bg-black text-white rounded-2xl uppercase tracking-widest text-[10px] font-black transition-all cursor-pointer font-sans"
            >
              Back to Campaign Setup
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
