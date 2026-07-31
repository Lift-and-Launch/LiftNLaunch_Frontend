import React from "react";
import { useNavigate } from "react-router-dom";
import { useWebsiteStore } from "../../store/websiteStore";
import {
  Undo2,
  Redo2,
  Monitor,
  Tablet,
  Smartphone,
  Eye,
  EyeOff,
  Save,
  Download,
  Upload,
} from "lucide-react";

const TopToolbar: React.FC = () => {
  const {
    undo,
    redo,
    historyIndex,
    history,
    devicePreview,
    setDevicePreview,
    isPreviewMode,
    setPreviewMode,
    currentWebsite,
    saveToLocalStorage,
    loadFromLocalStorage,
  } = useWebsiteStore();
  const navigate = useNavigate();

  const devices = [
    { type: "desktop" as const, icon: Monitor, label: "Desktop" },
    { type: "tablet" as const, icon: Tablet, label: "Tablet" },
    { type: "mobile" as const, icon: Smartphone, label: "Mobile" },
  ];

  const handleExport = () => {
    if (currentWebsite) {
      const htmlContent = generateFullHTML(currentWebsite);
      const blob = new Blob([htmlContent], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${currentWebsite.name || "website"}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        try {
          const website = JSON.parse(e.target.result);
          localStorage.setItem(
            "website-builder-pro-data",
            JSON.stringify(website),
          );
          loadFromLocalStorage();
        } catch (error) {
          alert("Invalid website file");
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const generateFullHTML = (website: any) => {
    const styles = generateStyles(website);
    const body = generateBodyHTML(website.elements);

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${website.name || "My Website"}</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Poppins:wght@300;400;500;600;700;800;900&family=Roboto:wght@300;400;500;700;900&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: '${website.globalStyles?.fontFamily || "Inter"}', sans-serif;
            line-height: 1.6;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }
        ${styles}
    </style>
</head>
<body>
    ${body}
</body>
</html>`;
  };

  const generateStyles = (website: any) => {
    let styles = "";
    const processElements = (elements: any[]) => {
      elements.forEach((el, index) => {
        const styleStr = Object.entries(el.styles)
          .filter(([key, value]) => value && key !== "href" && key !== "target")
          .map(([key, value]) => `${camelToKebab(key)}: ${value}`)
          .join(";\n            ");

        if (styleStr) {
          styles += `
        .element-${index} {
            ${styleStr}
        }`;
        }

        if (el.children) {
          processElements(el.children);
        }
      });
    };

    processElements(website.elements);
    return styles;
  };

  const camelToKebab = (str: string) => {
    return str.replace(/([A-Z])/g, "-$1").toLowerCase();
  };

  const generateBodyHTML = (elements: any[]) => {
    return elements
      .map((el, index) => generateElementHTML(el, index))
      .join("\n    ");
  };

  const generateElementHTML = (element: any, index: number): string => {
    const className = `element-${index}`;

    switch (element.type) {
      case "heading":
        return `<h2 class="${className}">${element.content.replace(/<[^>]*>/g, "")}</h2>`;
      case "text":
        return `<div class="${className}">${element.content}</div>`;
      case "button":
        const href = element.styles.href ? `href="${element.styles.href}"` : "";
        return `<a ${href} class="${className}"><button class="${className}">${element.content}</button></a>`;
      case "image":
        return `<img src="${element.content}" alt="Image" class="${className}">`;
      case "video":
        return `<iframe src="${element.content}" class="${className}" frameborder="0" allowfullscreen></iframe>`;
      case "form":
        return `<form class="${className}">
          <input type="text" placeholder="Name" class="${className}">
          <input type="email" placeholder="Email" class="${className}">
          <button type="submit" class="${className}">${element.styles.submitText || "Submit"}</button>
        </form>`;
      case "grid":
      case "columns":
        const childrenHTML =
          element.children
            ?.map(
              (child: any, childIndex: number) =>
                `<div class="${className}-child-${childIndex}">${generateElementHTML(child, childIndex)}</div>`,
            )
            .join("\n") || "";
        return `<div class="${className}">${childrenHTML}</div>`;
      case "slider":
        return `<div class="${className}">
          <h3>Slider Content</h3>
          <div class="slider-container">
            <div class="slide">Slide 1</div>
            <div class="slide">Slide 2</div>
            <div class="slide">Slide 3</div>
          </div>
        </div>`;
      default:
        return `<div class="${className}">${element.content}</div>`;
    }
  };

  return (
    <header className="h-20 bg-white border-b border-gray-100 px-8 flex items-center justify-between z-50">
      {/* Left Section */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center">
            <span className="text-black font-black text-sm">W</span>
          </div>
          <h1 className="text-xl font-black text-gray-900 tracking-tight hidden sm:block">
            Website Builder
          </h1>
        </div>

        <div className="h-8 w-px bg-gray-100"></div>

        {/* Undo/Redo */}
        <div className="flex items-center gap-1">
          <button
            onClick={undo}
            disabled={historyIndex <= 0}
            className="p-3 hover:bg-gray-50 rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed text-gray-400 hover:text-gray-900"
            data-tooltip="Undo (Ctrl+Z)"
          >
            <Undo2 size={18} />
          </button>
          <button
            onClick={redo}
            disabled={historyIndex >= history.length - 1}
            className="p-3 hover:bg-gray-50 rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed text-gray-400 hover:text-gray-900"
            data-tooltip="Redo (Ctrl+Y)"
          >
            <Redo2 size={18} />
          </button>
        </div>
      </div>

      {/* Center Section - Device Preview */}
      <div className="flex items-center bg-gray-50 p-1 rounded-xl border border-gray-100">
        {devices.map((device) => {
          const Icon = device.icon;
          return (
            <button
              key={device.type}
              onClick={() => setDevicePreview(device.type)}
              className={`p-3 rounded-lg transition-all ${
                devicePreview === device.type
                  ? "bg-white shadow-md text-yellow-600"
                  : "text-gray-400 hover:text-gray-900"
              }`}
              data-tooltip={device.label}
            >
              <Icon size={20} />
            </button>
          );
        })}
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* Preview Toggle */}
        <button
          onClick={() => setPreviewMode(!isPreviewMode)}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${
            isPreviewMode
              ? "bg-yellow-50 text-yellow-600 border border-yellow-200"
              : "text-gray-400 hover:text-gray-900 hover:bg-gray-50 border border-transparent"
          }`}
        >
          {isPreviewMode ? <EyeOff size={16} /> : <Eye size={16} />}
          <span className="hidden sm:block">
            {isPreviewMode ? "Exit Preview" : "Preview"}
          </span>
        </button>

        {/* Save Button */}
        <button
          onClick={saveToLocalStorage}
          className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-widest text-gray-900 bg-white border border-gray-200 hover:bg-gray-50 transition-all"
        >
          <Save size={16} />
          <span className="hidden sm:block">Save</span>
        </button>

        {/* Import */}
        <button
          onClick={handleImport}
          className="p-3 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all"
          data-tooltip="Import Website"
        >
          <Upload size={16} />
        </button>

        {/* Export */}
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all"
        >
          <Download size={16} />
          <span className="hidden sm:block">Export</span>
        </button>

        <button
          onClick={() => {
            let cid = currentWebsite?.campaignId;
            if (cid && typeof cid === "object") {
              cid = (cid as any)._id || (cid as any).id;
            }
            navigate('/dashboard/campaign/publish', { state: { campaignId: cid } });
          }}
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest bg-yellow-500 text-black hover:bg-yellow-600 transition-all shadow-lg"
        >
          <span className="hidden sm:block">Publish</span>
        </button>
      </div>
    </header>
  );
};

export default TopToolbar;
