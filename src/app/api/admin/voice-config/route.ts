import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, logAdminAuditAction } from "@/lib/auth/admin-guard";
import { ENGLISH_PRACTICE_SCENARIOS } from "@/data/english-scenarios";

const activeVoiceConfig = {
  activeProvider: "WEB_SPEECH_API" as "WEB_SPEECH_API" | "OPENAI_REALTIME" | "ELEVENLABS" | "DEEPGRAM",
  maxSessionDurationMinutes: 10,
  targetCadenceWpm: { min: 120, max: 145 },
  allowUrduExplanations: true,
  audioFormat: "audio/webm",
  sampleRateHz: 48000,
  scenariosCount: Object.keys(ENGLISH_PRACTICE_SCENARIOS).length,
  scenarios: Object.values(ENGLISH_PRACTICE_SCENARIOS),
};

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.authorized) {
    return NextResponse.json({ success: false, error: auth.error }, { status: 403 });
  }

  return NextResponse.json({
    success: true,
    voiceConfig: activeVoiceConfig,
  });
}

export async function PUT(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.authorized) {
    return NextResponse.json({ success: false, error: auth.error }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { activeProvider, maxSessionDurationMinutes, targetCadenceWpm, allowUrduExplanations } = body;

    if (activeProvider) activeVoiceConfig.activeProvider = activeProvider;
    if (maxSessionDurationMinutes) activeVoiceConfig.maxSessionDurationMinutes = Number(maxSessionDurationMinutes);
    if (targetCadenceWpm) activeVoiceConfig.targetCadenceWpm = targetCadenceWpm;
    if (allowUrduExplanations !== undefined) activeVoiceConfig.allowUrduExplanations = Boolean(allowUrduExplanations);

    await logAdminAuditAction({
      actorId: auth.userId,
      action: "VOICE_CONFIG_UPDATED",
      entityType: "VoiceSettings",
      metadata: { activeProvider, maxSessionDurationMinutes, allowUrduExplanations },
    });

    return NextResponse.json({
      success: true,
      message: "Voice management configuration updated successfully.",
      voiceConfig: activeVoiceConfig,
    });
  } catch (error) {
    console.error("Update voice config error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update voice configuration" },
      { status: 500 }
    );
  }
}
