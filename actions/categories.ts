"use server";

import { requireAdmin } from "@/lib/admin";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { failure, getErrorMessage, slugify, success } from "@/lib/utils";
import { nameSchema } from "@/lib/validations";

export async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
    });
    return success(categories);
  } catch (error) {
    return failure(getErrorMessage(error));
  }
}

export async function getCategoryById(id: string) {
  try {
    const category = await prisma.category.findUnique({ where: { id } });
    if (!category) return failure("Kategori bulunamadı.");
    return success(category);
  } catch (error) {
    return failure(getErrorMessage(error));
  }
}

export async function createCategory(formData: FormData) {
  try {
    await requireAdmin();

    const name = String(formData.get("name") ?? "");
    const parsed = nameSchema.safeParse({ name });
    if (!parsed.success) {
      return failure(parsed.error.errors[0]?.message ?? "Geçersiz kategori adı.");
    }

    const slug = slugify(parsed.data.name);

    const category = await prisma.category.create({
      data: { name: parsed.data.name, slug },
    });

    revalidatePath("/");
    revalidatePath("/admin/categories");

    return success(category);
  } catch (error) {
    if (getErrorMessage(error).includes("Unique constraint")) {
      return failure("Bu kategori adı zaten mevcut.");
    }
    return failure(getErrorMessage(error));
  }
}

export async function updateCategory(id: string, formData: FormData) {
  try {
    await requireAdmin();

    const name = String(formData.get("name") ?? "");
    const parsed = nameSchema.safeParse({ name });
    if (!parsed.success) {
      return failure(parsed.error.errors[0]?.message ?? "Geçersiz kategori adı.");
    }

    const slug = slugify(parsed.data.name);

    const category = await prisma.category.update({
      where: { id },
      data: { name: parsed.data.name, slug },
    });

    revalidatePath("/");
    revalidatePath("/admin/categories");

    return success(category);
  } catch (error) {
    if (getErrorMessage(error).includes("Unique constraint")) {
      return failure("Bu kategori adı zaten mevcut.");
    }
    return failure(getErrorMessage(error));
  }
}

export async function deleteCategory(id: string) {
  try {
    await requireAdmin();

    await prisma.category.delete({ where: { id } });

    revalidatePath("/");
    revalidatePath("/admin/categories");

    return success(undefined);
  } catch (error) {
    return failure(getErrorMessage(error));
  }
}

export async function createCategoryFromInput(input: unknown) {
  const formData = new FormData();
  const { name } = nameSchema.parse(input);
  formData.set("name", name);
  return createCategory(formData);
}

export async function updateCategoryFromInput(id: string, input: unknown) {
  const formData = new FormData();
  const { name } = nameSchema.parse(input);
  formData.set("name", name);
  return updateCategory(id, formData);
}
