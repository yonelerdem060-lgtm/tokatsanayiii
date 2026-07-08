import { getShopsByCategorySlugs } from "@/actions/shops";
import { SectorCategoryFilter } from "@/components/public/sector-category-filter";
import { ShopGrid } from "@/components/public/shop-grid";
import { siteConfig } from "@/lib/site-config";
import { prisma } from "@/lib/db";
import { parsePage, SHOPS_PAGE_SIZE } from "@/lib/pagination";
import { MapPin, Trees } from "lucide-react";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Mobilya & Kereste Bölgesi | Tokat Sanayi Sitesi Rehberi",
  description: siteConfig.mobilyaKereste.description,
};

interface MobilyaKerestePageProps {
  searchParams: Promise<{ category?: string; q?: string; page?: string }>;
}

async function getSectorCategoryStats(slugs: readonly string[]) {
  const categories = await prisma.category.findMany({
    where: { slug: { in: [...slugs] } },
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: { shops: true },
      },
    },
  });

  return categories.map((category) => ({
    slug: category.slug,
    name: category.name,
    count: category._count.shops,
  }));
}

export default async function MobilyaKerestePage({ searchParams }: MobilyaKerestePageProps) {
  const params = await searchParams;
  const { category, q } = params;
  const page = parsePage(params.page);
  const zone = siteConfig.mobilyaKereste;

  const [shopsResult, categoryStats] = await Promise.all([
    getShopsByCategorySlugs(zone.categorySlugs, {
      category,
      q,
      page,
      pageSize: SHOPS_PAGE_SIZE,
    }),
    getSectorCategoryStats(zone.categorySlugs),
  ]);

  const shopPage = shopsResult.success
    ? shopsResult.data
    : { items: [], total: 0, page: 1, pageSize: SHOPS_PAGE_SIZE, totalPages: 1 };
  const hasFilters = !!(category || q);

  return (
    <>
      <section className="border-b border-border bg-gradient-to-br from-amber-900 via-amber-800 to-stone-800 text-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-white/10 p-4">
              <Trees className="h-10 w-10 text-amber-200" />
            </div>
            <div className="max-w-2xl">
              <p className="text-sm font-medium text-amber-200">Sanayi Sitesi Bölgesi</p>
              <h1 className="mt-1 text-3xl font-bold sm:text-4xl">{zone.title}</h1>
              <p className="mt-4 text-sm leading-relaxed text-amber-50/90 sm:text-base">
                {zone.description}
              </p>
              <p className="mt-4 flex items-center gap-2 text-sm text-amber-100">
                <MapPin className="h-4 w-4 shrink-0" />
                {zone.location}
              </p>
            </div>
          </div>

          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {zone.highlights.map((item) => (
              <li
                key={item}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-amber-50"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div id="firmalar" className="mx-auto max-w-7xl scroll-mt-4 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h2 className="text-xl font-bold">Bölgedeki Firmalar</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Mobilya, kereste ve marangoz işletmeleri
          </p>
        </div>

        <Suspense fallback={null}>
          <SectorCategoryFilter basePath={`/${zone.slug}`} categories={categoryStats} />
        </Suspense>

        <div className="mt-8">
          <ShopGrid
            shops={shopPage.items}
            hasFilters={hasFilters}
            total={shopPage.total}
            page={shopPage.page}
            totalPages={shopPage.totalPages}
            searchQuery={q}
          />
        </div>
      </div>
    </>
  );
}
