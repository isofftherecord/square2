export const SITE_NAV = [
  { href: "/firm", label: "Firm" },
  { href: "/platform", label: "Platform" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/contact", label: "Contact" },
] as const;

// Sitemap del footer: mismas páginas + legal.
export const FOOTER_NAV = [
  ...SITE_NAV,
  { href: "/privacy-policy", label: "Privacy Policy" },
] as const;
