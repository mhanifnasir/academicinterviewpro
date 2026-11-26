import {
  CreatePaymentOrderInput,
  PaymentInitiationResult,
  PaymentVerificationInput,
  PaymentVerificationResult,
  WebhookValidationResult,
  PaymentGateway,
} from "./types";

export interface IPaymentGatewayAdapter {
  gatewayId: PaymentGateway;
  name: string;

  /**
   * Initializes a payment intent/order with the Pakistani payment provider
   */
  initiatePayment(
    input: CreatePaymentOrderInput
  ): Promise<PaymentInitiationResult>;

  /**
   * Server-side payment verification (queries provider API or verifies signed receipt)
   */
  verifyPayment(
    input: PaymentVerificationInput
  ): Promise<PaymentVerificationResult>;

  /**
   * Validates and parses provider webhook incoming payload
   */
  processWebhook(
    payload: Record<string, unknown>,
    headers: Record<string, string>
  ): Promise<WebhookValidationResult>;
}
