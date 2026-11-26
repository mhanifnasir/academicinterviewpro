import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    let session = null;
    try {
      session = await prisma.interviewSession.findUnique({
        where: { id },
        include: {
          questions: {
            orderBy: { orderIndex: "asc" },
            include: {
              responses: {
                include: {
                  evaluation: true,
                },
              },
            },
          },
        },
      });
    } catch {
      // Return null if DB unavailable
    }

    if (!session) {
      return NextResponse.json(
        { success: false, error: "Interview session not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      session,
    });
  } catch (error) {
    console.error("Fetch single interview session error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch interview session" },
      { status: 500 }
    );
  }
}
