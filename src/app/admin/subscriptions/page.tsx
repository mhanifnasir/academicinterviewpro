"use client";

import React, { useState, useEffect } from "react";
import {
  CreditCard,
  TrendingUp,
  Download,
  CheckCircle2,
  ShieldCheck,
  Edit,
  Save,
  RefreshCw,
  Sliders,
  DollarSign,
  Users,
  Activity,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";

interface AdminStats {
  activeSubscribers: number;
  monthlyRevenuePKR: number;
  arpuPKR: number;
  successRate: number;
  gatewayDistribution: Record<string, number>;
}

interface AdminTransactionItem {
  id: string;
  ref: string;
  name: string;
  email: string;
  gateway: string;
  amount: string;
  plan: string;
  status: string;
  date: string;
}

interface EditablePlan {
  code: string;
  name: string;
  priceMonthlyPKR: number;
  priceYearlyPKR: number;
  description: string;
  limits: {
    mcqPerDay: number;
    aiInterviewsPerMonth: number;
    voiceSessionsPerMonth: number;
    mockTestsPerMonth: number;
    codingSubmissionsPerDay: number;
    teachingDemosPerMonth: number;
  };
}

interface DbPlanApiItem {
  code: string;
  name: string;
  priceMonthlyPKR?: number;
  priceYearlyPKR?: number;
  pricePKR?: number;
  description?: string;
  limitsJson?: EditablePlan["limits"];
}

export default function AdminSubscriptionsPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [transactions, setTransactions] = useState<AdminTransactionItem[]>([]);
  const [plans, setPlans] = useState<EditablePlan[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit Plan Limits Modal
  const [selectedPlanForEdit, setSelectedPlanForEdit] = useState<EditablePlan | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadAdminData() {
      try {
        const [subRes, planRes] = await Promise.all([
          fetch("/api/admin/subscriptions"),
          fetch("/api/admin/plans"),
        ]);
        const subJson = await subRes.json();
        const planJson = await planRes.json();

        if (isMounted) {
          if (subJson.success) {
            setStats(subJson.stats);
            setTransactions(subJson.transactions);
          }
          if (planJson.success && Array.isArray(planJson.plans)) {
            setPlans(
              planJson.plans.map((p: DbPlanApiItem) => ({
                code: p.code,
                name: p.name,
                priceMonthlyPKR: p.priceMonthlyPKR || p.pricePKR || 0,
                priceYearlyPKR: p.priceYearlyPKR || (p.priceMonthlyPKR ? p.priceMonthlyPKR * 10 : 0),
                description: p.description || "",
                limits: p.limitsJson || {
                  mcqPerDay: 50,
                  aiInterviewsPerMonth: 5,
                  voiceSessionsPerMonth: 5,
                  mockTestsPerMonth: 2,
                  codingSubmissionsPerDay: 10,
                  teachingDemosPerMonth: 2,
                },
              }))
            );
          }
        }
      } catch {
        // Fallback
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadAdminData();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSavePlanLimits = async () => {
    if (!selectedPlanForEdit) return;

    try {
      const res = await fetch("/api/admin/plans", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedPlanForEdit),
      });

      const json = await res.json();
      if (json.success) {
        setSaveSuccess(true);
        setPlans((prev) =>
          prev.map((p) => (p.code === selectedPlanForEdit.code ? selectedPlanForEdit : p))
        );
        setTimeout(() => {
          setSaveSuccess(false);
          setIsEditing(false);
        }, 1200);
      }
    } catch {
      alert("Failed to save plan limits.");
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      <PageHeader
        title="Subscriptions & PKR Billing Telemetry"
        description="Monitor revenue collection via Pakistani payment channels and dynamically adjust plan limits"
        badge={
          <Badge variant="success">
            ₨ {(stats?.monthlyRevenuePKR || 3200000).toLocaleString()} MTD Revenue
          </Badge>
        }
      />

      {/* Financial Telemetry Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#101B36]">
          <span className="text-[11px] font-bold text-slate-500 uppercase">Paid Active Subscribers</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#101B36] dark:text-white">
              {stats?.activeSubscribers?.toLocaleString() || "1,280"}
            </span>
            <span className="text-xs font-bold text-emerald-600">+14% this month</span>
          </div>
          <span className="text-[11px] text-slate-400 block mt-1">94% Retention Rate</span>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#101B36]">
          <span className="text-[11px] font-bold text-slate-500 uppercase">Average Revenue Per User</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#315BEA]">
              ₨ {stats?.arpuPKR?.toLocaleString() || "2,510"}
            </span>
          </div>
          <span className="text-[11px] text-slate-400 block mt-1">Lecturer Pro Plan Dominant</span>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#101B36]">
          <span className="text-[11px] font-bold text-slate-500 uppercase">Gateway Settlement Rate</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#16A37B]">
              {stats?.successRate || 98.6}%
            </span>
          </div>
          <span className="text-[11px] text-slate-400 block mt-1">JazzCash & Easypaisa OTP</span>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#101B36]">
          <span className="text-[11px] font-bold text-slate-500 uppercase">Top Gateway Channel</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#101B36] dark:text-white">
              JazzCash
            </span>
            <span className="text-xs font-bold text-[#315BEA]">48% Share</span>
          </div>
          <span className="text-[11px] text-slate-400 block mt-1">Easypaisa (34%), Safepay (12%)</span>
        </div>
      </div>

      {/* Dynamic Plan & Usage Limits Management Panel */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#101B36] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-[#101B36] dark:text-white flex items-center gap-2">
              <Sliders className="h-4 w-4 text-[#315BEA]" /> Dynamic Plan & Usage Limits Controller
            </h3>
            <p className="text-xs text-slate-500">
              Update monthly and annual pricing in PKR and configure quotas without changing code
            </p>
          </div>
          <Badge variant="navy">Database-Driven</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
          {plans.map((p) => (
            <div
              key={p.code}
              className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-[#101B36] dark:text-white">{p.name}</h4>
                  <Badge variant="secondary">{p.code}</Badge>
                </div>

                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-xl font-black text-[#315BEA]">
                    ₨ {p.priceMonthlyPKR.toLocaleString()}
                  </span>
                  <span className="text-xs text-slate-400">/ mo</span>
                  <span className="text-xs text-slate-500 ml-auto">
                    ₨ {p.priceYearlyPKR.toLocaleString()} / yr
                  </span>
                </div>

                {/* Limits summary */}
                <div className="mt-3 pt-3 border-t border-slate-200/60 dark:border-slate-800 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">MCQs per day:</span>
                    <span className="font-bold">{p.limits?.mcqPerDay ?? 50}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">AI Vivas per month:</span>
                    <span className="font-bold">{p.limits?.aiInterviewsPerMonth ?? 5}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Voice Drills per month:</span>
                    <span className="font-bold">{p.limits?.voiceSessionsPerMonth ?? 5}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Code submissions per day:</span>
                    <span className="font-bold">{p.limits?.codingSubmissionsPerDay ?? 10}</span>
                  </div>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedPlanForEdit(JSON.parse(JSON.stringify(p)));
                  setIsEditing(true);
                }}
                className="w-full text-xs font-bold gap-1"
              >
                <Edit className="h-3.5 w-3.5" />
                <span>Edit Limits & Pricing</span>
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Pakistani Transaction Stream Table */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#101B36] space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#101B36] dark:text-white">
            Recent Pakistani Payment Transaction Stream
          </h3>
          <Badge variant="secondary">{transactions.length} Transactions</Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500">
                <th className="pb-3 font-bold">Transaction Reference</th>
                <th className="pb-3 font-bold">Aspirant Name</th>
                <th className="pb-3 font-bold">Gateway Rail</th>
                <th className="pb-3 font-bold">Amount</th>
                <th className="pb-3 font-bold">Plan</th>
                <th className="pb-3 font-bold">Timestamp</th>
                <th className="pb-3 font-bold text-right">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                  <td className="py-3 font-mono font-bold text-[#315BEA]">{tx.ref}</td>
                  <td className="py-3 font-bold">{tx.name}</td>
                  <td className="py-3 text-slate-500">{tx.gateway}</td>
                  <td className="py-3 font-black">{tx.amount}</td>
                  <td className="py-3">
                    <Badge variant="ppsc">{tx.plan}</Badge>
                  </td>
                  <td className="py-3 text-slate-400">{tx.date}</td>
                  <td className="py-3 text-right">
                    <Badge variant={tx.status === "SUCCESS" ? "success" : "destructive"}>
                      {tx.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Plan Limits Modal */}
      {selectedPlanForEdit && (
        <Modal
          isOpen={isEditing}
          onClose={() => setIsEditing(false)}
          title={`Edit ${selectedPlanForEdit.name} Limits & Pricing`}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                  Monthly Price (PKR):
                </label>
                <input
                  type="number"
                  value={selectedPlanForEdit.priceMonthlyPKR}
                  onChange={(e) =>
                    setSelectedPlanForEdit({
                      ...selectedPlanForEdit,
                      priceMonthlyPKR: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                  Yearly Price (PKR):
                </label>
                <input
                  type="number"
                  value={selectedPlanForEdit.priceYearlyPKR}
                  onChange={(e) =>
                    setSelectedPlanForEdit({
                      ...selectedPlanForEdit,
                      priceYearlyPKR: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200 block">
                Usage Limits Allocations:
              </span>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-500 block mb-0.5">MCQ Per Day</label>
                  <input
                    type="number"
                    value={selectedPlanForEdit.limits.mcqPerDay}
                    onChange={(e) =>
                      setSelectedPlanForEdit({
                        ...selectedPlanForEdit,
                        limits: { ...selectedPlanForEdit.limits, mcqPerDay: Number(e.target.value) },
                      })
                    }
                    className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-500 block mb-0.5">AI Vivas Per Month</label>
                  <input
                    type="number"
                    value={selectedPlanForEdit.limits.aiInterviewsPerMonth}
                    onChange={(e) =>
                      setSelectedPlanForEdit({
                        ...selectedPlanForEdit,
                        limits: {
                          ...selectedPlanForEdit.limits,
                          aiInterviewsPerMonth: Number(e.target.value),
                        },
                      })
                    }
                    className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-500 block mb-0.5">Voice Drills Per Month</label>
                  <input
                    type="number"
                    value={selectedPlanForEdit.limits.voiceSessionsPerMonth}
                    onChange={(e) =>
                      setSelectedPlanForEdit({
                        ...selectedPlanForEdit,
                        limits: {
                          ...selectedPlanForEdit.limits,
                          voiceSessionsPerMonth: Number(e.target.value),
                        },
                      })
                    }
                    className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-500 block mb-0.5">Mock Tests Per Month</label>
                  <input
                    type="number"
                    value={selectedPlanForEdit.limits.mockTestsPerMonth}
                    onChange={(e) =>
                      setSelectedPlanForEdit({
                        ...selectedPlanForEdit,
                        limits: {
                          ...selectedPlanForEdit.limits,
                          mockTestsPerMonth: Number(e.target.value),
                        },
                      })
                    }
                    className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-500 block mb-0.5">Code Submissions / Day</label>
                  <input
                    type="number"
                    value={selectedPlanForEdit.limits.codingSubmissionsPerDay}
                    onChange={(e) =>
                      setSelectedPlanForEdit({
                        ...selectedPlanForEdit,
                        limits: {
                          ...selectedPlanForEdit.limits,
                          codingSubmissionsPerDay: Number(e.target.value),
                        },
                      })
                    }
                    className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-500 block mb-0.5">Teaching Demos / Month</label>
                  <input
                    type="number"
                    value={selectedPlanForEdit.limits.teachingDemosPerMonth}
                    onChange={(e) =>
                      setSelectedPlanForEdit({
                        ...selectedPlanForEdit,
                        limits: {
                          ...selectedPlanForEdit.limits,
                          teachingDemosPerMonth: Number(e.target.value),
                        },
                      })
                    }
                    className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
              <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSavePlanLimits}
                className="bg-[#315BEA] hover:bg-[#2348C9] text-white text-xs font-bold gap-1"
              >
                {saveSuccess ? (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <>
                    <Save className="h-3.5 w-3.5" />
                    <span>Save Dynamic Limits</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
