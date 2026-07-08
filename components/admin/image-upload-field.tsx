"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImagePlus, Loader2, Trash2 } from "lucide-react";
import Image from "next/image";
import { ChangeEvent, useRef, useState } from "react";

interface ImageUploadFieldProps {
  label?: string;
  value: string | null;
  onChange: (url: string | null) => void;
  uploadUrl?: string;
  helpText?: string;
}

export function ImageUploadField({
  label = "Kapak Görseli",
  value,
  onChange,
  uploadUrl = "/api/upload/news",
  helpText = "JPG, PNG, WEBP veya GIF. En fazla 5 MB.",
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
      });
      const result = (await response.json()) as {
        success: boolean;
        data?: { url: string };
        error?: string;
      };

      if (!result.success || !result.data?.url) {
        setError(result.error ?? "Görsel yüklenemedi.");
        return;
      }

      onChange(result.data.url);
    } catch {
      setError("Görsel yüklenirken bir hata oluştu.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-3">
      <div>
        <Label>{label}</Label>
        <p className="mt-1 text-xs text-muted-foreground">{helpText}</p>
      </div>

      {value ? (
        <div className="overflow-hidden rounded-xl border border-border bg-muted/30">
          <div className="relative aspect-[16/9] w-full">
            <Image
              src={value}
              alt="Kapak görseli önizleme"
              fill
              unoptimized
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 640px"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2 border-t border-border p-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={uploading}
              onClick={() => inputRef.current?.click()}
            >
              {uploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ImagePlus className="h-4 w-4" />
              )}
              Değiştir
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={uploading}
              onClick={() => onChange(null)}
            >
              <Trash2 className="h-4 w-4" />
              Kaldır
            </Button>
            <p className="truncate text-xs text-muted-foreground">{value}</p>
          </div>
        </div>
      ) : (
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-muted/20 px-4 py-10 text-center transition-colors hover:border-primary/40 hover:bg-muted/40 disabled:opacity-60"
        >
          {uploading ? (
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          ) : (
            <ImagePlus className="h-8 w-8 text-muted-foreground" />
          )}
          <span className="text-sm font-medium">
            {uploading ? "Yükleniyor..." : "Görsel seç veya sürükle"}
          </span>
          <span className="text-xs text-muted-foreground">Dosya seçmek için tıklayın</span>
        </button>
      )}

      <Input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleFileChange}
      />

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
