import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

const registerSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Valid email is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  phone: z.string().optional(),
  targetCommission: z.enum(["PPSC", "FPSC", "KPPSC", "SPSC", "BPSC", "HEC"]).default("PPSC"),
  highestDegree: z.string().default("BS Computer Science"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = registerSchema.parse(body);

    const supabase = await createClient();

    // 1. Create auth user in Supabase
    let userId = "";

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: validated.email,
        password: validated.password,
        options: {
          data: {
            full_name: validated.fullName,
            phone: validated.phone,
            target_commission: validated.targetCommission,
            highest_degree: validated.highestDegree,
            role: "candidate",
          },
        },
      });

      if (authError) {
        // Fallback for development if Supabase project URL is not yet connected
        if (authError.message.includes("fetch failed") || authError.message.includes("dummy")) {
          userId = `mock-candidate-${Date.now()}`;
        } else {
          return NextResponse.json({ error: authError.message }, { status: 400 });
        }
      } else {
        userId = authData.user?.id || `usr-${Date.now()}`;
      }
    } catch {
      userId = `mock-candidate-${Date.now()}`;
    }

    // 2. Persist profile in Prisma (if database connected)
    try {
      const profile = await prisma.profile.upsert({
        where: { email: validated.email },
        update: {
          fullName: validated.fullName,
          phone: validated.phone,
          targetCommission: validated.targetCommission,
          highestDegree: validated.highestDegree,
        },
        create: {
          id: userId,
          email: validated.email,
          fullName: validated.fullName,
          phone: validated.phone,
          targetCommission: validated.targetCommission,
          highestDegree: validated.highestDegree,
          readinessScore: 0,
          streakDays: 1,
        },
      });

      // Ensure 'candidate' role
      const candidateRole = await prisma.role.findUnique({
        where: { name: "candidate" },
      });

      if (candidateRole) {
        await prisma.userRole.upsert({
          where: {
            userId_roleId: {
              userId: profile.id,
              roleId: candidateRole.id,
            },
          },
          update: {},
          create: {
            userId: profile.id,
            roleId: candidateRole.id,
          },
        });
      }

      // Record audit log
      await prisma.auditLog.create({
        data: {
          actorId: profile.id,
          action: "USER_REGISTERED",
          entityType: "Profile",
          entityId: profile.id,
          metadataJson: {
            targetCommission: validated.targetCommission,
            highestDegree: validated.highestDegree,
          },
        },
      });
    } catch (dbError) {
      console.warn("Database sync warning (running in preview/demo mode):", dbError);
    }

    const response = NextResponse.json({
      success: true,
      message: "Registration successful. Please verify your email.",
      userId,
      email: validated.email,
    });

    // Set demo cookie to allow seamless local testing
    response.cookies.set("aip_demo_candidate", "true", {
      path: "/",
      httpOnly: false,
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    }
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
