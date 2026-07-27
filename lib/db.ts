import { PrismaClient } from "@prisma/client";
import { resolveDatabaseUrl } from "@/lib/database-url";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  prismaUrl: string | undefined;
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

/** Hot-reload’da URL (havuz) değiştiyse eski client’ı bırak */
function createClient(url: string | undefined) {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    ...(url ? { datasources: { db: { url } } } : {}),
  });
}

export const prisma =
  globalForPrisma.prisma && globalForPrisma.prismaUrl === datasourceUrl
    ? globalForPrisma.prisma
    : createClient(datasourceUrl);

globalForPrisma.prisma = prisma;
globalForPrisma.prismaUrl = datasourceUrl;
