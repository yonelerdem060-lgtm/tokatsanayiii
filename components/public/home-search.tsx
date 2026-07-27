"use client";

import {
  buildSmartSuggestions,
  POPULAR_QUERIES,
  smartSuggestionKindLabel,
  type SmartSuggestion,
} from "@/lib/smart-search";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

interface HomeSearchProps {
  totalShops: number;
  shopNames?: string[];
  categories?: { name: string; slug: string }[];
  vehicleTypes?: { name: string; slug: string }[];
  brands?: { name: string; slug: string }[];
}

function scrollToResults() {
  window.setTimeout(() => {
    document.getElementById("rehber")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    document.getElementById("rehber-search")?.focus();
  }, 80);
}

export function HomeSearch({
  totalShops,
  shopNames = [],
  categories = [],
  vehicleTypes = [],
  brands = [],
}: HomeSearchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [suggestOpen, setSuggestOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuery(searchParams.get("q") ?? "");
  }, [searchParams]);

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (!wrapRef.current?.contains(event.target as Node)) {
        setSuggestOpen(false);
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  const navigateSearch = useCallback(
    (value: string, extras?: Record<string, string | null>) => {
      const params = new URLSearchParams();
      const trimmed = value.trim();
      if (trimmed) params.set("q", trimmed);
      if (extras) {
        for (const [key, val] of Object.entries(extras)) {
          if (val) params.set(key, val);
          else params.delete(key);
        }
      }
      const qs = params.toString();
      router.push(qs ? `/?${qs}` : "/");
      scrollToResults();
      setSuggestOpen(false);
    },
    [router],
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    navigateSearch(query);
  }

  function applySuggestion(item: SmartSuggestion) {
    if (item.kind === "category" && item.category) {
      setQuery("");
      navigateSearch("", { q: null, category: item.category });
      return;
    }
    if (item.kind === "vehicleType" && item.vehicleType) {
      setQuery("");
      navigateSearch("", { q: null, vehicleType: item.vehicleType });
      return;
    }
    if (item.kind === "brand" && item.brand) {
      setQuery("");
      navigateSearch("", { q: null, brand: item.brand });
      return;
    }
    const next = item.q ?? item.label;
    setQuery(next);
    navigateSearch(next);
  }

  const smartSuggestions = useMemo(
    () =>
      buildSmartSuggestions({
        query,
        shopNames,
        categoryOptions: categories,
        vehicleOptions: vehicleTypes,
        brandOptions: brands,
        limit: 8,
      }),
    [query, shopNames, categories, vehicleTypes, brands],
  );

  const selectedQuery = searchParams.get("q") ?? "";

  return (
    <section
      id="ara"
      aria-label="Arama"
      className="relative border-b border-border bg-gradient-to-b from-[#1e4b8f] to-[#163a73]"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.14),transparent_55%)]" />

      <div className="relative mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-blue-100/90">
            Hızlı arama
          </p>
          <h2 className="mt-1 text-balance text-xl font-bold tracking-tight text-white sm:text-2xl">
            <span className="sr-only">Tokat Sanayi Sitesi — </span>
            Ne arıyorsun?
          </h2>
          <p className="mt-1 text-sm text-blue-100/85">
            {totalShops}+ işletme · ustayı, dükkânı veya hizmeti tek aramada bul
          </p>
        </div>

        <div ref={wrapRef} className="relative mx-auto mt-5 max-w-2xl">
          <form
            onSubmit={handleSubmit}
            className="flex items-stretch gap-2 rounded-2xl bg-white p-1.5 shadow-[0_16px_40px_-12px_rgb(0_0_0_/0.35)] ring-1 ring-white/40"
          >
            <label className="relative min-w-0 flex-1">
              <span className="sr-only">Ara</span>
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                id="home-search"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setSuggestOpen(true);
                }}
                onFocus={() => setSuggestOpen(true)}
                placeholder="Lastik, klima, kaporta, oto elektrik..."
                enterKeyHint="search"
                autoComplete="off"
                className="w-full rounded-xl border-0 bg-transparent py-3.5 pl-11 pr-3 text-base text-slate-900 outline-none placeholder:text-slate-400 sm:min-h-[3.25rem] sm:text-[15px]"
              />
            </label>
            <button
              type="submit"
              className="inline-flex h-auto shrink-0 items-center justify-center rounded-xl bg-accent px-5 text-sm font-bold text-slate-950 transition hover:brightness-105 active:scale-[0.98] sm:px-7 sm:text-base"
            >
              Ara
            </button>
          </form>

          {suggestOpen && smartSuggestions.length > 0 && (
            <ul
              role="listbox"
              className="absolute left-0 right-0 top-[calc(100%+8px)] z-40 max-h-72 overflow-auto rounded-2xl border border-border bg-white shadow-[var(--ds-shadow-lift)]"
            >
              {smartSuggestions.map((item) => (
                <li
                  key={`${item.kind}-${item.category ?? ""}-${item.vehicleType ?? ""}-${item.brand ?? ""}-${item.label}`}
                >
                  <button
                    type="button"
                    role="option"
                    className="flex w-full items-center gap-2 px-3.5 py-3 text-left text-sm text-slate-700 transition hover:bg-primary-soft hover:text-primary"
                    onClick={() => applySuggestion(item)}
                  >
                    <Search className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                    <span className="min-w-0 flex-1 truncate font-medium">{item.label}</span>
                    <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                      {smartSuggestionKindLabel(item.kind)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mx-auto mt-4 flex max-w-2xl flex-wrap items-center justify-center gap-2">
          {POPULAR_QUERIES.slice(0, 7).map((term) => {
            const active =
              selectedQuery.toLocaleLowerCase("tr") === term.toLocaleLowerCase("tr");
            return (
              <button
                key={term}
                type="button"
                onClick={() => {
                  setQuery(active ? "" : term);
                  navigateSearch(active ? "" : term);
                }}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-semibold transition active:scale-95 sm:text-sm",
                  active
                    ? "border-white bg-white text-primary"
                    : "border-white/25 bg-white/10 text-white hover:bg-white/20",
                )}
              >
                {term}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
