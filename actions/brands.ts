"use server";

import { requireAdmin } from "@/lib/admin";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { failure, getErrorMessage, slugify, success } from "@/lib/utils";
import { nameSchema } from "@/lib/validations";

export async function getBrands() {
  try {
    const brands = await prisma.brand.findMany({
      orderBy: { name: "asc" },
    });
    return success(brands);
  } catch (error) {
    return failure(getErrorMessage(error));
  }
}

export async function getBrandById(id: string) {
  try {
    const brand = await prisma.brand.findUnique({ where: { id } });
    if (!brand) return failure("Marka bulunamadı.");
    return success(brand);
  } catch (error) {
    return failure(getErrorMessage(error));
  }
}

export async function createBrand(formData: FormData) {
  try {
    await requireAdmin();

    const name = String(formData.get("name") ?? "");
    const parsed = nameSchema.safeParse({ name });
    if (!parsed.success) {
      return failure(parsed.error.errors[0]?.message ?? "Geçersiz marka adı.");
    }

    const slug = slugify(parsed.data.name);

    const brand = await prisma.brand.create({
      data: { name: parsed.data.name, slug },
    });

    revalidatePath("/");
    revalidatePath("/admin/brands");

    return success(brand);
  } catch (error) {
    if (getErrorMessage(error).includes("Unique constraint")) {
      return failure("Bu marka adı zaten mevcut.");
    }
    return failure(getErrorMessage(error));
  }
}

export async function updateBrand(id: string, formData: FormData) {
  try {
    await requireAdmin();

    const name = String(formData.get("name") ?? "");
    const parsed = nameSchema.safeParse({ name });
    if (!parsed.success) {
      return failure(parsed.error.errors[0]?.message ?? "Geçersiz marka adı.");
    }

    const slug = slugify(parsed.data.name);

    const brand = await prisma.brand.update({
      where: { id },
      data: { name: parsed.data.name, slug },
    });

    revalidatePath("/");
    revalidatePath("/admin/brands");

    return success(brand);
  } catch (error) {
    if (getErrorMessage(error).includes("Unique constraint")) {
      return failure("Bu marka adı zaten mevcut.");
    }
    return failure(getErrorMessage(error));
  }
}

export async function deleteBrand(id: string) {
  try {
    await requireAdmin();

    await prisma.brand.delete({ where: { id } });

    revalidatePath("/");
    revalidatePath("/admin/brands");

    return success(undefined);
  } catch (error) {
    return failure(getErrorMessage(error));
  }
}

export async function createBrandFromInput(input: unknown) {
  const formData = new FormData();
  const { name } = nameSchema.parse(input);
  formData.set("name", name);
  return createBrand(formData);
}

export async function updateBrandFromInput(id: string, input: unknown) {
  const formData = new FormData();
  const { name } = nameSchema.parse(input);
  formData.set("name", name);
  return updateBrand(id, formData);
}
