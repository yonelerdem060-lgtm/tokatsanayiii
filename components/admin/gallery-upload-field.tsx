"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { MAX_SHOP_GALLERY_IMAGES } from "@/lib/shop-media";
import { ImagePlus, Loader2, Star, Trash2 } from "lucide-react";
import Image from "next/image";
import { ChangeEvent, useRef, useState } from "react";

interface GalleryUploadFieldProps {
  label?: string;
  cover: string | null;
  gallery: string[];
  onChange: (next: { cover: string | null; gallery: string[] }) => void;
  uploadUrl?: string;
  maxItems?: number;
}

export function GalleryUploadField({
  label = "Dükkân Fotoğrafları",
  cover,
  gallery,
  onChange,
  uploadUrl = "/api/upload/shops",
  maxItems = MAX_SHOP_GALLERY_IMAGES,
}: GalleryUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const images = gallery.length > 0 ? gallery : cover ? [cover] : [];
  const remaining = Math.max(0, maxItems - images.length);

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (files.length === 0) return;

    if (remaining <= 0) {
      setError(`En fazla ${maxItems} görsel ekleyebilirsiniz.`);
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const nextUrls = [...images];
      for (const file of files.slice(0, remaining)) {
        const formData = new FormData();
        formData.append("file", file);
        const response = await fetch(uploadUrl, { method: "POST", body: formData });
        const result = (await response.json()) as {
          success: boolean;
          data?: { url: string };
          error?: string;
        };
        if (!result.success || !result.data?.url) {
          throw new Error(result.error ?? "Görsel yüklenemedi.");
        }
        nextUrls.push(result.data.url);
      }

      onChange({
        cover: cover && nextUrls.includes(cover) ? cover : nextUrls[0] ?? null,
        gallery: nextUrls,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Görsel yüklenirken hata oluştu.");
    } finally {
      setUploading(false);
    }
  }

  function removeAt(index: number) {
    const next = images.filter((_, i) => i !== index);
    const nextCover =
      cover && next.includes(cover) ? cover : next[0] ?? null;
    onChange({ cover: nextCover, gallery: next });
  }

  function setAsCover(url: string) {
    const next = [url, ...images.filter((item) => item !== url)];
    onChange({ cover: url, gallery: next });
  }

  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <Label>{label}</Label>
          <p className="mt-1 text-xs text-muted-foreground">
            Görseller Cloudinary’ye yüklenir. JPG/PNG/WEBP/GIF, en fazla 5 MB.
            Birden fazla seçebilirsiniz (max {maxItems}).
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
          {images.length}/{maxItems}
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {images.map((url, index) => {
          const isCover = (cover ?? images[0]) === url;
          return (
            <div
              key={`${url}-${index}`}
              className="overflow-hidden rounded-xl border border-border bg-muted/20"
            >
              <div className="relative aspect-[4/3]">
                <Image src={url} alt="" fill unoptimized className="object-cover" sizes="200px" />
                {isCover && (
                  <span className="absolute left-2 top-2 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
                    Kapak
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-1 p-2">
                {!isCover && (
                  <Button type="button" size="sm" variant="outline" onClick={() => setAsCover(url)}>
                    <Star className="h-3.5 w-3.5" />
                    Kapak
                  </Button>
                )}
                <Button type="button" size="sm" variant="outline" onClick={() => removeAt(index)}>
                  <Trash2 className="h-3.5 w-3.5" />
                  Sil
                </Button>
              </div>
            </div>
          );
        })}

        {images.length < maxItems && (
          <button
            type="button"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            className="flex aspect-[4/3] flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-muted/20 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:bg-muted/40 disabled:opacity-60"
          >
            {uploading ? (
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            ) : (
              <ImagePlus className="h-6 w-6" />
            )}
            {uploading ? "Yükleniyor..." : "Görsel Ekle"}
            {!uploading && remaining > 0 && (
              <span className="text-xs">{remaining} hak kaldı</span>
            )}
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        multiple
        className="hidden"
        onChange={handleFileChange}
      />

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
