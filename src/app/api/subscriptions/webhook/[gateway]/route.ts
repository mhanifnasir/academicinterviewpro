import { NextRequest, NextResponse } from "next/server";
import { PaymentService } from "@/lib/payments/payment-service";
import { PaymentGateway } from "@/lib/payments/types";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ gateway: string }> }
) {
  try {
    const { gateway } = await params;
    const body = await request.json();

    const headers: Record<string, string> = {};
    request.headers.forEach((value, key) => {
      headers[key] = value;
    });

    const result = await PaymentService.processWebhookEvent(
      gateway.toUpperCase() as PaymentGateway,
      body,
      headers
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("Payment webhook error:", error);
    return NextResponse.json(
      { success: false, error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
