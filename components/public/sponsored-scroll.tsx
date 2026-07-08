"use client";

import { Reveal } from "@/components/public/motion";
import { SLIDER_AUTOPLAY_MS, type PromoSlide } from "@/lib/promo-slides";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Megaphone } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

interface SponsoredScrollProps {
  slides: PromoSlide[];
}

export function SponsoredScroll({ slides }: SponsoredScrollProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length);
    }, SLIDER_AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    const node = scrollerRef.current;
    if (!node) return;
    const card = node.children[active] as HTMLElement | undefined;
    card?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [active]);

  if (slides.length === 0) return null;

  function scrollBy(direction: -1 | 1) {
    const node = scrollerRef.current;
    if (!node) return;
    node.scrollBy({ left: direction * 320, behavior: "smooth" });
  }

  return (
    <section className="border-b border-border/70 py-8 sm:py-10" aria-label="Sponsorlu firmalar">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mb-5 flex items-end justify-between gap-4">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
              <Megaphone className="h-3.5 w-3.5" />
              Sponsorlu
            </div>
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">Öne çıkan kampanyalar</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Sanayi sitesinin aktif reklam ve duyuruları
            </p>
          </div>
          <div className="hidden gap-2 sm:flex">
            <button
              type="button"
              onClick={() => scrollBy(-1)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-[14px] border border-border bg-white text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              aria-label="Önceki"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollBy(1)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-[14px] border border-border bg-white text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              aria-label="Sonraki"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </Reveal>

        <div
          ref={scrollerRef}
          className="hide-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:-mx-0 sm:px-0"
        >
          {slides.map((slide, index) => (
            <article
              key={slide.id}
              className={cn(
                "relative min-w-[280px] max-w-[320px] shrink-0 snap-start overflow-hidden rounded-[20px] bg-gradient-to-br p-5 text-white shadow-lg transition duration-300 sm:min-w-[340px]",
                slide.gradient,
                index === active && "ring-2 ring-white/50 ring-offset-2 ring-offset-background",
              )}
            >
              {slide.image && (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={slide.image}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-950/80 via-slate-900/65 to-blue-950/40" />
                </>
              )}
              <div className="relative space-y-3">
                <span className="inline-flex rounded-full bg-white/20 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide backdrop-blur">
                  {slide.badge}
                </span>
                <div>
                  <p className={cn("text-sm", slide.image ? "text-white/75" : slide.accent)}>
                    {slide.subtitle}
                  </p>
                  <h3 className="mt-1 text-xl font-semibold tracking-tight">{slide.title}</h3>
                </div>
                <p className="line-clamp-2 text-sm text-white/85">{slide.description}</p>
                <Link
                  href={slide.ctaHref}
                  className="inline-flex items-center gap-1.5 rounded-[14px] bg-white px-3.5 py-2 text-sm font-semibold text-slate-900 transition hover:scale-[1.02]"
                >
                  {slide.ctaText}
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
