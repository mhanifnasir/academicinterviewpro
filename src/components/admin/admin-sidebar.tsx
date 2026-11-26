"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldAlert, ExternalLink, Activity, ArrowLeft } from "lucide-react";
import { ADMIN_NAV_SECTIONS } from "@/data/navigation";

export function AdminSidebar({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200/90 bg-white transition-transform duration-200 ease-in-out dark:border-slate-800 dark:bg-[#101B36] lg:static lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-16 shrink-0 items-center justify-between px-6 border-b border-slate-200/80 dark:border-slate-800">
          <Link href="/admin" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#101B36] text-white dark:bg-emerald-600 shadow-xs group-hover:scale-105 transition-transform">
              <ShieldAlert className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <span className="text-base font-black tracking-tight text-[#101B36] dark:text-white">
                Academic Pro <span className="text-emerald-500 text-xs">Admin</span>
              </span>
              <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                Management Console
              </span>
            </div>
          </Link>
        </div>

        {/* System Status Pill */}
        <div className="mx-3 mt-3 rounded-xl border border-emerald-200 bg-emerald-50/70 p-2.5 dark:border-emerald-900/50 dark:bg-emerald-950/30">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 font-bold text-emerald-800 dark:text-emerald-300">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Syllabus Engine Active
            </span>
            <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-mono font-bold">
              21 / 21 OK
            </span>
          </div>
        </div>

        {/* Categorized Navigation Sections */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-5 scrollbar-thin">
          {ADMIN_NAV_SECTIONS.map((section) => (
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
                    className={`group relative flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-[#101B36] text-white shadow-xs dark:bg-emerald-600"
                        : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/80 dark:hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon
                        className={`h-4 w-4 shrink-0 transition-colors ${
                          isActive
                            ? "text-amber-400 dark:text-white"
                            : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200"
                        }`}
                      />
                      <span className="truncate">{item.title}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
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

        {/* Switch back to Candidate Portal */}
        <div className="p-3 border-t border-slate-200/80 dark:border-slate-800 shrink-0">
          <Link
            href="/dashboard"
            className="flex items-center justify-between rounded-xl bg-blue-50/80 p-2.5 text-xs font-bold text-[#315BEA] hover:bg-blue-100/80 dark:bg-blue-950/60 dark:text-blue-300 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Candidate Portal</span>
            </span>
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
      </aside>
    </>
  );
}
