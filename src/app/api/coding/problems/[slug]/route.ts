import { NextRequest, NextResponse } from "next/server";
import { CODING_PROBLEMS } from "@/data/coding-problems";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const problem = CODING_PROBLEMS.find((p) => p.slug === slug || p.id === slug);

    if (!problem) {
      return NextResponse.json(
        { success: false, error: "Coding problem not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      problem: {
        id: problem.id,
        slug: problem.slug,
        title: problem.title,
        difficulty: problem.difficulty,
        category: problem.category,
        categoryLabel: problem.categoryLabel,
        description: problem.description,
        inputFormat: problem.inputFormat,
        outputFormat: problem.outputFormat,
        constraints: problem.constraints,
        expectedTimeComplexity: problem.expectedTimeComplexity,
        expectedSpaceComplexity: problem.expectedSpaceComplexity,
        academicSignificance: problem.academicSignificance,
        whiteboardTips: problem.whiteboardTips,
        sampleTestCases: problem.sampleTestCases,
        starterCode: problem.starterCode,
      },
    });
  } catch (error) {
    console.error("Fetch single coding problem error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch coding problem" },
      { status: 500 }
    );
  }
}
