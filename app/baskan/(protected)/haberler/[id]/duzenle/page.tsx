import { getNewsById } from "@/actions/news";
import { NewsForm } from "@/components/admin/news-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { notFound } from "next/navigation";

interface EditNewsPageProps {
  params: Promise<{ id: string }>;
}

export default async function BaskanEditNewsPage({ params }: EditNewsPageProps) {
  const { id } = await params;
  const result = await getNewsById(id);
  if (!result.success) notFound();

  const post = result.data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Haberi Düzenle</h1>
        <p className="mt-1 text-sm text-muted-foreground">{post.title}</p>
      </div>
      <Card className="border-border/80 shadow-soft">
        <CardHeader>
          <CardTitle>Haber Bilgileri</CardTitle>
        </CardHeader>
        <CardContent>
          <NewsForm
            successHref="/baskan"
            initialValues={{
              id: post.id,
              title: post.title,
              excerpt: post.excerpt,
              content: post.content,
              coverImage: post.coverImage,
              isPublished: post.isPublished,
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
