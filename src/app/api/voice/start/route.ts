import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createServerClient } from "@/lib/supabase/server";
import {
  ENGLISH_PRACTICE_SCENARIOS,
  EnglishScenarioKey,
} from "@/data/english-scenarios";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      scenarioKey = "GENERAL_CONVERSATION" as EnglishScenarioKey,
      mode = "TURN_BASED", // "TURN_BASED" or "REALTIME"
      languageMode = "EN", // "EN" or "EN_WITH_URDU_EXPLANATIONS"
      maxDurationMinutes = 10,
    } = body;

    const scenario =
      ENGLISH_PRACTICE_SCENARIOS[scenarioKey as EnglishScenarioKey] ||
      ENGLISH_PRACTICE_SCENARIOS.GENERAL_CONVERSATION;

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

    let session;
    try {
      session = await prisma.voiceSession.create({
        data: {
          userId,
          topicTitle: scenario.title,
          scenarioKey: scenario.key,
          mode,
          languageMode,
          status: "ACTIVE",
          targetCadenceMin: scenario.targetWPM.min,
          targetCadenceMax: scenario.targetWPM.max,
          durationSeconds: 0,
        },
      });

      // Save initial AI examiner question
      await prisma.voiceMessage.create({
        data: {
          voiceSessionId: session.id,
          sender: "AI_EXAMINER",
          orderIndex: 0,
          transcriptText: scenario.initialExaminerQuestion,
          wpm: 130,
          durationSeconds: 10,
        },
      });

      return NextResponse.json({
        success: true,
        session: {
          id: session.id,
          scenarioKey: session.scenarioKey,
          title: scenario.title,
          subtitle: scenario.subtitle,
          mode: session.mode,
          languageMode: session.languageMode,
          targetCadence: scenario.targetWPM,
          cefrTarget: scenario.cefrTarget,
          maxDurationMinutes,
        },
        initialExaminerQuestion: scenario.initialExaminerQuestion,
      });
    } catch (dbErr) {
      console.warn("DB Session creation failed in fallback mode:", dbErr);
      const fallbackId = `voice-${scenario.key}-${Date.now()}`;
      return NextResponse.json({
        success: true,
        session: {
          id: fallbackId,
          scenarioKey: scenario.key,
          title: scenario.title,
          subtitle: scenario.subtitle,
          mode,
          languageMode,
          targetCadence: scenario.targetWPM,
          cefrTarget: scenario.cefrTarget,
          maxDurationMinutes,
        },
        initialExaminerQuestion: scenario.initialExaminerQuestion,
      });
    }
  } catch (error) {
    console.error("Start voice session error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to initiate voice session" },
      { status: 500 }
    );
  }
}
