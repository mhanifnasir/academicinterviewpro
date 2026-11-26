import { NextResponse } from "next/server";
import { CODING_PROBLEMS } from "@/data/coding-problems";

export async function GET() {
  try {
    const list = CODING_PROBLEMS.map((p) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      difficulty: p.difficulty,
      category: p.category,
      categoryLabel: p.categoryLabel,
      description: p.description,
      expectedTimeComplexity: p.expectedTimeComplexity,
      expectedSpaceComplexity: p.expectedSpaceComplexity,
      academicSignificance: p.academicSignificance,
      sampleTestCount: p.sampleTestCases.length,
      hiddenTestCount: p.hiddenTestCases.length,
    }));

    return NextResponse.json({
      success: true,
      problems: list,
    });
  } catch (error) {
    console.error("Fetch coding problems error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch coding problems" },
      { status: 500 }
    );
  }
}
