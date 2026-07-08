"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface SectorCategory {
  slug: string;
  name: string;
  count: number;
}

interface SectorCategoryFilterProps {
  basePath: string;
  categories: SectorCategory[];
}

export function SectorCategoryFilter({ basePath, categories }: SectorCategoryFilterProps) {
  const searchParams = useSearchParams();
  const active = searchParams.get("category") ?? "";

  function buildHref(slug: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (slug) {
      params.set("category", slug);
    } else {
      params.delete("category");
    }
    params.delete("page");
    const query = params.toString();
    return query ? `${basePath}?${query}#firmalar` : `${basePath}#firmalar`;
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href={buildHref(null)}
        className={cn(
          "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
          !active
            ? "border-amber-800 bg-amber-800 text-white"
            : "border-border bg-card hover:border-amber-600",
        )}
      >
        Tümü
      </Link>
      {categories.map((category) => {
        const isActive = active === category.slug;
        return (
          <Link
            key={category.slug}
            href={buildHref(isActive ? null : category.slug)}
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
              isActive
                ? "border-amber-800 bg-amber-800 text-white"
                : "border-border bg-card hover:border-amber-600",
            )}
          >
            {category.name}
            <span
              className={cn(
                "rounded-full px-1.5 text-xs tabular-nums",
                isActive ? "bg-white/20" : "bg-muted text-muted-foreground",
              )}
            >
              {category.count}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
