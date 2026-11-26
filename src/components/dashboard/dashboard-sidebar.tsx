"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  GraduationCap,
  LogOut,
  ExternalLink,
  Calendar,
  Sparkles,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { CANDIDATE_NAV_SECTIONS } from "@/data/navigation";
import { CURRENT_CANDIDATE } from "@/data/mock-data";
import { useAuth } from "@/lib/auth/auth-context";

export function DashboardSidebar({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const { profile, logout } = useAuth();

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200/90 bg-white transition-transform duration-200 ease-in-out dark:border-slate-800 dark:bg-[#101B36] lg:static lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {/* Brand Header */}
        <div className="flex h-16 shrink-0 items-center justify-between px-6 border-b border-slate-200/80 dark:border-slate-800">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#315BEA] text-white shadow-xs group-hover:scale-105 transition-transform">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <span className="text-base font-black tracking-tight text-[#101B36] dark:text-white">
                Academic Interview <span className="text-[#315BEA]">Pro</span>
              </span>
              <span className="block text-[9px] font-bold text-[#16A37B] uppercase tracking-wider">
                Candidate Portal
              </span>
            </div>
          </Link>
        </div>

        {/* Target Commission Badge */}
        <div className="mx-3 mt-3 rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50/70 to-indigo-50/40 p-3 dark:border-blue-900/50 dark:from-blue-950/40 dark:to-indigo-950/20">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Target Post:</span>
            <span className="font-bold text-[#315BEA] dark:text-blue-400">PPSC CS Lecturer</span>
          </div>
          <div className="mt-1.5 flex items-center justify-between text-[11px]">
            <span className="font-medium text-slate-600 dark:text-slate-300">BPS-17 Scale</span>
            <span className="flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              42 Days Left
            </span>
          </div>
        </div>

        {/* Categorized Navigation Sections */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-5 scrollbar-thin">
          {CANDIDATE_NAV_SECTIONS.map((section) => (
            <div key={section.title} className="space-y-1">
              <div className="px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {section.title}
              </div>
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={`group relative flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition-all ${isActive
                        ? "bg-[#315BEA] text-white shadow-xs shadow-blue-500/25 dark:bg-[#315BEA] dark:text-white"
                        : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/80 dark:hover:text-white"
                      }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon
                        className={`h-4 w-4 shrink-0 transition-colors ${isActive
                            ? "text-white"
                            : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200"
                          }`}
                      />
                      <span className="truncate">{item.title}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${isActive
                            ? "bg-white/20 text-white"
                            : "bg-blue-50 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300 border border-blue-200/50 dark:border-blue-900/50"
                          }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* User Card & Logout Footer */}
        <div className="p-3 border-t border-slate-200/80 dark:border-slate-800 shrink-0">
          <div className="rounded-xl bg-slate-50/90 p-3 dark:bg-[#0B1120] border border-slate-200/70 dark:border-slate-800/80">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#101B36] text-white font-bold text-xs dark:bg-blue-600 shadow-xs">
                {(profile?.fullName || CURRENT_CANDIDATE.name)
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-[#101B36] dark:text-white truncate">
                  {profile?.fullName || CURRENT_CANDIDATE.name}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span className="text-[10px] font-medium text-slate-500 truncate">
                    Lecturer Pro Plan
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-800 text-[11px]">
              <Link
                href="/admin"
                className="font-semibold text-slate-500 hover:text-[#315BEA] dark:hover:text-blue-400 flex items-center gap-1 transition-colors"
              >
                <span>Admin View</span>
                <ExternalLink className="h-3 w-3" />
              </Link>
              <button
                type="button"
                onClick={() => logout()}
                className="font-semibold text-rose-600 hover:text-rose-700 dark:text-rose-400 flex items-center gap-1 transition-colors"
              >
                <LogOut className="h-3 w-3" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
