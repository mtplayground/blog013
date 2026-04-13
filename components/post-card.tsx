import Link from "next/link";

type PostCardProps = {
  title: string;
  slug: string;
  excerpt: string;
  createdAt: Date;
};

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "2-digit",
  }).format(date);
}

export function PostCard({ title, slug, excerpt, createdAt }: PostCardProps) {
  return (
    <article className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{formatDate(createdAt)}</p>
      <h2 className="mt-2 text-xl font-semibold">
        <Link href={`/posts/${slug}`} className="hover:underline">
          {title}
        </Link>
      </h2>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">{excerpt}</p>
      <Link
        href={`/posts/${slug}`}
        className="mt-4 inline-flex text-sm font-medium text-primary hover:underline"
      >
        Read post
      </Link>
    </article>
  );
}
