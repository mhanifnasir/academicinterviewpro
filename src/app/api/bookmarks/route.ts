import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    let userId = "00000000-0000-0000-0000-000000000001";
    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) userId = user.id;
    } catch {
      // Mock session
    }

    try {
      const bookmarks = await prisma.bookmark.findMany({
        where: { userId },
        include: {
          question: {
            include: {
              subject: true,
              topic: true,
              options: true,
              answer: true,
            },
          },
          studyMaterial: true,
        },
        orderBy: { createdAt: "desc" },
      });

      return NextResponse.json({ success: true, count: bookmarks.length, data: bookmarks });
    } catch {
      // Mock return
      return NextResponse.json({
        success: true,
        count: 0,
        data: [],
        message: "No bookmarks in mock session",
      });
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch bookmarks";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { questionId, studyMaterialId, notes = "" } = body;

    let userId = "00000000-0000-0000-0000-000000000001";
    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) userId = user.id;
    } catch {
      // Mock user
    }

    if (!questionId && !studyMaterialId) {
      return NextResponse.json(
        { success: false, error: "Must specify questionId or studyMaterialId" },
        { status: 400 }
      );
    }

    try {
      // Check if bookmark exists
      const existing = await prisma.bookmark.findFirst({
        where: {
          userId,
          ...(questionId ? { questionId } : { studyMaterialId }),
        },
      });

      if (existing) {
        // Toggle: remove if already exists
        await prisma.bookmark.delete({ where: { id: existing.id } });
        return NextResponse.json({
          success: true,
          action: "REMOVED",
          message: "Bookmark removed",
        });
      }

      // Create new bookmark
      const bookmark = await prisma.bookmark.create({
        data: {
          userId,
          questionId: questionId || null,
          studyMaterialId: studyMaterialId || null,
          notes,
        },
      });

      return NextResponse.json({
        success: true,
        action: "ADDED",
        message: "Question bookmarked successfully",
        data: bookmark,
      });
    } catch {
      return NextResponse.json({
        success: true,
        action: "ADDED",
        message: "Bookmark toggled (mock mode)",
        data: { userId, questionId, studyMaterialId, notes },
      });
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to toggle bookmark";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const questionId = searchParams.get("questionId");

    let userId = "00000000-0000-0000-0000-000000000001";
    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) userId = user.id;
    } catch {
      // Mock user
    }

    try {
      if (id) {
        await prisma.bookmark.delete({ where: { id } });
      } else if (questionId) {
        await prisma.bookmark.deleteMany({ where: { userId, questionId } });
      }

      return NextResponse.json({ success: true, message: "Bookmark removed" });
    } catch {
      return NextResponse.json({ success: true, message: "Bookmark removed (mock mode)" });
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete bookmark";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
