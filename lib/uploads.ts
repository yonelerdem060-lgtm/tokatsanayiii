import { randomUUID } from "crypto";
import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";

export type UploadFolder = "news" | "shops" | "promo";

const UPLOAD_ROOT = path.join(process.cwd(), "public", "uploads");

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const EXTENSION_BY_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const MAX_NEWS_IMAGE_BYTES = MAX_IMAGE_BYTES;
export const UPLOAD_FOLDERS = ["news", "shops", "promo"] as const;

export function isAllowedImage(file: File) {
  return ALLOWED_MIME_TYPES.has(file.type);
}

export function isAllowedNewsImage(file: File) {
  return isAllowedImage(file);
}

export function isUploadFolder(value: string): value is UploadFolder {
  return (UPLOAD_FOLDERS as readonly string[]).includes(value);
}

export async function saveImage(file: File, folder: UploadFolder) {
  if (!isAllowedImage(file)) {
    throw new Error("Sadece JPG, PNG, WEBP veya GIF yükleyebilirsiniz.");
  }

  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error("Görsel en fazla 5 MB olabilir.");
  }

  const dir = path.join(UPLOAD_ROOT, folder);
  await mkdir(dir, { recursive: true });

  const extension = EXTENSION_BY_MIME[file.type] ?? "jpg";
  const filename = `${Date.now()}-${randomUUID()}.${extension}`;
  const filepath = path.join(dir, filename);
  const buffer = Buffer.from(await file.arrayBuffer());

  await writeFile(filepath, buffer);

  return `/uploads/${folder}/${filename}`;
}

export async function saveNewsImage(file: File) {
  return saveImage(file, "news");
}

export async function deleteUploadedFile(publicPath: string | null | undefined) {
  if (!publicPath || !publicPath.startsWith("/uploads/")) return;

  const relative = publicPath.replace(/^\//, "");
  const absolute = path.join(process.cwd(), "public", relative);

  try {
    await unlink(absolute);
  } catch {
    // Dosya yoksa veya silinemezse sessizce geç.
  }
}
