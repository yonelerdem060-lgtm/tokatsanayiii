"use client";

import { SLIDER_AUTOPLAY_MS, type PromoSlide } from "@/lib/promo-slides";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, ImageIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

interface CategoryStat {
  id: string;
  name: string;
  slug: string;
  count: number;
}

interface HomeHeroProps {
  categories: CategoryStat[];
  slides: PromoSlide[];
}

/** Banner source size: 1920 × 860 */
const SLIDE_FRAME = "aspect-[1920/860]";

export function HomeHero({ categories, slides }: HomeHeroProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category");
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const slideCount = slides.length;

  const goTo = useCallback(
    (index: number) => {
      if (slideCount === 0) return;
      setActiveIndex((index + slideCount) % slideCount);
    },
    [slideCount],
  );

  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);
  const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);

  useEffect(() => {
    if (paused || slideCount <= 1) return;
    const timer = setInterval(goNext, SLIDER_AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [paused, goNext, slideCount]);

  const selectCategory = useCallback(
    (slug: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (activeCategory === slug) {
        params.delete("category");
      } else {
        params.set("category", slug);
      }
      params.delete("page");
      const query = params.toString();
      router.push(query ? `/?${query}` : "/", { scroll: false });

      // Sonuçların göründüğü rehber bölümüne in
      window.setTimeout(() => {
        document.getElementById("rehber")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 80);
    },
    [activeCategory, router, searchParams],
  );

  const sortedCategories = [...categories].sort((a, b) =>
    a.name.localeCompare(b.name, "tr"),
  );

  return (
    <section className="border-b border-border bg-surface py-3 sm:py-5">
      <div className="mx-auto grid max-w-[92rem] items-start gap-3 px-3 sm:gap-4 sm:px-5 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-5 lg:px-6 xl:grid-cols-[240px_minmax(0,1fr)] xl:px-8">
        {/* Masaüstü: dikey kategori listesi */}
        <aside className="order-2 hidden overflow-hidden rounded-[var(--ds-radius-md)] border border-border bg-white shadow-[var(--ds-shadow-soft)] lg:order-1 lg:block">
          <div className="relative flex items-center justify-between border-b border-border bg-white px-4 py-3">
            <h2 className="text-caption tracking-[0.14em]">Kategori Ara</h2>
            <span className="absolute right-0 top-0 h-full w-1 bg-primary" aria-hidden />
          </div>
          <div className="max-h-[440px] overflow-y-auto overscroll-contain">
            {sortedCategories.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-muted-foreground">
                Henüz kategori yok
              </p>
            ) : (
              <ul>
                {sortedCategories.map((category) => {
                  const isActive = activeCategory === category.slug;
                  return (
                    <li key={category.id}>
                      <button
                        type="button"
                        onClick={() => selectCategory(category.slug)}
                        className={cn(
                          "flex w-full items-center gap-2 border-b border-border/60 px-3 py-2.5 text-left text-sm transition",
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "bg-white text-slate-700 hover:bg-primary-soft",
                        )}
                      >
                        <ChevronRight
                          className={cn(
                            "h-3.5 w-3.5 shrink-0 transition",
                            isActive ? "text-white/80" : "text-slate-400",
                          )}
                        />
                        <span className="min-w-0 flex-1 truncate font-medium uppercase tracking-wide">
                          {category.name}
                        </span>
                        <span
                          className={cn(
                            "rounded-full px-1.5 py-0.5 tabular-nums text-[11px] font-semibold",
                            isActive ? "bg-white/20 text-white" : "bg-muted text-slate-500",
                          )}
                        >
                          {category.count}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </aside>

        {/* Sağ (masaüstü) / Üst (mobil): Carousel — 1920×860 oranı */}
        <div className="order-1 min-w-0 space-y-3 lg:order-2">
          <div
            className={cn(
              "relative w-full overflow-hidden rounded-[var(--ds-radius-md)] border border-border bg-slate-900 shadow-[var(--ds-shadow-soft)]",
              SLIDE_FRAME,
            )}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
          {slideCount === 0 ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-slate-400">
              <ImageIcon className="h-10 w-10 opacity-40" />
              <p className="text-sm">Henüz slider eklenmemiş</p>
              <p className="text-xs text-muted-foreground">
                Yönetim panelinden reklam / duyuru ekleyebilirsiniz
              </p>
            </div>
          ) : (
            <>
              {slides.map((slide, index) => {
                const isActive = index === activeIndex;
                const content = (
                  <>
                    {slide.image ? (
                      <Image
                        src={slide.image}
                        alt={slide.title}
                        fill
                        unoptimized
                        priority={index === 0}
                        loading={index === 0 ? "eager" : "lazy"}
                        className="object-cover object-center"
                        sizes="(max-width: 1024px) 100vw, min(100vw, 92rem)"
                      />
                    ) : (
                      <div
                        className={cn(
                          "absolute inset-0 bg-gradient-to-br",
                          slide.gradient || "from-blue-700 via-blue-600 to-indigo-700",
                        )}
                      />
                    )}
                    {!slide.image && (
                      <>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
                        <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6">
                          {slide.subtitle && (
                            <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/70">
                              {slide.subtitle}
                            </p>
                          )}
                          <p className="line-clamp-2 text-base font-semibold leading-snug text-white sm:text-lg">
                            {slide.title}
                          </p>
                          {slide.description && (
                            <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-white/85">
                              {slide.description}
                            </p>
                          )}
                        </div>
                      </>
                    )}
                  </>
                );

                return (
                  <div
                    key={slide.id}
                    className={cn(
                      "absolute inset-0 transition-opacity duration-500",
                      isActive ? "z-10 opacity-100" : "z-0 opacity-0",
                    )}
                    aria-hidden={!isActive}
                  >
                    {slide.ctaHref ? (
                      <Link href={slide.ctaHref} className="relative block h-full w-full">
                        {content}
                      </Link>
                    ) : (
                      <div className="relative h-full w-full">{content}</div>
                    )}
                  </div>
                );
              })}

              {slideCount > 1 && (
                <>
                  <button
                    type="button"
                    onClick={goPrev}
                    className="absolute left-2 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur-sm transition hover:bg-black/55 sm:left-3 sm:h-10 sm:w-10"
                    aria-label="Önceki slayt"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={goNext}
                    className="absolute right-2 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur-sm transition hover:bg-black/55 sm:right-3 sm:h-10 sm:w-10"
                    aria-label="Sonraki slayt"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                  <div className="absolute bottom-3 right-3 z-20 flex gap-1.5 sm:bottom-4 sm:right-4">
                    {slides.map((slide, index) => (
                      <button
                        key={slide.id}
                        type="button"
                        aria-label={`Slayt ${index + 1}`}
                        onClick={() => goTo(index)}
                        className={cn(
                          "h-2 rounded-full transition-all",
                          index === activeIndex ? "w-5 bg-white" : "w-2 bg-white/50 hover:bg-white/80",
                        )}
                      />
                    ))}
                  </div>
                  {!paused && (
                    <div className="absolute bottom-0 left-0 z-20 h-0.5 w-full bg-white/20">
                      <div
                        key={activeIndex}
                        className="h-full bg-white/80"
                        style={{ animation: `slider-progress ${SLIDER_AUTOPLAY_MS}ms linear` }}
                      />
                    </div>
                  )}
                </>
              )}
            </>
          )}
          </div>

          {/* Mobil: yatay kaydırmalı kategoriler */}
          {sortedCategories.length > 0 && (
            <div className="lg:hidden">
              <p className="mb-2 px-0.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Kategoriler
              </p>
              <div className="hide-scrollbar -mx-3 flex gap-2 overflow-x-auto px-3 pb-1">
                {sortedCategories.map((category) => {
                  const isActive = activeCategory === category.slug;
                  return (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => selectCategory(category.slug)}
                      className={cn(
                        "shrink-0 rounded-full border px-3.5 py-2 text-sm font-semibold transition active:scale-[0.98]",
                        isActive
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-white text-slate-700",
                      )}
                    >
                      {category.name}
                      <span
                        className={cn(
                          "ml-1.5 tabular-nums text-[11px]",
                          isActive ? "text-white/80" : "text-slate-400",
                        )}
                      >
                        {category.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
