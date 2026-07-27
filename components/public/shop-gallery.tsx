"use client";

import { ImageIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ShopGalleryProps {
  name: string;
  images: string[];
}

export function ShopGallery({ name, images }: ShopGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = images[activeIndex] ?? null;

  if (images.length === 0) {
    return (
      <div className="relative aspect-[16/10] w-full bg-muted sm:aspect-[21/9]">
        <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
          <ImageIcon className="h-12 w-12 opacity-40" />
          <p className="text-sm">Henüz fotoğraf eklenmemiş</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="relative aspect-[16/10] w-full bg-muted sm:aspect-[21/9]">
        <Image
          src={active!}
          alt={name}
          fill
          unoptimized
          priority
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 1024px"
        />
        {images.length > 1 && (
          <span className="absolute bottom-3 right-3 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white">
            {activeIndex + 1}/{images.length}
          </span>
        )}
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2 border-b border-border p-3">
          {images.map((url, index) => (
            <button
              key={`${url}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`${name} fotoğraf ${index + 1}`}
              className={cn(
                "relative aspect-[4/3] overflow-hidden rounded-lg bg-muted ring-offset-2 transition",
                index === activeIndex
                  ? "ring-2 ring-primary"
                  : "opacity-80 hover:opacity-100",
              )}
            >
              <Image
                src={url}
                alt=""
                fill
                unoptimized
                loading="lazy"
                className="object-cover"
                sizes="120px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
