import { getNewsPosts } from "@/actions/news";
import { NewsList } from "@/components/admin/news-list";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function AdminNewsPage() {
  const result = await getNewsPosts();
  const items = result.success ? result.data : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Haberler</h1>
          <p className="text-muted-foreground">Duyuru ve haber içeriklerini yönetin.</p>
        </div>
        <Link href="/admin/news/new">
          <Button>
            <Plus className="h-4 w-4" />
            Yeni Haber
          </Button>
        </Link>
      </div>
      <NewsList items={items} />
    </div>
  );
}
