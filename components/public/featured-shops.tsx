"use client";

import { Reveal, Stagger, StaggerItem } from "@/components/public/motion";
import type { ShopCardData } from "@/components/public/shop-grid";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  ImageIcon,
  MapPin,
  Phone,
  Star,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface FeaturedShopsProps {
  shops: ShopCardData[];
}

export function FeaturedShops({ shops }: FeaturedShopsProps) {
  if (shops.length === 0) return null;

  return (
    <section id="firmalar" className="border-b border-border/70 py-10 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mb-6 flex items-end justify-between gap-4">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              Öne Çıkan
            </div>
            <h2 className="text-2xl font-semibold tracking-tight">Öne çıkan firmalar</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Güvenilir esnaf ve işletmeler — hızlı iletişim
            </p>
          </div>
          <Link
            href="/#rehber"
            className="hidden items-center gap-1 text-sm font-medium text-primary transition hover:brightness-90 sm:inline-flex"
          >
            Tümünü gör
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>

        <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shops.map((shop) => (
            <StaggerItem key={shop.id}>
              <article className="card-surface group flex h-full flex-col overflow-hidden">
                <div className="relative aspect-[16/10] bg-muted">
                  {shop.image ? (
                    <Image
                      src={shop.image}
                      alt={shop.name}
                      fill
                      unoptimized
                      loading="lazy"
                      className="object-cover transition duration-500 group-hover:scale-[1.03]"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary-soft to-slate-100 text-slate-400">
                      <ImageIcon className="h-8 w-8 opacity-50" />
                    </div>
                  )}
                  <div className="absolute left-3 top-3 flex gap-2">
                    <Badge className="rounded-full bg-amber-100/95 text-amber-800 backdrop-blur">
                      Öne Çıkan
                    </Badge>
                    {shop.categories[0] && (
                      <Badge className="rounded-full bg-white/90 text-slate-700 backdrop-blur">
                        {shop.categories[0].name}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex flex-1 flex-col gap-4 p-5">
                  <div className="flex items-start gap-3">
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-[var(--ds-radius-lg)] border border-border bg-muted">
                      {shop.image ? (
                        <Image
                          src={shop.image}
                          alt=""
                          fill
                          unoptimized
                          loading="lazy"
                          className="object-cover"
                          sizes="48px"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs font-bold text-primary">
                          {shop.name.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-lg font-semibold tracking-tight text-slate-900">
                        {shop.name}
                      </h3>
                      <div className="mt-1 flex items-center gap-1 text-xs text-amber-600">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        <span className="font-semibold">4.8</span>
                        <span className="text-muted-foreground">· Öne çıkan profil</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p className="flex items-start gap-2">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span className="line-clamp-2">{shop.address}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone className="h-4 w-4 shrink-0 text-primary" />
                      {shop.phone}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {shop.brands.slice(0, 3).map((brand) => (
                      <Badge key={brand.id} className="rounded-full bg-slate-100 text-slate-700">
                        {brand.name}
                      </Badge>
                    ))}
                  </div>

                  <div className="mt-auto flex gap-2 pt-1">
                    <Link href={`/dukkan/${shop.slug}`} className="flex-1">
                      <Button variant="primary" className="w-full transition hover:-translate-y-0.5">
                        Detayı Gör
                      </Button>
                    </Link>
                    <a href={`tel:${shop.phone.replace(/\s/g, "")}`}>
                      <Button
                        variant="secondary"
                        className="transition hover:-translate-y-0.5"
                        aria-label={`${shop.name} ara`}
                      >
                        <Phone className="h-4 w-4" />
                      </Button>
                    </a>
                  </div>
                </div>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
