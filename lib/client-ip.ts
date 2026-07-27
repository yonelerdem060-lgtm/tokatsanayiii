import { headers } from "next/headers";

/** İstemci IP — reverse proxy başlıklarından (ilk güvenilir değer). */
export async function getClientIp() {
  const headerStore = await headers();
  const forwarded = headerStore.get("x-forwarded-for");
  const firstForwarded = forwarded?.split(",")[0]?.trim();
  return (
    headerStore.get("cf-connecting-ip")?.trim() ||
    headerStore.get("x-real-ip")?.trim() ||
    firstForwarded ||
    "unknown"
  );
}
