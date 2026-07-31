// src/components/layout/LeftPanel.tsx
import React from "react";
import { useWebsiteStore } from "../../store/websiteStore";
import { structures, elementCategories } from "../../data/elements";
import { pageTemplates, cloneElementsWithNewIds } from "../../data/templates";
import { WebsiteElement } from "../../types/index";
import { v4 as uuidv4 } from "uuid";
import {
  LayoutGrid,
  Columns,
  Sliders,
  Heading,
  AlignLeft,
  MousePointer,
  Image,
  Video,
  FormInput,
  Layout,
  Type,
  ChevronDown,
  Plus,
  Sparkles,
  Trash2,
} from "lucide-react";

const iconMap: any = {
  LayoutGrid,
  Columns,
  Sliders,
  Heading,
  AlignLeft,
  MousePointer,
  Image,
  Video,
  FormInput,
  Layout,
  Type,
};

const LeftPanel: React.FC = () => {
  const { 
    leftPanelTab, 
    setLeftPanelTab, 
    addElement, 
    applyTemplate,
    customPresets,
    saveAsPreset,
    deletePreset
  } = useWebsiteStore();

  const handleSaveCustomPreset = () => {
    const name = window.prompt("Enter a name for your custom preset:");
    if (!name) return;
    const desc = window.prompt("Enter a description for your custom preset:") || "Custom user preset.";
    saveAsPreset(name, desc);
  };

  const handleAddElement = (elementConfig: any) => {
    const newElement: WebsiteElement = {
      id: uuidv4(),
      type: elementConfig.type,
      content: elementConfig.defaultContent,
      styles: elementConfig.defaultStyles,
      children:
        elementConfig.type === "grid" || elementConfig.type === "columns"
          ? [
              {
                id: uuidv4(),
                type: "text",
                content: "<p>Column 1</p>",
                styles: {
                  padding: "16px",
                  backgroundColor: "#e5e7eb",
                  borderRadius: "4px",
                },
              },
              {
                id: uuidv4(),
                type: "text",
                content: "<p>Column 2</p>",
                styles: {
                  padding: "16px",
                  backgroundColor: "#e5e7eb",
                  borderRadius: "4px",
                },
              },
            ]
          : elementConfig.type === "slider"
            ? [
                {
                  id: uuidv4(),
                  type: "image",
                  content: "https://images.unsplash.com/photo-1557683311-eac922347aa1?auto=format&fit=crop&q=80&w=1200",
                  styles: { borderRadius: "16px", aspectRatio: "16/9" },
                },
                {
                  id: uuidv4(),
                  type: "image",
                  content: "https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80&w=1200",
                  styles: { borderRadius: "16px", aspectRatio: "16/9" },
                },
              ]
            : undefined,
    };
    if (newElement.type === "slider") {
      newElement.styles = { ...newElement.styles, autoplay: true };
    }
    addElement(newElement);
  };

  const renderStructures = () => (
    <div className="space-y-6">
      <button className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-all group">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 group-hover:text-yellow-600 transition-all border border-gray-100">
            <Layout size={18} />
          </div>
          <span className="font-bold text-sm text-gray-900">Structures</span>
        </div>
        <ChevronDown size={14} className="text-gray-400" />
      </button>
      <div className="grid grid-cols-2 gap-3 px-2">
        {structures[0].elements.map((element) => {
          const Icon = iconMap[element.icon];
          return (
            <button
              key={element.type}
              onClick={() => handleAddElement(element)}
              className="p-4 rounded-xl border border-gray-100 text-center font-bold text-[10px] uppercase tracking-widest text-gray-400 hover:border-yellow-500 hover:text-gray-900 transition-all bg-white group"
            >
              <Icon
                size={24}
                className="mx-auto mb-2 text-gray-300 group-hover:text-yellow-500 transition-all"
              />
              {element.label}
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderElements = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="font-bold text-sm text-gray-900">Elements</span>
        <ChevronDown size={14} className="text-gray-400" />
      </div>
      <div className="grid grid-cols-1 gap-2">
        {elementCategories[0].elements.map((element) => {
          const Icon = iconMap[element.icon];
          return (
            <button
              key={element.type}
              onClick={() => handleAddElement(element)}
              className="flex items-center gap-4 p-4 rounded-xl border border-gray-50 hover:border-yellow-200 hover:bg-yellow-50/10 transition-all text-left font-bold text-sm group"
            >
              <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 group-hover:text-yellow-600 border border-gray-100">
                <Icon size={18} />
              </div>
              <span className="text-gray-400 group-hover:text-gray-900">
                {element.label}
              </span>
              <Plus
                size={14}
                className="ml-auto text-gray-200 group-hover:text-yellow-500"
              />
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderTemplates = () => (
    <div className="space-y-6 animate-fade-in">
      <div>
        <button
          onClick={handleSaveCustomPreset}
          className="w-full py-3 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-sm cursor-pointer flex items-center justify-center gap-2 border border-yellow-200"
        >
          <Sparkles size={14} /> Save Current Canvas as Preset
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-2">
          <span className="font-bold text-sm text-gray-900">Landing Page Presets</span>
          <ChevronDown size={14} className="text-gray-400" />
        </div>
        <div className="flex flex-col gap-4">
          {pageTemplates.map((template) => (
            <div
              key={template.id}
              className="p-4 rounded-2xl border border-gray-100 bg-white hover:border-yellow-400 hover:shadow-md transition-all flex flex-col gap-3 group relative overflow-hidden"
            >
              <div className="flex justify-between items-center">
                <span 
                  className="px-2 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-md"
                  style={{ backgroundColor: `${template.color}15`, color: template.color }}
                >
                  {template.badge}
                </span>
              </div>

              <div>
                <h4 className="font-black text-sm text-gray-900 leading-snug group-hover:text-yellow-600 transition-colors">
                  {template.name}
                </h4>
                <p className="text-[11px] text-gray-400 font-semibold leading-relaxed mt-1.5">
                  {template.desc}
                </p>
              </div>

              <div className="flex flex-wrap gap-1">
                {template.elements.map(el => (
                  <span key={el.id} className="text-[9px] font-bold text-gray-400 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-full capitalize">
                    {el.type}
                  </span>
                ))}
              </div>

              <button
                onClick={() => {
                  if (window.confirm(`Applying "${template.name}" will replace all existing elements on your canvas. Are you sure you want to proceed?`)) {
                    const duplicatedElements = cloneElementsWithNewIds(template.elements);
                    applyTemplate(duplicatedElements);
                  }
                }}
                className="w-full py-2.5 bg-yellow-500 hover:bg-yellow-600 text-black font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-sm cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Plus size={14} /> Apply Preset
              </button>
            </div>
          ))}
        </div>
      </div>

      {customPresets.length > 0 && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
            <span className="font-bold text-sm text-gray-900">My Custom Presets</span>
            <ChevronDown size={14} className="text-gray-400" />
          </div>
          <div className="flex flex-col gap-4">
            {customPresets.map((template) => (
              <div
                key={template.id}
                className="p-4 rounded-2xl border border-gray-100 bg-white hover:border-yellow-400 hover:shadow-md transition-all flex flex-col gap-3 group relative overflow-hidden"
              >
                <div className="flex justify-between items-center">
                  <span 
                    className="px-2 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-md"
                    style={{ backgroundColor: `${template.color}15`, color: template.color }}
                  >
                    {template.badge}
                  </span>
                  <button
                    onClick={() => {
                      if (window.confirm(`Are you sure you want to delete "${template.name}"?`)) {
                        deletePreset(template.id);
                      }
                    }}
                    className="text-gray-400 hover:text-red-500 p-1 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>

                <div>
                  <h4 className="font-black text-sm text-gray-900 leading-snug group-hover:text-yellow-600 transition-colors">
                    {template.name}
                  </h4>
                  <p className="text-[11px] text-gray-400 font-semibold leading-relaxed mt-1.5">
                    {template.desc}
                  </p>
                </div>

                <button
                  onClick={() => {
                    if (window.confirm(`Applying "${template.name}" will replace all existing elements on your canvas. Are you sure you want to proceed?`)) {
                      const duplicatedElements = cloneElementsWithNewIds(template.elements);
                      applyTemplate(duplicatedElements);
                    }
                  }}
                  className="w-full py-2.5 bg-yellow-500 hover:bg-yellow-600 text-black font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-sm cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Plus size={14} /> Apply Preset
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <aside className="w-80 bg-white border-r border-gray-100 flex flex-col h-full overflow-y-auto">
      <div className="p-6">
        {/* Tabs */}
        <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-100 mb-8">
          <button
            onClick={() => setLeftPanelTab("structures")}
            className={`flex-1 py-3 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
              leftPanelTab === "structures"
                ? "bg-white shadow-md text-yellow-600"
                : "text-gray-400 hover:text-gray-900"
            }`}
          >
            <Layout size={14} className="inline mr-2" />
            Grid
          </button>
          <button
            onClick={() => setLeftPanelTab("elements")}
            className={`flex-1 py-3 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
              leftPanelTab === "elements"
                ? "bg-white shadow-md text-yellow-600"
                : "text-gray-400 hover:text-gray-900"
            }`}
          >
            <Type size={14} className="inline mr-2" />
            Elements
          </button>
          <button
            onClick={() => setLeftPanelTab("templates")}
            className={`flex-1 py-3 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
              leftPanelTab === "templates"
                ? "bg-white shadow-md text-yellow-600"
                : "text-gray-400 hover:text-gray-900"
            }`}
          >
            <Sparkles size={14} className="inline mr-2" />
            Presets
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {leftPanelTab === "structures"
            ? renderStructures()
            : leftPanelTab === "elements"
              ? renderElements()
              : renderTemplates()}
        </div>
      </div>
    </aside>
  );
};

export default LeftPanel;
