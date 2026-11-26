import { NextRequest, NextResponse } from "next/server";
import { PaymentService } from "@/lib/payments/payment-service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderRef, gatewayTxnId, signature, rawPayload } = body;

    if (!orderRef) {
      return NextResponse.json(
        { success: false, error: "Missing order reference parameter" },
        { status: 400 }
      );
    }

    // STRICT SERVER-SIDE VERIFICATION & SUBSCRIPTION ACTIVATION
    const result = await PaymentService.verifyAndActivateSubscription({
      orderRef,
      gatewayTxnId,
      signature,
      rawPayload,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Payment verification API error:", error);
    return NextResponse.json(
      { success: false, error: "Payment verification failed" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const orderRef = searchParams.get("pp_TxnRefNo") || searchParams.get("orderRef") || "";
  const responseCode = searchParams.get("pp_ResponseCode") || searchParams.get("status") || "";

  if (orderRef) {
    const rawPayload: Record<string, unknown> = {};
    searchParams.forEach((val, key) => {
      rawPayload[key] = val;
    });

    await PaymentService.verifyAndActivateSubscription({
      orderRef,
      rawPayload,
    });
  }

  // Redirect back to dashboard
  return NextResponse.redirect(
    new URL(`/dashboard/subscription?status=${responseCode === "000" ? "success" : "check"}`, request.url)
  );
}
