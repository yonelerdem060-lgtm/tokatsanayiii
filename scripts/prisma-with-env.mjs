#!/usr/bin/env node
/**
 * MYSQL_* değişkenlerinden DATABASE_URL üretir, ardından prisma komutunu çalıştırır.
 * Örnek: node scripts/prisma-with-env.mjs generate
 *         node scripts/prisma-with-env.mjs db push
 */
import { spawnSync } from "node:child_process";

function withServerlessMysqlParams(url) {
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

function resolveDatabaseUrl() {
  const existing = process.env.DATABASE_URL?.trim();
  if (existing) return withServerlessMysqlParams(existing);

  const host = process.env.MYSQL_HOST?.trim();
  const user = process.env.MYSQL_USER?.trim();
  const password = process.env.MYSQL_PASSWORD ?? "";
  const database = process.env.MYSQL_DATABASE?.trim();
  const port = process.env.MYSQL_PORT?.trim() || "3306";

  if (!host || !user || !database) {
    // generate için dummy yeterli
    return "mysql://prisma:prisma@127.0.0.1:3306/prisma";
  }

  const auth = `${encodeURIComponent(user)}:${encodeURIComponent(password)}`;
  return withServerlessMysqlParams(
    `mysql://${auth}@${host}:${port}/${encodeURIComponent(database)}`,
  );
}

process.env.DATABASE_URL = resolveDatabaseUrl();

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error("Kullanım: node scripts/prisma-with-env.mjs <prisma-args...>");
  process.exit(1);
}

const result = spawnSync("npx", ["prisma", ...args], {
  stdio: "inherit",
  env: process.env,
  shell: process.platform === "win32",
});

process.exit(result.status ?? 1);
