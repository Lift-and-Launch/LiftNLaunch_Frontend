import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Check, Upload } from 'lucide-react';
import api from '../api/axios';

export default function BusinessRegistration() {
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    businessName: '',
    category: '',
    type: 'Product-based',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    description: '',
    productsServices: '',
    targetAudience: [],
    email: '',
    phone: '',
    logo: null
  });

  const [confirmedAccurate, setConfirmedAccurate] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  const categoriesList = [
    "art",
    "comics",
    "crafts",
    "dance",
    "design",
    "education",
    "environment",
    "fashion",
    "film & video",
    "food & beverage",
    "games",
    "health",
    "music",
    "photography",
    "publishing",
    "sports",
    "technology",
    "theater",
    "travel"
  ];

  const [selectedCategory, setSelectedCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');

  // Fetch campaign details on mount to populate existing business info
  useEffect(() => {
    const fetchCampaign = async () => {
      const campaignId = location.state?.campaignId;
      if (!campaignId) {
        setLoading(false);
        return;
      }
      try {
        const response = await api.get(`/campaigns/${campaignId}`);
        if (response.data.success && response.data.data) {
          const campaign = response.data.data;
          if (campaign.businessInfo) {
            setFormData(prev => ({
              ...prev,
              ...campaign.businessInfo
            }));
            setConfirmedAccurate(true);
            setAgreedToTerms(true);
          }
        }
      } catch (error) {
        console.error('Error fetching campaign business profile:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaign();
  }, [location.state?.campaignId]);

  // Sync selectedCategory and customCategory with loaded category
  useEffect(() => {
    if (formData.category) {
      if (categoriesList.includes(formData.category)) {
        setSelectedCategory(formData.category);
      } else {
        setSelectedCategory('Other');
        setCustomCategory(formData.category);
      }
    }
  }, [formData.category]);

  const handleCategoryChange = (e) => {
    const val = e.target.value;
    setSelectedCategory(val);
    if (val === 'Other') {
      setFormData(prev => ({ ...prev, category: customCategory }));
    } else {
      setFormData(prev => ({ ...prev, category: val }));
      setCustomCategory(''); // Reset custom category
    }
  };

  const handleCustomCategoryChange = (e) => {
    const val = e.target.value;
    setCustomCategory(val);
    setFormData(prev => ({ ...prev, category: val }));
  };

  const campaignType = location.state?.campaignType || 'reward';

  const validateStep = (currentStep) => {
    const newErrors = {};
    if (currentStep === 1) {
      if (!formData.businessName.trim()) newErrors.businessName = "Business name is required";
      else if (formData.businessName.trim().length < 3) newErrors.businessName = "Business name must be at least 3 characters";
      
      if (selectedCategory === 'Other' && !customCategory.trim()) {
        newErrors.category = "Please specify your custom category";
      } else if (!formData.category) {
        newErrors.category = "Category is required";
      }
      if (!formData.address.trim()) newErrors.address = "Address is required";
      if (!formData.city.trim()) newErrors.city = "City is required";
      if (!formData.state.trim()) newErrors.state = "State is required";
      if (!formData.zipCode.trim()) newErrors.zipCode = "Zip code is required";
    } else if (currentStep === 2) {
      if (!formData.description.trim()) newErrors.description = "Description is required";
      else if (formData.description.trim().length > 1000) newErrors.description = "Description cannot exceed 1000 characters";
      
      if (!formData.productsServices.trim()) newErrors.productsServices = "Products/Services Offered is required";
    } else if (currentStep === 3) {
      if (!formData.email.trim()) newErrors.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Please enter a valid email address";
      
      if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
      
      if (!confirmedAccurate) newErrors.confirmedAccurate = "You must confirm that the information is accurate";
      if (!agreedToTerms) newErrors.agreedToTerms = "You must agree to the Terms & Privacy Policy";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (!validateStep(step)) return;

    if (step < 3) {
      setStep(step + 1);
      setErrors({});
    } else {
      try {
        const campaignId = location.state?.campaignId;
        if (!campaignId) throw new Error('Campaign ID not found');

        const response = await api.put(`/campaigns/${campaignId}/business`, {
          businessInfo: formData,
          campaignType: location.state?.campaignType
        });

        if (response.data.success) {
          navigate('/dashboard/campaign/configure', { state: { ...location.state, businessInfo: formData } });
        }
      } catch (error) {
        console.error('Error registering business:', error);
        alert(error.response?.data?.message || 'Failed to register business');
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      setErrors({});
    }
    else navigate('/dashboard/campaign/select-type');
  };

  const toggleAudience = (audience) => {
    setFormData(prev => ({
      ...prev,
      targetAudience: prev.targetAudience.includes(audience)
        ? prev.targetAudience.filter(a => a !== audience)
        : [...prev.targetAudience, audience]
    }));
  };

  const renderStepIcon = (num, label) => (
    <div className="flex flex-col items-center gap-3">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl transition-all ${
        step === num ? 'bg-yellow-500 text-black shadow-lg scale-110' : 
        step > num ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-400'
      }`}>
        {step > num ? <Check size={28} strokeWidth={3} /> : num.toString().padStart(2, '0')}
      </div>
      <span className={`text-sm font-black uppercase tracking-widest ${
        step === num ? 'text-yellow-600' : 'text-gray-400'
      }`}>{label}</span>
      {num < 3 && <div className="hidden md:absolute md:block w-32 h-[2px] bg-gray-100 top-7 -right-16 -z-10" />}
    </div>
  );

  if (loading && location.state?.campaignId) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mb-4" />
        <p className="text-gray-500 font-bold text-sm tracking-widest uppercase">Loading registration details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <span className="bg-gray-100 px-4 py-1 rounded-full text-xs font-black uppercase tracking-tighter text-gray-500 mb-6 inline-block">Sign Up</span>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">Register Your Business</h1>
          <p className="text-gray-500 font-bold text-lg">Set up a campaign to launch, test, or fund your business idea.</p>
        </div>

        {/* Stepper */}
        <div className="flex justify-center items-center gap-20 mb-16 relative">
           {renderStepIcon(1, "Business Basics")}
           {renderStepIcon(2, "What You Offer")}
           {renderStepIcon(3, "Contact & Visibility")}
        </div>

        <div className="bg-gray-50/50 rounded-[3rem] p-12 border border-gray-100 shadow-sm">
          {step === 1 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-black text-gray-900 mb-2">Business Basics</h2>
              <p className="text-gray-500 font-bold mb-8">Tell us a little about your business. This helps us set up the right campaigns.</p>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="col-span-1">
                  <label htmlFor="businessName" className="block text-sm font-black text-gray-900 mb-2">Business Name</label>
                  <input 
                    id="businessName"
                    type="text" 
                    placeholder="Enter your business name"
                    className={`w-full px-6 py-4 rounded-xl border bg-white focus:ring-2 transition-all font-bold placeholder:text-gray-300 ${
                      errors.businessName ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-yellow-500'
                    }`}
                    value={formData.businessName}
                    onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                  />
                  {errors.businessName && <p className="text-red-500 text-xs mt-1 font-bold">{errors.businessName}</p>}
                </div>
                <div>
                  <label htmlFor="category" className="block text-sm font-black text-gray-900 mb-2">Business Category</label>
                  <select 
                    id="category"
                    className={`w-full px-6 py-4 rounded-xl border bg-white focus:ring-2 transition-all font-bold ${
                      errors.category ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-yellow-500'
                    }`}
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                  >
                    <option value="">-- Select a category --</option>
                    {categoriesList.map(cat => (
                      <option key={cat} value={cat} className="capitalize">
                        {cat}
                      </option>
                    ))}
                    <option value="Other">Other</option>
                  </select>
                  {errors.category && <p className="text-red-500 text-xs mt-1 font-bold">{errors.category}</p>}

                  {selectedCategory === 'Other' && (
                    <div className="mt-4 animate-in fade-in duration-200">
                      <label htmlFor="customCategory" className="block text-sm font-black text-gray-900 mb-2 text-yellow-600">Specify Category</label>
                      <input 
                        id="customCategory"
                        type="text" 
                        placeholder="e.g. Comics, Virtual Reality Art"
                        className={`w-full px-6 py-4 rounded-xl border bg-white focus:ring-2 transition-all font-bold placeholder:text-gray-300 ${
                          errors.category ? 'border-red-500 focus:ring-red-500 animate-shake' : 'border-gray-200 focus:ring-yellow-500'
                        }`}
                        value={customCategory}
                        onChange={handleCustomCategoryChange}
                      />
                    </div>
                  )}
                </div>
                <div>
                  <label htmlFor="type" className="block text-sm font-black text-gray-900 mb-2">Business Type</label>
                  <select 
                    id="type"
                    className="w-full px-6 py-4 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-yellow-500 transition-all font-bold"
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                  >
                    <option value="Product-based">Product-based</option>
                    <option value="Service-based">Service-based</option>
                  </select>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label htmlFor="address" className="block text-sm font-black text-gray-900 mb-2">Address</label>
                  <input 
                    id="address"
                    type="text" 
                    placeholder="Street address..."
                    className={`w-full px-6 py-4 rounded-xl border bg-white focus:ring-2 transition-all font-bold placeholder:text-gray-300 ${
                      errors.address ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-yellow-500'
                    }`}
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                  />
                  {errors.address && <p className="text-red-500 text-xs mt-1 font-bold">{errors.address}</p>}
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label htmlFor="city" className="block text-sm font-black text-gray-900 mb-2">City</label>
                    <input 
                      id="city"
                      type="text" 
                      className={`w-full px-6 py-4 rounded-xl border bg-white focus:ring-2 transition-all font-bold ${
                        errors.city ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-yellow-500'
                      }`} 
                      value={formData.city} 
                      onChange={e => setFormData({...formData, city: e.target.value})} 
                    />
                    {errors.city && <p className="text-red-500 text-xs mt-1 font-bold">{errors.city}</p>}
                  </div>
                  <div>
                     <label htmlFor="state" className="block text-sm font-black text-gray-900 mb-2">State</label>
                     <input 
                       id="state"
                       type="text" 
                       className={`w-full px-6 py-4 rounded-xl border bg-white focus:ring-2 transition-all font-bold ${
                         errors.state ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-yellow-500'
                       }`} 
                       value={formData.state} 
                       onChange={e => setFormData({...formData, state: e.target.value})} 
                     />
                     {errors.state && <p className="text-red-500 text-xs mt-1 font-bold">{errors.state}</p>}
                  </div>
                  <div>
                    <label htmlFor="zipCode" className="block text-sm font-black text-gray-900 mb-2">Zip Code</label>
                    <input 
                      id="zipCode"
                      type="text" 
                      className={`w-full px-6 py-4 rounded-xl border bg-white focus:ring-2 transition-all font-bold ${
                        errors.zipCode ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-yellow-500'
                      }`} 
                      value={formData.zipCode} 
                      onChange={e => setFormData({...formData, zipCode: e.target.value})} 
                    />
                    {errors.zipCode && <p className="text-red-500 text-xs mt-1 font-bold">{errors.zipCode}</p>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-black text-gray-900 mb-2">What You Offer</h2>
              <p className="text-gray-500 font-bold mb-8">Help us understand your services and ideal customers.</p>
              
              <div>
                <label htmlFor="description" className="block text-sm font-black text-gray-900 mb-2">Business Description</label>
                <div className="relative">
                  <textarea 
                    id="description"
                    rows={4}
                    placeholder="Briefly explain what you do and who it's for"
                    className={`w-full px-6 py-4 rounded-xl border bg-white focus:ring-2 transition-all font-bold placeholder:text-gray-300 resize-none ${
                      errors.description ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-yellow-500'
                    }`}
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                  <span className="absolute bottom-4 right-4 text-xs font-bold text-gray-400">Max 1000 characters. Keep it simple and customer-focused.</span>
                </div>
                {errors.description && <p className="text-red-500 text-xs mt-1 font-bold">{errors.description}</p>}
              </div>

              <div>
                <label htmlFor="productsServices" className="block text-sm font-black text-gray-900 mb-2">Products / Services Offered</label>
                <input 
                  id="productsServices"
                  type="text" 
                  placeholder="e.g. Web design, Home cleaning, Handmade crafts"
                  className={`w-full px-6 py-4 rounded-xl border bg-white focus:ring-2 transition-all font-bold placeholder:text-gray-300 ${
                    errors.productsServices ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-yellow-500'
                  }`}
                  value={formData.productsServices}
                  onChange={(e) => setFormData({...formData, productsServices: e.target.value})}
                />
                {errors.productsServices && <p className="text-red-500 text-xs mt-1 font-bold">{errors.productsServices}</p>}
              </div>

              <div>
                <label className="block text-sm font-black text-gray-900 mb-4 uppercase tracking-wide">Target Audience</label>
                <div className="flex flex-wrap gap-4">
                  {['Individuals', 'Startups', 'Small Businesses', 'Enterprises', 'Local Customers'].map((audience, idx) => (
                    <label key={audience} className="flex items-center gap-3 cursor-pointer group">
                      <div 
                        id={`targetAudience-${idx}`}
                        onClick={() => toggleAudience(audience)}
                        className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
                          formData.targetAudience.includes(audience) ? 'bg-yellow-500 border-yellow-500' : 'border-gray-200'
                        }`}
                      >
                        {formData.targetAudience.includes(audience) && <Check size={14} strokeWidth={4} className="text-white" />}
                      </div>
                      <span className="text-sm font-bold text-gray-600 tracking-tight group-hover:text-gray-900 transition-colors uppercase">{audience}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-black text-gray-900 mb-2">Contact & Visibility</h2>
              <p className="text-gray-500 font-bold mb-8">Add contact details so customers can reach you directly.</p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-black text-gray-900 mb-2">Business Email</label>
                  <input 
                    id="email"
                    type="email" 
                    placeholder="e.g. name@business.com"
                    className={`w-full px-6 py-4 rounded-xl border bg-white focus:ring-2 transition-all font-bold ${
                      errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-yellow-500'
                    }`}
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1 font-bold">{errors.email}</p>}
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-black text-gray-900 mb-2">Phone Number</label>
                  <input 
                    id="phone"
                    type="tel" 
                    placeholder="e.g. +91 XXXXX XXXXX"
                    className={`w-full px-6 py-4 rounded-xl border bg-white focus:ring-2 transition-all font-bold ${
                      errors.phone ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-yellow-500'
                    }`}
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1 font-bold">{errors.phone}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-black text-gray-900 mb-2">Upload Business Logo (Optional)</label>
                <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 flex flex-col items-center justify-center gap-4 bg-white/50 hover:bg-white transition-all cursor-pointer group">
                   <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-yellow-100 group-hover:text-yellow-600 transition-all">
                      <Upload size={20} />
                   </div>
                   <span className="font-bold text-sm text-gray-400 group-hover:text-gray-900 transition-colors">Recommended size 500x500px (PNG/JPG)</span>
                   <button className="bg-gray-100 px-6 py-2 rounded-lg font-black text-xs uppercase tracking-widest text-gray-600 group-hover:bg-yellow-500 group-hover:text-black transition-all">Upload Image</button>
                </div>
              </div>

              <div className="space-y-4 pt-4">
                 <div>
                   <label className="flex items-center gap-3 cursor-pointer">
                      <input 
                        id="confirmedAccurate"
                        type="checkbox" 
                        className="w-5 h-5 rounded accent-yellow-500 transition-all" 
                        checked={confirmedAccurate}
                        onChange={(e) => setConfirmedAccurate(e.target.checked)}
                      />
                      <span className="text-sm font-bold text-gray-600">I Confirm The Information Provided Is Accurate</span>
                   </label>
                   {errors.confirmedAccurate && <p className="text-red-500 text-xs mt-1 font-bold pl-8">{errors.confirmedAccurate}</p>}
                 </div>
                 <div>
                   <label className="flex items-center gap-3 cursor-pointer">
                      <input 
                        id="agreedToTerms"
                        type="checkbox" 
                        className="w-5 h-5 rounded accent-yellow-500 transition-all" 
                        checked={agreedToTerms}
                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                      />
                      <span className="text-sm font-bold text-gray-600">I Agree To The <span className="text-yellow-600 underline">Terms & Privacy Policy</span></span>
                   </label>
                   {errors.agreedToTerms && <p className="text-red-500 text-xs mt-1 font-bold pl-8">{errors.agreedToTerms}</p>}
                 </div>
              </div>

              <div className="flex items-center gap-12 pt-4">
                 <div className="flex flex-wrap gap-12">
                   <div className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest">
                     <Check size={16} className="text-yellow-500" /> Free to register
                   </div>
                   <div className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest">
                     <Check size={16} className="text-yellow-500" /> No credit card required
                   </div>
                   <div className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest">
                     <Check size={16} className="text-yellow-500" /> Edit anytime
                   </div>
                 </div>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center mt-12 bg-white/30 p-2 rounded-3xl">
             <button 
              id="btnPrevious"
              onClick={handleBack}
              className="flex items-center gap-2 px-8 py-5 rounded-2xl font-black text-gray-900 hover:bg-gray-100 transition-all uppercase tracking-widest text-sm"
             >
              <ChevronLeft size={20} /> Previous
             </button>
             <button 
              id="btnNext"
              onClick={handleNext}
              className="flex items-center gap-3 px-12 py-5 rounded-2xl font-black bg-yellow-500 text-black hover:bg-yellow-600 transition-all shadow-xl active:scale-95 uppercase tracking-widest text-sm"
             >
              {step === 3 ? 'Complete Registration' : 'Continue'} <ChevronRight size={20} />
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
