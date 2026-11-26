import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const startTime = Date.now();
  let dbStatus = "unreachable";
  let dbLatencyMs = -1;

  try {
    const dbStart = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    dbLatencyMs = Date.now() - dbStart;
    dbStatus = "healthy";
  } catch (err) {
    dbStatus = "degraded";
    console.error("Healthcheck DB ping failed:", err);
  }

  const isHealthy = dbStatus === "healthy";
  const statusCode = isHealthy ? 200 : 503;

  return NextResponse.json(
    {
      status: isHealthy ? "healthy" : "degraded",
      timestamp: new Date().toISOString(),
      service: "Academic Interview Pro API",
      uptimeSeconds: Math.floor(process.uptime()),
      environment: process.env.NODE_ENV || "development",
      responseTimeMs: Date.now() - startTime,
      database: {
        status: dbStatus,
        latencyMs: dbLatencyMs,
      },
      checks: {
        prismaClient: "online",
        memoryUsageMb: Math.round(process.memoryUsage().rss / (1024 * 1024)),
      },
    },
    { status: statusCode }
  );
}
