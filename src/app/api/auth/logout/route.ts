import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  const supabase = await createClient();

  try {
    await supabase.auth.signOut();
  } catch {
    // ignore
  }

  const response = NextResponse.json({ success: true, redirectUrl: "/auth/login" });
  response.cookies.delete("aip_demo_candidate");
  response.cookies.delete("aip_demo_admin");

  return response;
}
