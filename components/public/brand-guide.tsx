"use client";

import { Reveal, Stagger, StaggerItem } from "@/components/public/motion";
import { Input } from "@/components/ui/input";
import { CATALOG_BRAND_GROUPS } from "@/lib/catalog";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

interface BrandStat {
  id: string;
  name: string;
  slug: string;
  count: number;
}

interface BrandGuideProps {
  brands: BrandStat[];
}

function brandInitials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function buildFilterHref(
  searchParams: URLSearchParams,
  brandSlug: string,
  isActive: boolean,
) {
  const params = new URLSearchParams(searchParams.toString());
  if (isActive) params.delete("brand");
  else params.set("brand", brandSlug);
  params.delete("page");
  const query = params.toString();
  return query ? `/?${query}` : "/";
}

export function BrandGuide({ brands }: BrandGuideProps) {
  const searchParams = useSearchParams();
  const activeBrand = searchParams.get("brand");
  const [search, setSearch] = useState("");

  const brandMap = useMemo(
    () => new Map(brands.map((brand) => [brand.name, brand])),
    [brands],
  );

  const filteredGroups = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("tr");
    if (!query) return CATALOG_BRAND_GROUPS;

    return CATALOG_BRAND_GROUPS.map((group) => ({
      ...group,
      brands: group.brands.filter((name) =>
        name.toLocaleLowerCase("tr").includes(query),
      ),
    })).filter((group) => group.brands.length > 0);
  }, [search]);

  if (brands.length === 0) return null;

  return (
    <section id="markalar" className="border-b border-border/70 py-10 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-blue-600">
              Markalar
            </p>
            <h2 className="text-2xl font-semibold tracking-tight">Marka rehberi</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {brands.length} marka · logolu kartlarla hızlı seçim
            </p>
          </div>

          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Marka ara..."
              className="h-11 rounded-[14px] border-border/80 bg-white pl-9"
            />
          </div>
        </Reveal>

        <div className="space-y-8">
          {filteredGroups.map((group) => (
            <div key={group.label}>
              <h3 className="mb-3 text-sm font-semibold text-muted-foreground">{group.label}</h3>
              <Stagger className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                {group.brands.map((brandName) => {
                  const brand = brandMap.get(brandName);
                  if (!brand) return null;
                  const isActive = activeBrand === brand.slug;

                  return (
                    <StaggerItem key={brand.id}>
                      <Link
                        href={buildFilterHref(searchParams, brand.slug, isActive)}
                        className={cn(
                          "card-surface flex h-full flex-col items-center gap-3 p-4 text-center",
                          isActive && "border-blue-300 bg-blue-50/80",
                          brand.count === 0 && !isActive && "opacity-55",
                        )}
                      >
                        <span
                          className={cn(
                            "inline-flex h-14 w-14 items-center justify-center rounded-[18px] text-sm font-bold tracking-wide",
                            isActive
                              ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
                              : "bg-gradient-to-br from-slate-50 to-blue-50 text-blue-700 ring-1 ring-blue-100",
                          )}
                        >
                          {brandInitials(brand.name)}
                        </span>
                        <span className="line-clamp-2 text-sm font-semibold text-slate-900">
                          {brand.name}
                        </span>
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium tabular-nums text-slate-600">
                          {brand.count} firma
                        </span>
                      </Link>
                    </StaggerItem>
                  );
                })}
              </Stagger>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
