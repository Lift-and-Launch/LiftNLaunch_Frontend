// src/pages/WebsiteBuilder.tsx
import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { useWebsiteStore } from "../store/websiteStore";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";

import TopToolbar from "../components/layout/TopToolbar";
import LeftPanel from "../components/layout/LeftPanel";
import Canvas from "../components/canvas/Canvas";
import RightPanel from "../components/layout/RightPanel";
import BottomBar from "../components/layout/BottomBar";

const WebsiteBuilder: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const campaignId = location.state?.campaignId;
  const { loadFromLocalStorage, isPreviewMode, currentWebsite, moveElement } =
    useWebsiteStore();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  useEffect(() => {
    if (!user) {
      navigate("/signin", { replace: true });
      return;
    }
    if (!user.isSubscribed) {
      navigate("/pricing", { replace: true, state: { from: location } });
      return;
    }
    if (user.isSubscribed && user.adminApprovalStatus !== "approved") {
      navigate("/dashboard", { replace: true });
      return;
    }
    loadFromLocalStorage(campaignId);
  }, [user, navigate, loadFromLocalStorage, campaignId, location]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const elements = currentWebsite?.elements || [];
    const oldIndex = elements.findIndex((el) => el.id === active.id);
    const newIndex = elements.findIndex((el) => el.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      moveElement(oldIndex, newIndex);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
        {/* Top Toolbar - Fixed height */}
        <TopToolbar />

        {/* Main Content - Takes remaining height, NO overflow-hidden on this row */}
        <div className="flex-1 flex min-h-0">
          {/* Left Panel - Fixed width, scrolls independently */}
          {!isPreviewMode && (
            <div className="hidden lg:block flex-shrink-0">
              <LeftPanel />
            </div>
          )}

          {/* Canvas - This is the scrollable area */}
          <div className="flex-1 min-w-0">
            <Canvas />
          </div>

          {/* Right Panel - Fixed width, scrolls independently */}
          {!isPreviewMode && (
            <div className="hidden xl:block flex-shrink-0">
              <RightPanel />
            </div>
          )}
        </div>

        {/* Bottom Bar */}
        {!isPreviewMode && <BottomBar />}
      </div>
    </DndContext>
  );
};

export default WebsiteBuilder;
