import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { createServerClient } from "@/lib/supabase/server";
import { SandboxExecutionService } from "@/lib/code-execution/sandbox-service";
import { CODING_PROBLEMS, ProgrammingLanguage } from "@/data/coding-problems";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      problemSlug,
      language = "cpp" as ProgrammingLanguage,
      code = "",
    } = body;

    if (!code?.trim()) {
      return NextResponse.json(
        { success: false, error: "Empty code buffer received" },
        { status: 400 }
      );
    }

    const problem = CODING_PROBLEMS.find((p) => p.slug === problemSlug || p.id === problemSlug);
    if (!problem) {
      return NextResponse.json(
        { success: false, error: "Coding problem not found" },
        { status: 404 }
      );
    }

    // Combine sample and hidden test cases for final evaluation
    const allTestCases = [...problem.sampleTestCases, ...problem.hiddenTestCases];

    // Execute in secure sandbox
    const result = await SandboxExecutionService.executeCode({
      language: language as ProgrammingLanguage,
      code,
      testCases: allTestCases,
      timeoutMs: 3000,
    });

    // Resolve user ID
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

    // Persist submission record in database
    let submissionRecord = null;
    try {
      // Find or create problem in DB
      let dbProblem = await prisma.codingProblem.findUnique({
        where: { slug: problem.slug },
      });

      if (!dbProblem) {
        dbProblem = await prisma.codingProblem.create({
          data: {
            slug: problem.slug,
            title: problem.title,
            difficulty: problem.difficulty,
            category: problem.category,
            description: problem.description,
            constraints: problem.constraints.join("\n"),
            sampleInput: problem.sampleTestCases[0]?.input || "",
            sampleOutput: problem.sampleTestCases[0]?.expectedOutput || "",
            expectedTimeComplexity: problem.expectedTimeComplexity,
            expectedSpaceComplexity: problem.expectedSpaceComplexity,
            academicSignificance: problem.academicSignificance,
          },
        });
      }

      submissionRecord = await prisma.codeSubmission.create({
        data: {
          userId,
          problemId: dbProblem.id,
          language,
          code,
          status: result.status,
          passedTests: result.passedTests,
          totalTests: result.totalTests,
          executionTimeMs: result.executionTimeMs,
          memoryKb: result.memoryKb,
          aiExplanation: result.aiExplanation,
          timeComplexityFound: result.timeComplexity,
          spaceComplexityFound: result.spaceComplexity,
          testResultsJson: result.testResults as unknown as Prisma.InputJsonValue,
        },
      });
    } catch (dbErr) {
      console.warn("DB submission persistence skipped in local session mode:", dbErr);
    }

    return NextResponse.json({
      success: true,
      submission: {
        id: submissionRecord?.id || `sub-${Date.now()}`,
        status: result.status,
        passedTests: result.passedTests,
        totalTests: result.totalTests,
        executionTimeMs: result.executionTimeMs,
        memoryKb: result.memoryKb,
        timeComplexity: result.timeComplexity,
        spaceComplexity: result.spaceComplexity,
        aiExplanation: result.aiExplanation,
        testResults: result.testResults,
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Submit code error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to grade code submission" },
      { status: 500 }
    );
  }
}
