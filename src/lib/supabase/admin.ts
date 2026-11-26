import { createClient } from "@supabase/supabase-js";

// Administrative service role client - NEVER EXPOSE TO CLIENT/BROWSER
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://dummy-project.supabase.co";
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey) {
    console.warn("SUPABASE_SERVICE_ROLE_KEY is not defined. Admin client operating with mock/anon fallback.");
  }

  return createClient(supabaseUrl, serviceRoleKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "dummy-key", {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
