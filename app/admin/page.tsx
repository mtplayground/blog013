import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { PostTable } from "@/components/admin/post-table";

export default async function AdminDashboardPage() {
  const posts = await prisma.post.findMany({
    orderBy: {
      updatedAt: "desc",
    },
    select: {
      id: true,
      slug: true,
      title: true,
      published: true,
      updatedAt: true,
    },
  });

  return (
    <main className="space-y-6">
      <div>
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Posts</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage published posts and drafts from the admin dashboard.
            </p>
          </div>

          <Link
            href="/admin/posts/new"
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground"
          >
            New Post
          </Link>
        </div>
      </div>

      <PostTable posts={posts} />
    </main>
  );
}
