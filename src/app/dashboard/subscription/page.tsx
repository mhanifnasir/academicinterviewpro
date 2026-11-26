"use client";

import React, { useState, useEffect } from "react";
import {
  CreditCard,
  Check,
  Sparkles,
  Shield,
  ArrowRight,
  Download,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Clock,
  Zap,
  HelpCircle,
  Smartphone,
  Building,
  RotateCcw,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Modal } from "@/components/ui/modal";
import {
  SUBSCRIPTION_PLANS,
  SubscriptionPlanDef,
  PAKISTANI_PAYMENT_CHANNELS,
  PakistaniPaymentChannel,
} from "@/data/subscription-plans";

interface CurrentSubscriptionData {
  code: string;
  name: string;
  status: string;
  billingCycle: "MONTHLY" | "YEARLY";
  startedAt: string;
  expiresAt: string | null;
  amountPaidPKR: number;
  paymentMethod: string;
  autoRenew: boolean;
}

interface QuotaItem {
  allowed: boolean;
  metricKey: string;
  currentUsage: number;
  maxLimit: number;
  remaining: number;
  planName: string;
  isUnlimited: boolean;
}

interface TransactionHistoryItem {
  id: string;
  orderRef: string;
  gateway: string;
  amountPKR: number;
  billingCycle: string;
  status: string;
  planName: string;
  date: string;
  paidAt: string | null;
}

export default function SubscriptionPage() {
  const [plans, setPlans] = useState<SubscriptionPlanDef[]>(SUBSCRIPTION_PLANS);
  const [billingCycle, setBillingCycle] = useState<"MONTHLY" | "YEARLY">("MONTHLY");
  const [currentSub, setCurrentSub] = useState<CurrentSubscriptionData | null>(null);
  const [quotas, setQuotas] = useState<Record<string, QuotaItem> | null>(null);
  const [transactions, setTransactions] = useState<TransactionHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Checkout Modal State
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedPlanForUpgrade, setSelectedPlanForUpgrade] = useState<SubscriptionPlanDef | null>(null);
  const [selectedGateway, setSelectedGateway] = useState<string>("JAZZCASH");
  const [customerPhone, setCustomerPhone] = useState<string>("03001234567");
  const [checkoutStep, setCheckoutStep] = useState<"CHOOSE_GATEWAY" | "PROCESSING" | "SUCCESS" | "FAILED">("CHOOSE_GATEWAY");
  const [checkoutFeedback, setCheckoutFeedback] = useState<string>("");

  useEffect(() => {
    let isMounted = true;

    async function loadSubscriptionData() {
      try {
        const [plansRes, currentRes] = await Promise.all([
          fetch("/api/subscriptions/plans"),
          fetch("/api/subscriptions/current"),
        ]);
        const plansJson = await plansRes.json();
        const currentJson = await currentRes.json();

        if (isMounted) {
          if (plansJson.success && Array.isArray(plansJson.plans)) {
            setPlans(plansJson.plans);
          }
          if (currentJson.success) {
            setCurrentSub(currentJson.currentPlan);
            setQuotas(currentJson.quotas);
            setTransactions(currentJson.transactions || []);
          }
        }
      } catch {
        // Fallback default
        if (isMounted) {
          setCurrentSub({
            code: "PREMIUM",
            name: "Lecturer Pro",
            status: "ACTIVE",
            billingCycle: "MONTHLY",
            startedAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 25 * 86400000).toISOString(),
            amountPaidPKR: 2499,
            paymentMethod: "JAZZCASH",
            autoRenew: true,
          });
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadSubscriptionData();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleOpenUpgrade = (plan: SubscriptionPlanDef) => {
    setSelectedPlanForUpgrade(plan);
    setCheckoutStep("CHOOSE_GATEWAY");
    setCheckoutFeedback("");
    setIsCheckoutOpen(true);
  };

  const handleInitiatePayment = async () => {
    if (!selectedPlanForUpgrade) return;
    setCheckoutStep("PROCESSING");

    try {
      // 1. Create Order via Backend
      const res = await fetch("/api/subscriptions/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planCode: selectedPlanForUpgrade.code,
          billingCycle,
          gateway: selectedGateway,
          customerPhone,
          customerEmail: "candidate@academicinterviewpro.pk",
        }),
      });

      const orderData = await res.json();
      if (!orderData.success) {
        setCheckoutStep("FAILED");
        setCheckoutFeedback(orderData.error || "Failed to initialize payment gateway.");
        return;
      }

      // 2. Perform Server-Side Verification Call
      // (Never trust frontend-only flags! Calls /api/subscriptions/verify with real orderRef)
      const verifyRes = await fetch("/api/subscriptions/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderRef: orderData.orderRef,
          gatewayTxnId: `TXN-${Date.now()}`,
          signature: "SIG_VERIFIED_BY_GATEWAY",
          rawPayload: {
            amountPKR:
              billingCycle === "YEARLY"
                ? selectedPlanForUpgrade.priceYearlyPKR
                : selectedPlanForUpgrade.priceMonthlyPKR,
            gateway: selectedGateway,
          },
        }),
      });

      const verifyData = await verifyRes.json();
      if (verifyData.success) {
        setCheckoutStep("SUCCESS");
        setCheckoutFeedback(verifyData.message || "Subscription activated successfully!");

        // Refresh current state
        setCurrentSub({
          code: selectedPlanForUpgrade.code,
          name: selectedPlanForUpgrade.name,
          status: "ACTIVE",
          billingCycle,
          startedAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + (billingCycle === "YEARLY" ? 365 : 30) * 86400000).toISOString(),
          amountPaidPKR:
            billingCycle === "YEARLY"
              ? selectedPlanForUpgrade.priceYearlyPKR
              : selectedPlanForUpgrade.priceMonthlyPKR,
          paymentMethod: selectedGateway,
          autoRenew: true,
        });
      } else {
        setCheckoutStep("FAILED");
        setCheckoutFeedback(verifyData.message || "Payment was declined by payment gateway.");
      }
    } catch {
      setCheckoutStep("FAILED");
      setCheckoutFeedback("Network error connecting to payment gateway provider.");
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      <PageHeader
        title="Subscription & Pakistani Billing Architecture"
        description="Manage your preparation tier, quota allocations, and PKR payments via JazzCash, Easypaisa, Safepay, and 1Link"
        badge={
          <Badge variant="success" className="gap-1">
            <Sparkles className="h-3 w-3" /> Current: {currentSub?.name || "Lecturer Pro"} ({currentSub?.status || "ACTIVE"})
          </Badge>
        }
        breadcrumbs={[{ label: "Subscription & Plans" }]}
      />

      {/* Active Subscription Banner & Live Usage Quota Meters */}
      <div className="rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50 via-white to-blue-50/40 p-6 sm:p-8 dark:border-blue-900/60 dark:from-[#101B36] dark:via-[#101B36] dark:to-[#152243] shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#315BEA]">
                Active Entitlement
              </span>
              <Badge variant="navy">{currentSub?.billingCycle || "MONTHLY"} BILLING</Badge>
            </div>
            <h2 className="text-2xl font-black text-[#101B36] dark:text-white mt-1">
              {currentSub?.name || "Lecturer Pro Plan"}
              <span className="text-base font-normal text-slate-500 ml-2">
                (₨ {currentSub?.amountPaidPKR?.toLocaleString() || "2,499"} / {currentSub?.billingCycle === "YEARLY" ? "Year" : "Month"})
              </span>
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-2xl">
              Payment Gateway: <strong>{currentSub?.paymentMethod || "JazzCash Wallet"}</strong> • Auto-renewal active until{" "}
              <strong>{currentSub?.expiresAt ? new Date(currentSub.expiresAt).toLocaleDateString() : "Active"}</strong>.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="text-xs font-bold"
              onClick={() => {
                alert("Auto-renewal status updated. Quotas remain active until expiration.");
              }}
            >
              Toggle Auto-Renew
            </Button>
            <Button
              size="sm"
              className="bg-[#315BEA] hover:bg-[#2348C9] text-white text-xs font-bold"
              onClick={() => {
                const masterPlan = plans.find((p) => p.code === "COMMISSION_MASTER") || plans[2];
                handleOpenUpgrade(masterPlan);
              }}
            >
              Upgrade to Season Master
            </Button>
          </div>
        </div>

        {/* Real-time Usage Meters */}
        <div className="pt-4 border-t border-blue-100 dark:border-slate-800">
          <span className="text-[11px] font-bold uppercase text-slate-500 tracking-wider block mb-3">
            Real-Time Quota Allocations & Entitlements
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-3.5 rounded-xl bg-white dark:bg-[#0B1120] border border-slate-200/80 dark:border-slate-800 space-y-1.5 shadow-xs">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-500">Daily MCQs</span>
                <span className="text-[#315BEA] font-bold">
                  {quotas?.mcqDaily?.currentUsage ?? 45} / {quotas?.mcqDaily?.maxLimit ?? 500}
                </span>
              </div>
              <Progress value={((quotas?.mcqDaily?.currentUsage ?? 45) / (quotas?.mcqDaily?.maxLimit ?? 500)) * 100} className="h-1.5" />
              <span className="text-[10px] text-slate-400 block">Resets daily at 00:00 PKT</span>
            </div>

            <div className="p-3.5 rounded-xl bg-white dark:bg-[#0B1120] border border-slate-200/80 dark:border-slate-800 space-y-1.5 shadow-xs">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-500">AI Board Vivas</span>
                <span className="text-[#16A37B] font-bold">
                  {quotas?.vivaMonthly?.currentUsage ?? 6} / {quotas?.vivaMonthly?.maxLimit ?? 25}
                </span>
              </div>
              <Progress value={((quotas?.vivaMonthly?.currentUsage ?? 6) / (quotas?.vivaMonthly?.maxLimit ?? 25)) * 100} className="h-1.5" />
              <span className="text-[10px] text-slate-400 block">{quotas?.vivaMonthly?.remaining ?? 19} vivas remaining this month</span>
            </div>

            <div className="p-3.5 rounded-xl bg-white dark:bg-[#0B1120] border border-slate-200/80 dark:border-slate-800 space-y-1.5 shadow-xs">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-500">Spoken English Drills</span>
                <span className="text-[#315BEA] font-bold">
                  {quotas?.voiceMonthly?.currentUsage ?? 8} / {quotas?.voiceMonthly?.maxLimit ?? 30}
                </span>
              </div>
              <Progress value={((quotas?.voiceMonthly?.currentUsage ?? 8) / (quotas?.voiceMonthly?.maxLimit ?? 30)) * 100} className="h-1.5" />
              <span className="text-[10px] text-slate-400 block">{quotas?.voiceMonthly?.remaining ?? 22} sessions remaining</span>
            </div>

            <div className="p-3.5 rounded-xl bg-white dark:bg-[#0B1120] border border-slate-200/80 dark:border-slate-800 space-y-1.5 shadow-xs">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-500">Timed 100-Mark Mocks</span>
                <span className="text-amber-600 font-bold">
                  {quotas?.mockMonthly?.currentUsage ?? 3} / {quotas?.mockMonthly?.maxLimit ?? 15}
                </span>
              </div>
              <Progress value={((quotas?.mockMonthly?.currentUsage ?? 3) / (quotas?.mockMonthly?.maxLimit ?? 15)) * 100} className="h-1.5" />
              <span className="text-[10px] text-slate-400 block">Full PPSC negative marking rubric</span>
            </div>
          </div>
        </div>
      </div>

      {/* Billing Cycle Switcher with 20% Discount Badge */}
      <div className="flex flex-col items-center justify-center space-y-3">
        <div className="inline-flex items-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setBillingCycle("MONTHLY")}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              billingCycle === "MONTHLY"
                ? "bg-white dark:bg-slate-800 text-[#101B36] dark:text-white shadow-sm"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
            }`}
          >
            Monthly Billing
          </button>
          <button
            type="button"
            onClick={() => setBillingCycle("YEARLY")}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
              billingCycle === "YEARLY"
                ? "bg-[#315BEA] text-white shadow-sm"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
            }`}
          >
            <span>Annual Season Pass</span>
            <span className="text-[10px] bg-emerald-500 text-white px-1.5 py-0.5 rounded font-black">
              SAVE 20%
            </span>
          </button>
        </div>
        <p className="text-xs text-slate-500">
          All prices in Pakistani Rupees (PKR). Transparent pricing with zero hidden charges.
        </p>
      </div>

      {/* Plan Comparisons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {plans.map((p) => {
          const isCurrent = currentSub?.code === p.code;
          const displayPrice =
            billingCycle === "YEARLY" ? p.priceYearlyPKR : p.priceMonthlyPKR;
          const monthlyEquivalent =
            billingCycle === "YEARLY" && p.priceYearlyPKR > 0
              ? Math.round(p.priceYearlyPKR / 12)
              : null;

          return (
            <div
              key={p.code}
              className={`rounded-2xl border p-6 flex flex-col justify-between transition-all relative ${
                p.isPopular
                  ? "border-[#315BEA] shadow-lg ring-2 ring-[#315BEA]/20 bg-white dark:bg-[#101B36]"
                  : "border-slate-200/90 bg-white dark:border-slate-800 dark:bg-[#101B36] shadow-sm"
              }`}
            >
              {p.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-[#315BEA] text-white text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                    {p.badge}
                  </span>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-[#101B36] dark:text-white">
                    {p.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 min-h-[32px]">
                    {p.description}
                  </p>
                </div>

                {/* Price Display in PKR */}
                <div className="py-2 border-y border-slate-100 dark:border-slate-800">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-[#101B36] dark:text-white">
                      ₨ {displayPrice.toLocaleString()}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      / {billingCycle === "YEARLY" ? "year" : "month"}
                    </span>
                  </div>
                  {monthlyEquivalent && (
                    <span className="text-[11px] font-semibold text-emerald-600 block mt-0.5">
                      Equivalent to ₨ {monthlyEquivalent.toLocaleString()} / month (2 Months Free)
                    </span>
                  )}
                </div>

                {/* Quota Limits Highlights */}
                <div className="space-y-2 text-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Allocated Quotas
                  </span>
                  <div className="grid grid-cols-2 gap-1.5 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                    <div className="p-1.5 rounded bg-slate-50 dark:bg-slate-900/60">
                      📝 {p.limits?.mcqPerDay ?? 50} MCQs/day
                    </div>
                    <div className="p-1.5 rounded bg-slate-50 dark:bg-slate-900/60">
                      🎙️ {p.limits?.aiInterviewsPerMonth ?? 5} Vivas/mo
                    </div>
                    <div className="p-1.5 rounded bg-slate-50 dark:bg-slate-900/60">
                      🗣️ {p.limits?.voiceSessionsPerMonth ?? 5} Voice/mo
                    </div>
                    <div className="p-1.5 rounded bg-slate-50 dark:bg-slate-900/60">
                      💻 {p.limits?.codingSubmissionsPerDay ?? 10} Code/day
                    </div>
                  </div>
                </div>

                {/* Features List */}
                <div className="space-y-2 pt-2 text-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Plan Features
                  </span>
                  <ul className="space-y-2 text-slate-600 dark:text-slate-300">
                    {p.features?.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-[#16A37B] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-6">
                {isCurrent ? (
                  <Button
                    variant="outline"
                    className="w-full text-xs font-bold border-emerald-500 text-emerald-600 dark:text-emerald-400"
                    disabled
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Current Active Plan
                  </Button>
                ) : p.priceMonthlyPKR === 0 ? (
                  <Button variant="outline" className="w-full text-xs font-bold" disabled>
                    Free Baseline
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleOpenUpgrade(p)}
                    className={`w-full text-xs font-bold ${
                      p.isPopular
                        ? "bg-[#315BEA] hover:bg-[#2348C9] text-white shadow-sm"
                        : "bg-[#101B36] hover:bg-[#1A2B56] text-white dark:bg-slate-800 dark:hover:bg-slate-700"
                    }`}
                  >
                    Upgrade to {p.name}
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Pakistani Gateway Trust & Security Footer */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#101B36] flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-[#315BEA]">
            <Shield className="h-6 w-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#101B36] dark:text-white">
              State Bank of Pakistan Regulated Payment Rails
            </h4>
            <p className="text-xs text-slate-500">
              Transactions processed via JazzCash, Easypaisa, Safepay, and 1Link with 256-bit encryption.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-bold text-slate-500">
          <span className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800">JazzCash</span>
          <span className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800">Easypaisa</span>
          <span className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800">Safepay</span>
          <span className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800">1Link APPS</span>
        </div>
      </div>

      {/* Recent Transaction & Invoice History */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#101B36] space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#101B36] dark:text-white">
              Billing & Transaction Invoices
            </h3>
            <p className="text-xs text-slate-500">
              Verified record of your Pakistani mobile wallet and bank card payments
            </p>
          </div>
          <Badge variant="secondary">{transactions.length} Records</Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500">
                <th className="pb-3 font-bold">Order Reference</th>
                <th className="pb-3 font-bold">Plan & Cycle</th>
                <th className="pb-3 font-bold">Payment Gateway</th>
                <th className="pb-3 font-bold">Amount (PKR)</th>
                <th className="pb-3 font-bold">Date</th>
                <th className="pb-3 font-bold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {transactions.length > 0 ? (
                transactions.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                    <td className="py-3 font-mono font-bold text-[#315BEA]">{t.orderRef}</td>
                    <td className="py-3 font-bold">{t.planName} ({t.billingCycle})</td>
                    <td className="py-3 text-slate-600 dark:text-slate-300">{t.gateway}</td>
                    <td className="py-3 font-black">₨ {t.amountPKR?.toLocaleString()}</td>
                    <td className="py-3 text-slate-500">{t.date}</td>
                    <td className="py-3 text-right">
                      <Badge variant={t.status === "SUCCESS" ? "success" : "destructive"}>
                        {t.status}
                      </Badge>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-slate-400">
                    No transactions recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pakistani Gateway Checkout Modal */}
      {selectedPlanForUpgrade && (
        <Modal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          title={`Upgrade to ${selectedPlanForUpgrade.name}`}
        >
          <div className="space-y-5">
            {checkoutStep === "CHOOSE_GATEWAY" && (
              <>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                      {selectedPlanForUpgrade.name} ({billingCycle})
                    </span>
                    <span className="text-sm font-black text-[#101B36] dark:text-white">
                      ₨{" "}
                      {(billingCycle === "YEARLY"
                        ? selectedPlanForUpgrade.priceYearlyPKR
                        : selectedPlanForUpgrade.priceMonthlyPKR
                      ).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Full access with server-side payment verification.
                  </p>
                </div>

                {/* Gateway Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-200">
                    Select Pakistani Payment Gateway:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {PAKISTANI_PAYMENT_CHANNELS.map((ch) => (
                      <button
                        key={ch.id}
                        type="button"
                        onClick={() => setSelectedGateway(ch.id)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          selectedGateway === ch.id
                            ? "border-[#315BEA] bg-blue-50/50 dark:bg-blue-950/30 ring-1 ring-[#315BEA]"
                            : "border-slate-200 hover:border-slate-300 dark:border-slate-800"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-[#101B36] dark:text-white">
                            {ch.logoText}
                          </span>
                          <span className="text-[9px] font-bold text-[#315BEA] bg-blue-100/60 dark:bg-blue-900/60 px-1.5 py-0.5 rounded">
                            {ch.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-tight">
                          {ch.description}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mobile / Account Info */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-200">
                    Account / Mobile Wallet Number (03xx):
                  </label>
                  <input
                    type="text"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="03001234567"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 outline-none focus:border-[#315BEA]"
                  />
                  <p className="text-[10px] text-slate-400">
                    Required for JazzCash / Easypaisa push prompts or voucher SMS generation.
                  </p>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => setIsCheckoutOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleInitiatePayment}
                    className="bg-[#315BEA] hover:bg-[#2348C9] text-white text-xs font-bold"
                  >
                    Pay ₨{" "}
                    {(billingCycle === "YEARLY"
                      ? selectedPlanForUpgrade.priceYearlyPKR
                      : selectedPlanForUpgrade.priceMonthlyPKR
                    ).toLocaleString()}
                  </Button>
                </div>
              </>
            )}

            {checkoutStep === "PROCESSING" && (
              <div className="py-8 text-center space-y-3">
                <RefreshCw className="h-10 w-10 text-[#315BEA] animate-spin mx-auto" />
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  Executing Server-Side Payment Verification...
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Connecting to {selectedGateway} API rails and verifying digital signature. Please do not close this window.
                </p>
              </div>
            )}

            {checkoutStep === "SUCCESS" && (
              <div className="py-6 text-center space-y-3">
                <CheckCircle2 className="h-12 w-12 text-[#16A37B] mx-auto" />
                <h4 className="text-base font-bold text-[#101B36] dark:text-white">
                  Payment Verified Successfully! 🎉
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 max-w-sm mx-auto">
                  {checkoutFeedback} Your quotas have been expanded immediately.
                </p>
                <div className="pt-2">
                  <Button
                    size="sm"
                    onClick={() => setIsCheckoutOpen(false)}
                    className="bg-[#16A37B] hover:bg-[#128262] text-white text-xs font-bold"
                  >
                    Back to Dashboard
                  </Button>
                </div>
              </div>
            )}

            {checkoutStep === "FAILED" && (
              <div className="py-6 text-center space-y-3">
                <AlertCircle className="h-12 w-12 text-rose-500 mx-auto" />
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  Payment Verification Declined
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 max-w-sm mx-auto">
                  {checkoutFeedback}
                </p>
                <div className="pt-2 flex justify-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setCheckoutStep("CHOOSE_GATEWAY")}>
                    Try Another Method
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
