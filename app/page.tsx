export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl items-center justify-center px-6 py-16">
      <section className="w-full rounded-lg border bg-card p-8 text-card-foreground shadow-sm">
        <h1 className="text-2xl font-semibold tracking-tight">ZeroClaw Blog</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Next.js 15, TypeScript, Tailwind CSS, and shadcn/ui are configured.
        </p>
      </section>
    </main>
  );
}
