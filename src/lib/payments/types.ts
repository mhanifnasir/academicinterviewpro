export type PaymentGateway =
  | "JAZZCASH"
  | "EASYPAISA"
  | "SAFEPAY"
  | "PAYFAST"
  | "STRIPE"
  | "MOCK";

export type PaymentStatus =
  | "PENDING"
  | "SUCCESS"
  | "FAILED"
  | "CANCELLED"
  | "REFUNDED";

export interface CreatePaymentOrderInput {
  userId: string;
  planCode: string;
  billingCycle: "MONTHLY" | "YEARLY";
  gateway: PaymentGateway;
  amountPKR: number;
  orderRef: string;
  customerName?: string;
  customerEmail: string;
  customerPhone?: string;
  callbackUrl?: string;
}

export interface PaymentInitiationResult {
  success: boolean;
  orderRef: string;
  gateway: PaymentGateway;
  checkoutUrl?: string;
  redirectPostData?: Record<string, string>;
  instructions?: string;
  transactionId?: string;
  error?: string;
}

export interface PaymentVerificationInput {
  orderRef: string;
  gatewayTxnId?: string;
  signature?: string;
  rawPayload?: Record<string, unknown>;
}

export interface PaymentVerificationResult {
  success: boolean;
  status: PaymentStatus;
  orderRef: string;
  gatewayTxnId?: string;
  amountPaidPKR: number;
  message: string;
  rawResponse?: Record<string, unknown>;
}

export interface WebhookValidationResult {
  isValid: boolean;
  eventType: string;
  orderRef: string;
  gatewayTxnId?: string;
  status: PaymentStatus;
  amountPKR?: number;
  errorMessage?: string;
}
