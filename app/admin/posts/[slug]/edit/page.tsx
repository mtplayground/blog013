import { notFound } from "next/navigation";

import { updatePost } from "@/app/actions/posts";
import { PostForm } from "@/components/admin/post-form";
import { prisma } from "@/lib/prisma";

type EditPostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { slug } = await params;

  const post = await prisma.post.findUnique({
    where: {
      slug,
    },
    select: {
      title: true,
      slug: true,
      content: true,
      published: true,
    },
  });

  if (!post) {
    notFound();
  }

  return (
    <main className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Edit Post</h1>
        <p className="mt-1 text-sm text-muted-foreground">Update title, slug, content, and publish state.</p>
      </div>

      <PostForm
        action={updatePost}
        submitLabel="Save Changes"
        initialValues={{
          title: post.title,
          slug: post.slug,
          content: post.content,
          published: post.published,
        }}
        originalSlug={post.slug}
      />
    </main>
  );
}
