"use client";

import { FavoriteButton } from "@/components/public/favorite-button";
import { useFavorites } from "@/hooks/use-favorites";
import { Button } from "@/components/ui/button";
import { Heart, ImageIcon, Phone, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { removeFavorite } from "@/lib/favorites";

export function FavoritesPageClient() {
  const { favorites, count } = useFavorites();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700">
          <Heart className="h-3.5 w-3.5 fill-rose-500 text-rose-500" />
          Favorilerim
        </div>
        <h1 className="text-title">Kayıtlı firmalar</h1>
        <p className="mt-1 text-body">
          {count > 0
            ? `${count} firma bu cihazda kayıtlı. Veriler yalnızca tarayıcınızda saklanır.`
            : "Henüz favori firma eklemediniz. Kartlardaki kalp ikonuna dokunarak ekleyebilirsiniz."}
        </p>
      </div>

      {favorites.length === 0 ? (
        <div className="rounded-[var(--ds-radius-xl)] border border-dashed border-border bg-white/80 px-4 py-14 text-center">
          <Heart className="mx-auto h-10 w-10 text-slate-300" />
          <p className="mt-3 font-semibold text-slate-800">Favori listeniz boş</p>
          <Link href="/#rehber" className="mt-4 inline-block">
            <Button variant="primary">Firmalara göz at</Button>
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {favorites.map((shop) => (
            <li
              key={shop.id}
              className="flex items-center gap-3 rounded-[var(--ds-radius-lg)] border border-border bg-white p-3 shadow-[var(--ds-shadow-soft)]"
            >
              <Link
                href={`/dukkan/${shop.slug}`}
                className="relative h-16 w-16 shrink-0 overflow-hidden rounded-[var(--ds-radius-md)] bg-muted"
              >
                {shop.image ? (
                  <Image
                    src={shop.image}
                    alt=""
                    fill
                    unoptimized
                    loading="lazy"
                    className="object-cover"
                    sizes="64px"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-slate-400">
                    <ImageIcon className="h-5 w-5 opacity-50" />
                  </div>
                )}
              </Link>

              <div className="min-w-0 flex-1">
                <Link
                  href={`/dukkan/${shop.slug}`}
                  className="block truncate font-semibold text-slate-900 hover:text-primary"
                >
                  {shop.name}
                </Link>
                {shop.phone && (
                  <p className="mt-0.5 truncate text-sm text-muted-foreground">{shop.phone}</p>
                )}
              </div>

              <div className="flex shrink-0 items-center gap-1.5">
                {shop.phone && (
                  <a href={`tel:${shop.phone.replace(/\s/g, "")}`}>
                    <Button variant="secondary" size="sm" aria-label="Ara">
                      <Phone className="h-4 w-4" />
                    </Button>
                  </a>
                )}
                <FavoriteButton shop={shop} size="sm" />
                <button
                  type="button"
                  aria-label="Favorilerden sil"
                  onClick={() => removeFavorite(shop.id)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-slate-400 transition hover:border-red-200 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
