"use client";

import { Reveal, Stagger, StaggerItem } from "@/components/public/motion";
import { getCategoryIconKey } from "@/lib/category-icons";
import { cn } from "@/lib/utils";
import {
  ArrowUpRight,
  Battery,
  Car,
  Cog,
  Fuel,
  Hammer,
  Paintbrush,
  Settings,
  Sofa,
  Store,
  Trees,
  Truck,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { LucideIcon } from "lucide-react";

interface CategoryStat {
  id: string;
  name: string;
  slug: string;
  count: number;
}

interface CategoryBrowseProps {
  categories: CategoryStat[];
}

const iconMap: Record<string, LucideIcon> = {
  wrench: Wrench,
  car: Car,
  paintbrush: Paintbrush,
  settings: Settings,
  truck: Truck,
  cog: Cog,
  fuel: Fuel,
  battery: Battery,
  hammer: Hammer,
  sofa: Sofa,
  trees: Trees,
  store: Store,
};

function buildFilterHref(
  pathname: string,
  searchParams: URLSearchParams,
  updates: Record<string, string | null>,
) {
  const params = new URLSearchParams(searchParams.toString());
  for (const [key, value] of Object.entries(updates)) {
    if (value) params.set(key, value);
    else params.delete(key);
  }
  params.delete("page");
  const query = params.toString();
  return query ? `${pathname}?${query}` : `${pathname}`;
}

export function CategoryBrowse({ categories }: CategoryBrowseProps) {
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category");

  if (categories.length === 0) return null;

  const popular = [...categories].sort((a, b) => b.count - a.count).slice(0, 8);

  return (
    <section id="kategoriler" className="border-b border-border/70 py-6 sm:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mb-4 flex items-end justify-between gap-4 sm:mb-6">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-blue-600">
              Popüler Kategoriler
            </p>
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">Sektöre göre keşfet</h2>
            <p className="mt-1 text-sm text-muted-foreground">Dokun, filtrele, hemen ara</p>
          </div>
          <Link
            href="/"
            className="hidden items-center gap-1 text-sm font-medium text-blue-700 transition hover:text-blue-800 sm:inline-flex"
          >
            Tüm rehber
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Reveal>

        <div className="hide-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:hidden">
          {popular.map((category, index) => {
            const isActive = activeCategory === category.slug;
            const href = buildFilterHref("/", searchParams, {
              category: isActive ? null : category.slug,
            });
            const Icon = iconMap[getCategoryIconKey(category.slug, index)] ?? Store;
            return (
              <Link
                key={category.id}
                href={href}
                className={cn(
                  "inline-flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-2.5 text-sm font-medium transition active:scale-95",
                  isActive
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-border bg-white text-slate-700",
                )}
              >
                <Icon className="h-4 w-4" />
                {category.name}
                <span
                  className={cn(
                    "rounded-full px-1.5 text-[10px] font-semibold tabular-nums",
                    isActive ? "bg-white/20" : "bg-slate-100 text-slate-500",
                  )}
                >
                  {category.count}
                </span>
              </Link>
            );
          })}
        </div>

        <Stagger className="hidden gap-3 sm:grid sm:grid-cols-2 lg:grid-cols-4">
          {popular.map((category, index) => {
            const isActive = activeCategory === category.slug;
            const href = buildFilterHref("/", searchParams, {
              category: isActive ? null : category.slug,
            });
            const Icon = iconMap[getCategoryIconKey(category.slug, index)] ?? Store;

            return (
              <StaggerItem key={category.id}>
                <Link
                  href={href}
                  className={cn(
                    "card-surface group flex h-full items-center gap-4 p-4",
                    isActive && "border-blue-300 bg-blue-50/70",
                  )}
                >
                  <span
                    className={cn(
                      "inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] transition",
                      isActive
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
                        : "bg-blue-50 text-blue-700 group-hover:bg-blue-600 group-hover:text-white",
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-slate-900">{category.name}</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">{category.count} firma</p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-blue-600" />
                </Link>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
