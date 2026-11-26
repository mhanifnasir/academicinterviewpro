"use client";

import React, { useState } from "react";
import Link from "next/link";
import { GraduationCap, Menu, X, ArrowRight } from "lucide-react";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";
import { PUBLIC_NAV_LINKS } from "@/data/navigation";

export function PublicNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md dark:border-slate-800 dark:bg-[#101B36]/90 transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#101B36] text-white shadow-md shadow-blue-900/20 group-hover:bg-[#315BEA] transition-colors dark:bg-[#315BEA]">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <div>
            <span className="text-lg font-black tracking-tight text-[#101B36] dark:text-white">
              Academic Interview <span className="text-[#315BEA]">Pro</span>
            </span>
            <span className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider dark:text-slate-400">
              Learn. Practice. Perform.
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-7">
          {PUBLIC_NAV_LINKS.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-slate-600 hover:text-[#315BEA] dark:text-slate-300 dark:hover:text-blue-400 transition-colors"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Right CTA */}
        <div className="hidden sm:flex items-center gap-3">
          <ThemeToggle />
          <Link href="/auth/login">
            <Button variant="ghost" size="sm" className="font-semibold text-slate-700 dark:text-slate-200">
              Sign In
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button size="sm" className="bg-[#315BEA] hover:bg-[#2348C9] text-white font-semibold flex items-center gap-1.5 shadow-sm">
              Candidate Portal
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 bg-white px-4 py-5 dark:border-slate-800 dark:bg-[#101B36]">
          <nav className="flex flex-col space-y-3 pb-4">
            {PUBLIC_NAV_LINKS.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-slate-700 hover:text-[#315BEA] dark:text-slate-200"
              >
                {link.name}
              </a>
            ))}
          </nav>
          <div className="flex flex-col gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="outline" className="w-full justify-center">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/register" onClick={() => setMobileMenuOpen(false)}>
              <Button className="w-full justify-center bg-[#315BEA]">
                Create Free Candidate Account
              </Button>
            </Link>
            <Link href="/admin" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="navy" className="w-full justify-center text-xs">
                Switch to Admin Portal
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
