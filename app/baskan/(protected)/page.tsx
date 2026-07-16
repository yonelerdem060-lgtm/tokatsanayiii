import { getNewsPosts } from "@/actions/news";
import { NewsList } from "@/components/admin/news-list";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function BaskanDashboardPage() {
  const result = await getNewsPosts();
  const items = result.success ? result.data : [];
  const published = items.filter((item) => item.isPublished).length;
  const drafts = items.length - published;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Haberler</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Duyuru ve haberleri buradan yayınlayın, düzenleyin veya taslak olarak kaydedin.
          </p>
        </div>
        <Link href="/baskan/haberler/yeni" className="shrink-0">
          <Button className="w-full sm:w-auto">
            <Plus className="h-4 w-4" />
            Yeni Haber
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-white px-4 py-3">
          <p className="text-xs font-medium text-muted-foreground">Toplam</p>
          <p className="mt-1 text-2xl font-bold tabular-nums">{items.length}</p>
        </div>
        <div className="rounded-xl border border-border bg-white px-4 py-3">
          <p className="text-xs font-medium text-muted-foreground">Yayında</p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-emerald-700">{published}</p>
        </div>
        <div className="col-span-2 rounded-xl border border-border bg-white px-4 py-3 sm:col-span-1">
          <p className="text-xs font-medium text-muted-foreground">Taslak</p>
          <p className="mt-1 text-2xl font-bold tabular-nums">{drafts}</p>
        </div>
      </div>

      {!result.success ? (
        <p className="text-sm text-red-600">{result.error}</p>
      ) : (
        <NewsList items={items} editHrefPrefix="/baskan/haberler" />
      )}
    </div>
  );
}
