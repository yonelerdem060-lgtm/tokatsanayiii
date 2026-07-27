/**
 * Genel /admin yerine gizli panel yolu.
 * Değiştirmek için .env: NEXT_PUBLIC_ADMIN_BASE_PATH=/istediginiz-yol
 */
function normalizeBasePath(value: string) {
  const trimmed = value.trim();
  if (!trimmed || trimmed === "/") return "/yp-tokat-7x9k";
  const withSlash = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return withSlash.replace(/\/+$/, "") || "/yp-tokat-7x9k";
}

export const ADMIN_BASE_PATH = normalizeBasePath(
  process.env.NEXT_PUBLIC_ADMIN_BASE_PATH || "/yp-tokat-7x9k",
);

/**
 * Genel admin URL üretir.
 * Örnek: adminPath() → /yp-tokat-7x9k
 *        adminPath("/shops") → /yp-tokat-7x9k/shops
 *        adminPath("login") → /yp-tokat-7x9k/login
 */
export function adminPath(subpath = "") {
  const raw = subpath.trim();
  if (!raw || raw === "/") return ADMIN_BASE_PATH;

  let suffix = raw.startsWith("/") ? raw : `/${raw}`;
  if (suffix === "/admin" || suffix.startsWith("/admin/")) {
    suffix = suffix.slice("/admin".length) || "";
  }
  if (!suffix || suffix === "/") return ADMIN_BASE_PATH;
  return `${ADMIN_BASE_PATH}${suffix.startsWith("/") ? suffix : `/${suffix}`}`;
}

export function isAdminPublicPath(pathname: string) {
  return pathname === ADMIN_BASE_PATH || pathname.startsWith(`${ADMIN_BASE_PATH}/`);
}

export function toInternalAdminPath(pathname: string) {
  if (pathname === ADMIN_BASE_PATH) return "/admin";
  if (pathname.startsWith(`${ADMIN_BASE_PATH}/`)) {
    return `/admin${pathname.slice(ADMIN_BASE_PATH.length)}`;
  }
  return null;
}

/** Cache yenileme: hem gizli URL hem iç /admin yolu */
export function revalidateAdminPaths(
  revalidatePath: (path: string) => void,
  subpath = "",
) {
  const publicPath = adminPath(subpath);
  const internal =
    !subpath || subpath === "/"
      ? "/admin"
      : `/admin${subpath.startsWith("/") ? subpath : `/${subpath}`}`;
  revalidatePath(publicPath);
  if (internal !== publicPath) {
    revalidatePath(internal);
  }
}
