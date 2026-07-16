const STORAGE_KEY = "sanayi-favorites";

export type FavoriteShop = {
  id: string;
  name: string;
  slug: string;
  image?: string | null;
  phone?: string;
};

function readRaw(): FavoriteShop[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as FavoriteShop[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeRaw(items: FavoriteShop[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent("sanayi-favorites-changed"));
}

export function getFavorites(): FavoriteShop[] {
  return readRaw();
}

export function isFavorite(id: string): boolean {
  return readRaw().some((item) => item.id === id);
}

export function toggleFavorite(shop: FavoriteShop): boolean {
  const current = readRaw();
  const exists = current.some((item) => item.id === shop.id);
  const next = exists
    ? current.filter((item) => item.id !== shop.id)
    : [...current, shop];
  writeRaw(next);
  return !exists;
}

export function removeFavorite(id: string) {
  writeRaw(readRaw().filter((item) => item.id !== id));
}
