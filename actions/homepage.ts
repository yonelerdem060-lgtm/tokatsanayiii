"use server";

import { prisma } from "@/lib/db";
import { failure, getErrorMessage, success } from "@/lib/utils";

export async function getCategoryStats() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: { select: { shops: true } },
      },
    });

    return success(
      categories.map((category) => ({
        id: category.id,
        name: category.name,
        slug: category.slug,
        count: category._count.shops,
      })),
    );
  } catch (error) {
    return failure(getErrorMessage(error));
  }
}

export async function getBrandStats() {
  try {
    const brands = await prisma.brand.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: { select: { shops: true } },
      },
    });

    return success(
      brands.map((brand) => ({
        id: brand.id,
        name: brand.name,
        slug: brand.slug,
        count: brand._count.shops,
      })),
    );
  } catch (error) {
    return failure(getErrorMessage(error));
  }
}

export async function getVehicleTypeStats() {
  try {
    const vehicleTypes = await prisma.vehicleType.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: { select: { shops: true } },
      },
    });

    return success(
      vehicleTypes.map((vehicleType) => ({
        id: vehicleType.id,
        name: vehicleType.name,
        slug: vehicleType.slug,
        count: vehicleType._count.shops,
      })),
    );
  } catch (error) {
    return failure(getErrorMessage(error));
  }
}

export async function getFeaturedShops() {
  try {
    const shops = await prisma.shop.findMany({
      where: { isFeatured: true },
      include: {
        categories: { include: { category: true } },
        vehicleTypes: { include: { vehicleType: true } },
        brands: { include: { brand: true } },
        images: { orderBy: { sortOrder: "asc" } },
      },
      orderBy: [{ featuredSortOrder: "asc" }, { name: "asc" }],
      take: 6,
    });

    return success(
      shops.map((shop) => {
        const gallery = shop.images.map((item) => item.url);
        return {
          id: shop.id,
          name: shop.name,
          slug: shop.slug,
          description: shop.description,
          address: shop.address,
          phone: shop.phone,
          whatsapp: shop.whatsapp,
          workingHours: shop.workingHours,
          mapUrl: shop.mapUrl,
          image: shop.image || gallery[0] || null,
          gallery,
          categories: shop.categories.map((item) => item.category),
          vehicleTypes: shop.vehicleTypes.map((item) => item.vehicleType),
          brands: shop.brands.map((item) => item.brand),
        };
      }),
    );
  } catch (error) {
    return failure(getErrorMessage(error));
  }
}

export async function getShopOfTheWeek() {
  try {
    const shop = await prisma.shop.findFirst({
      where: { isShopOfWeek: true },
      include: {
        categories: { include: { category: true } },
        vehicleTypes: { include: { vehicleType: true } },
        brands: { include: { brand: true } },
        images: { orderBy: { sortOrder: "asc" } },
      },
      orderBy: { updatedAt: "desc" },
    });

    if (!shop) return success(null);

    const gallery = shop.images.map((item) => item.url);
    return success({
      id: shop.id,
      name: shop.name,
      slug: shop.slug,
      description: shop.description,
      address: shop.address,
      phone: shop.phone,
      whatsapp: shop.whatsapp,
      image: shop.image || gallery[0] || null,
      categories: shop.categories.map((item) => item.category),
    });
  } catch (error) {
    return failure(getErrorMessage(error));
  }
}
