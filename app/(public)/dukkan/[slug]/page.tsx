import { getShopBySlug } from "@/actions/shops";
import { FavoriteButton } from "@/components/public/favorite-button";
import { ShopAddressLink } from "@/components/public/shop-address-link";
import { ShopContactActions } from "@/components/public/shop-contact-actions";
import { ShopGallery } from "@/components/public/shop-gallery";
import { ShopViewTracker } from "@/components/public/shop-view-tracker";
import {
  JsonLd,
  buildBreadcrumbSchema,
  buildShopLocalBusinessSchema,
} from "@/components/seo/json-ld";
import { Badge } from "@/components/ui/badge";
import {
  buildShopMetadata,
  buildShopSeoDescription,
} from "@/lib/auto-seo";
import {
  ArrowLeft,
  Clock3,
  MapPin,
  Store,
  Trophy,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface ShopDetailPageProps {
  params: Promise<{ slug: string }>;
}

function toWhatsAppLink(value: string) {
  const digits = value.replace(/\D/g, "");
  if (!digits) return null;
  return `https://wa.me/${digits}`;
}

export async function generateMetadata({ params }: ShopDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await getShopBySlug(slug);
  if (!result.success) return { title: "Dükkân Bulunamadı" };
  return buildShopMetadata(result.data);
}

export default async function ShopDetailPage({ params }: ShopDetailPageProps) {
  const { slug } = await params;
  const result = await getShopBySlug(slug);
  if (!result.success) notFound();

  const shop = result.data;
  const whatsappHref = shop.whatsapp ? toWhatsAppLink(shop.whatsapp) : null;
  const gallery = shop.gallery.length > 0 ? shop.gallery : shop.image ? [shop.image] : [];
  const seoDescription = buildShopSeoDescription(shop);

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
      <JsonLd
        data={buildShopLocalBusinessSchema({
          name: shop.name,
          slug: shop.slug,
          description: seoDescription,
          address: shop.address,
          phone: shop.phone,
          image: shop.image,
          workingHours: shop.workingHours,
          mapUrl: shop.mapUrl,
          categories: shop.categories,
          brands: shop.brands,
        })}
      />
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Anasayfa", path: "/" },
          { name: shop.name, path: `/dukkan/${shop.slug}` },
        ])}
      />
      <ShopViewTracker shopId={shop.id} />

      <div className="flex items-center justify-between gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Rehbere Dön
        </Link>
        <FavoriteButton
          shop={{
            id: shop.id,
            name: shop.name,
            slug: shop.slug,
            image: shop.image,
            phone: shop.phone,
          }}
        />
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-card sm:mt-6">
        <ShopGallery name={shop.name} images={gallery} />

        <div className="space-y-6 p-4 pb-28 sm:p-8 sm:pb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <Store className="h-4 w-4" />
                Sanayi Sitesi Firması
                {shop.isFeatured && (
                  <Badge className="bg-amber-100 text-amber-800">Öne Çıkan</Badge>
                )}
                {shop.isShopOfWeek && (
                  <Badge className="bg-amber-500 text-white">
                    <Trophy className="mr-1 h-3 w-3" />
                    Haftanın Firması
                  </Badge>
                )}
              </div>
              <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">{shop.name}</h1>
              {shop.description && (
                <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
                  {shop.description}
                </p>
              )}
            </div>
            <ShopContactActions
              shopId={shop.id}
              phone={shop.phone}
              whatsappHref={whatsappHref}
              layout="stack"
              showPhoneNumber
              className="hidden sm:flex sm:w-auto"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-border bg-muted/30 p-4">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">Adres</p>
                  <div className="mt-1">
                    <ShopAddressLink
                      address={shop.address}
                      mapUrl={shop.mapUrl}
                      showIcon={false}
                      showHint
                      textClassName="text-muted-foreground"
                    />
                  </div>
                </div>
              </div>
            </div>
            {shop.workingHours && (
              <div className="rounded-xl border border-border bg-muted/30 p-4">
                <div className="flex items-start gap-3">
                  <Clock3 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Çalışma Saatleri</p>
                    <p className="mt-1 text-muted-foreground">{shop.workingHours}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            <DetailGroup
              title="Kategoriler"
              empty="Kategori belirtilmemiş"
              items={shop.categories}
              className="bg-blue-50 text-blue-700"
            />
            <DetailGroup
              title="Araç Tipleri"
              empty="Araç tipi belirtilmemiş"
              items={shop.vehicleTypes}
              className="bg-emerald-50 text-emerald-700"
            />
            <DetailGroup
              title="Markalar"
              empty="Marka belirtilmemiş"
              items={shop.brands}
              className="bg-amber-50 text-amber-800"
            />
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] z-30 border-t border-border/80 bg-white/95 p-3 shadow-[0_-8px_30px_-18px_rgba(15,23,42,0.35)] backdrop-blur-xl sm:hidden">
        <ShopContactActions
          shopId={shop.id}
          phone={shop.phone}
          whatsappHref={whatsappHref}
          layout="row"
          className="mx-auto max-w-5xl"
        />
      </div>
    </div>
  );
}

function DetailGroup({
  title,
  empty,
  items,
  className,
}: {
  title: string;
  empty: string;
  items: { id: string; name: string }[];
  className: string;
}) {
  return (
    <div>
      <h2 className="text-sm font-semibold">{title}</h2>
      {items.length === 0 ? (
        <p className="mt-2 text-sm text-muted-foreground">{empty}</p>
      ) : (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {items.map((item) => (
            <Badge key={item.id} className={className}>
              {item.name}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
