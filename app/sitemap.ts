import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";

const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [shops, news] = await Promise.all([
    prisma.shop.findMany({ select: { slug: true, updatedAt: true } }),
    prisma.newsPost.findMany({
      where: { isPublished: true },
      select: { slug: true, updatedAt: true, publishedAt: true },
    }),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/haberler`, changeFrequency: "daily", priority: 0.8 },
    { url: `${baseUrl}/hakkimizda`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/iletisim`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/mobilya-kereste`, changeFrequency: "weekly", priority: 0.7 },
  ];

  const shopRoutes = shops.map((shop) => ({
    url: `${baseUrl}/dukkan/${shop.slug}`,
    lastModified: shop.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const newsRoutes = news.map((post) => ({
    url: `${baseUrl}/haberler/${post.slug}`,
    lastModified: post.updatedAt ?? post.publishedAt ?? undefined,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...shopRoutes, ...newsRoutes];
}
