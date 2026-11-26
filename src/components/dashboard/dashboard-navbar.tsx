"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  Bell,
  Search,
  Sparkles,
  Calendar,
  User,
  GraduationCap,
  ExternalLink,
  ChevronRight,
  CheckCircle2,
  Clock,
  BookOpen,
  X,
} from "lucide-react";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth/auth-context";
import { CANDIDATE_NAV_ITEMS } from "@/data/navigation";

const NOTIFICATIONS_MOCK = [
  {
    id: "1",
    title: "PPSC CS Lecturer 2026 Schedule",
    message: "Punjab Higher Education Department has notified 140 vacant seats.",
    time: "2 hours ago",
    unread: true,
    category: "COMMISSION",
  },
  {
    id: "2",
    title: "New 100-Mark Mock Test Available",
    message: "Full curriculum mock with negative marking (-0.25) is now active.",
    time: "Yesterday",
    unread: true,
    category: "EXAM",
  },
  {
    id: "3",
    title: "AI Viva Feedback Ready",
    message: "Senior Professor Dr. Arshad reviewed your Operating Systems response.",
    time: "2 days ago",
    unread: false,
    category: "VIVA",
  },
];

export function DashboardNavbar({ onMenuClick }: { onMenuClick: () => void }) {
  const pathname = usePathname();
  const { profile } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(NOTIFICATIONS_MOCK);
  const [searchQuery, setSearchQuery] = useState("");
  const notifRef = useRef<HTMLDivElement>(null);

  // Close notifications on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  // Resolve current page title
  const currentNav = CANDIDATE_NAV_ITEMS.find((item) => item.href === pathname);
  const pageTitle = currentNav?.title || "Portal";

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 backdrop-blur-md dark:border-slate-800 dark:bg-[#101B36]/95 sm:px-6 lg:px-8 transition-colors">
      <div className="flex items-center gap-3.5">
        {/* Mobile menu trigger */}
        <button
          onClick={onMenuClick}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200/80 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 lg:hidden transition-colors"
          aria-label="Toggle Navigation Drawer"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Breadcrumb indicator on desktop */}
        <div className="hidden lg:flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <Link
            href="/dashboard"
            className="hover:text-[#315BEA] dark:hover:text-blue-400 transition-colors"
          >
            Dashboard
          </Link>
          {pathname !== "/dashboard" && (
            <>
              <ChevronRight className="h-3 w-3 text-slate-400" />
              <span className="text-[#101B36] dark:text-white font-bold">{pageTitle}</span>
            </>
          )}
        </div>

        {/* Global Search Bar */}
        <div className="relative hidden md:block w-72 lg:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search MCQs, viva traps, formulas..."
            className="h-9 w-full rounded-xl border border-slate-200 bg-slate-50/80 pl-9 pr-12 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#315BEA] focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-[#0B1120] dark:text-slate-100 transition-all"
          />
          <kbd className="absolute right-2.5 top-2 rounded bg-slate-200/60 px-1.5 py-0.5 text-[9px] font-mono font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            Ctrl+K
          </kbd>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Commission countdown badge */}
        <div className="hidden sm:flex items-center gap-2 rounded-full border border-blue-200/80 bg-blue-50/60 px-3 py-1 text-xs font-semibold text-[#101B36] dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-300">
          <Calendar className="h-3.5 w-3.5 text-[#315BEA]" />
          <span>
            PPSC CS Lecturer: <strong className="text-[#315BEA] dark:text-blue-400">42 Days</strong>
          </span>
        </div>

        {/* Quick Launch Mock Viva */}
        <Link href="/dashboard/interview-prep" className="hidden xl:block">
          <Button
            size="sm"
            className="bg-[#16A37B] hover:bg-[#128262] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs shadow-emerald-600/20"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Launch AI Viva</span>
          </Button>
        </Link>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/80 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
            aria-label="View notifications"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#315BEA] ring-2 ring-white dark:ring-[#101B36]" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl dark:border-slate-800 dark:bg-[#101B36] z-50">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#101B36] dark:text-white uppercase tracking-wider">
                    Notifications
                  </span>
                  {unreadCount > 0 && (
                    <Badge variant="default" className="text-[10px] px-1.5 py-0">
                      {unreadCount} new
                    </Badge>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-[11px] text-[#315BEA] hover:underline font-semibold"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="mt-3 space-y-2.5 max-h-80 overflow-y-auto scrollbar-thin">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`rounded-xl p-3 text-xs transition-colors ${
                      n.unread
                        ? "bg-blue-50/70 border border-blue-100/80 dark:bg-blue-950/40 dark:border-blue-900/40"
                        : "bg-slate-50/80 border border-slate-100 dark:bg-slate-900/40 dark:border-slate-800"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-bold text-[#101B36] dark:text-white leading-snug">
                        {n.title}
                      </p>
                      {n.unread && (
                        <span className="h-1.5 w-1.5 rounded-full bg-[#315BEA] shrink-0 mt-1" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      {n.message}
                    </p>
                    <span className="mt-1.5 block text-[10px] text-slate-400 font-medium">
                      {n.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile Pill */}
        <Link
          href="/dashboard/profile"
          className="flex items-center gap-2.5 pl-2 border-l border-slate-200/80 dark:border-slate-800 group"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#101B36] text-white text-xs font-bold dark:bg-blue-600 shadow-xs group-hover:scale-105 transition-transform">
            {(profile?.fullName || "Hamza Farooq")
              .split(" ")
              .map((n) => n[0])
              .slice(0, 2)
              .join("")}
          </div>
          <div className="hidden md:block text-left">
            <span className="block text-xs font-bold text-[#101B36] dark:text-white leading-tight group-hover:text-[#315BEA] dark:group-hover:text-blue-400 transition-colors">
              {profile?.fullName || "Hamza Farooq"}
            </span>
            <span className="block text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
              Lecturer Aspirant
            </span>
          </div>
        </Link>
      </div>
    </header>
  );
}
