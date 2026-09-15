export const SITE_NAME = 'Lift & Launch';
export const SITE_DEFAULT_DESCRIPTION =
  'The fastest way to fund, launch, or scale your next business venture. Proven crowdfunding strategy, pre-launch funnels, and LaunchVault tools for Kickstarter, Indiegogo, and equity platforms.';
export const SITE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SITE_URL) ||
  (typeof window !== 'undefined' ? window.location.origin : 'https://www.liftandlaunch.co');

export const DEFAULT_OG_IMAGE = '/index/logo.webp';

export function absoluteUrl(path = '/') {
  const base = String(SITE_URL).replace(/\/$/, '');
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${base}${normalized}`;
}
