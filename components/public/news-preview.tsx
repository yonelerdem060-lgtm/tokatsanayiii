"use client";

import { Reveal, Stagger, StaggerItem } from "@/components/public/motion";
import { formatTrDate } from "@/lib/dates";
import { ArrowRight, Calendar, Clock3, ImageIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface NewsPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string | null;
  publishedAt: Date | string | null;
  createdAt: Date | string;
}

interface NewsPreviewProps {
  posts: NewsPost[];
}

function formatDate(date: Date | string | null, fallback: Date | string) {
  return formatTrDate(date ?? fallback);
}

export function NewsPreview({ posts }: NewsPreviewProps) {
  if (posts.length === 0) return null;

  return (
    <section id="haberler" className="border-b border-border/70 py-10 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-blue-600">
              Bizden Haberler
            </p>
            <h2 className="text-2xl font-semibold tracking-tight">Bizden haberler</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Yönetimden duyurular ve gelişmeler
            </p>
          </div>
          <Link
            href="/haberler"
            className="hidden items-center gap-1 text-sm font-medium text-blue-700 transition hover:text-blue-800 sm:inline-flex"
          >
            Tümünü gör
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>

        <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <StaggerItem key={post.id}>
              <Link href={`/haberler/${post.slug}`} className="card-surface group block h-full overflow-hidden">
                <div className="relative aspect-[16/10] bg-muted">
                  {post.coverImage ? (
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      unoptimized
                      className="object-cover transition duration-500 group-hover:scale-[1.04]"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100 text-slate-400">
                      <ImageIcon className="h-8 w-8 opacity-40" />
                    </div>
                  )}
                </div>
                <div className="space-y-3 p-5">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatDate(post.publishedAt, post.createdAt)}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock3 className="h-3.5 w-3.5" />
                      2 dk okuma
                    </span>
                  </div>
                  <h3 className="line-clamp-2 text-lg font-semibold tracking-tight text-slate-900 transition group-hover:text-blue-700">
                    {post.title}
                  </h3>
                  <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                    {post.excerpt}
                  </p>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-blue-700">
                    Devamını oku
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
