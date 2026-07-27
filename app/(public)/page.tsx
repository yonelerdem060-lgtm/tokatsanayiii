import { Suspense } from "react";
import { getFilterOptions } from "@/actions/filters";
import { getCategoryStats, getFeaturedShops, getShopOfTheWeek } from "@/actions/homepage";
import { getPublishedNews } from "@/actions/news";
import { getActivePromoSlides } from "@/actions/promo-slides";
import { getShops } from "@/actions/shops";
import { AdCtaBanner } from "@/components/public/ad-cta-banner";
import { FeaturedShops } from "@/components/public/featured-shops";
import { DirectoryBrowser } from "@/components/public/directory-browser";
import { HomeHero } from "@/components/public/home-hero";
import { HomeSearch } from "@/components/public/home-search";
import { MobileNeedFinder } from "@/components/public/mobile-need-finder";
import { NewsPreview } from "@/components/public/news-preview";
import { ShopGridSkeleton } from "@/components/public/shop-grid";
import { Reveal } from "@/components/public/motion";
import { WeekFeatured } from "@/components/public/week-featured";
import { parsePage, SHOPS_PAGE_SIZE } from "@/lib/pagination";
import { getResolvedSiteConfig } from "@/lib/site-settings";

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

  const [
    filterResult,
    shopsResult,
    promoResult,
    categoryStatsResult,
    featuredResult,
    weekResult,
    newsResult,
    siteConfig,
  ] = await Promise.all([
    getFilterOptions({ category, vehicleType, brand }),
    getShops({ category, vehicleType, brand, q, page, pageSize: SHOPS_PAGE_SIZE }),
    getActivePromoSlides(),
    getCategoryStats(),
    getFeaturedShops(),
    getShopOfTheWeek(),
    getPublishedNews(6),
    getResolvedSiteConfig(),
  ]);

  const filterOptions = filterResult.success
    ? filterResult.data
    : { categories: [], vehicleTypes: [], brands: [] };

  const shopPage = shopsResult.success
    ? shopsResult.data
    : { items: [], total: 0, page: 1, pageSize: SHOPS_PAGE_SIZE, totalPages: 1 };
  const promoSlides = promoResult.success ? promoResult.data : [];
  const categoryStats = categoryStatsResult.success ? categoryStatsResult.data : [];
  const featuredShops = featuredResult.success ? featuredResult.data : [];
  const weekShop = weekResult.success ? weekResult.data : null;
  const newsPosts = newsResult.success ? newsResult.data : [];
  const hasFilters = !!(category || vehicleType || brand || q);

  return (
    <>
      <Suspense fallback={<HomeHeroSkeleton />}>
        <HomeHero categories={categoryStats} slides={promoSlides} />
      </Suspense>

      <Suspense
        fallback={
          <div className="border-b border-border bg-[#1e4b8f] px-4 py-8">
            <div className="mx-auto h-28 max-w-2xl animate-pulse rounded-2xl bg-white/15" />
          </div>
        }
      >
        <HomeSearch
          totalShops={shopPage.total || featuredShops.length}
          shopNames={[
            ...shopPage.items.map((shop) => shop.name),
            ...featuredShops.map((shop) => shop.name),
          ]}
          categories={filterOptions.categories}
          vehicleTypes={filterOptions.vehicleTypes}
          brands={filterOptions.brands}
        />
      </Suspense>

      <Suspense fallback={null}>
        <MobileNeedFinder />
      </Suspense>

      <WeekFeatured shop={weekShop} />

      <FeaturedShops shops={featuredShops} />

      <NewsPreview posts={newsPosts} />

      <AdCtaBanner adEmail={siteConfig.adEmail} />

      <section
        id="rehber"
        className="mx-auto w-full max-w-7xl space-y-5 px-4 py-8 sm:px-6 lg:px-8"
      >
        <Reveal>
          <h2 className="text-title">Arama sonuçları</h2>
          <p className="mt-1 text-body">
            İstersen kategori, araç tipi veya marka ile daralt
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
        </Suspense>
      </section>
    </>
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
