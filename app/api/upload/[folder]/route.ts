import { NextResponse } from "next/server";
import { auth } from "@/auth";
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
