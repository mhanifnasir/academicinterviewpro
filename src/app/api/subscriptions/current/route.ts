import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { createServerClient } from "@/lib/supabase/server";
import { UsageService } from "@/lib/subscription/usage-service";

type TransactionWithPlan = Prisma.TransactionGetPayload<{ include: { plan: true } }>;

export async function GET(_request: NextRequest) {
  try {
    let userId = "candidate-demo";

    try {
      const supabase = await createServerClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user?.id) {
        userId = user.id;
      }
    } catch {
      // Local fallback
    }

    // Fetch user subscription info
    const userPlan = await UsageService.getUserPlan(userId);

    // Fetch quotas
    const [mcqQuota, vivaQuota, voiceQuota, mockQuota, codeQuota, teachingQuota] =
      await Promise.all([
        UsageService.checkQuota(userId, "mcq_daily"),
        UsageService.checkQuota(userId, "ai_interview_monthly"),
        UsageService.checkQuota(userId, "voice_session_monthly"),
        UsageService.checkQuota(userId, "mock_exam_monthly"),
        UsageService.checkQuota(userId, "coding_submission_daily"),
        UsageService.checkQuota(userId, "teaching_demo_monthly"),
      ]);

    // Fetch recent transaction history
    let transactions: TransactionWithPlan[] = [];
    try {
      transactions = await prisma.transaction.findMany({
        where: { userId },
        include: { plan: true },
        orderBy: { createdAt: "desc" },
        take: 10,
      });
    } catch {
      // Fallback
    }

    return NextResponse.json({
      success: true,
      currentPlan: {
        code: userPlan.planCode,
        name: userPlan.planName,
        status: userPlan.subscription?.status || "ACTIVE",
        billingCycle: userPlan.subscription?.billingCycle || "MONTHLY",
        startedAt: userPlan.subscription?.startedAt || new Date().toISOString(),
        expiresAt: userPlan.subscription?.expiresAt || null,
        amountPaidPKR: userPlan.subscription?.amountPaidPKR || 0,
        paymentMethod: userPlan.subscription?.paymentMethod || "NONE",
        autoRenew: userPlan.subscription?.autoRenew ?? true,
      },
      quotas: {
        mcqDaily: mcqQuota,
        vivaMonthly: vivaQuota,
        voiceMonthly: voiceQuota,
        mockMonthly: mockQuota,
        codeDaily: codeQuota,
        teachingMonthly: teachingQuota,
      },
      transactions: transactions.map((t) => ({
        id: t.id,
        orderRef: t.orderRef,
        gateway: t.gateway,
        amountPKR: t.amountPKR,
        billingCycle: t.billingCycle,
        status: t.status,
        planName: t.plan?.name || "Lecturer Pro",
        date: new Date(t.createdAt).toLocaleDateString(),
        paidAt: t.paidAt ? new Date(t.paidAt).toLocaleDateString() : null,
      })),
    });
  } catch (error) {
    console.error("Current subscription API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch current subscription" },
      { status: 500 }
    );
  }
}
