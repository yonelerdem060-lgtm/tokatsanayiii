import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import {
  CATALOG_ALL_BRANDS,
  CATALOG_CATEGORIES,
  CATALOG_VEHICLE_TYPES,
} from "@/lib/catalog";
import { slugify } from "@/lib/utils";

const prisma = new PrismaClient();

async function upsertCatalogItems() {
  for (const name of CATALOG_CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: slugify(name) },
      update: { name },
      create: { name, slug: slugify(name) },
    });
  }

  for (const name of CATALOG_VEHICLE_TYPES) {
    await prisma.vehicleType.upsert({
      where: { slug: slugify(name) },
      update: { name },
      create: { name, slug: slugify(name) },
    });
  }

  for (const name of CATALOG_ALL_BRANDS) {
    await prisma.brand.upsert({
      where: { slug: slugify(name) },
      update: { name },
      create: { name, slug: slugify(name) },
    });
  }
}

async function getRefs() {
  const bySlug = async <T extends { slug: string }>(
    model: { findUniqueOrThrow: (args: { where: { slug: string } }) => Promise<T> },
    slug: string,
  ) => model.findUniqueOrThrow({ where: { slug } });

  return {
    motor: await bySlug(prisma.category, "motor-ustasi"),
    yedek: await bySlug(prisma.category, "yedek-parca"),
    kaporta: await bySlug(prisma.category, "kaportaci"),
    boya: await bySlug(prisma.category, "boya-badana"),
    elektrik: await bySlug(prisma.category, "elektrik-elektronik"),
    lastik: await bySlug(prisma.category, "lastik-jant"),
    mobilya: await bySlug(prisma.category, "mobilya"),
    kereste: await bySlug(prisma.category, "kereste-ahsap"),
    marangoz: await bySlug(prisma.category, "marangoz-dograma"),
    otomobil: await bySlug(prisma.vehicleType, "otomobil"),
    kamyonet: await bySlug(prisma.vehicleType, "kamyonet"),
    tir: await bySlug(prisma.vehicleType, "tir"),
    traktor: await bySlug(prisma.vehicleType, "traktor"),
    agirVasita: await bySlug(prisma.vehicleType, "agir-vasita"),
    vw: await bySlug(prisma.brand, "volkswagen"),
    ford: await bySlug(prisma.brand, "ford"),
    fiat: await bySlug(prisma.brand, "fiat"),
    renault: await bySlug(prisma.brand, "renault"),
    mercedes: await bySlug(prisma.brand, "mercedes-benz"),
    scania: await bySlug(prisma.brand, "scania"),
    johnDeere: await bySlug(prisma.brand, "john-deere"),
    newHolland: await bySlug(prisma.brand, "new-holland"),
  };
}

async function seedShops() {
  const r = await getRefs();

  const shops = [
    {
      id: "seed-shop-1",
      name: "Yılmaz Motor",
      description: "Volkswagen ve Ford otomobil motor tamiri, revizyon",
      address: "Tokat Sanayi Sitesi A Blok No:12",
      phone: "0356 123 45 67",
      isFeatured: true,
      categoryIds: [r.motor.id],
      vehicleTypeIds: [r.otomobil.id],
      brandIds: [r.vw.id, r.ford.id],
    },
    {
      id: "seed-shop-2",
      name: "Demir Yedek Parça",
      description: "Traktör ve tarım makinesi yedek parça satışı",
      address: "Tokat Sanayi Sitesi C Blok No:5",
      phone: "0356 987 65 43",
      isFeatured: false,
      categoryIds: [r.yedek.id],
      vehicleTypeIds: [r.traktor.id],
      brandIds: [r.johnDeere.id, r.newHolland.id, r.ford.id],
    },
    {
      id: "seed-shop-3",
      name: "Özkan Kaporta Boya",
      description: "Otomobil ve kamyonet kaporta, boya ve badana",
      address: "Tokat Sanayi Sitesi B Blok No:8",
      phone: "0356 234 56 78",
      isFeatured: true,
      categoryIds: [r.kaporta.id, r.boya.id],
      vehicleTypeIds: [r.otomobil.id, r.kamyonet.id],
      brandIds: [r.fiat.id, r.renault.id, r.vw.id],
    },
    {
      id: "seed-shop-4",
      name: "Akın Tır Servisi",
      description: "Tır ve ağır vasıta motor, şanzıman ve fren bakımı",
      address: "Tokat Sanayi Sitesi D Blok No:3",
      phone: "0356 345 67 89",
      isFeatured: true,
      categoryIds: [r.motor.id, r.elektrik.id],
      vehicleTypeIds: [r.tir.id, r.agirVasita.id],
      brandIds: [r.mercedes.id, r.scania.id],
    },
    {
      id: "seed-shop-5",
      name: "Kaya Lastik Jant",
      description: "Otomobil, kamyonet ve ticari araç lastik & jant",
      address: "Tokat Sanayi Sitesi E Blok No:15",
      phone: "0356 456 78 90",
      isFeatured: false,
      categoryIds: [r.lastik.id],
      vehicleTypeIds: [r.otomobil.id, r.kamyonet.id, r.tir.id],
      brandIds: [r.ford.id, r.renault.id, r.mercedes.id],
    },
    {
      id: "seed-shop-6",
      name: "Tokat Mobilya Atölyesi",
      description: "Özel ölçü mutfak, dolap ve yatak odası mobilyası imalatı",
      address: "Tokat Sanayi Sitesi F Blok No:2 — Mobilya Bölgesi",
      phone: "0356 567 89 01",
      isFeatured: true,
      categoryIds: [r.mobilya.id],
      vehicleTypeIds: [],
      brandIds: [],
    },
    {
      id: "seed-shop-7",
      name: "Yeşil Kereste Ticaret",
      description: "Kereste, kontrplak, MDF ve ahşap levha satışı",
      address: "Tokat Sanayi Sitesi F Blok No:8 — Kereste Bölgesi",
      phone: "0356 678 90 12",
      isFeatured: true,
      categoryIds: [r.kereste.id],
      vehicleTypeIds: [],
      brandIds: [],
    },
    {
      id: "seed-shop-8",
      name: "Anadolu Marangoz & Doğrama",
      description: "Kapı, pencere doğrama, ahşap merdiven ve parke uygulaması",
      address: "Tokat Sanayi Sitesi G Blok No:4 — Marangoz Bölgesi",
      phone: "0356 789 01 23",
      isFeatured: false,
      categoryIds: [r.marangoz.id, r.mobilya.id],
      vehicleTypeIds: [],
      brandIds: [],
    },
  ] as const;

  for (const shop of shops) {
    await prisma.shopCategory.deleteMany({ where: { shopId: shop.id } });
    await prisma.shopVehicleType.deleteMany({ where: { shopId: shop.id } });
    await prisma.shopBrand.deleteMany({ where: { shopId: shop.id } });

    await prisma.shop.upsert({
      where: { id: shop.id },
      update: {
        name: shop.name,
        slug: slugify(shop.name) || shop.id,
        description: shop.description,
        address: shop.address,
        phone: shop.phone,
        isFeatured: shop.isFeatured,
        categories: {
          create: shop.categoryIds.map((categoryId) => ({ categoryId })),
        },
        vehicleTypes: {
          create: shop.vehicleTypeIds.map((vehicleTypeId) => ({ vehicleTypeId })),
        },
        brands: {
          create: shop.brandIds.map((brandId) => ({ brandId })),
        },
      },
      create: {
        id: shop.id,
        name: shop.name,
        slug: slugify(shop.name) || shop.id,
        description: shop.description,
        address: shop.address,
        phone: shop.phone,
        isFeatured: shop.isFeatured,
        categories: {
          create: shop.categoryIds.map((categoryId) => ({ categoryId })),
        },
        vehicleTypes: {
          create: shop.vehicleTypeIds.map((vehicleTypeId) => ({ vehicleTypeId })),
        },
        brands: {
          create: shop.brandIds.map((brandId) => ({ brandId })),
        },
      },
    });
  }
}

async function main() {
  await upsertCatalogItems();
  await seedShops();

  const promoSlides = [
    {
      id: "seed-promo-hero-1",
      badge: "Duyuru",
      title: "Üretimin Gücü, Tokat’ın Geleceği",
      subtitle: "Tokat Sanayi Sitesi",
      description:
        "Güçlü altyapı, geniş hizmet ağı ve köklü geçmişiyle üretimin ve istihdamın buluşma noktası.",
      ctaText: "Firma Rehberi",
      ctaHref: "/#rehber",
      image: "/slides/tokat-sanayi-hero-1.png",
      gradient: "from-slate-900 via-slate-800 to-zinc-900",
      accent: "text-amber-200",
      sortOrder: 0,
      isActive: true,
    },
    {
      id: "seed-promo-hero-2",
      badge: "Duyuru",
      title: "Tokat Sanayi Sitesi",
      subtitle: "Birlikte üretiyor, geleceği inşa ediyoruz",
      description:
        "Modern altyapı, güçlü sanayici ve stratejik konum ile sürekli gelişen sanayi sitesi.",
      ctaText: "Keşfet",
      ctaHref: "/hakkimizda",
      image: "/slides/tokat-sanayi-hero-2.png",
      gradient: "from-slate-900 via-amber-900 to-slate-900",
      accent: "text-amber-200",
      sortOrder: 1,
      isActive: true,
    },
    {
      id: "seed-promo-hero-3",
      badge: "Duyuru",
      title: "Tokat Sanayi Sitesi",
      subtitle: "Üreten Tokat, güçlü gelecek",
      description: "Modern atölyeler, temiz altyapı ve güçlü sanayi ekosistemi.",
      ctaText: "Firma Rehberi",
      ctaHref: "/#rehber",
      image: "/slides/tokat-sanayi-hero-3.jpg",
      gradient: "from-amber-900 via-slate-800 to-slate-900",
      accent: "text-amber-200",
      sortOrder: 2,
      isActive: true,
    },
    {
      id: "seed-promo-1",
      badge: "Reklam",
      title: "Yılmaz Motor — %20 İndirim",
      subtitle: "Motor bakım & revizyon kampanyası",
      description:
        "Volkswagen ve Ford araçlarınız için bu ay özel fiyatlar. Sanayi Sitesi A Blok No:12",
      ctaText: "Dükkanı Gör",
      ctaHref: "/?category=motor-ustasi&vehicleType=otomobil",
      image: null as string | null,
      gradient: "from-blue-700 via-blue-600 to-indigo-700",
      accent: "text-blue-200",
      sortOrder: 3,
      isActive: true,
    },
    {
      id: "seed-promo-2",
      badge: "Sponsorlu",
      title: "Demir Yedek Parça",
      subtitle: "Traktör yedek parçada stok fazlası",
      description:
        "John Deere ve New Holland traktör parçalarında kampanya. Hemen arayın, aynı gün teslim.",
      ctaText: "Hemen Ara",
      ctaHref: "tel:03569876543",
      image: null as string | null,
      gradient: "from-emerald-700 via-teal-600 to-cyan-700",
      accent: "text-emerald-200",
      sortOrder: 4,
      isActive: true,
    },
    {
      id: "seed-promo-3",
      badge: "Duyuru",
      title: "Sanayi Sitesi Rehberi",
      subtitle: "Kategori, araç tipi ve marka ile filtreleyin",
      description:
        "Otomobil, kamyonet, tır, traktör ve daha fazlası — aradığınız ustayı saniyeler içinde bulun.",
      ctaText: "Filtrele",
      ctaHref: "/?vehicleType=otomobil",
      image: null as string | null,
      gradient: "from-slate-800 via-slate-700 to-zinc-800",
      accent: "text-slate-300",
      sortOrder: 5,
      isActive: true,
    },
  ];

  for (const slide of promoSlides) {
    await prisma.promoSlide.upsert({
      where: { id: slide.id },
      update: slide,
      create: slide,
    });
  }

  const newsPosts = [
    {
      id: "seed-news-1",
      title: "Tokat Sanayi Sitesi Rehberi Yayında",
      slug: "tokat-sanayi-sitesi-rehberi-yayinda",
      excerpt:
        "Esnaf ve müşterilerimiz için kategori, marka ve araç tipi bazlı dijital rehber platformumuz hizmete girdi.",
      content:
        "Tokat Sanayi Sitesi Rehberi, esnafımızı dijital ortamda görünür kılmak ve müşterilerin aradıkları ustayı kolayca bulmasını sağlamak amacıyla hayata geçirildi.\n\nPlatform üzerinden motor ustası, yedek parça, kaportacı ve daha birçok kategorideki işletmelere anında ulaşabilirsiniz.",
      isPublished: true,
      publishedAt: new Date("2025-05-09"),
    },
    {
      id: "seed-news-2",
      title: "Yeni Yönetim Dönemi Başladı",
      slug: "yeni-yonetim-donemi-basladi",
      excerpt:
        "Sanayi sitemiz yeni yönetim anlayışıyla gelişmiş ve güçlü bir döneme adım atıyor.",
      content:
        "Yeni bir yönetim anlayışıyla gelişmiş ve güçlü Tokat Sanayi Sitesi için yola çıktık.",
      isPublished: true,
      publishedAt: new Date("2025-01-27"),
    },
  ];

  for (const post of newsPosts) {
    await prisma.newsPost.upsert({
      where: { id: post.id },
      update: post,
      create: post,
    });
  }

  const adminUsername = process.env.ADMIN_USERNAME ?? "admin";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "admin123";
  const hashedPassword = await bcrypt.hash(adminPassword, 12);

  await prisma.user.deleteMany({
    where: { email: "admin@sanayi.local" },
  });

  await prisma.user.upsert({
    where: { email: adminUsername },
    update: {
      name: "Admin",
      password: hashedPassword,
      role: "ADMIN",
    },
    create: {
      email: adminUsername,
      name: "Admin",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  const presidentUsername = process.env.PRESIDENT_USERNAME ?? "baskan";
  const presidentPassword = process.env.PRESIDENT_PASSWORD ?? "baskan123";
  const presidentHashed = await bcrypt.hash(presidentPassword, 12);

  await prisma.user.upsert({
    where: { email: presidentUsername },
    update: {
      name: "Sanayi Başkanı",
      password: presidentHashed,
      role: "PRESIDENT",
    },
    create: {
      email: presidentUsername,
      name: "Sanayi Başkanı",
      password: presidentHashed,
      role: "PRESIDENT",
    },
  });

  console.log("Seed tamamlandı.");
  console.log(`Kategoriler: ${CATALOG_CATEGORIES.length}`);
  console.log(`Araç tipleri: ${CATALOG_VEHICLE_TYPES.length}`);
  console.log(`Markalar: ${CATALOG_ALL_BRANDS.length}`);
  console.log(`Admin: ${adminUsername} / ${adminPassword}`);
  console.log(`Başkan: ${presidentUsername} / ${presidentPassword}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
