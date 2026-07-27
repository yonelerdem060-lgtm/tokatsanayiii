import { PrismaClient } from "@prisma/client";
import { resolveDatabaseUrl } from "@/lib/database-url";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function getDatasourceUrl() {
  try {
    const url = resolveDatabaseUrl();
    // Prisma CLI ve diğer süreçler için de görünür olsun
    process.env.DATABASE_URL = url;
    return url;
  } catch {
    return undefined;
  }
}

const datasourceUrl = getDatasourceUrl();

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    ...(datasourceUrl
      ? { datasources: { db: { url: datasourceUrl } } }
      : {}),
  });

// Warm serverless instances'ta bağlantı yeniden kullanım
globalForPrisma.prisma = prisma;
