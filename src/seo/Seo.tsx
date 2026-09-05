import { useEffect } from "react";
import {
  SITE_NAME,
  SITE_DEFAULT_DESCRIPTION,
  DEFAULT_OG_IMAGE,
  absoluteUrl,
} from "./seoConfig";

export type SeoProps = {
  title: string;
  description?: string;
  path?: string;
  image?: string;
  noindex?: boolean;
  type?: string;
  /** Optional structured data; omit on pages that only need basic meta tags */
  jsonLd?: Record<string, unknown> | null;
};

function upsertMeta(attr: string, key: string, content: string) {
  if (!content) return;
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertLink(rel: string, href: string) {
  if (!href) return;
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

function upsertJsonLd(id: string, data: Record<string, unknown> | null | undefined) {
  const existing = document.getElementById(id);
  if (existing) existing.remove();
  if (!data) return;
  const script = document.createElement("script");
  script.id = id;
  script.type = "application/ld+json";
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
}

/**
 * Sets document title, meta, Open Graph, Twitter, canonical, and optional JSON-LD.
 */
export default function Seo({
  title,
  description = SITE_DEFAULT_DESCRIPTION,
  path = "/",
  image = DEFAULT_OG_IMAGE,
  noindex = false,
  type = "website",
  jsonLd = null,
}: SeoProps): null {
  useEffect(() => {
    const fullTitle = title?.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
    const desc = description || SITE_DEFAULT_DESCRIPTION;
    const url = absoluteUrl(path);
    const img = image.startsWith("http") ? image : absoluteUrl(image);

    document.title = fullTitle;
    document.documentElement.lang = "en";

    upsertMeta("name", "description", desc);
    upsertMeta("name", "robots", noindex ? "noindex, nofollow" : "index, follow");
    upsertMeta("name", "author", SITE_NAME);
    upsertMeta("name", "theme-color", "#facc15");

    upsertMeta("property", "og:type", type);
    upsertMeta("property", "og:site_name", SITE_NAME);
    upsertMeta("property", "og:title", fullTitle);
    upsertMeta("property", "og:description", desc);
    upsertMeta("property", "og:url", url);
    upsertMeta("property", "og:image", img);

    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", fullTitle);
    upsertMeta("name", "twitter:description", desc);
    upsertMeta("name", "twitter:image", img);

    upsertLink("canonical", url);

    const orgLd: Record<string, unknown> = {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: SITE_NAME,
      url: absoluteUrl("/"),
      logo: absoluteUrl(DEFAULT_OG_IMAGE),
      description: SITE_DEFAULT_DESCRIPTION,
      sameAs: [],
    };

    upsertJsonLd("seo-org-ld", orgLd);
    upsertJsonLd("seo-page-ld", jsonLd ?? null);
  }, [title, description, path, image, noindex, type, jsonLd]);

  return null;
}
