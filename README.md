# Sanayi Rehberi — Geliştirme Notları

## Kurulum

```bash
npm install
cp .env.example .env
# .env içinde DATABASE_URL ve AUTH_SECRET değerlerini düzenleyin

npm run db:push      # veya: npm run db:migrate
npm run db:seed      # örnek veri + admin hesabı
npm run dev
```

## Server Actions

Tüm veritabanı işlemleri `actions/` klasöründe:

| Dosya | Fonksiyonlar |
|---|---|
| `actions/shops.ts` | `getShops`, `getShopBySlug`, `createShop`, `updateShop`, `deleteShop` |
| `actions/categories.ts` | `getCategories`, `createCategory`, `updateCategory`, `deleteCategory` |
| `actions/vehicle-types.ts` | `getVehicleTypes`, `createVehicleType`, ... |
| `actions/brands.ts` | `getBrands`, `createBrand`, ... |
| `actions/promo-slides.ts` | `getActivePromoSlides`, `createPromoSlideFromInput`, ... |
| `actions/news.ts` | `getPublishedNews`, `createNewsFromInput`, ... |
| `actions/contact.ts` | `submitContactForm`, `getContactMessages`, ... |
| `actions/settings.ts` | `getSiteSettings`, `updateSiteSettings` |
| `actions/account.ts` | `changeAdminPassword` |

Mutation action'lar `requireAdmin()` ile korunur.

### Filtreleme / arama örneği

```ts
const result = await getShops({
  category: "motor-ustasi",
  vehicleType: "otomobil",
  brand: "volkswagen",
  q: "yılmaz",
  page: 1,
});
```

URL slug'ları `lib/utils.ts` içindeki `slugify()` ile otomatik üretilir.

## Admin Paneli

- URL: `/admin`
- Giriş: `/admin/login`
- Varsayılan admin (seed): `admin@sanayi.local` / `admin123`

### Admin sayfaları

| Route | Açıklama |
|---|---|
| `/admin` | Dashboard — istatistik kartları |
| `/admin/shops` | Dükkan listesi (arama + sayfalama) |
| `/admin/shops/new` | Yeni dükkan (fotoğraf galerisi, WhatsApp, saatler, harita) |
| `/admin/shops/[id]/edit` | Dükkan düzenleme |
| `/admin/promo-slides` | Reklam slider yönetimi (görsel + gradient) |
| `/admin/news` | Haber / duyuru yönetimi (kapak görseli) |
| `/admin/messages` | İletişim mesajları (arama, toplu okundu) |
| `/admin/settings` | Site ayarları + şifre değiştirme |
| `/admin/categories` | Kategori CRUD |
| `/admin/vehicle-types` | Araç tipi CRUD |
| `/admin/brands` | Marka CRUD |

## Public Arayüz

- Ana sayfa: filtre + firma arama + sayfalama (`/?q=...&page=2#rehber`)
- Dükkan detay: `/dukkan/[slug]`
- Haberler: `/haberler`, `/haberler/[slug]`
- İletişim formu: honeypot + rate limit; opsiyonel Resend bildirimi

Ana sayfa slider içeriği admin panelinden (`/admin/promo-slides`) yönetilir.

## Görsel Yükleme

Admin oturumu gerekir. Endpoint: `/api/upload/[folder]`  
Klasörler: `news`, `shops`, `promo` → `public/uploads/...`
