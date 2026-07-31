// src/components/layout/BottomBar.tsx
import React from "react";
import { useWebsiteStore } from "../../store/websiteStore";
import { Layers, Code, Clock } from "lucide-react";

const BottomBar: React.FC = () => {
  const { currentWebsite, selectedElement } = useWebsiteStore();

  const selectedElementData = currentWebsite?.elements.find(
    (el) => el.id === selectedElement,
  );
  const totalElements = currentWebsite?.elements.length || 0;

  return (
    <div className="h-12 bg-white border-t border-gray-100 flex items-center justify-between px-8">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
          <Layers size={12} />
          <span>
            Elements: <span className="text-gray-900">{totalElements}</span>
          </span>
        </div>
        {selectedElementData && (
          <div className="flex items-center gap-2 text-xs font-bold text-yellow-600 uppercase tracking-widest bg-yellow-50 px-3 py-1 rounded-lg">
            <span>Selected: {selectedElementData.type}</span>
          </div>
        )}
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
          <Clock size={12} />
          <span>
            Last saved:{" "}
            <span className="text-gray-900">
              {currentWebsite?.updatedAt
                ? new Date(currentWebsite.updatedAt).toLocaleTimeString()
                : "Never"}
            </span>
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
          <Code size={12} />
          <span>
            React <span className="text-gray-300">+</span> TypeScript{" "}
            <span className="text-gray-300">+</span> Tailwind
          </span>
        </div>
      </div>
    </div>
  );
};

export default BottomBar;
