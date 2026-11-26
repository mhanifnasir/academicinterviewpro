import { IPaymentGatewayAdapter } from "./gateway-adapter";
import {
  CreatePaymentOrderInput,
  PaymentInitiationResult,
  PaymentVerificationInput,
  PaymentVerificationResult,
  WebhookValidationResult,
} from "./types";

export class MockGatewayAdapter implements IPaymentGatewayAdapter {
  gatewayId = "MOCK" as const;
  name = "AIP Pakistani Test Simulator";

  async initiatePayment(
    input: CreatePaymentOrderInput
  ): Promise<PaymentInitiationResult> {
    return {
      success: true,
      orderRef: input.orderRef,
      gateway: "MOCK",
      instructions: `Please enter simulated OTP '1234' on the confirmation modal or submit payment to complete subscription of Rs. ${input.amountPKR.toLocaleString()}.`,
      transactionId: `mock-txn-${Date.now()}`,
    };
  }

  async verifyPayment(
    input: PaymentVerificationInput
  ): Promise<PaymentVerificationResult> {
    // If client supplied 'fail' in orderRef or payload, simulate rejection
    const isForcedFail =
      input.orderRef.includes("FAIL") ||
      (input.rawPayload && input.rawPayload["forceFail"] === true);

    if (isForcedFail) {
      return {
        success: false,
        status: "FAILED",
        orderRef: input.orderRef,
        amountPaidPKR: 0,
        message: "Payment rejected: Insufficient funds or invalid mobile MPIN.",
      };
    }

    return {
      success: true,
      status: "SUCCESS",
      orderRef: input.orderRef,
      gatewayTxnId: input.gatewayTxnId || `MOCK-${Date.now()}`,
      amountPaidPKR: (input.rawPayload?.amountPKR as number) || 2499,
      message: "Server-side payment verification succeeded.",
      rawResponse: {
        verifiedAt: new Date().toISOString(),
        gateway: "MOCK",
        clearedBy: "AIP Automated Clearing House",
      },
    };
  }

  async processWebhook(
    payload: Record<string, unknown>,
    _headers: Record<string, string>
  ): Promise<WebhookValidationResult> {
    const orderRef = (payload.orderRef as string) || "UNKNOWN";
    const status = payload.status === "FAILED" ? "FAILED" : "SUCCESS";
    const amountPKR = typeof payload.amountPKR === "number" ? payload.amountPKR : 2499;

    return {
      isValid: true,
      eventType: "PAYMENT_NOTIFICATION",
      orderRef,
      gatewayTxnId: `MOCK-WH-${Date.now()}`,
      status,
      amountPKR,
    };
  }
}
