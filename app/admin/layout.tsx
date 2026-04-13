import Link from "next/link";

import { logout } from "@/app/actions/auth";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-muted/20">
      <header className="border-b bg-background">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/admin" className="text-lg font-semibold">
            Admin Dashboard
          </Link>

          <form action={logout}>
            <button
              type="submit"
              className="inline-flex h-9 items-center justify-center rounded-md border px-3 text-sm font-medium hover:bg-muted"
            >
              Logout
            </button>
          </form>
        </div>
      </header>

      <div className="mx-auto w-full max-w-6xl px-6 py-8">{children}</div>
    </div>
  );
}
