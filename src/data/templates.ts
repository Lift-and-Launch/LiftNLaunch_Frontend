import { WebsiteElement } from "../types/index";
import { v4 as uuidv4 } from "uuid";

// Deep cloning utility to generate fresh unique IDs for elements when applied
export const cloneElementsWithNewIds = (elements: WebsiteElement[]): WebsiteElement[] => {
  return elements.map(el => {
    const newId = uuidv4();
    return {
      ...el,
      id: newId,
      children: el.children ? cloneElementsWithNewIds(el.children) : undefined
    };
  });
};

export interface PageTemplate {
  id: string;
  name: string;
  desc: string;
  badge: string;
  color: string;
  elements: WebsiteElement[];
  globalStyles: {
    fontFamily: string;
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    textColor: string;
  };
}

export const pageTemplates: PageTemplate[] = [
  {
    id: "aether",
    name: "Aether Future Tech",
    desc: "A sleek, cyberpunk-inspired tactical landing page featuring deep-space dark backgrounds, amber highlights, dynamic stat cards, and technical lead captures.",
    badge: "Tech Launch",
    color: "#eab308",
    globalStyles: {
      fontFamily: "Inter",
      primaryColor: "#fbbf24",
      secondaryColor: "#06b6d4",
      backgroundColor: "#090d16",
      textColor: "#ffffff"
    },
    elements: [
      // Navbar
      {
        id: "aether-nav",
        type: "navbar",
        content: "",
        styles: {
          logoText: "AETHER SYSTEM",
          navLinks: [
            { label: "Overview", href: "#overview" },
            { label: "Features", href: "#features" },
            { label: "Stats", href: "#stats" }
          ],
          showDonateBtn: true,
          donateBtnText: "Pre-order Now",
          donateBtnHref: "#order",
          padding: "16px 24px",
          borderRadius: "16px",
          margin: "0 0 40px 0"
        }
      },
      // Badge / Micro-Heading
      {
        id: "aether-badge",
        type: "heading",
        content: `<span style="letter-spacing: 0.25em; color: #fbbf24; font-size: 11px; font-weight: 800; font-family: Inter; display: block; text-align: center;">TACTICAL DATA OVERVIEW</span>`,
        styles: {
          fontSize: "12px",
          textAlign: "center",
          margin: "0 0 12px 0",
          anchorId: "overview"
        }
      },
      // Hero Title
      {
        id: "aether-title",
        type: "heading",
        content: "Zero-Emission Aerial Fleet Command",
        styles: {
          fontSize: "44px",
          fontWeight: "900",
          textAlign: "center",
          margin: "0 0 20px 0"
        }
      },
      // Hero Subtitle / Description
      {
        id: "aether-desc",
        type: "text",
        content: `<p style="text-align: center; color: #9ca3af; font-size: 16px; max-width: 650px; margin: 0 auto; line-height: 1.7; font-family: Inter;">Deploy high-altitude thermal photogrammetry drones with modular carbon-titanium body hulls and secure telemetry streams. Zero noise. Zero emission. Maximum range.</p>`,
        styles: {
          margin: "0 0 40px 0"
        }
      },
      // Hero Image
      {
        id: "aether-img",
        type: "image",
        content: "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=1200",
        styles: {
          width: "100%",
          maxWidth: "100%",
          borderRadius: "24px",
          margin: "0 auto 48px auto"
        }
      },
      // Technical Features Grid (3 Columns)
      {
        id: "aether-features",
        type: "grid",
        content: "",
        styles: {
          gridColumns: 3,
          gap: "24px",
          padding: "32px",
          backgroundColor: "#111827",
          borderRadius: "24px",
          margin: "0 0 48px 0",
          anchorId: "features"
        },
        children: [
          {
            id: "aether-feat-1",
            type: "text",
            content: `<h4 style="font-weight: 900; font-size: 16px; color: #fbbf24; margin-bottom: 8px;">Quantum Autopilot</h4>
            <p style="font-size: 13px; color: #9ca3af; line-height: 1.6; margin: 0;">Automated airspace mapping with onboard route calculations and FAA-clearance compliance.</p>`,
            styles: { padding: "20px", backgroundColor: "#1f2937", borderRadius: "16px" }
          },
          {
            id: "aether-feat-2",
            type: "text",
            content: `<h4 style="font-weight: 900; font-size: 16px; color: #fbbf24; margin-bottom: 8px;">HDR Photogrammetry</h4>
            <p style="font-size: 13px; color: #9ca3af; line-height: 1.6; margin: 0;">Dual 64MP thermal/visible spectrum imaging sensors for real-time terrain reconstruction.</p>`,
            styles: { padding: "20px", backgroundColor: "#1f2937", borderRadius: "16px" }
          },
          {
            id: "aether-feat-3",
            type: "text",
            content: `<h4 style="font-weight: 900; font-size: 16px; color: #fbbf24; margin-bottom: 8px;">Carbon Hull V4</h4>
            <p style="font-size: 13px; color: #9ca3af; line-height: 1.6; margin: 0;">Reinforced composite structural frame protecting internal electronics against extreme climates.</p>`,
            styles: { padding: "20px", backgroundColor: "#1f2937", borderRadius: "16px" }
          }
        ]
      },
      // Stats Section (2 Columns)
      {
        id: "aether-stats",
        type: "columns",
        content: "",
        styles: {
          gridColumns: 2,
          gap: "32px",
          padding: "40px",
          margin: "0 0 48px 0",
          anchorId: "stats"
        },
        children: [
          {
            id: "aether-stat-1",
            type: "text",
            content: `<div style="text-align: center;"><h3 style="font-size: 48px; font-weight: 900; color: #06b6d4; margin: 0 0 8px 0;">120 MIN</h3><p style="text-transform: uppercase; font-size: 11px; letter-spacing: 0.1em; color: #9ca3af; margin: 0; font-weight: 800;">Flight Time Per Charge</p></div>`,
            styles: { padding: "16px" }
          },
          {
            id: "aether-stat-2",
            type: "text",
            content: `<div style="text-align: center;"><h3 style="font-size: 48px; font-weight: 900; color: #06b6d4; margin: 0 0 8px 0;">0.0g</h3><p style="text-transform: uppercase; font-size: 11px; letter-spacing: 0.1em; color: #9ca3af; margin: 0; font-weight: 800;">Carbon Emissions</p></div>`,
            styles: { padding: "16px" }
          }
        ]
      },
      // Telemetry Sign-up Form
      {
        id: "aether-form",
        type: "form",
        content: "",
        styles: {
          padding: "40px",
          backgroundColor: "#111827",
          borderRadius: "24px",
          submitText: "Request Technical Telemetry Sheet",
          margin: "0 0 40px 0",
          anchorId: "order",
          formFields: [
            { id: "af1", type: "text", label: "Developer Name", placeholder: "Your name", required: true },
            { id: "af2", type: "email", label: "Security Email", placeholder: "developer@domain.com", required: true },
            { id: "af3", type: "select", label: "Deployment Focus", placeholder: "", required: false, options: "Defense, Agriculture, Surveying, Media" }
          ]
        }
      },
      // Footer
      {
        id: "aether-foot",
        type: "footer",
        content: "",
        styles: {
          copyrightText: "© 2026 Aether Systems Corp. Secure telemetry verified.",
          padding: "32px 24px",
          borderRadius: "16px",
          margin: "40px 0 0 0"
        }
      }
    ]
  },
  {
    id: "nova",
    name: "Nova VIP Reservation",
    desc: "An energetic, conversion-focused landing page styling a deep violet canvas with hot pink highlights, carousel slide reviews, and pre-release deposits.",
    badge: "High Conversion",
    color: "#f43f5e",
    globalStyles: {
      fontFamily: "Inter",
      primaryColor: "#f43f5e",
      secondaryColor: "#fda4af",
      backgroundColor: "#1e1b4b",
      textColor: "#ffffff"
    },
    elements: [
      // Navbar
      {
        id: "nova-nav",
        type: "navbar",
        content: "",
        styles: {
          logoText: "NOVA FLIGHT LABS",
          navLinks: [
            { label: "VIP Benefits", href: "#benefits" },
            { label: "Body Kit Preview", href: "#kit" }
          ],
          showDonateBtn: true,
          donateBtnText: "Reserve Kit",
          donateBtnHref: "#reserve",
          padding: "16px 24px",
          borderRadius: "16px",
          margin: "0 0 40px 0"
        }
      },
      // Badge
      {
        id: "nova-badge",
        type: "heading",
        content: `<span style="color: #f43f5e; font-weight: 900; font-size: 11px; text-transform: uppercase; letter-spacing: 0.2em; display: block; text-align: center;">EXCLUSIVE LAUNCH PROMO</span>`,
        styles: {
          fontSize: "12px",
          textAlign: "center",
          margin: "0 0 12px 0",
          anchorId: "overview"
        }
      },
      // Hero Title
      {
        id: "nova-title",
        type: "heading",
        content: "Lock in Your SkyScout Pro VIP Kit",
        styles: {
          fontSize: "40px",
          fontWeight: "900",
          textAlign: "center",
          margin: "0 0 20px 0"
        }
      },
      // Hero Description
      {
        id: "nova-desc",
        type: "text",
        content: `<p style="text-align: center; color: #cbd5e1; font-size: 16px; line-height: 1.7; max-width: 600px; margin: 0 auto; font-family: Inter;">Place a fully-refundable $5 reservation deposit to join the VIP registry. Secure priority factory shipment, 35% discount, and neon body casing models.</p>`,
        styles: {
          margin: "0 0 40px 0"
        }
      },
      // 2-Column Benefits Breakdown
      {
        id: "nova-grid",
        type: "columns",
        content: "",
        styles: {
          gridColumns: 2,
          gap: "28px",
          padding: "32px",
          backgroundColor: "#312e81",
          borderRadius: "24px",
          margin: "0 0 48px 0",
          anchorId: "benefits"
        },
        children: [
          {
            id: "nova-grid-img",
            type: "image",
            content: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=800",
            styles: {
              width: "100%",
              borderRadius: "16px"
            }
          },
          {
            id: "nova-grid-text",
            type: "text",
            content: `<h3 style="font-weight: 900; font-size: 22px; color: #fda4af; margin-bottom: 16px;">VIP Backer Perks:</h3>
            <ul style="list-style-type: none; padding-left: 0; font-size: 14px; line-height: 1.8; color: #ffe4e6; font-weight: 500;">
              <li style="margin-bottom: 12px;">⚡ <strong>Guaranteed 35% Off</strong> ($140 savings on launch day)</li>
              <li style="margin-bottom: 12px;">🎨 <strong>3x Neon Body Shells</strong> (Interchangeable pink/orange/blue)</li>
              <li style="margin-bottom: 12px;">💬 <strong>Dev Discord Access</strong> (Chat with the drone developers)</li>
            </ul>`,
            styles: { padding: "12px" }
          }
        ]
      },
      // Color Variant Carousel (Slider)
      {
        id: "nova-slider",
        type: "slider",
        content: "<div style='color: #ffffff; text-align: center; margin-bottom: 12px;'><h4 style='font-weight: 900; font-size: 18px; margin: 0;'>Interchangeable Neon Casings</h4><p style='font-size: 12px; color: #fda4af; margin: 4px 0 0 0;'>Swipe to preview factory-finished color shells</p></div>",
        styles: {
          minHeight: "220px",
          borderRadius: "24px",
          padding: "24px",
          textAlign: "center",
          anchorId: "kit"
        },
        children: [
          {
            id: "nova-slide-1",
            type: "image",
            content: "https://images.unsplash.com/photo-1557683311-eac922347aa1?w=1200",
            styles: { borderRadius: "16px", aspectRatio: "16/9" }
          },
          {
            id: "nova-slide-2",
            type: "image",
            content: "https://images.unsplash.com/photo-1557683316-973673baf926?w=1200",
            styles: { borderRadius: "16px", aspectRatio: "16/9" }
          }
        ]
      },
      // Demo Video Block
      {
        id: "nova-video",
        type: "video",
        content: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        styles: {
          width: "100%",
          maxWidth: "100%",
          height: "400px",
          borderRadius: "24px",
          margin: "40px auto 48px auto"
        }
      },
      // Deposit Form
      {
        id: "nova-form",
        type: "form",
        content: "",
        styles: {
          padding: "40px",
          backgroundColor: "#312e81",
          borderRadius: "24px",
          submitText: "Reserve My VIP Kit ($5)",
          margin: "0 0 40px 0",
          anchorId: "reserve",
          formFields: [
            { id: "nv1", type: "text", label: "Full Name", placeholder: "Your name", required: true },
            { id: "nv2", type: "email", label: "Email Address", placeholder: "your@email.com", required: true }
          ]
        }
      },
      // Footer
      {
        id: "nova-foot",
        type: "footer",
        content: "",
        styles: {
          copyrightText: "© 2026 Nova Labs. Refundable deposits processed via Stripe Secure Connect.",
          padding: "32px 24px",
          borderRadius: "16px",
          margin: "40px 0 0 0"
        }
      }
    ]
  },
  {
    id: "zenith",
    name: "Zenith Minimalist Luxury",
    desc: "An ultra-premium, warm editorial showcase featuring sand/linen backgrounds, editorial serif fonts, widescreen video displays, and structural product breakdowns.",
    badge: "Premium Luxury",
    color: "#d97706",
    globalStyles: {
      fontFamily: "Georgia",
      primaryColor: "#d97706",
      secondaryColor: "#78716c",
      backgroundColor: "#fafaf9",
      textColor: "#1c1917"
    },
    elements: [
      // Navbar
      {
        id: "zenith-nav",
        type: "navbar",
        content: "",
        styles: {
          logoText: "Z E N I T H",
          navLinks: [
            { label: "Collection", href: "#collection" },
            { label: "Showcase", href: "#showcase" },
            { label: "Details", href: "#details" }
          ],
          showDonateBtn: true,
          donateBtnText: "Request Inquire",
          donateBtnHref: "#inquire",
          padding: "20px 0px",
          borderRadius: "0px",
          margin: "0 0 48px 0",
          borderStyle: "none none solid none",
          borderWidth: "1px",
          borderColor: "#e7e5e4"
        }
      },
      // Badge / Micro-heading
      {
        id: "zenith-badge",
        type: "heading",
        content: `<span style="letter-spacing: 0.25em; color: #d97706; font-size: 11px; font-family: Georgia; display: block; text-align: center;">PRIVATE COLLECTION SHOWCASE</span>`,
        styles: {
          fontSize: "12px",
          textAlign: "center",
          margin: "0 0 16px 0",
          anchorId: "overview"
        }
      },
      // Hero Title
      {
        id: "zenith-title",
        type: "heading",
        content: "Aura-4: Fine Art Aerial Instruments",
        styles: {
          fontSize: "44px",
          fontWeight: "normal",
          textAlign: "center",
          margin: "0 0 24px 0"
        }
      },
      // Hero Description
      {
        id: "zenith-desc",
        type: "text",
        content: `<p style="text-align: center; color: #44403c; font-size: 17px; font-family: Georgia; max-width: 600px; margin: 0 auto; line-height: 1.8;">Fitted with a co-designed Hasselblad medium-format camera and forged from aerospace carbon titanium. Engineered to transform aerial imagery into absolute masterworks.</p>`,
        styles: {
          margin: "0 0 48px 0"
        }
      },
      // Showcase Widescreen Video
      {
        id: "zenith-video",
        type: "video",
        content: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        styles: {
          width: "100%",
          maxWidth: "100%",
          height: "440px",
          borderRadius: "0px",
          margin: "0 auto 48px auto",
          anchorId: "showcase"
        }
      },
      // 2-Column Product Detail Layout
      {
        id: "zenith-grid",
        type: "columns",
        content: "",
        styles: {
          gridColumns: 2,
          gap: "32px",
          padding: "40px",
          backgroundColor: "#f5f5f4",
          borderRadius: "0px",
          margin: "0 0 48px 0",
          anchorId: "collection"
        },
        children: [
          {
            id: "zenith-grid-img",
            type: "image",
            content: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=800",
            styles: {
              width: "100%",
              borderRadius: "0px"
            }
          },
          {
            id: "zenith-grid-text",
            type: "text",
            content: `<h3 style="font-family: Georgia; font-weight: normal; font-size: 24px; color: #1c1917; margin-bottom: 16px; border-bottom: 1px solid #d97706; padding-bottom: 8px;">Technical Grace</h3>
            <p style="font-family: Georgia; font-size: 14px; color: #44403c; line-height: 1.8;">
              Each instrument is assembled by hand in Sweden. Features smart stabilization rotors capable of hovering dynamically inside wind tunnels of up to 45 knots while capturing static exposures.
            </p>`,
            styles: { padding: "16px" }
          }
        ]
      },
      // Luxury Specs Grid (3 Columns)
      {
        id: "zenith-specs",
        type: "grid",
        content: "",
        styles: {
          gridColumns: 3,
          gap: "24px",
          padding: "32px",
          borderRadius: "0px",
          margin: "0 0 48px 0",
          anchorId: "details"
        },
        children: [
          {
            id: "zenith-spec-1",
            type: "text",
            content: `<h4 style="font-family: Georgia; font-weight: normal; font-size: 16px; color: #d97706; margin-bottom: 8px;">Medium-Format Sensor</h4>
            <p style="font-family: Georgia; font-size: 12px; color: #78716c; line-height: 1.6; margin: 0;">100-megapixel back-illuminated digital back for unparalleled dynamic range.</p>`,
            styles: { padding: "20px", borderStyle: "solid", borderWidth: "1px", borderColor: "#e7e5e4" }
          },
          {
            id: "zenith-spec-2",
            type: "text",
            content: `<h4 style="font-family: Georgia; font-weight: normal; font-size: 16px; color: #d97706; margin-bottom: 8px;">Titanium Airframe</h4>
            <p style="font-family: Georgia; font-size: 12px; color: #78716c; line-height: 1.6; margin: 0;">Laser-sintered structural frame weighing a mere 840g with blades.</p>`,
            styles: { padding: "20px", borderStyle: "solid", borderWidth: "1px", borderColor: "#e7e5e4" }
          },
          {
            id: "zenith-spec-3",
            type: "text",
            content: `<h4 style="font-family: Georgia; font-weight: normal; font-size: 16px; color: #d97706; margin-bottom: 8px;">Concierge Support</h4>
            <p style="font-family: Georgia; font-size: 12px; color: #78716c; line-height: 1.6; margin: 0;">24/7 dedicated hotlines for pre-flight airspace authorization checks.</p>`,
            styles: { padding: "20px", borderStyle: "solid", borderWidth: "1px", borderColor: "#e7e5e4" }
          }
        ]
      },
      // Salon Reservation Form
      {
        id: "zenith-form",
        type: "form",
        content: "",
        styles: {
          padding: "40px",
          backgroundColor: "#fafaf9",
          borderRadius: "0px",
          submitText: "Request Salon Placement",
          margin: "0 0 40px 0",
          borderStyle: "solid",
          borderWidth: "1px",
          borderColor: "#d97706",
          anchorId: "inquire",
          formFields: [
            { id: "zf1", type: "text", label: "Confidential Name", placeholder: "e.g. Johnathan Smith", required: true },
            { id: "zf2", type: "email", label: "Direct Email Address", placeholder: "name@confidential.com", required: true },
            { id: "zf3", type: "textarea", label: "Special Requests / Inquiries", placeholder: "Type your query...", required: false }
          ]
        }
      },
      // Footer
      {
        id: "zenith-foot",
        type: "footer",
        content: "",
        styles: {
          copyrightText: "© 2026 Zenith Aviation Group. All content subject to non-disclosure protocols.",
          padding: "32px 0px",
          borderRadius: "0px",
          margin: "40px 0 0 0",
          borderStyle: "solid none none none",
          borderWidth: "1px",
          borderColor: "#e7e5e4"
        }
      }
    ]
  },
  {
    id: "helix",
    name: "Helix Software SaaS",
    desc: "A professional, cool-blue corporate landing page with clean shadow boundaries, a trial onboarding form, and customer review slides.",
    badge: "SaaS & App",
    color: "#2563eb",
    globalStyles: {
      fontFamily: "Inter",
      primaryColor: "#2563eb",
      secondaryColor: "#64748b",
      backgroundColor: "#f8fafc",
      textColor: "#0f172a"
    },
    elements: [
      // Navbar
      {
        id: "helix-nav",
        type: "navbar",
        content: "",
        styles: {
          logoText: "HELIX.IO",
          navLinks: [
            { label: "Features", href: "#features" },
            { label: "Integrations", href: "#integrations" },
            { label: "Pricing", href: "#pricing" }
          ],
          showDonateBtn: true,
          donateBtnText: "Start Trial",
          donateBtnHref: "#pricing",
          padding: "16px 24px",
          borderRadius: "16px",
          margin: "0 0 40px 0"
        }
      },
      // Badge
      {
        id: "helix-badge",
        type: "heading",
        content: `<span style="color: #2563eb; font-weight: 800; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; display: block; text-align: center;">HELIX AUTOMATION WORKFLOWS</span>`,
        styles: {
          fontSize: "12px",
          textAlign: "center",
          margin: "0 0 12px 0",
          anchorId: "overview"
        }
      },
      // Title
      {
        id: "helix-title",
        type: "heading",
        content: "Drone Fleet Command, Orchestrated.",
        styles: {
          fontSize: "40px",
          fontWeight: "800",
          textAlign: "center",
          margin: "0 0 20px 0"
        }
      },
      // Subtitle
      {
        id: "helix-desc",
        type: "text",
        content: `<p style="color: #475569; font-size: 16px; line-height: 1.6; max-width: 600px; margin: 0 auto; text-align: center; font-family: Inter;">Configure multi-node commercial flight coordinates, stream thermal drone telemetry, and validate flight permissions with FAA zones automatically in seconds.</p>`,
        styles: {
          margin: "0 0 32px 0"
        }
      },
      // Feature Service Cards (3 Columns)
      {
        id: "helix-grid",
        type: "grid",
        content: "",
        styles: {
          gridColumns: 3,
          gap: "24px",
          padding: "24px",
          backgroundColor: "#f1f5f9",
          borderRadius: "20px",
          margin: "0 0 48px 0",
          anchorId: "features"
        },
        children: [
          {
            id: "helix-feat-1",
            type: "text",
            content: `<h4 style="font-weight: 800; font-size: 16px; color: #1e293b; margin-bottom: 8px;">FAA Airspace API</h4>
            <p style="font-size: 13px; color: #64748b; line-height: 1.5; margin: 0;">Automated airspace permission checks complying with real-time FAA zones.</p>`,
            styles: { padding: "20px", backgroundColor: "#ffffff", borderRadius: "12px", boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)" }
          },
          {
            id: "helix-feat-2",
            type: "text",
            content: `<h4 style="font-weight: 800; font-size: 16px; color: #1e293b; margin-bottom: 8px;">HD Live Streams</h4>
            <p style="font-size: 13px; color: #64748b; line-height: 1.5; margin: 0;">High-definition thermal telemetry feeds streamed with less than 80ms latency.</p>`,
            styles: { padding: "20px", backgroundColor: "#ffffff", borderRadius: "12px", boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)" }
          },
          {
            id: "helix-feat-3",
            type: "text",
            content: `<h4 style="font-weight: 800; font-size: 16px; color: #1e293b; margin-bottom: 8px;">Telemetry Sync</h4>
            <p style="font-size: 13px; color: #64748b; line-height: 1.5; margin: 0;">Command multiple drone routes simultaneously from a cloud console interface.</p>`,
            styles: { padding: "20px", backgroundColor: "#ffffff", borderRadius: "12px", boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)" }
          }
        ]
      },
      // Client Carousel (Slider)
      {
        id: "helix-slider",
        type: "slider",
        content: "<div style='color: #0f172a; text-align: center; margin-bottom: 12px;'><h4 style='font-weight: 800; font-size: 18px; margin: 0;'>Helix Cloud Console</h4><p style='font-size: 12px; color: #64748b; margin: 4px 0 0 0;'>Preview the cloud dashboard interface</p></div>",
        styles: {
          minHeight: "220px",
          borderRadius: "24px",
          padding: "24px",
          textAlign: "center",
          anchorId: "integrations"
        },
        children: [
          {
            id: "helix-slide-1",
            type: "image",
            content: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200",
            styles: { borderRadius: "16px", aspectRatio: "16/9" }
          }
        ]
      },
      // Free Trial Signup Form
      {
        id: "helix-form",
        type: "form",
        content: "",
        styles: {
          padding: "40px",
          backgroundColor: "#ffffff",
          borderRadius: "24px",
          submitText: "Register for Helix Free Trial",
          margin: "40px 0 32px 0",
          borderStyle: "solid",
          borderWidth: "1px",
          borderColor: "#e2e8f0",
          anchorId: "pricing",
          formFields: [
            { id: "hf1", type: "text", label: "Organization Name", placeholder: "Your company name", required: true },
            { id: "hf2", type: "email", label: "Work Email", placeholder: "you@company.com", required: true },
            { id: "hf3", type: "tel", label: "Phone Number", placeholder: "+1 (555) 000-0000", required: false }
          ]
        }
      },
      // Footer
      {
        id: "helix-foot",
        type: "footer",
        content: "",
        styles: {
          copyrightText: "© 2026 Helix Systems Corp. SOC2 certified.",
          backgroundColor: "#0f172a",
          color: "#94a3b8",
          padding: "24px",
          borderRadius: "16px",
          margin: "40px 0 0 0"
        }
      }
    ]
  },
  {
    id: "genesis",
    name: "Genesis Community Impact",
    desc: "An organic cause-driven landing page styling soft mint-green canvas with forest green accents, community impact grids, and checkout donation widgets.",
    badge: "Non-Profit / Cause",
    color: "#22c55e",
    globalStyles: {
      fontFamily: "Inter",
      primaryColor: "#22c55e",
      secondaryColor: "#15803d",
      backgroundColor: "#f0fdf4",
      textColor: "#166534"
    },
    elements: [
      // Navbar
      {
        id: "genesis-nav",
        type: "navbar",
        content: "",
        styles: {
          logoText: "🌱 GENESIS GREEN",
          navLinks: [
            { label: "Our Story", href: "#story" },
            { label: "Community Impact", href: "#impact" },
            { label: "Volunteers", href: "#volunteers" }
          ],
          showDonateBtn: true,
          donateBtnText: "Support Us",
          donateBtnHref: "#donate",
          padding: "16px 24px",
          borderRadius: "16px",
          margin: "0 0 40px 0",
          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)"
        }
      },
      // Badge
      {
        id: "genesis-badge",
        type: "heading",
        content: `<span style="color: #16a34a; font-weight: 800; font-size: 12px; text-transform: uppercase; letter-spacing: 0.15em; display: block; text-align: center;">LOCAL SUSTAINABILITY PROJECT</span>`,
        styles: {
          fontSize: "12px",
          textAlign: "center",
          margin: "0 0 12px 0",
          anchorId: "story"
        }
      },
      // Title
      {
        id: "genesis-title",
        type: "heading",
        content: "Rebuild the Neighborhood Greenhouse",
        styles: {
          fontSize: "40px",
          fontWeight: "900",
          textAlign: "center",
          margin: "0 0 20px 0"
        }
      },
      // Hero Description
      {
        id: "genesis-desc",
        type: "text",
        content: `<p style="color: #4b5563; font-size: 16px; line-height: 1.7; max-width: 600px; margin: 0 auto; text-align: center; font-family: Inter;">We are repairing the storm damage to our local greenhouse. Help us secure fresh organic produce and educational workshops for over 500 neighborhood families.</p>`,
        styles: {
          margin: "0 0 40px 0"
        }
      },
      // Hero Showcase Image
      {
        id: "genesis-img",
        type: "image",
        content: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=1200",
        styles: {
          width: "100%",
          maxWidth: "100%",
          borderRadius: "24px",
          margin: "0 auto 40px auto"
        }
      },
      // 2-Column Impact Details
      {
        id: "genesis-grid",
        type: "columns",
        content: "",
        styles: {
          gridColumns: 2,
          gap: "28px",
          padding: "32px",
          backgroundColor: "#dcfce7",
          borderRadius: "24px",
          margin: "0 0 48px 0",
          anchorId: "impact"
        },
        children: [
          {
            id: "genesis-grid-img",
            type: "image",
            content: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800",
            styles: {
              width: "100%",
              borderRadius: "16px"
            }
          },
          {
            id: "genesis-grid-text",
            type: "text",
            content: `<h3 style="font-weight: 900; font-size: 20px; color: #166534; margin-bottom: 12px;">Greenhouse Outreach</h3>
            <p style="font-size: 14px; color: #14532d; line-height: 1.7;">
              By providing shared beds and classes in organic agriculture, we empower students and families to cultivate fresh greens, reduce grocery costs, and gain hands-on scientific skills.
            </p>`,
            styles: { padding: "12px" }
          }
        ]
      },
      // Volunteer Form
      {
        id: "genesis-form",
        type: "form",
        content: "",
        styles: {
          padding: "40px",
          backgroundColor: "#ffffff",
          borderRadius: "24px",
          submitText: "Join the Volunteer Team",
          margin: "0 0 40px 0",
          anchorId: "volunteers",
          formFields: [
            { id: "g1", type: "text", label: "Your Full Name", placeholder: "Enter name", required: true },
            { id: "g2", type: "email", label: "Email Address", placeholder: "you@example.com", required: true },
            { id: "g3", type: "checkbox", label: "I want to join the Saturday volunteer schedule", placeholder: "", required: false }
          ]
        }
      },
      // Footer
      {
        id: "genesis-foot",
        type: "footer",
        content: "",
        styles: {
          copyrightText: "© 2026 Genesis Green Group. Registered non-profit community cause.",
          backgroundColor: "#166534",
          color: "#bbf7d0",
          padding: "24px",
          borderRadius: "16px",
          margin: "40px 0 0 0"
        }
      }
    ]
  }
];
