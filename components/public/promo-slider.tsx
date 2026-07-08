"use client";

import { SLIDER_AUTOPLAY_MS, type PromoSlide } from "@/lib/promo-slides";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Megaphone, Pause, Play } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

interface PromoSliderProps {
  slides: PromoSlide[];
}

export function PromoSlider({ slides }: PromoSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const slideCount = slides.length;

  const goTo = useCallback(
    (index: number) => {
      if (slideCount === 0) return;
      setIsTransitioning(true);
      setActiveIndex((index + slideCount) % slideCount);
      setTimeout(() => setIsTransitioning(false), 400);
    },
    [slideCount],
  );

  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);
  const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);

  useEffect(() => {
    if (activeIndex >= slideCount && slideCount > 0) {
      setActiveIndex(0);
    }
  }, [activeIndex, slideCount]);

  useEffect(() => {
    if (isPaused || slideCount <= 1) return;
    const timer = setInterval(goNext, SLIDER_AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [isPaused, goNext, slideCount]);

  if (slideCount === 0) {
    return null;
  }

  return (
    <section
      className="relative overflow-hidden border-b border-border bg-card"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Reklam ve duyuru slider"
    >
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl shadow-lg">
          <div className="relative min-h-[200px] sm:min-h-[220px]">
            {slides.map((item, index) => (
              <SlidePanel
                key={item.id}
                slide={item}
                index={index}
                total={slideCount}
                isActive={index === activeIndex}
                isTransitioning={isTransitioning}
              />
            ))}
          </div>

          <div className="pointer-events-none absolute inset-0 flex items-end justify-between p-4 sm:p-5">
            <div className="pointer-events-auto flex items-center gap-2">
              <div className="flex gap-1.5 rounded-full bg-black/25 px-3 py-2 backdrop-blur-sm">
                {slides.map((item, index) => (
                  <button
                    key={item.id}
                    type="button"
                    aria-label={`Slide ${index + 1}`}
                    onClick={() => goTo(index)}
                    className={cn(
                      "h-2 rounded-full transition-all",
                      index === activeIndex
                        ? "w-6 bg-white"
                        : "w-2 bg-white/50 hover:bg-white/80",
                    )}
                  />
                ))}
              </div>

              {slideCount > 1 && (
                <button
                  type="button"
                  onClick={() => setIsPaused((value) => !value)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-black/25 text-white backdrop-blur-sm transition-colors hover:bg-black/40"
                  aria-label={isPaused ? "Otomatik geçişi başlat" : "Otomatik geçişi durdur"}
                >
                  {isPaused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
                </button>
              )}
            </div>

            {slideCount > 1 && (
              <div className="pointer-events-auto hidden gap-2 sm:flex">
                <button
                  type="button"
                  onClick={goPrev}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-black/25 text-white backdrop-blur-sm transition-colors hover:bg-black/40"
                  aria-label="Önceki slide"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-black/25 text-white backdrop-blur-sm transition-colors hover:bg-black/40"
                  aria-label="Sonraki slide"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>

          {!isPaused && slideCount > 1 && (
            <div className="absolute bottom-0 left-0 h-1 w-full bg-black/20">
              <div
                key={`${activeIndex}-${isPaused}`}
                className="h-full bg-white/70"
                style={{
                  animation: `slider-progress ${SLIDER_AUTOPLAY_MS}ms linear forwards`,
                }}
              />
            </div>
          )}
        </div>

        {slideCount > 1 && (
          <div
            className={cn(
              "mt-3 grid gap-2 sm:gap-3",
              slideCount === 2 ? "grid-cols-2" : "grid-cols-3",
            )}
          >
            {slides.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => goTo(index)}
                className={cn(
                  "group relative overflow-hidden rounded-xl border-2 p-3 text-left transition-all sm:p-4",
                  index === activeIndex
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-transparent bg-muted/60 hover:border-border hover:bg-muted",
                )}
              >
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground sm:text-xs">
                  {item.badge}
                </span>
                <p className="mt-0.5 truncate text-xs font-semibold sm:text-sm">{item.title}</p>
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function SlidePanel({
  slide,
  index,
  total,
  isActive,
  isTransitioning,
}: {
  slide: PromoSlide;
  index: number;
  total: number;
  isActive: boolean;
  isTransitioning: boolean;
}) {
  return (
    <div
      className={cn(
        "absolute inset-0 overflow-hidden bg-gradient-to-br px-6 py-8 text-white transition-all duration-500 sm:px-10 sm:py-10",
        slide.gradient,
        isActive
          ? "translate-x-0 opacity-100"
          : "pointer-events-none translate-x-4 opacity-0",
        isTransitioning && !isActive && "-translate-x-4",
      )}
      aria-hidden={!isActive}
    >
      {slide.image && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={slide.image}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/30" />
        </>
      )}

      <div className="pointer-events-none absolute -right-8 -top-8 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-12 -left-12 h-56 w-56 rounded-full bg-black/10 blur-3xl" />

      <div className="relative flex h-full flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="max-w-xl space-y-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
              <Megaphone className="h-3 w-3" />
              {slide.badge}
            </span>
            <span className={cn("text-xs font-medium", slide.image ? "text-white/70" : slide.accent)}>
              {index + 1} / {total}
            </span>
          </div>

          <div>
            <p className={cn("text-sm font-medium sm:text-base", slide.image ? "text-white/80" : slide.accent)}>
              {slide.subtitle}
            </p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">{slide.title}</h2>
          </div>

          <p className="max-w-md text-sm leading-relaxed text-white/85 sm:text-base">
            {slide.description}
          </p>
        </div>

        <div className="shrink-0">
          <Link
            href={slide.ctaHref}
            className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 shadow-md transition-transform hover:scale-105 hover:shadow-lg"
          >
            {slide.ctaText}
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
