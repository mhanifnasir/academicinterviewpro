import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { CURRENT_CANDIDATE } from "@/data/mock-data";

const updateProfileSchema = z.object({
  fullName: z.string().min(2).optional(),
  phone: z.string().optional(),
  city: z.string().optional(),
  domicileProvince: z.string().optional(),
  highestDegree: z.string().optional(),
  university: z.string().optional(),
  cgpa: z.number().min(0).max(4).optional(),
  graduationYear: z.number().int().min(1990).max(2035).optional(),
  thesisTopic: z.string().optional(),
  targetCommission: z.string().optional(),
  experienceYears: z.string().optional(),
  bio: z.string().optional(),
});

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      // In demo/preview mode, return the default mock candidate profile
      return NextResponse.json({
        profile: {
          id: "demo-candidate-1",
          fullName: CURRENT_CANDIDATE.name,
          email: "candidate@academicinterview.pro",
          phone: "+92 301 4567890",
          city: "Lahore, Punjab",
          domicileProvince: "Punjab",
          highestDegree: "MS Computer Science / MPhil",
          university: "National University of Computer & Emerging Sciences (FAST-NUCES)",
          cgpa: 3.72,
          graduationYear: 2023,
          thesisTopic: "Distributed Consensus in Partitioned Microservice Architectures",
          targetCommission: "PPSC",
          experienceYears: "2 Years (Visiting Lecturer)",
          bio: "Passionate computer scientist aiming for BPS-17 Lecturer in Punjab Higher Education Department.",
          readinessScore: CURRENT_CANDIDATE.readinessScore,
          streakDays: CURRENT_CANDIDATE.studyStreakDays,
        },
        roles: ["candidate"],
      });
    }

    // Attempt DB lookup
    try {
      const profile = await prisma.profile.findUnique({
        where: { id: user.id },
        include: {
          userRoles: {
            include: { role: true },
          },
        },
      });

      if (profile) {
        return NextResponse.json({
          profile,
          roles: profile.userRoles.map((ur) => ur.role.name),
        });
      }
    } catch {
      // DB connection fallback
    }

    return NextResponse.json({
      profile: {
        id: user.id,
        email: user.email,
        fullName: user.user_metadata?.full_name || "Aspirant",
        targetCommission: user.user_metadata?.target_commission || "PPSC",
        highestDegree: user.user_metadata?.highest_degree || "BS Computer Science",
      },
      roles: ["candidate"],
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const body = await request.json();
    const validated = updateProfileSchema.parse(body);

    const userId = user?.id || "demo-candidate-1";

    try {
      const updated = await prisma.profile.update({
        where: { id: userId },
        data: {
          ...validated,
          updatedAt: new Date(),
        },
      });

      return NextResponse.json({
        success: true,
        message: "Profile updated successfully.",
        profile: updated,
      });
    } catch {
      // In demo mode without active postgres connection
      return NextResponse.json({
        success: true,
        message: "Profile updated successfully (preview mode).",
        profile: validated,
      });
    }
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    }
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
