// src/store/websiteStore.ts
import { create } from "zustand";
import {
  WebsiteElement,
  WebsiteData,
  DevicePreview,
  PanelTab,
  ElementStyles,
} from "../types/index";
import { v4 as uuidv4 } from "uuid";

interface WebsiteStore {
  // Website Data
  currentWebsite: WebsiteData | null;

  // A/B Testing Versioning
  activeVersion: "A" | "B";
  setActiveVersion: (version: "A" | "B") => Promise<void>;

  // UI State
  selectedElement: string | null;
  devicePreview: DevicePreview;
  isPreviewMode: boolean;
  leftPanelTab: PanelTab;
  rightPanelTab: PanelTab;

  // History for Undo/Redo
  history: WebsiteElement[][];
  historyIndex: number;

  // Actions
  setCurrentWebsite: (website: WebsiteData) => void;
  addElement: (element: WebsiteElement, index?: number) => void;
  updateElement: (id: string, updates: Partial<WebsiteElement>) => void;
  updateElementStyles: (id: string, styles: Partial<ElementStyles>) => void;
  updateElementContent: (id: string, content: string) => void;
  removeElement: (id: string) => void;
  duplicateElement: (id: string) => void;
  setSelectedElement: (id: string | null) => void;
  setDevicePreview: (device: DevicePreview) => void;
  setPreviewMode: (preview: boolean) => void;
  setLeftPanelTab: (tab: PanelTab) => void;
  setRightPanelTab: (tab: PanelTab) => void;
  updateGlobalStyles: (styles: Partial<WebsiteData["globalStyles"]>) => void;

  // History Actions
  undo: () => void;
  redo: () => void;

  // Persistence
  saveToLocalStorage: () => void;
  loadFromLocalStorage: (campaignId?: string) => void;

  // Drag and Drop
  moveElement: (fromIndex: number, toIndex: number) => void;
  applyTemplate: (elements: WebsiteElement[]) => void;

  // Custom Presets
  customPresets: any[];
  saveAsPreset: (name: string, desc: string) => void;
  deletePreset: (id: string) => void;
  loadCustomPresets: () => void;
}

export const useWebsiteStore = create<WebsiteStore>(
  (
    set: (arg0: {
      currentWebsite?: any;
      history?: any;
      historyIndex?: any;
      selectedElement?: any;
      devicePreview?: any;
      isPreviewMode?: any;
      leftPanelTab?: any;
      rightPanelTab?: any;
    }) => void,
    get: () => any,
  ) => ({
    currentWebsite: null,
    selectedElement: null,
    devicePreview: "desktop",
    isPreviewMode: false,
    leftPanelTab: "structures",
    rightPanelTab: "styles",
    history: [],
    historyIndex: -1,
    customPresets: [],
    activeVersion: "A",
    setActiveVersion: async (version: "A" | "B") => {
      await get().saveToLocalStorage();
      set({ activeVersion: version });
      const current = get().currentWebsite;
      const cid = current?.campaignId && typeof current.campaignId === "object"
        ? current.campaignId._id || current.campaignId.id
        : current?.campaignId;
      if (cid) {
        await get().loadFromLocalStorage(cid);
      }
    },

    setCurrentWebsite: (website: any) => set({ currentWebsite: website }),

    updateGlobalStyles: (styles: any) => {
      const state = get();
      if (!state.currentWebsite) return;

      const updated = {
        ...state.currentWebsite,
        globalStyles: {
          ...state.currentWebsite.globalStyles,
          ...styles,
        },
        updatedAt: new Date().toISOString(),
      };

      set({ currentWebsite: updated });
      state.saveToLocalStorage();
    },

    addElement: (element: { id: any }, index?: number) => {
      const state = get();
      if (!state.currentWebsite) return;

      const newElements = [...state.currentWebsite.elements];
      if (index !== undefined) {
        newElements.splice(index, 0, element);
      } else {
        newElements.push(element);
      }

      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push(newElements);

      set({
        currentWebsite: {
          ...state.currentWebsite,
          elements: newElements,
          updatedAt: new Date().toISOString(),
        },
        history: newHistory,
        historyIndex: newHistory.length - 1,
        selectedElement: element.id,
      });
      state.saveToLocalStorage();
    },

    updateElement: (id: any, updates: any) => {
      const state = get();
      if (!state.currentWebsite) return;

      const updateRecursive = (
        elements: WebsiteElement[],
      ): WebsiteElement[] => {
        return elements.map((el) => {
          if (el.id === id) {
            return { ...el, ...updates };
          }
          if (el.children) {
            return { ...el, children: updateRecursive(el.children) };
          }
          return el;
        });
      };

      const newElements = updateRecursive(state.currentWebsite.elements);
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push(newElements);

      set({
        currentWebsite: {
          ...state.currentWebsite,
          elements: newElements,
          updatedAt: new Date().toISOString(),
        },
        history: newHistory,
        historyIndex: newHistory.length - 1,
      });
      state.saveToLocalStorage();
    },

    updateElementStyles: (id: any, styles: any) => {
      const state = get();
      if (!state.currentWebsite) return;

      const updateStyles = (elements: WebsiteElement[]): WebsiteElement[] => {
        return elements.map((el) => {
          if (el.id === id) {
            return {
              ...el,
              styles: { ...el.styles, ...styles },
            };
          }
          if (el.children) {
            return { ...el, children: updateStyles(el.children) };
          }
          return el;
        });
      };

      const newElements = updateStyles(state.currentWebsite.elements);
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push(newElements);

      set({
        currentWebsite: {
          ...state.currentWebsite,
          elements: newElements,
          updatedAt: new Date().toISOString(),
        },
        history: newHistory,
        historyIndex: newHistory.length - 1,
      });
      state.saveToLocalStorage();
    },

    updateElementContent: (id: any, content: any) => {
      const state = get();
      if (!state.currentWebsite) return;

      const updateContent = (elements: WebsiteElement[]): WebsiteElement[] => {
        return elements.map((el) => {
          if (el.id === id) {
            return { ...el, content };
          }
          if (el.children) {
            return { ...el, children: updateContent(el.children) };
          }
          return el;
        });
      };

      const newElements = updateContent(state.currentWebsite.elements);
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push(newElements);

      set({
        currentWebsite: {
          ...state.currentWebsite,
          elements: newElements,
          updatedAt: new Date().toISOString(),
        },
        history: newHistory,
        historyIndex: newHistory.length - 1,
      });
      state.saveToLocalStorage();
    },

    removeElement: (id: any) => {
      const state = get();
      if (!state.currentWebsite) return;

      const removeRecursive = (
        elements: WebsiteElement[],
      ): WebsiteElement[] => {
        return elements.filter((el) => {
          if (el.id === id) return false;
          if (el.children) {
            el.children = removeRecursive(el.children);
          }
          return true;
        });
      };

      const newElements = removeRecursive(state.currentWebsite.elements);
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push(newElements);

      set({
        currentWebsite: {
          ...state.currentWebsite,
          elements: newElements,
          updatedAt: new Date().toISOString(),
        },
        selectedElement:
          state.selectedElement === id ? null : state.selectedElement,
        history: newHistory,
        historyIndex: newHistory.length - 1,
      });
      state.saveToLocalStorage();
    },

    duplicateElement: (id: any) => {
      const state = get();
      if (!state.currentWebsite) return;

      const findElement = (
        elements: WebsiteElement[],
      ): WebsiteElement | null => {
        for (const el of elements) {
          if (el.id === id) return el;
          if (el.children) {
            const found = findElement(el.children);
            if (found) return found;
          }
        }
        return null;
      };

      const element = findElement(state.currentWebsite.elements);
      if (element) {
        const duplicatedElement = {
          ...element,
          id: uuidv4(),
        };
        const index = state.currentWebsite.elements.findIndex(
          (el: { id: any }) => el.id === id,
        );
        state.addElement(duplicatedElement, index + 1);
      }
    },

    setSelectedElement: (id: any) => set({ selectedElement: id }),
    setDevicePreview: (device: any) => set({ devicePreview: device }),
    setPreviewMode: (preview: any) => set({ isPreviewMode: preview }),
    setLeftPanelTab: (tab: any) => set({ leftPanelTab: tab }),
    setRightPanelTab: (tab: any) => set({ rightPanelTab: tab }),

    undo: () => {
      const state = get();
      if (state.historyIndex > 0 && state.currentWebsite) {
        const newIndex = state.historyIndex - 1;
        set({
          currentWebsite: {
            ...state.currentWebsite,
            elements: state.history[newIndex],
          },
          historyIndex: newIndex,
        });
        state.saveToLocalStorage();
      }
    },

    redo: () => {
      const state = get();
      if (
        state.historyIndex < state.history.length - 1 &&
        state.currentWebsite
      ) {
        const newIndex = state.historyIndex + 1;
        set({
          currentWebsite: {
            ...state.currentWebsite,
            elements: state.history[newIndex],
          },
          historyIndex: newIndex,
        });
        state.saveToLocalStorage();
      }
    },

    moveElement: (fromIndex: number, toIndex: number) => {
      const state = get();
      if (!state.currentWebsite) return;

      const newElements = [...state.currentWebsite.elements];
      const [movedElement] = newElements.splice(fromIndex, 1);
      newElements.splice(toIndex, 0, movedElement);

      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push(newElements);

      set({
        currentWebsite: {
          ...state.currentWebsite,
          elements: newElements,
          updatedAt: new Date().toISOString(),
        },
        history: newHistory,
        historyIndex: newHistory.length - 1,
      });
      state.saveToLocalStorage();
    },

    applyTemplate: (elements: WebsiteElement[]) => {
      const state = get();
      if (!state.currentWebsite) return;

      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push(elements);

      set({
        currentWebsite: {
          ...state.currentWebsite,
          elements,
          updatedAt: new Date().toISOString(),
        },
        history: newHistory,
        historyIndex: newHistory.length - 1,
        selectedElement: null,
      });
      state.saveToLocalStorage();
    },

    saveToLocalStorage: async () => {
      const state = get();
      if (state.currentWebsite) {
        let cid = state.currentWebsite.campaignId;
        if (cid && typeof cid === "object") {
          cid = (cid as any)._id || (cid as any).id;
        }
        if (cid) {
          try {
            const { default: api } = await import("../api/axios");
            await api.put(`/websites/${cid}?v=${state.activeVersion || "A"}`, state.currentWebsite);
          } catch (error) {
            console.error("Failed to save website data to server:", error);
          }
        }
      }
    },

    loadFromLocalStorage: async (campaignId?: string) => {
      // Load custom presets first
      get().loadCustomPresets();

      try {
        const { default: api } = await import("../api/axios");
        let cid = campaignId;
        if (!cid) {
          const campRes = await api.get("/campaigns");
          if (campRes.data.success && campRes.data.data.length > 0) {
            cid = campRes.data.data[0]._id || campRes.data.data[0].id;
          }
        }

        if (cid) {
          const webRes = await api.get(`/websites/${cid}?v=${get().activeVersion || "A"}`);
          if (webRes.data.success && webRes.data.data) {
            const website = webRes.data.data;
            if (!website.campaignId) {
              website.campaignId = cid;
            }
            set({
              currentWebsite: website,
              history: [website.elements],
              historyIndex: 0,
            });
            return;
          }
        }

        // If website not found on server, initialize a default website layout for this campaign ID
        if (cid) {
          initializeDefaultWebsite(set, cid);
        } else {
          initializeDefaultWebsite(set);
        }
      } catch (error) {
        console.error("Failed to load website data from server:", error);
        if (campaignId) {
          initializeDefaultWebsite(set, campaignId);
        } else {
          initializeDefaultWebsite(set);
        }
      }
    },

    saveAsPreset: (name: string, desc: string) => {
      const state = get();
      if (!state.currentWebsite) return;

      const newPreset = {
        id: uuidv4(),
        name,
        desc,
        badge: "User Preset",
        color: "#fbbf24",
        elements: JSON.parse(JSON.stringify(state.currentWebsite.elements)),
      };

      const updatedPresets = [...state.customPresets, newPreset];
      set({ customPresets: updatedPresets });
      localStorage.setItem("website-builder-custom-presets", JSON.stringify(updatedPresets));
    },

    deletePreset: (id: string) => {
      const state = get();
      const updatedPresets = state.customPresets.filter((p: any) => p.id !== id);
      set({ customPresets: updatedPresets });
      localStorage.setItem("website-builder-custom-presets", JSON.stringify(updatedPresets));
    },

    loadCustomPresets: () => {
      const saved = localStorage.getItem("website-builder-custom-presets");
      if (saved) {
        try {
          set({ customPresets: JSON.parse(saved) });
        } catch (e) {
          console.error("Failed to parse custom presets:", e);
        }
      }
    },
  }),
);

function initializeDefaultWebsite(set: any, campaignId?: string) {
  const newWebsite: WebsiteData = {
    id: uuidv4(),
    campaignId: campaignId,
    name: "My Website",
    elements: [],
    globalStyles: {
      fontFamily: "Inter",
      primaryColor: "#3B82F6",
      secondaryColor: "#10B981",
      backgroundColor: "#ffffff",
      textColor: "#111827",
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  set({
    currentWebsite: newWebsite,
    history: [[]],
    historyIndex: 0,
  });
}
