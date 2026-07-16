import { NewsForm } from "@/components/admin/news-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function BaskanNewNewsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Yeni Haber</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Başlık, özet ve içeriği doldurun; yayınlamak için kutuyu işaretleyin.
        </p>
      </div>
      <Card className="border-border/80 shadow-soft">
        <CardHeader>
          <CardTitle>Haber Bilgileri</CardTitle>
        </CardHeader>
        <CardContent>
          <NewsForm successHref="/baskan" />
        </CardContent>
      </Card>
    </div>
  );
}
