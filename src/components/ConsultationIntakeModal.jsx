import React, { useEffect } from "react";
import { X } from "lucide-react";
import ConsultationIntakeForm from "./ConsultationIntakeForm";

/**
 * Viewport-aware consultation intake modal.
 * Fills available screen height; only the form body scrolls.
 */
export default function ConsultationIntakeModal({ open, onClose }) {
  useEffect(() => {
    if (!open) return undefined;
    const prevOverflow = document.body.style.overflow;
    const prevPaddingRight = document.body.style.paddingRight;
    const scrollbarGap = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbarGap > 0) {
      document.body.style.paddingRight = `${scrollbarGap}px`;
    }
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPaddingRight;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-stretch sm:items-center justify-center sm:p-4 md:p-6 bg-black/55 backdrop-blur-sm"
      style={{ height: "100dvh" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="consultationIntakeTitle"
    >
      <div
        className="relative flex flex-col w-full sm:max-w-[860px] bg-white sm:rounded-2xl shadow-2xl border-0 sm:border border-gray-200 overflow-hidden
          h-[100dvh] sm:h-auto sm:max-h-[min(92dvh,920px)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Fixed header */}
        <div className="shrink-0 flex items-start justify-between gap-3 px-4 sm:px-6 md:px-8 py-4 sm:py-5 bg-white border-b border-gray-100 safe-pt">
          <div className="min-w-0 pr-2">
            <p className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.18em] text-[#F5C518] mb-0.5 sm:mb-1">
              Lift &amp; Launch
            </p>
            <h2
              id="consultationIntakeTitle"
              className="text-lg sm:text-xl md:text-2xl font-extrabold text-[#001d59] leading-tight"
            >
              Consultation Intake Form
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-gray-500 leading-snug">
              Let&apos;s make your consultation count · ~5–7 minutes
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer shrink-0 p-2.5 rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-700 active:scale-95 transition"
            aria-label="Close consultation form"
          >
            <X size={22} />
          </button>
        </div>

        {/* Scrollable body — fills remaining viewport height */}
        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-4 sm:px-6 md:px-8 py-4 sm:py-6 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
          <ConsultationIntakeForm compact />
        </div>
      </div>
    </div>
  );
}
