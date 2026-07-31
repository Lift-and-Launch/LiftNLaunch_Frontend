// src/components/layout/RightPanel.tsx - Restyled TipTap Implementation
import React, { useState, useEffect } from "react";
import { useWebsiteStore } from "../../store/websiteStore";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import {
  FileText,
  PaintBucket,
  Trash2,
  Copy,
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Link as LinkIcon,
  Image as ImageIcon,
  Code,
  Heading1,
  Heading2,
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Settings,
  ChevronDown,
  MousePointer2,
  Plus,
} from "lucide-react";

const RightPanel: React.FC = () => {
  const {
    currentWebsite,
    selectedElement,
    rightPanelTab,
    setRightPanelTab,
    updateElementContent,
    updateElementStyles,
    updateElement,
    removeElement,
    duplicateElement,
    updateGlobalStyles,
  } = useWebsiteStore();

  const [showColorPicker, setShowColorPicker] = useState(false);
  const [colorPickerType, setColorPickerType] = useState<
    "color" | "backgroundColor"
  >("color");

  const findElementRecursive = (elements: any[], id: string): any => {
    for (const el of elements) {
      if (el.id === id) return el;
      if (el.children) {
        const found = findElementRecursive(el.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const selectedElementData = selectedElement && currentWebsite 
    ? findElementRecursive(currentWebsite.elements, selectedElement) 
    : null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (base64: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          callback(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Initialize TipTap editor
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-yellow-600 underline cursor-pointer",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "max-w-full rounded-2xl",
        },
      }),
      TextStyle,
      Color,
    ],
    content: selectedElementData?.content || "",
    onUpdate: ({ editor }) => {
      if (selectedElement) {
        const html = editor.getHTML();
        updateElementContent(selectedElement, html);
      }
    },
    editorProps: {
      attributes: {
        class:
          "prose max-w-none p-4 min-h-[200px] focus:outline-none text-gray-900",
        "data-placeholder": "Start typing...",
      },
    },
  });

  // Update editor content when selected element changes
  useEffect(() => {
    if (editor && selectedElementData) {
      const currentContent = editor.getHTML();
      if (currentContent !== selectedElementData.content) {
        editor.commands.setContent(selectedElementData.content || "");
      }
    }
  }, [selectedElement, editor]);

  // Destroy editor on unmount
  useEffect(() => {
    return () => {
      editor?.destroy();
    };
  }, []);

  // Add custom placeholder CSS
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      .ProseMirror p.is-editor-empty:first-child::before {
        color: #d1d5db;
        content: attr(data-placeholder);
        float: left;
        height: 0;
        pointer-events: none;
        font-weight: 600;
      }
      
      .ProseMirror {
        outline: none;
        min-height: 200px;
      }
      
      .ProseMirror p {
        margin: 0.5em 0;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  if (!selectedElement || !selectedElementData) {
    const globalStyles = currentWebsite?.globalStyles || {
      fontFamily: "Inter",
      primaryColor: "#3B82F6",
      secondaryColor: "#10B981",
      backgroundColor: "#ffffff",
      textColor: "#111827",
    };

    return (
      <aside className="w-80 bg-white border-l border-gray-100 flex flex-col h-full overflow-y-auto">
        {/* Panel Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <Settings size={18} className="text-gray-400" />
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">
              Page Settings
            </h3>
          </div>
        </div>

        {/* Panel Content */}
        <div className="flex-1 p-6 space-y-8">
          {/* Info Card */}
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-gray-400">
              <MousePointer2 size={14} />
              <span className="text-[10px] font-black uppercase tracking-wider">Canvas Status</span>
            </div>
            <p className="text-xs font-bold text-gray-500 leading-relaxed">
              No element is currently selected. Select any block on the canvas to configure it, or edit global page styles below.
            </p>
          </div>

          <div className="border-t border-gray-100 pt-6 space-y-6">
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Global Page Styles</h4>

            {/* Font Family */}
            <div>
              <label className="block text-sm font-bold text-gray-500 tracking-tight mb-3">
                Font Family
              </label>
              <select
                value={globalStyles.fontFamily || "Inter"}
                onChange={(e) => updateGlobalStyles({ fontFamily: e.target.value })}
                className="w-full p-4 rounded-xl bg-gray-50/50 border border-gray-100 font-black text-sm tracking-tight focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 transition-all appearance-none cursor-pointer"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 16px center",
                  paddingRight: "48px",
                }}
              >
                <option value="Inter">Inter</option>
                <option value="Arial">Arial</option>
                <option value="Helvetica">Helvetica</option>
                <option value="Georgia">Georgia</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Courier New">Courier New</option>
                <option value="Verdana">Verdana</option>
                <option value="Trebuchet MS">Trebuchet MS</option>
                <option value="system-ui">System UI</option>
                <option value="Roboto">Roboto</option>
                <option value="Poppins">Poppins</option>
              </select>
            </div>

            {/* Page Background Color */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-bold text-gray-500 tracking-tight">
                  Page Background
                </label>
                <div className="flex items-center gap-2">
                  <div
                    className="w-5 h-5 rounded border border-gray-200"
                    style={{ backgroundColor: globalStyles.backgroundColor || "#ffffff" }}
                  />
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    {globalStyles.backgroundColor || "#ffffff"}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={globalStyles.backgroundColor || "#ffffff"}
                  onChange={(e) => updateGlobalStyles({ backgroundColor: e.target.value })}
                  className="w-12 h-12 rounded-xl border border-gray-100 cursor-pointer"
                />
                <input
                  type="text"
                  value={globalStyles.backgroundColor || "#ffffff"}
                  onChange={(e) => updateGlobalStyles({ backgroundColor: e.target.value })}
                  className="flex-1 px-4 py-3 border border-gray-100 rounded-xl text-sm font-bold bg-gray-50 focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 transition-all"
                  placeholder="#ffffff"
                />
              </div>
            </div>

            {/* Global Text Color */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-bold text-gray-500 tracking-tight">
                  Global Text Color
                </label>
                <div className="flex items-center gap-2">
                  <div
                    className="w-5 h-5 rounded border border-gray-200"
                    style={{ backgroundColor: globalStyles.textColor || "#111827" }}
                  />
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    {globalStyles.textColor || "#111827"}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={globalStyles.textColor || "#111827"}
                  onChange={(e) => updateGlobalStyles({ textColor: e.target.value })}
                  className="w-12 h-12 rounded-xl border border-gray-100 cursor-pointer"
                />
                <input
                  type="text"
                  value={globalStyles.textColor || "#111827"}
                  onChange={(e) => updateGlobalStyles({ textColor: e.target.value })}
                  className="flex-1 px-4 py-3 border border-gray-100 rounded-xl text-sm font-bold bg-gray-50 focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 transition-all"
                  placeholder="#111827"
                />
              </div>
            </div>

            {/* Primary Accent Color */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-bold text-gray-500 tracking-tight">
                  Primary Accent
                </label>
                <div className="flex items-center gap-2">
                  <div
                    className="w-5 h-5 rounded border border-gray-200"
                    style={{ backgroundColor: globalStyles.primaryColor || "#3B82F6" }}
                  />
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    {globalStyles.primaryColor || "#3B82F6"}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={globalStyles.primaryColor || "#3B82F6"}
                  onChange={(e) => updateGlobalStyles({ primaryColor: e.target.value })}
                  className="w-12 h-12 rounded-xl border border-gray-100 cursor-pointer"
                />
                <input
                  type="text"
                  value={globalStyles.primaryColor || "#3B82F6"}
                  onChange={(e) => updateGlobalStyles({ primaryColor: e.target.value })}
                  className="flex-1 px-4 py-3 border border-gray-100 rounded-xl text-sm font-bold bg-gray-50 focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 transition-all"
                  placeholder="#3B82F6"
                />
              </div>
            </div>
          </div>
        </div>
      </aside>
    );
  }

  const handleStyleChange = (property: string, value: any) => {
    updateElementStyles(selectedElement, { [property]: value });
  };

  const MenuBar = () => {
    if (!editor) return null;

    const ToolbarButton = ({ onClick, isActive, icon: Icon, title }: any) => (
      <button
        onClick={onClick}
        className={`p-2 rounded-lg transition-all ${
          isActive
            ? "bg-yellow-100 text-yellow-600"
            : "text-gray-400 hover:text-gray-900 hover:bg-gray-50"
        }`}
        title={title}
        type="button"
      >
        <Icon size={16} />
      </button>
    );

    const ToolbarDivider = () => (
      <div className="w-px h-6 bg-gray-100 mx-1 self-center"></div>
    );

    return (
      <div className="border-b border-gray-100 p-3 flex flex-wrap gap-1 bg-gray-50/50 rounded-t-2xl">
        {/* Text Formatting */}
        <div className="flex gap-0.5">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive("bold")}
            icon={Bold}
            title="Bold (Ctrl+B)"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive("italic")}
            icon={Italic}
            title="Italic (Ctrl+I)"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            isActive={editor.isActive("underline")}
            icon={UnderlineIcon}
            title="Underline (Ctrl+U)"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            isActive={editor.isActive("strike")}
            icon={Strikethrough}
            title="Strikethrough"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCode().run()}
            isActive={editor.isActive("code")}
            icon={Code}
            title="Code"
          />
        </div>

        <ToolbarDivider />

        {/* Headings */}
        <div className="flex gap-0.5">
          <ToolbarButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            isActive={editor.isActive("heading", { level: 1 })}
            icon={Heading1}
            title="Heading 1"
          />
          <ToolbarButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            isActive={editor.isActive("heading", { level: 2 })}
            icon={Heading2}
            title="Heading 2"
          />
          <ToolbarButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            isActive={editor.isActive("heading", { level: 3 })}
            icon={Heading3}
            title="Heading 3"
          />
        </div>

        <ToolbarDivider />

        {/* Lists */}
        <div className="flex gap-0.5">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive("bulletList")}
            icon={List}
            title="Bullet List"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive("orderedList")}
            icon={ListOrdered}
            title="Ordered List"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive("blockquote")}
            icon={Quote}
            title="Blockquote"
          />
        </div>

        <ToolbarDivider />

        {/* Alignment */}
        <div className="flex gap-0.5">
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            isActive={editor.isActive({ textAlign: "left" })}
            icon={AlignLeft}
            title="Align Left"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            isActive={editor.isActive({ textAlign: "center" })}
            icon={AlignCenter}
            title="Align Center"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            isActive={editor.isActive({ textAlign: "right" })}
            icon={AlignRight}
            title="Align Right"
          />
        </div>

        <ToolbarDivider />

        {/* Links and Images */}
        <div className="flex gap-0.5">
          <ToolbarButton
            onClick={() => {
              const url = window.prompt("Enter link URL:");
              if (url) {
                editor.chain().focus().setLink({ href: url }).run();
              }
            }}
            isActive={editor.isActive("link")}
            icon={LinkIcon}
            title="Add Link"
          />
          <ToolbarButton
            onClick={() => {
              const url = window.prompt("Enter image URL:");
              if (url) {
                editor.chain().focus().setImage({ src: url }).run();
              }
            }}
            isActive={false}
            icon={ImageIcon}
            title="Add Image"
          />
        </div>

        <ToolbarDivider />

        {/* Undo/Redo */}
        <div className="flex gap-0.5">
          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            isActive={false}
            icon={Undo}
            title="Undo (Ctrl+Z)"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            isActive={false}
            icon={Redo}
            title="Redo (Ctrl+Y)"
          />
        </div>
      </div>
    );
  };

  const renderContentTab = () => (
    <div className="space-y-6">
      {/* Rich Text Editor for text and heading elements */}
      {(selectedElementData.type === "text" ||
        selectedElementData.type === "heading") && (
        <div>
          <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">
            Rich Text Editor
          </label>
          <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
            <MenuBar />
            <EditorContent editor={editor} />
          </div>
        </div>
      )}

      {/* Simple text editor for other elements */}
      {selectedElementData.type !== "text" &&
        selectedElementData.type !== "heading" &&
        selectedElementData.type !== "navbar" &&
        selectedElementData.type !== "footer" && (
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">
              Content
            </label>
            <textarea
              value={selectedElementData.content}
              onChange={(e) =>
                updateElementContent(selectedElement, e.target.value)
              }
              className="w-full px-4 py-3 border border-gray-100 rounded-xl text-sm font-medium bg-gray-50 focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 focus:bg-white transition-all"
              rows={4}
            />
          </div>
        )}

      {/* Navbar specific */}
      {selectedElementData.type === "navbar" && (
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
              Logo Text
            </label>
            <input
              type="text"
              value={selectedElementData.styles.logoText || "My Campaign"}
              onChange={(e) => handleStyleChange("logoText", e.target.value)}
              className="w-full px-4 py-3 border border-gray-100 rounded-xl text-sm font-medium bg-gray-50 focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 focus:bg-white transition-all"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">
                Navigation Links
              </label>
              <button
                type="button"
                onClick={() => {
                  const links = selectedElementData.styles.navLinks || [];
                  const newLinks = [...links, { label: "New Link", href: "#" }];
                  handleStyleChange("navLinks", newLinks);
                }}
                className="text-xs font-black text-yellow-600 hover:text-yellow-700 flex items-center gap-1 uppercase tracking-wider cursor-pointer"
              >
                <Plus size={12} /> Add Link
              </button>
            </div>

            <div className="space-y-3">
              {(selectedElementData.styles.navLinks || []).map((link: any, index: number, arr: any[]) => (
                <div key={index} className="flex gap-2 items-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      value={link.label}
                      onChange={(e) => {
                        const newLinks = [...arr];
                        newLinks[index] = { ...newLinks[index], label: e.target.value };
                        handleStyleChange("navLinks", newLinks);
                      }}
                      className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-xs font-semibold bg-white"
                      placeholder="Label (e.g. About)"
                    />
                    <input
                      type="text"
                      value={link.href}
                      onChange={(e) => {
                        const newLinks = [...arr];
                        newLinks[index] = { ...newLinks[index], href: e.target.value };
                        handleStyleChange("navLinks", newLinks);
                      }}
                      className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-xs font-semibold bg-white"
                      placeholder="Anchor/URL (e.g. #about)"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const newLinks = arr.filter((_, i) => i !== index);
                      handleStyleChange("navLinks", newLinks);
                    }}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              {(selectedElementData.styles.navLinks || []).length === 0 && (
                <p className="text-[11px] text-gray-400 font-medium italic text-center py-2">
                  No links added yet. Click "Add Link" to start.
                </p>
              )}
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4 space-y-4">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedElementData.styles.showDonateBtn !== false}
                onChange={(e) => handleStyleChange("showDonateBtn", e.target.checked)}
                className="w-4 h-4 text-yellow-500 border-gray-200 rounded focus:ring-yellow-500"
              />
              <span className="text-xs font-black text-gray-700 uppercase tracking-wide">
                Show Call-to-Action
              </span>
            </label>

            {selectedElementData.styles.showDonateBtn !== false && (
              <div className="space-y-4 pl-6 border-l-2 border-yellow-500/20">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">
                    CTA Button Text
                  </label>
                  <input
                    type="text"
                    value={selectedElementData.styles.donateBtnText || "Donate Now"}
                    onChange={(e) => handleStyleChange("donateBtnText", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-100 rounded-xl text-sm font-medium bg-gray-50 focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">
                    CTA Link/Anchor
                  </label>
                  <input
                    type="text"
                    value={selectedElementData.styles.donateBtnHref || "#donate"}
                    onChange={(e) => handleStyleChange("donateBtnHref", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-100 rounded-xl text-sm font-medium bg-gray-50 focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 transition-all"
                    placeholder="e.g. #donate"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer specific */}
      {selectedElementData.type === "footer" && (
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
              Copyright Text
            </label>
            <textarea
              value={selectedElementData.styles.copyrightText || ""}
              onChange={(e) => handleStyleChange("copyrightText", e.target.value)}
              className="w-full px-4 py-3 border border-gray-100 rounded-xl text-sm font-medium bg-gray-50 focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 focus:bg-white transition-all"
              rows={3}
              placeholder="e.g. © 2026 My Campaign. All rights reserved."
            />
          </div>

          <div className="border-t border-gray-100 pt-4 space-y-4">
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">
              Social Links
            </label>

            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">
                  Facebook URL
                </label>
                <input
                  type="text"
                  value={selectedElementData.styles.facebookUrl || ""}
                  onChange={(e) => handleStyleChange("facebookUrl", e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-100 rounded-xl text-xs font-medium bg-gray-50 focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 transition-all"
                  placeholder="https://facebook.com/..."
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">
                  Twitter URL
                </label>
                <input
                  type="text"
                  value={selectedElementData.styles.twitterUrl || ""}
                  onChange={(e) => handleStyleChange("twitterUrl", e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-100 rounded-xl text-xs font-medium bg-gray-50 focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 transition-all"
                  placeholder="https://twitter.com/..."
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">
                  Instagram URL
                </label>
                <input
                  type="text"
                  value={selectedElementData.styles.instagramUrl || ""}
                  onChange={(e) => handleStyleChange("instagramUrl", e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-100 rounded-xl text-xs font-medium bg-gray-50 focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 transition-all"
                  placeholder="https://instagram.com/..."
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">
                  YouTube URL
                </label>
                <input
                  type="text"
                  value={selectedElementData.styles.youtubeUrl || ""}
                  onChange={(e) => handleStyleChange("youtubeUrl", e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-100 rounded-xl text-xs font-medium bg-gray-50 focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 transition-all"
                  placeholder="https://youtube.com/..."
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Button specific */}
      {selectedElementData.type === "button" && (
        <div>
          <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">
            Button Link
          </label>
          <input
            type="text"
            value={selectedElementData.styles.href || ""}
            onChange={(e) => handleStyleChange("href", e.target.value)}
            className="w-full px-4 py-3 border border-gray-100 rounded-xl text-sm font-medium bg-gray-50 focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 focus:bg-white transition-all"
            placeholder="https://example.com"
          />
        </div>
      )}

      {/* Image specific */}
      {selectedElementData.type === "image" && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">
              Image URL or Upload
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={selectedElementData.content}
                onChange={(e) =>
                  updateElementContent(selectedElement, e.target.value)
                }
                className="flex-1 px-4 py-3 border border-gray-100 rounded-xl text-sm font-medium bg-gray-50 focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 focus:bg-white transition-all"
                placeholder="https://example.com/image.jpg"
              />
              <label className="flex items-center justify-center px-4 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-black rounded-xl cursor-pointer transition-colors shadow-sm text-xs uppercase tracking-widest whitespace-nowrap">
                Upload
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={(e) => handleFileUpload(e, (base64) => updateElementContent(selectedElement, base64))} 
                />
              </label>
            </div>
            {selectedElementData.content && (
              <div className="mt-3">
                <img
                  src={selectedElementData.content}
                  alt="Preview"
                  className="w-full h-32 object-cover rounded-2xl border border-gray-100"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://via.placeholder.com/400x200?text=Invalid+Image+URL";
                  }}
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
              Max Width
            </label>
            <input
              type="text"
              value={selectedElementData.styles.maxWidth || "100%"}
              onChange={(e) => handleStyleChange("maxWidth", e.target.value)}
              className="w-full px-4 py-3 border border-gray-100 rounded-xl text-sm font-medium bg-gray-50 focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 transition-all"
              placeholder="e.g. 100%, 600px, 400px"
            />
          </div>

          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
              Height
            </label>
            <input
              type="text"
              value={selectedElementData.styles.height || "auto"}
              onChange={(e) => handleStyleChange("height", e.target.value)}
              className="w-full px-4 py-3 border border-gray-100 rounded-xl text-sm font-medium bg-gray-50 focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 transition-all"
              placeholder="e.g. auto, 300px, 400px"
            />
          </div>
        </div>
      )}

      {/* Video specific */}
      {selectedElementData.type === "video" && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">
              Video URL or Upload
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={selectedElementData.content}
                onChange={(e) =>
                  updateElementContent(selectedElement, e.target.value)
                }
                className="flex-1 px-4 py-3 border border-gray-100 rounded-xl text-sm font-medium bg-gray-50 focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 focus:bg-white transition-all"
                placeholder="https://www.youtube.com/embed/..."
              />
              <label className="flex items-center justify-center px-4 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-black rounded-xl cursor-pointer transition-colors shadow-sm text-xs uppercase tracking-widest whitespace-nowrap">
                Upload
                <input 
                  type="file" 
                  accept="video/*" 
                  className="hidden" 
                  onChange={(e) => handleFileUpload(e, (base64) => updateElementContent(selectedElement, base64))} 
                />
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
              Max Width
            </label>
            <input
              type="text"
              value={selectedElementData.styles.maxWidth || "100%"}
              onChange={(e) => handleStyleChange("maxWidth", e.target.value)}
              className="w-full px-4 py-3 border border-gray-100 rounded-xl text-sm font-medium bg-gray-50 focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 transition-all"
              placeholder="e.g. 100%, 800px, 600px"
            />
          </div>

          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
              Height
            </label>
            <input
              type="text"
              value={selectedElementData.styles.height || "400px"}
              onChange={(e) => handleStyleChange("height", e.target.value)}
              className="w-full px-4 py-3 border border-gray-100 rounded-xl text-sm font-medium bg-gray-50 focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 transition-all"
              placeholder="e.g. 400px, 300px"
            />
          </div>
        </div>
      )}

      {/* Form specific */}
      {selectedElementData.type === "form" && (
        <div className="space-y-6">
          {/* Submit Button Text */}
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">
              Submit Button Text
            </label>
            <input
              type="text"
              value={selectedElementData.styles.submitText || "Submit"}
              onChange={(e) => handleStyleChange("submitText", e.target.value)}
              className="w-full px-4 py-3 border border-gray-100 rounded-xl text-sm font-medium bg-gray-50 focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 focus:bg-white transition-all"
            />
          </div>

          {/* Form Fields Manager */}
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">
              Form Fields
            </label>
            <div className="space-y-4">
              {(() => {
                const fields = selectedElementData.styles.formFields || [
                  { id: "1", type: "text", label: "Name", placeholder: "Your name", required: true },
                  { id: "2", type: "email", label: "Email", placeholder: "your@email.com", required: true }
                ];

                const updateFields = (newFields: any) => {
                  handleStyleChange("formFields", newFields);
                };

                return (
                  <>
                    <div className="space-y-3">
                      {fields.map((field: any, idx: number) => (
                        <div key={field.id} className="p-4 bg-gray-50 border border-gray-100 rounded-2xl space-y-3 relative group">
                          {/* Top row with type and move/delete buttons */}
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                              {field.type}
                            </span>
                            <div className="flex gap-1">
                              <button
                                type="button"
                                disabled={idx === 0}
                                onClick={() => {
                                  const newFields = [...fields];
                                  const temp = newFields[idx];
                                  newFields[idx] = newFields[idx - 1];
                                  newFields[idx - 1] = temp;
                                  updateFields(newFields);
                                }}
                                className="p-1 text-gray-400 hover:text-gray-900 disabled:opacity-30"
                              >
                                ▲
                              </button>
                              <button
                                type="button"
                                disabled={idx === fields.length - 1}
                                onClick={() => {
                                  const newFields = [...fields];
                                  const temp = newFields[idx];
                                  newFields[idx] = newFields[idx + 1];
                                  newFields[idx + 1] = temp;
                                  updateFields(newFields);
                                }}
                                className="p-1 text-gray-400 hover:text-gray-900 disabled:opacity-30"
                              >
                                ▼
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  updateFields(fields.filter((f: any) => f.id !== field.id));
                                }}
                                className="p-1 text-gray-400 hover:text-red-500"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>

                          {/* Label input */}
                          <div>
                            <input
                              type="text"
                              placeholder="Field Label"
                              value={field.label}
                              onChange={(e) => {
                                const newFields = fields.map((f: any) => f.id === field.id ? { ...f, label: e.target.value } : f);
                                updateFields(newFields);
                              }}
                              className="w-full px-3 py-1.5 border border-gray-100 rounded-lg text-xs font-bold bg-white"
                            />
                          </div>

                          {/* Placeholder input (only for input types, not checkbox) */}
                          {field.type !== "checkbox" && (
                            <div>
                              <input
                                type="text"
                                placeholder="Placeholder"
                                value={field.placeholder || ""}
                                onChange={(e) => {
                                  const newFields = fields.map((f: any) => f.id === field.id ? { ...f, placeholder: e.target.value } : f);
                                  updateFields(newFields);
                                }}
                                className="w-full px-3 py-1.5 border border-gray-100 rounded-lg text-xs bg-white"
                              />
                            </div>
                          )}

                          {/* Options input for select type */}
                          {field.type === "select" && (
                            <div>
                              <input
                                type="text"
                                placeholder="Options (comma separated)"
                                value={field.options || ""}
                                onChange={(e) => {
                                  const newFields = fields.map((f: any) => f.id === field.id ? { ...f, options: e.target.value } : f);
                                  updateFields(newFields);
                                }}
                                className="w-full px-3 py-1.5 border border-gray-100 rounded-lg text-xs bg-white font-medium"
                              />
                            </div>
                          )}

                          {/* Settings row (type selection, required) */}
                          <div className="flex items-center gap-4 justify-between">
                            <select
                              value={field.type}
                              onChange={(e) => {
                                const newFields = fields.map((f: any) => f.id === field.id ? { ...f, type: e.target.value } : f);
                                updateFields(newFields);
                              }}
                              className="px-2 py-1 bg-white border border-gray-100 rounded text-xs font-bold text-gray-500"
                            >
                              <option value="text">Text</option>
                              <option value="email">Email</option>
                              <option value="number">Number</option>
                              <option value="tel">Phone</option>
                              <option value="textarea">Text Area</option>
                              <option value="select">Dropdown</option>
                              <option value="checkbox">Checkbox</option>
                            </select>

                            <label className="flex items-center gap-1.5 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={field.required || false}
                                onChange={(e) => {
                                  const newFields = fields.map((f: any) => f.id === field.id ? { ...f, required: e.target.checked } : f);
                                  updateFields(newFields);
                                }}
                                className="w-3.5 h-3.5 text-yellow-500 border-gray-200 rounded"
                              />
                              <span className="text-[10px] font-black uppercase text-gray-400">Required</span>
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const newField = {
                          id: crypto.randomUUID(),
                          type: "text" as const,
                          label: "New Field",
                          placeholder: "Enter value",
                          required: false
                        };
                        updateFields([...fields, newField]);
                      }}
                      className="w-full py-2.5 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 border border-dashed border-yellow-300 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Plus size={14} /> Add New Field
                    </button>
                  </>
                );
              })()}
            </div>
          </div>

          {/* Payment Option Donate Button */}
          <div className="pt-6 border-t border-gray-100 space-y-4">
            <h4 className="text-xs font-black uppercase tracking-widest text-gray-400">Donate Button Settings</h4>
            {(() => {
              const isPaymentActive = currentWebsite?.campaignId && typeof currentWebsite.campaignId === "object"
                ? currentWebsite.campaignId.paymentOptionActive
                : currentWebsite?.paymentOptionActive;

              if (!isPaymentActive) {
                return (
                  <div className="p-4 bg-orange-50 border border-orange-100 rounded-2xl">
                    <p className="text-xs text-orange-700 font-bold leading-relaxed">
                      💡 <strong>Payment Option is disabled.</strong> If you want to show a Donate button, enable "Payments & Donations" in your campaign settings (Campaign setup step 4).
                    </p>
                  </div>
                );
              }

              return (
                <div className="space-y-4">
                  {/* Donate Button Text */}
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                      Donate Button Text
                    </label>
                    <input
                      type="text"
                      value={selectedElementData.styles.donateText || "Donate Now"}
                      onChange={(e) => handleStyleChange("donateText", e.target.value)}
                      className="w-full px-4 py-3 border border-gray-100 rounded-xl text-sm font-medium bg-gray-50 focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 focus:bg-white transition-all"
                      placeholder="Donate Now"
                    />
                  </div>

                  {/* Donate Link */}
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                      Donate Button Link
                    </label>
                    <input
                      type="text"
                      value={selectedElementData.styles.donateLink || ""}
                      onChange={(e) => handleStyleChange("donateLink", e.target.value)}
                      className="w-full px-4 py-3 border border-gray-100 rounded-xl text-sm font-medium bg-gray-50 focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 focus:bg-white transition-all"
                      placeholder="https://example.com/donate"
                    />
                  </div>

                  {/* Donate Button Color */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">
                        Button Background Color
                      </label>
                      <span className="text-xs font-black uppercase">
                        {selectedElementData.styles.donateBgColor || "#EF4444"}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={selectedElementData.styles.donateBgColor || "#EF4444"}
                        onChange={(e) => handleStyleChange("donateBgColor", e.target.value)}
                        className="w-10 h-10 rounded-lg border border-gray-100 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={selectedElementData.styles.donateBgColor || "#EF4444"}
                        onChange={(e) => handleStyleChange("donateBgColor", e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-100 rounded-lg text-sm"
                      />
                    </div>
                  </div>

                  {/* Donate Button Text Color */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">
                        Button Text Color
                      </label>
                      <span className="text-xs font-black uppercase">
                        {selectedElementData.styles.donateColor || "#FFFFFF"}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={selectedElementData.styles.donateColor || "#FFFFFF"}
                        onChange={(e) => handleStyleChange("donateColor", e.target.value)}
                        className="w-10 h-10 rounded-lg border border-gray-100 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={selectedElementData.styles.donateColor || "#FFFFFF"}
                        onChange={(e) => handleStyleChange("donateColor", e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-100 rounded-lg text-sm"
                      />
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Grid and Columns specific */}
      {(selectedElementData.type === "grid" || selectedElementData.type === "columns") && (
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">
              Number of Columns
            </label>
            <input
              type="number"
              min="1"
              max="6"
              value={selectedElementData.styles.gridColumns || 2}
              onChange={(e) => {
                const count = parseInt(e.target.value) || 2;
                handleStyleChange("gridColumns", count);
                
                // Also adjust children if needed
                const currentChildren = selectedElementData.children || [];
                if (currentChildren.length < count) {
                  const newChildren = [...currentChildren];
                  for (let i = currentChildren.length; i < count; i++) {
                    newChildren.push({
                      id: crypto.randomUUID(),
                      type: "text",
                      content: `<p>Column ${i + 1}</p>`,
                      styles: { padding: "16px", backgroundColor: "#e5e7eb", borderRadius: "4px" }
                    });
                  }
                  updateElement(selectedElement, { children: newChildren });
                } else if (currentChildren.length > count) {
                  updateElement(selectedElement, { children: currentChildren.slice(0, count) });
                }
              }}
              className="w-full px-4 py-3 border border-gray-100 rounded-xl text-sm font-medium bg-gray-50 focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 focus:bg-white transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">
              Grid Gap
            </label>
            <input
              type="text"
              value={selectedElementData.styles.gap || "20px"}
              onChange={(e) => handleStyleChange("gap", e.target.value)}
              className="w-full px-4 py-3 border border-gray-100 rounded-xl text-sm font-medium bg-gray-50 focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 focus:bg-white transition-all"
              placeholder="e.g., 20px"
            />
          </div>
        </div>
      )}

      {/* Slider specific */}
      {selectedElementData.type === "slider" && (
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">
              Autoplay Slider
            </label>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedElementData.styles.autoplay || false}
                onChange={(e) => handleStyleChange("autoplay", e.target.checked)}
                className="w-4 h-4 text-yellow-500 border-gray-300 rounded focus:ring-yellow-500"
              />
              <span className="text-sm text-gray-700">Enable Autoplay</span>
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 flex justify-between items-center">
              <span>Slider Images</span>
              <button 
                onClick={() => {
                  const newChildren = [...(selectedElementData.children || []), {
                    id: crypto.randomUUID(),
                    type: "image",
                    content: "https://via.placeholder.com/800x400?text=New+Slide",
                    styles: { borderRadius: "12px" }
                  }];
                  updateElement(selectedElement, { children: newChildren });
                }}
                className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-2 py-1 rounded text-xs transition-colors"
              >
                + Add Slide
              </button>
            </label>
            <div className="space-y-4">
              {selectedElementData.children?.map((child: any, index: number) => (
                <div key={child.id} className="border border-gray-100 rounded-xl p-3 bg-gray-50/50">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-gray-500">Slide {index + 1}</span>
                    <button 
                      onClick={() => {
                        const newChildren = selectedElementData.children?.filter((c: any) => c.id !== child.id);
                        updateElement(selectedElement, { children: newChildren });
                      }}
                      className="text-red-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={child.content}
                      onChange={(e) => {
                        const newChildren = selectedElementData.children?.map((c: any) => 
                          c.id === child.id ? { ...c, content: e.target.value } : c
                        );
                        updateElement(selectedElement, { children: newChildren });
                      }}
                      className="flex-1 px-3 py-2 border border-gray-100 rounded-lg text-xs font-medium bg-white focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 transition-all"
                      placeholder="Image URL"
                    />
                    <label className="flex items-center justify-center px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-lg cursor-pointer transition-colors text-xs whitespace-nowrap">
                      Upload
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => handleFileUpload(e, (base64) => {
                          const newChildren = selectedElementData.children?.map((c: any) => 
                            c.id === child.id ? { ...c, content: base64 } : c
                          );
                          updateElement(selectedElement, { children: newChildren });
                        })} 
                      />
                    </label>
                  </div>
                  <img src={child.content} className="w-full h-16 object-cover rounded border border-gray-100" alt={`Slide ${index + 1}`} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderStylesTab = () => (
    <div className="space-y-8">
      {/* Colors Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <label className="text-sm font-bold text-gray-500 tracking-tight">
            Text Color
          </label>
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded-md border border-gray-200"
              style={{
                backgroundColor: selectedElementData.styles.color || "#000000",
              }}
            />
            <span className="text-xs font-black uppercase tracking-widest">
              {selectedElementData.styles.color || "#000000"}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <input
            type="color"
            value={selectedElementData.styles.color || "#000000"}
            onChange={(e) => handleStyleChange("color", e.target.value)}
            className="w-12 h-12 rounded-xl border border-gray-100 cursor-pointer"
          />
          <input
            type="text"
            value={selectedElementData.styles.color || "#000000"}
            onChange={(e) => handleStyleChange("color", e.target.value)}
            className="flex-1 px-4 py-3 border border-gray-100 rounded-xl text-sm font-bold bg-gray-50 focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 transition-all"
            placeholder="#000000"
          />
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <label className="text-sm font-bold text-gray-500 tracking-tight">
            Background Color
          </label>
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded-md border border-gray-200"
              style={{
                backgroundColor:
                  selectedElementData.styles.backgroundColor || "#ffffff",
              }}
            />
            <span className="text-xs font-black uppercase tracking-widest">
              {selectedElementData.styles.backgroundColor || "#ffffff"}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <input
            type="color"
            value={selectedElementData.styles.backgroundColor || "#ffffff"}
            onChange={(e) =>
              handleStyleChange("backgroundColor", e.target.value)
            }
            className="w-12 h-12 rounded-xl border border-gray-100 cursor-pointer"
          />
          <input
            type="text"
            value={selectedElementData.styles.backgroundColor || "#ffffff"}
            onChange={(e) =>
              handleStyleChange("backgroundColor", e.target.value)
            }
            className="flex-1 px-4 py-3 border border-gray-100 rounded-xl text-sm font-bold bg-gray-50 focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 transition-all"
            placeholder="#ffffff"
          />
        </div>
      </div>

      {/* Font Size */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <label className="text-sm font-bold text-gray-500 tracking-tight">
            Font Size
          </label>
          <span className="text-xs font-black px-3 py-1 bg-gray-50 rounded-lg uppercase tracking-widest">
            {selectedElementData.styles.fontSize || "Default"}
          </span>
        </div>
        <select
          value={selectedElementData.styles.fontSize || ""}
          onChange={(e) => handleStyleChange("fontSize", e.target.value)}
          className="w-full p-4 rounded-xl bg-gray-50 border border-gray-100 font-bold text-sm focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 transition-all"
        >
          <option value="">Default</option>
          <option value="12px">12px - Extra Small</option>
          <option value="14px">14px - Small</option>
          <option value="16px">16px - Base</option>
          <option value="18px">18px - Large</option>
          <option value="20px">20px - Extra Large</option>
          <option value="24px">24px - 2XL</option>
          <option value="30px">30px - 3XL</option>
          <option value="36px">36px - 4XL</option>
          <option value="48px">48px - 5XL</option>
          <option value="60px">60px - 6XL</option>
        </select>
      </div>

      {/* Font Weight */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <label className="text-sm font-bold text-gray-500 tracking-tight">
            Font Weight
          </label>
          <span className="text-xs font-black px-3 py-1 bg-gray-50 rounded-lg uppercase tracking-widest">
            {selectedElementData.styles.fontWeight || "400"}
          </span>
        </div>
        <select
          value={selectedElementData.styles.fontWeight || ""}
          onChange={(e) => handleStyleChange("fontWeight", e.target.value)}
          className="w-full p-4 rounded-xl bg-gray-50 border border-gray-100 font-bold text-sm focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 transition-all"
        >
          <option value="">Default</option>
          <option value="300">300 - Light</option>
          <option value="400">400 - Normal</option>
          <option value="500">500 - Medium</option>
          <option value="600">600 - Semi Bold</option>
          <option value="700">700 - Bold</option>
          <option value="800">800 - Extra Bold</option>
          <option value="900">900 - Black</option>
        </select>
      </div>

      {/* Font Family */}
      <div>
        <label className="block text-sm font-bold text-gray-500 tracking-tight mb-4">
          Font Family
        </label>
        <select
          value={selectedElementData.styles.fontFamily || ""}
          onChange={(e) => handleStyleChange("fontFamily", e.target.value)}
          className="w-full p-5 rounded-[1.5rem] bg-gray-50/50 border border-gray-100 font-black text-sm tracking-tight focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 transition-all appearance-none cursor-pointer"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 16px center",
            paddingRight: "48px",
          }}
        >
          <option value="">Default (Inherit)</option>
          <option value="Inter">Inter</option>
          <option value="Arial">Arial</option>
          <option value="Helvetica">Helvetica</option>
          <option value="Georgia">Georgia</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Courier New">Courier New</option>
          <option value="Verdana">Verdana</option>
          <option value="Trebuchet MS">Trebuchet MS</option>
          <option value="system-ui">System UI</option>
          <option value="Roboto">Roboto</option>
          <option value="Poppins">Poppins</option>
        </select>
      </div>

      {/* Anchor / Section ID */}
      <div>
        <label className="block text-sm font-bold text-gray-500 tracking-tight mb-4">
          Anchor / Section ID
        </label>
        <input
          type="text"
          value={selectedElementData.styles.anchorId || ""}
          onChange={(e) => handleStyleChange("anchorId", e.target.value)}
          className="w-full px-4 py-3 border border-gray-100 rounded-xl text-sm font-bold bg-gray-50 focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 focus:bg-white transition-all"
          placeholder="e.g., features"
        />
        <p className="text-[10px] text-gray-400 font-bold mt-2 leading-relaxed">
          Set an anchor ID to make navbar links and buttons scroll directly to this element (e.g. use "#features" in links and set "features" here).
        </p>
      </div>

      {/* Spacing */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <label className="text-sm font-bold text-gray-500 tracking-tight">
            Padding
          </label>
        </div>
        <input
          type="text"
          value={selectedElementData.styles.padding || ""}
          onChange={(e) => handleStyleChange("padding", e.target.value)}
          className="w-full p-4 rounded-xl bg-gray-50 border border-gray-100 font-bold text-sm focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 transition-all"
          placeholder="e.g., 16px"
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <label className="text-sm font-bold text-gray-500 tracking-tight">
            Margin
          </label>
        </div>
        <input
          type="text"
          value={selectedElementData.styles.margin || ""}
          onChange={(e) => handleStyleChange("margin", e.target.value)}
          className="w-full p-4 rounded-xl bg-gray-50 border border-gray-100 font-bold text-sm focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 transition-all"
          placeholder="e.g., 16px"
        />
      </div>

      {/* Border */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <label className="text-sm font-bold text-gray-500 tracking-tight">
            Border Radius
          </label>
        </div>
        <input
          type="text"
          value={selectedElementData.styles.borderRadius || ""}
          onChange={(e) => handleStyleChange("borderRadius", e.target.value)}
          className="w-full p-4 rounded-xl bg-gray-50 border border-gray-100 font-bold text-sm focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 transition-all"
          placeholder="e.g., 8px"
        />
      </div>
    </div>
  );

  return (
    <aside className="w-80 bg-white border-l border-gray-100 flex flex-col h-full">
      {/* Element Actions Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Settings size={18} className="text-gray-400" />
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">
              {selectedElementData.type}
            </h3>
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => duplicateElement(selectedElement)}
              className="p-2.5 hover:bg-gray-50 rounded-xl transition-all text-gray-400 hover:text-gray-900 border border-transparent hover:border-gray-100"
              title="Duplicate Element"
            >
              <Copy size={16} />
            </button>
            <button
              onClick={() => removeElement(selectedElement)}
              className="p-2.5 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-xl transition-all border border-transparent hover:border-red-100"
              title="Delete Element"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-gray-50 p-1 m-4 rounded-xl border border-gray-100">
        <button
          onClick={() => setRightPanelTab("content")}
          className={`flex-1 py-3 rounded-lg text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
            rightPanelTab === "content"
              ? "bg-white shadow-md text-yellow-600"
              : "text-gray-400 hover:text-gray-900"
          }`}
        >
          <FileText size={14} />
          Content
        </button>
        <button
          onClick={() => setRightPanelTab("styles")}
          className={`flex-1 py-3 rounded-lg text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
            rightPanelTab === "styles"
              ? "bg-white shadow-md text-yellow-600"
              : "text-gray-400 hover:text-gray-900"
          }`}
        >
          <PaintBucket size={14} />
          Styles
        </button>
      </div>

      {/* Content based on active tab */}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        {rightPanelTab === "content" ? renderContentTab() : renderStylesTab()}
      </div>
    </aside>
  );
};

export default RightPanel;
