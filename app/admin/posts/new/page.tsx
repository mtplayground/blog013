import { createPost } from "@/app/actions/posts";
import { PostForm } from "@/components/admin/post-form";

export default function NewPostPage() {
  return (
    <main className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Create Post</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Write a new post using Markdown and publish when ready.
        </p>
      </div>

      <PostForm
        action={createPost}
        submitLabel="Create Post"
        initialValues={{
          title: "",
          slug: "",
          content: "",
          published: false,
        }}
      />
    </main>
  );
}
