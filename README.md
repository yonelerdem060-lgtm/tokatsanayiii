# Tokat Sanayi Sitesi Rehberi

Tokat Sanayi Sitesi için geliştirilmiş dijital rehber platformu. Esnaf ve müşteriler; kategori, araç tipi, marka ve metin araması ile firmalara hızlıca ulaşır. Telefon, WhatsApp, adres ve çalışma saatleri tek ekranda sunulur.

**Canlı repo:** [github.com/bariscanyonel60/sanaitokattttt](https://github.com/bariscanyonel60/sanaitokattttt)

---

## Özellikler

### Ziyaretçi (public)
- Ana sayfa arama ve filtreleme (kategori, araç tipi, marka, firma adı/telefon/adres)
- Mobil uyumlu arayüz: sticky arama, filtre paneli, alt navigasyon
- Dükkân kartlarında tek tıkla **Ara** ve **WhatsApp**
- Dükkân detay sayfası (`/dukkan/[slug]`) — galeri, harita, çalışma saatleri
- Popüler kategoriler, araç tipleri, marka rehberi
- Sponsorlu kampanyalar ve öne çıkan firmalar
- Haber / duyuru bölümü
- Mobilya & Kereste bölgesi sayfası
- İletişim formu (honeypot + rate limit)
- SEO: `sitemap.xml`, `robots.txt`, Open Graph meta

### Yönetim (admin)
- Dükkân CRUD — fotoğraf, galeri, slug, WhatsApp, harita, öne çıkan sıra
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
| `MYSQL_HOST` | Evet* | MySQL host (örn. `mt-luca.guzelhosting.com`) |
| `MYSQL_PORT` | Hayır | Varsayılan `3306` |
| `MYSQL_USER` | Evet* | MySQL kullanıcı adı |
| `MYSQL_PASSWORD` | Evet* | MySQL şifresi |
| `MYSQL_DATABASE` | Evet* | Veritabanı adı |
| `DATABASE_URL` | Hayır | Tek satır bağlantı (MYSQL_* yerine kullanılabilir) |
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
| `CLOUDINARY_CLOUD_NAME` | Evet (prod) | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Evet (prod) | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Evet (prod) | Cloudinary API secret |

\* `DATABASE_URL` yoksa `MYSQL_*` zorunlu.

---

## Vercel'e Deploy

1. [Vercel](https://vercel.com) hesabınızla GitHub reposunu bağlayın: `bariscanyonel60/sanaitokattttt`
2. **Framework Preset:** Next.js (otomatik algılanır)
3. **Environment Variables** ekleyin (Production + Preview):
   - `MYSQL_HOST`, `MYSQL_PORT`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_DATABASE`
   - `AUTH_SECRET`, `NEXTAUTH_URL`, `NEXT_PUBLIC_ADMIN_BASE_PATH`
   - `CLOUDINARY_*`, `RESEND_*` (gerekirse)
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
| `npm run db:import-shops` | Tokat dükkân import scripti |
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
