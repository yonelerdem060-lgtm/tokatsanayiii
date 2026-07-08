import { getNewsById } from "@/actions/news";
import { NewsForm } from "@/components/admin/news-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { notFound } from "next/navigation";

interface EditNewsPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditNewsPage({ params }: EditNewsPageProps) {
  const { id } = await params;
  const result = await getNewsById(id);
  if (!result.success) notFound();

  const post = result.data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Haber Düzenle</h1>
        <p className="text-muted-foreground">{post.title}</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Haber Bilgileri</CardTitle>
        </CardHeader>
        <CardContent>
          <NewsForm
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
