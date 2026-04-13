"use client";

import { useFormStatus } from "react-dom";

import { deletePost } from "@/app/actions/posts";

type DeleteButtonProps = {
  slug: string;
  title: string;
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="text-sm font-medium text-destructive transition-opacity hover:underline disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending ? "Deleting..." : "Delete"}
    </button>
  );
}

export function DeleteButton({ slug, title }: DeleteButtonProps) {
  return (
    <form
      action={deletePost}
      onSubmit={(event) => {
        const confirmed = window.confirm(`Delete \"${title}\"? This cannot be undone.`);
        if (!confirmed) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="slug" value={slug} />
      <SubmitButton />
    </form>
  );
}
