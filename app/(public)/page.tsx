import { Suspense } from "react";
import { getFilterOptions } from "@/actions/filters";
import { getBrandStats, getCategoryStats, getFeaturedShops, getVehicleTypeStats } from "@/actions/homepage";
import { getPublishedNews } from "@/actions/news";
import { getActivePromoSlides } from "@/actions/promo-slides";
import { getShops } from "@/actions/shops";
import { AdCtaBanner } from "@/components/public/ad-cta-banner";
import { BrandGuide } from "@/components/public/brand-guide";
import { CategoryBrowse } from "@/components/public/category-browse";
import { FeaturedShops } from "@/components/public/featured-shops";
import { FilterBar } from "@/components/public/filter-bar";
import { HeroSearch } from "@/components/public/hero-search";
import { MobilyaKeresteTeaser } from "@/components/public/mobilya-kereste-teaser";
import { NewsPreview } from "@/components/public/news-preview";
import { ShopGrid } from "@/components/public/shop-grid";
import { SponsoredScroll } from "@/components/public/sponsored-scroll";
import { VehicleTypeBrowse } from "@/components/public/vehicle-type-browse";
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
    directoryCountResult,
    promoResult,
    categoryStatsResult,
    brandStatsResult,
    vehicleTypeStatsResult,
    featuredResult,
    newsResult,
    siteConfig,
  ] = await Promise.all([
    getFilterOptions({ category, vehicleType, brand }),
    getShops({ category, vehicleType, brand, q, page, pageSize: SHOPS_PAGE_SIZE }),
    getShops({ page: 1, pageSize: 1 }),
    getActivePromoSlides(),
    getCategoryStats(),
    getBrandStats(),
    getVehicleTypeStats(),
    getFeaturedShops(),
    getPublishedNews(3),
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
  const brandStats = brandStatsResult.success ? brandStatsResult.data : [];
  const vehicleTypeStats = vehicleTypeStatsResult.success ? vehicleTypeStatsResult.data : [];
  const featuredShops = featuredResult.success ? featuredResult.data : [];
  const newsPosts = newsResult.success ? newsResult.data : [];
  const directoryTotal = directoryCountResult.success
    ? directoryCountResult.data.total
    : shopPage.total;
  const hasFilters = !!(category || vehicleType || brand || q);

  return (
    <>
      <Suspense fallback={<HeroSkeleton />}>
        <HeroSearch
          categories={categoryStats}
          vehicleTypes={vehicleTypeStats}
          totalShops={directoryTotal}
        />
      </Suspense>

      <Suspense fallback={null}>
        <CategoryBrowse categories={categoryStats} />
      </Suspense>

      <section className="mx-auto w-full max-w-7xl space-y-5 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <Suspense fallback={<FilterBarSkeleton />}>
          <FilterBar
            categories={filterOptions.categories}
            vehicleTypes={filterOptions.vehicleTypes}
            brands={filterOptions.brands}
            resultCount={shopPage.total}
          />
        </Suspense>

        <ShopGrid
          shops={shopPage.items}
          hasFilters={hasFilters}
          total={shopPage.total}
          page={shopPage.page}
          totalPages={shopPage.totalPages}
          searchQuery={q}
        />
      </section>

      <SponsoredScroll slides={promoSlides} />

      <FeaturedShops shops={featuredShops} />

      <Suspense fallback={null}>
        <VehicleTypeBrowse vehicleTypes={vehicleTypeStats} />
      </Suspense>

      <Suspense fallback={null}>
        <BrandGuide brands={brandStats} />
      </Suspense>

      <NewsPreview posts={newsPosts} />

      <MobilyaKeresteTeaser />

      <AdCtaBanner adEmail={siteConfig.adEmail} />
    </>
  );
}

function FilterBarSkeleton() {
  return (
    <div className="h-[88px] animate-pulse rounded-[20px] border border-border/70 bg-white/80" />
  );
}

function HeroSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      <div className="mx-auto h-40 max-w-3xl animate-pulse rounded-[22px] bg-white/50" />
    </div>
  );
}
