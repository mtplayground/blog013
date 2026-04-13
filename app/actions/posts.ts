"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";

export type PostFormState = {
  error: string | null;
};

type ParsedInputResult =
  | {
      data: {
        title: string;
        slug: string;
        content: string;
        published: boolean;
      };
    }
  | {
      error: string;
    };

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function parseBoolean(value: FormDataEntryValue | null): boolean {
  return value === "on" || value === "true";
}

function parseInput(formData: FormData): ParsedInputResult {
  const titleRaw = formData.get("title");
  const slugRaw = formData.get("slug");
  const contentRaw = formData.get("content");

  if (typeof titleRaw !== "string" || typeof contentRaw !== "string") {
    return { error: "Invalid form submission." } as const;
  }

  const title = titleRaw.trim();
  const content = contentRaw.trim();
  const submittedSlug = typeof slugRaw === "string" ? slugRaw.trim() : "";
  const slug = slugify(submittedSlug || title);
  const published = parseBoolean(formData.get("published"));

  if (!title) {
    return { error: "Title is required." } as const;
  }

  if (!slug) {
    return { error: "Slug is required." } as const;
  }

  if (!content) {
    return { error: "Content is required." } as const;
  }

  return {
    data: {
      title,
      slug,
      content,
      published,
    },
  } as const;
}

function parsePrismaError(error: unknown): string {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
    return "Slug is already in use.";
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
    return "Post not found.";
  }

  return "Unable to save post.";
}

export async function createPost(
  previousState: PostFormState,
  formData: FormData,
): Promise<PostFormState> {
  void previousState;
  const parsed = parseInput(formData);

  if ("error" in parsed) {
    return { error: parsed.error };
  }

  try {
    await prisma.post.create({
      data: parsed.data,
    });
  } catch (error: unknown) {
    return { error: parsePrismaError(error) };
  }

  revalidatePath("/admin");
  redirect(`/admin/posts/${parsed.data.slug}/edit`);
}

export async function updatePost(
  previousState: PostFormState,
  formData: FormData,
): Promise<PostFormState> {
  void previousState;
  const originalSlugValue = formData.get("originalSlug");
  const originalSlug = typeof originalSlugValue === "string" ? originalSlugValue.trim() : "";

  if (!originalSlug) {
    return { error: "Invalid post identifier." };
  }

  const parsed = parseInput(formData);

  if ("error" in parsed) {
    return { error: parsed.error };
  }

  try {
    await prisma.post.update({
      where: {
        slug: originalSlug,
      },
      data: parsed.data,
    });
  } catch (error: unknown) {
    return { error: parsePrismaError(error) };
  }

  revalidatePath("/admin");
  revalidatePath(`/admin/posts/${originalSlug}/edit`);
  redirect(`/admin/posts/${parsed.data.slug}/edit`);
}
