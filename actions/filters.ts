"use server";

import { unstable_cache } from "next/cache";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { prisma } from "@/lib/db";
import { failure, getErrorMessage, success } from "@/lib/utils";

export type FilterOptionWithCount = {
  id: string;
  name: string;
  slug: string;
  count: number;
};

function buildShopWhere(filters: {
  category?: string;
  vehicleType?: string;
  brand?: string;
  exclude?: "category" | "vehicleType" | "brand";
}) {
  const { category, vehicleType, brand, exclude } = filters;

  return {
    AND: [
      category && exclude !== "category"
        ? { categories: { some: { category: { slug: category } } } }
        : {},
      vehicleType && exclude !== "vehicleType"
        ? { vehicleTypes: { some: { vehicleType: { slug: vehicleType } } } }
        : {},
      brand && exclude !== "brand"
        ? { brands: { some: { brand: { slug: brand } } } }
        : {},
    ],
  };
}

async function loadFilterOptions(filters: {
  category?: string;
  vehicleType?: string;
  brand?: string;
}) {
  const { category, vehicleType, brand } = filters;
  const hasFilters = Boolean(category || vehicleType || brand);

  // Filtresiz: düz sayım (daha ucuz). Filtreliyken nested where.
  const [categories, vehicleTypes, brands] = await Promise.all([
    prisma.category.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: {
            shops: hasFilters
              ? {
                  where: {
                    shop: buildShopWhere({
                      category,
                      vehicleType,
                      brand,
                      exclude: "category",
                    }),
                  },
                }
              : true,
          },
        },
      },
    }),
    prisma.vehicleType.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: {
            shops: hasFilters
              ? {
                  where: {
                    shop: buildShopWhere({
                      category,
                      vehicleType,
                      brand,
                      exclude: "vehicleType",
                    }),
                  },
                }
              : true,
          },
        },
      },
    }),
    prisma.brand.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: {
            shops: hasFilters
              ? {
                  where: {
                    shop: buildShopWhere({
                      category,
                      vehicleType,
                      brand,
                      exclude: "brand",
                    }),
                  },
                }
              : true,
          },
        },
      },
    }),
  ]);

  const mapWithCount = (
    items: { id: string; name: string; slug: string; _count: { shops: number } }[],
  ): FilterOptionWithCount[] =>
    items.map((item) => ({
      id: item.id,
      name: item.name,
      slug: item.slug,
      count: item._count.shops,
    }));

  return {
    categories: mapWithCount(categories),
    vehicleTypes: mapWithCount(vehicleTypes),
    brands: mapWithCount(brands),
  };
}

export async function getFilterOptions(filters?: {
  category?: string;
  vehicleType?: string;
  brand?: string;
}) {
  try {
    const category = filters?.category;
    const vehicleType = filters?.vehicleType;
    const brand = filters?.brand;
    const cacheKey = [
      "filter-options-v2",
      category ?? "",
      vehicleType ?? "",
      brand ?? "",
    ];

    const data = await unstable_cache(
      () => loadFilterOptions({ category, vehicleType, brand }),
      cacheKey,
      { revalidate: 60, tags: [CACHE_TAGS.filters] },
    )();

    return success(data);
  } catch (error) {
    return failure(getErrorMessage(error));
  }
}
