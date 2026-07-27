"use server";

import { getClientIp } from "@/lib/client-ip";
import { prisma } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";
import { failure, getErrorMessage, success } from "@/lib/utils";

export async function recordShopView(shopId: string) {
  try {
    const ip = await getClientIp();
    const limited = rateLimit(`shop-view:${ip}:${shopId}`, 30, 60 * 60 * 1000);
    if (!limited.ok) {
      return success(true);
    }

    await prisma.shop.update({
      where: { id: shopId },
      data: { viewCount: { increment: 1 } },
    });
    return success(true);
  } catch (error) {
    return failure(getErrorMessage(error));
  }
}

export async function recordShopClick(
  shopId: string,
  type: "phone" | "whatsapp",
) {
  try {
    const ip = await getClientIp();
    const limited = rateLimit(`shop-click:${ip}:${shopId}:${type}`, 20, 60 * 60 * 1000);
    if (!limited.ok) {
      return success(true);
    }

    await prisma.shop.update({
      where: { id: shopId },
      data:
        type === "phone"
          ? { phoneClickCount: { increment: 1 } }
          : { whatsappClickCount: { increment: 1 } },
    });
    return success(true);
  } catch (error) {
    return failure(getErrorMessage(error));
  }
}
