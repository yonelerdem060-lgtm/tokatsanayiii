/** Public okuma cache etiketleri — mutation'larda revalidateTag ile temizlenir */
export const CACHE_TAGS = {
  siteConfig: "site-config",
  promoSlides: "promo-slides",
  news: "news",
  featuredShops: "featured-shops",
  shopOfWeek: "shop-of-week",
  categoryStats: "category-stats",
  filters: "filters",
  shops: "shops",
} as const;

export type CacheTag = (typeof CACHE_TAGS)[keyof typeof CACHE_TAGS];
