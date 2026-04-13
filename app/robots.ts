import type { MetadataRoute } from "next";

import { getSiteUrl } from "@/lib/metadata";

function normalizeSiteUrl(url: string): string {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

export default function robots(): MetadataRoute.Robots {
  const siteUrl = normalizeSiteUrl(getSiteUrl());

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
