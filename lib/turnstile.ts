/**
 * Cloudflare Turnstile doğrulama (opsiyonel).
 * TURNSTILE_SECRET_KEY yoksa doğrulama atlanır — yerel geliştirme için.
 */
export async function verifyTurnstileToken(token: string | undefined, ip: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY?.trim();
  if (!secret) {
    return { ok: true as const, skipped: true as const };
  }

  if (!token?.trim()) {
    return { ok: false as const, error: "Güvenlik doğrulaması gerekli." };
  }

  const body = new URLSearchParams({
    secret,
    response: token.trim(),
    remoteip: ip,
  });

  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!response.ok) {
    return { ok: false as const, error: "Güvenlik doğrulaması başarısız." };
  }

  const data = (await response.json()) as { success?: boolean };
  if (!data.success) {
    return { ok: false as const, error: "Güvenlik doğrulaması başarısız." };
  }

  return { ok: true as const, skipped: false as const };
}

export function isTurnstileConfigured() {
  return Boolean(process.env.TURNSTILE_SECRET_KEY?.trim());
}
