// src/data/elements.ts
import { StructureCategory, ElementCategory } from "../types/index";

export const structures: StructureCategory[] = [
  {
    id: "structures",
    label: "Structures",
    icon: "Layout",
    elements: [
      {
        type: "grid",
        label: "Grid",
        icon: "LayoutGrid",
        defaultContent: "",
        defaultStyles: {
          gridColumns: 2,
          gap: "20px",
          padding: "20px",
          minHeight: "100px",
          backgroundColor: "#f9fafb",
          borderRadius: "8px",
        },
      },
      {
        type: "columns",
        label: "Columns",
        icon: "Columns",
        defaultContent: "",
        defaultStyles: {
          gridColumns: 2,
          gap: "20px",
          padding: "20px",
          minHeight: "100px",
          backgroundColor: "#f9fafb",
          borderRadius: "8px",
        },
      },
      {
        type: "slider",
        label: "Slider",
        icon: "Sliders",
        defaultContent: "Slider Content",
        defaultStyles: {
          minHeight: "200px",
          backgroundColor: "#f3f4f6",
          borderRadius: "8px",
          padding: "40px",
          textAlign: "center",
        },
      },
    ],
  },
];

export const elementCategories: ElementCategory[] = [
  {
    id: "elements",
    label: "Elements",
    icon: "Type",
    elements: [
      {
        type: "heading",
        label: "Heading",
        icon: "Heading",
        defaultContent: "Add Your Heading",
        defaultStyles: {
          fontSize: "32px",
          fontWeight: "bold",
          color: "#111827",
          margin: "16px 0",
          textAlign: "center",
        },
      },
      {
        type: "text",
        label: "Text Editor",
        icon: "AlignLeft",
        defaultContent:
          "<p>Add your text here. This is a rich text editor where you can format your content.</p>",
        defaultStyles: {
          fontSize: "16px",
          color: "#374151",
          lineHeight: "1.6",
          margin: "12px 0",
        },
      },
      {
        type: "button",
        label: "Button",
        icon: "MousePointer",
        defaultContent: "Click Here",
        defaultStyles: {
          fontSize: "16px",
          fontWeight: "600",
          color: "#ffffff",
          backgroundColor: "#3B82F6",
          padding: "12px 32px",
          borderRadius: "8px",
          textAlign: "center",
          borderStyle: "none",
        },
      },
      {
        type: "image",
        label: "Image",
        icon: "Image",
        defaultContent:
          "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800",
        defaultStyles: {
          width: "100%",
          maxWidth: "100%",
          height: "auto",
          borderRadius: "8px",
        },
      },
      {
        type: "video",
        label: "Video",
        icon: "Video",
        defaultContent: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        defaultStyles: {
          width: "100%",
          maxWidth: "100%",
          height: "400px",
          borderRadius: "8px",
        },
      },
      {
        type: "form",
        label: "Form",
        icon: "FormInput",
        defaultContent: "",
        defaultStyles: {
          padding: "24px",
          backgroundColor: "#f9fafb",
          borderRadius: "8px",
          submitText: "Submit",
          formFields: [
            { id: "1", type: "text", label: "Name", placeholder: "Your name", required: true },
            { id: "2", type: "email", label: "Email", placeholder: "your@email.com", required: true }
          ]
        },
      },
      {
        type: "navbar",
        label: "Navbar",
        icon: "Layout",
        defaultContent: "",
        defaultStyles: {
          logoText: "My Campaign",
          navLinks: [
            { label: "Home", href: "#" },
            { label: "About", href: "#about" },
            { label: "Contact", href: "#contact" }
          ],
          showDonateBtn: true,
          donateBtnText: "Donate Now",
          donateBtnHref: "#donate",
          backgroundColor: "#ffffff",
          color: "#111827",
          padding: "16px 24px",
          borderRadius: "0px",
          margin: "0 0 24px 0",
          borderStyle: "none"
        }
      },
      {
        type: "footer",
        label: "Footer",
        icon: "Layout",
        defaultContent: "",
        defaultStyles: {
          copyrightText: "© 2026 My Campaign. All rights reserved.",
          facebookUrl: "",
          twitterUrl: "",
          instagramUrl: "",
          youtubeUrl: "",
          backgroundColor: "#111827",
          color: "#9ca3af",
          padding: "32px 24px",
          borderRadius: "0px",
          margin: "24px 0 0 0",
          borderStyle: "none"
        }
      }
    ],
  },
];
