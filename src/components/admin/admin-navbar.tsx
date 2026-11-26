"use client";

import React from "react";
import Link from "next/link";
import { Menu, Bell, Shield, Search, ArrowUpRight } from "lucide-react";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth/auth-context";

export function AdminNavbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { logout } = useAuth();
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur-md dark:border-slate-800 dark:bg-[#101B36]/90 sm:px-6 lg:px-8 transition-colors">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 lg:hidden"
          aria-label="Toggle Navigation Drawer"
        >
          <Menu className="h-6 w-6" />
        </button>

        <div className="flex items-center gap-2">
          <Badge className="bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950 dark:text-amber-300 font-bold">
            Admin Console (Super User)
          </Badge>
          <span className="hidden sm:inline-block text-xs text-slate-400">
            • Academic System v1.0
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/dashboard"
          className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-[#315BEA] hover:underline"
        >
          <span>Switch to Candidate Mode</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>

        <ThemeToggle />

        <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-white text-xs font-black">
            AD
          </div>
          <div className="hidden md:block text-left">
            <span className="block text-xs font-bold text-[#101B36] dark:text-white leading-tight">
              Dr. Admin
            </span>
            <span className="block text-[10px] text-slate-500 leading-tight">
              HED Coordinator
            </span>
          </div>
          <button
            type="button"
            onClick={() => logout()}
            className="text-xs font-bold text-rose-500 hover:text-rose-700 ml-2"
          >
            Sign Out
          </button>
        </div>
      </div>
    </header>
  );
}
