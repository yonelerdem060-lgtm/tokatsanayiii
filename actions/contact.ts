"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/db";
import { sendAdminNotification } from "@/lib/notify";
import { rateLimit } from "@/lib/rate-limit";
import { failure, getErrorMessage, success } from "@/lib/utils";
import { contactSchema } from "@/lib/validations";

export async function submitContactForm(input: unknown) {
  try {
    const data = contactSchema.parse(input);

    if (data.website && data.website.trim().length > 0) {
      return success(undefined);
    }

    const headerStore = await headers();
    const ip =
      headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      headerStore.get("x-real-ip") ||
      "unknown";
    const limited = rateLimit(`contact:${ip}`, 5, 15 * 60 * 1000);
    if (!limited.ok) {
      return failure("Çok fazla istek gönderildi. Lütfen biraz sonra tekrar deneyin.");
    }

    await prisma.contactMessage.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        subject: data.subject,
        message: data.message,
      },
    });

    try {
      await sendAdminNotification({
        subject: `Yeni iletişim mesajı: ${data.subject}`,
        replyTo: data.email,
        text: [
          `Ad: ${data.name}`,
          `E-posta: ${data.email}`,
          `Telefon: ${data.phone || "-"}`,
          `Konu: ${data.subject}`,
          "",
          data.message,
        ].join("\n"),
      });
    } catch {
      // Bildirim başarısız olsa da mesaj kaydı kalsın.
    }

    revalidatePath("/admin/messages");

    return success(undefined);
  } catch (error) {
    return failure(getErrorMessage(error));
  }
}

export async function getContactMessages(filters?: { q?: string }) {
  try {
    await requireAdmin();
    const q = filters?.q?.trim();
    const messages = await prisma.contactMessage.findMany({
      where: q
        ? {
            OR: [
              { name: { contains: q } },
              { email: { contains: q } },
              { subject: { contains: q } },
              { message: { contains: q } },
              { phone: { contains: q } },
            ],
          }
        : undefined,
      orderBy: { createdAt: "desc" },
    });
    return success(messages);
  } catch (error) {
    return failure(getErrorMessage(error));
  }
}

export async function getUnreadMessageCount() {
  try {
    const count = await prisma.contactMessage.count({ where: { isRead: false } });
    return success(count);
  } catch (error) {
    return failure(getErrorMessage(error));
  }
}

export async function markMessageAsRead(id: string) {
  try {
    await requireAdmin();
    await prisma.contactMessage.update({
      where: { id },
      data: { isRead: true },
    });
    revalidatePath("/admin/messages");
    return success(undefined);
  } catch (error) {
    return failure(getErrorMessage(error));
  }
}

export async function markAllMessagesAsRead() {
  try {
    await requireAdmin();
    await prisma.contactMessage.updateMany({
      where: { isRead: false },
      data: { isRead: true },
    });
    revalidatePath("/admin/messages");
    return success(undefined);
  } catch (error) {
    return failure(getErrorMessage(error));
  }
}

export async function deleteContactMessage(id: string) {
  try {
    await requireAdmin();
    await prisma.contactMessage.delete({ where: { id } });
    revalidatePath("/admin/messages");
    return success(undefined);
  } catch (error) {
    return failure(getErrorMessage(error));
  }
}
