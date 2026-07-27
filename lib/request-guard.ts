import { headers } from "next/headers";

/**
 * Server Action / API isteklerinde Origin veya Referer'ın
 * beklenen host ile uyumunu kontrol eder (CSRF / site-kopyalama yüzeyi).
 */
export async function assertTrustedOrigin() {
  const headerStore = await headers();
  const origin = headerStore.get("origin");
  const referer = headerStore.get("referer");
  const host = headerStore.get("x-forwarded-host") || headerStore.get("host");

  if (!host) {
    throw new Error("İstek reddedildi.");
  }

  const allowedHosts = new Set(
    [
      host,
      process.env.NEXTAUTH_URL ? safeHost(process.env.NEXTAUTH_URL) : null,
      "localhost:3000",
      "127.0.0.1:3000",
    ].filter(Boolean) as string[],
  );

  if (origin) {
    const originHost = safeHost(origin);
    if (!originHost || !allowedHosts.has(originHost)) {
      throw new Error("İstek reddedildi.");
    }
    return;
  }

  if (referer) {
    const refererHost = safeHost(referer);
    if (!refererHost || !allowedHosts.has(refererHost)) {
      throw new Error("İstek reddedildi.");
    }
  }
}

function safeHost(value: string) {
  try {
    return new URL(value.includes("://") ? value : `https://${value}`).host;
  } catch {
    return null;
  }
}
