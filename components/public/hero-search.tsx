"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ArrowRight, Building2, MapPin, Search, Sparkles } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

interface Option {
  id: string;
  name: string;
  slug: string;
  count: number;
}

interface HeroSearchProps {
  categories: Option[];
  vehicleTypes: Option[];
  totalShops: number;
}

export function HeroSearch({ categories, vehicleTypes, totalShops }: HeroSearchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [category, setCategory] = useState(searchParams.get("category") ?? "");
  const [vehicleType, setVehicleType] = useState(searchParams.get("vehicleType") ?? "");
  const [showMore, setShowMore] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (category) params.set("category", category);
    if (vehicleType) params.set("vehicleType", vehicleType);
    const qs = params.toString();
    router.push(qs ? `/?${qs}#rehber` : "/#rehber");
  }

  return (
    <section className="relative overflow-hidden border-b border-border/70">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.22),transparent_42%),radial-gradient(circle_at_80%_0%,rgba(37,99,235,0.18),transparent_36%)]" />
      <div className="pointer-events-none absolute -left-20 top-10 h-56 w-56 rounded-full bg-blue-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-indigo-500/15 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-200/70 bg-white/70 px-3 py-1.5 text-xs font-medium text-blue-700 shadow-sm backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" />
            Tokat Sanayi Sitesi dijital rehberi
          </div>
          <h1 className="text-balance text-[1.75rem] font-semibold leading-tight tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            İhtiyacın olan ustayı hemen bul
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-pretty text-sm text-slate-600 sm:mt-4 sm:text-lg">
            {totalShops}+ işletme · ara, filtrele, tek tıkla telefonla veya WhatsApp ile ulaş.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="glass-panel mx-auto mt-6 max-w-4xl rounded-[20px] p-2 sm:mt-8 sm:rounded-[22px] sm:p-3"
        >
          <div className="grid gap-2 lg:grid-cols-[1.4fr_1fr_1fr_auto]">
            <label className="relative block">
              <span className="sr-only">Firma ara</span>
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Ne arıyorsun? örn. lastik, klima..."
                enterKeyHint="search"
                className="h-12 rounded-[16px] border-transparent bg-white/90 pl-10 text-base shadow-none focus:border-blue-200 focus:ring-blue-100 sm:text-sm"
              />
            </label>

            <div
              className={cn(
                "gap-2 sm:grid-cols-2 lg:contents",
                showMore ? "grid" : "hidden sm:grid",
              )}
            >
              <label className="relative block">
                <span className="sr-only">Kategori</span>
                <Building2 className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <select
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  className={cn(
                    "flex h-12 w-full appearance-none rounded-[16px] border border-transparent bg-white/90 pl-10 pr-3 text-base outline-none sm:text-sm",
                    "focus:border-blue-200 focus:ring-2 focus:ring-blue-100",
                  )}
                >
                  <option value="">Tüm kategoriler</option>
                  {categories.map((item) => (
                    <option key={item.id} value={item.slug}>
                      {item.name} ({item.count})
                    </option>
                  ))}
                </select>
              </label>

              <label className="relative block">
                <span className="sr-only">Araç tipi / bölge tipi</span>
                <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <select
                  value={vehicleType}
                  onChange={(event) => setVehicleType(event.target.value)}
                  className={cn(
                    "flex h-12 w-full appearance-none rounded-[16px] border border-transparent bg-white/90 pl-10 pr-3 text-base outline-none sm:text-sm",
                    "focus:border-blue-200 focus:ring-2 focus:ring-blue-100",
                  )}
                >
                  <option value="">Tüm araç tipleri</option>
                  {vehicleTypes.map((item) => (
                    <option key={item.id} value={item.slug}>
                      {item.name} ({item.count})
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <button
              type="button"
              onClick={() => setShowMore((value) => !value)}
              className="rounded-[14px] px-2 py-1 text-sm font-medium text-blue-700 sm:hidden"
            >
              {showMore ? "Daha az" : "Kategori / araç tipi ekle"}
            </button>

            <Button
              type="submit"
              size="lg"
              className="h-12 rounded-[16px] bg-blue-600 px-6 text-base shadow-lg shadow-blue-600/25 transition hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-blue-600/35 sm:text-sm"
            >
              Firmaları Göster
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </form>

        <div className="mx-auto mt-4 flex max-w-4xl flex-wrap items-center justify-center gap-2 text-sm text-slate-500 sm:mt-5">
          <span className="w-full text-center sm:w-auto">Hızlı seç:</span>
          {categories.slice(0, 4).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setCategory(item.slug);
                const params = new URLSearchParams();
                params.set("category", item.slug);
                router.push(`/?${params.toString()}#rehber`);
              }}
              className="rounded-full border border-blue-100 bg-white/70 px-3 py-1.5 text-blue-700 transition active:scale-95 hover:border-blue-300 hover:bg-white"
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
