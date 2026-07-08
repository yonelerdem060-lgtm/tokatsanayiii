import { PrismaClient } from "@prisma/client";
import {
  TOKAT_SANAYI_IMPORTED_SHOPS,
  type ImportedShop,
} from "@/lib/tokat-sanayi-import";
import { TOKAT_SANAYI_IMPORTED_SHOPS_BATCH_2 } from "@/lib/tokat-sanayi-import-batch2";
import { TOKAT_SANAYI_IMPORTED_SHOPS_BATCH_3 } from "@/lib/tokat-sanayi-import-batch3";
import { TOKAT_SANAYI_IMPORTED_SHOPS_BATCH_4 } from "@/lib/tokat-sanayi-import-batch4";

const ALL_IMPORTED_SHOPS: ImportedShop[] = [
  ...TOKAT_SANAYI_IMPORTED_SHOPS,
  ...TOKAT_SANAYI_IMPORTED_SHOPS_BATCH_2,
  ...TOKAT_SANAYI_IMPORTED_SHOPS_BATCH_3,
  ...TOKAT_SANAYI_IMPORTED_SHOPS_BATCH_4,
];

const prisma = new PrismaClient();

async function resolveCategoryIds(slugs: string[]) {
  const categories = await prisma.category.findMany({
    where: { slug: { in: slugs } },
    select: { id: true, slug: true },
  });

  const map = new Map(categories.map((c) => [c.slug, c.id]));
  const missing = slugs.filter((slug) => !map.has(slug));

  if (missing.length > 0) {
    throw new Error(`Eksik kategoriler: ${missing.join(", ")}`);
  }

  return slugs.map((slug) => map.get(slug)!);
}

async function resolveVehicleTypeIds(slugs: string[]) {
  if (slugs.length === 0) return [];

  const vehicleTypes = await prisma.vehicleType.findMany({
    where: { slug: { in: slugs } },
    select: { id: true, slug: true },
  });

  const map = new Map(vehicleTypes.map((v) => [v.slug, v.id]));
  return slugs.filter((slug) => map.has(slug)).map((slug) => map.get(slug)!);
}

async function importShop(shop: (typeof TOKAT_SANAYI_IMPORTED_SHOPS)[number]) {
  const categoryIds = await resolveCategoryIds(shop.categories);
  const vehicleTypeIds = await resolveVehicleTypeIds(shop.vehicleTypes ?? []);

  await prisma.shopCategory.deleteMany({ where: { shopId: shop.id } });
  await prisma.shopVehicleType.deleteMany({ where: { shopId: shop.id } });
  await prisma.shopBrand.deleteMany({ where: { shopId: shop.id } });

  await prisma.shop.upsert({
    where: { id: shop.id },
    update: {
      name: shop.name,
      slug: shop.id,
      description: `${shop.description} (Kaynak: ${shop.mapSource})`,
      address: shop.address,
      phone: shop.phone,
      isFeatured: shop.isFeatured ?? false,
      categories: { create: categoryIds.map((categoryId) => ({ categoryId })) },
      vehicleTypes: {
        create: vehicleTypeIds.map((vehicleTypeId) => ({ vehicleTypeId })),
      },
    },
    create: {
      id: shop.id,
      name: shop.name,
      slug: shop.id,
      description: `${shop.description} (Kaynak: ${shop.mapSource})`,
      address: shop.address,
      phone: shop.phone,
      isFeatured: shop.isFeatured ?? false,
      categories: { create: categoryIds.map((categoryId) => ({ categoryId })) },
      vehicleTypes: {
        create: vehicleTypeIds.map((vehicleTypeId) => ({ vehicleTypeId })),
      },
    },
  });
}

async function main() {
  let imported = 0;

  for (const shop of ALL_IMPORTED_SHOPS) {
    await importShop(shop);
    imported++;
  }

  console.log(`Harita kaynaklı ${imported} işletme sisteme kaydedildi.`);
  console.log(
    `  1. tur: ${TOKAT_SANAYI_IMPORTED_SHOPS.length} | 2. tur: ${TOKAT_SANAYI_IMPORTED_SHOPS_BATCH_2.length} | 3. tur: ${TOKAT_SANAYI_IMPORTED_SHOPS_BATCH_3.length} | 4. tur (grid): ${TOKAT_SANAYI_IMPORTED_SHOPS_BATCH_4.length}`,
  );
  console.log("Kaynak: Yandex Maps / Google Maps (Tokat Sanayi Sitesi, Yeniyurt Mah.)");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
