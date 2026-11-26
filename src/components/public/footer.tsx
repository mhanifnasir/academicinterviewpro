import React from "react";
import Link from "next/link";
import { GraduationCap, ArrowUpRight } from "lucide-react";

export function PublicFooter() {
  return (
    <footer className="border-t border-slate-200 bg-[#101B36] text-white dark:border-slate-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Identity */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#315BEA] text-white">
                <GraduationCap className="h-6 w-6" />
              </div>
              <span className="text-xl font-black tracking-tight">
                Academic Interview <span className="text-[#315BEA]">Pro</span>
              </span>
            </div>
            <p className="mt-1 text-xs font-semibold text-[#16A37B] uppercase tracking-wider">
              Learn. Practice. Perform.
            </p>
            <p className="mt-4 text-xs sm:text-sm text-slate-400 max-w-md leading-relaxed">
              Pakistan&apos;s dedicated AI preparation ecosystem for Computer Science lecturer aspirants. Empowering candidates across Punjab, Sindh, KPK, Balochistan, and Federal colleges to excel in selection boards.
            </p>
            <div className="mt-6 flex items-center gap-3 text-xs text-slate-400">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
              <span>Aligned with HEC & Public Service Commissions 2026</span>
            </div>
          </div>

          {/* Column 1: CS Disciplines */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Core Disciplines
            </h4>
            <ul className="mt-4 space-y-2.5 text-xs sm:text-sm text-slate-300">
              <li>
                <Link href="/dashboard/subjects" className="hover:text-white transition-colors">
                  Data Structures & Algorithms
                </Link>
              </li>
              <li>
                <Link href="/dashboard/subjects" className="hover:text-white transition-colors">
                  Operating Systems
                </Link>
              </li>
              <li>
                <Link href="/dashboard/subjects" className="hover:text-white transition-colors">
                  Database Management Systems
                </Link>
              </li>
              <li>
                <Link href="/dashboard/subjects" className="hover:text-white transition-colors">
                  Computer Networks
                </Link>
              </li>
              <li>
                <Link href="/dashboard/subjects" className="hover:text-white transition-colors">
                  Software Engineering
                </Link>
              </li>
              <li>
                <Link href="/dashboard/subjects" className="hover:text-white transition-colors">
                  Object-Oriented Programming
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Commission Guides */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Commission Prep
            </h4>
            <ul className="mt-4 space-y-2.5 text-xs sm:text-sm text-slate-300">
              <li>
                <Link href="/dashboard/mock-exams" className="hover:text-white transition-colors">
                  PPSC CS Lecturer (BPS-17)
                </Link>
              </li>
              <li>
                <Link href="/dashboard/mock-exams" className="hover:text-white transition-colors">
                  FPSC CS Lecturer (F.4 Series)
                </Link>
              </li>
              <li>
                <Link href="/dashboard/mock-exams" className="hover:text-white transition-colors">
                  SPSC Sindh CS Lecturer
                </Link>
              </li>
              <li>
                <Link href="/dashboard/mock-exams" className="hover:text-white transition-colors">
                  KPPSC Higher Education Dept
                </Link>
              </li>
              <li>
                <Link href="/dashboard/teaching-practice" className="hover:text-white transition-colors">
                  Micro-Teaching Viva Guide
                </Link>
              </li>
              <li>
                <Link href="/dashboard/resources" className="hover:text-white transition-colors">
                  10-Year Past Papers & Keys
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Platform Portals */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Platform Access
            </h4>
            <ul className="mt-4 space-y-2.5 text-xs sm:text-sm text-slate-300">
              <li>
                <Link href="/dashboard" className="text-blue-400 font-semibold hover:underline flex items-center gap-1">
                  Candidate Dashboard <ArrowUpRight className="h-3 w-3" />
                </Link>
              </li>
              <li>
                <Link href="/dashboard/interview-prep" className="hover:text-white transition-colors">
                  AI Viva Panel Simulator
                </Link>
              </li>
              <li>
                <Link href="/dashboard/english-lab" className="hover:text-white transition-colors">
                  Academic English Lab
                </Link>
              </li>
              <li>
                <Link href="/dashboard/mcq-practice" className="hover:text-white transition-colors">
                  MCQ Practice Suite
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-emerald-400 font-semibold hover:underline flex items-center gap-1">
                  Admin Console <ArrowUpRight className="h-3 w-3" />
                </Link>
              </li>
              <li>
                <Link href="/auth/login" className="hover:text-white transition-colors">
                  Sign In / Register
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>
            © 2026 Academic Interview Pro. Built for Pakistani Academic Excellence.
          </p>
          <div className="flex items-center gap-6">
            <span>Tagline: Learn. Practice. Perform.</span>
            <span>Made for Pakistan 🇵🇰</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
