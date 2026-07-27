# Tokat Sanayi Sitesi Rehberi

Tokat Sanayi Sitesi için geliştirilmiş dijital rehber platformu. Esnaf ve müşteriler; kategori, araç tipi, marka ve metin araması ile firmalara hızlıca ulaşır. Telefon, WhatsApp, adres ve çalışma saatleri tek ekranda sunulur.

**Canlı repo:** [github.com/bariscanyonel60/sanaitokattttt](https://github.com/bariscanyonel60/sanaitokattttt)

---

## Özellikler

### Ziyaretçi (public)
- Ana sayfa arama ve filtreleme (kategori, araç tipi, marka, firma adı/telefon/adres)
- Mobil uyumlu arayüz: sticky arama, filtre paneli, alt navigasyon
- Dükkan kartlarında tek tıkla **Ara** ve **WhatsApp**
- Dükkan detay sayfası (`/dukkan/[slug]`) — galeri, harita, çalışma saatleri
- Popüler kategoriler, araç tipleri, marka rehberi
- Sponsorlu kampanyalar ve öne çıkan firmalar
- Haber / duyuru bölümü
- Mobilya & Kereste bölgesi sayfası
- İletişim formu (honeypot + rate limit)
- SEO: `sitemap.xml`, `robots.txt`, Open Graph meta

### Yönetim (admin)
- Dükkan CRUD — fotoğraf, galeri, slug, WhatsApp, harita, öne çıkan sıra
- Kategori, araç tipi, marka yönetimi
- Reklam slider ve haber yönetimi (kapak görseli)
- İletişim mesajları (okundu işaretleme, arama)
- Site ayarları CMS (iletişim, çalışma saatleri, hakkımızda metinleri)
- Admin şifre değiştirme

---

## Teknoloji

| Katman | Teknoloji |
|--------|-----------|
| Framework | Next.js 15 (App Router) |
| Dil | TypeScript |
| Veritabanı | Prisma ORM — SQLite (geliştirme) / PostgreSQL (production) |
| Auth | Auth.js (NextAuth v5) |
| Stil | Tailwind CSS 4 |
| Animasyon | Framer Motion |
| Doğrulama | Zod |

---

## Hızlı Başlangıç (Yerel)

```bash
# 1. Bağımlılıklar
npm install

# 2. Ortam değişkenleri
cp .env.example .env
# .env içinde AUTH_SECRET değerini güçlü bir rastgele string yapın

# 3. Veritabanı
npm run db:push
npm run db:seed

# 4. Geliştirme sunucusu
npm run dev
```

Tarayıcıda: [http://localhost:3000](http://localhost:3000)

### Varsayılan admin (seed sonrası)

| Alan | Değer |
|------|-------|
| URL | `/yp-tokat-7x9k/login` (gizli yol; `/admin` kapalı) |
| Kullanıcı | `admin` |
| Şifre | `admin123` |

> Production ortamında seed şifresini mutlaka değiştirin.

---

## Ortam Değişkenleri

| Değişken | Zorunlu | Açıklama |
|----------|---------|----------|
| `DATABASE_URL` | Evet | MySQL: `mysql://user:pass@host:3306/db` |
| `AUTH_SECRET` | Evet | NextAuth secret (32+ karakter rastgele) |
| `NEXTAUTH_URL` | Evet | Site URL (örn. `https://tokatsanayisitesi.com`) |
| `NEXT_PUBLIC_ADMIN_BASE_PATH` | Hayır | Gizli panel yolu (varsayılan `/yp-tokat-7x9k`) |
| `ADMIN_USERNAME` | Hayır | Seed script admin kullanıcı adı |
| `ADMIN_PASSWORD` | Hayır | Seed script admin şifresi |
| `PRESIDENT_USERNAME` | Hayır | Başkan paneli kullanıcı adı |
| `PRESIDENT_PASSWORD` | Hayır | Başkan paneli şifresi |
| `RESEND_API_KEY` | Hayır | İletişim formu e-posta bildirimi |
| `CONTACT_NOTIFY_EMAIL` | Hayır | Bildirim alıcı e-posta |
| `CONTACT_NOTIFY_FROM` | Hayır | Gönderen adı/e-posta |

---

## Vercel'e Deploy

1. [Vercel](https://vercel.com) hesabınızla GitHub reposunu bağlayın: `bariscanyonel60/sanaitokattttt`
2. **Framework Preset:** Next.js (otomatik algılanır)
3. **Environment Variables** ekleyin:
   - `DATABASE_URL` → Guzel Hosting MySQL (uzak erişim + 3306 açık olmalı)
   - `AUTH_SECRET` → güçlü rastgele secret
   - `NEXTAUTH_URL` → production domain (`https://tokatsanayisitesi.com`)
4. Deploy sonrası veritabanını oluşturun:
   ```bash
   npx prisma db push
   npm run db:seed
   ```

### Production veritabanı notu

Proje **MySQL** kullanır (Guzel Hosting cPanel). Yerelden bağlanmak için:
1. cPanel → Remote Database Access → IP veya `%`
2. Hosting firewall’da **3306** portunun açık olması gerekir (çoğu paylaşımlı hosting kapalı tutar — destekten isteyin)
3. Alternatif: `prisma/mysql-init.sql` dosyasını phpMyAdmin → İçe Aktar ile çalıştırın

### Görsel yükleme

Tüm görseller **Cloudinary** üzerinde saklanır (`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`). Yerel `public/uploads` kullanılmaz; böylece proje deposu hafif kalır ve Vercel gibi serverless ortamlarda görseller kalıcı olur.

---

## Proje Yapısı

```
app/
  (public)/          # Ziyaretçi sayfaları
  admin/             # Yönetim paneli
  api/               # Upload, auth API
actions/             # Server Actions (CRUD, filtreleme)
components/
  public/            # Ana sayfa, filtre, kartlar
  admin/             # Admin formları ve listeler
lib/                 # DB, validasyon, site ayarları
prisma/              # Şema, seed, import scriptleri
```

Görseller Cloudinary’de tutulur; repoda `public/uploads` veya büyük slide dosyaları yoktur.
---

## Komutlar

| Komut | Açıklama |
|-------|----------|
| `npm run dev` | Geliştirme sunucusu |
| `npm run build` | Production build |
| `npm run start` | Production sunucu |
| `npm run lint` | ESLint |
| `npm run db:push` | Şemayı veritabanına uygula |
| `npm run db:seed` | Örnek veri + admin |
| `npm run db:import-shops` | Tokat dükkan import scripti |
| `npm run db:studio` | Prisma Studio |

---

## API / Server Actions

Tüm veritabanı işlemleri `actions/` klasöründedir. Mutation işlemleri `requireAdmin()` ile korunur.

Örnek filtreleme:

```ts
const result = await getShops({
  category: "motor-ustasi",
  vehicleType: "otomobil",
  brand: "volkswagen",
  q: "yılmaz",
  page: 1,
});
```

Görsel yükleme (admin oturumu gerekir): `POST /api/upload/[folder]`  
Klasörler: `news`, `shops`, `promo`

---

## Lisans

Bu proje özel kullanım içindir. Tokat Sanayi Sitesi yönetimi ve yetkili geliştiriciler dışında izinsiz dağıtım önerilmez.
