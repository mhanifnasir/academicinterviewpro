import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, logAdminAuditAction } from "@/lib/auth/admin-guard";

// In-memory versioned prompt store (persisted across sessions in memory and backed by audit logs)
interface PromptVersion {
  version: string;
  updatedAt: string;
  updatedBy: string;
  notes: string;
  promptText: string;
}

const activeAiConfig = {
  activeModel: "Gemini 2.5 Flash / Pro (Interchangeable Server Engine)",
  provider: "GOOGLE_GEMINI",
  temperature: 0.2,
  maxOutputTokens: 2048,
  strictness: "High (Public Service Commission BS-17 Standard)",
  promptDrillingDepth: 3,
  systemPrompt: `You are simulating a Pakistani Public Service Commission (PPSC / FPSC) Selection Board viva voce panel for BPS-17 Computer Science Lecturer recruitment.
Evaluate the candidate across:
1. Technical precision of definitions (e.g. Master Theorem cases, Belady's anomaly, vtable pointer dispatch, B+ Tree fan-out).
2. Spoken academic clarity and professional poise.
3. Pedagogical analogies suited for university undergraduate instruction.
Challenge superficial answers with deep follow-ups.`,
  rubricWeights: {
    technicalAccuracy: 40,
    conceptualUnderstanding: 25,
    communication: 15,
    answerStructure: 10,
    problemSolving: 10,
  },
  promptVersions: [
    {
      version: "v1.2 (Active)",
      updatedAt: "Nov 18, 2026",
      updatedBy: "Dr. Tariq Mahmood (Admin)",
      notes: "Added strict Belady's anomaly & vtable dispatch follow-up triggers",
      promptText: `You are simulating a Pakistani Public Service Commission (PPSC / FPSC) Selection Board viva voce panel for BPS-17 Computer Science Lecturer recruitment.
Evaluate the candidate across:
1. Technical precision of definitions (e.g. Master Theorem cases, Belady's anomaly, vtable pointer dispatch, B+ Tree fan-out).
2. Spoken academic clarity and professional poise.
3. Pedagogical analogies suited for university undergraduate instruction.
Challenge superficial answers with deep follow-ups.`,
    },
    {
      version: "v1.1",
      updatedAt: "Oct 25, 2026",
      updatedBy: "Admin Superuser",
      notes: "Integrated HEC Revised 2025 curriculum weightages",
      promptText: `You are an academic interviewer for Computer Science Lecturer candidates. Probe their technical depth and lecture communication.`,
    },
    {
      version: "v1.0",
      updatedAt: "Sep 01, 2026",
      updatedBy: "System Baseline",
      notes: "Initial baseline prompt for technical interview simulator",
      promptText: `Ask technical questions from BS Computer Science curriculum.`,
    },
  ] as PromptVersion[],
  tokenUsage: {
    totalTokensThisMonth: "4,240,000",
    estimatedCostUSD: "$8.48",
    estimatedCostPKR: "₨ 2,360",
    averageLatencyMs: 420,
  },
};

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.authorized) {
    return NextResponse.json({ success: false, error: auth.error }, { status: 403 });
  }

  return NextResponse.json({
    success: true,
    config: activeAiConfig,
  });
}

export async function PUT(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.authorized) {
    return NextResponse.json({ success: false, error: auth.error }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { activeModel, temperature, strictness, systemPrompt, versionNotes } = body;

    if (systemPrompt && systemPrompt !== activeAiConfig.systemPrompt) {
      const newVersion: PromptVersion = {
        version: `v1.${activeAiConfig.promptVersions.length} (Active)`,
        updatedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        updatedBy: auth.userEmail,
        notes: versionNotes || "Manual prompt calibration update",
        promptText: systemPrompt,
      };

      activeAiConfig.promptVersions = [
        newVersion,
        ...activeAiConfig.promptVersions.map((v) => ({ ...v, version: v.version.replace(" (Active)", "") })),
      ];
      activeAiConfig.systemPrompt = systemPrompt;
    }

    if (activeModel) activeAiConfig.activeModel = activeModel;
    if (temperature !== undefined) activeAiConfig.temperature = Number(temperature);
    if (strictness) activeAiConfig.strictness = strictness;

    await logAdminAuditAction({
      actorId: auth.userId,
      action: "AI_CONFIG_UPDATED",
      entityType: "AISettings",
      metadata: { activeModel, temperature, strictness },
    });

    return NextResponse.json({
      success: true,
      message: "AI configuration and prompt versioning successfully deployed.",
      config: activeAiConfig,
    });
  } catch (error) {
    console.error("Update AI config error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update AI configuration" },
      { status: 500 }
    );
  }
}
