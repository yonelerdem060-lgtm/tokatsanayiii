"use client";

import { useIsFavorite } from "@/hooks/use-favorites";
import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";

interface FavoriteButtonProps {
  shop: {
    id: string;
    name: string;
    slug: string;
    image?: string | null;
    phone?: string;
  };
  className?: string;
  size?: "sm" | "md";
}

export function FavoriteButton({ shop, className, size = "md" }: FavoriteButtonProps) {
  const { active, mounted, toggle } = useIsFavorite(shop.id);

  return (
    <button
      type="button"
      aria-label={active ? "Favorilerden çıkar" : "Favorilere ekle"}
      aria-pressed={active}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        toggle(shop);
      }}
      className={cn(
        "inline-flex items-center justify-center rounded-full border transition active:scale-95",
        size === "sm" ? "h-9 w-9" : "h-10 w-10",
        active
          ? "border-rose-200 bg-rose-50 text-rose-600"
          : "border-border bg-white/95 text-slate-500 hover:border-rose-200 hover:text-rose-600",
        className,
      )}
    >
      <Heart
        className={cn(
          size === "sm" ? "h-4 w-4" : "h-4.5 w-4.5 h-[18px] w-[18px]",
          mounted && active && "fill-rose-500 text-rose-500",
        )}
      />
    </button>
  );
}
