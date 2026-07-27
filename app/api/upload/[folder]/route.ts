import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getClientIp } from "@/lib/client-ip";
import { rateLimit } from "@/lib/rate-limit";
import { failure, getErrorMessage, success } from "@/lib/utils";
import { isUploadFolder, saveImage } from "@/lib/uploads";

interface RouteContext {
  params: Promise<{ folder: string }>;
}

export async function POST(request: Request, context: RouteContext) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(failure("Yetkisiz erişim."), { status: 401 });
    }

    const ip = await getClientIp();
    const userId = session.user.id ?? "unknown";
    const limited = rateLimit(`upload:${userId}:${ip}`, 40, 60 * 60 * 1000);
    if (!limited.ok) {
      return NextResponse.json(failure("Çok fazla yükleme. Lütfen sonra tekrar deneyin."), {
        status: 429,
      });
    }

    const { folder } = await context.params;
    if (!isUploadFolder(folder)) {
      return NextResponse.json(failure("Geçersiz yükleme klasörü."), { status: 400 });
    }

    // Başkan yalnızca haber görseli yükleyebilir
    if (session.user.role === "PRESIDENT" && folder !== "news") {
      return NextResponse.json(failure("Bu klasöre yükleme yetkiniz yok."), { status: 403 });
    }

    if (session.user.role !== "ADMIN" && session.user.role !== "PRESIDENT") {
      return NextResponse.json(failure("Yetkisiz erişim."), { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json(failure("Görsel dosyası seçin."), { status: 400 });
    }

    const url = await saveImage(file, folder);
    return NextResponse.json(success({ url }));
  } catch (error) {
    return NextResponse.json(failure(getErrorMessage(error)), { status: 400 });
  }
}
