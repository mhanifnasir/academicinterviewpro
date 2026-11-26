import crypto from "crypto";
import { IPaymentGatewayAdapter } from "./gateway-adapter";
import {
  CreatePaymentOrderInput,
  PaymentInitiationResult,
  PaymentVerificationInput,
  PaymentVerificationResult,
  WebhookValidationResult,
} from "./types";

/**
 * JazzCash Merchant API Integration Adapter
 * Supports HTTP POST redirection with HMAC-SHA256 signature calculated from:
 * pp_MerchantID, pp_Password, pp_Amount, pp_TxnRefNo, pp_Version, Integrity Salt
 */
export class JazzCashAdapter implements IPaymentGatewayAdapter {
  gatewayId = "JAZZCASH" as const;
  name = "JazzCash Mobile Account & Voucher";

  private merchantId: string;
  private password: string;
  private integritySalt: string;
  private apiUrl: string;

  constructor() {
    this.merchantId = process.env.JAZZCASH_MERCHANT_ID || "TEST_MERCHANT_ID";
    this.password = process.env.JAZZCASH_PASSWORD || "TEST_PASSWORD";
    this.integritySalt = process.env.JAZZCASH_INTEGRITY_SALT || "TEST_SALT_KEY";
    this.apiUrl =
      process.env.JAZZCASH_API_URL ||
      "https://sandbox.jazzcash.com.pk/CustomerPortal/transactionmanagement/merchantform/";
  }

  private calculateHash(fields: Record<string, string>): string {
    // Sort keys alphabetically as required by JazzCash spec
    const sortedKeys = Object.keys(fields).sort();
    let sortedString = this.integritySalt;
    for (const key of sortedKeys) {
      if (fields[key] !== undefined && fields[key] !== null && fields[key] !== "") {
        sortedString += `&${fields[key]}`;
      }
    }
    return crypto
      .createHmac("sha256", this.integritySalt)
      .update(sortedString)
      .digest("hex")
      .toUpperCase();
  }

  async initiatePayment(
    input: CreatePaymentOrderInput
  ): Promise<PaymentInitiationResult> {
    const amountInPaisa = String(input.amountPKR * 100);
    const txnDateTime = new Date()
      .toISOString()
      .replace(/[-:T.]/g, "")
      .slice(0, 14);

    const postData: Record<string, string> = {
      pp_Version: "1.1",
      pp_TxnType: "MWALLET",
      pp_Language: "EN",
      pp_MerchantID: this.merchantId,
      pp_SubMerchantID: "",
      pp_Password: this.password,
      pp_BankID: "TBANK",
      pp_ProductID: "RETAIL",
      pp_TxnRefNo: input.orderRef,
      pp_Amount: amountInPaisa,
      pp_TxnCurrency: "PKR",
      pp_TxnDateTime: txnDateTime,
      pp_BillReference: input.orderRef.slice(0, 20),
      pp_Description: `AcademicInterviewPro ${input.planCode} ${input.billingCycle}`,
      pp_TxnExpiryDateTime: "",
      pp_ReturnURL:
        input.callbackUrl ||
        `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/subscriptions/verify?gateway=JAZZCASH`,
      pp_SecureHash: "",
      ppmpf_1: input.userId,
      ppmpf_2: input.customerPhone || "",
    };

    // Calculate Secure Hash
    postData.pp_SecureHash = this.calculateHash(postData);

    return {
      success: true,
      orderRef: input.orderRef,
      gateway: "JAZZCASH",
      checkoutUrl: this.apiUrl,
      redirectPostData: postData,
      instructions: "Redirecting to JazzCash 3D-Secure Mobile Account checkout...",
    };
  }

  async verifyPayment(
    input: PaymentVerificationInput
  ): Promise<PaymentVerificationResult> {
    const payload = (input.rawPayload as Record<string, string>) || {};
    const responseCode = payload.pp_ResponseCode || "";
    const receivedHash = payload.pp_SecureHash || "";

    // In local development or if testing keys are used:
    if (this.merchantId === "TEST_MERCHANT_ID") {
      const isOk = responseCode === "000" || payload.status === "SUCCESS";
      return {
        success: isOk,
        status: isOk ? "SUCCESS" : "FAILED",
        orderRef: input.orderRef,
        gatewayTxnId: payload.pp_TxnRefNo || input.gatewayTxnId || `JC-${Date.now()}`,
        amountPaidPKR: Number(payload.pp_Amount) ? Number(payload.pp_Amount) / 100 : 2499,
        message: isOk ? "JazzCash payment validated successfully" : "JazzCash transaction declined",
        rawResponse: payload,
      };
    }

    // Production HMAC Check
    const verificationFields: Record<string, string> = { ...payload };
    delete verificationFields.pp_SecureHash;
    const computedHash = this.calculateHash(verificationFields);

    if (receivedHash.toUpperCase() !== computedHash.toUpperCase()) {
      return {
        success: false,
        status: "FAILED",
        orderRef: input.orderRef,
        amountPaidPKR: 0,
        message: "Security signature mismatch on JazzCash callback.",
      };
    }

    const isSuccess = responseCode === "000";
    return {
      success: isSuccess,
      status: isSuccess ? "SUCCESS" : "FAILED",
      orderRef: input.orderRef,
      gatewayTxnId: payload.pp_RetreivalReferenceNo || payload.pp_TxnRefNo,
      amountPaidPKR: Number(payload.pp_Amount) / 100,
      message: isSuccess ? "JazzCash payment cleared." : `Failed with code ${responseCode}`,
      rawResponse: payload,
    };
  }

  async processWebhook(
    payload: Record<string, unknown>,
    _headers: Record<string, string>
  ): Promise<WebhookValidationResult> {
    const stringFields: Record<string, string> = {};
    for (const [k, v] of Object.entries(payload)) {
      stringFields[k] = String(v ?? "");
    }
    const orderRef = stringFields.pp_TxnRefNo || stringFields.pp_BillReference || "UNKNOWN";
    const responseCode = stringFields.pp_ResponseCode || "";
    const isSuccess = responseCode === "000";

    return {
      isValid: true,
      eventType: "JAZZCASH_IPN",
      orderRef,
      gatewayTxnId: stringFields.pp_RetreivalReferenceNo || stringFields.pp_TxnRefNo,
      status: isSuccess ? "SUCCESS" : "FAILED",
      amountPKR: Number(stringFields.pp_Amount) ? Number(stringFields.pp_Amount) / 100 : undefined,
    };
  }
}
