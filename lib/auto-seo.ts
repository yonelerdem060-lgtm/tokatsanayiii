import type { Metadata } from "next";
import { SEO_DEFAULTS } from "@/lib/seo";

const META_DESCRIPTION_MAX = 158;
const META_TITLE_MAX = 60;

function collapseWhitespace(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

/** Meta description için güvenli kısaltma (kelime ortasında kesmez) */
export function truncateMeta(value: string, max = META_DESCRIPTION_MAX) {
  const text = collapseWhitespace(value);
  if (text.length <= max) return text;
  const sliced = text.slice(0, max - 1);
  const lastSpace = sliced.lastIndexOf(" ");
  const base = lastSpace > 40 ? sliced.slice(0, lastSpace) : sliced;
  return `${base}…`;
}

function joinList(items: string[], max = 3) {
  return items
    .map((item) => collapseWhitespace(item))
    .filter(Boolean)
    .slice(0, max)
    .join(", ");
}

export interface ShopSeoInput {
  name: string;
  slug: string;
  description?: string | null;
  address: string;
  phone: string;
  workingHours?: string | null;
  image?: string | null;
  gallery?: string[];
  categories?: { name: string }[];
  vehicleTypes?: { name: string }[];
  brands?: { name: string }[];
}

export interface NewsSeoInput {
  title: string;
  slug: string;
  excerpt?: string | null;
  content?: string | null;
  coverImage?: string | null;
  publishedAt?: Date | string | null;
}

/** Dükkân title — anahtar kelime + marka/site */
export function buildShopSeoTitle(shop: ShopSeoInput) {
  const categories = joinList((shop.categories ?? []).map((c) => c.name), 2);
  const candidate = categories
    ? `${shop.name} | ${categories} — Tokat Sanayi`
    : `${shop.name} | Tokat Sanayi Sitesi`;
  return truncateMeta(candidate, META_TITLE_MAX);
}

/**
 * Dükkân meta description — admin açıklaması varsa onu zenginleştirir,
 * yoksa kategori / marka / adres / telefondan üretir.
 */
export function buildShopSeoDescription(shop: ShopSeoInput) {
  const categories = joinList((shop.categories ?? []).map((c) => c.name), 3);
  const brands = joinList((shop.brands ?? []).map((b) => b.name), 3);
  const vehicles = joinList((shop.vehicleTypes ?? []).map((v) => v.name), 2);

  const custom = shop.description?.trim();
  if (custom) {
    const suffixParts = [
      categories ? `${categories} hizmeti` : null,
      "Tokat Sanayi Sitesi",
      shop.phone ? `Tel: ${shop.phone}` : null,
    ].filter(Boolean);
    return truncateMeta(`${custom} ${suffixParts.join(". ")}.`);
  }

  const parts = [
    `${shop.name}, Tokat Sanayi Sitesi’nde`,
    categories ? `${categories} hizmeti sunar` : "hizmet verir",
    brands ? `${brands} markaları` : null,
    vehicles ? `${vehicles} araç tipleri` : null,
    shop.address ? `Adres: ${shop.address}` : null,
    shop.phone ? `Tel: ${shop.phone}` : null,
    shop.workingHours ? `Çalışma: ${shop.workingHours}` : null,
  ].filter(Boolean);

  return truncateMeta(`${parts.join(". ")}.`);
}

export function buildShopSeoKeywords(shop: ShopSeoInput) {
  const set = new Set<string>([
    "tokat sanayi",
    "tokat sanayi sitesi",
    shop.name.toLocaleLowerCase("tr-TR"),
    ...SEO_DEFAULTS.keywords.slice(0, 6),
  ]);

  for (const item of shop.categories ?? []) {
    set.add(item.name.toLocaleLowerCase("tr-TR"));
    set.add(`tokat ${item.name}`.toLocaleLowerCase("tr-TR"));
  }
  for (const item of shop.brands ?? []) {
    set.add(item.name.toLocaleLowerCase("tr-TR"));
  }
  for (const item of shop.vehicleTypes ?? []) {
    set.add(item.name.toLocaleLowerCase("tr-TR"));
  }

  return [...set].slice(0, 20);
}

export function buildShopMetadata(shop: ShopSeoInput): Metadata {
  const title = buildShopSeoTitle(shop);
  const description = buildShopSeoDescription(shop);
  const keywords = buildShopSeoKeywords(shop);
  const path = `/dukkan/${shop.slug}`;
  const images = [
    ...(shop.image ? [shop.image] : []),
    ...(shop.gallery ?? []).filter((url) => url && url !== shop.image),
  ].slice(0, 4);

  return {
    title: { absolute: title },
    description,
    keywords,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "tr_TR",
      title,
      description,
      url: path,
      siteName: SEO_DEFAULTS.title,
      images: images.length
        ? images.map((url) => ({ url, alt: shop.name }))
        : undefined,
    },
    twitter: {
      card: images.length ? "summary_large_image" : "summary",
      title,
      description,
      images: images.length ? images : undefined,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

/** Haber excerpt yoksa içerikten üretir */
export function buildNewsSeoDescription(news: NewsSeoInput) {
  const excerpt = news.excerpt?.trim();
  if (excerpt) return truncateMeta(excerpt);

  const content = collapseWhitespace(news.content ?? "");
  if (content) {
    return truncateMeta(`${content} — Tokat Sanayi Sitesi haberleri.`);
  }

  return truncateMeta(
    `${news.title} — Tokat Sanayi Sitesi duyuru ve haberleri.`,
  );
}

export function buildNewsSeoTitle(news: NewsSeoInput) {
  const candidate = `${news.title} | Tokat Sanayi Haber`;
  return truncateMeta(candidate, META_TITLE_MAX);
}

export function buildNewsMetadata(news: NewsSeoInput): Metadata {
  const title = buildNewsSeoTitle(news);
  const description = buildNewsSeoDescription(news);
  const path = `/haberler/${news.slug}`;
  const published =
    news.publishedAt instanceof Date
      ? news.publishedAt.toISOString()
      : news.publishedAt
        ? new Date(news.publishedAt).toISOString()
        : undefined;

  return {
    title: { absolute: title },
    description,
    keywords: [
      "tokat sanayi",
      "tokat sanayi haber",
      "tokat sanayi sitesi",
      news.title.toLocaleLowerCase("tr-TR"),
    ],
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      locale: "tr_TR",
      title,
      description,
      url: path,
      siteName: SEO_DEFAULTS.title,
      publishedTime: published,
      images: news.coverImage
        ? [{ url: news.coverImage, alt: news.title }]
        : undefined,
    },
    twitter: {
      card: news.coverImage ? "summary_large_image" : "summary",
      title,
      description,
      images: news.coverImage ? [news.coverImage] : undefined,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}
