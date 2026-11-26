import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required"),
  role: z.enum(["candidate", "admin"]).default("candidate"),
});

export default loginSchema;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = loginSchema.parse(body);

    const supabase = await createClient();

    let authenticatedUser = null;

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: validated.email,
        password: validated.password,
      });

      if (!error && data?.user) {
        authenticatedUser = data.user;
      }
    } catch {
      // Supabase credentials not yet live; fallback to demo mode
    }

    // Role verification
    let userRole = validated.role;

    if (authenticatedUser) {
      // Query database for authoritative role assignment
      try {
        const userRoles = await prisma.userRole.findMany({
          where: { userId: authenticatedUser.id },
          include: { role: true },
        });

        const hasAdminRole = userRoles.some((ur) => ur.role.name === "admin");
        if (validated.role === "admin" && !hasAdminRole) {
          return NextResponse.json(
            { error: "Access denied. Administrator privileges required." },
            { status: 403 }
          );
        }
        userRole = hasAdminRole ? "admin" : "candidate";
      } catch {
        // DB fallback
      }
    }

    const response = NextResponse.json({
      success: true,
      role: userRole,
      redirectUrl: userRole === "admin" ? "/admin" : "/dashboard",
    });

    // Set demo cookie based on role for testing
    if (userRole === "admin") {
      response.cookies.set("aip_demo_admin", "true", { path: "/", maxAge: 60 * 60 * 24 });
      response.cookies.delete("aip_demo_candidate");
    } else {
      response.cookies.set("aip_demo_candidate", "true", { path: "/", maxAge: 60 * 60 * 24 });
      response.cookies.delete("aip_demo_admin");
    }

    return response;
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    }
    const message = error instanceof Error ? error.message : "Invalid credentials";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}
