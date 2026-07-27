/**
 * DATABASE_URL tek parça veya MYSQL_* ayrı değişkenlerden üretilir.
 * Vercel'de host / kullanıcı / şifre ayrı alan olarak tutulabilir.
 */
export function resolveDatabaseUrl(): string {
  const existing = process.env.DATABASE_URL?.trim();
  if (existing) {
    return withServerlessMysqlParams(existing);
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
  return withServerlessMysqlParams(
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

function withServerlessMysqlParams(url: string) {
  try {
    const parsed = new URL(url);
    if (!parsed.searchParams.has("connect_timeout")) {
      parsed.searchParams.set("connect_timeout", "5");
    }
    if (!parsed.searchParams.has("pool_timeout")) {
      parsed.searchParams.set("pool_timeout", "5");
    }
    if (!parsed.searchParams.has("connection_limit")) {
      parsed.searchParams.set("connection_limit", "1");
    }
    return parsed.toString();
  } catch {
    return url;
  }
}
