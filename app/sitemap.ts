import type { MetadataRoute } from "next";

import { getSiteUrl } from "@/lib/metadata";
import { prisma } from "@/lib/prisma";

function normalizeSiteUrl(url: string): string {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = normalizeSiteUrl(getSiteUrl());

  const posts = await prisma.post.findMany({
    where: {
      published: true,
    },
    select: {
      slug: true,
      updatedAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${siteUrl}/posts/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [
    {
      url: `${siteUrl}/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...postEntries,
  ];
}
