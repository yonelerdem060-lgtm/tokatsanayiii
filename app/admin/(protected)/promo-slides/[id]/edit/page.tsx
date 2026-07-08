import { getPromoSlideById } from "@/actions/promo-slides";
import { PromoSlideForm, promoSlideToFormValues } from "@/components/admin/promo-slide-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { notFound } from "next/navigation";

interface EditPromoSlidePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPromoSlidePage({ params }: EditPromoSlidePageProps) {
  const { id } = await params;
  const result = await getPromoSlideById(id);

  if (!result.success) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Reklam Düzenle</h1>
        <p className="text-muted-foreground">{result.data.title}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Reklam Bilgileri</CardTitle>
        </CardHeader>
        <CardContent>
          <PromoSlideForm initialValues={promoSlideToFormValues(result.data)} />
        </CardContent>
      </Card>
    </div>
  );
}
