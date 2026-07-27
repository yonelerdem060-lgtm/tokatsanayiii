"use client";

import { createNewsFromInput, updateNewsFromInput } from "@/actions/news";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { adminPath } from "@/lib/admin-path";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export interface NewsFormValues {
  id?: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage?: string | null;
  isPublished: boolean;
}

interface NewsFormProps {
  initialValues?: NewsFormValues;
  /** Kayıt sonrası yönlendirme */
  successHref?: string;
}

export function NewsForm({ initialValues, successHref }: NewsFormProps) {
  const resolvedSuccessHref = successHref ?? adminPath("/news");
  const router = useRouter();
  const isEditing = !!initialValues?.id;

  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [excerpt, setExcerpt] = useState(initialValues?.excerpt ?? "");
  const [content, setContent] = useState(initialValues?.content ?? "");
  const [coverImage, setCoverImage] = useState<string | null>(
    initialValues?.coverImage ?? null,
  );
  const [isPublished, setIsPublished] = useState(initialValues?.isPublished ?? false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const payload = { title, excerpt, content, coverImage, isPublished };
    const result = isEditing
      ? await updateNewsFromInput(initialValues!.id!, payload)
      : await createNewsFromInput(payload);

    setLoading(false);
    if (!result.success) {
      setError(result.error);
      return;
    }

    router.push(resolvedSuccessHref);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Başlık *</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="Haber başlığı"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="excerpt">Özet *</Label>
        <Textarea
          id="excerpt"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          required
          rows={2}
          placeholder="Liste ve kartlarda görünecek kısa özet"
        />
      </div>

      <ImageUploadField value={coverImage} onChange={setCoverImage} />

      <div className="space-y-2">
        <Label htmlFor="content">İçerik *</Label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={12}
          placeholder="Haber içeriği (paragraflar arasında boş satır bırakın)"
        />
      </div>

      <label className="flex items-center gap-3 rounded-lg border border-border p-4">
        <input
          type="checkbox"
          checked={isPublished}
          onChange={(e) => setIsPublished(e.target.checked)}
          className="h-4 w-4 rounded accent-primary"
        />
        <div>
          <p className="text-sm font-medium">Yayınla</p>
          <p className="text-xs text-muted-foreground">İşaretlenmezse taslak olarak kalır.</p>
        </div>
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-3">
        <Button type="submit" disabled={loading}>
          {loading ? "Kaydediliyor..." : isEditing ? "Güncelle" : "Haber Ekle"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          İptal
        </Button>
      </div>
    </form>
  );
}
