"use client";

import React from "react";
import Link from "next/link";
import {
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Flame,
  Mic,
  Presentation,
  Sparkles,
  Target,
  TrendingUp,
  ArrowRight,
  FileText,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Code2,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "@/components/shared/page-header";
import { CURRENT_CANDIDATE, CS_SUBJECTS, AI_PANELISTS } from "@/data/mock-data";

export default function CandidateOverviewPage() {
  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#101B36] via-[#162347] to-[#315BEA] p-6 sm:p-8 text-white shadow-lg border border-slate-700/50">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 h-48 w-48 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur-md border border-white/10">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Target: PPSC Punjab CS Lecturer (BPS-17)</span>
            </div>
            <h1 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
              Assalam-o-Alaikum, {CURRENT_CANDIDATE.name}!
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-slate-200 leading-relaxed">
              Selection Board readiness is at <strong className="text-emerald-300">78%</strong>. You are currently projected in the <strong className="text-white underline decoration-emerald-400 underline-offset-4">Top 4.2%</strong> of active provincial CS lecturer aspirants.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link href="/dashboard/interview-prep">
              <Button size="sm" className="bg-[#16A37B] hover:bg-[#128262] text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-sm shadow-emerald-500/25">
                <Mic className="h-4 w-4" />
                <span>Simulate Viva Panel</span>
              </Button>
            </Link>
            <Link href="/dashboard/mock-exams">
              <Button size="sm" variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20 text-xs sm:text-sm font-bold backdrop-blur-sm">
                <FileText className="h-4 w-4 mr-1.5" />
                <span>100-Mark Mock</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Board Readiness */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs hover:shadow-md transition-shadow dark:border-slate-800 dark:bg-[#101B36]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Board Readiness</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-[#16A37B] dark:bg-emerald-950/60 dark:text-emerald-400">
              <Award className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-black text-[#101B36] dark:text-white">
              {CURRENT_CANDIDATE.readinessScore}%
            </span>
            <Progress value={CURRENT_CANDIDATE.readinessScore} className="mt-2.5 h-2" indicatorClassName="bg-[#16A37B]" />
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
            <TrendingUp className="h-3 w-3" />
            <span>+6% improvement this week</span>
          </div>
        </div>

        {/* Exam Countdown */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs hover:shadow-md transition-shadow dark:border-slate-800 dark:bg-[#101B36]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Exam Countdown</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-[#315BEA] dark:bg-blue-950/60 dark:text-blue-400">
              <Calendar className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-black text-[#315BEA] dark:text-blue-400">
              42 Days
            </span>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 font-medium">
              Target: June 15, 2026
            </p>
          </div>
          <span className="mt-2 text-[11px] text-emerald-600 dark:text-emerald-400 font-bold block">
            Screening Stage 1 (MCQ)
          </span>
        </div>

        {/* MCQs Practiced */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs hover:shadow-md transition-shadow dark:border-slate-800 dark:bg-[#101B36]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">MCQs Solved</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-black text-[#101B36] dark:text-white">
              {CURRENT_CANDIDATE.mcqsPracticed.toLocaleString()}
            </span>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 font-medium">
              Average Score: {CURRENT_CANDIDATE.mockExamScoreAvg}%
            </p>
          </div>
          <span className="mt-2 text-[11px] text-slate-500 dark:text-slate-400 block">
            Goal: 3,500 questions
          </span>
        </div>

        {/* Study Streak */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs hover:shadow-md transition-shadow dark:border-slate-800 dark:bg-[#101B36]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Daily Study Streak</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 text-amber-500 dark:bg-amber-950/60 dark:text-amber-400">
              <Flame className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-black text-amber-500 dark:text-amber-400">
              {CURRENT_CANDIDATE.studyStreakDays} Days
            </span>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 font-medium">
              Consistency multiplier: 1.4x
            </p>
          </div>
          <span className="mt-2 text-[11px] text-slate-500 dark:text-slate-400 block">
            Keep it active today!
          </span>
        </div>
      </div>

      {/* Main Grid: Subject Mastery & Upcoming Vivas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: 21 Disciplines Progress */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-[#101B36]">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
            <div>
              <h2 className="text-lg font-bold text-[#101B36] dark:text-white">
                Syllabus Mastery Breakdown
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Accuracy across High-Yield Pakistani Commission CS subjects (HEC Revised 2025)
              </p>
            </div>
            <Link href="/dashboard/subjects">
              <Button variant="ghost" size="sm" className="text-xs font-bold text-[#315BEA] dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50">
                <span>View All 21 Subjects</span>
                <ChevronRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </Link>
          </div>

          <div className="space-y-3.5">
            {CS_SUBJECTS.slice(0, 5).map((subject, idx) => {
              const sampleScore = [86, 82, 79, 74, 68][idx];
              return (
                <div
                  key={subject.id}
                  className="rounded-xl border border-slate-100 p-4 dark:border-slate-800/80 hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition-colors"
                >
                  <div className="flex items-center justify-between text-xs font-bold mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[#101B36] dark:text-white">
                        {subject.title}
                      </span>
                      <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        {subject.weightage} Weight
                      </span>
                    </div>
                    <span className="text-[#315BEA] dark:text-blue-400 font-extrabold">{sampleScore}% Mastery</span>
                  </div>
                  <Progress
                    value={sampleScore}
                    className="h-2"
                    indicatorClassName={sampleScore >= 80 ? "bg-[#16A37B]" : "bg-[#315BEA]"}
                  />
                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                    <span>Target Commission Questions: 8-12 MCQs</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{subject.totalMCQs} MCQs in Bank</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: AI Viva Panelists & Weak Topics Alert */}
        <div className="space-y-6">
          {/* Virtual Panelists Box */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-[#101B36]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-[#101B36] dark:text-white">
                  Active Selection Panel
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">HEC & Board Simulated Vivas</p>
              </div>
              <Badge variant="ppsc">Board Ready</Badge>
            </div>

            <div className="space-y-3">
              {AI_PANELISTS.map((panelist, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 rounded-xl bg-slate-50/80 p-3 dark:bg-[#0B1120] border border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 transition-colors"
                >
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white text-xs font-bold shadow-xs ${panelist.avatarColor}`}>
                    {panelist.name.split(" ")[1]?.charAt(0) || "P"}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-[#101B36] dark:text-white truncate">
                      {panelist.name}
                    </h4>
                    <p className="text-[11px] text-[#315BEA] dark:text-blue-400 font-semibold truncate">
                      {panelist.role}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                      {panelist.institution}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Link href="/dashboard/interview-prep" className="mt-5 block">
              <Button className="w-full bg-[#315BEA] hover:bg-[#2348C9] text-white text-xs font-bold py-2.5 shadow-xs shadow-blue-500/20">
                Start Full 3-Member Board Viva
              </Button>
            </Link>
          </div>

          {/* High-Yield Alert */}
          <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-5 dark:border-amber-900/60 dark:bg-amber-950/20">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200">
                  High-Yield Alert: Theory of Automata
                </h4>
                <p className="mt-1 text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                  Your accuracy on Pumping Lemma and Turing Machine Decidability is 58%. PPSC tests include 6-8 direct questions on formal languages.
                </p>
                <Link
                  href="/dashboard/mcq-practice?subject=theory-of-automata"
                  className="mt-2.5 inline-flex items-center gap-1 text-xs font-bold text-[#315BEA] dark:text-blue-400 hover:underline"
                >
                  <span>Drill Automata Questions Now</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
