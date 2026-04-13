import Link from "next/link";
import { DeleteButton } from "@/components/admin/delete-button";

type AdminPostRow = {
  id: number;
  slug: string;
  title: string;
  published: boolean;
  updatedAt: Date;
};

type PostTableProps = {
  posts: AdminPostRow[];
};

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(date);
}

export function PostTable({ posts }: PostTableProps) {
  if (posts.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-6 text-card-foreground">
        <p className="text-sm text-muted-foreground">No posts yet.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border bg-card text-card-foreground">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="bg-muted/50 text-muted-foreground">
          <tr>
            <th className="px-4 py-3 font-medium">Title</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Date</th>
            <th className="px-4 py-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.id} className="border-t">
              <td className="px-4 py-3 font-medium">{post.title}</td>
              <td className="px-4 py-3">
                <span
                  className={
                    post.published
                      ? "inline-flex rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-800"
                      : "inline-flex rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700"
                  }
                >
                  {post.published ? "Published" : "Draft"}
                </span>
              </td>
              <td className="px-4 py-3 text-muted-foreground">{formatDate(post.updatedAt)}</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <Link
                    href={`/admin/posts/${post.slug}/edit`}
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    Edit
                  </Link>
                  <DeleteButton slug={post.slug} title={post.title} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
