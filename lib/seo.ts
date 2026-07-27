/** Site URL — canonical / OG / sitemap için */
export function getSiteUrl() {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    process.env.NEXTAUTH_URL?.trim() ||
    "https://tokatsanayisitesi.com";
  return raw.replace(/\/+$/, "");
}

export function absoluteUrl(path = "/") {
  const base = getSiteUrl();
  if (!path || path === "/") return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export const SEO_DEFAULTS = {
  title: "Tokat Sanayi Sitesi Rehberi",
  titleTemplate: "%s | Tokat Sanayi Sitesi",
  description:
    "Tokat Sanayi Sitesi dükkân ve usta rehberi. Merkez, Erbaa, Turhal, Niksar ve tüm Tokat ilçelerinden oto tamir, yedek parça, kaporta, lastik ve mobilya esnafını tek yerden bulun.",
  keywords: [
    "tokat sanayi",
    "tokat sanayi sitesi",
    "tokat oto tamir",
    "tokat yedek parça",
    "tokat kaporta",
    "tokat lastikçi",
    "tokat motor ustası",
    "erbaa sanayi",
    "turhal oto",
    "niksar yedek parça",
    "tokat mobilya kereste",
  ],
} as const;
