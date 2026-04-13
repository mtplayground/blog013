"use server";

import { redirect } from "next/navigation";

import { constantTimeEqual, createSession } from "@/lib/session";

export type LoginFormState = {
  error: string | null;
};

function validatePasswordInput(value: FormDataEntryValue | null): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();

  return trimmed.length > 0 ? trimmed : null;
}

export async function login(
  _previousState: LoginFormState,
  formData: FormData,
): Promise<LoginFormState> {
  const submittedPassword = validatePasswordInput(formData.get("password"));

  if (!submittedPassword) {
    return { error: "Password is required." };
  }

  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return { error: "Server configuration error." };
  }

  if (!constantTimeEqual(submittedPassword, adminPassword)) {
    return { error: "Invalid password." };
  }

  try {
    await createSession();
  } catch {
    return { error: "Unable to create session." };
  }

  redirect("/admin");
}
