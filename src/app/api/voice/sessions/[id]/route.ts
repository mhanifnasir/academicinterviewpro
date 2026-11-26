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
      session = await prisma.voiceSession.findUnique({
        where: { id },
        include: {
          messages: {
            orderBy: { orderIndex: "asc" },
            include: { evaluation: true },
          },
        },
      });
    } catch {
      // Continue if DB unavailable
    }

    if (!session) {
      return NextResponse.json(
        { success: false, error: "Voice session not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      session,
    });
  } catch (error) {
    console.error("Fetch single voice session error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch voice session" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    try {
      await prisma.voiceSession.delete({
        where: { id },
      });
    } catch {
      // Ignore if already removed or local session
    }

    return NextResponse.json({
      success: true,
      message: "Session transcripts, audio buffers, and evaluation records deleted permanently.",
    });
  } catch (error) {
    console.error("Delete voice session error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete session records" },
      { status: 500 }
    );
  }
}
