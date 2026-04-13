import type { Metadata } from "next";

const SITE_NAME = "ZeroClaw Blog";
const SITE_DESCRIPTION = "Insights, tutorials, and updates from ZeroClaw Blog.";

function stripMarkdown(input: string): string {
  return input
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^>\s?/gm, "")
    .replace(/[\*_~]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function truncate(input: string, maxLength: number): string {
  if (input.length <= maxLength) {
    return input;
  }

  return `${input.slice(0, maxLength).trimEnd()}...`;
}

export function getSiteName(): string {
  return SITE_NAME;
}

export function getSiteDescription(): string {
  return SITE_DESCRIPTION;
}

export function getSiteUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (envUrl) {
    return envUrl;
  }

  return "http://localhost:8080";
}

export function extractDescriptionFromMarkdown(markdown: string, maxLength = 160): string {
  const paragraphs = markdown
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  const firstParagraph = paragraphs.find((paragraph) => !paragraph.startsWith("#")) ?? paragraphs[0] ?? "";

  const cleaned = stripMarkdown(firstParagraph);

  if (!cleaned) {
    return SITE_DESCRIPTION;
  }

  return truncate(cleaned, maxLength);
}

export function buildPostMetadata(input: {
  title: string;
  slug: string;
  content: string;
  publishedAt: Date;
}): Metadata {
  const description = extractDescriptionFromMarkdown(input.content);
  const url = `/posts/${input.slug}`;

  return {
    title: input.title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "article",
      title: input.title,
      description,
      url,
      siteName: SITE_NAME,
      publishedTime: input.publishedAt.toISOString(),
    },
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description,
    },
  };
}
