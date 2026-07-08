export const SHOPS_PAGE_SIZE = 12;
export const ADMIN_SHOPS_PAGE_SIZE = 20;

export function parsePage(value: string | undefined | null, fallback = 1) {
  const page = Number(value);
  if (!Number.isFinite(page) || page < 1) return fallback;
  return Math.floor(page);
}

export function getTotalPages(total: number, pageSize: number) {
  if (total <= 0) return 1;
  return Math.ceil(total / pageSize);
}
