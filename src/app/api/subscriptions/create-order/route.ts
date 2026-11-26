import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { PaymentService } from "@/lib/payments/payment-service";
import { PaymentGateway } from "@/lib/payments/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      planCode,
      billingCycle = "MONTHLY",
      gateway = "MOCK",
      customerPhone,
      customerEmail,
      customerName,
    } = body;

    if (!planCode) {
      return NextResponse.json(
        { success: false, error: "Plan code is required" },
        { status: 400 }
      );
    }

    let userId = "candidate-demo";
    let userEmail = customerEmail || "candidate@academicinterviewpro.pk";

    try {
      const supabase = await createServerClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user?.id) {
        userId = user.id;
        userEmail = user.email || userEmail;
      }
    } catch {
      // Local mode
    }

    const orderResult = await PaymentService.createOrder({
      userId,
      planCode,
      billingCycle,
      gateway: gateway as PaymentGateway,
      customerPhone,
      customerEmail: userEmail,
      customerName,
      callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard/subscription?verified=1`,
    });

    return NextResponse.json(orderResult);
  } catch (error) {
    console.error("Create payment order error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to initiate payment order" },
      { status: 500 }
    );
  }
}
