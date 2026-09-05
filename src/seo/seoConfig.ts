export const SITE_NAME = "Lift & Launch";
export const SITE_DEFAULT_DESCRIPTION =
  "The fastest way to fund, launch, or scale your next business venture. Proven crowdfunding strategy, pre-launch funnels, and LaunchVault tools for Kickstarter, Indiegogo, and equity platforms.";
export const SITE_URL =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_SITE_URL) ||
  (typeof window !== "undefined" ? window.location.origin : "https://www.liftandlaunch.co");

export const DEFAULT_OG_IMAGE = "/index/logo.webp";

type PageSeoEntry = {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
};

/** Per-route SEO defaults for public marketing pages */
export const pageSeo = {
  home: {
    title: "Crowdfunding Strategy to Fund, Launch & Scale | Lift & Launch",
    description:
      "Turn your business idea, product, or big launch into a venture everyone is talking about. From first spark to fully funded — and beyond.",
    path: "/",
  },
  services: {
    title: "LaunchVault — Crowdfunding Toolkit | Lift & Launch",
    description:
      "Power your campaign with LaunchVault: pre-launch funnels, audience targeting, analytics, A/B testing, and AI-powered copy — exclusive to Lift & Launch clients.",
    path: "/services",
  },
  process: {
    title: "Our Crowdfunding Process & Pre-Launch System | Lift & Launch",
    description:
      "Success starts before you launch. A proven six-step pre-launch process and four-step methodology to hit funding goals with real momentum.",
    path: "/process",
  },
  faq: {
    title: "Crowdfunding FAQs — Pricing, Funnels & Timeline | Lift & Launch",
    description:
      "Answers on pricing, reservation funnels, ad spend, creatives, launch timeline, platforms, and how Lift & Launch partners with creators and agencies.",
    path: "/faq",
  },
  contact: {
    title: "Book a Free Strategy Call | Lift & Launch",
    description:
      "Tell us where you are in your crowdfunding journey. Book a free strategy call or fill out our contact form — it takes less than a minute.",
    path: "/contact",
  },
  blog: {
    title: "Crowdfunding Insights & Launch Strategy Blog | Lift & Launch",
    description:
      "Guides on crowdfunding strategy, audience building, pre-launch funnels, and scaling campaigns on Kickstarter, Indiegogo, and equity platforms.",
    path: "/blog",
  },
  campaigns: {
    title: "Discover Crowdfunding Campaigns | Lift & Launch",
    description:
      "Explore ventures raising funds with Lift & Launch — product launches, services, and equity crowdfunding campaigns.",
    path: "/campaigns",
  },
  pricing: {
    title: "Flexible Crowdfunding Packages & Pricing | Lift & Launch",
    description:
      "Pricing tailored to your goals, campaign type, and growth stage — including founder-friendly payment plans.",
    path: "/pricing",
  },
  signin: {
    title: "Sign In | Lift & Launch",
    description: "Sign in to your Lift & Launch dashboard to manage campaigns, funnels, and LaunchVault tools.",
    path: "/signin",
    noindex: true,
  },
  signup: {
    title: "Create Account | Lift & Launch",
    description: "Join Lift & Launch and start building your pre-launch funnel and crowdfunding campaign.",
    path: "/signup",
    noindex: true,
  },
} as const satisfies Record<string, PageSeoEntry>;

export function absoluteUrl(path = "/") {
  const base = String(SITE_URL).replace(/\/$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}
