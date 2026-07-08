import { getPublishedNews } from "@/actions/news";
import Link from "next/link";
import { Calendar, ImageIcon } from "lucide-react";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Haberler | Tokat Sanayi Sitesi Rehberi",
  description: "Tokat Sanayi Sitesi haberleri ve duyuruları",
};

function formatDate(date: Date | null, fallback: Date) {
  const d = date ?? fallback;
  return {
    day: d.getDate(),
    month: d.toLocaleDateString("tr-TR", { month: "short" }),
    year: d.getFullYear(),
  };
}

export default async function NewsListPage() {
  const result = await getPublishedNews();
  const posts = result.success ? result.data : [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10">
        <h1 className="text-3xl font-bold">Haberler & Duyurular</h1>
        <p className="mt-2 text-muted-foreground">
          Sanayi sitemizden güncel haberler ve duyurular
        </p>
      </div>

      {posts.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border py-16 text-center text-muted-foreground">
          Henüz yayınlanmış haber bulunmuyor.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => {
            const date = formatDate(post.publishedAt, post.createdAt);
            return (
              <Link
                key={post.id}
                href={`/haberler/${post.slug}`}
                className="group overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-md"
              >
                <div className="relative aspect-[16/9] w-full bg-muted">
                  {post.coverImage ? (
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      unoptimized
                      className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center gap-4 px-5">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-primary">{date.day}</p>
                        <p className="text-xs uppercase text-muted-foreground">{date.month}</p>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        {date.year}
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <div className="mb-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    {date.day} {date.month} {date.year}
                    {!post.coverImage && (
                      <ImageIcon className="ml-auto h-3.5 w-3.5 opacity-40" />
                    )}
                  </div>
                  <h2 className="font-semibold group-hover:text-primary">{post.title}</h2>
                  <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{post.excerpt}</p>
                  <span className="mt-4 inline-block text-sm font-medium text-primary">
                    Devamını Oku →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
