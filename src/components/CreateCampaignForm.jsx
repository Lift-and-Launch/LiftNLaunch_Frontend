import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function CreateCampaignForm() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    logoFile: null,
    fundingTarget: '',
    equityOffered: '',
    preMoneyValuation: '',
    sharePrice: '',
    deadline: '',
    categories: [''],
    valueHighlights: [''],
    sections: [{ title: '', description: '' }],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files?.[0]) {
      setFormData(prev => ({ ...prev, logoFile: files[0] }));
    }
  };

  const handleSectionChange = (index, field, value) => {
    const updated = [...formData.sections];
    updated[index][field] = value;
    setFormData(prev => ({ ...prev, sections: updated }));
  };

  const addSection = () => {
    setFormData(prev => ({
      ...prev,
      sections: [...prev.sections, { title: '', description: '' }],
    }));
  };

  const handleArrayChange = (field, index, value) => {
    const updated = [...formData[field]];
    updated[index] = value;
    setFormData(prev => ({ ...prev, [field]: updated }));
  };

  const addArrayItem = (field) => {
    setFormData(prev => ({ ...prev, [field]: [...prev[field], ''] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Mock submission
    setTimeout(() => {
      setLoading(false);
      alert('Campaign created successfully (Mock)!');
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto bg-white p-10 rounded-3xl shadow-xl border border-gray-100 space-y-8"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black text-gray-900 mb-2">Create New Campaign</h2>
        <p className="text-gray-500">Launch your vision to the community</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Campaign Title</label>
          <input
            name="title"
            placeholder="e.g. Sustainable Urban Gardens"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-5 py-4 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all font-medium"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Short Description</label>
          <textarea
            name="description"
            placeholder="Tell us what makes your campaign special..."
            value={formData.description}
            onChange={handleChange}
            className="w-full px-5 py-4 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all font-medium min-h-[120px] resize-none"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Logo</label>
                <div className="relative group">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full px-5 py-4 rounded-xl border border-dashed border-gray-300 bg-gray-50 text-gray-500 file:hidden cursor-pointer hover:bg-gray-100 transition-colors"
                        required
                    />
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
                        Upload Image
                    </div>
                </div>
                {formData.logoFile && (
                    <div className="mt-4 p-2 bg-gray-50 rounded-xl border inline-block">
                        <img
                            src={URL.createObjectURL(formData.logoFile)}
                            alt="Logo preview"
                            className="h-20 rounded-lg object-contain"
                        />
                    </div>
                )}
            </div>
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Deadline</label>
                <input
                    name="deadline"
                    type="date"
                    value={formData.deadline}
                    onChange={handleChange}
                    className="w-full px-5 py-4 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all font-medium"
                    required
                />
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Funding Target (£)</label>
                <input
                    name="fundingTarget"
                    type="number"
                    placeholder="50000"
                    value={formData.fundingTarget}
                    onChange={handleChange}
                    className="w-full px-5 py-4 rounded-xl border border-gray-200 outline-none"
                    required
                />
            </div>
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Equity (%)</label>
                <input
                    name="equityOffered"
                    type="number"
                    placeholder="10"
                    value={formData.equityOffered}
                    onChange={handleChange}
                    className="w-full px-5 py-4 rounded-xl border border-gray-200 outline-none"
                    required
                />
            </div>
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Share Price (£)</label>
                <input
                    name="sharePrice"
                    type="number"
                    placeholder="2.50"
                    value={formData.sharePrice}
                    onChange={handleChange}
                    className="w-full px-5 py-4 rounded-xl border border-gray-200 outline-none"
                    required
                />
            </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-4 font-primary">Key Highlights</label>
          <div className="space-y-3">
            {formData.valueHighlights.map((highlight, i) => (
              <input
                key={i}
                type="text"
                placeholder={`Highlight ${i + 1}`}
                value={highlight}
                onChange={e => handleArrayChange('valueHighlights', i, e.target.value)}
                className="w-full px-5 py-4 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all font-medium"
              />
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('valueHighlights')}
              className="text-yellow-600 font-bold text-sm hover:underline"
            >
              + Add another highlight
            </button>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6 font-primary">Campaign Deep Dive</h3>
            {formData.sections.map((section, i) => (
            <div key={i} className="p-6 bg-gray-50 rounded-2xl mb-4 border border-gray-100 space-y-4">
                <input
                    type="text"
                    placeholder="Section Title (e.g. The Problem)"
                    value={section.title}
                    onChange={e => handleSectionChange(i, 'title', e.target.value)}
                    className="w-full px-5 py-3 rounded-xl border border-gray-200 outline-none bg-white font-bold"
                    required
                />
                <textarea
                    placeholder="Section Content..."
                    value={section.description}
                    onChange={e => handleSectionChange(i, 'description', e.target.value)}
                    className="w-full px-5 py-3 rounded-xl border border-gray-200 outline-none bg-white min-h-[100px] resize-none"
                    required
                />
            </div>
            ))}
            <button
                type="button"
                onClick={addSection}
                className="w-full py-4 border-2 border-dashed border-gray-300 rounded-2xl text-gray-400 font-bold hover:border-yellow-400 hover:text-yellow-600 transition-all mb-4"
            >
                + Add Section
            </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-black py-5 rounded-2xl shadow-xl hover:shadow-2xl transition-all disabled:opacity-50 text-xl tracking-tight"
      >
        {loading ? (
            <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-6 w-6 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
            </span>
        ) : 'Publish Campaign'}
      </button>
    </form>
  );
}
