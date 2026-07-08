"use server";

import { requireAdmin } from "@/lib/admin";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import type { PromoSlide } from "@/lib/promo-slides";
import { deleteUploadedFile } from "@/lib/uploads";
import { failure, getErrorMessage, success } from "@/lib/utils";
import { promoSlideSchema } from "@/lib/validations";

function formatPromoSlide(slide: {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  ctaText: string;
  ctaHref: string;
  image: string | null;
  gradient: string;
  accent: string;
  sortOrder: number;
  isActive: boolean;
}): PromoSlide {
  return {
    id: slide.id,
    badge: slide.badge,
    title: slide.title,
    subtitle: slide.subtitle,
    description: slide.description,
    ctaText: slide.ctaText,
    ctaHref: slide.ctaHref,
    image: slide.image,
    gradient: slide.gradient,
    accent: slide.accent,
    sortOrder: slide.sortOrder,
    isActive: slide.isActive,
  };
}

export async function getActivePromoSlides() {
  try {
    const slides = await prisma.promoSlide.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });

    return success(slides.map(formatPromoSlide));
  } catch (error) {
    return failure(getErrorMessage(error));
  }
}

export async function getPromoSlides() {
  try {
    const slides = await prisma.promoSlide.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });

    return success(slides.map(formatPromoSlide));
  } catch (error) {
    return failure(getErrorMessage(error));
  }
}

export async function getPromoSlideById(id: string) {
  try {
    const slide = await prisma.promoSlide.findUnique({ where: { id } });
    if (!slide) return failure("Reklam slide bulunamadı.");
    return success(formatPromoSlide(slide));
  } catch (error) {
    return failure(getErrorMessage(error));
  }
}

function parsePromoSlideInput(input: unknown) {
  return promoSlideSchema.parse(input);
}

export async function createPromoSlideFromInput(input: unknown) {
  try {
    await requireAdmin();

    const data = parsePromoSlideInput(input);

    const slide = await prisma.promoSlide.create({
      data: {
        badge: data.badge,
        title: data.title,
        subtitle: data.subtitle,
        description: data.description,
        ctaText: data.ctaText,
        ctaHref: data.ctaHref,
        image: data.image,
        gradient: data.gradient,
        accent: data.accent,
        sortOrder: data.sortOrder,
        isActive: data.isActive,
      },
    });

    revalidatePath("/");
    revalidatePath("/admin/promo-slides");

    return success(formatPromoSlide(slide));
  } catch (error) {
    return failure(getErrorMessage(error));
  }
}

export async function updatePromoSlideFromInput(id: string, input: unknown) {
  try {
    await requireAdmin();

    const data = parsePromoSlideInput(input);
    const existing = await prisma.promoSlide.findUnique({ where: { id } });
    if (!existing) return failure("Reklam slide bulunamadı.");

    const slide = await prisma.promoSlide.update({
      where: { id },
      data: {
        badge: data.badge,
        title: data.title,
        subtitle: data.subtitle,
        description: data.description,
        ctaText: data.ctaText,
        ctaHref: data.ctaHref,
        image: data.image,
        gradient: data.gradient,
        accent: data.accent,
        sortOrder: data.sortOrder,
        isActive: data.isActive,
      },
    });

    if (existing.image && existing.image !== slide.image) {
      await deleteUploadedFile(existing.image);
    }

    revalidatePath("/");
    revalidatePath("/admin/promo-slides");
    revalidatePath(`/admin/promo-slides/${id}/edit`);

    return success(formatPromoSlide(slide));
  } catch (error) {
    return failure(getErrorMessage(error));
  }
}

export async function deletePromoSlide(id: string) {
  try {
    await requireAdmin();

    const existing = await prisma.promoSlide.findUnique({ where: { id } });
    if (!existing) return failure("Reklam slide bulunamadı.");

    await prisma.promoSlide.delete({ where: { id } });
    await deleteUploadedFile(existing.image);

    revalidatePath("/");
    revalidatePath("/admin/promo-slides");

    return success(undefined);
  } catch (error) {
    return failure(getErrorMessage(error));
  }
}

export async function togglePromoSlideActive(id: string, isActive: boolean) {
  try {
    await requireAdmin();

    const slide = await prisma.promoSlide.update({
      where: { id },
      data: { isActive },
    });

    revalidatePath("/");
    revalidatePath("/admin/promo-slides");

    return success(formatPromoSlide(slide));
  } catch (error) {
    return failure(getErrorMessage(error));
  }
}
