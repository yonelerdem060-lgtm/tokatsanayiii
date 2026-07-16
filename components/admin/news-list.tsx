"use client";

import { deleteNews } from "@/actions/news";
import { DeleteButton } from "@/components/admin/delete-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ImageIcon, Pencil } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface NewsItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string | null;
  isPublished: boolean;
  publishedAt: Date | null;
  createdAt: Date;
}

export function NewsList({
  items,
  editHrefPrefix = "/admin/news",
}: {
  items: NewsItem[];
  /** Düzenle linki öneki — örn. /admin/news veya /baskan/haberler */
  editHrefPrefix?: string;
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full min-w-[640px] text-sm">
        <thead className="bg-muted/50">
          <tr>
            <th className="px-4 py-3 text-left font-medium">Haber</th>
            <th className="px-4 py-3 text-left font-medium">Durum</th>
            <th className="px-4 py-3 text-left font-medium">Tarih</th>
            <th className="px-4 py-3 text-right font-medium">İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-4 py-10 text-center text-muted-foreground">
                Henüz haber yok.
              </td>
            </tr>
          ) : (
            items.map((item) => (
              <tr key={item.id} className="border-t border-border">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
                      {item.coverImage ? (
                        <Image
                          src={item.coverImage}
                          alt=""
                          fill
                          unoptimized
                          className="object-cover"
                          sizes="80px"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-muted-foreground">
                          <ImageIcon className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium">{item.title}</p>
                      <p className="line-clamp-1 text-xs text-muted-foreground">{item.excerpt}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Badge className={item.isPublished ? "bg-green-50 text-green-700" : "bg-muted"}>
                    {item.isPublished ? "Yayında" : "Taslak"}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {(item.publishedAt ?? item.createdAt).toLocaleDateString("tr-TR")}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    {item.isPublished && (
                      <Link href={`/haberler/${item.slug}`} target="_blank">
                        <Button variant="ghost" size="sm">
                          Görüntüle
                        </Button>
                      </Link>
                    )}
                    <Link href={`${editHrefPrefix}/${item.id}${editHrefPrefix.startsWith("/baskan") ? "/duzenle" : "/edit"}`}>
                      <Button variant="outline" size="sm">
                        <Pencil className="h-4 w-4" />
                        Düzenle
                      </Button>
                    </Link>
                    <DeleteButton
                      onDelete={async () => {
                        const result = await deleteNews(item.id);
                        return {
                          success: result.success,
                          error: result.success ? undefined : result.error,
                        };
                      }}
                    />
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
