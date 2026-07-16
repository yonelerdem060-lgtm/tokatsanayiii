"use server";

import { prisma } from "@/lib/db";
import { failure, getErrorMessage, success } from "@/lib/utils";

export async function recordShopView(shopId: string) {
  try {
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
