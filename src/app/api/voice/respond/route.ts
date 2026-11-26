import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { EnglishVoiceEvaluator } from "@/lib/ai/english-evaluator";
import { EnglishScenarioKey } from "@/data/english-scenarios";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      sessionId,
      candidateTranscript,
      audioDurationSeconds = 15,
      turnIndex = 1,
      languageMode = "EN",
      scenarioKey = "GENERAL_CONVERSATION",
    } = body;

    if (!candidateTranscript?.trim()) {
      return NextResponse.json(
        { success: false, error: "Empty speech transcript received" },
        { status: 400 }
      );
    }

    const includeUrdu = languageMode === "EN_WITH_URDU_EXPLANATIONS";

    // Call English linguistic evaluation engine
    const evaluation = await EnglishVoiceEvaluator.evaluateTranscript({
      scenarioKey: scenarioKey as EnglishScenarioKey,
      candidateTranscript,
      audioDurationSeconds: Number(audioDurationSeconds) || 15,
      turnIndex: Number(turnIndex) || 1,
      includeUrdu,
    });

    // Save candidate message & evaluation to DB if available
    try {
      if (sessionId && !sessionId.startsWith("voice-")) {
        // Save candidate message
        const candidateMsg = await prisma.voiceMessage.create({
          data: {
            voiceSessionId: sessionId,
            sender: "CANDIDATE",
            orderIndex: Number(turnIndex) * 2 - 1,
            transcriptText: candidateTranscript,
            wpm: evaluation.wordsPerMinute,
            durationSeconds: Math.round(Number(audioDurationSeconds) || 15),
          },
        });

        // Save evaluation
        await prisma.voiceEvaluation.create({
          data: {
            voiceMessageId: candidateMsg.id,
            wordsPerMinute: evaluation.wordsPerMinute,
            fillerWordCount: evaluation.fillerWordCount,
            fillerWordsJson: evaluation.fillerWords,
            grammarScore: evaluation.grammarScore,
            fluencyScore: evaluation.fluencyScore,
            vocabularyScore: evaluation.vocabularyScore,
            pronunciationScore: evaluation.pronunciationScore,
            clarityScore: evaluation.clarityScore,
            relevanceScore: evaluation.relevanceScore,
            academicToneScore: evaluation.vocabularyScore,
            correctedText: evaluation.correctedSentence,
            grammarExplanation: evaluation.grammarExplanation,
            urduExplanation: evaluation.urduExplanation || null,
            vocabularyUpgradesJson: evaluation.vocabularyUpgrades,
            suggestedPractice: evaluation.suggestedPractice,
            feedbackText: evaluation.grammarExplanation,
          },
        });

        // Save AI Examiner follow-up reply
        await prisma.voiceMessage.create({
          data: {
            voiceSessionId: sessionId,
            sender: "AI_EXAMINER",
            orderIndex: Number(turnIndex) * 2,
            transcriptText: evaluation.aiConversationalReply,
            wpm: 130,
            durationSeconds: 10,
          },
        });
      }
    } catch (saveErr) {
      console.warn("DB voice message save skipped in local session mode:", saveErr);
    }

    return NextResponse.json({
      success: true,
      evaluation: {
        grammarScore: evaluation.grammarScore,
        fluencyScore: evaluation.fluencyScore,
        vocabularyScore: evaluation.vocabularyScore,
        pronunciationScore: evaluation.pronunciationScore,
        clarityScore: evaluation.clarityScore,
        relevanceScore: evaluation.relevanceScore,
        overallScore: evaluation.overallScore,
        wordsPerMinute: evaluation.wordsPerMinute,
        fillerWordCount: evaluation.fillerWordCount,
        fillerWords: evaluation.fillerWords,
        correctedSentence: evaluation.correctedSentence,
        grammarExplanation: evaluation.grammarExplanation,
        urduExplanation: evaluation.urduExplanation,
        vocabularyUpgrades: evaluation.vocabularyUpgrades,
        suggestedPractice: evaluation.suggestedPractice,
      },
      aiConversationalReply: evaluation.aiConversationalReply,
    });
  } catch (error) {
    console.error("Evaluate voice response error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to evaluate spoken response" },
      { status: 500 }
    );
  }
}
