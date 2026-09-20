import type { MetadataRoute } from "next";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.womsakhi.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/about", "/programs", "/community", "/resources", "/contact"];
  const lastModified = new Date();
  return routes.map((route) => ({
    url: `${SITE}${route}`,
    lastModified,
    changeFrequency: "monthly",
    priority: route === "" ? 1 : 0.8,
  }));
}
