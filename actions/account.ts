"use server";

import bcrypt from "bcryptjs";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/db";
import { failure, getErrorMessage, success } from "@/lib/utils";
import { changePasswordSchema } from "@/lib/validations";

export async function changeAdminPassword(input: unknown) {
  try {
    const session = await requireAdmin();
    const data = changePasswordSchema.parse(input);
    const userId = session.user?.id;

    if (!userId) {
      return failure("Oturum bilgisi bulunamadı.");
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user?.password) {
      return failure("Kullanıcı bulunamadı.");
    }

    const matches = await bcrypt.compare(data.currentPassword, user.password);
    if (!matches) {
      return failure("Mevcut şifre hatalı.");
    }

    const hashed = await bcrypt.hash(data.newPassword, 12);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashed },
    });

    return success(undefined);
  } catch (error) {
    return failure(getErrorMessage(error));
  }
}
