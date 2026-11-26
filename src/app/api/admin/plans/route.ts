import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma, Plan } from "@prisma/client";
import { SUBSCRIPTION_PLANS } from "@/data/subscription-plans";

export async function GET(_request: NextRequest) {
  try {
    let dbPlans: Plan[] = [];
    try {
      dbPlans = await prisma.plan.findMany({
        orderBy: { displayOrder: "asc" },
      });
    } catch {
      // Fallback
    }

    if (dbPlans.length > 0) {
      return NextResponse.json({ success: true, plans: dbPlans });
    }

    // Initialize/seed from static plans if DB empty
    try {
      for (const p of SUBSCRIPTION_PLANS) {
        await prisma.plan.upsert({
          where: { code: p.code },
          update: {
            name: p.name,
            priceMonthlyPKR: p.priceMonthlyPKR,
            priceYearlyPKR: p.priceYearlyPKR,
            pricePKR: p.priceMonthlyPKR,
            description: p.description,
            featuresJson: p.features as unknown as Prisma.InputJsonValue,
            limitsJson: p.limits as unknown as Prisma.InputJsonValue,
            isPopular: p.isPopular || false,
            displayOrder: p.displayOrder,
          },
          create: {
            code: p.code,
            name: p.name,
            priceMonthlyPKR: p.priceMonthlyPKR,
            priceYearlyPKR: p.priceYearlyPKR,
            pricePKR: p.priceMonthlyPKR,
            description: p.description,
            featuresJson: p.features as unknown as Prisma.InputJsonValue,
            limitsJson: p.limits as unknown as Prisma.InputJsonValue,
            isPopular: p.isPopular || false,
            displayOrder: p.displayOrder,
          },
        });
      }
      dbPlans = await prisma.plan.findMany({ orderBy: { displayOrder: "asc" } });
      return NextResponse.json({ success: true, plans: dbPlans });
    } catch {
      return NextResponse.json({ success: true, plans: SUBSCRIPTION_PLANS });
    }
  } catch (error) {
    console.error("Admin get plans error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch plans" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      code,
      name,
      priceMonthlyPKR,
      priceYearlyPKR,
      description,
      features,
      limits,
      isActive,
    } = body;

    if (!code) {
      return NextResponse.json(
        { success: false, error: "Plan code is required" },
        { status: 400 }
      );
    }

    const updated = await prisma.plan.upsert({
      where: { code },
      update: {
        name,
        priceMonthlyPKR: Number(priceMonthlyPKR),
        priceYearlyPKR: Number(priceYearlyPKR),
        pricePKR: Number(priceMonthlyPKR),
        description,
        featuresJson: features as unknown as Prisma.InputJsonValue,
        limitsJson: limits as unknown as Prisma.InputJsonValue,
        isActive: isActive !== undefined ? Boolean(isActive) : true,
      },
      create: {
        code,
        name: name || code,
        priceMonthlyPKR: Number(priceMonthlyPKR) || 0,
        priceYearlyPKR: Number(priceYearlyPKR) || 0,
        pricePKR: Number(priceMonthlyPKR) || 0,
        description,
        featuresJson: features as unknown as Prisma.InputJsonValue,
        limitsJson: limits as unknown as Prisma.InputJsonValue,
        isActive: true,
      },
    });

    return NextResponse.json({
      success: true,
      plan: updated,
      message: `Plan ${code} and limits updated dynamically in database.`,
    });
  } catch (error) {
    console.error("Admin update plan error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update plan limits" },
      { status: 500 }
    );
  }
}
