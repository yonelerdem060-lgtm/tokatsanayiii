"use client";

import { createShopFromInput, updateShopFromInput } from "@/actions/shops";
import { GalleryUploadField } from "@/components/admin/gallery-upload-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MultiSelect, MultiSelectOption } from "@/components/ui/multi-select";
import { Textarea } from "@/components/ui/textarea";
import { adminPath } from "@/lib/admin-path";
import { MAX_SHOP_GALLERY_IMAGES } from "@/lib/shop-media";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export interface ShopFormValues {
  id?: string;
  name: string;
  description?: string;
  address: string;
  phone: string;
  whatsapp?: string | null;
  workingHours?: string | null;
  mapUrl?: string | null;
  image?: string | null;
  gallery?: string[];
  categoryIds: string[];
  vehicleTypeIds: string[];
  brandIds: string[];
  isFeatured?: boolean;
  featuredSortOrder?: number;
  isShopOfWeek?: boolean;
}

interface ShopFormProps {
  initialValues?: ShopFormValues;
  categories: MultiSelectOption[];
  vehicleTypes: MultiSelectOption[];
  brands: MultiSelectOption[];
}

export function ShopForm({
  initialValues,
  categories,
  vehicleTypes,
  brands,
}: ShopFormProps) {
  const router = useRouter();
  const isEditing = !!initialValues?.id;

  const [name, setName] = useState(initialValues?.name ?? "");
  const [description, setDescription] = useState(initialValues?.description ?? "");
  const [address, setAddress] = useState(initialValues?.address ?? "");
  const [phone, setPhone] = useState(initialValues?.phone ?? "");
  const [whatsapp, setWhatsapp] = useState(initialValues?.whatsapp ?? "");
  const [workingHours, setWorkingHours] = useState(initialValues?.workingHours ?? "");
  const [mapUrl, setMapUrl] = useState(initialValues?.mapUrl ?? "");
  const [image, setImage] = useState<string | null>(initialValues?.image ?? null);
  const [gallery, setGallery] = useState<string[]>(
    initialValues?.gallery?.length
      ? initialValues.gallery
      : initialValues?.image
        ? [initialValues.image]
        : [],
  );
  const [categoryIds, setCategoryIds] = useState<string[]>(initialValues?.categoryIds ?? []);
  const [vehicleTypeIds, setVehicleTypeIds] = useState<string[]>(
    initialValues?.vehicleTypeIds ?? [],
  );
  const [brandIds, setBrandIds] = useState<string[]>(initialValues?.brandIds ?? []);
  const [isFeatured, setIsFeatured] = useState(initialValues?.isFeatured ?? false);
  const [featuredSortOrder, setFeaturedSortOrder] = useState(
    initialValues?.featuredSortOrder ?? 0,
  );
  const [isShopOfWeek, setIsShopOfWeek] = useState(initialValues?.isShopOfWeek ?? false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      name,
      description: description || undefined,
      address,
      phone,
      whatsapp: whatsapp || null,
      workingHours: workingHours || null,
      mapUrl: mapUrl || null,
      image,
      gallery,
      categoryIds,
      vehicleTypeIds,
      brandIds,
      isFeatured,
      featuredSortOrder,
      isShopOfWeek,
    };

    const result = isEditing
      ? await updateShopFromInput(initialValues!.id!, payload)
      : await createShopFromInput(payload);

    setLoading(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    router.push(adminPath("/shops"));
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Dükkân Adı *</Label>
          <Input
            id="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            placeholder="Örn: Yılmaz Motor"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Telefon *</Label>
          <Input
            id="phone"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            required
            placeholder="0356 123 45 67"
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="whatsapp">WhatsApp</Label>
          <Input
            id="whatsapp"
            value={whatsapp}
            onChange={(event) => setWhatsapp(event.target.value)}
            placeholder="905551112233 (ülke kodu ile)"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="workingHours">Çalışma Saatleri</Label>
          <Input
            id="workingHours"
            value={workingHours}
            onChange={(event) => setWorkingHours(event.target.value)}
            placeholder="Hafta içi 08:30–18:00"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Adres *</Label>
        <Input
          id="address"
          value={address}
          onChange={(event) => setAddress(event.target.value)}
          required
          placeholder="Tokat Sanayi Sitesi A Blok No:12"
        />
        <p className="text-xs text-muted-foreground">
          Bu adres sitede tıklanınca Google Haritalar’da açılır. Mümkünse blok/no
          ile yazın (ör. Tokat Sanayi Sitesi A Blok No:12).
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="mapUrl">Harita Linki (isteğe bağlı)</Label>
        <Input
          id="mapUrl"
          value={mapUrl}
          onChange={(event) => setMapUrl(event.target.value)}
          placeholder="https://maps.google.com/..."
        />
        <p className="text-xs text-muted-foreground">
          Boş bırakabilirsiniz. Doldurursanız adres yerine bu özel Google Maps
          linki kullanılır (daha kesin pin için).
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Açıklama</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Dükkân hakkında kısa bilgi..."
        />
        <p className="text-xs text-muted-foreground">
          Boş bırakırsanız meta description otomatik üretilir. Doldurursanız SEO
          açıklamasının temelini bu metin oluşturur (kategori, adres, telefon
          eklenir).
        </p>
      </div>

      <div className="rounded-lg border border-blue-100 bg-blue-50/60 px-4 py-3 text-sm text-slate-700">
        <p className="font-medium text-slate-900">SEO otomatik</p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          Sayfa başlığı, meta description, Open Graph, Twitter kartı, anahtar
          kelimeler ve yapılandırılmış veri (LocalBusiness) dükkân adı, kategori,
          marka, adres ve görsellerden otomatik oluşturulur. Ayrı SEO alanı
          doldurmanız gerekmez.
        </p>
      </div>

      <GalleryUploadField
        cover={image}
        gallery={gallery}
        maxItems={MAX_SHOP_GALLERY_IMAGES}
        onChange={({ cover, gallery: nextGallery }) => {
          setImage(cover);
          setGallery(nextGallery);
        }}
      />

      <div className="grid gap-6 md:grid-cols-3">
        <MultiSelect
          label="Kategoriler"
          options={categories}
          selected={categoryIds}
          onChange={setCategoryIds}
          placeholder="Kategori seçin..."
        />
        <MultiSelect
          label="Araç Tipleri"
          options={vehicleTypes}
          selected={vehicleTypeIds}
          onChange={setVehicleTypeIds}
          placeholder="Araç tipi seçin..."
        />
        <MultiSelect
          label="Markalar"
          options={brands}
          selected={brandIds}
          onChange={setBrandIds}
          placeholder="Marka seçin..."
        />
      </div>

      <div className="grid gap-4 rounded-lg border border-border p-4 md:grid-cols-[1fr_160px] md:items-center">
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={isFeatured}
            onChange={(event) => setIsFeatured(event.target.checked)}
            className="h-4 w-4 rounded accent-primary"
          />
          <div>
            <p className="text-sm font-medium">Öne çıkan firma</p>
            <p className="text-xs text-muted-foreground">
              Ana sayfada &quot;Öne Çıkan Firmalar&quot; bölümünde gösterilir.
            </p>
          </div>
        </label>
        <div className="space-y-2">
          <Label htmlFor="featuredSortOrder">Öne çıkma sırası</Label>
          <Input
            id="featuredSortOrder"
            type="number"
            min={0}
            value={featuredSortOrder}
            onChange={(event) => setFeaturedSortOrder(Number(event.target.value))}
            disabled={!isFeatured}
          />
        </div>
      </div>

      <label className="flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50/50 p-4">
        <input
          type="checkbox"
          checked={isShopOfWeek}
          onChange={(event) => setIsShopOfWeek(event.target.checked)}
          className="h-4 w-4 rounded accent-amber-600"
        />
        <div>
          <p className="text-sm font-medium">Haftanın öne çıkan firması</p>
          <p className="text-xs text-muted-foreground">
            Ana sayfada özel bölümde gösterilir. Aynı anda yalnızca bir firma seçili olabilir.
          </p>
        </div>
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-3">
        <Button type="submit" disabled={loading}>
          {loading ? "Kaydediliyor..." : isEditing ? "Güncelle" : "Dükkân Ekle"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          İptal
        </Button>
      </div>
    </form>
  );
}
