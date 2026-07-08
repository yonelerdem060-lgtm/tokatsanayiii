"use server";

import { requireAdmin } from "@/lib/admin";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { failure, getErrorMessage, slugify, success } from "@/lib/utils";
import { nameSchema } from "@/lib/validations";

export async function getVehicleTypes() {
  try {
    const vehicleTypes = await prisma.vehicleType.findMany({
      orderBy: { name: "asc" },
    });
    return success(vehicleTypes);
  } catch (error) {
    return failure(getErrorMessage(error));
  }
}

export async function getVehicleTypeById(id: string) {
  try {
    const vehicleType = await prisma.vehicleType.findUnique({ where: { id } });
    if (!vehicleType) return failure("Araç tipi bulunamadı.");
    return success(vehicleType);
  } catch (error) {
    return failure(getErrorMessage(error));
  }
}

export async function createVehicleType(formData: FormData) {
  try {
    await requireAdmin();

    const name = String(formData.get("name") ?? "");
    const parsed = nameSchema.safeParse({ name });
    if (!parsed.success) {
      return failure(parsed.error.errors[0]?.message ?? "Geçersiz araç tipi adı.");
    }

    const slug = slugify(parsed.data.name);

    const vehicleType = await prisma.vehicleType.create({
      data: { name: parsed.data.name, slug },
    });

    revalidatePath("/");
    revalidatePath("/admin/vehicle-types");

    return success(vehicleType);
  } catch (error) {
    if (getErrorMessage(error).includes("Unique constraint")) {
      return failure("Bu araç tipi adı zaten mevcut.");
    }
    return failure(getErrorMessage(error));
  }
}

export async function updateVehicleType(id: string, formData: FormData) {
  try {
    await requireAdmin();

    const name = String(formData.get("name") ?? "");
    const parsed = nameSchema.safeParse({ name });
    if (!parsed.success) {
      return failure(parsed.error.errors[0]?.message ?? "Geçersiz araç tipi adı.");
    }

    const slug = slugify(parsed.data.name);

    const vehicleType = await prisma.vehicleType.update({
      where: { id },
      data: { name: parsed.data.name, slug },
    });

    revalidatePath("/");
    revalidatePath("/admin/vehicle-types");

    return success(vehicleType);
  } catch (error) {
    if (getErrorMessage(error).includes("Unique constraint")) {
      return failure("Bu araç tipi adı zaten mevcut.");
    }
    return failure(getErrorMessage(error));
  }
}

export async function deleteVehicleType(id: string) {
  try {
    await requireAdmin();

    await prisma.vehicleType.delete({ where: { id } });

    revalidatePath("/");
    revalidatePath("/admin/vehicle-types");

    return success(undefined);
  } catch (error) {
    return failure(getErrorMessage(error));
  }
}

export async function createVehicleTypeFromInput(input: unknown) {
  const formData = new FormData();
  const { name } = nameSchema.parse(input);
  formData.set("name", name);
  return createVehicleType(formData);
}

export async function updateVehicleTypeFromInput(id: string, input: unknown) {
  const formData = new FormData();
  const { name } = nameSchema.parse(input);
  formData.set("name", name);
  return updateVehicleType(id, formData);
}
