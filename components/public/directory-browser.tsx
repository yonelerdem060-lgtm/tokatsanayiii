"use client";

import {
  FilterBar,
  type FilterOptionWithCount,
} from "@/components/public/filter-bar";
import {
  ShopGrid,
  ShopGridSkeleton,
  type ShopCardData,
} from "@/components/public/shop-grid";
import { useCallback, useState } from "react";

interface DirectoryBrowserProps {
  categories: FilterOptionWithCount[];
  vehicleTypes: FilterOptionWithCount[];
  brands: FilterOptionWithCount[];
  suggestions: string[];
  shops: ShopCardData[];
  hasFilters: boolean;
  total: number;
  page: number;
  totalPages: number;
  searchQuery?: string;
}

/** FilterBar + ShopGrid; shows grid skeletons while filters navigate. */
export function DirectoryBrowser({
  categories,
  vehicleTypes,
  brands,
  suggestions,
  shops,
  hasFilters,
  total,
  page,
  totalPages,
  searchQuery,
}: DirectoryBrowserProps) {
  const [isPending, setIsPending] = useState(false);
  const onPendingChange = useCallback((pending: boolean) => {
    setIsPending(pending);
  }, []);

  return (
    <div className="space-y-5">
      <FilterBar
        categories={categories}
        vehicleTypes={vehicleTypes}
        brands={brands}
        resultCount={total}
        suggestions={suggestions}
        onPendingChange={onPendingChange}
      />

      {isPending ? (
        <ShopGridSkeleton count={6} />
      ) : (
        <ShopGrid
          shops={shops}
          hasFilters={hasFilters}
          total={total}
          page={page}
          totalPages={totalPages}
          searchQuery={searchQuery}
        />
      )}
    </div>
  );
}
