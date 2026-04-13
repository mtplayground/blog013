"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import type { PostFormState } from "@/app/actions/posts";

type PostFormValues = {
  title: string;
  slug: string;
  content: string;
  published: boolean;
};

type PostFormProps = {
  action: (previousState: PostFormState, formData: FormData) => Promise<PostFormState>;
  submitLabel: string;
  initialValues: PostFormValues;
  originalSlug?: string;
};

const INITIAL_STATE: PostFormState = {
  error: null,
};

function toSlug(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending ? "Saving..." : label}
    </button>
  );
}

export function PostForm({ action, submitLabel, initialValues, originalSlug }: PostFormProps) {
  const [state, formAction] = useActionState(action, INITIAL_STATE);
  const [title, setTitle] = useState(initialValues.title);
  const [slug, setSlug] = useState(initialValues.slug);
  const [content, setContent] = useState(initialValues.content);
  const [slugTouched, setSlugTouched] = useState(Boolean(initialValues.slug));

  useEffect(() => {
    if (!slugTouched) {
      setSlug(toSlug(title));
    }
  }, [title, slugTouched]);

  const previewContent = useMemo(() => content || "_Markdown preview will appear here._", [content]);

  return (
    <form action={formAction} className="space-y-6">
      {originalSlug ? <input type="hidden" name="originalSlug" value={originalSlug} /> : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Title
            </label>
            <input
              id="title"
              name="title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
              className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="slug" className="text-sm font-medium">
              Slug
            </label>
            <input
              id="slug"
              name="slug"
              value={slug}
              onChange={(event) => {
                setSlugTouched(true);
                setSlug(toSlug(event.target.value));
              }}
              required
              className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="content" className="text-sm font-medium">
              Markdown Content
            </label>
            <textarea
              id="content"
              name="content"
              rows={16}
              value={content}
              onChange={(event) => setContent(event.target.value)}
              required
              className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <label className="inline-flex items-center gap-2 text-sm font-medium">
            <input
              type="checkbox"
              name="published"
              defaultChecked={initialValues.published}
              className="h-4 w-4 rounded border"
            />
            Published
          </label>

          {state.error ? (
            <p className="text-sm font-medium text-destructive" role="alert">
              {state.error}
            </p>
          ) : null}

          <SubmitButton label={submitLabel} />
        </div>

        <section className="rounded-lg border bg-card p-4 text-card-foreground">
          <h2 className="mb-3 text-sm font-medium text-muted-foreground">Live Preview</h2>
          <article className="prose prose-sm max-w-none prose-headings:mt-4 prose-p:my-2">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{previewContent}</ReactMarkdown>
          </article>
        </section>
      </div>
    </form>
  );
}
