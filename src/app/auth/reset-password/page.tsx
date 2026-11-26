"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GraduationCap, Lock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/shared/theme-toggle";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
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
          {!success ? (
            <>
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-[#101B36] dark:text-white">
                  Create New Password
                </h1>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Ensure your new password meets university-grade security standards.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <Input
                      type="password"
                      required
                      placeholder="At least 8 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <Input
                      type="password"
                      required
                      placeholder="Repeat new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>

                {/* Requirements list */}
                <div className="rounded-lg bg-slate-50 p-3 text-xs text-slate-500 dark:bg-slate-900/40 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className={newPassword.length >= 8 ? "text-[#16A37B]" : "text-slate-400"}>✓</span>
                    <span>Minimum 8 characters</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={/[A-Z]/.test(newPassword) ? "text-[#16A37B]" : "text-slate-400"}>✓</span>
                    <span>At least 1 uppercase letter</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={/[0-9]/.test(newPassword) ? "text-[#16A37B]" : "text-slate-400"}>✓</span>
                    <span>At least 1 numerical digit</span>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-[#315BEA] hover:bg-[#2348C9] text-white font-bold text-sm shadow-md shadow-blue-500/20"
                >
                  {loading ? "Updating..." : "Update Password & Sign In"}
                </Button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-[#16A37B] dark:bg-emerald-950/60 mb-4">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <h2 className="text-xl font-bold text-[#101B36] dark:text-white">
                Password Successfully Reset
              </h2>
              <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Your credentials have been securely updated. You can now access your dashboard.
              </p>
              <div className="mt-6">
                <Link href="/auth/login">
                  <Button className="w-full bg-[#315BEA]">
                    Proceed to Login
                  </Button>
                </Link>
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
