import { notFound } from "next/navigation";

import { MarkdownRenderer } from "@/components/markdown-renderer";
import { prisma } from "@/lib/prisma";

type PostDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "2-digit",
  }).format(date);
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const { slug } = await params;

  const post = await prisma.post.findFirst({
    where: {
      slug,
      published: true,
    },
    select: {
      title: true,
      content: true,
      createdAt: true,
    },
  });

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
