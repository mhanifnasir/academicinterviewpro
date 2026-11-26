import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { TeachingEvaluator } from "@/lib/ai/teaching-evaluator";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      sessionId,
      subjectTitle = "Operating Systems",
      topicTitle = "Virtual Memory & Paging",
      teachingLanguage = "EN",
      durationMinutes = 5,
      transcriptText = "",
      mediaUrl,
    } = body;

    if (!transcriptText?.trim()) {
      return NextResponse.json(
        { success: false, error: "Teaching lecture transcript is empty" },
        { status: 400 }
      );
    }

    // Call AI Pedagogical Evaluator for 8 dimensions
    const evaluation = await TeachingEvaluator.evaluateLecture({
      subjectTitle,
      topicTitle,
      teachingLanguage,
      durationMinutes: Number(durationMinutes) || 5,
      transcriptText,
    });

    // Update database session
    try {
      if (sessionId && !sessionId.startsWith("demo-")) {
        await prisma.teachingDemoSession.update({
          where: { id: sessionId },
          data: {
            transcriptText,
            mediaUrl: mediaUrl || null,
            status: "COMPLETED",
            overallScore: evaluation.overallScore,
            rubricBreakdownJson: evaluation.rubricBreakdown as unknown as Prisma.InputJsonValue,
            feedbackJson: {
              verdict: evaluation.verdict,
              strengths: evaluation.strengths,
              pedagogicalImprovements: evaluation.pedagogicalImprovements,
              blackboardAdvice: evaluation.blackboardAdvice,
              executiveSummary: evaluation.executiveSummary,
            } as unknown as Prisma.InputJsonValue,
          },
        });
      }
    } catch (dbErr) {
      console.warn("DB TeachingDemoSession update skipped in local mode:", dbErr);
    }

    return NextResponse.json({
      success: true,
      evaluation,
    });
  } catch (error) {
    console.error("Evaluate teaching demo error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to evaluate teaching demonstration" },
      { status: 500 }
    );
  }
}
