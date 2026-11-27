import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: Pool | undefined;
};

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    // No database configured — return a client that will fail gracefully
    // at the point of use. Each API route already wraps prisma calls in try/catch
    // and falls back to in-memory data, so this is safe.
    console.warn(
      "[Prisma] DATABASE_URL is not set. Database features will be unavailable."
    );
    // We still need a valid adapter; use a dummy URL that will fail at query time
    const pool = new Pool({
      connectionString:
        "postgresql://noop:noop@localhost:5432/noop?connect_timeout=1",
      connectionTimeoutMillis: 1000,
      max: 1,
    });
    const adapter = new PrismaPg(pool);
    return new PrismaClient({
      adapter,
      log: ["error"],
    });
  }

  const pool =
    globalForPrisma.pool ??
    new Pool({
      connectionString,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    });

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.pool = pool;
  }

  const adapter = new PrismaPg(pool);
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
