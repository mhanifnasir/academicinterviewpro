import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { CandidateAnalyticsService } from "@/lib/analytics/candidate-analytics-service";

export async function GET(_request: NextRequest) {
  try {
    let userId = "candidate-demo";

    try {
      const supabase = await createServerClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user?.id) {
        userId = user.id;
      }
    } catch {
      // Local fallback
    }

    const analyticsData = await CandidateAnalyticsService.getDashboardAnalytics(userId);

    return NextResponse.json({
      success: true,
      analytics: analyticsData,
    });
  } catch (error) {
    console.error("Candidate analytics API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load candidate analytics" },
      { status: 500 }
    );
  }
}
