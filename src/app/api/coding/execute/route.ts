import { NextRequest, NextResponse } from "next/server";
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
    const testCases = problem ? problem.sampleTestCases : [];

    // Sandboxed execution (strictly off host VPS, restricted I/O)
    const result = await SandboxExecutionService.executeCode({
      language: language as ProgrammingLanguage,
      code,
      testCases,
      timeoutMs: 3000,
    });

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error("Execute code error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to execute code in sandbox" },
      { status: 500 }
    );
  }
}
