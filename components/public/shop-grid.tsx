"use client";

import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/ui/pagination";
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
}

function toWhatsAppLink(value: string) {
  const digits = value.replace(/\D/g, "");
  if (!digits) return null;
  return `https://wa.me/${digits}`;
}

export function ShopCard({ shop, featured }: ShopCardProps) {
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
        <div className="relative aspect-[16/9] bg-muted sm:aspect-[16/10]">
          {shop.image ? (
            <Image
              src={shop.image}
              alt={shop.name}
              fill
              unoptimized
              className="object-cover transition duration-500 group-hover:scale-[1.03]"
              sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100 text-slate-400">
              <ImageIcon className="h-8 w-8 opacity-40" />
            </div>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
        <Link href={`/dukkan/${shop.slug}`} className="group block space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-base font-semibold tracking-tight text-slate-900 transition group-hover:text-blue-700 sm:text-lg">
              {shop.name}
            </h3>
            <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-blue-600" />
          </div>

          {shop.description && (
            <p className="line-clamp-2 text-sm text-muted-foreground">{shop.description}</p>
          )}

          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
            <span className="line-clamp-2">{shop.address}</span>
          </div>
        </Link>

        <div className="mt-auto flex gap-2 pt-1">
          <a
            href={phoneHref}
            onClick={(event) => event.stopPropagation()}
            className="inline-flex h-11 min-h-11 flex-1 items-center justify-center gap-2 rounded-[14px] bg-blue-600 px-3 text-sm font-semibold text-white shadow-sm shadow-blue-600/25 transition active:scale-[0.98] hover:bg-blue-700"
          >
            <Phone className="h-4 w-4" />
            Ara
          </a>
          {whatsappHref ? (
            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              onClick={(event) => event.stopPropagation()}
              className="inline-flex h-11 min-h-11 flex-1 items-center justify-center gap-2 rounded-[14px] border border-emerald-200 bg-emerald-50 px-3 text-sm font-semibold text-emerald-800 transition active:scale-[0.98] hover:bg-emerald-100"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </a>
          ) : (
            <Link
              href={`/dukkan/${shop.slug}`}
              className="inline-flex h-11 min-h-11 flex-1 items-center justify-center gap-1 rounded-[14px] border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
            >
              Detay
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {shop.categories.slice(0, 2).map((category) => (
            <Badge key={category.id} className="rounded-full bg-blue-50 text-blue-700">
              {category.name}
            </Badge>
          ))}
          {shop.brands.slice(0, 1).map((brand) => (
            <Badge key={brand.id} className="rounded-full bg-slate-100 text-slate-700">
              {brand.name}
            </Badge>
          ))}
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
    <div id="rehber" className="scroll-mt-40 pb-4">
      {shops.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-[20px] border border-dashed border-border bg-white/80 px-4 py-14 text-center">
          <p className="text-lg font-semibold">Sonuç bulunamadı</p>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            {hasActiveQuery
              ? "Seçtiğiniz filtre veya aramaya uygun dükkan yok. Filtreleri değiştirmeyi deneyin."
              : "Henüz kayıtlı dükkan bulunmuyor."}
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
            {shops.map((shop) => (
              <ShopCard key={shop.id} shop={shop} />
            ))}
          </div>
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
