import React from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Pricing() {
  const plans = [
    {
      name: "Aspirant Free",
      tagline: "For basic self-assessment",
      pricePKR: "₨ 0",
      period: "forever",
      popular: false,
      features: [
        "20 MCQs practice daily",
        "1 AI Viva Voce simulation / month",
        "Syllabus breakdown for PPSC & FPSC",
        "Core formulas & cheat sheets",
        "Community study discussion forum",
      ],
      cta: "Get Started Free",
      href: "/auth/register",
      variant: "outline" as const,
    },
    {
      name: "Lecturer Pro",
      tagline: "Most popular for serious candidates",
      pricePKR: "₨ 2,499",
      period: "per month",
      popular: true,
      badge: "Most Popular",
      features: [
        "Unlimited topic-wise MCQ practice",
        "15 Full-length 100-mark mock examinations",
        "12 Virtual 3-Member Board Viva sessions",
        "Micro-teaching classroom evaluation",
        "English spoken fluency & filler detector",
        "Past papers (2015-2025) with detailed solutions",
        "Instant performance gap analytics",
      ],
      cta: "Upgrade to Lecturer Pro",
      href: "/dashboard/subscription",
      variant: "default" as const,
    },
    {
      name: "Commission Master",
      tagline: "Complete season-long intensive prep",
      pricePKR: "₨ 5,999",
      period: "per exam season (6 months)",
      popular: false,
      badge: "Best Value",
      features: [
        "Everything in Lecturer Pro included",
        "Unlimited 3-Member Board AI Viva simulations",
        "Negative marking calibration engine",
        "Thesis defense & viva cross-examination module",
        "High-yield CS Lecturer printed notes dispatch (PDF)",
        "Priority AI model access (zero queue latency)",
        "1-on-1 virtual mock interview with appointed lecturers",
      ],
      cta: "Enroll in Commission Master",
      href: "/dashboard/subscription",
      variant: "navy" as const,
    },
  ];

  return (
    <section id="pricing" className="py-20 sm:py-28 bg-[#F2F5FA] dark:bg-[#0B1120] transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-[#315BEA] dark:text-blue-400">
            Transparent Pricing In PKR
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-black text-[#101B36] dark:text-white">
            Invest in Your Academic Career
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300">
            A small fraction of a single month&apos;s BPS-17 salary. Pay securely with JazzCash, Easypaisa, debit/credit cards, or online bank transfer.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`relative rounded-2xl p-8 flex flex-col justify-between transition-all duration-300 ${
                plan.popular
                  ? "border-2 border-[#315BEA] bg-white shadow-2xl shadow-blue-500/10 dark:bg-[#101B36] scale-105 z-10"
                  : "border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-[#101B36]"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-[#315BEA] px-4 py-1 text-xs font-bold text-white shadow-sm uppercase tracking-wider">
                    {plan.badge}
                  </span>
                </div>
              )}

              <div>
                <h3 className="text-xl font-bold text-[#101B36] dark:text-white">
                  {plan.name}
                </h3>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {plan.tagline}
                </p>

                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-black text-[#101B36] dark:text-white">
                    {plan.pricePKR}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    / {plan.period}
                  </span>
                </div>

                <div className="mt-8 space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                    Included Features:
                  </span>
                  {plan.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                      <Check className="h-4 w-4 text-[#16A37B] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/80">
                <Link href={plan.href} className="w-full block">
                  <Button
                    variant={plan.variant}
                    className={`w-full py-2.5 font-bold ${
                      plan.popular
                        ? "bg-[#315BEA] hover:bg-[#2348C9] text-white shadow-md shadow-blue-500/25"
                        : ""
                    }`}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Pakistan Payment Logos */}
        <div className="mt-12 text-center">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
            Supported Pakistani Payment Methods
          </p>
          <div className="inline-flex flex-wrap items-center justify-center gap-4 sm:gap-8 bg-white px-6 py-3 rounded-xl border border-slate-200/80 dark:bg-[#101B36] dark:border-slate-800">
            <span className="text-xs font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/60 px-3 py-1 rounded-md">JazzCash</span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-md">Easypaisa</span>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-950/60 px-3 py-1 rounded-md">1BILL & Online Banking</span>
            <span className="text-xs font-bold text-purple-600 bg-purple-50 dark:bg-purple-950/60 px-3 py-1 rounded-md">Visa / Mastercard</span>
          </div>
        </div>
      </div>
    </section>
  );
}
