import { v2 as cloudinary } from "cloudinary";
import { randomUUID } from "crypto";
import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";

export type UploadFolder = "news" | "shops" | "promo";

const UPLOAD_ROOT = path.join(process.cwd(), "public", "uploads");
const CLOUDINARY_ROOT = "tokat-sanayi";

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

export function isCloudinaryConfigured() {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME?.trim() &&
      process.env.CLOUDINARY_API_KEY?.trim() &&
      process.env.CLOUDINARY_API_SECRET?.trim(),
  );
}

function configureCloudinary() {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

export function isAllowedImage(file: File) {
  return ALLOWED_MIME_TYPES.has(file.type);
}

export function isAllowedNewsImage(file: File) {
  return isAllowedImage(file);
}

export function isUploadFolder(value: string): value is UploadFolder {
  return (UPLOAD_FOLDERS as readonly string[]).includes(value);
}

function detectImageMime(buffer: Buffer): string | null {
  if (buffer.length < 12) return null;
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return "image/jpeg";
  }
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  ) {
    return "image/png";
  }
  if (
    buffer[0] === 0x47 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x38
  ) {
    return "image/gif";
  }
  if (
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46 &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50
  ) {
    return "image/webp";
  }
  return null;
}

async function saveToCloudinary(buffer: Buffer, folder: UploadFolder) {
  configureCloudinary();
  const publicId = `${Date.now()}-${randomUUID()}`;

  return new Promise<string>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: `${CLOUDINARY_ROOT}/${folder}`,
        public_id: publicId,
        resource_type: "image",
        overwrite: false,
      },
      (error, result) => {
        if (error || !result?.secure_url) {
          reject(error ?? new Error("Cloudinary yükleme başarısız."));
          return;
        }
        resolve(result.secure_url);
      },
    );
    stream.end(buffer);
  });
}

async function saveToLocal(buffer: Buffer, folder: UploadFolder, mime: string) {
  const dir = path.join(UPLOAD_ROOT, folder);
  await mkdir(dir, { recursive: true });

  const extension = EXTENSION_BY_MIME[mime] ?? "jpg";
  const filename = `${Date.now()}-${randomUUID()}.${extension}`;
  const filepath = path.join(dir, filename);

  await writeFile(filepath, buffer);
  return `/uploads/${folder}/${filename}`;
}

export async function saveImage(file: File, folder: UploadFolder) {
  if (!isAllowedImage(file)) {
    throw new Error("Sadece JPG, PNG, WEBP veya GIF yükleyebilirsiniz.");
  }

  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error("Görsel en fazla 5 MB olabilir.");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const detected = detectImageMime(buffer);
  if (!detected || !ALLOWED_MIME_TYPES.has(detected)) {
    throw new Error("Dosya içeriği geçerli bir görsel değil.");
  }

  if (isCloudinaryConfigured()) {
    return saveToCloudinary(buffer, folder);
  }

  // Vercel/production'da yerel disk kalıcı değil
  if (process.env.VERCEL || process.env.NODE_ENV === "production") {
    throw new Error(
      "Görsel yükleme için Cloudinary ayarları eksik. CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY ve CLOUDINARY_API_SECRET ekleyin.",
    );
  }

  return saveToLocal(buffer, folder, detected);
}

export async function saveNewsImage(file: File) {
  return saveImage(file, "news");
}

function cloudinaryPublicIdFromUrl(url: string) {
  try {
    const parsed = new URL(url);
    if (!parsed.hostname.includes("res.cloudinary.com")) return null;
    const marker = "/upload/";
    const idx = parsed.pathname.indexOf(marker);
    if (idx < 0) return null;
    let rest = parsed.pathname.slice(idx + marker.length);
    // v1234567890/folder/id.ext → folder/id
    rest = rest.replace(/^v\d+\//, "");
    rest = rest.replace(/\.[a-zA-Z0-9]+$/, "");
    return decodeURIComponent(rest);
  } catch {
    return null;
  }
}

export async function deleteUploadedFile(publicPath: string | null | undefined) {
  if (!publicPath) return;

  if (publicPath.includes("res.cloudinary.com")) {
    if (!isCloudinaryConfigured()) return;
    const publicId = cloudinaryPublicIdFromUrl(publicPath);
    if (!publicId) return;
    try {
      configureCloudinary();
      await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
    } catch {
      // Silinemezse sessizce geç.
    }
    return;
  }

  if (!publicPath.startsWith("/uploads/")) return;
  if (publicPath.includes("..") || publicPath.includes("\0")) return;

  const relative = publicPath.replace(/^\//, "");
  const absolute = path.resolve(process.cwd(), "public", relative);
  const uploadsRoot = path.resolve(UPLOAD_ROOT);

  if (absolute !== uploadsRoot && !absolute.startsWith(uploadsRoot + path.sep)) {
    return;
  }

  try {
    await unlink(absolute);
  } catch {
    // Dosya yoksa veya silinemezse sessizce geç.
  }
}
