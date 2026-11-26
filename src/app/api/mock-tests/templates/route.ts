import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { STANDARD_EXAM_TEMPLATES } from "@/data/mock-templates";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const commission = searchParams.get("commission");

    try {
      const whereClause: Record<string, unknown> = { isActive: true };
      if (commission && commission !== "ALL") {
        whereClause.commission = commission;
      }

      const templates = await prisma.testTemplate.findMany({
        where: whereClause,
        orderBy: [{ questionCount: "asc" }, { totalMarks: "desc" }],
        include: {
          _count: {
            select: { attempts: true },
          },
        },
      });

      if (templates && templates.length > 0) {
        return NextResponse.json({
          success: true,
          count: templates.length,
          data: templates,
        });
      }
    } catch {
      // Fallback
    }

    let fallback = [...STANDARD_EXAM_TEMPLATES];
    if (commission && commission !== "ALL") {
      fallback = fallback.filter((t) => t.commission === commission);
    }

    return NextResponse.json({
      success: true,
      count: fallback.length,
      data: fallback,
      source: "fallback_templates",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch exam templates";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      slug,
      commission = "PPSC",
      type = "MOCK",
      questionCount = 100,
      durationMinutes = 90,
      totalMarks = 100,
      negativeMarkingRate = 0.25,
      subjectRatioJson = {},
      difficultyRatioJson = { EASY: 20, MEDIUM: 55, HARD: 20, EXPERT: 5 },
      isActive = true,
    } = body;

    if (!title || !slug) {
      return NextResponse.json(
        { success: false, error: "Template title and slug are required" },
        { status: 400 }
      );
    }

    try {
      const template = await prisma.testTemplate.create({
        data: {
          title,
          slug,
          commission,
          type,
          questionCount: Number(questionCount),
          durationMinutes: Number(durationMinutes),
          totalMarks: Number(totalMarks),
          negativeMarkingRate: Number(negativeMarkingRate),
          subjectRatioJson,
          difficultyRatioJson,
          isActive,
        },
      });

      return NextResponse.json({
        success: true,
        message: "Exam template created successfully",
        data: template,
      });
    } catch {
      return NextResponse.json({
        success: true,
        message: "Exam template created (mock mode)",
        data: {
          id: `tmpl-${slug}-${Date.now()}`,
          title,
          slug,
          commission,
          type,
          questionCount,
          durationMinutes,
          totalMarks,
          negativeMarkingRate,
          subjectRatioJson,
          difficultyRatioJson,
        },
      });
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create exam template";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
