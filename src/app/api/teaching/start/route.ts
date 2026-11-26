import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createServerClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      subjectTitle = "Operating Systems",
      topicTitle = "Virtual Memory & Paging",
      durationMinutes = 5,
      teachingLanguage = "EN",
      recordingType = "AUDIO",
    } = body;

    // Resolve User ID
    let userId = "guest-candidate-id";
    try {
      const supabase = await createServerClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        userId = user.id;
      } else {
        const firstProfile = await prisma.profile.findFirst();
        if (firstProfile) userId = firstProfile.id;
      }
    } catch {
      const firstProfile = await prisma.profile.findFirst().catch(() => null);
      if (firstProfile) userId = firstProfile.id;
    }

    let session = null;
    try {
      session = await prisma.teachingDemoSession.create({
        data: {
          userId,
          subjectTitle,
          topicTitle,
          durationMinutes: Number(durationMinutes) || 5,
          teachingLanguage,
          recordingType,
          transcriptText: "",
          status: "ACTIVE",
        },
      });
    } catch (dbErr) {
      console.warn("DB TeachingDemoSession creation skipped in local mode:", dbErr);
    }

    return NextResponse.json({
      success: true,
      session: {
        id: session?.id || `demo-${Date.now()}`,
        subjectTitle,
        topicTitle,
        durationMinutes,
        teachingLanguage,
        recordingType,
        status: "ACTIVE",
      },
    });
  } catch (error) {
    console.error("Start teaching demo error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to initialize teaching demonstration" },
      { status: 500 }
    );
  }
}
