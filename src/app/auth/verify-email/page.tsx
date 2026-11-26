"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GraduationCap, CheckCircle2, RotateCcw, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/shared/theme-toggle";

export default function VerifyEmailPage() {
  const router = useRouter();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);

  const handleOtpChange = (val: string, index: number) => {
    if (val.length > 1) val = val.slice(0, 1);
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);

    // Auto-focus next input
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setVerified(true);
    }, 600);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#F2F5FA] dark:bg-[#0B1120] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-md flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#101B36] text-white dark:bg-[#315BEA]">
            <GraduationCap className="h-5 w-5" />
          </div>
          <span className="font-bold text-[#101B36] dark:text-white text-base">
            Academic Interview <span className="text-[#315BEA]">Pro</span>
          </span>
        </Link>
        <ThemeToggle />
      </div>

      <div className="mx-auto w-full max-w-md my-auto">
        <div className="rounded-2xl border border-slate-200/90 bg-white p-7 sm:p-9 shadow-xl dark:border-slate-800 dark:bg-[#101B36]">
          {!verified ? (
            <>
              <div className="text-center mb-6">
                <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-[11px] font-bold text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 mb-2">
                  Security Verification
                </span>
                <h1 className="text-2xl font-bold text-[#101B36] dark:text-white">
                  Verify Your Email
                </h1>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  We sent a 6-digit confirmation code to your email. Enter it below to unlock your dashboard.
                </p>
              </div>

              <form onSubmit={handleVerify} className="space-y-6">
                <div className="flex justify-center gap-2">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`otp-${idx}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(e.target.value, idx)}
                      className="h-12 w-11 rounded-lg border border-slate-300 text-center text-lg font-bold text-slate-900 focus:border-[#315BEA] focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                    />
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Didn&apos;t receive code?</span>
                  <button
                    type="button"
                    onClick={() => setOtp(["4", "8", "1", "9", "3", "0"])}
                    className="font-semibold text-[#315BEA] hover:underline dark:text-blue-400"
                  >
                    Resend Code (Demo Fill)
                  </button>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-[#315BEA] hover:bg-[#2348C9] text-white font-bold text-sm shadow-md shadow-blue-500/20"
                >
                  {loading ? "Verifying Token..." : "Verify & Launch Portal"}
                </Button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-[#16A37B] dark:bg-emerald-950/60 mb-4">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <h2 className="text-xl font-bold text-[#101B36] dark:text-white">
                Account Verified!
              </h2>
              <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Welcome to Academic Interview Pro. Your CS Lecturer preparation syllabus has been initialized according to PPSC / FPSC guidelines.
              </p>
              <div className="mt-6">
                <Button
                  onClick={() => router.push("/dashboard")}
                  className="w-full bg-[#16A37B] hover:bg-[#128262] text-white flex items-center justify-center gap-2"
                >
                  <span>Go to Candidate Dashboard</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto w-full max-w-md text-center text-[11px] text-slate-400 pt-6">
        <span>© 2026 Academic Interview Pro</span>
      </div>
    </div>
  );
}
