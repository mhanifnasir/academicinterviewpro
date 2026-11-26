"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GraduationCap, ArrowRight, ShieldCheck, Mail, Lock, Phone, User, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { useAuth } from "@/lib/auth/auth-context";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    targetCommission: "PPSC",
    highestDegree: "MS Computer Science / MPhil",
    password: "",
    confirmPassword: "",
    agreeTerms: true,
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }
    setLoading(true);
    setErrorMessage(null);

    const result = await register(formData);
    setLoading(false);

    if (result.success) {
      router.push("/auth/verify-email");
    } else {
      setErrorMessage(result.error || "Registration could not be completed.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#F2F5FA] dark:bg-[#0B1120] px-4 py-8 sm:px-6 lg:px-8">
      {/* Top Header */}
      <div className="mx-auto w-full max-w-xl flex items-center justify-between">
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

      {/* Main Registration Card */}
      <div className="mx-auto w-full max-w-xl my-6">
        <div className="rounded-2xl border border-slate-200/90 bg-white p-7 sm:p-9 shadow-xl dark:border-slate-800 dark:bg-[#101B36]">
          <div className="text-center mb-6">
            <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 mb-2">
              BPS-17 Lecturer Aspirant Registration
            </span>
            <h1 className="text-2xl font-bold text-[#101B36] dark:text-white">
              Create Your Candidate Account
            </h1>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Join thousands of Pakistani Computer Science graduates preparing for commission tests
            </p>
          </div>

          {errorMessage && (
            <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800 dark:bg-rose-950/40 dark:border-rose-900 dark:text-rose-300 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Full Name (As on CNIC / Matric)
              </label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  required
                  placeholder="e.g. Engr. Muhammad Hamza"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="pl-9"
                />
              </div>
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    type="email"
                    required
                    placeholder="candidate@gmail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pl-9"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Mobile Number (WhatsApp)
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    type="tel"
                    required
                    placeholder="+92 300 1234567"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="pl-9"
                  />
                </div>
              </div>
            </div>

            {/* Target Commission & Degree */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Target Public Commission
                </label>
                <Select
                  value={formData.targetCommission}
                  onChange={(e) => setFormData({ ...formData, targetCommission: e.target.value })}
                >
                  <option value="PPSC">Punjab (PPSC CS Lecturer)</option>
                  <option value="FPSC">Federal (FPSC CS Lecturer F.4)</option>
                  <option value="KPPSC">Khyber Pakhtunkhwa (KPPSC)</option>
                  <option value="SPSC">Sindh (SPSC CS Lecturer)</option>
                  <option value="BPSC">Balochistan (BPSC CS)</option>
                  <option value="HEC">HEC / University Selection Board</option>
                </Select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Highest Academic Degree
                </label>
                <Select
                  value={formData.highestDegree}
                  onChange={(e) => setFormData({ ...formData, highestDegree: e.target.value })}
                >
                  <option value="BS CS">BS Computer Science (4 Years)</option>
                  <option value="BS SE / IT">BS Software Eng / IT</option>
                  <option value="MCS / MSc CS">MCS / MSc Computer Science</option>
                  <option value="MS Computer Science / MPhil">MS / MPhil Computer Science</option>
                  <option value="PhD CS">PhD in Computer Science</option>
                </Select>
              </div>
            </div>

            {/* Password & Confirm */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    type="password"
                    required
                    placeholder="Min 8 characters"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="pl-9"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    type="password"
                    required
                    placeholder="Repeat password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="pl-9"
                  />
                </div>
              </div>
            </div>

            {/* Terms checkbox */}
            <div className="pt-2">
              <label className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={formData.agreeTerms}
                  onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                  className="mt-0.5 rounded border-slate-300 text-[#315BEA] focus:ring-[#315BEA]"
                />
                <span>
                  I agree to the Academic Interview Pro Terms of Service, Honor Code, and Privacy Policy.
                </span>
              </label>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#315BEA] hover:bg-[#2348C9] text-white font-bold text-sm shadow-md shadow-blue-500/20"
            >
              {loading ? "Creating Account..." : "Create Account & Verify Email"}
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
            Already have an account?{" "}
            <Link href="/auth/login" className="font-bold text-[#315BEA] hover:underline dark:text-blue-400">
              Sign In Instead
            </Link>
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="mx-auto w-full max-w-xl text-center text-[11px] text-slate-400 pt-6">
        <span>© 2026 Academic Interview Pro • Empowering Pakistani Academics</span>
      </div>
    </div>
  );
}
