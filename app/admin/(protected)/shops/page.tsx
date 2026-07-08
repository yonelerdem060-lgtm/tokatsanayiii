import { getShops } from "@/actions/shops";
import { ShopDeleteButton } from "@/components/admin/shop-delete-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import { ADMIN_SHOPS_PAGE_SIZE, parsePage } from "@/lib/pagination";
import { ImageIcon, Pencil, Plus, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

interface AdminShopsPageProps {
  searchParams: Promise<{ q?: string; page?: string }>;
}

export default async function AdminShopsPage({ searchParams }: AdminShopsPageProps) {
  const params = await searchParams;
  const q = params.q?.trim() || undefined;
  const page = parsePage(params.page);

  const result = await getShops({ q, page, pageSize: ADMIN_SHOPS_PAGE_SIZE });
  const shopPage = result.success
    ? result.data
    : { items: [], total: 0, page: 1, pageSize: ADMIN_SHOPS_PAGE_SIZE, totalPages: 1 };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dükkanlar</h1>
          <p className="text-muted-foreground">
            Sanayi sitesindeki dükkanları yönetin. Toplam {shopPage.total} kayıt.
          </p>
        </div>
        <Link href="/admin/shops/new">
          <Button>
            <Plus className="h-4 w-4" />
            Yeni Dükkan
          </Button>
        </Link>
      </div>

      <form className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            name="q"
            defaultValue={q ?? ""}
            placeholder="Firma adı, telefon veya adres ara..."
            className="pl-9"
          />
        </div>
        <Button type="submit" variant="outline">
          Ara
        </Button>
        {q && (
          <Link href="/admin/shops">
            <Button type="button" variant="ghost">
              Temizle
            </Button>
          </Link>
        )}
      </form>

      {!result.success && <p className="text-sm text-red-600">{result.error}</p>}

      {shopPage.items.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            {q ? (
              <>“{q}” için sonuç bulunamadı.</>
            ) : (
              <>
                Henüz dükkan eklenmemiş.{" "}
                <Link href="/admin/shops/new" className="text-primary hover:underline">
                  İlk dükkanı ekleyin
                </Link>
              </>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {shopPage.items.map((shop) => (
            <Card key={shop.id}>
              <CardHeader className="flex flex-row items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
                    {shop.image ? (
                      <Image
                        src={shop.image}
                        alt=""
                        fill
                        unoptimized
                        className="object-cover"
                        sizes="96px"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-muted-foreground">
                        <ImageIcon className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <CardTitle>{shop.name}</CardTitle>
                      {shop.isFeatured && (
                        <Badge className="bg-amber-100 text-amber-800">Öne Çıkan</Badge>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{shop.address}</p>
                    <p className="text-sm text-muted-foreground">{shop.phone}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link href={`/dukkan/${shop.slug}`} target="_blank">
                    <Button variant="ghost" size="sm">
                      Görüntüle
                    </Button>
                  </Link>
                  <Link href={`/admin/shops/${shop.id}/edit`}>
                    <Button variant="outline" size="sm">
                      <Pencil className="h-4 w-4" />
                      Düzenle
                    </Button>
                  </Link>
                  <ShopDeleteButton shopId={shop.id} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {shop.categories.map((category) => (
                    <Badge key={category.id} className="bg-blue-50 text-blue-700">
                      {category.name}
                    </Badge>
                  ))}
                  {shop.vehicleTypes.map((vehicleType) => (
                    <Badge key={vehicleType.id} className="bg-green-50 text-green-700">
                      {vehicleType.name}
                    </Badge>
                  ))}
                  {shop.brands.map((brand) => (
                    <Badge key={brand.id} className="bg-orange-50 text-orange-700">
                      {brand.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
          <Suspense fallback={null}>
            <Pagination
              page={shopPage.page}
              totalPages={shopPage.totalPages}
              total={shopPage.total}
            />
          </Suspense>
        </div>
      )}
    </div>
  );
}
