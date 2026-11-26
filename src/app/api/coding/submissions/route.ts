import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createServerClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    let userId: string | null = null;
    try {
      const supabase = await createServerClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) userId = user.id;
    } catch {
      // Continue without user
    }

    let submissions: unknown[] = [];
    try {
      submissions = await prisma.codeSubmission.findMany({
        where: userId ? { userId } : {},
        orderBy: { createdAt: "desc" },
        take: 30,
        include: {
          problem: {
            select: {
              slug: true,
              title: true,
              difficulty: true,
            },
          },
        },
      });
    } catch {
      // Continue with empty list if DB unavailable
    }

    return NextResponse.json({
      success: true,
      submissions,
    });
  } catch (error) {
    console.error("Fetch code submissions error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch submission history" },
      { status: 500 }
    );
  }
}
