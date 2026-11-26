"use client";

import React, { useState } from "react";
import Link from "next/link";
import { GraduationCap, ArrowLeft, Mail, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/shared/theme-toggle";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
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
          {!sent ? (
            <>
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-[#101B36] dark:text-white">
                  Reset Password
                </h1>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Enter your registered email address to receive password reset instructions.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Registered Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <Input
                      type="email"
                      required
                      placeholder="candidate@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-[#315BEA] hover:bg-[#2348C9] text-white font-bold text-sm shadow-md shadow-blue-500/20"
                >
                  {loading ? "Sending Reset Link..." : "Send Reset Instructions"}
                </Button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-[#16A37B] dark:bg-emerald-950/60 mb-4">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <h2 className="text-xl font-bold text-[#101B36] dark:text-white">
                Check Your Email
              </h2>
              <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                We have sent password recovery instructions to <strong className="text-slate-900 dark:text-white">{email}</strong>.
              </p>
              <div className="mt-6">
                <Link href="/auth/reset-password">
                  <Button className="w-full bg-[#315BEA]">
                    Simulate Clicking Reset Link
                  </Button>
                </Link>
              </div>
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#315BEA] hover:underline dark:text-blue-400"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Sign In</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-md text-center text-[11px] text-slate-400 pt-6">
        <span>© 2026 Academic Interview Pro</span>
      </div>
    </div>
  );
}
