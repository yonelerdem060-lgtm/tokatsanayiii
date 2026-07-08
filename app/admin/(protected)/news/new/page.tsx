import { NewsForm } from "@/components/admin/news-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewNewsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Yeni Haber Ekle</h1>
        <p className="text-muted-foreground">Duyuru veya haber içeriği oluşturun.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Haber Bilgileri</CardTitle>
        </CardHeader>
        <CardContent>
          <NewsForm />
        </CardContent>
      </Card>
    </div>
  );
}
