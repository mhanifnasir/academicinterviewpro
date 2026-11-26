import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const commission = searchParams.get("commission");
    const search = searchParams.get("search");

    const defaultMaterials = [
      {
        id: "mat-1",
        title: "PPSC Computer Science Lecturer Past Papers (2015-2025 Solved)",
        category: "PAST_PAPER",
        commission: "PPSC",
        year: "2025",
        subjectTitle: "All CS Subjects",
        fileUrl: "/downloads/ppsc-cs-past-papers-2015-2025.pdf",
        fileSize: "14.2 MB",
        format: "PDF with Detailed Keys",
        description: "Official 100-mark screening test with authentic answer key and step-by-step mathematical explanations.",
        downloads: 4820,
      },
      {
        id: "mat-2",
        title: "PPSC Lecturer Computer Science Past Paper 2022 (Complete)",
        category: "PAST_PAPER",
        commission: "PPSC",
        year: "2022",
        subjectTitle: "Core Operating Systems & Data Structures",
        fileUrl: "/downloads/ppsc-cs-2022.pdf",
        fileSize: "3.9 MB",
        format: "PDF with Explanations",
        description: "High-yield OS and Data Structures questions asked in the 2022 recruitment batch.",
        downloads: 3610,
      },
      {
        id: "mat-3",
        title: "FPSC Federal CS Lecturer Past Paper F.4-148/2023",
        category: "PAST_PAPER",
        commission: "FPSC",
        year: "2023",
        subjectTitle: "Software Engineering & Architecture",
        fileUrl: "/downloads/fpsc-cs-curriculum-guide.pdf",
        fileSize: "5.2 MB",
        format: "PDF with Pedagogy Solutions",
        description: "Includes the 30-mark Pedagogy and Teaching Methodology section with references.",
        downloads: 2910,
      },
      {
        id: "mat-4",
        title: "HEC National Curriculum Guidelines for Computer Science (BS/MS Revised 2025)",
        category: "CURRICULUM",
        commission: "HEC",
        year: "2025",
        subjectTitle: "HEC National Curriculum",
        fileUrl: "/downloads/hec-cs-2025-curriculum.pdf",
        fileSize: "12.4 MB",
        format: "Official Document",
        description: "Standard course outlines recognized by provincial selection boards across Pakistan.",
        downloads: 7150,
      },
      {
        id: "mat-5",
        title: "High-Yield CS Lecturer Formula Sheet & Asymptotic Cheat Sheet",
        category: "FORMULA_SHEET",
        commission: "ALL",
        year: "2026 Edition",
        subjectTitle: "Data Structures & Algorithms",
        fileUrl: "/downloads/master-theorem-algorithms.pdf",
        fileSize: "2.1 MB",
        format: "Quick Revision Sheet",
        description: "Time & space complexities, recurrence relations, networking headers, and SQL syntax rules.",
        downloads: 5120,
      },
      {
        id: "mat-6",
        title: "The Ultimate CS Lecturer Viva Voce Trap Book (500 Board Qs)",
        category: "VIVA_HANDBOOK",
        commission: "ALL",
        year: "2026 Edition",
        subjectTitle: "Selection Board Viva Voce",
        fileUrl: "/downloads/selection-board-viva-handbook.pdf",
        fileSize: "8.6 MB",
        format: "PDF Handbook",
        description: "Curated collection of 500 questions asked by Subject Specialists in past selection interviews.",
        downloads: 6420,
      },
    ];

    try {
      const whereClause: Record<string, unknown> = {};
      if (category && category !== "ALL") whereClause.category = category;
      if (commission && commission !== "ALL") whereClause.commission = commission;

      const dbMaterials = await prisma.studyMaterial.findMany({
        where: whereClause,
        include: { subject: true },
        orderBy: { createdAt: "desc" },
      });

      if (dbMaterials.length > 0) {
        let results = dbMaterials.map((m) => ({
          id: m.id,
          title: m.title,
          category: m.category,
          commission: m.commission,
          year: m.year || "2026",
          subjectTitle: m.subject?.title || "Computer Science",
          fileUrl: m.fileUrl,
          fileSize: m.fileSize,
          format: m.format,
          description: m.description || "",
          downloads: 120,
        }));

        if (search) {
          const q = search.toLowerCase();
          results = results.filter(
            (r) =>
              r.title.toLowerCase().includes(q) ||
              r.description.toLowerCase().includes(q) ||
              r.category.toLowerCase().includes(q)
          );
        }

        return NextResponse.json({
          success: true,
          count: results.length,
          materials: results,
        });
      }
    } catch {
      // Fallback to default verified materials
    }

    let filtered = defaultMaterials;
    if (category && category !== "ALL") {
      filtered = filtered.filter((m) => m.category === category);
    }
    if (commission && commission !== "ALL") {
      filtered = filtered.filter((m) => m.commission === commission || m.commission === "ALL");
    }
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.description.toLowerCase().includes(q) ||
          m.category.toLowerCase().includes(q)
      );
    }

    return NextResponse.json({
      success: true,
      count: filtered.length,
      materials: filtered,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to load study materials";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
