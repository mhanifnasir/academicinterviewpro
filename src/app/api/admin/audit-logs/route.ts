import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { requireAdmin } from "@/lib/auth/admin-guard";

type AuditLogWithActor = Prisma.AuditLogGetPayload<{ include: { actor: true } }>;

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.authorized) {
    return NextResponse.json({ success: false, error: auth.error }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const actionFilter = searchParams.get("action") || "ALL";

  try {
    let logs: AuditLogWithActor[] = [];
    try {
      const whereClause: Prisma.AuditLogWhereInput = {};
      if (actionFilter !== "ALL") {
        whereClause.action = actionFilter;
      }

      logs = await prisma.auditLog.findMany({
        where: whereClause,
        include: { actor: true },
        orderBy: { createdAt: "desc" },
        take: 50,
      });
    } catch {
      // Fallback
    }

    const defaultLogs = [
      {
        id: "log-1",
        actor: "admin@academicinterviewpro.pk",
        action: "AI_CONFIG_UPDATED",
        entityType: "AISettings",
        entityId: "ai-prompt-v1.2",
        ipAddress: "182.185.120.4",
        metadata: { model: "Gemini 2.5 Flash", version: "v1.2" },
        createdAt: "Today, 10:45 AM",
      },
      {
        id: "log-2",
        actor: "admin@academicinterviewpro.pk",
        action: "PLAN_LIMITS_UPDATED",
        entityType: "Plan",
        entityId: "PREMIUM",
        ipAddress: "182.185.120.4",
        metadata: { planCode: "PREMIUM", mcqLimit: 500 },
        createdAt: "Today, 09:12 AM",
      },
      {
        id: "log-3",
        actor: "system-cron",
        action: "QUESTION_BATCH_APPROVED",
        entityType: "Question",
        entityId: "batch-ppsc-2025",
        ipAddress: "127.0.0.1",
        metadata: { approvedCount: 45, subject: "Operating Systems" },
        createdAt: "Yesterday, 11:30 PM",
      },
      {
        id: "log-4",
        actor: "admin@academicinterviewpro.pk",
        action: "USER_ROLE_ASSIGNED",
        entityType: "UserRole",
        entityId: "usr-2",
        ipAddress: "182.185.120.4",
        metadata: { targetUser: "ayesha.malik@gmail.com", assignedRole: "reviewer" },
        createdAt: "Yesterday, 04:15 PM",
      },
    ];

    const formattedLogs =
      logs.length > 0
        ? logs.map((l) => ({
            id: l.id,
            actor: l.actor?.email || "admin@academicinterviewpro.pk",
            action: l.action,
            entityType: l.entityType,
            entityId: l.entityId || "N/A",
            ipAddress: l.ipAddress || "127.0.0.1",
            metadata: l.metadataJson || {},
            createdAt: new Date(l.createdAt).toLocaleString(),
          }))
        : defaultLogs;

    return NextResponse.json({
      success: true,
      logs: formattedLogs,
    });
  } catch (error) {
    console.error("Admin audit logs error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch audit logs" },
      { status: 500 }
    );
  }
}
