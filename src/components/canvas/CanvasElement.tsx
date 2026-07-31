// src/components/canvas/CanvasElement.tsx
import React, { useState, useEffect } from "react";
import { WebsiteElement } from "../../types/index";
import { useWebsiteStore } from "../../store/websiteStore";
import {
  Trash2,
  Image as ImageIcon,
  Loader2,
  Menu,
  X,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Globe,
} from "lucide-react";
import api from "../../api/axios";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface CanvasElementProps {
  element: WebsiteElement;
  isSelected: boolean;
  isPreviewMode: boolean;
  paymentOptionActive?: boolean;
  campaignId?: string;
  isStripeConnected?: boolean;
}

const CanvasElement: React.FC<CanvasElementProps> = ({
  element,
  isSelected,
  isPreviewMode,
  paymentOptionActive,
  campaignId,
  isStripeConnected,
}) => {
  const { setSelectedElement, removeElement, selectedElement, devicePreview, currentWebsite } = useWebsiteStore();
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
  const [donationAmount, setDonationAmount] = useState<string>("25");
  const [customAmount, setCustomAmount] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobileView =
    devicePreview === "mobile" ||
    (devicePreview !== "tablet" && windowWidth < 768);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isPreviewMode) {
      setSelectedElement(element.id);
    }
  };

  const getElementStyle = () => {
    const inheritedFont = currentWebsite?.globalStyles?.fontFamily || "Inter";
    return {
      ...element.styles,
      fontFamily: element.styles.fontFamily || inheritedFont,
      cursor: isPreviewMode ? "default" : "pointer",
    };
  };

  const renderElement = () => {
    switch (element.type) {
      case "heading":
        return (
          <div
            id={element.styles.anchorId || element.id}
            onClick={handleClick}
            className={`relative p-8 rounded-[1.5rem] cursor-pointer transition-all border-2 ${
              isSelected
                ? "border-yellow-400 ring-4 ring-yellow-400/10"
                : "border-transparent hover:border-gray-100 hover:bg-gray-50/30"
            }`}
          >
            {isSelected && (
              <div className="absolute -top-4 -right-4 flex gap-2 z-20">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeElement(element.id);
                  }}
                  className="p-3 bg-red-500 text-white rounded-xl shadow-lg hover:bg-red-600 transition-all active:scale-90"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )}
            <h2
              dangerouslySetInnerHTML={{ __html: element.content }}
              style={getElementStyle()}
            />
          </div>
        );

      case "text":
        return (
          <div
            id={element.styles.anchorId || element.id}
            onClick={handleClick}
            className={`relative p-8 rounded-[1.5rem] cursor-pointer transition-all border-2 prose max-w-none ${
              isSelected
                ? "border-yellow-400 ring-4 ring-yellow-400/10"
                : "border-transparent hover:border-gray-100 hover:bg-gray-50/30"
            }`}
            style={getElementStyle()}
          >
            {isSelected && (
              <div className="absolute -top-4 -right-4 flex gap-2 z-20">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeElement(element.id);
                  }}
                  className="p-3 bg-red-500 text-white rounded-xl shadow-lg hover:bg-red-600 transition-all active:scale-90"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )}
            <div dangerouslySetInnerHTML={{ __html: element.content }} />
          </div>
        );

      case "button":
        return (
          <div
            id={element.styles.anchorId || element.id}
            onClick={handleClick}
            className={`relative inline-block p-4 rounded-[1.5rem] cursor-pointer transition-all border-2 ${
              isSelected
                ? "border-yellow-400 ring-4 ring-yellow-400/10"
                : "border-transparent hover:border-gray-100"
            }`}
          >
            {isSelected && (
              <div className="absolute -top-4 -right-4 flex gap-2 z-20">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeElement(element.id);
                  }}
                  className="p-3 bg-red-500 text-white rounded-xl shadow-lg hover:bg-red-600 transition-all active:scale-90"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )}
            {element.styles.href ? (
              <a
                href={element.styles.href}
                style={{ textDecoration: "none" }}
                onClick={(e) => {
                  if (isPreviewMode) {
                    e.stopPropagation();
                    const href = element.styles.href;
                    if (href && href.startsWith("#")) {
                      e.preventDefault();
                      const targetEl = document.getElementById(href.substring(1));
                      if (targetEl) {
                        targetEl.scrollIntoView({ behavior: "smooth" });
                      }
                    }
                  } else {
                    e.preventDefault();
                  }
                }}
              >
                <button
                  style={getElementStyle()}
                  className="transition-opacity hover:opacity-90 font-bold"
                >
                  {element.content}
                </button>
              </a>
            ) : (
              <button
                style={getElementStyle()}
                className="transition-opacity hover:opacity-90 font-bold"
              >
                {element.content}
              </button>
            )}
          </div>
        );

      case "image":
        const imgStyles = getElementStyle();
        return (
          <div
            id={element.styles.anchorId || element.id}
            onClick={handleClick}
            className={`relative rounded-[1.5rem] cursor-pointer transition-all border-2 overflow-hidden ${
              isSelected
                ? "border-yellow-400 ring-4 ring-yellow-400/10"
                : "border-transparent hover:border-gray-100"
            }`}
            style={{
              width: imgStyles.width || "100%",
              maxWidth: imgStyles.maxWidth || "100%",
              margin: imgStyles.margin || "0 auto",
            }}
          >
            {isSelected && (
              <div className="absolute top-4 right-4 flex gap-2 z-20">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeElement(element.id);
                  }}
                  className="p-3 bg-red-500 text-white rounded-xl shadow-lg hover:bg-red-600 transition-all active:scale-90"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )}
            {element.content ? (
              <img
                src={element.content}
                alt="Content"
                style={{
                  width: "100%",
                  height: imgStyles.height || "auto",
                  borderRadius: imgStyles.borderRadius || "8px",
                  objectFit: "cover",
                }}
              />
            ) : (
              <div className="aspect-[16/9] bg-gray-100 rounded-3xl flex items-center justify-center text-gray-300">
                <ImageIcon size={48} strokeWidth={1} />
              </div>
            )}
          </div>
        );

      case "video":
        const vidStyles = getElementStyle();
        return (
          <div
            id={element.styles.anchorId || element.id}
            onClick={handleClick}
            className={`relative rounded-[1.5rem] cursor-pointer transition-all border-2 overflow-hidden ${
              isSelected
                ? "border-yellow-400 ring-4 ring-yellow-400/10"
                : "border-transparent hover:border-gray-100"
            }`}
            style={{
              width: vidStyles.width || "100%",
              maxWidth: vidStyles.maxWidth || "100%",
              margin: vidStyles.margin || "0 auto",
            }}
          >
            {isSelected && (
              <div className="absolute top-4 right-4 flex gap-2 z-20">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeElement(element.id);
                  }}
                  className="p-3 bg-red-500 text-white rounded-xl shadow-lg hover:bg-red-600 transition-all active:scale-90"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )}
            <iframe
              src={element.content}
              style={{
                width: "100%",
                height: vidStyles.height || "400px",
                borderRadius: vidStyles.borderRadius || "8px",
                border: "none",
              }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full rounded-2xl"
            />
          </div>
        );

      case "form":
        const fields = element.styles.formFields || [
          { id: "1", type: "text", label: "Name", placeholder: "Your name", required: true },
          { id: "2", type: "email", label: "Email", placeholder: "your@email.com", required: true }
        ];
        return (
          <div
            id={element.styles.anchorId || element.id}
            onClick={handleClick}
            className={`relative p-8 rounded-[1.5rem] cursor-pointer transition-all border-2 ${
              isSelected
                ? "border-yellow-400 ring-4 ring-yellow-400/10"
                : "border-transparent hover:border-gray-100 hover:bg-gray-50/30"
            }`}
            style={getElementStyle()}
          >
            {isSelected && (
              <div className="absolute -top-4 -right-4 flex gap-2 z-20">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeElement(element.id);
                  }}
                  className="p-3 bg-red-500 text-white rounded-xl shadow-lg hover:bg-red-600 transition-all active:scale-90"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )}
            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
              <div className="h-[1px] bg-gray-100 w-full mb-2" />
              {fields.map((field: any) => {
                const labelText = field.label || "";
                const isRequired = field.required || false;
                
                return (
                  <div key={field.id} className="space-y-1.5 text-left">
                    {labelText && (
                      <label className="block text-xs font-black text-gray-700 uppercase tracking-wide">
                        {labelText} {isRequired && <span className="text-red-500">*</span>}
                      </label>
                    )}
                    {field.type === "textarea" ? (
                      <textarea
                        className="w-full px-4 py-3 border border-gray-100 rounded-xl text-sm bg-gray-50 focus:bg-white transition-all outline-none focus:ring-2 focus:ring-yellow-500/25"
                        placeholder={field.placeholder || ""}
                        required={isRequired}
                        rows={3}
                      />
                    ) : field.type === "select" ? (
                      <select
                        className="w-full px-4 py-3 border border-gray-100 rounded-xl text-sm bg-gray-50 focus:bg-white transition-all outline-none focus:ring-2 focus:ring-yellow-500/25 font-medium"
                        required={isRequired}
                      >
                        {(field.options || "Option 1, Option 2").split(",").map((opt: string, i: number) => (
                          <option key={i} value={opt.trim()}>{opt.trim()}</option>
                        ))}
                      </select>
                    ) : field.type === "checkbox" ? (
                      <label className="flex items-center gap-2 py-1 cursor-pointer">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-yellow-500 border-gray-200 rounded focus:ring-yellow-500"
                          required={isRequired}
                        />
                        <span className="text-xs font-bold text-gray-500">{field.placeholder || "Agree to terms"}</span>
                      </label>
                    ) : (
                      <input
                        type={field.type}
                        className="w-full px-4 py-3 border border-gray-100 rounded-xl text-sm bg-gray-50 focus:bg-white transition-all outline-none focus:ring-2 focus:ring-yellow-500/25"
                        placeholder={field.placeholder || ""}
                        required={isRequired}
                      />
                    )}
                  </div>
                );
              })}
              <button
                type="submit"
                className="px-6 py-3 bg-yellow-500 text-black rounded-xl font-black text-xs uppercase tracking-widest hover:bg-yellow-600 transition-all cursor-pointer shadow-sm"
              >
                {element.styles.submitText || "Submit"}
              </button>
            </form>

            {/* Donate Button */}
            {paymentOptionActive && isStripeConnected && (
              <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col items-center">
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Support this campaign</p>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (isPreviewMode) {
                      setIsDonationModalOpen(true);
                    }
                  }}
                  style={{
                    backgroundColor: element.styles.donateBgColor || "#EF4444",
                    color: element.styles.donateColor || "#FFFFFF",
                  }}
                  className="w-full sm:w-auto px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest text-center shadow-md hover:opacity-90 transition-all hover:scale-[1.02] active:scale-[0.98] inline-block cursor-pointer"
                >
                  {element.styles.donateText || "Donate Now"}
                </a>
              </div>
            )}

            {/* Donation Modal */}
            {isDonationModalOpen && (
              <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                <div 
                  className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-2xl w-full max-w-md space-y-8 animate-in zoom-in-95 duration-200"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="text-center space-y-2">
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Support Campaign</h3>
                    <p className="text-slate-400 font-bold text-xs max-w-xs mx-auto leading-relaxed">
                      Select or enter a donation amount. 100% of your funds (minus platform fees) will go directly to the campaign owner.
                    </p>
                  </div>

                  {errorMessage && (
                    <div className="p-4 bg-red-50 text-red-600 rounded-xl text-xs font-bold border border-red-100 flex items-center gap-2">
                      <span>⚠️ {errorMessage}</span>
                    </div>
                  )}

                  {/* Quick Select Buttons */}
                  <div className="grid grid-cols-4 gap-3">
                    {["10", "25", "50", "100"].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => {
                          setDonationAmount(amt);
                          setCustomAmount("");
                        }}
                        className={`py-4 rounded-2xl font-black text-sm transition-all border-2 ${
                          donationAmount === amt && !customAmount
                            ? "bg-yellow-500 text-black border-yellow-500 shadow-lg scale-105"
                            : "bg-slate-50 text-slate-700 border-transparent hover:bg-slate-100"
                        }`}
                      >
                        ${amt}
                      </button>
                    ))}
                  </div>

                  {/* Custom Amount Input */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-slate-400 font-bold text-sm">
                      $
                    </div>
                    <input
                      type="number"
                      placeholder="Custom Amount"
                      value={customAmount}
                      onChange={(e) => {
                        setCustomAmount(e.target.value);
                        setDonationAmount("");
                      }}
                      className="w-full pl-10 pr-5 py-4 rounded-2xl border border-slate-200 bg-slate-50 font-bold text-sm focus:ring-2 focus:ring-yellow-500 outline-none transition-all"
                      min="1"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setIsDonationModalOpen(false)}
                      className="w-1/2 py-4 border border-slate-200 hover:bg-slate-50 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-500 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={async () => {
                        const finalAmount = parseFloat(customAmount || donationAmount);
                        if (!finalAmount || isNaN(finalAmount) || finalAmount <= 0) {
                          setErrorMessage("Please select or enter a valid amount.");
                          return;
                        }
                        if (!campaignId) {
                          setErrorMessage("Internal error: campaign ID is missing.");
                          return;
                        }

                        setIsSubmitting(true);
                        setErrorMessage("");
                        try {
                          const response = await api.post("/payments/donate/checkout", {
                            campaignId,
                            amount: finalAmount
                          });
                          if (response.data.success && response.data.checkoutUrl) {
                            window.location.href = response.data.checkoutUrl;
                          } else {
                            setErrorMessage(response.data.message || "Failed to generate checkout link.");
                          }
                        } catch (err: any) {
                          console.error("Donation session error:", err);
                          setErrorMessage(err.response?.data?.message || "Failed to generate payment session. Please try again.");
                        } finally {
                          setIsSubmitting(false);
                        }
                      }}
                      className="w-1/2 py-4 bg-slate-900 text-white hover:bg-black disabled:bg-slate-300 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-white" />
                          Processing...
                        </>
                      ) : (
                        "Donate"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case "grid":
        return (
          <div
            id={element.styles.anchorId || element.id}
            onClick={handleClick}
            className={`relative p-8 rounded-[1.5rem] cursor-pointer transition-all border-2 ${
              isSelected
                ? "border-yellow-400 ring-4 ring-yellow-400/10"
                : "border-transparent hover:border-gray-100 hover:bg-gray-50/30"
            }`}
            style={{
              ...getElementStyle(),
              display: "grid",
              gridTemplateColumns: isMobileView
                ? "1fr"
                : `repeat(${element.styles.gridColumns || 2}, 1fr)`,
              gap: element.styles.gap || "20px",
            }}
          >
            {isSelected && (
              <div className="absolute -top-4 -right-4 flex gap-2 z-20">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeElement(element.id);
                  }}
                  className="p-3 bg-red-500 text-white rounded-xl shadow-lg hover:bg-red-600 transition-all active:scale-90"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )}
            {element.children?.map((child: WebsiteElement) => (
              <CanvasElement
                key={child.id}
                element={child}
                isSelected={selectedElement === child.id}
                isPreviewMode={isPreviewMode}
                paymentOptionActive={paymentOptionActive}
                campaignId={campaignId}
                isStripeConnected={isStripeConnected}
              />
            ))}
          </div>
        );

      case "columns":
        return (
          <div
            id={element.styles.anchorId || element.id}
            onClick={handleClick}
            className={`relative p-8 rounded-[1.5rem] cursor-pointer transition-all border-2 ${
              isSelected
                ? "border-yellow-400 ring-4 ring-yellow-400/10"
                : "border-transparent hover:border-gray-100 hover:bg-gray-50/30"
            }`}
            style={{
              ...getElementStyle(),
              display: "grid",
              gridTemplateColumns: isMobileView
                ? "1fr"
                : `repeat(${element.styles.gridColumns || 2}, 1fr)`,
              gap: element.styles.gap || "20px",
            }}
          >
            {isSelected && (
              <div className="absolute -top-4 -right-4 flex gap-2 z-20">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeElement(element.id);
                  }}
                  className="p-3 bg-red-500 text-white rounded-xl shadow-lg hover:bg-red-600 transition-all active:scale-90"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )}
            {element.children?.map((child: WebsiteElement) => (
              <CanvasElement
                key={child.id}
                element={child}
                isSelected={selectedElement === child.id}
                isPreviewMode={isPreviewMode}
                paymentOptionActive={paymentOptionActive}
                campaignId={campaignId}
                isStripeConnected={isStripeConnected}
              />
            ))}
          </div>
        );

      case "slider":
        return (
          <div
            id={element.styles.anchorId || element.id}
            onClick={handleClick}
            className={`relative p-8 rounded-[1.5rem] cursor-pointer transition-all border-2 ${
              isSelected
                ? "border-yellow-400 ring-4 ring-yellow-400/10"
                : "border-transparent hover:border-gray-100 hover:bg-gray-50/30"
            }`}
            style={getElementStyle()}
          >
            {isSelected && (
              <div className="absolute top-4 right-4 flex gap-2 z-20">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeElement(element.id);
                  }}
                  className="p-3 bg-red-500 text-white rounded-xl shadow-lg hover:bg-red-600 transition-all active:scale-90"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )}
            
            {/* Slider Content Overlay */}
            {element.content && (
              <div 
                className="absolute inset-0 z-10 flex items-center justify-center p-8 pointer-events-none"
              >
                <div 
                  className="prose max-w-none text-center pointer-events-auto"
                  dangerouslySetInnerHTML={{ __html: element.content }} 
                />
              </div>
            )}

            {element.children && element.children.length > 0 ? (
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={0}
                slidesPerView={1}
                navigation
                pagination={{ clickable: true }}
                autoplay={element.styles.autoplay ? { delay: 3000, disableOnInteraction: false } : false}
                className="w-full h-full rounded-[1.5rem] overflow-hidden"
              >
                {element.children.map((child: WebsiteElement) => (
                  <SwiperSlide key={child.id}>
                    <img 
                      src={child.content} 
                      alt="Slide" 
                      className="w-full h-full object-cover" 
                      style={{...child.styles, aspectRatio: child.styles.aspectRatio || "16/9"}} 
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <div className="p-8 text-center bg-gray-50 rounded-2xl">
                <h3 className="font-black text-lg text-gray-900 mb-4">
                  Empty Slider
                </h3>
                <p className="text-gray-400 font-medium">
                  Add images in the properties panel to create a slider
                </p>
              </div>
            )}
          </div>
        );

      case "navbar": {
        const navStyles = getElementStyle();
        const logo = element.styles.logoText || "My Campaign";
        const links = element.styles.navLinks || [];
        const showBtn = element.styles.showDonateBtn !== false;
        const btnText = element.styles.donateBtnText || "Donate Now";
        const btnHref = element.styles.donateBtnHref || "#donate";

        return (
          <div
            id={element.styles.anchorId || element.id}
            onClick={handleClick}
            className={`relative rounded-[1.5rem] transition-all border-2 ${
              isSelected
                ? "border-yellow-400 ring-4 ring-yellow-400/10"
                : "border-transparent hover:border-gray-100 hover:bg-gray-50/30"
            }`}
          >
            {isSelected && (
              <div className="absolute -top-4 -right-4 flex gap-2 z-20">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeElement(element.id);
                  }}
                  className="p-3 bg-red-500 text-white rounded-xl shadow-lg hover:bg-red-600 transition-all active:scale-90"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )}

            <header
              style={navStyles}
              className="w-full flex justify-between items-center relative py-4 px-6 md:px-8 rounded-2xl shadow-sm border border-gray-100"
            >
              {/* Logo */}
              <div className="text-lg font-black tracking-tight" style={{ color: navStyles.color }}>
                {logo}
              </div>

              {/* Desktop Navigation Links */}
              {!isMobileView && (
                <nav className="flex items-center gap-6">
                  {links.map((link: any, i: number) => (
                    <a
                      key={i}
                      href={link.href}
                      onClick={(e) => {
                        if (isPreviewMode) {
                          e.stopPropagation();
                          const href = link.href;
                          if (href && href.startsWith("#")) {
                            e.preventDefault();
                            const targetId = href.substring(1);
                            const targetEl = document.getElementById(targetId);
                            if (targetEl) {
                              targetEl.scrollIntoView({ behavior: "smooth" });
                            }
                          }
                        } else {
                          e.preventDefault();
                          handleClick(e);
                        }
                      }}
                      className="text-sm font-bold opacity-85 hover:opacity-100 transition-opacity"
                      style={{ color: navStyles.color }}
                    >
                      {link.label}
                    </a>
                  ))}
                </nav>
              )}

              {/* Desktop CTA Button */}
              {!isMobileView && showBtn && (
                <a
                  href={btnHref}
                  onClick={(e) => {
                    if (isPreviewMode) {
                      e.stopPropagation();
                      if (btnHref && btnHref.startsWith("#")) {
                        e.preventDefault();
                        const targetId = btnHref.substring(1);
                        const targetEl = document.getElementById(targetId);
                        if (targetEl) {
                          targetEl.scrollIntoView({ behavior: "smooth" });
                        }
                      }
                    } else {
                      e.preventDefault();
                      handleClick(e);
                    }
                  }}
                  className="px-5 py-2.5 bg-yellow-500 hover:bg-yellow-600 text-black text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-sm"
                >
                  {btnText}
                </a>
              )}

              {/* Mobile Hamburger Button */}
              {isMobileView && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMobileMenuOpen(!isMobileMenuOpen);
                  }}
                  className="p-2 rounded-lg hover:bg-black/5 active:scale-95 transition-all"
                  style={{ color: navStyles.color }}
                >
                  {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
              )}

              {/* Mobile Dropdown Menu Drawer */}
              {isMobileView && isMobileMenuOpen && (
                <div
                  className="absolute top-full left-0 right-0 mt-2 p-6 rounded-2xl shadow-xl flex flex-col gap-4 border border-gray-100/50 z-40 animate-in fade-in slide-in-from-top-2 duration-200"
                  style={{
                    backgroundColor: navStyles.backgroundColor || "#ffffff",
                    color: navStyles.color || "#111827",
                  }}
                >
                  <nav className="flex flex-col gap-3">
                    {links.map((link: any, i: number) => (
                      <a
                        key={i}
                        href={link.href}
                        onClick={(e) => {
                          setIsMobileMenuOpen(false);
                          if (isPreviewMode) {
                            e.stopPropagation();
                            const href = link.href;
                            if (href && href.startsWith("#")) {
                              e.preventDefault();
                              const targetId = href.substring(1);
                              const targetEl = document.getElementById(targetId);
                              if (targetEl) {
                                targetEl.scrollIntoView({ behavior: "smooth" });
                              }
                            }
                          } else {
                            e.preventDefault();
                            handleClick(e);
                          }
                        }}
                        className="py-2 text-sm font-bold border-b border-gray-100/10 opacity-85 hover:opacity-100"
                        style={{ color: navStyles.color }}
                      >
                        {link.label}
                      </a>
                    ))}
                  </nav>
                  {showBtn && (
                    <a
                      href={btnHref}
                      onClick={(e) => {
                        setIsMobileMenuOpen(false);
                        if (isPreviewMode) {
                          e.stopPropagation();
                          if (btnHref && btnHref.startsWith("#")) {
                            e.preventDefault();
                            const targetId = btnHref.substring(1);
                            const targetEl = document.getElementById(targetId);
                            if (targetEl) {
                              targetEl.scrollIntoView({ behavior: "smooth" });
                            }
                          }
                        } else {
                          e.preventDefault();
                          handleClick(e);
                        }
                      }}
                      className="w-full text-center py-3 bg-yellow-500 hover:bg-yellow-600 text-black text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-sm"
                    >
                      {btnText}
                    </a>
                  )}
                </div>
              )}
            </header>
          </div>
        );
      }

      case "footer": {
        const footerStyles = getElementStyle();
        const copyright = element.styles.copyrightText || "© 2026 My Campaign. All rights reserved.";
        const fb = element.styles.facebookUrl;
        const tw = element.styles.twitterUrl;
        const ig = element.styles.instagramUrl;
        const yt = element.styles.youtubeUrl;

        const hasSocials = fb || tw || ig || yt;

        return (
          <div
            id={element.styles.anchorId || element.id}
            onClick={handleClick}
            className={`relative rounded-[1.5rem] transition-all border-2 ${
              isSelected
                ? "border-yellow-400 ring-4 ring-yellow-400/10"
                : "border-transparent hover:border-gray-100 hover:bg-gray-50/30"
            }`}
          >
            {isSelected && (
              <div className="absolute -top-4 -right-4 flex gap-2 z-20">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeElement(element.id);
                  }}
                  className="p-3 bg-red-500 text-white rounded-xl shadow-lg hover:bg-red-600 transition-all active:scale-90"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )}

            <footer
              style={footerStyles}
              className="w-full rounded-2xl flex flex-col md:flex-row justify-between items-center gap-6 py-8 px-6 md:px-8 shadow-sm border border-gray-100"
            >
              {/* Copyright */}
              <div className="text-xs opacity-80 font-semibold text-center md:text-left">
                {copyright}
              </div>

              {/* Social Links */}
              {hasSocials && (
                <div className="flex gap-4 items-center">
                  {fb && (
                    <a
                      href={fb}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => isPreviewMode ? e.stopPropagation() : e.preventDefault()}
                      className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition-colors text-inherit"
                      title="Facebook"
                    >
                      <Facebook size={18} />
                    </a>
                  )}
                  {tw && (
                    <a
                      href={tw}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => isPreviewMode ? e.stopPropagation() : e.preventDefault()}
                      className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition-colors text-inherit"
                      title="Twitter"
                    >
                      <Twitter size={18} />
                    </a>
                  )}
                  {ig && (
                    <a
                      href={ig}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => isPreviewMode ? e.stopPropagation() : e.preventDefault()}
                      className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition-colors text-inherit"
                      title="Instagram"
                    >
                      <Instagram size={18} />
                    </a>
                  )}
                  {yt && (
                    <a
                      href={yt}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => isPreviewMode ? e.stopPropagation() : e.preventDefault()}
                      className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition-colors text-inherit"
                      title="YouTube"
                    >
                      <Youtube size={18} />
                    </a>
                  )}
                </div>
              )}
            </footer>
          </div>
        );
      }

      default:
        return null;
    }
  };

  return renderElement();
};

export default CanvasElement;
