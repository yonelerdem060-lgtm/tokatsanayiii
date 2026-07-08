import { PromoSlideForm } from "@/components/admin/promo-slide-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewPromoSlidePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Yeni Reklam Ekle</h1>
        <p className="text-muted-foreground">Ana sayfa slider&apos;ına yeni bir banner ekleyin.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Reklam Bilgileri</CardTitle>
        </CardHeader>
        <CardContent>
          <PromoSlideForm />
        </CardContent>
      </Card>
    </div>
  );
}
