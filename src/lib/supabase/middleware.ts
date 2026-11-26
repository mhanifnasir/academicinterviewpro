import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://dummy-project.supabase.co";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "dummy-anon-key";

  // Check demo cookie bypass if Supabase credentials are not live
  const demoCandidateCookie = request.cookies.get("aip_demo_candidate")?.value;
  const demoAdminCookie = request.cookies.get("aip_demo_admin")?.value;
  const isDemoCandidate = demoCandidateCookie === "true";
  const isDemoAdmin = demoAdminCookie === "true";

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  // IMPORTANT: Avoid using getSession() which isn't guaranteed to be authentic
  let user = null;
  let userRole = "candidate";

  try {
    const { data } = await supabase.auth.getUser();
    user = data.user;
    if (user?.app_metadata?.role) {
      userRole = user.app_metadata.role;
    } else if (user?.user_metadata?.role) {
      userRole = user.user_metadata.role;
    }
  } catch {
    // Supabase auth service not yet configured or connection error
  }

  const pathname = request.nextUrl.pathname;
  const isAuthenticated = !!user || isDemoCandidate || isDemoAdmin;
  const isAdmin = (user && userRole === "admin") || isDemoAdmin;

  // 1. Protect /dashboard routes (Candidate Portal)
  if (pathname.startsWith("/dashboard")) {
    if (!isAuthenticated) {
      const url = request.nextUrl.clone();
      url.pathname = "/auth/login";
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
  }

  // 2. Protect /admin routes (Admin Console)
  if (pathname.startsWith("/admin")) {
    if (!isAuthenticated) {
      const url = request.nextUrl.clone();
      url.pathname = "/auth/login";
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }

    if (!isAdmin) {
      // Authenticated candidate trying to access admin console
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
  }

  // 3. Redirect authenticated users away from /auth/* to their respective dashboards
  if (pathname === "/auth/login" || pathname === "/auth/register") {
    if (isAuthenticated) {
      const redirectTarget = request.nextUrl.searchParams.get("redirect");
      if (redirectTarget) {
        return NextResponse.redirect(new URL(redirectTarget, request.url));
      }
      const destination = isAdmin ? "/admin" : "/dashboard";
      return NextResponse.redirect(new URL(destination, request.url));
    }
  }

  return supabaseResponse;
}
