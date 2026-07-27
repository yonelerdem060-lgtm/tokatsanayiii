"use client";

import { Badge } from "@/components/ui/badge";
import { FavoriteButton } from "@/components/public/favorite-button";
import { Pagination } from "@/components/ui/pagination";
import { Stagger, StaggerItem } from "@/components/public/motion";
import { trackShopClick } from "@/components/public/shop-view-tracker";
import { cn } from "@/lib/utils";
import { ArrowUpRight, ImageIcon, MapPin, MessageCircle, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

export interface ShopCardData {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  address: string;
  phone: string;
  whatsapp?: string | null;
  image: string | null;
  categories: { id: string; name: string; slug: string }[];
  vehicleTypes: { id: string; name: string; slug: string }[];
  brands: { id: string; name: string; slug: string }[];
}

interface ShopCardProps {
  shop: ShopCardData;
  featured?: boolean;
  priority?: boolean;
}

function toWhatsAppLink(value: string) {
  const digits = value.replace(/\D/g, "");
  if (!digits) return null;
  return `https://wa.me/${digits}`;
}

export function ShopCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-[var(--ds-radius-xl)] border border-border bg-white shadow-[var(--ds-shadow-card)]">
      <div className="skeleton aspect-[16/10] rounded-none" />
      <div className="space-y-3 p-4 sm:p-5">
        <div className="skeleton h-5 w-3/4" />
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-4 w-2/3" />
        <div className="flex gap-2 pt-2">
          <div className="skeleton h-11 flex-1" />
          <div className="skeleton h-11 flex-1" />
        </div>
        <div className="flex gap-2">
          <div className="skeleton h-6 w-16 rounded-full" />
          <div className="skeleton h-6 w-14 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function ShopGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <ShopCardSkeleton key={index} />
      ))}
    </div>
  );
}

export function ShopCard({ shop, featured, priority }: ShopCardProps) {
  const phoneHref = `tel:${shop.phone.replace(/\s/g, "")}`;
  const whatsappHref = shop.whatsapp ? toWhatsAppLink(shop.whatsapp) : null;

  return (
    <article
      className={cn(
        "card-surface flex h-full flex-col overflow-hidden",
        featured && "ring-1 ring-amber-200",
      )}
    >
      <Link href={`/dukkan/${shop.slug}`} className="group block">
        <div className="relative aspect-[16/10] overflow-hidden bg-muted">
          {shop.image ? (
            <Image
              src={shop.image}
              alt={shop.name}
              fill
              unoptimized
              priority={priority}
              loading={priority ? "eager" : "lazy"}
              className="object-cover transition duration-500 group-hover:scale-[1.04]"
              sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary-soft to-slate-100 text-slate-400">
              <ImageIcon className="h-8 w-8 opacity-40" />
            </div>
          )}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/35 to-transparent opacity-0 transition group-hover:opacity-100" />
          <div className="absolute right-3 top-3 z-10">
            <FavoriteButton
              shop={{
                id: shop.id,
                name: shop.name,
                slug: shop.slug,
                image: shop.image,
                phone: shop.phone,
              }}
              size="sm"
            />
          </div>
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
        <Link href={`/dukkan/${shop.slug}`} className="group block space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-[1.05rem] font-semibold tracking-tight text-slate-900 transition group-hover:text-primary sm:text-lg">
              {shop.name}
            </h3>
            <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
          </div>

          {shop.description && (
            <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
              {shop.description}
            </p>
          )}

          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span className="line-clamp-2">{shop.address}</span>
          </div>
        </Link>

        <div className="flex flex-wrap gap-1.5">
          {shop.categories.slice(0, 2).map((category) => (
            <Badge key={category.id} className="rounded-full bg-primary-soft text-primary">
              {category.name}
            </Badge>
          ))}
          {shop.brands.slice(0, 1).map((brand) => (
            <Badge key={brand.id} className="rounded-full bg-slate-100 text-slate-700">
              {brand.name}
            </Badge>
          ))}
        </div>

        <div className="mt-auto flex gap-2 pt-1">
          <a
            href={phoneHref}
            onClick={(event) => {
              event.stopPropagation();
              trackShopClick(shop.id, "phone");
            }}
            className="inline-flex h-12 min-h-12 flex-1 items-center justify-center gap-2 rounded-[var(--ds-radius-lg)] bg-primary px-3 text-sm font-semibold text-primary-foreground shadow-sm transition active:scale-[0.98] hover:brightness-110"
          >
            <Phone className="h-4 w-4" />
            Ara
          </a>
          {whatsappHref ? (
            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              onClick={(event) => {
                event.stopPropagation();
                trackShopClick(shop.id, "whatsapp");
              }}
              className="inline-flex h-12 min-h-12 flex-1 items-center justify-center gap-2 rounded-[var(--ds-radius-lg)] border border-emerald-200 bg-success-soft px-3 text-sm font-semibold text-emerald-800 transition active:scale-[0.98] hover:bg-emerald-100"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </a>
          ) : (
            <Link
              href={`/dukkan/${shop.slug}`}
              className="inline-flex h-12 min-h-12 flex-1 items-center justify-center gap-1 rounded-[var(--ds-radius-lg)] border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-primary-soft hover:text-primary"
            >
              Detay
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}

interface ShopGridProps {
  shops: ShopCardData[];
  hasFilters: boolean;
  total?: number;
  page?: number;
  totalPages?: number;
  searchQuery?: string;
}

export function ShopGrid({
  shops,
  hasFilters,
  total,
  page = 1,
  totalPages = 1,
  searchQuery,
}: ShopGridProps) {
  const resultCount = total ?? shops.length;
  const hasActiveQuery = !!(hasFilters || searchQuery);

  return (
    <div id="rehber-grid" className="scroll-mt-40 pb-4">
      {shops.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-[var(--ds-radius-xl)] border border-dashed border-border bg-white/80 px-4 py-14 text-center">
          <p className="text-lg font-semibold">Sonuç bulunamadı</p>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            {hasActiveQuery
              ? "Seçtiğiniz filtre veya aramaya uygun dükkan yok. Filtreleri değiştirmeyi deneyin."
              : "Henüz kayıtlı dükkan bulunmuyor."}
          </p>
        </div>
      ) : (
        <>
          <Stagger className="grid gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
            {shops.map((shop, index) => (
              <StaggerItem key={shop.id}>
                <ShopCard shop={shop} priority={index < 3} />
              </StaggerItem>
            ))}
          </Stagger>
          <Suspense fallback={null}>
            <Pagination
              className="mt-8"
              page={page}
              totalPages={totalPages}
              total={resultCount}
              hash="rehber"
            />
          </Suspense>
        </>
      )}
    </div>
  );
}
