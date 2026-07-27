"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin";
import { getClientIp } from "@/lib/client-ip";
import { prisma } from "@/lib/db";
import { sendAdminNotification } from "@/lib/notify";
import { rateLimit } from "@/lib/rate-limit";
import { assertTrustedOrigin } from "@/lib/request-guard";
import { verifyTurnstileToken } from "@/lib/turnstile";
import { failure, getErrorMessage, success } from "@/lib/utils";
import { contactSchema } from "@/lib/validations";

const MIN_FORM_MS = 2500;
const MAX_FORM_MS = 2 * 60 * 60 * 1000;

function looksLikeSpam(message: string, subject: string) {
  const text = `${subject}\n${message}`.toLowerCase();
  const urlCount = (text.match(/https?:\/\//g) ?? []).length;
  if (urlCount >= 3) return true;
  if (/(viagra|casino|crypto\s*invest|seo\s*service|buy\s*followers)/i.test(text)) {
    return true;
  }
  return false;
}

export async function submitContactForm(input: unknown) {
  try {
    await assertTrustedOrigin();

    const data = contactSchema.parse(input);

    // Honeypot — botlar doldurursa sessiz başarı (gerçek kayıt yok)
    if (data.website && data.website.trim().length > 0) {
      return success(undefined);
    }

    const startedAt = data.formStartedAt;
    if (typeof startedAt === "number") {
      const elapsed = Date.now() - startedAt;
      if (elapsed < MIN_FORM_MS || elapsed > MAX_FORM_MS) {
        return success(undefined);
      }
    }

    if (looksLikeSpam(data.message, data.subject)) {
      return success(undefined);
    }

    const ip = await getClientIp();
    const emailKey = data.email.trim().toLowerCase();

    const ipLimit = rateLimit(`contact:ip:${ip}`, 5, 15 * 60 * 1000);
    if (!ipLimit.ok) {
      return failure("Çok fazla istek gönderildi. Lütfen biraz sonra tekrar deneyin.");
    }

    const emailLimit = rateLimit(`contact:email:${emailKey}`, 3, 60 * 60 * 1000);
    if (!emailLimit.ok) {
      return failure("Bu e-posta ile çok fazla mesaj gönderildi. Lütfen sonra tekrar deneyin.");
    }

    const turnstile = await verifyTurnstileToken(data.turnstileToken, ip);
    if (!turnstile.ok) {
      return failure(turnstile.error);
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
    await requireAdmin();
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

/** Turnstile site key'i istemciye güvenli şekilde verir (secret değil). */
export async function getPublicTurnstileSiteKey() {
  return process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() || null;
}
