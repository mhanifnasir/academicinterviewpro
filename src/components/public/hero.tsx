import React from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Sparkles, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-16 md:pb-28 bg-gradient-to-b from-[#F2F5FA] via-[#F2F5FA] to-white dark:from-[#0B1120] dark:via-[#0B1120] dark:to-[#101B36]">
      {/* Background glowing decorations */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-tr from-blue-400/10 via-indigo-500/10 to-teal-400/10 blur-3xl pointer-events-none -z-10" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Banner Pill */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-white/80 px-4 py-1.5 text-xs sm:text-sm font-semibold text-[#101B36] shadow-sm backdrop-blur dark:border-blue-900/60 dark:bg-slate-900/80 dark:text-blue-300">
            <span className="flex h-2 w-2 rounded-full bg-[#16A37B] animate-pulse" />
            <span>Targeted for PPSC, FPSC, KPPSC & SPSC CS Lecturer Aspirants (BS-17)</span>
            <span className="text-[#315BEA] dark:text-blue-400 font-bold ml-1">2026 Season</span>
          </div>
        </div>

        {/* Hero Title */}
        <div className="mt-8 text-center max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-[#101B36] dark:text-white leading-[1.12]">
            Master the Computer Science{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#315BEA] via-blue-600 to-[#16A37B]">
              Lecturer Selection Board
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            The premier AI-powered academic preparation platform built specifically for Pakistani Computer Science lecturer candidates. Replicate 3-member commission viva panels, master 12 core disciplines, and perfect your English classroom delivery.
          </p>

          <p className="mt-2 text-sm font-bold text-[#315BEA] dark:text-blue-400 tracking-wide uppercase">
            Learn. Practice. Perform.
          </p>

          {/* Action CTAs */}
          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto bg-[#315BEA] hover:bg-[#2348C9] text-white shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 text-base px-8">
                <span>Start Free Practice</span>
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <a href="#ai-demo" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto flex items-center justify-center gap-2 text-base px-6">
                <Mic className="h-5 w-5 text-[#315BEA]" />
                <span>Simulate AI Viva Panel</span>
              </Button>
            </a>
            <Link href="/admin" className="w-full sm:w-auto sm:hidden">
              <Button size="lg" variant="secondary" className="w-full">
                Admin Console Demo
              </Button>
            </Link>
          </div>

          {/* Trust points */}
          <div className="mt-10 pt-6 border-t border-slate-200/60 dark:border-slate-800/80 flex flex-wrap items-center justify-center gap-y-3 gap-x-8 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="h-4 w-4 text-[#16A37B]" />
              FPSC & PPSC 100-Mark Negative Marking Syllabus
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="h-4 w-4 text-[#16A37B]" />
              Authentic 3-Member Board Viva Simulation
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="h-4 w-4 text-[#16A37B]" />
              18,000+ Verified CS Lecturer Past MCQs
            </span>
          </div>
        </div>

        {/* Hero Interactive Preview Card */}
        <div className="mt-14 mx-auto max-w-5xl rounded-2xl border border-slate-200/90 bg-white p-3 sm:p-5 shadow-2xl shadow-blue-900/10 dark:border-slate-800 dark:bg-[#101B36]">
          <div className="rounded-xl border border-slate-200/70 bg-[#F2F5FA] p-4 sm:p-6 dark:border-slate-800/80 dark:bg-[#0B1120]">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200/80 pb-4 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#101B36] text-white dark:bg-[#315BEA]">
                  <Sparkles className="h-5 w-5 text-amber-300" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-[#101B36] dark:text-white">
                    PPSC CS Lecturer Selection Board — Virtual Viva Session #4
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Panelists: Subject Specialist (FAST), Pedagogy Dean (QAU), Commission Member
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="ppsc">PPSC BPS-17</Badge>
                <Badge variant="success">Readiness: 86%</Badge>
              </div>
            </div>

            {/* Simulated Viva Dialogue */}
            <div className="mt-5 space-y-4">
              <div className="rounded-xl bg-white p-4 border border-slate-200/80 dark:bg-[#152243] dark:border-slate-800">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                  <span className="text-[#315BEA] dark:text-blue-400 font-bold">
                    Dr. Tariq Mahmood (Subject Specialist - Algorithms & OS)
                  </span>
                  <span>Audio & Text Query</span>
                </div>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  &ldquo;Candidate, when designing high-throughput relational databases, why is a B+ Tree preferred over a standard AVL or Red-Black Tree? Point out the exact disk block mechanical constraints.&rdquo;
                </p>
              </div>

              <div className="rounded-xl bg-blue-50/70 p-4 border border-blue-200/60 dark:bg-blue-950/40 dark:border-blue-900/50">
                <div className="flex items-center justify-between text-xs font-semibold text-blue-700 dark:text-blue-300 mb-1.5">
                  <span className="font-bold">Candidate Response (Spoken English Audio Transcript)</span>
                  <span className="bg-[#16A37B] text-white px-2 py-0.5 rounded text-[10px]">Academic Tone: 92%</span>
                </div>
                <p className="text-sm text-slate-800 dark:text-slate-200">
                  &ldquo;Respected panel, B+ Trees are multi-way balanced search trees specifically designed for secondary storage block access. Because memory transfers occur in pages, high branching factor minimizes tree height to 3 or 4 levels, requiring minimal I/O seeks compared to deep binary trees. Moreover, leaf nodes are linked sequentially, enabling optimal range scans.&rdquo;
                </p>
              </div>

              {/* Instant Evaluation Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="rounded-lg bg-white p-3 border border-slate-200/80 text-center dark:bg-[#101B36] dark:border-slate-800">
                  <span className="text-xs text-slate-500 block">Technical Accuracy</span>
                  <span className="text-lg font-black text-[#16A37B]">96%</span>
                </div>
                <div className="rounded-lg bg-white p-3 border border-slate-200/80 text-center dark:bg-[#101B36] dark:border-slate-800">
                  <span className="text-xs text-slate-500 block">Conceptual Depth</span>
                  <span className="text-lg font-black text-[#315BEA]">92%</span>
                </div>
                <div className="rounded-lg bg-white p-3 border border-slate-200/80 text-center dark:bg-[#101B36] dark:border-slate-800">
                  <span className="text-xs text-slate-500 block">Spoken Fluency</span>
                  <span className="text-lg font-black text-[#101B36] dark:text-white">138 WPM</span>
                </div>
                <div className="rounded-lg bg-white p-3 border border-slate-200/80 text-center dark:bg-[#101B36] dark:border-slate-800">
                  <span className="text-xs text-slate-500 block">Board Recommendation</span>
                  <span className="text-sm font-bold text-[#16A37B] mt-1 inline-block">Strong Recommend</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Commission Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="rounded-xl border border-slate-200 bg-white p-5 text-center shadow-sm dark:border-slate-800 dark:bg-[#101B36]">
            <span className="text-3xl sm:text-4xl font-black text-[#315BEA]">18,450+</span>
            <span className="block mt-1 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400">
              Verified CS Lecturer MCQs
            </span>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 text-center shadow-sm dark:border-slate-800 dark:bg-[#101B36]">
            <span className="text-3xl sm:text-4xl font-black text-[#101B36] dark:text-white">12</span>
            <span className="block mt-1 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400">
              Complete CS Core Disciplines
            </span>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 text-center shadow-sm dark:border-slate-800 dark:bg-[#101B36]">
            <span className="text-3xl sm:text-4xl font-black text-[#16A37B]">3-Member</span>
            <span className="block mt-1 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400">
              Virtual Commission Board Panel
            </span>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 text-center shadow-sm dark:border-slate-800 dark:bg-[#101B36]">
            <span className="text-3xl sm:text-4xl font-black text-[#315BEA]">100%</span>
            <span className="block mt-1 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400">
              Aligned with HEC & Public Commissions
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
