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
      session = await prisma.teachingDemoSession.findUnique({
        where: { id },
      });
    } catch {
      // Continue if DB unavailable
    }

    if (!session) {
      return NextResponse.json(
        { success: false, error: "Teaching demo session not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      session,
    });
  } catch (error) {
    console.error("Fetch single teaching demo session error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch teaching demo session" },
      { status: 500 }
    );
  }
}
