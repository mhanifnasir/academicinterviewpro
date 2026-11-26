"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GraduationCap, ArrowRight, ShieldCheck, Mail, Lock, Eye, EyeOff, UserCheck, KeyRound, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { useAuth } from "@/lib/auth/auth-context";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [role, setRole] = useState<"candidate" | "admin">("candidate");
  const [email, setEmail] = useState("candidate@academicinterview.pro");
  const [password, setPassword] = useState("LecturerPro2026!");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleRoleSwitch = (newRole: "candidate" | "admin") => {
    setRole(newRole);
    setErrorMessage(null);
    if (newRole === "candidate") {
      setEmail("candidate@academicinterview.pro");
      setPassword("LecturerPro2026!");
    } else {
      setEmail("admin@academicinterview.pro");
      setPassword("AdminSecure2026!");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    const result = await login(email, password, role);
    setLoading(false);

    if (result.success) {
      if (role === "admin") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    } else {
      setErrorMessage(result.error || "Authentication failed. Check your credentials.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#F2F5FA] dark:bg-[#0B1120] px-4 py-8 sm:px-6 lg:px-8">
      {/* Top Header */}
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

      {/* Main Card */}
      <div className="mx-auto w-full max-w-md my-auto">
        <div className="rounded-2xl border border-slate-200/90 bg-white p-7 sm:p-9 shadow-xl dark:border-slate-800 dark:bg-[#101B36]">
          {/* Role selector tabs */}
          <div className="mb-6 grid grid-cols-2 rounded-xl bg-slate-100 p-1 dark:bg-slate-800/80">
            <button
              type="button"
              onClick={() => handleRoleSwitch("candidate")}
              className={`rounded-lg py-2 text-xs font-bold transition-all ${
                role === "candidate"
                  ? "bg-white text-[#101B36] shadow-sm dark:bg-[#101B36] dark:text-white"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              Candidate Portal
            </button>
            <button
              type="button"
              onClick={() => handleRoleSwitch("admin")}
              className={`rounded-lg py-2 text-xs font-bold transition-all ${
                role === "admin"
                  ? "bg-white text-[#101B36] shadow-sm dark:bg-[#101B36] dark:text-white"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              Admin Console
            </button>
          </div>

          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-[#101B36] dark:text-white">
              {role === "candidate" ? "Welcome Back, Aspirant" : "Administrator Sign In"}
            </h1>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {role === "candidate"
                ? "Sign in to resume your CS Lecturer mock vivas & exam drills"
                : "Manage syllabus questions, mock tests, and platform users"}
            </p>
          </div>

          {errorMessage && (
            <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800 dark:bg-rose-950/40 dark:border-rose-900 dark:text-rose-300 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Official Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="pl-9"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Password
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="text-xs font-semibold text-[#315BEA] hover:underline dark:text-blue-400"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your secure password"
                  className="pl-9 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-[#315BEA] focus:ring-[#315BEA]"
                />
                <span>Remember this workstation</span>
              </label>

              <span className="text-[11px] text-slate-400 font-mono">256-bit SSL</span>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className={`w-full py-2.5 font-bold text-sm ${
                role === "admin"
                  ? "bg-[#101B36] hover:bg-[#1A284D] text-white"
                  : "bg-[#315BEA] hover:bg-[#2348C9] text-white shadow-md shadow-blue-500/20"
              }`}
            >
              {loading ? "Authenticating..." : role === "admin" ? "Access Admin Console" : "Sign In to Candidate Portal"}
            </Button>
          </form>

          {/* Social Sign In Divider */}
          <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
            <p className="text-xs text-slate-500 mb-3">Or sign in with academic credentials</p>
            <Button
              variant="outline"
              type="button"
              onClick={() => router.push("/dashboard")}
              className="w-full text-xs font-semibold flex items-center justify-center gap-2"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </Button>
          </div>

          <p className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
            Don&apos;t have an account yet?{" "}
            <Link href="/auth/register" className="font-bold text-[#315BEA] hover:underline dark:text-blue-400">
              Register for Free
            </Link>
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="mx-auto w-full max-w-md text-center text-[11px] text-slate-400 pt-6">
        <span>© 2026 Academic Interview Pro • Pakistan Academic Framework</span>
      </div>
    </div>
  );
}
