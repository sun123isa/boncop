import Link from "next/link";
import { cn } from "@/lib/cn";

type PaginationProps = {
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  buildHref: (page: number) => string;
  label?: string;
};

export function Pagination({
  page,
  totalPages,
  total,
  pageSize,
  buildHref,
  label = "éléments",
}: PaginationProps) {
  if (total === 0) {
    return null;
  }

  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);
  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  return (
    <nav
      className="mt-6 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between"
      aria-label="Pagination"
    >
      <p className="text-sm text-slate-500">
        {from}–{to} sur {total} {label}
      </p>

      <div className="flex items-center gap-2">
        <Link
          href={hasPrev ? buildHref(page - 1) : "#"}
          aria-disabled={!hasPrev}
          tabIndex={hasPrev ? undefined : -1}
          className={cn(
            "inline-flex min-h-11 items-center rounded-full border px-4 text-sm font-semibold transition",
            hasPrev
              ? "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              : "pointer-events-none border-slate-100 bg-slate-50 text-slate-300",
          )}
        >
          Précédent
        </Link>

        <span className="min-w-20 text-center text-sm font-semibold text-slate-700">
          {page} / {totalPages}
        </span>

        <Link
          href={hasNext ? buildHref(page + 1) : "#"}
          aria-disabled={!hasNext}
          tabIndex={hasNext ? undefined : -1}
          className={cn(
            "inline-flex min-h-11 items-center rounded-full border px-4 text-sm font-semibold transition",
            hasNext
              ? "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              : "pointer-events-none border-slate-100 bg-slate-50 text-slate-300",
          )}
        >
          Suivant
        </Link>
      </div>
    </nav>
  );
}
