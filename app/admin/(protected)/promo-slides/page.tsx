import { getPromoSlides } from "@/actions/promo-slides";
import { PromoSlideList } from "@/components/admin/promo-slide-list";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function AdminPromoSlidesPage() {
  const result = await getPromoSlides();
  const slides = result.success ? result.data : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Reklam Slider</h1>
          <p className="text-muted-foreground">
            Ana sayfadaki reklam ve duyuru banner&apos;larını yönetin.
          </p>
        </div>
        <Link href="/admin/promo-slides/new">
          <Button>
            <Plus className="h-4 w-4" />
            Yeni Reklam
          </Button>
        </Link>
      </div>

      {!result.success && <p className="text-sm text-red-600">{result.error}</p>}

      {slides.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Henüz reklam slide&apos;ı yok.{" "}
            <Link href="/admin/promo-slides/new" className="text-primary hover:underline">
              İlk reklamı ekleyin
            </Link>
          </CardContent>
        </Card>
      ) : (
        <PromoSlideList slides={slides} />
      )}
    </div>
  );
}
