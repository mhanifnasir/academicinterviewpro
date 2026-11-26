import { prisma } from "@/lib/prisma";
import { SUBSCRIPTION_PLANS, PlanLimits } from "@/data/subscription-plans";

export type MetricKey =
  | "mcq_daily"
  | "ai_interview_monthly"
  | "voice_session_monthly"
  | "mock_exam_monthly"
  | "coding_submission_daily"
  | "teaching_demo_monthly";

export interface QuotaStatus {
  allowed: boolean;
  metricKey: MetricKey;
  currentUsage: number;
  maxLimit: number;
  remaining: number;
  planName: string;
  planCode: string;
  isUnlimited: boolean;
}

export class UsageService {
  /**
   * Resolves the active subscription and associated plan limits for a user
   */
  public static async getUserPlan(userId: string) {
    try {
      const activeSub = await prisma.subscription.findFirst({
        where: {
          userId,
          status: "ACTIVE",
          OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
        },
        include: { plan: true },
      });

      if (activeSub?.plan) {
        const planCode = activeSub.plan.code;
        const staticFallback = SUBSCRIPTION_PLANS.find((p) => p.code === planCode) || SUBSCRIPTION_PLANS[1];
        const limits: PlanLimits =
          (activeSub.plan.limitsJson as unknown as PlanLimits) || staticFallback.limits;

        return {
          planCode,
          planName: activeSub.plan.name,
          subscription: activeSub,
          limits,
        };
      }
    } catch (err) {
      console.warn("DB subscription lookup fallback:", err);
    }

    // Default to Free plan
    const freePlan = SUBSCRIPTION_PLANS[0];
    return {
      planCode: freePlan.code,
      planName: freePlan.name,
      subscription: null,
      limits: freePlan.limits,
    };
  }

  /**
   * Verifies entitlement against daily or monthly usage records
   */
  public static async checkQuota(userId: string, metric: MetricKey): Promise<QuotaStatus> {
    const userPlan = await this.getUserPlan(userId);
    const now = new Date();
    const isDaily = metric.endsWith("_daily");

    // Compute date boundary
    const dateQuery = isDaily
      ? new Date(now.getFullYear(), now.getMonth(), now.getDate())
      : new Date(now.getFullYear(), now.getMonth(), 1); // 1st of current month

    let currentUsage = 0;

    try {
      if (isDaily) {
        const record = await prisma.usageRecord.findFirst({
          where: {
            userId,
            metricKey: metric,
            date: dateQuery,
          },
        });
        currentUsage = record?.count || 0;
      } else {
        // Aggregate for month
        const records = await prisma.usageRecord.findMany({
          where: {
            userId,
            metricKey: metric,
            date: { gte: dateQuery },
          },
        });
        currentUsage = records.reduce((sum: number, r: { count: number }) => sum + r.count, 0);
      }
    } catch {
      currentUsage = 0;
    }

    // Determine max limit for metric
    let maxLimit = 100;
    switch (metric) {
      case "mcq_daily":
        maxLimit = userPlan.limits.mcqPerDay;
        break;
      case "ai_interview_monthly":
        maxLimit = userPlan.limits.aiInterviewsPerMonth;
        break;
      case "voice_session_monthly":
        maxLimit = userPlan.limits.voiceSessionsPerMonth;
        break;
      case "mock_exam_monthly":
        maxLimit = userPlan.limits.mockTestsPerMonth;
        break;
      case "coding_submission_daily":
        maxLimit = userPlan.limits.codingSubmissionsPerDay;
        break;
      case "teaching_demo_monthly":
        maxLimit = userPlan.limits.teachingDemosPerMonth;
        break;
    }

    const isUnlimited = maxLimit >= 2000;
    const remaining = Math.max(0, maxLimit - currentUsage);
    const allowed = isUnlimited || currentUsage < maxLimit;

    return {
      allowed,
      metricKey: metric,
      currentUsage,
      maxLimit,
      remaining,
      planName: userPlan.planName,
      planCode: userPlan.planCode,
      isUnlimited,
    };
  }

  /**
   * Atomically increments usage count
   */
  public static async recordUsage(userId: string, metric: MetricKey, incrementCount = 1) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    try {
      await prisma.usageRecord.upsert({
        where: {
          userId_metricKey_date: {
            userId,
            metricKey: metric,
            date: today,
          },
        },
        update: {
          count: { increment: incrementCount },
        },
        create: {
          userId,
          metricKey: metric,
          count: incrementCount,
          date: today,
        },
      });
    } catch (err) {
      console.warn("UsageRecord upsert skipped in local session mode:", err);
    }
  }
}
