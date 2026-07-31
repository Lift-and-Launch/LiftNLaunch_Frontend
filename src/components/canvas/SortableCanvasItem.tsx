// src/components/canvas/SortableCanvasItem.tsx
import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import CanvasElement from "./CanvasElement";
import { WebsiteElement } from "../../types/index";
import { GripVertical } from "lucide-react";
import { useWebsiteStore } from "../../store/websiteStore";

interface SortableCanvasItemProps {
  id: string;
  element: WebsiteElement;
  isSelected: boolean;
  isPreviewMode: boolean;
  paymentOptionActive?: boolean;
  campaignId?: string;
  isStripeConnected?: boolean;
}

export const SortableCanvasItem: React.FC<SortableCanvasItemProps> = ({
  id,
  element,
  isSelected,
  isPreviewMode,
  paymentOptionActive,
  campaignId,
  isStripeConnected,
}) => {
  const { isPreviewMode: globalPreviewMode } = useWebsiteStore();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled: globalPreviewMode });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    position: "relative" as const,
    zIndex: isDragging ? 50 : "auto",
  };

  return (
    <div ref={setNodeRef} style={style} className="group relative">
      {/* Drag Handle - Always visible on hover, left side */}
      {!isPreviewMode && (
        <div
          {...attributes}
          {...listeners}
          className="absolute -left-12 top-1/2 -translate-y-1/2 p-3 bg-white border border-gray-100 rounded-xl shadow-md opacity-0 group-hover:opacity-100 transition-all cursor-grab active:cursor-grabbing z-20 text-gray-400 hover:text-yellow-600 hover:border-yellow-200 hover:shadow-lg"
          title="Drag to reorder"
        >
          <GripVertical size={20} />
        </div>
      )}
      <CanvasElement
        element={element}
        isSelected={isSelected}
        isPreviewMode={isPreviewMode}
        paymentOptionActive={paymentOptionActive}
        campaignId={campaignId}
        isStripeConnected={isStripeConnected}
      />
    </div>
  );
};
