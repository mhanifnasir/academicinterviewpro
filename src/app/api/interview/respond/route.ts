import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { AIInterviewService } from "@/lib/ai/interview-service";
import { InterviewerPersonalityKey, InterviewTypeKey } from "@/data/interview-personas";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      sessionId,
      questionId,
      responseTranscript,
      durationSeconds = 0,
    } = body;

    if (!sessionId || !questionId || !responseTranscript?.trim()) {
      return NextResponse.json(
        { success: false, error: "Missing required response parameters" },
        { status: 400 }
      );
    }

    // Try finding the session and question in the database
    let session = null;
    let question = null;

    try {
      session = await prisma.interviewSession.findUnique({
        where: { id: sessionId },
      });
      question = await prisma.interviewQuestion.findUnique({
        where: { id: questionId },
      });
    } catch {
      // Continue with fallback session
    }

    const currentOrder = question?.orderIndex || 1;
    const targetCount = session?.targetQuestionCount || 5;
    const personality = (session?.personality as InterviewerPersonalityKey) || "SENIOR_PROFESSOR";
    const interviewType = (session?.interviewType as InterviewTypeKey) || "TECHNICAL_CS";
    const difficulty = session?.difficulty || "MEDIUM";

    // Call interchangeable AI Service for evaluation
    const evaluation = await AIInterviewService.evaluateResponse({
      personality,
      interviewType,
      subjectSlug: session?.topicTitle || "data-structures",
      currentQuestionText: question?.questionText || "Core computing principles question",
      expectedKeywords: question?.expectedKeywords || ["algorithm", "complexity", "architecture"],
      candidateAnswer: responseTranscript,
      orderIndex: currentOrder,
      targetQuestionCount: targetCount,
      difficulty,
    });

    // Save Response & Evaluation in DB if available
    let nextQuestionData = null;

    try {
      // Save candidate response
      const savedResponse = await prisma.interviewResponse.create({
        data: {
          interviewQuestionId: questionId,
          transcriptText: responseTranscript,
          durationSeconds: Number(durationSeconds) || 0,
        },
      });

      // Save evaluation with exact 5 weighted criteria
      await prisma.interviewEvaluation.create({
        data: {
          interviewResponseId: savedResponse.id,
          technicalAccuracy: evaluation.technicalAccuracy,
          conceptualDepth: evaluation.conceptualUnderstanding,
          communication: evaluation.communication,
          answerStructure: evaluation.answerStructure,
          problemSolving: evaluation.problemSolving,
          weightedScore: evaluation.weightedScore,
          pedagogicalClarity: evaluation.communication,
          fluencyScore: evaluation.communication,
          verdict: evaluation.weightedScore >= 70 ? "RECOMMENDED" : "BORDERLINE",
          critique: evaluation.critique,
          technicalMistakes: evaluation.technicalMistakes,
          missingConcepts: evaluation.missingConcepts,
          modelAnswer: evaluation.modelAnswer,
          studyRecommendations: evaluation.studyRecommendations,
          followUpQuestion: evaluation.followUpQuestion,
        },
      });

      // If follow-up or next question exists, create the next InterviewQuestion
      if (evaluation.isFollowUp && evaluation.followUpQuestion) {
        const followUpQ = await prisma.interviewQuestion.create({
          data: {
            sessionId,
            panelistName: question?.panelistName || "Subject Specialist",
            panelistRole: question?.panelistRole || "Professor",
            questionText: evaluation.followUpQuestion,
            expectedKeywords: evaluation.missingConcepts,
            orderIndex: currentOrder,
            isFollowUp: true,
            difficulty,
          },
        });
        nextQuestionData = {
          id: followUpQ.id,
          orderIndex: followUpQ.orderIndex,
          isFollowUp: true,
          panelistName: followUpQ.panelistName,
          panelistRole: followUpQ.panelistRole,
          questionText: followUpQ.questionText,
          expectedKeywords: followUpQ.expectedKeywords,
        };
      } else if (!evaluation.isCompleted && evaluation.nextQuestion) {
        const nextQ = await prisma.interviewQuestion.create({
          data: {
            sessionId,
            panelistName: question?.panelistName || "Subject Specialist",
            panelistRole: question?.panelistRole || "Professor",
            questionText: evaluation.nextQuestion,
            expectedKeywords: ["principles", "trade-offs", "application"],
            orderIndex: currentOrder + 1,
            isFollowUp: false,
            difficulty,
          },
        });
        nextQuestionData = {
          id: nextQ.id,
          orderIndex: nextQ.orderIndex,
          isFollowUp: false,
          panelistName: nextQ.panelistName,
          panelistRole: nextQ.panelistRole,
          questionText: nextQ.questionText,
          expectedKeywords: nextQ.expectedKeywords,
        };
      }
    } catch (saveErr) {
      console.warn("DB response saving skipped in mock session:", saveErr);
      if (evaluation.isFollowUp && evaluation.followUpQuestion) {
        nextQuestionData = {
          id: `q-followup-${Date.now()}`,
          orderIndex: currentOrder,
          isFollowUp: true,
          panelistName: "Prof. Dr. Tariq Mahmood",
          panelistRole: "Subject Specialist",
          questionText: evaluation.followUpQuestion,
          expectedKeywords: evaluation.missingConcepts,
        };
      } else if (!evaluation.isCompleted && evaluation.nextQuestion) {
        nextQuestionData = {
          id: `q-${currentOrder + 1}-${Date.now()}`,
          orderIndex: currentOrder + 1,
          isFollowUp: false,
          panelistName: "Prof. Dr. Tariq Mahmood",
          panelistRole: "Subject Specialist",
          questionText: evaluation.nextQuestion,
          expectedKeywords: ["principles", "concurrency", "efficiency"],
        };
      }
    }

    return NextResponse.json({
      success: true,
      evaluation: {
        technicalAccuracy: evaluation.technicalAccuracy,
        conceptualUnderstanding: evaluation.conceptualUnderstanding,
        communication: evaluation.communication,
        answerStructure: evaluation.answerStructure,
        problemSolving: evaluation.problemSolving,
        weightedScore: evaluation.weightedScore,
        technicalMistakes: evaluation.technicalMistakes,
        missingConcepts: evaluation.missingConcepts,
        critique: evaluation.critique,
        modelAnswer: evaluation.modelAnswer,
        studyRecommendations: evaluation.studyRecommendations,
      },
      isFollowUp: evaluation.isFollowUp,
      isCompleted: evaluation.isCompleted || (!evaluation.isFollowUp && currentOrder >= targetCount),
      nextQuestion: nextQuestionData,
    });
  } catch (error) {
    console.error("Evaluate interview response error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to evaluate candidate response" },
      { status: 500 }
    );
  }
}
