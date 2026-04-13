import { prisma } from "@/lib/prisma";
import { PostTable } from "@/components/admin/post-table";

export default async function AdminDashboardPage() {
  const posts = await prisma.post.findMany({
    orderBy: {
      updatedAt: "desc",
    },
    select: {
      id: true,
      title: true,
      published: true,
      updatedAt: true,
    },
  });

  return (
    <main className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Posts</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage published posts and drafts from the admin dashboard.
        </p>
      </div>

      <PostTable posts={posts} />
    </main>
  );
}
