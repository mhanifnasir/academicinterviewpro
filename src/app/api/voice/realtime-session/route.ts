import { NextRequest, NextResponse } from "next/server";
import { ENGLISH_PRACTICE_SCENARIOS, EnglishScenarioKey } from "@/data/english-scenarios";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      scenarioKey = "GENERAL_CONVERSATION",
      maxDurationSeconds = 600, // 10 minutes maximum for cost control
    } = body;

    const scenario =
      ENGLISH_PRACTICE_SCENARIOS[scenarioKey as EnglishScenarioKey] ||
      ENGLISH_PRACTICE_SCENARIOS.GENERAL_CONVERSATION;

    // Ephemeral temporary session credentials
    const sessionToken = `rtc-tok-${Math.random().toString(36).substring(2, 12)}-${Date.now()}`;
    const expiresAt = new Date(Date.now() + maxDurationSeconds * 1000).toISOString();

    // Check if Gemini or OpenAI Realtime API credentials exist
    const hasExternalRealtime = Boolean(process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY);

    return NextResponse.json({
      success: true,
      realtimeConfig: {
        sessionToken,
        serverUrl: hasExternalRealtime ? "wss://generativelanguage.googleapis.com/ws/live" : "webrtc-local-stream",
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
        expiresAt,
        maxDurationSeconds,
        scenario: {
          key: scenario.key,
          title: scenario.title,
          systemPrompt: scenario.systemPrompt,
          initialQuestion: scenario.initialExaminerQuestion,
          targetWPM: scenario.targetWPM,
          cefrTarget: scenario.cefrTarget,
        },
        mode: hasExternalRealtime ? "REMOTE_MULTIMODAL" : "BROWSER_WEBRTC_SIMULATED",
      },
    });
  } catch (error) {
    console.error("Realtime voice session creation error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to establish realtime voice session" },
      { status: 500 }
    );
  }
}
