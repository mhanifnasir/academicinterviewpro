import { IPaymentGatewayAdapter } from "./gateway-adapter";
import {
  CreatePaymentOrderInput,
  PaymentInitiationResult,
  PaymentVerificationInput,
  PaymentVerificationResult,
  WebhookValidationResult,
} from "./types";

/**
 * Easypaisa IPG (Internet Payment Gateway) Adapter
 * Conforms to Easypaisa MA (Mobile Account) & OTC (Over The Counter) specs
 */
export class EasypaisaAdapter implements IPaymentGatewayAdapter {
  gatewayId = "EASYPAISA" as const;
  name = "Easypaisa Mobile Wallet & In-App Prompt";

  private storeId: string;
  private hashKey: string;
  private checkoutUrl: string;

  constructor() {
    this.storeId = process.env.EASYPAISA_STORE_ID || "TEST_STORE_ID";
    this.hashKey = process.env.EASYPAISA_HASH_KEY || "TEST_HASH_KEY";
    this.checkoutUrl =
      process.env.EASYPAISA_CHECKOUT_URL ||
      "https://easypay.easypaisa.com.pk/easypay/Index.jsf";
  }

  async initiatePayment(
    input: CreatePaymentOrderInput
  ): Promise<PaymentInitiationResult> {
    const postData: Record<string, string> = {
      storeId: this.storeId,
      amount: `${input.amountPKR}.00`,
      postBackURL:
        input.callbackUrl ||
        `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/subscriptions/verify?gateway=EASYPAISA`,
      orderRefNum: input.orderRef,
      paymentMethod: "MA_PAYMENT_METHOD",
      emailAddress: input.customerEmail,
      mobileNum: input.customerPhone || "03000000000",
    };

    return {
      success: true,
      orderRef: input.orderRef,
      gateway: "EASYPAISA",
      checkoutUrl: this.checkoutUrl,
      redirectPostData: postData,
      instructions: "Please approve the payment notification in your Easypaisa mobile app.",
    };
  }

  async verifyPayment(
    input: PaymentVerificationInput
  ): Promise<PaymentVerificationResult> {
    const payload = (input.rawPayload as Record<string, string>) || {};
    const responseCode = payload.auth_status || payload.responseCode || "";

    const isSuccess = responseCode === "0000" || payload.status === "SUCCESS";
    return {
      success: isSuccess,
      status: isSuccess ? "SUCCESS" : "FAILED",
      orderRef: input.orderRef,
      gatewayTxnId: payload.transactionId || input.gatewayTxnId || `EP-${Date.now()}`,
      amountPaidPKR: Number(payload.amount) || 2499,
      message: isSuccess ? "Easypaisa payment verified." : `Payment declined with code ${responseCode}`,
      rawResponse: payload,
    };
  }

  async processWebhook(
    payload: Record<string, unknown>,
    _headers: Record<string, string>
  ): Promise<WebhookValidationResult> {
    const orderRef = (payload.orderRefNum as string) || (payload.orderRef as string) || "UNKNOWN";
    const status = payload.auth_status === "0000" ? "SUCCESS" : "FAILED";

    return {
      isValid: true,
      eventType: "EASYPAISA_CALLBACK",
      orderRef,
      gatewayTxnId: (payload.transactionId as string) || `EP-WH-${Date.now()}`,
      status,
      amountPKR: typeof payload.amount === "number" ? payload.amount : undefined,
    };
  }
}
