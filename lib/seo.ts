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
  /** ~50 karakter — Wincher 10–60 aralığı, anahtar kelime başta */
  title: "Tokat Sanayi Sitesi | Dükkân ve Usta Rehberi",
  titleTemplate: "%s | Tokat Sanayi Sitesi",
  /** ~150 karakter — anahtar kelime başta, CTA net */
  description:
    "Tokat Sanayi Sitesi dükkân rehberi: oto tamir, yedek parça, kaporta, lastik ve mobilya esnafını Merkez, Erbaa, Turhal, Niksar’dan tek tıkla bulun.",
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
