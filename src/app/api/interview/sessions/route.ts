import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createServerClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    let userId: string | null = null;
    try {
      const supabase = await createServerClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) userId = user.id;
    } catch {
      // Continue without user
    }

    let sessions: unknown[] = [];
    try {
      sessions = await prisma.interviewSession.findMany({
        where: userId ? { userId } : {},
        orderBy: { createdAt: "desc" },
        take: 20,
        select: {
          id: true,
          interviewType: true,
          personality: true,
          difficulty: true,
          targetQuestionCount: true,
          topicTitle: true,
          status: true,
          overallScore: true,
          verdict: true,
          durationSeconds: true,
          createdAt: true,
        },
      });
    } catch {
      // Return empty list if DB unavailable
    }

    return NextResponse.json({
      success: true,
      sessions,
    });
  } catch (error) {
    console.error("Fetch interview sessions error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch interview sessions" },
      { status: 500 }
    );
  }
}
