export function Footer() {
  return (
    <footer className="mt-16 border-t bg-background">
      <div className="mx-auto w-full max-w-6xl px-6 py-6 text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} ZeroClaw Blog</p>
      </div>
    </footer>
  );
}
