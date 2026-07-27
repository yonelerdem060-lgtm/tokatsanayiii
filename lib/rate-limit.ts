type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

export function rateLimit(key: string, limit = 8, windowMs = 10 * 60 * 1000) {
  const now = Date.now();
  const current = buckets.get(key);

  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true as const, remaining: limit - 1 };
  }

  if (current.count >= limit) {
    return {
      ok: false as const,
      retryAfterMs: current.resetAt - now,
    };
  }

  current.count += 1;
  return { ok: true as const, remaining: limit - current.count };
}

/** Sayacı artırmadan kontrol eder. */
export function isRateLimited(key: string, limit: number) {
  const now = Date.now();
  const current = buckets.get(key);
  if (!current || current.resetAt <= now) return false;
  return current.count >= limit;
}

export function resetRateLimit(key: string) {
  buckets.delete(key);
}

const LOGIN_IP_LIMIT = 20;
const LOGIN_USER_LIMIT = 8;
const LOGIN_WINDOW_MS = 15 * 60 * 1000;

export function assertLoginAllowed(ip: string, username: string) {
  if (isRateLimited(`login:ip:${ip}`, LOGIN_IP_LIMIT)) {
    return { ok: false as const, error: "Çok fazla deneme. Lütfen 15 dakika sonra tekrar deneyin." };
  }
  if (isRateLimited(`login:user:${username.toLowerCase()}`, LOGIN_USER_LIMIT)) {
    return { ok: false as const, error: "Bu hesap geçici olarak kilitlendi. Lütfen sonra tekrar deneyin." };
  }
  return { ok: true as const };
}

export function recordLoginFailure(ip: string, username: string) {
  rateLimit(`login:ip:${ip}`, LOGIN_IP_LIMIT, LOGIN_WINDOW_MS);
  rateLimit(`login:user:${username.toLowerCase()}`, LOGIN_USER_LIMIT, LOGIN_WINDOW_MS);
}

export function clearLoginFailures(ip: string, username: string) {
  resetRateLimit(`login:ip:${ip}`);
  resetRateLimit(`login:user:${username.toLowerCase()}`);
}
