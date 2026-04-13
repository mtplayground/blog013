import { Pagination } from "@/components/pagination";
import { PostCard } from "@/components/post-card";
import { prisma } from "@/lib/prisma";

const PAGE_SIZE = 5;

type HomePageProps = {
  searchParams?: Promise<{
    page?: string;
  }>;
};

function parsePage(value: string | undefined): number {
  if (!value) {
    return 1;
  }

  const page = Number.parseInt(value, 10);
  if (Number.isNaN(page) || page < 1) {
    return 1;
  }

  return page;
}

function makeExcerpt(content: string, maxLength = 180): string {
  const plainText = content
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/^>\s?/gm, "")
    .replace(/[\*_#>-]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  if (plainText.length <= maxLength) {
    return plainText;
  }

  return `${plainText.slice(0, maxLength).trimEnd()}...`;
}

export default async function Home({ searchParams }: HomePageProps) {
  const params = (await searchParams) ?? {};
  const currentPage = parsePage(params.page);

  const totalPosts = await prisma.post.count({
    where: {
      published: true,
    },
  });

  const totalPages = Math.max(1, Math.ceil(totalPosts / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);

  const posts = await prisma.post.findMany({
    where: {
      published: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    skip: (safePage - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
    select: {
      title: true,
      slug: true,
      content: true,
      createdAt: true,
    },
  });

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">ZeroClaw Blog</h1>
        <p className="mt-2 text-sm text-muted-foreground">Recent published posts and archive pages.</p>
      </header>

      {posts.length === 0 ? (
        <div className="rounded-lg border bg-card p-8 text-card-foreground">
          <p className="text-sm text-muted-foreground">No published posts yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard
              key={post.slug}
              title={post.title}
              slug={post.slug}
              createdAt={post.createdAt}
              excerpt={makeExcerpt(post.content)}
            />
          ))}
        </div>
      )}

      <Pagination currentPage={safePage} totalPages={totalPages} />
    </main>
  );
}
