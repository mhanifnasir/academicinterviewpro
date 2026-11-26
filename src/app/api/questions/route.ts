import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { INITIAL_QUESTION_BANK, HECQuestion } from "@/data/hec-curriculum-2025";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const subjectId = searchParams.get("subjectId");
    const subjectSlug = searchParams.get("subjectSlug");
    const topicId = searchParams.get("topicId");
    const topicSlug = searchParams.get("topicSlug");
    const type = searchParams.get("type"); // MCQ, SHORT, LONG, CONCEPTUAL, SCENARIO
    const difficulty = searchParams.get("difficulty"); // EASY, MEDIUM, HARD, EXPERT
    const status = searchParams.get("status"); // DRAFT, PENDING_REVIEW, APPROVED, REJECTED
    const origin = searchParams.get("origin"); // VERIFIED, AI_GENERATED
    const search = searchParams.get("search");
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get("limit") || "20", 10)));
    const skip = (page - 1) * limit;

    try {
      const whereClause: Record<string, unknown> = {};

      if (subjectId) whereClause.subjectId = subjectId;
      if (subjectSlug) whereClause.subject = { slug: subjectSlug };
      if (topicId) whereClause.topicId = topicId;
      if (topicSlug) whereClause.topic = { slug: topicSlug };
      if (type) whereClause.type = type;
      if (difficulty) whereClause.difficulty = difficulty;
      if (status) whereClause.status = status;
      if (origin) whereClause.origin = origin;
      if (search) {
        whereClause.OR = [
          { statement: { contains: search, mode: "insensitive" } },
          { answer: { detailedExplanation: { contains: search, mode: "insensitive" } } },
          { answer: { referenceCitation: { contains: search, mode: "insensitive" } } },
        ];
      }

      const [totalCount, questions] = await Promise.all([
        prisma.question.count({ where: whereClause }),
        prisma.question.findMany({
          where: whereClause,
          skip,
          take: limit,
          orderBy: { createdAt: "desc" },
          include: {
            subject: { select: { id: true, title: true, code: true, slug: true } },
            topic: { select: { id: true, name: true, slug: true } },
            options: { orderBy: { optionKey: "asc" } },
            answer: true,
            sources: true,
            reviews: { orderBy: { createdAt: "desc" }, take: 1 },
          },
        }),
      ]);

      if (questions && questions.length > 0) {
        return NextResponse.json({
          success: true,
          totalCount,
          page,
          totalPages: Math.ceil(totalCount / limit),
          data: questions,
        });
      }
    } catch {
      // Fallback to in-memory question bank
    }

    let filtered: HECQuestion[] = [...INITIAL_QUESTION_BANK];

    if (subjectSlug) {
      filtered = filtered.filter((q) => q.subjectSlug === subjectSlug);
    }
    if (topicSlug) {
      filtered = filtered.filter((q) => q.topicSlug === topicSlug);
    }
    if (type) {
      filtered = filtered.filter((q) => q.type === type);
    }
    if (difficulty) {
      filtered = filtered.filter((q) => q.difficulty === difficulty);
    }
    if (status) {
      filtered = filtered.filter((q) => q.status === status);
    }
    if (origin) {
      filtered = filtered.filter((q) => q.origin === origin);
    }
    if (search) {
      const qLower = search.toLowerCase();
      filtered = filtered.filter(
        (q) =>
          q.statement.toLowerCase().includes(qLower) ||
          q.detailedExplanation.toLowerCase().includes(qLower) ||
          (q.referenceCitation && q.referenceCitation.toLowerCase().includes(qLower))
      );
    }

    const totalCount = filtered.length;
    const paginated = filtered.slice(skip, skip + limit);

    return NextResponse.json({
      success: true,
      totalCount,
      page,
      totalPages: Math.ceil(totalCount / limit),
      data: paginated,
      source: "fallback_bank",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch questions";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      subjectId,
      topicId,
      statement,
      type = "MCQ",
      difficulty = "MEDIUM",
      origin = "VERIFIED",
      status = "PENDING_REVIEW",
      options = [],
      detailedExplanation = "",
      keyPoints = [],
      referenceCitation = "",
      sourceName = "Academic Faculty Review",
      examYear = 2026,
      postTitle = "Lecturer CS (BS-17)",
      bookTitle = "",
    } = body;

    if (!statement || !subjectId) {
      return NextResponse.json(
        { success: false, error: "Question statement and subject ID are required" },
        { status: 400 }
      );
    }

    try {
      const question = await prisma.question.create({
        data: {
          subjectId,
          topicId: topicId || null,
          statement,
          type,
          difficulty,
          origin,
          status,
          options: {
            create: options.map(
              (opt: { optionKey: string; statement: string; isCorrect: boolean }) => ({
                optionKey: opt.optionKey,
                statement: opt.statement,
                isCorrect: Boolean(opt.isCorrect),
              })
            ),
          },
          answer: {
            create: {
              detailedExplanation,
              keyPoints: Array.isArray(keyPoints) ? keyPoints : [],
              referenceCitation: referenceCitation || null,
            },
          },
          sources: {
            create: {
              sourceName,
              examYear: Number(examYear) || null,
              postTitle: postTitle || null,
              bookTitle: bookTitle || null,
            },
          },
        },
        include: {
          options: true,
          answer: true,
          sources: true,
          subject: true,
          topic: true,
        },
      });

      return NextResponse.json({
        success: true,
        message: "Question added successfully",
        data: question,
      });
    } catch {
      // Mock session return
      return NextResponse.json({
        success: true,
        message: "Question created in mock session",
        data: {
          id: `created-q-${Date.now()}`,
          subjectId,
          topicId,
          statement,
          type,
          difficulty,
          origin,
          status,
          options,
          answer: { detailedExplanation, keyPoints, referenceCitation },
          sources: [{ sourceName, examYear, postTitle, bookTitle }],
        },
      });
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create question";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
