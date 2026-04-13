import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";

import { MarkdownRenderer } from "@/components/markdown-renderer";
import { buildPostMetadata } from "@/lib/metadata";
import { prisma } from "@/lib/prisma";

type PostDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const getPublishedPostBySlug = cache(async (slug: string) => {
  return prisma.post.findFirst({
    where: {
      slug,
      published: true,
    },
    select: {
      title: true,
      slug: true,
      content: true,
      createdAt: true,
    },
  });
});

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "2-digit",
  }).format(date);
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const { slug } = await params;

  const post = await getPublishedPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-12">
      <article>
        <header className="mb-8 border-b pb-6">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">{formatDate(post.createdAt)}</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight">{post.title}</h1>
        </header>

        <MarkdownRenderer content={post.content} />
      </article>
    </main>
  );
}

export async function generateMetadata({ params }: PostDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found",
      description: "The requested post could not be found.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return buildPostMetadata({
    title: post.title,
    slug: post.slug,
    content: post.content,
    publishedAt: post.createdAt,
  });
}
