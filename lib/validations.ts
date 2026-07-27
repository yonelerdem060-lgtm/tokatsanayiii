import { MAX_SHOP_GALLERY_IMAGES } from "@/lib/shop-media";
import { z } from "zod";

function isSafeHref(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return false;
  // Site içi göreli yol
  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) return true;
  try {
    const url = new URL(trimmed);
    return ["http:", "https:", "mailto:", "tel:"].includes(url.protocol);
  } catch {
    return false;
  }
}

const optionalUrl = z
  .string()
  .max(500)
  .optional()
  .nullable()
  .transform((value) => {
    const trimmed = value?.trim();
    return trimmed ? trimmed : null;
  })
  .refine((value) => value === null || isSafeHref(value), {
    message: "Geçerli bir http(s), mailto, tel veya site içi link girin.",
  });

const optionalText = z
  .string()
  .max(300)
  .optional()
  .nullable()
  .transform((value) => {
    const trimmed = value?.trim();
    return trimmed ? trimmed : null;
  });

export const nameSchema = z.object({
  name: z.string().min(2, "En az 2 karakter girin.").max(100),
});

export const shopSchema = z.object({
  name: z.string().min(2, "Dükkân adı en az 2 karakter olmalı.").max(150),
  description: z.string().max(1000).optional(),
  address: z.string().min(5, "Adres en az 5 karakter olmalı.").max(300),
  phone: z.string().min(7, "Geçerli bir telefon numarası girin.").max(20),
  whatsapp: optionalText,
  workingHours: optionalText,
  mapUrl: optionalUrl,
  image: optionalUrl,
  gallery: z
    .array(z.string().min(1).max(500).refine(isSafeHref))
    .max(MAX_SHOP_GALLERY_IMAGES, `En fazla ${MAX_SHOP_GALLERY_IMAGES} görsel yükleyebilirsiniz.`)
    .default([]),
  categoryIds: z.array(z.string()).default([]),
  vehicleTypeIds: z.array(z.string()).default([]),
  brandIds: z.array(z.string()).default([]),
  isFeatured: z.coerce.boolean().default(false),
  featuredSortOrder: z.coerce.number().int().min(0).default(0),
  isShopOfWeek: z.coerce.boolean().default(false),
});

export type ShopInput = z.infer<typeof shopSchema>;

export const shopFilterSchema = z.object({
  category: z.string().optional(),
  vehicleType: z.string().optional(),
  brand: z.string().optional(),
  q: z.string().trim().max(100).optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).optional(),
});

export type ShopFilterInput = z.infer<typeof shopFilterSchema>;

export const idSchema = z.object({
  id: z.string().cuid(),
});

export const promoSlideSchema = z.object({
  badge: z.string().min(1, "Rozet seçin.").max(50),
  title: z.string().min(2, "Başlık en az 2 karakter olmalı.").max(150),
  subtitle: z.string().min(2, "Alt başlık en az 2 karakter olmalı.").max(150),
  description: z.string().min(5, "Açıklama en az 5 karakter olmalı.").max(500),
  ctaText: z.string().min(2, "Buton metni en az 2 karakter olmalı.").max(50),
  ctaHref: z
    .string()
    .min(1, "Link girin.")
    .max(300)
    .refine(isSafeHref, {
      message: "Geçerli bir http(s), mailto, tel veya site içi link girin.",
    }),
  image: optionalUrl,
  gradient: z.string().min(1, "Renk teması seçin."),
  accent: z.string().min(1, "Vurgu rengi seçin."),
  sortOrder: z.coerce.number().int().min(0).default(0),
  isActive: z.coerce.boolean().default(true),
});

export type PromoSlideInput = z.infer<typeof promoSlideSchema>;

export const newsPostSchema = z.object({
  title: z.string().min(3, "Başlık en az 3 karakter olmalı.").max(200),
  excerpt: z
    .string()
    .max(300)
    .optional()
    .transform((value) => value?.trim() ?? ""),
  content: z.string().min(20, "İçerik en az 20 karakter olmalı."),
  coverImage: optionalUrl,
  isPublished: z.coerce.boolean().default(false),
});

export type NewsPostInput = z.infer<typeof newsPostSchema>;

/** Özet boşsa içerikten kısa SEO/özet metni üretir */
export function ensureNewsExcerpt(excerpt: string, content: string, title: string) {
  const trimmed = excerpt.trim();
  if (trimmed.length >= 10) return trimmed.slice(0, 300);
  const fromContent = content.replace(/\s+/g, " ").trim();
  if (fromContent.length >= 10) return fromContent.slice(0, 280);
  return `${title} — Tokat Sanayi Sitesi haberi.`.slice(0, 300);
}

export const contactSchema = z.object({
  name: z.string().min(2, "Ad en az 2 karakter olmalı.").max(100),
  email: z.string().email("Geçerli bir e-posta girin."),
  phone: z.string().max(20).optional(),
  subject: z.string().min(3, "Konu en az 3 karakter olmalı.").max(150),
  message: z.string().min(10, "Mesaj en az 10 karakter olmalı.").max(2000),
  website: z.string().max(200).optional(), // honeypot
  formStartedAt: z.number().int().optional(),
  turnstileToken: z.string().max(2048).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;

export const siteSettingsSchema = z.object({
  name: z.string().min(3).max(150),
  shortName: z.string().min(2).max(80),
  phone: z.string().min(7).max(30),
  email: z.string().email(),
  address: z.string().min(5).max(300),
  adEmail: z.string().email(),
  weekdayHours: z.string().min(3).max(120),
  saturdayHours: z.string().min(3).max(120),
  sundayHours: z.string().min(3).max(120),
  about: z.string().min(20).max(1000),
  aboutParagraphs: z.array(z.string().min(20).max(1000)).min(1).max(6),
  aboutStats: z
    .array(
      z.object({
        label: z.string().min(1).max(40),
        value: z.string().min(1).max(20),
      }),
    )
    .min(1)
    .max(6),
});

export type SiteSettingsInput = z.infer<typeof siteSettingsSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Mevcut şifreyi girin."),
    newPassword: z.string().min(8, "Yeni şifre en az 8 karakter olmalı."),
    confirmPassword: z.string().min(8, "Şifre tekrarını girin."),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Yeni şifreler eşleşmiyor.",
    path: ["confirmPassword"],
  });

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
