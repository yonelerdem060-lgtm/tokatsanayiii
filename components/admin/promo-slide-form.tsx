"use client";

import {
  createPromoSlideFromInput,
  updatePromoSlideFromInput,
} from "@/actions/promo-slides";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  BADGE_OPTIONS,
  GRADIENT_PRESETS,
  type PromoSlide,
} from "@/lib/promo-slides";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export interface PromoSlideFormValues {
  id?: string;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  ctaText: string;
  ctaHref: string;
  image?: string | null;
  gradient: string;
  accent: string;
  sortOrder: number;
  isActive: boolean;
}

interface PromoSlideFormProps {
  initialValues?: PromoSlideFormValues;
}

export function PromoSlideForm({ initialValues }: PromoSlideFormProps) {
  const router = useRouter();
  const isEditing = !!initialValues?.id;

  const defaultPreset = GRADIENT_PRESETS[0];

  const [badge, setBadge] = useState(initialValues?.badge ?? "Reklam");
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [subtitle, setSubtitle] = useState(initialValues?.subtitle ?? "");
  const [description, setDescription] = useState(initialValues?.description ?? "");
  const [ctaText, setCtaText] = useState(initialValues?.ctaText ?? "");
  const [ctaHref, setCtaHref] = useState(initialValues?.ctaHref ?? "");
  const [image, setImage] = useState<string | null>(initialValues?.image ?? null);
  const [gradient, setGradient] = useState(initialValues?.gradient ?? defaultPreset.gradient);
  const [accent, setAccent] = useState(initialValues?.accent ?? defaultPreset.accent);
  const [sortOrder, setSortOrder] = useState(initialValues?.sortOrder ?? 0);
  const [isActive, setIsActive] = useState(initialValues?.isActive ?? true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function handlePresetSelect(presetGradient: string, presetAccent: string) {
    setGradient(presetGradient);
    setAccent(presetAccent);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      badge,
      title,
      subtitle,
      description,
      ctaText,
      ctaHref,
      image,
      gradient,
      accent,
      sortOrder,
      isActive,
    };

    const result = isEditing
      ? await updatePromoSlideFromInput(initialValues!.id!, payload)
      : await createPromoSlideFromInput(payload);

    setLoading(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    router.push("/admin/promo-slides");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="badge">Rozet Tipi *</Label>
          <select
            id="badge"
            value={badge}
            onChange={(event) => setBadge(event.target.value)}
            className="flex h-10 w-full rounded-lg border border-border bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
          >
            {BADGE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="sortOrder">Sıra</Label>
          <Input
            id="sortOrder"
            type="number"
            min={0}
            value={sortOrder}
            onChange={(event) => setSortOrder(Number(event.target.value))}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Başlık *</Label>
        <Input
          id="title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required
          placeholder="Örn: Yılmaz Motor — %20 İndirim"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="subtitle">Alt Başlık *</Label>
        <Input
          id="subtitle"
          value={subtitle}
          onChange={(event) => setSubtitle(event.target.value)}
          required
          placeholder="Örn: Motor bakım kampanyası"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Açıklama *</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          required
          placeholder="Reklam açıklama metni..."
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="ctaText">Buton Metni *</Label>
          <Input
            id="ctaText"
            value={ctaText}
            onChange={(event) => setCtaText(event.target.value)}
            required
            placeholder="Örn: Dükkanı Gör"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ctaHref">Buton Linki *</Label>
          <Input
            id="ctaHref"
            value={ctaHref}
            onChange={(event) => setCtaHref(event.target.value)}
            required
            placeholder="/dukkan/ornek-firma veya tel:03561234567"
          />
        </div>
      </div>

      <ImageUploadField
        label="Arka Plan Görseli"
        value={image}
        onChange={setImage}
        uploadUrl="/api/upload/promo"
        helpText="Opsiyonel. Varsa gradient yerine görsel kullanılır. JPG, PNG, WEBP veya GIF."
      />

      <div className="space-y-3">
        <Label>Renk Teması *</Label>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {GRADIENT_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => handlePresetSelect(preset.gradient, preset.accent)}
              className={cn(
                "overflow-hidden rounded-xl border-2 text-left transition-all",
                gradient === preset.gradient
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-border hover:border-primary/40",
              )}
            >
              <div className={cn("h-16 bg-gradient-to-br px-3 py-2", preset.gradient)}>
                <span className="text-xs font-semibold text-white">{preset.label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <label className="flex items-center gap-3 rounded-lg border border-border p-4">
        <input
          type="checkbox"
          checked={isActive}
          onChange={(event) => setIsActive(event.target.checked)}
          className="h-4 w-4 rounded accent-primary"
        />
        <div>
          <p className="text-sm font-medium">Aktif (slider&apos;da göster)</p>
          <p className="text-xs text-muted-foreground">
            Kapalı slide ana sayfada görünmez.
          </p>
        </div>
      </label>

      <div className="space-y-2">
        <Label>Önizleme</Label>
        <div
          className={cn(
            "relative overflow-hidden rounded-2xl bg-gradient-to-br p-6 text-white shadow-md",
            gradient,
          )}
        >
          {image && (
            <>
              <Image src={image} alt="" fill unoptimized className="object-cover" sizes="640px" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/55 to-black/25" />
            </>
          )}
          <div className="relative">
            <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs font-semibold uppercase">
              {badge}
            </span>
            <p className={cn("mt-2 text-sm", image ? "text-white/80" : accent)}>
              {subtitle || "Alt başlık"}
            </p>
            <h3 className="mt-1 text-xl font-bold">{title || "Başlık"}</h3>
            <p className="mt-2 text-sm text-white/85">{description || "Açıklama metni"}</p>
            <span className="mt-4 inline-block rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-900">
              {ctaText || "Buton"}
            </span>
          </div>
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-3">
        <Button type="submit" disabled={loading}>
          {loading ? "Kaydediliyor..." : isEditing ? "Güncelle" : "Reklam Ekle"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          İptal
        </Button>
      </div>
    </form>
  );
}

export function promoSlideToFormValues(slide: PromoSlide): PromoSlideFormValues {
  return {
    id: slide.id,
    badge: slide.badge,
    title: slide.title,
    subtitle: slide.subtitle,
    description: slide.description,
    ctaText: slide.ctaText,
    ctaHref: slide.ctaHref,
    image: slide.image,
    gradient: slide.gradient,
    accent: slide.accent,
    sortOrder: slide.sortOrder,
    isActive: slide.isActive,
  };
}
