"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/db";
import { SHOPS_PAGE_SIZE, getTotalPages } from "@/lib/pagination";
import { deleteUploadedFile } from "@/lib/uploads";
import { failure, getErrorMessage, slugify, success } from "@/lib/utils";
import { shopFilterSchema, shopSchema } from "@/lib/validations";
import type { Prisma } from "@prisma/client";

const shopInclude = {
  categories: { include: { category: true } },
  vehicleTypes: { include: { vehicleType: true } },
  brands: { include: { brand: true } },
  images: { orderBy: { sortOrder: "asc" as const } },
} as const;

function formatShop(shop: {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  address: string;
  phone: string;
  whatsapp: string | null;
  workingHours: string | null;
  mapUrl: string | null;
  image: string | null;
  isFeatured: boolean;
  featuredSortOrder: number;
  isShopOfWeek: boolean;
  viewCount: number;
  phoneClickCount: number;
  whatsappClickCount: number;
  createdAt: Date;
  updatedAt: Date;
  categories: { category: { id: string; name: string; slug: string } }[];
  vehicleTypes: { vehicleType: { id: string; name: string; slug: string } }[];
  brands: { brand: { id: string; name: string; slug: string } }[];
  images: { id: string; url: string; sortOrder: number }[];
}) {
  const gallery = shop.images.map((item) => item.url);
  const cover = shop.image || gallery[0] || null;

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
    image: cover,
    gallery,
    isFeatured: shop.isFeatured,
    featuredSortOrder: shop.featuredSortOrder,
    isShopOfWeek: shop.isShopOfWeek,
    viewCount: shop.viewCount,
    phoneClickCount: shop.phoneClickCount,
    whatsappClickCount: shop.whatsappClickCount,
    createdAt: shop.createdAt,
    updatedAt: shop.updatedAt,
    categories: shop.categories.map((item) => item.category),
    vehicleTypes: shop.vehicleTypes.map((item) => item.vehicleType),
    brands: shop.brands.map((item) => item.brand),
  };
}

async function uniqueShopSlug(name: string, excludeId?: string) {
  let base = slugify(name);
  if (!base) base = "dukkan";
  let slug = base;
  let counter = 1;

  while (true) {
    const existing = await prisma.shop.findUnique({ where: { slug } });
    if (!existing || existing.id === excludeId) break;
    slug = `${base}-${counter++}`;
  }

  return slug;
}

function buildShopWhere(filters: {
  category?: string;
  vehicleType?: string;
  brand?: string;
  q?: string;
}): Prisma.ShopWhereInput {
  const query = filters.q?.trim();

  return {
    AND: [
      filters.category
        ? { categories: { some: { category: { slug: filters.category } } } }
        : {},
      filters.vehicleType
        ? { vehicleTypes: { some: { vehicleType: { slug: filters.vehicleType } } } }
        : {},
      filters.brand ? { brands: { some: { brand: { slug: filters.brand } } } } : {},
      query
        ? {
            OR: [
              { name: { contains: query } },
              { phone: { contains: query } },
              { address: { contains: query } },
              { description: { contains: query } },
              { whatsapp: { contains: query } },
            ],
          }
        : {},
    ],
  };
}

async function syncShopGallery(shopId: string, gallery: string[], cover: string | null) {
  const uniqueGallery = [...new Set(gallery.filter(Boolean))];
  const image =
    cover && uniqueGallery.includes(cover)
      ? cover
      : cover || uniqueGallery[0] || null;

  const ordered = image
    ? [image, ...uniqueGallery.filter((url) => url !== image)]
    : uniqueGallery;

  await prisma.shopImage.deleteMany({ where: { shopId } });
  if (ordered.length > 0) {
    await prisma.shopImage.createMany({
      data: ordered.map((url, index) => ({
        shopId,
        url,
        sortOrder: index,
      })),
    });
  }

  return image;
}

export async function getShops(filters?: {
  category?: string;
  vehicleType?: string;
  brand?: string;
  q?: string;
  page?: number;
  pageSize?: number;
}) {
  try {
    const parsed = shopFilterSchema.safeParse(filters ?? {});
    if (!parsed.success) {
      return failure("Geçersiz filtre parametreleri.");
    }

    const { category, vehicleType, brand, q, page, pageSize } = parsed.data;
    const take = pageSize ?? SHOPS_PAGE_SIZE;
    const currentPage = page ?? 1;
    const where = buildShopWhere({ category, vehicleType, brand, q });

    const [total, shops] = await Promise.all([
      prisma.shop.count({ where }),
      prisma.shop.findMany({
        where,
        include: shopInclude,
        orderBy: { name: "asc" },
        skip: (currentPage - 1) * take,
        take,
      }),
    ]);

    return success({
      items: shops.map(formatShop),
      total,
      page: currentPage,
      pageSize: take,
      totalPages: getTotalPages(total, take),
    });
  } catch (error) {
    return failure(getErrorMessage(error));
  }
}

export async function getShopsByCategorySlugs(
  categorySlugs: readonly string[],
  filters?: { category?: string; q?: string; page?: number; pageSize?: number },
) {
  try {
    if (categorySlugs.length === 0) {
      return success({
        items: [],
        total: 0,
        page: 1,
        pageSize: SHOPS_PAGE_SIZE,
        totalPages: 1,
      });
    }

    const activeCategory = filters?.category;
    const slugs: string[] = activeCategory
      ? categorySlugs.includes(activeCategory)
        ? [activeCategory]
        : [...categorySlugs]
      : [...categorySlugs];

    const query = filters?.q?.trim();
    const take = filters?.pageSize ?? SHOPS_PAGE_SIZE;
    const currentPage = filters?.page ?? 1;
    const where: Prisma.ShopWhereInput = {
      AND: [
        {
          categories: {
            some: {
              category: { slug: { in: slugs } },
            },
          },
        },
        query
          ? {
              OR: [
                { name: { contains: query } },
                { phone: { contains: query } },
                { address: { contains: query } },
                { description: { contains: query } },
              ],
            }
          : {},
      ],
    };

    const [total, shops] = await Promise.all([
      prisma.shop.count({ where }),
      prisma.shop.findMany({
        where,
        include: shopInclude,
        orderBy: { name: "asc" },
        skip: (currentPage - 1) * take,
        take,
      }),
    ]);

    return success({
      items: shops.map(formatShop),
      total,
      page: currentPage,
      pageSize: take,
      totalPages: getTotalPages(total, take),
    });
  } catch (error) {
    return failure(getErrorMessage(error));
  }
}

export async function getShopById(id: string) {
  try {
    const shop = await prisma.shop.findUnique({
      where: { id },
      include: shopInclude,
    });

    if (!shop) {
      return failure("Dükkan bulunamadı.");
    }

    return success(formatShop(shop));
  } catch (error) {
    return failure(getErrorMessage(error));
  }
}

export async function getShopBySlug(slug: string) {
  try {
    const shop = await prisma.shop.findUnique({
      where: { slug },
      include: shopInclude,
    });

    if (!shop) {
      return failure("Dükkan bulunamadı.");
    }

    return success(formatShop(shop));
  } catch (error) {
    return failure(getErrorMessage(error));
  }
}

export async function createShop(formData: FormData) {
  try {
    await requireAdmin();

    const galleryRaw = formData.getAll("gallery").map(String).filter(Boolean);
    const raw = {
      name: String(formData.get("name") ?? ""),
      description: String(formData.get("description") ?? "") || undefined,
      address: String(formData.get("address") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      whatsapp: String(formData.get("whatsapp") ?? "") || null,
      workingHours: String(formData.get("workingHours") ?? "") || null,
      mapUrl: String(formData.get("mapUrl") ?? "") || null,
      image: String(formData.get("image") ?? "") || null,
      gallery: galleryRaw,
      categoryIds: formData.getAll("categoryIds").map(String),
      vehicleTypeIds: formData.getAll("vehicleTypeIds").map(String),
      brandIds: formData.getAll("brandIds").map(String),
      isFeatured: formData.get("isFeatured") === "true",
      featuredSortOrder: Number(formData.get("featuredSortOrder") ?? 0),
      isShopOfWeek: formData.get("isShopOfWeek") === "true",
    };

    const parsed = shopSchema.safeParse(raw);
    if (!parsed.success) {
      return failure(parsed.error.errors[0]?.message ?? "Geçersiz form verisi.");
    }

    const data = parsed.data;
    const slug = await uniqueShopSlug(data.name);

    const shop = await prisma.$transaction(async (tx) => {
      if (data.isShopOfWeek) {
        await tx.shop.updateMany({
          where: { isShopOfWeek: true },
          data: { isShopOfWeek: false },
        });
      }

      const created = await tx.shop.create({
        data: {
          name: data.name,
          slug,
          description: data.description,
          address: data.address,
          phone: data.phone,
          whatsapp: data.whatsapp,
          workingHours: data.workingHours,
          mapUrl: data.mapUrl,
          image: data.image,
          isFeatured: data.isFeatured,
          featuredSortOrder: data.featuredSortOrder,
          isShopOfWeek: data.isShopOfWeek,
          categories: {
            create: data.categoryIds.map((categoryId) => ({ categoryId })),
          },
          vehicleTypes: {
            create: data.vehicleTypeIds.map((vehicleTypeId) => ({ vehicleTypeId })),
          },
          brands: {
            create: data.brandIds.map((brandId) => ({ brandId })),
          },
        },
      });

      return created;
    });

    const cover = await syncShopGallery(shop.id, data.gallery, data.image);
    if (cover !== shop.image) {
      await prisma.shop.update({ where: { id: shop.id }, data: { image: cover } });
    }

    const full = await prisma.shop.findUnique({
      where: { id: shop.id },
      include: shopInclude,
    });

    revalidatePath("/");
    revalidatePath("/mobilya-kereste");
    revalidatePath("/admin/shops");
    if (full) revalidatePath(`/dukkan/${full.slug}`);

    return success(formatShop(full!));
  } catch (error) {
    return failure(getErrorMessage(error));
  }
}

export async function updateShop(id: string, formData: FormData) {
  try {
    await requireAdmin();

    const galleryRaw = formData.getAll("gallery").map(String).filter(Boolean);
    const raw = {
      name: String(formData.get("name") ?? ""),
      description: String(formData.get("description") ?? "") || undefined,
      address: String(formData.get("address") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      whatsapp: String(formData.get("whatsapp") ?? "") || null,
      workingHours: String(formData.get("workingHours") ?? "") || null,
      mapUrl: String(formData.get("mapUrl") ?? "") || null,
      image: String(formData.get("image") ?? "") || null,
      gallery: galleryRaw,
      categoryIds: formData.getAll("categoryIds").map(String),
      vehicleTypeIds: formData.getAll("vehicleTypeIds").map(String),
      brandIds: formData.getAll("brandIds").map(String),
      isFeatured: formData.get("isFeatured") === "true",
      featuredSortOrder: Number(formData.get("featuredSortOrder") ?? 0),
      isShopOfWeek: formData.get("isShopOfWeek") === "true",
    };

    const parsed = shopSchema.safeParse(raw);
    if (!parsed.success) {
      return failure(parsed.error.errors[0]?.message ?? "Geçersiz form verisi.");
    }

    const data = parsed.data;
    const existing = await prisma.shop.findUnique({
      where: { id },
      include: { images: true },
    });
    if (!existing) return failure("Dükkan bulunamadı.");

    const slug =
      slugify(data.name) === slugify(existing.name)
        ? existing.slug
        : await uniqueShopSlug(data.name, id);

    await prisma.$transaction(async (tx) => {
      if (data.isShopOfWeek) {
        await tx.shop.updateMany({
          where: { isShopOfWeek: true, NOT: { id } },
          data: { isShopOfWeek: false },
        });
      }

      await tx.shopCategory.deleteMany({ where: { shopId: id } });
      await tx.shopVehicleType.deleteMany({ where: { shopId: id } });
      await tx.shopBrand.deleteMany({ where: { shopId: id } });

      await tx.shop.update({
        where: { id },
        data: {
          name: data.name,
          slug,
          description: data.description,
          address: data.address,
          phone: data.phone,
          whatsapp: data.whatsapp,
          workingHours: data.workingHours,
          mapUrl: data.mapUrl,
          isFeatured: data.isFeatured,
          featuredSortOrder: data.featuredSortOrder,
          isShopOfWeek: data.isShopOfWeek,
          categories: {
            create: data.categoryIds.map((categoryId) => ({ categoryId })),
          },
          vehicleTypes: {
            create: data.vehicleTypeIds.map((vehicleTypeId) => ({ vehicleTypeId })),
          },
          brands: {
            create: data.brandIds.map((brandId) => ({ brandId })),
          },
        },
      });
    });

    const cover = await syncShopGallery(id, data.gallery, data.image);
    await prisma.shop.update({ where: { id }, data: { image: cover } });

    const previousUrls = new Set(
      [existing.image, ...existing.images.map((item) => item.url)].filter(Boolean) as string[],
    );
    const nextUrls = new Set([cover, ...data.gallery].filter(Boolean) as string[]);
    for (const url of previousUrls) {
      if (!nextUrls.has(url)) {
        await deleteUploadedFile(url);
      }
    }

    const full = await prisma.shop.findUnique({
      where: { id },
      include: shopInclude,
    });

    revalidatePath("/");
    revalidatePath("/mobilya-kereste");
    revalidatePath("/admin/shops");
    revalidatePath(`/admin/shops/${id}/edit`);
    if (full) {
      revalidatePath(`/dukkan/${full.slug}`);
      if (existing.slug !== full.slug) {
        revalidatePath(`/dukkan/${existing.slug}`);
      }
    }

    return success(formatShop(full!));
  } catch (error) {
    return failure(getErrorMessage(error));
  }
}

export async function deleteShop(id: string) {
  try {
    await requireAdmin();

    const existing = await prisma.shop.findUnique({
      where: { id },
      include: { images: true },
    });
    if (!existing) return failure("Dükkan bulunamadı.");

    await prisma.shop.delete({ where: { id } });

    const urls = new Set(
      [existing.image, ...existing.images.map((item) => item.url)].filter(Boolean) as string[],
    );
    for (const url of urls) {
      await deleteUploadedFile(url);
    }

    revalidatePath("/");
    revalidatePath("/mobilya-kereste");
    revalidatePath("/admin/shops");
    revalidatePath(`/dukkan/${existing.slug}`);

    return success(undefined);
  } catch (error) {
    return failure(getErrorMessage(error));
  }
}

export async function createShopFromInput(input: unknown) {
  const formData = new FormData();
  const data = shopSchema.parse(input);

  formData.set("name", data.name);
  if (data.description) formData.set("description", data.description);
  formData.set("address", data.address);
  formData.set("phone", data.phone);
  if (data.whatsapp) formData.set("whatsapp", data.whatsapp);
  if (data.workingHours) formData.set("workingHours", data.workingHours);
  if (data.mapUrl) formData.set("mapUrl", data.mapUrl);
  if (data.image) formData.set("image", data.image);
  data.gallery.forEach((url) => formData.append("gallery", url));
  formData.set("isFeatured", String(data.isFeatured));
  formData.set("featuredSortOrder", String(data.featuredSortOrder));
  formData.set("isShopOfWeek", String(data.isShopOfWeek));
  data.categoryIds.forEach((id) => formData.append("categoryIds", id));
  data.vehicleTypeIds.forEach((id) => formData.append("vehicleTypeIds", id));
  data.brandIds.forEach((id) => formData.append("brandIds", id));

  return createShop(formData);
}

export async function updateShopFromInput(id: string, input: unknown) {
  const formData = new FormData();
  const data = shopSchema.parse(input);

  formData.set("name", data.name);
  if (data.description) formData.set("description", data.description);
  formData.set("address", data.address);
  formData.set("phone", data.phone);
  if (data.whatsapp) formData.set("whatsapp", data.whatsapp);
  if (data.workingHours) formData.set("workingHours", data.workingHours);
  if (data.mapUrl) formData.set("mapUrl", data.mapUrl);
  if (data.image) formData.set("image", data.image);
  data.gallery.forEach((url) => formData.append("gallery", url));
  formData.set("isFeatured", String(data.isFeatured));
  formData.set("featuredSortOrder", String(data.featuredSortOrder));
  formData.set("isShopOfWeek", String(data.isShopOfWeek));
  data.categoryIds.forEach((cid) => formData.append("categoryIds", cid));
  data.vehicleTypeIds.forEach((vid) => formData.append("vehicleTypeIds", vid));
  data.brandIds.forEach((bid) => formData.append("brandIds", bid));

  return updateShop(id, formData);
}
