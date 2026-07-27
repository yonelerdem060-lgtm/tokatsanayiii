import { Suspense } from "react";
import type { Metadata } from "next";
import { getFilterOptions } from "@/actions/filters";
import {
  getCategoryStats,
  getFeaturedShops,
  getShopCount,
  getShopOfTheWeek,
} from "@/actions/homepage";
import { getPublishedNews } from "@/actions/news";
import { getActivePromoSlides } from "@/actions/promo-slides";
import { getShops } from "@/actions/shops";
import { AdCtaBanner } from "@/components/public/ad-cta-banner";
import { FeaturedShops } from "@/components/public/featured-shops";
import { DirectoryBrowser } from "@/components/public/directory-browser";
import { HomeHero } from "@/components/public/home-hero";
import { HomeSearch } from "@/components/public/home-search";
import { HomeSeoContent } from "@/components/public/home-seo-content";
import { MobileNeedFinder } from "@/components/public/mobile-need-finder";
import { NewsPreview } from "@/components/public/news-preview";
import { ShopGridSkeleton } from "@/components/public/shop-grid";
import { Reveal } from "@/components/public/motion";
import { WeekFeatured } from "@/components/public/week-featured";
import { parsePage, SHOPS_PAGE_SIZE } from "@/lib/pagination";
import { SEO_DEFAULTS } from "@/lib/seo";
import { getResolvedSiteConfig } from "@/lib/site-settings";

export const metadata: Metadata = {
  title: {
    absolute: SEO_DEFAULTS.title,
  },
  description: SEO_DEFAULTS.description,
  alternates: { canonical: "/" },
  openGraph: {
    title: SEO_DEFAULTS.title,
    description: SEO_DEFAULTS.description,
    url: "/",
  },
};

interface HomePageProps {
  searchParams: Promise<{
    category?: string;
    vehicleType?: string;
    brand?: string;
    q?: string;
    page?: string;
  }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const { category, vehicleType, brand, q } = params;
  const page = parsePage(params.page);
  const hasFilters = !!(category || vehicleType || brand || q);

  return (
    <>
      <Suspense fallback={<HomeHeroSkeleton />}>
        <HomeHeroSection />
      </Suspense>

      <Suspense
        fallback={
          <div className="border-b border-border bg-[#1e4b8f] px-4 py-8">
            <div className="mx-auto h-28 max-w-2xl animate-pulse rounded-2xl bg-white/15" />
          </div>
        }
      >
        <HomeSearchSection
          category={category}
          vehicleType={vehicleType}
          brand={brand}
        />
      </Suspense>

      <Suspense fallback={null}>
        <MobileNeedFinder />
      </Suspense>

      <Suspense fallback={<SectionPulse height="h-48" />}>
        <WeekFeaturedSection />
      </Suspense>

      <Suspense fallback={<SectionPulse height="h-64" />}>
        <FeaturedShopsSection />
      </Suspense>

      <Suspense fallback={<SectionPulse height="h-56" />}>
        <NewsPreviewSection />
      </Suspense>

      <Suspense fallback={null}>
        <AdCtaSection />
      </Suspense>

      <section
        id="rehber"
        className="mx-auto w-full max-w-7xl space-y-5 px-4 py-8 sm:px-6 lg:px-8"
      >
        <Reveal>
          <h2 className="text-title">Tokat Sanayi Sitesi dükkân rehberi</h2>
          <p className="mt-1 text-body">
            Kategori, araç tipi veya marka ile Tokat Sanayi esnafını daraltın
          </p>
        </Reveal>
        <Suspense
          fallback={
            <div className="space-y-5">
              <div className="skeleton h-[120px] rounded-[var(--ds-radius-xl)]" />
              <ShopGridSkeleton count={6} />
            </div>
          }
        >
          <DirectorySection
            category={category}
            vehicleType={vehicleType}
            brand={brand}
            q={q}
            page={page}
            hasFilters={hasFilters}
          />
        </Suspense>
      </section>

      <HomeSeoContent />
    </>
  );
}

async function HomeHeroSection() {
  const [promoResult, categoryStatsResult] = await Promise.all([
    getActivePromoSlides(),
    getCategoryStats(),
  ]);

  return (
    <HomeHero
      categories={categoryStatsResult.success ? categoryStatsResult.data : []}
      slides={promoResult.success ? promoResult.data : []}
    />
  );
}

async function HomeSearchSection({
  category,
  vehicleType,
  brand,
}: {
  category?: string;
  vehicleType?: string;
  brand?: string;
}) {
  const [filterResult, featuredResult, countResult] = await Promise.all([
    getFilterOptions({ category, vehicleType, brand }),
    getFeaturedShops(),
    getShopCount(),
  ]);

  const filterOptions = filterResult.success
    ? filterResult.data
    : { categories: [], vehicleTypes: [], brands: [] };
  const featuredShops = featuredResult.success ? featuredResult.data : [];
  const totalShops = countResult.success ? countResult.data : featuredShops.length;

  return (
    <HomeSearch
      totalShops={totalShops}
      shopNames={featuredShops.map((shop) => shop.name)}
      categories={filterOptions.categories}
      vehicleTypes={filterOptions.vehicleTypes}
      brands={filterOptions.brands}
    />
  );
}

async function WeekFeaturedSection() {
  const result = await getShopOfTheWeek();
  return <WeekFeatured shop={result.success ? result.data : null} />;
}

async function FeaturedShopsSection() {
  const result = await getFeaturedShops();
  return <FeaturedShops shops={result.success ? result.data : []} />;
}

async function NewsPreviewSection() {
  const result = await getPublishedNews(6);
  return <NewsPreview posts={result.success ? result.data : []} />;
}

async function AdCtaSection() {
  const siteConfig = await getResolvedSiteConfig();
  return <AdCtaBanner adEmail={siteConfig.adEmail} />;
}

async function DirectorySection({
  category,
  vehicleType,
  brand,
  q,
  page,
  hasFilters,
}: {
  category?: string;
  vehicleType?: string;
  brand?: string;
  q?: string;
  page: number;
  hasFilters: boolean;
}) {
  const [filterResult, shopsResult, featuredResult] = await Promise.all([
    getFilterOptions({ category, vehicleType, brand }),
    getShops({
      category,
      vehicleType,
      brand,
      q,
      page,
      pageSize: SHOPS_PAGE_SIZE,
    }),
    getFeaturedShops(),
  ]);

  const filterOptions = filterResult.success
    ? filterResult.data
    : { categories: [], vehicleTypes: [], brands: [] };
  const shopPage = shopsResult.success
    ? shopsResult.data
    : {
        items: [],
        total: 0,
        page: 1,
        pageSize: SHOPS_PAGE_SIZE,
        totalPages: 1,
      };
  const featuredShops = featuredResult.success ? featuredResult.data : [];

  return (
    <DirectoryBrowser
      categories={filterOptions.categories}
      vehicleTypes={filterOptions.vehicleTypes}
      brands={filterOptions.brands}
      suggestions={[
        ...shopPage.items.map((shop) => shop.name),
        ...featuredShops.map((shop) => shop.name),
      ]}
      shops={shopPage.items}
      hasFilters={hasFilters}
      total={shopPage.total}
      page={shopPage.page}
      totalPages={shopPage.totalPages}
      searchQuery={q}
    />
  );
}

function HomeHeroSkeleton() {
  return (
    <section className="border-b border-border bg-surface py-4 sm:py-5">
      <div className="mx-auto grid max-w-[92rem] items-start gap-4 px-3 sm:px-5 lg:grid-cols-[220px_minmax(0,1fr)] lg:px-6 xl:grid-cols-[240px_minmax(0,1fr)] xl:px-8">
        <div className="skeleton order-2 h-[280px] rounded-[var(--ds-radius-md)] sm:h-[320px] lg:order-1 lg:h-[360px]" />
        <div className="skeleton order-1 aspect-[1920/860] w-full rounded-[var(--ds-radius-md)] lg:order-2" />
      </div>
    </section>
  );
}

function SectionPulse({ height }: { height: string }) {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className={`skeleton w-full rounded-[var(--ds-radius-xl)] ${height}`} />
    </div>
  );
}
