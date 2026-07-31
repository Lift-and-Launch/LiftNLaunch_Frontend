// src/components/canvas/Canvas.tsx
import React, { useEffect } from "react";
import { useWebsiteStore } from "../../store/websiteStore";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableCanvasItem } from "./SortableCanvasItem";
import { useAuth } from "../../context/AuthContext";
import { Plus } from "lucide-react";

const Canvas: React.FC = () => {
  const {
    currentWebsite,
    selectedElement,
    setSelectedElement,
    devicePreview,
    isPreviewMode,
    removeElement,
    activeVersion,
    setActiveVersion,
  } = useWebsiteStore();
  const { user } = useAuth();

  const { setNodeRef } = useDroppable({
    id: "canvas-droppable",
  });

  // Keyboard delete support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Delete" || e.key === "Backspace") {
        const target = e.target as HTMLElement;
        if (
          target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable ||
          target.closest('[contenteditable="true"]') ||
          target.closest(".ProseMirror")
        ) {
          return;
        }

        if (selectedElement) {
          e.preventDefault();
          removeElement(selectedElement);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedElement, removeElement]);

  const getDeviceWidth = () => {
    switch (devicePreview) {
      case "mobile":
        return "w-[375px]";
      case "tablet":
        return "w-[768px]";
      default:
        return "w-full";
    }
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setSelectedElement(null);
    }
  };

  const handleToggleABTesting = async () => {
    if (!currentWebsite) return;
    const cid = currentWebsite.campaignId && typeof currentWebsite.campaignId === "object"
      ? currentWebsite.campaignId._id || currentWebsite.campaignId.id
      : currentWebsite.campaignId;
      
    const currentEnabled = currentWebsite.campaignId && typeof currentWebsite.campaignId === "object"
      ? !!currentWebsite.campaignId.abTestingEnabled
      : false;
      
    const newEnabled = !currentEnabled;
    
    try {
      const { default: api } = await import("../../api/axios");
      const res = await api.put(`/campaigns/${cid}`, {
        abTestingEnabled: newEnabled
      });
      if (res.data.success) {
        // Update local state by modifying currentWebsite campaign details
        const updatedWebsite = {
          ...currentWebsite,
          campaignId: {
            ...(typeof currentWebsite.campaignId === "object" ? currentWebsite.campaignId : {}),
            abTestingEnabled: newEnabled
          }
        };
        useWebsiteStore.setState({ currentWebsite: updatedWebsite });
        
        // If disabling A/B testing, revert activeVersion to A
        if (!newEnabled && useWebsiteStore.getState().activeVersion !== "A") {
          await useWebsiteStore.getState().setActiveVersion("A");
        }
      }
    } catch (err) {
      console.error("Failed to toggle A/B testing:", err);
      alert("Failed to update A/B testing settings.");
    }
  };

  const elements = currentWebsite?.elements || [];

  return (
    <div
      className="h-full overflow-y-auto overflow-x-auto bg-gray-100 p-4 md:p-8 custom-scrollbar flex flex-col items-center gap-6"
      onClick={handleCanvasClick}
    >
      {/* A/B Testing Control Bar */}
      {currentWebsite && !isPreviewMode && (
        <div className="w-full max-w-[1200px] bg-white border border-gray-100 rounded-3xl p-5 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4 transition-all duration-300">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl bg-yellow-500/10 flex items-center justify-center text-yellow-600 font-black text-xs uppercase tracking-wider">
              A/B
            </div>
            <div>
              <h4 className="text-sm font-black text-gray-900 tracking-tight uppercase">A/B Split Testing</h4>
              <p className="text-[10px] text-gray-400 font-bold leading-normal max-w-sm mt-0.5">
                Optimize conversion rates by designing two separate variants of your landing page. Traffic will be split 50/50.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* Toggle Switch */}
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                Status: {currentWebsite.campaignId?.abTestingEnabled ? "Enabled" : "Disabled"}
              </span>
              <button
                type="button"
                onClick={handleToggleABTesting}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  currentWebsite.campaignId?.abTestingEnabled ? 'bg-yellow-500' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    currentWebsite.campaignId?.abTestingEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Version Switcher Tabs */}
            {currentWebsite.campaignId?.abTestingEnabled && (
              <div className="flex items-center bg-gray-100 p-1.5 rounded-2xl border border-gray-200/50">
                <button
                  type="button"
                  onClick={() => setActiveVersion("A")}
                  className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 active:scale-95 ${
                    activeVersion === "A"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-400 hover:text-gray-900"
                  }`}
                >
                  Version A
                </button>
                <button
                  type="button"
                  onClick={() => setActiveVersion("B")}
                  className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 active:scale-95 ${
                    activeVersion === "B"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-400 hover:text-gray-900"
                  }`}
                >
                  Version B
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex justify-center min-h-full w-full">
        <div
          ref={setNodeRef}
          className={`shadow-2xl transition-all duration-500 rounded-[2.5rem] h-fit ${
            devicePreview === "mobile"
              ? "w-[375px]"
              : devicePreview === "tablet"
                ? "w-[768px]"
                : "w-full max-w-[1200px]"
          } ${isPreviewMode ? "preview-mode" : ""}`}
          style={{
            backgroundColor: currentWebsite?.globalStyles?.backgroundColor || "#ffffff",
            color: currentWebsite?.globalStyles?.textColor || "inherit",
            fontFamily: currentWebsite?.globalStyles?.fontFamily ? `'${currentWebsite.globalStyles.fontFamily}', sans-serif` : "inherit",
            scrollBehavior: "smooth",
          }}
        >
          {/* Fake Mobile Status Bar if in Mobile View */}
          {devicePreview === "mobile" && (
            <div className="h-8 bg-gray-50 flex justify-between px-6 items-center rounded-t-[2.5rem]">
              <span className="text-[10px] font-black text-gray-400">9:41</span>
              <div className="flex gap-1">
                <div className="w-4 h-2 rounded-full bg-gray-300" />
                <div className="w-2 h-2 rounded-full bg-gray-300" />
              </div>
            </div>
          )}

          <div className="p-8 md:p-12">
            {elements.length === 0 ? (
              <div className="min-h-[400px] border-2 border-dashed border-gray-100 rounded-[2rem] flex flex-col items-center justify-center gap-4 text-gray-300">
                <Plus size={40} strokeWidth={1} />
                <span className="font-black uppercase tracking-widest text-xs">
                  Add Elements from the left panel
                </span>
              </div>
            ) : (
              <SortableContext
                items={elements.map((el) => el.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-8">
                  {(() => {
                    const paymentOptionActive = currentWebsite?.campaignId && typeof currentWebsite.campaignId === "object"
                      ? currentWebsite.campaignId.paymentOptionActive
                      : currentWebsite?.paymentOptionActive;

                    const campaignId = currentWebsite?.campaignId && typeof currentWebsite.campaignId === "object"
                      ? currentWebsite.campaignId._id
                      : currentWebsite?.campaignId;

                    const isStripeConnected = !!(user?.stripeAccountId);

                    return elements.map((element) => (
                      <SortableCanvasItem
                        key={element.id}
                        id={element.id}
                        element={element}
                        isSelected={selectedElement === element.id}
                        isPreviewMode={isPreviewMode}
                        paymentOptionActive={paymentOptionActive}
                        campaignId={campaignId}
                        isStripeConnected={isStripeConnected}
                      />
                    ));
                  })()}
                </div>
              </SortableContext>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Canvas;
