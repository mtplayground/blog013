import Link from "next/link";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
};

function pageHref(page: number): string {
  return page <= 1 ? "/" : `/?page=${page}`;
}

export function Pagination({ currentPage, totalPages }: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav className="mt-8 flex flex-wrap items-center gap-2" aria-label="Pagination">
      <Link
        href={pageHref(currentPage - 1)}
        aria-disabled={currentPage <= 1}
        className={`inline-flex h-9 items-center rounded-md border px-3 text-sm ${
          currentPage <= 1 ? "pointer-events-none opacity-50" : "hover:bg-muted"
        }`}
      >
        Previous
      </Link>

      {pages.map((page) => (
        <Link
          key={page}
          href={pageHref(page)}
          aria-current={page === currentPage ? "page" : undefined}
          className={`inline-flex h-9 min-w-9 items-center justify-center rounded-md border px-3 text-sm ${
            page === currentPage ? "bg-primary text-primary-foreground" : "hover:bg-muted"
          }`}
        >
          {page}
        </Link>
      ))}

      <Link
        href={pageHref(currentPage + 1)}
        aria-disabled={currentPage >= totalPages}
        className={`inline-flex h-9 items-center rounded-md border px-3 text-sm ${
          currentPage >= totalPages ? "pointer-events-none opacity-50" : "hover:bg-muted"
        }`}
      >
        Next
      </Link>
    </nav>
  );
}
