export const ACCOUNTS_PAGE_SIZE = 6;
export const METIERS_PAGE_SIZE = 8;

export type PaginatedResult<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export function parsePage(
  value: string | string[] | undefined,
  fallback = 1,
): number {
  const raw = Array.isArray(value) ? value[0] : value;
  const parsed = Number(raw);

  if (!Number.isSafeInteger(parsed) || parsed < 1) {
    return fallback;
  }

  return parsed;
}

export function buildPaginatedResult<T>(
  items: T[],
  total: number,
  page: number,
  pageSize: number,
): PaginatedResult<T> {
  const safePageSize = Math.max(1, pageSize);
  const totalPages = Math.max(1, Math.ceil(total / safePageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);

  return {
    items,
    total,
    page: safePage,
    pageSize: safePageSize,
    totalPages,
  };
}

export function buildAdminDashboardHref(input: {
  status?: string;
  page?: number;
  metiersPage?: number;
}): string {
  const params = new URLSearchParams();

  if (input.status && input.status !== "ALL") {
    params.set("status", input.status);
  }
  if (input.page && input.page > 1) {
    params.set("page", String(input.page));
  }
  if (input.metiersPage && input.metiersPage > 1) {
    params.set("metiersPage", String(input.metiersPage));
  }

  const query = params.toString();
  return query ? `/admin/dashboard?${query}` : "/admin/dashboard";
}
