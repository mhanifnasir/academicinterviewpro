import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { STANDARD_EXAM_TEMPLATES } from "@/data/mock-templates";
import { INITIAL_QUESTION_BANK, HEC_SUBJECTS_2025 } from "@/data/hec-curriculum-2025";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { templateId, templateSlug = "ppsc-cs-100-standard", customConfig } = body;

    // 1. Identify User
    let userId = "00000000-0000-0000-0000-000000000001";
    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) userId = user.id;
    } catch {
      // Demo / fallback candidate
    }

    // 2. Resolve Template
    let template = null;
    try {
      template = await prisma.testTemplate.findFirst({
        where: {
          OR: [{ id: templateId }, { slug: templateSlug }],
        },
      });
    } catch {
      // Fallback
    }

    if (!template) {
      const fallbackConfig =
        STANDARD_EXAM_TEMPLATES.find((t) => t.id === templateId || t.slug === templateSlug) ||
        STANDARD_EXAM_TEMPLATES[0];

      template = {
        id: fallbackConfig.id,
        slug: fallbackConfig.slug,
        title: fallbackConfig.title,
        commission: fallbackConfig.commission,
        questionCount: fallbackConfig.questionCount,
        durationMinutes: fallbackConfig.durationMinutes,
        totalMarks: fallbackConfig.totalMarks,
        negativeMarkingRate: fallbackConfig.negativeMarkingRate,
        subjectRatioJson: fallbackConfig.subjectRatio,
        difficultyRatioJson: fallbackConfig.difficultyRatio,
      };
    }

    // Override with custom config if custom exam selected
    if (customConfig) {
      if (customConfig.questionCount) template.questionCount = Number(customConfig.questionCount);
      if (customConfig.durationMinutes) template.durationMinutes = Number(customConfig.durationMinutes);
      if (customConfig.negativeMarkingRate !== undefined)
        template.negativeMarkingRate = Number(customConfig.negativeMarkingRate);
    }

    const questionCount = template.questionCount || 100;
    const attemptId = `att-${Date.now()}-${Math.random().toString(36).substring(7)}`;

    // 3. Gather Exam Questions
    let selectedQuestions: {
      id: string;
      statement: string;
      subjectSlug: string;
      topicSlug?: string;
      difficulty: string;
      options: { optionKey: "A" | "B" | "C" | "D"; statement: string }[];
    }[] = [];

    try {
      // Attempt to load from database
      const dbQuestions = await prisma.question.findMany({
        where: { status: "APPROVED", type: "MCQ" },
        take: questionCount,
        orderBy: { createdAt: "desc" },
        include: {
          subject: { select: { slug: true } },
          topic: { select: { slug: true } },
          options: {
            select: {
              optionKey: true,
              statement: true,
              // CRITICAL SECURITY REQUIREMENT: DO NOT expose isCorrect!
            },
            orderBy: { optionKey: "asc" },
          },
        },
      });

      if (dbQuestions && dbQuestions.length >= Math.min(10, questionCount)) {
        selectedQuestions = dbQuestions.map((q) => ({
          id: q.id,
          statement: q.statement,
          subjectSlug: q.subject?.slug || "general",
          topicSlug: q.topic?.slug,
          difficulty: q.difficulty,
          options: q.options as { optionKey: "A" | "B" | "C" | "D"; statement: string }[],
        }));
      }
    } catch {
      // Fallback to in-memory question bank
    }

    // If database returned fewer questions, pad from INITIAL_QUESTION_BANK
    if (selectedQuestions.length < questionCount) {
      const needed = questionCount - selectedQuestions.length;
      const approvedBank = INITIAL_QUESTION_BANK.filter((q) => q.type === "MCQ");

      for (let i = 0; i < needed; i++) {
        const base = approvedBank[i % approvedBank.length];
        const subIndex = Math.floor(i / approvedBank.length);

        // CRITICAL SECURITY REQUIREMENT:
        // Strip isCorrect, detailedExplanation, keyPoints, and referenceCitation!
        selectedQuestions.push({
          id: subIndex === 0 ? base.id : `${base.id}-copy-${i}`,
          statement: base.statement,
          subjectSlug: base.subjectSlug,
          topicSlug: base.topicSlug,
          difficulty: base.difficulty,
          options: (base.options || []).map((opt) => ({
            optionKey: opt.optionKey,
            statement: opt.statement,
            // isCorrect is completely stripped!
          })),
        });
      }
    }

    // 4. Create TestAttempt in Database
    try {
      const dbAttempt = await prisma.testAttempt.create({
        data: {
          id: attemptId,
          userId,
          templateId: template.id,
          startedAt: new Date(),
          status: "IN_PROGRESS",
          rawScore: 0,
          negativeDeductions: 0,
          finalScore: 0,
          percentage: 0,
        },
      });
      // Return active examination payload
      return NextResponse.json({
        success: true,
        attemptId: dbAttempt.id,
        template: {
          id: template.id,
          title: template.title,
          slug: template.slug,
          commission: template.commission,
          durationMinutes: template.durationMinutes,
          totalMarks: template.totalMarks,
          negativeMarkingRate: Number(template.negativeMarkingRate),
          questionCount: selectedQuestions.length,
        },
        startedAt: dbAttempt.startedAt,
        durationSeconds: template.durationMinutes * 60,
        questions: selectedQuestions, // SANITIZED!
      });
    } catch {
      // Mock session return
      return NextResponse.json({
        success: true,
        attemptId,
        template: {
          id: template.id,
          title: template.title,
          slug: template.slug,
          commission: template.commission,
          durationMinutes: template.durationMinutes,
          totalMarks: template.totalMarks,
          negativeMarkingRate: Number(template.negativeMarkingRate),
          questionCount: selectedQuestions.length,
        },
        startedAt: new Date().toISOString(),
        durationSeconds: template.durationMinutes * 60,
        questions: selectedQuestions, // SANITIZED!
      });
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to start examination";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
