import { revalidatePath, revalidateTag } from "next/cache";
import { CACHE_TAGS, type CacheTag } from "@/lib/cache-tags";

/** Public cache etiketlerini + ana sayfa path'ini yenile */
export function revalidatePublicData(...tags: CacheTag[]) {
  revalidatePath("/");
  for (const tag of tags) {
    revalidateTag(tag);
  }
}

export function revalidateShopPublicData() {
  revalidatePublicData(
    CACHE_TAGS.shops,
    CACHE_TAGS.featuredShops,
    CACHE_TAGS.shopOfWeek,
    CACHE_TAGS.filters,
    CACHE_TAGS.categoryStats,
  );
}

export function revalidateCatalogPublicData() {
  revalidatePublicData(CACHE_TAGS.filters, CACHE_TAGS.categoryStats);
}
