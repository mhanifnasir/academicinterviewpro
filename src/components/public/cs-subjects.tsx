"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Binary,
  Cpu,
  Database,
  Network,
  Layers,
  Code,
  Terminal,
  Sparkles,
  Monitor,
  FileCode,
  Globe,
  ShieldCheck,
  ArrowRight,
  BookOpen,
  Filter,
} from "lucide-react";
import { CS_SUBJECTS } from "@/data/mock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const iconMap: Record<string, React.ElementType> = {
  Binary,
  Cpu,
  Database,
  Network,
  Layers,
  Code,
  Terminal,
  Sparkles,
  Monitor,
  FileCode,
  Globe,
  ShieldCheck,
};

export function CSSubjectsSection() {
  const [selectedFilter, setSelectedFilter] = useState<"All" | "Critical" | "High" | "Medium">("All");

  const filteredSubjects = CS_SUBJECTS.filter((sub) => {
    if (selectedFilter === "All") return true;
    return sub.commissionFrequency === selectedFilter;
  });

  return (
    <section id="subjects" className="py-20 sm:py-28 bg-white dark:bg-[#101B36] transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#315BEA] dark:text-blue-400">
              HEC & Provincial Commission Aligned
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-black text-[#101B36] dark:text-white">
              The 12 Core CS Disciplines
            </h2>
            <p className="mt-3 text-base text-slate-600 dark:text-slate-300 max-w-2xl">
              Engineered according to the Higher Education Commission (HEC) national curricula and past 10 years of PPSC, FPSC, KPPSC & SPSC examination trends.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-slate-500 mr-1 flex items-center gap-1">
              <Filter className="h-3.5 w-3.5" /> Exam Weight:
            </span>
            {(["All", "Critical", "High", "Medium"] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  selectedFilter === filter
                    ? "bg-[#101B36] text-white dark:bg-[#315BEA]"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
                }`}
              >
                {filter === "All" ? "All Disciplines" : `${filter} Yield`}
              </button>
            ))}
          </div>
        </div>

        {/* Subjects Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSubjects.map((subject) => {
            const Icon = iconMap[subject.iconName] || BookOpen;
            return (
              <div
                key={subject.id}
                className="group relative rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm transition-all duration-200 hover:border-blue-300 hover:shadow-lg dark:border-slate-800 dark:bg-[#0B1120] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-[#315BEA] dark:bg-blue-950/60 dark:text-blue-400 group-hover:scale-105 transition-transform">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Badge
                        variant={
                          subject.commissionFrequency === "Critical"
                            ? "destructive"
                            : subject.commissionFrequency === "High"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {subject.weightage} Weight
                      </Badge>
                      <span className="text-[10px] font-bold text-slate-500 uppercase">
                        {subject.code}
                      </span>
                    </div>
                  </div>

                  <h3 className="mt-4 text-lg font-bold text-[#101B36] dark:text-white group-hover:text-[#315BEA] transition-colors">
                    {subject.title}
                  </h3>

                  <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400 line-clamp-2">
                    {subject.description}
                  </p>

                  {/* Micro stats */}
                  <div className="mt-4 flex items-center gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
                    <span>{subject.totalMCQs.toLocaleString()} MCQs</span>
                    <span>•</span>
                    <span>{subject.totalVivaQuestions} Viva Questions</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#16A37B] dark:text-emerald-400">
                    {subject.commissionFrequency} Frequency
                  </span>
                  <Link href={`/dashboard/subjects`} className="text-xs font-bold text-[#315BEA] dark:text-blue-400 flex items-center gap-1 hover:underline">
                    Explore Syllabus
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Link href="/dashboard/subjects">
            <Button size="lg" className="bg-[#101B36] hover:bg-[#1A284D] text-white dark:bg-[#315BEA] dark:hover:bg-[#2348C9]">
              Access Full CS Subject Syllabus & Question Banks
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
