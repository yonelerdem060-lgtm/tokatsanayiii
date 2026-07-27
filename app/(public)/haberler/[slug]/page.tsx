import { getNewsBySlug } from "@/actions/news";
import {
  JsonLd,
  buildBreadcrumbSchema,
  buildNewsArticleSchema,
} from "@/components/seo/json-ld";
import { buildNewsMetadata, buildNewsSeoDescription } from "@/lib/auto-seo";
import { formatTrDate } from "@/lib/dates";
import Link from "next/link";
import { ArrowLeft, Calendar } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface NewsDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: NewsDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await getNewsBySlug(slug);
  if (!result.success) return { title: "Haber Bulunamadı" };
  const post = result.data;
  return buildNewsMetadata({
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    coverImage: post.coverImage,
    publishedAt: post.publishedAt,
  });
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { slug } = await params;
  const result = await getNewsBySlug(slug);

  if (!result.success) notFound();

  const post = result.data;
  const date = formatTrDate(post.publishedAt ?? post.createdAt);
  const seoDescription = buildNewsSeoDescription({
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
  });

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <JsonLd
        data={buildNewsArticleSchema({
          title: post.title,
          slug: post.slug,
          excerpt: seoDescription,
          coverImage: post.coverImage,
          publishedAt: post.publishedAt,
        })}
      />
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Anasayfa", path: "/" },
          { name: "Haberler", path: "/haberler" },
          { name: post.title, path: `/haberler/${post.slug}` },
        ])}
      />

      <Link
        href="/haberler"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        Tüm Haberler
      </Link>

      <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Calendar className="h-4 w-4" />
        {date}
      </div>

      <h1 className="mt-3 text-3xl font-bold tracking-tight">{post.title}</h1>
      <p className="mt-4 text-lg text-muted-foreground">{post.excerpt}</p>

      {post.coverImage && (
        <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-2xl border border-border bg-muted">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            unoptimized
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
            priority
          />
        </div>
      )}

      <div className="prose prose-slate mt-8 max-w-none">
        {post.content.split("\n\n").map((paragraph, index) => (
          <p key={index} className="mb-4 leading-relaxed text-foreground">
            {paragraph}
          </p>
        ))}
      </div>
    </article>
  );
}
