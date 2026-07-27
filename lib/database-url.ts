/**
 * DATABASE_URL tek parça veya MYSQL_* ayrı değişkenlerden üretilir.
 * Vercel'de host / kullanıcı / şifre ayrı alan olarak tutulabilir.
 */
export function resolveDatabaseUrl(): string {
  const existing = process.env.DATABASE_URL?.trim();
  if (existing) {
    return withMysqlPoolParams(existing);
  }

  const host = process.env.MYSQL_HOST?.trim();
  const user = process.env.MYSQL_USER?.trim();
  const password = process.env.MYSQL_PASSWORD ?? "";
  const database = process.env.MYSQL_DATABASE?.trim();
  const port = process.env.MYSQL_PORT?.trim() || "3306";

  if (!host || !user || !database) {
    throw new Error(
      "Veritabanı ayarları eksik. MYSQL_HOST, MYSQL_USER, MYSQL_DATABASE (veya DATABASE_URL) tanımlayın.",
    );
  }

  const auth = `${encodeURIComponent(user)}:${encodeURIComponent(password)}`;
  return withMysqlPoolParams(
    `mysql://${auth}@${host}:${port}/${encodeURIComponent(database)}`,
  );
}

/** Prisma generate gibi bağlantı gerektirmeyen komutlar için yedek URL */
export function resolveDatabaseUrlOrDummy(): string {
  try {
    return resolveDatabaseUrl();
  } catch {
    return "mysql://prisma:prisma@127.0.0.1:3306/prisma";
  }
}

/**
 * Prisma MySQL connection pool.
 * connection_limit=1 + anasayfa Promise.all → P2024 (havuz zaman aşımı).
 * Dev: daha geniş havuz; prod/serverless: paylaşımlı hosting için sınırlı ama >1.
 * URL'de connection_limit=1 gibi agresif değer varsa üzerine yazar.
 */
function withMysqlPoolParams(url: string) {
  try {
    const parsed = new URL(url);
    const isDev = process.env.NODE_ENV === "development";
    const desiredLimit = Number(
      process.env.MYSQL_CONNECTION_LIMIT?.trim() || (isDev ? "10" : "5"),
    );
    const desiredPool = Number(
      process.env.MYSQL_POOL_TIMEOUT?.trim() || (isDev ? "20" : "15"),
    );
    const desiredConnect = Number(
      process.env.MYSQL_CONNECT_TIMEOUT?.trim() || (isDev ? "15" : "10"),
    );

    const currentLimit = Number(parsed.searchParams.get("connection_limit") || "0");
    if (!parsed.searchParams.has("connection_limit") || currentLimit < 3) {
      parsed.searchParams.set("connection_limit", String(desiredLimit));
    }
    if (!parsed.searchParams.has("pool_timeout")) {
      parsed.searchParams.set("pool_timeout", String(desiredPool));
    }
    if (!parsed.searchParams.has("connect_timeout")) {
      parsed.searchParams.set("connect_timeout", String(desiredConnect));
    }
    return parsed.toString();
  } catch {
    return url;
  }
}
