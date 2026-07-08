export const CATEGORY_ICON_KEYS = [
  "wrench",
  "car",
  "paintbrush",
  "settings",
  "truck",
  "cog",
  "fuel",
  "battery",
  "hammer",
  "sofa",
  "trees",
  "store",
] as const;

export function getCategoryIconKey(slug: string, index: number) {
  const map: Record<string, (typeof CATEGORY_ICON_KEYS)[number]> = {
    "motor-ustasi": "wrench",
    "yedek-parca": "cog",
    kaportaci: "car",
    "boya-badana": "paintbrush",
    "lastik-jant": "settings",
    "cekici-kurtarici": "truck",
    "elektrik-elektronik": "battery",
    "yakit-otomotiv": "fuel",
    mobilya: "sofa",
    "kereste-ahsap": "trees",
    "marangoz-dograma": "hammer",
    "galerici-2-el": "store",
  };

  return map[slug] ?? CATEGORY_ICON_KEYS[index % CATEGORY_ICON_KEYS.length];
}
