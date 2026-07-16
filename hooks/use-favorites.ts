"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import {
  getFavorites,
  isFavorite,
  toggleFavorite,
  type FavoriteShop,
} from "@/lib/favorites";

function subscribe(onStoreChange: () => void) {
  window.addEventListener("sanayi-favorites-changed", onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    window.removeEventListener("sanayi-favorites-changed", onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

function getSnapshot() {
  return JSON.stringify(getFavorites());
}

function getServerSnapshot() {
  return "[]";
}

export function useFavorites() {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const favorites = JSON.parse(raw) as FavoriteShop[];

  const toggle = useCallback((shop: FavoriteShop) => toggleFavorite(shop), []);
  const has = useCallback(
    (id: string) => favorites.some((item) => item.id === id),
    [favorites],
  );

  return { favorites, toggle, has, count: favorites.length };
}

export function useIsFavorite(id: string) {
  const { has, toggle, favorites } = useFavorites();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return {
    mounted,
    active: mounted && has(id),
    toggle,
    // keep favorites in deps for re-render correctness
    _count: favorites.length,
    check: isFavorite,
  };
}
