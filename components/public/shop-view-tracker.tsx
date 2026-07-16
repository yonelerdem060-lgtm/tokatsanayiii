"use client";

import { recordShopClick, recordShopView } from "@/actions/shop-stats";
import { useEffect } from "react";

export function ShopViewTracker({ shopId }: { shopId: string }) {
  useEffect(() => {
    void recordShopView(shopId);
  }, [shopId]);

  return null;
}

export function trackShopClick(shopId: string, type: "phone" | "whatsapp") {
  void recordShopClick(shopId, type);
}
