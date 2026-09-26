import type { MetadataRoute } from "next";

const SITE_URL = "https://bullbrief.pro";

const STATIC_ROUTES = ["/", "/explore", "/movers", "/compare", "/glossary", "/about", "/terms", "/privacy", "/disclaimer"];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return STATIC_ROUTES.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
  }));
}
