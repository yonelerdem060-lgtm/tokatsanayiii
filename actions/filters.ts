"use server";

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

export async function getFilterOptions(filters?: {
  category?: string;
  vehicleType?: string;
  brand?: string;
}) {
  try {
    const { category, vehicleType, brand } = filters ?? {};

    const [categories, vehicleTypes, brands] = await Promise.all([
      prisma.category.findMany({
        orderBy: { name: "asc" },
        include: {
          _count: {
            select: {
              shops: {
                where: {
                  shop: buildShopWhere({ category, vehicleType, brand, exclude: "category" }),
                },
              },
            },
          },
        },
      }),
      prisma.vehicleType.findMany({
        orderBy: { name: "asc" },
        include: {
          _count: {
            select: {
              shops: {
                where: {
                  shop: buildShopWhere({ category, vehicleType, brand, exclude: "vehicleType" }),
                },
              },
            },
          },
        },
      }),
      prisma.brand.findMany({
        orderBy: { name: "asc" },
        include: {
          _count: {
            select: {
              shops: {
                where: {
                  shop: buildShopWhere({ category, vehicleType, brand, exclude: "brand" }),
                },
              },
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

    return success({
      categories: mapWithCount(categories),
      vehicleTypes: mapWithCount(vehicleTypes),
      brands: mapWithCount(brands),
    });
  } catch (error) {
    return failure(getErrorMessage(error));
  }
}
