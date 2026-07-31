import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Globe,
  Building2,
  Linkedin,
  Info,
  CheckCircle,
  Lock,
  Instagram,
  Facebook,
  Lightbulb,
} from "lucide-react";
import api from "../api/axios";

const galleryImages = [
  "/campaign/Image (17).png",
  "/campaign/Image (13).png",
  "/campaign/Image (14).png",
  "/campaign/Image (15).png",
  "/campaign/Image (16).png",
];

const CampaignDetails = () => {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [selectedImage, setSelectedImage] = useState(galleryImages[0]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaignDetails = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/campaigns/public/${id}`);
        if (response.data.success) {
          const c = response.data.data;
          setCampaign({
            id: c._id,
            title: c.campaignName,
            description: c.description || c.businessInfo?.description,
            amountRaised: 0,
            fundingTarget: c.configuration?.fundingTarget || 0,
            investorCount: 0,
            equityOffered: c.configuration?.equityOffered || 0,
            preMoneyValuation: c.configuration?.preMoneyValuation || 0,
            sharePrice: c.configuration?.sharePrice || 0,
            logoUrl: c.businessInfo?.logoUrl || "/campaign/logo.png",
            galleryImages: c.businessInfo?.galleryUrls?.length ? c.businessInfo.galleryUrls : galleryImages,
            valueHighlights: c.configuration?.highlights || [],
            sections: [] // Maps to custom sections if added later
          });
          if (c.businessInfo?.galleryUrls?.length) {
            setSelectedImage(c.businessInfo.galleryUrls[0]);
          }
        }
      } catch (error) {
        console.error("Error fetching campaign details", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaignDetails();
  }, [id]);

  if (loading) return <div className="p-20 text-center">Loading...</div>;
  if (!campaign) return <div className="p-20 text-center">Campaign not found.</div>;

  return (
    <div className="bg-white text-black mt-5">
      {/* Hero + Gallery */}
      <section>
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] rounded-xl overflow-hidden">
            <img
              src={selectedImage}
              alt="Hero"
              className="object-cover w-full h-full rounded-xl"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto py-4">
            {(campaign.galleryImages || galleryImages).map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(img)}
                className={`min-w-[80px] h-[60px] overflow-hidden rounded-md border-2 ${
                  selectedImage === img
                    ? "border-yellow-400"
                    : "border-transparent"
                }`}
              >
                <img
                  src={img}
                  alt={`thumb-${i}`}
                  className="object-cover w-full h-full"
                />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-screen-xl mx-auto px-6 grid md:grid-cols-3 gap-12">
          {/* Left Column */}
          <div className="md:col-span-2 space-y-10">
            {/* Logo + Title + Description */}
            <div className="flex items-start gap-4">
              <img
                src={campaign.logoUrl || "/campaign/logo.png"}
                alt={campaign.title}
                className="w-12 h-12 rounded"
              />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {campaign.title}
                </h1>
                <p className="text-gray-600 mt-2 text-[15px] leading-relaxed">
                  {campaign.description}
                </p>
              </div>
            </div>

            {/* Key Info Section */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Lightbulb size={25} className="text-gray-700" /> Key information
                </h2>
                <div className="flex items-center gap-4 text-sm text-blue-600">
                  <a href="#" className="hover:underline flex items-center gap-1">
                    <Globe size={16} /> Website
                  </a>
                  <a href="#" className="hover:underline flex items-center gap-1">
                    <Building2 size={16} /> Companies House
                  </a>
                  <a href="#" className="hover:underline flex items-center gap-1">
                    <Linkedin size={16} />
                  </a>
                  <a href="#" className="hover:underline">
                    <Instagram size={16} />
                  </a>
                  <a href="#" className="hover:underline">
                    <Facebook size={16}/>
                  </a>
                </div>
              </div>

              {/* Key Info Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 bg-gray-50 p-6 rounded-xl shadow text-center text-sm">
                <div>
                  <p className="text-gray-500 text-xs font-medium">RAISED</p>
                  <p className="font-bold text-lg">£{campaign.amountRaised?.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs font-medium">INVESTORS</p>
                  <p className="font-bold text-lg">{campaign.investorCount}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs font-medium">TARGET</p>
                  <p className="font-bold text-lg">£{campaign.fundingTarget?.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs font-medium">EQUITY</p>
                  <p className="font-bold text-lg">{campaign.equityOffered}%</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs font-medium">PRE-MONEY VALUATION</p>
                  <p className="font-bold text-lg">£{campaign.preMoneyValuation?.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs font-medium">SHARE PRICE</p>
                  <p className="font-bold text-lg">£{campaign.sharePrice}</p>
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-[#fdf8f3] border rounded-lg px-4 py-3 text-sm flex items-start gap-3">
                <Info size={18} className="text-gray-500 mt-0.5" />
                <p className="text-gray-700 leading-relaxed">
                  Forms part of a wider round, in which the Company had already
                  raised <strong>£1,244,000</strong> as further additional
                  investment alongside the crowdfunding element, which was
                  reflected onto the progress bar.
                </p>
              </div>

              {/* Value Highlights List */}
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                {(campaign.valueHighlights || []).map((highlight, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <CheckCircle className="text-orange-400 mt-1" size={18} />
                    <p>{highlight}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Sections */}
            <div className="space-y-6 pt-10 border-t mt-10">
              {(campaign.sections || []).map((section, idx) => (
                <div key={idx}>
                  <h3 className="text-base font-semibold mb-1 text-gray-800">
                    {section.title}
                  </h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {section.description}
                  </p>
                </div>
              ))}
            </div>

            <section className="bg-[#0a0b4f] py-16 px-6 mt-16 rounded-2xl">
              <div className="max-w-md mx-auto text-white text-center">
                <h2 className="text-xl font-bold leading-snug mb-4">
                  To see the rest of this opportunity, join now. It’s free,
                  quick and easy.
                </h2>
                <p className="text-sm text-gray-200 mb-6">
                  Due to financial regulations, you need to join our community
                  to view the full investment opportunity.
                </p>
                <Link to="/signup" className="bg-yellow-400 text-black px-6 py-2 rounded-full font-medium hover:bg-yellow-500 transition w-full mb-3 inline-block">
                  Join Crowdcube today
                </Link>
                <p className="text-sm text-gray-300">
                  Already a member?{" "}
                  <Link to="/signin" className="underline">
                    Log in
                  </Link>
                </p>
                <div className="flex justify-center mt-6">
                  <img src="/campaign/padlock.png" alt="lock bag" className="w-24 h-24" />
                </div>
              </div>
            </section>
          </div>

          {/* Right Sidebar */}
          <aside className="bg-gray-50 p-6 rounded-xl shadow-md sticky top-24 h-fit">
            <p className="text-sm font-medium text-gray-500 mb-1">
              £{campaign.amountRaised?.toLocaleString()} raised
            </p>
            <p className="text-xs text-gray-400 mb-4">
              {Math.round((campaign.amountRaised/campaign.fundingTarget)*100)}% of target · {campaign.investorCount} investors
            </p>
            <p className="text-sm font-semibold text-gray-800 mb-2">
              Invest in {campaign.title}
            </p>
            <p className="text-sm text-gray-500 mb-4">
              It’s free, quick and easy to sign up.
            </p>
            <Link to="/signup" className="bg-yellow-400 w-full py-2 rounded-full font-medium mb-2 hover:bg-yellow-500 inline-block text-center">
              Join to invest
            </Link>
            <Link to="/signin" className="border border-gray-300 w-full py-2 rounded-full font-medium hover:bg-gray-100 inline-block text-center">
              Login
            </Link>

            <p className="text-xs text-gray-400 mt-4">
              Last investment <strong>14 minutes ago</strong>
            </p>

            <ul className="mt-6 text-sm text-gray-600 space-y-2 border-t pt-4">
              <li className="font-semibold">Key information</li>
              <li className="opacity-50 flex items-center gap-2">
                <Lock size={14} /> Summary of Key Information and Risks
              </li>
              <li className="opacity-50 flex items-center gap-2">
                <Lock size={14} /> Updates
              </li>
              <li className="opacity-50 flex items-center gap-2">
                <Lock size={14} /> Discussion
              </li>
            </ul>
          </aside>
        </div>
      </section>

      {/* Approved & Risk Section */}
      <section className="bg-[#fffdf6] py-16 px-6">
        <div className="max-w-screen-xl mx-auto space-y-12">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              This opportunity is approved by Us
            </h3>
            <p className="text-sm text-gray-700 mb-4">
              This opportunity was approved as a financial promotion by Limited on 22/11/2024.
            </p>
            <a href="#" className="text-sm text-blue-600 underline">Read more</a>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Risk warning</h3>
            <p className="text-sm text-gray-700 mb-4">
              Investing in start–ups and early stage businesses involves risks...
            </p>
            <a href="#" className="text-blue-600 underline">Read full Risk Warning</a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CampaignDetails;
