"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  buildSmartSuggestions,
  POPULAR_QUERIES,
  smartSuggestionKindLabel,
  type SmartSuggestion,
} from "@/lib/smart-search";
import { cn } from "@/lib/utils";
import {
  Building2,
  Check,
  Car,
  Filter,
  RotateCcw,
  Search,
  Tag,
  X,
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";

export interface FilterOptionWithCount {
  id: string;
  name: string;
  slug: string;
  count: number;
}

interface FilterBarProps {
  categories: FilterOptionWithCount[];
  vehicleTypes: FilterOptionWithCount[];
  brands: FilterOptionWithCount[];
  resultCount: number;
  /** Firma / kategori / marka adlarından autocomplete önerileri */
  suggestions?: string[];
  onPendingChange?: (pending: boolean) => void;
}

type FilterKey = "category" | "vehicleType" | "brand";

export function FilterBar({
  categories,
  vehicleTypes,
  brands,
  resultCount,
  suggestions = [],
  onPendingChange,
}: FilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetTab, setSheetTab] = useState<FilterKey>("category");
  const [firmQuery, setFirmQuery] = useState(searchParams.get("q") ?? "");
  const [optionQuery, setOptionQuery] = useState("");
  const [suggestOpen, setSuggestOpen] = useState(false);
  const searchWrapRef = useRef<HTMLDivElement>(null);

  const selectedCategory = searchParams.get("category") ?? "";
  const selectedVehicleType = searchParams.get("vehicleType") ?? "";
  const selectedBrand = searchParams.get("brand") ?? "";
  const selectedQuery = searchParams.get("q") ?? "";

  useEffect(() => {
    setFirmQuery(selectedQuery);
  }, [selectedQuery]);

  useEffect(() => {
    onPendingChange?.(isPending);
  }, [isPending, onPendingChange]);

  useEffect(() => {
    if (!sheetOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [sheetOpen]);

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (!searchWrapRef.current?.contains(event.target as Node)) {
        setSuggestOpen(false);
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value) params.set(key, value);
        else params.delete(key);
      }
      params.delete("page");
      startTransition(() => {
        const query = params.toString();
        router.push(query ? `${pathname}?${query}` : `${pathname}`);
      });
    },
    [pathname, router, searchParams],
  );

  function selectOption(key: FilterKey, slug: string) {
    const current = searchParams.get(key);
    updateParams({ [key]: current === slug ? null : slug });
  }

  function applySearch(value: string) {
    const trimmed = value.trim();
    setFirmQuery(trimmed);
    setSuggestOpen(false);
    updateParams({ q: trimmed || null });
  }

  function applySuggestion(item: SmartSuggestion) {
    setSuggestOpen(false);
    if (item.kind === "category" && item.category) {
      setFirmQuery("");
      updateParams({
        q: null,
        category: item.category,
        vehicleType: null,
        brand: null,
      });
      return;
    }
    if (item.kind === "vehicleType" && item.vehicleType) {
      setFirmQuery("");
      updateParams({
        q: null,
        vehicleType: item.vehicleType,
        category: null,
        brand: null,
      });
      return;
    }
    if (item.kind === "brand" && item.brand) {
      setFirmQuery("");
      updateParams({
        q: null,
        brand: item.brand,
        category: null,
        vehicleType: null,
      });
      return;
    }
    applySearch(item.q ?? item.label);
  }

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    applySearch(firmQuery);
  }

  function clearAll() {
    startTransition(() => {
      router.push(`${pathname}`);
    });
    setFirmQuery("");
    setOptionQuery("");
    setSuggestOpen(false);
  }

  const smartSuggestions = useMemo(
    () =>
      buildSmartSuggestions({
        query: firmQuery,
        shopNames: suggestions,
        categoryOptions: categories,
        vehicleOptions: vehicleTypes,
        brandOptions: brands,
        limit: 10,
      }),
    [firmQuery, suggestions, categories, vehicleTypes, brands],
  );

  const selectedCategoryName = categories.find((item) => item.slug === selectedCategory)?.name;
  const selectedVehicleName = vehicleTypes.find((item) => item.slug === selectedVehicleType)?.name;
  const selectedBrandName = brands.find((item) => item.slug === selectedBrand)?.name;

  const activeCount = [selectedCategory, selectedVehicleType, selectedBrand, selectedQuery].filter(
    Boolean,
  ).length;

  const activeChips = [
    selectedQuery
      ? { key: "q", label: `“${selectedQuery}”`, onClear: () => updateParams({ q: null }) }
      : null,
    selectedCategoryName
      ? {
          key: "category",
          label: selectedCategoryName,
          onClear: () => updateParams({ category: null }),
        }
      : null,
    selectedVehicleName
      ? {
          key: "vehicleType",
          label: selectedVehicleName,
          onClear: () => updateParams({ vehicleType: null }),
        }
      : null,
    selectedBrandName
      ? {
          key: "brand",
          label: selectedBrandName,
          onClear: () => updateParams({ brand: null }),
        }
      : null,
  ].filter(Boolean) as { key: string; label: string; onClear: () => void }[];

  const sheetOptions = useMemo(() => {
    const source =
      sheetTab === "category"
        ? categories
        : sheetTab === "vehicleType"
          ? vehicleTypes
          : brands;
    const query = optionQuery.trim().toLocaleLowerCase("tr");
    if (!query) return source;
    return source.filter((item) => item.name.toLocaleLowerCase("tr").includes(query));
  }, [sheetTab, categories, vehicleTypes, brands, optionQuery]);

  const selectedForTab =
    sheetTab === "category"
      ? selectedCategory
      : sheetTab === "vehicleType"
        ? selectedVehicleType
        : selectedBrand;

  return (
    <>
      <div
        id="rehber-filters"
        className={cn(
          "sticky top-[72px] z-30 -mx-4 scroll-mt-32 space-y-3 bg-gradient-to-b from-background via-background/95 to-transparent px-4 pb-3 pt-1 sm:top-[104px] sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8",
          isPending && "pointer-events-none opacity-60",
        )}
      >
        <div className="rounded-[var(--ds-radius-xl)] border border-border/80 bg-white/95 p-2.5 shadow-[var(--ds-shadow-soft)] backdrop-blur-xl sm:p-3">
          <div className="flex gap-2">
            <div ref={searchWrapRef} className="relative min-w-0 flex-1">
              <form onSubmit={handleSearch} className="relative">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 sm:h-4 sm:w-4 sm:left-3" />
                <Input
                  id="rehber-search"
                  value={firmQuery}
                  onChange={(event) => {
                    setFirmQuery(event.target.value);
                    setSuggestOpen(true);
                  }}
                  onFocus={() => setSuggestOpen(true)}
                  placeholder="Ara: lastik, klima, kaporta, dükkân adı..."
                  enterKeyHint="search"
                  autoComplete="off"
                  className="h-14 rounded-[var(--ds-radius-lg)] border-slate-200 bg-slate-50/90 pl-11 pr-20 text-base font-medium shadow-inner sm:h-12 sm:text-sm"
                />
                <Button
                  type="submit"
                  size="sm"
                  variant="primary"
                  className="absolute right-1.5 top-1/2 h-11 -translate-y-1/2 rounded-[var(--ds-radius-md)] px-4 text-sm font-bold sm:h-9 sm:px-3"
                >
                  Ara
                </Button>
              </form>

              {suggestOpen && smartSuggestions.length > 0 && (
                <ul
                  role="listbox"
                  className="absolute left-0 right-0 top-[calc(100%+6px)] z-40 max-h-72 overflow-auto rounded-[var(--ds-radius-lg)] border border-border bg-white shadow-[var(--ds-shadow-lift)]"
                >
                  {smartSuggestions.map((item) => (
                    <li
                      key={`${item.kind}-${item.category ?? ""}-${item.vehicleType ?? ""}-${item.brand ?? ""}-${item.label}`}
                    >
                      <button
                        type="button"
                        role="option"
                        className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-slate-700 transition hover:bg-primary-soft hover:text-primary"
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

            <button
              type="button"
              onClick={() => {
                setSheetOpen(true);
                setOptionQuery("");
              }}
              className={cn(
                "relative inline-flex h-14 shrink-0 items-center gap-2 rounded-[var(--ds-radius-lg)] border px-3.5 text-sm font-semibold transition md:hidden sm:h-12",
                activeCount > 0
                  ? "border-blue-200 bg-primary-soft text-primary"
                  : "border-slate-200 bg-white text-slate-700",
              )}
            >
              <Filter className="h-4 w-4" />
              Filtre
              {activeCount > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white">
                  {activeCount}
                </span>
              )}
            </button>
          </div>

          {/* Popüler aramalar */}
          <div className="mt-2.5 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Popüler
            </span>
            {POPULAR_QUERIES.slice(0, 8).map((term) => {
              const active = selectedQuery.toLocaleLowerCase("tr") === term.toLocaleLowerCase("tr");
              return (
                <button
                  key={term}
                  type="button"
                  onClick={() => applySearch(active ? "" : term)}
                  className={cn(
                    "rounded-full border px-2.5 py-1 text-xs font-medium transition",
                    active
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-muted/60 text-slate-600 hover:border-blue-200 hover:bg-primary-soft hover:text-primary",
                  )}
                >
                  {term}
                </button>
              );
            })}
          </div>

          {/* Desktop / tablet triggers */}
          <div className="mt-2 hidden gap-2 md:flex">
            <DesktopTrigger
              icon={Building2}
              label={selectedCategoryName ?? "Kategori"}
              active={!!selectedCategory}
              onClick={() => {
                setSheetTab("category");
                setSheetOpen(true);
                setOptionQuery("");
              }}
            />
            <DesktopTrigger
              icon={Car}
              label={selectedVehicleName ?? "Araç tipi"}
              active={!!selectedVehicleType}
              onClick={() => {
                setSheetTab("vehicleType");
                setSheetOpen(true);
                setOptionQuery("");
              }}
            />
            <DesktopTrigger
              icon={Tag}
              label={selectedBrandName ?? "Marka"}
              active={!!selectedBrand}
              onClick={() => {
                setSheetTab("brand");
                setSheetOpen(true);
                setOptionQuery("");
              }}
            />
            {activeCount > 0 && (
              <button
                type="button"
                onClick={clearAll}
                className="inline-flex h-11 items-center gap-2 rounded-[var(--ds-radius-lg)] border border-slate-200 bg-white px-3.5 text-sm font-medium text-slate-600 transition hover:border-blue-200 hover:bg-primary-soft hover:text-primary"
              >
                <RotateCcw className="h-4 w-4" />
                Temizle
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 px-0.5">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-slate-900">{resultCount}</span> dükkân
            {activeCount > 0 ? " · filtrelendi" : ""}
            {isPending ? " · güncelleniyor…" : ""}
          </p>
          {activeChips.length > 0 && (
            <div className="hide-scrollbar flex max-w-full gap-2 overflow-x-auto">
              {activeChips.map((chip) => (
                <button
                  key={chip.key}
                  type="button"
                  onClick={chip.onClear}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-blue-100 bg-primary-soft px-3 py-1.5 text-xs font-medium text-primary"
                >
                  {chip.label}
                  <X className="h-3 w-3" />
                </button>
              ))}
              <button
                type="button"
                onClick={clearAll}
                className="inline-flex shrink-0 items-center gap-1 rounded-full border border-border bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-muted md:hidden"
              >
                <RotateCcw className="h-3 w-3" />
                Temizle
              </button>
            </div>
          )}
        </div>
      </div>

      {sheetOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end md:items-center md:justify-center md:p-6">
          <button
            type="button"
            className="absolute inset-0 bg-slate-950/45 backdrop-blur-[2px]"
            aria-label="Filtreyi kapat"
            onClick={() => setSheetOpen(false)}
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-label="Filtreler"
            className="relative z-10 flex max-h-[88vh] w-full flex-col overflow-hidden rounded-t-[var(--ds-radius-xl)] bg-white shadow-2xl md:max-h-[80vh] md:max-w-lg md:rounded-[var(--ds-radius-xl)]"
          >
            <div className="flex items-center justify-between border-b border-border px-4 py-3.5">
              <div>
                <p className="text-base font-semibold text-slate-900">Filtrele</p>
                <p className="text-xs text-muted-foreground">
                  {resultCount} sonuç · ihtiyacına göre daralt
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSheetOpen(false)}
                className="rounded-full border border-border p-2 text-slate-500 hover:bg-slate-50"
                aria-label="Kapat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex gap-1 border-b border-border bg-slate-50 p-2">
              {(
                [
                  { key: "category", label: "Kategori", icon: Building2 },
                  { key: "vehicleType", label: "Araç", icon: Car },
                  { key: "brand", label: "Marka", icon: Tag },
                ] as const
              ).map((tab) => {
                const active = sheetTab === tab.key;
                const selected =
                  tab.key === "category"
                    ? !!selectedCategory
                    : tab.key === "vehicleType"
                      ? !!selectedVehicleType
                      : !!selectedBrand;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => {
                      setSheetTab(tab.key);
                      setOptionQuery("");
                    }}
                    className={cn(
                      "relative flex flex-1 items-center justify-center gap-1.5 rounded-[var(--ds-radius-md)] px-2 py-2.5 text-xs font-semibold transition sm:text-sm",
                      active ? "bg-white text-primary shadow-sm" : "text-slate-600",
                    )}
                  >
                    <tab.icon className="h-3.5 w-3.5" />
                    {tab.label}
                    {selected && (
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="border-b border-border p-3">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                <Input
                  autoFocus
                  value={optionQuery}
                  onChange={(event) => setOptionQuery(event.target.value)}
                  placeholder={
                    sheetTab === "category"
                      ? "Kategori ara..."
                      : sheetTab === "vehicleType"
                        ? "Araç tipi ara..."
                        : "Marka ara..."
                  }
                  className="h-11 rounded-[var(--ds-radius-md)] border-slate-200 bg-white pl-9 text-base sm:text-sm"
                />
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-2">
              {sheetOptions.length === 0 ? (
                <p className="px-3 py-10 text-center text-sm text-muted-foreground">
                  Sonuç bulunamadı
                </p>
              ) : (
                <ul className="space-y-1">
                  {sheetOptions.map((option) => {
                    const isActive = selectedForTab === option.slug;
                    return (
                      <li key={option.id}>
                        <button
                          type="button"
                          onClick={() => selectOption(sheetTab, option.slug)}
                          className={cn(
                            "flex min-h-12 w-full items-center gap-3 rounded-[var(--ds-radius-lg)] px-3 py-3 text-left transition active:scale-[0.99]",
                            isActive
                              ? "bg-primary text-primary-foreground"
                              : "hover:bg-slate-50 active:bg-slate-100",
                            option.count === 0 && !isActive && "opacity-45",
                          )}
                        >
                          <span className="min-w-0 flex-1 text-sm font-medium">
                            {option.name}
                          </span>
                          <span
                            className={cn(
                              "rounded-full px-2 py-0.5 text-[11px] font-semibold tabular-nums",
                              isActive ? "bg-white/20" : "bg-slate-100 text-slate-600",
                            )}
                          >
                            {option.count}
                          </span>
                          {isActive && <Check className="h-4 w-4 shrink-0" />}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            <div className="flex gap-2 border-t border-border bg-white p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
              {activeCount > 0 && (
                <Button
                  type="button"
                  variant="secondary"
                  className="h-12 flex-1 rounded-[var(--ds-radius-lg)]"
                  onClick={clearAll}
                >
                  Temizle
                </Button>
              )}
              <Button
                type="button"
                variant="primary"
                className="h-12 flex-[1.4] rounded-[var(--ds-radius-lg)]"
                onClick={() => setSheetOpen(false)}
              >
                {resultCount} sonucu göster
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function DesktopTrigger({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex h-11 min-w-[140px] flex-1 items-center justify-between gap-2 rounded-[var(--ds-radius-lg)] border px-3.5 text-sm font-medium transition",
        active
          ? "border-blue-200 bg-primary-soft text-primary"
          : "border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:bg-primary-soft/50",
      )}
    >
      <span className="inline-flex min-w-0 items-center gap-2">
        <Icon className="h-4 w-4 shrink-0" />
        <span className="truncate">{label}</span>
      </span>
    </button>
  );
}
