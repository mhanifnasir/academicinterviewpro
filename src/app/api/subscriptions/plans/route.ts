import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Plan } from "@prisma/client";
import { SUBSCRIPTION_PLANS } from "@/data/subscription-plans";

export async function GET(_request: NextRequest) {
  try {
    let dbPlans: Plan[] = [];
    try {
      dbPlans = await prisma.plan.findMany({
        where: { isActive: true },
        orderBy: { displayOrder: "asc" },
      });
    } catch {
      // Fallback
    }

    if (dbPlans.length > 0) {
      const plans = dbPlans.map((p) => ({
        id: p.id,
        code: p.code,
        name: p.name,
        description: p.description,
        priceMonthlyPKR: p.priceMonthlyPKR || p.pricePKR || 0,
        priceYearlyPKR: p.priceYearlyPKR || (p.priceMonthlyPKR ? p.priceMonthlyPKR * 10 : 0),
        features: Array.isArray(p.featuresJson) ? p.featuresJson : [],
        limits: p.limitsJson || {
          mcqPerDay: 50,
          aiInterviewsPerMonth: 5,
          voiceSessionsPerMonth: 5,
          mockTestsPerMonth: 2,
          codingSubmissionsPerDay: 10,
          teachingDemosPerMonth: 2,
        },
        isPopular: p.isPopular,
        displayOrder: p.displayOrder,
      }));

      return NextResponse.json({ success: true, plans });
    }

    // Static fallback
    return NextResponse.json({
      success: true,
      plans: SUBSCRIPTION_PLANS,
    });
  } catch (error) {
    console.error("Fetch plans API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch plans" },
      { status: 500 }
    );
  }
}
