import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = forgotPasswordSchema.parse(body);

    const supabase = await createClient();

    try {
      await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/auth/reset-password`,
      });
    } catch {
      // Mock / preview mode
    }

    return NextResponse.json({
      success: true,
      message: "If an account exists with that email, reset instructions have been sent.",
    });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "Unable to process request" }, { status: 500 });
  }
}
