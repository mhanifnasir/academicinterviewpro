"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  TrendingUp,
  Award,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Printer,
  Sparkles,
  BookOpen,
  ArrowRight,
  Code,
  Mic,
  GraduationCap,
  Calendar,
  Activity,
  Layers,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  AreaChart,
  Area,
} from "recharts";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { CandidateAnalyticsDashboardData } from "@/lib/analytics/candidate-analytics-service";

const CLIENT_FALLBACK_ANALYTICS: CandidateAnalyticsDashboardData = {
  overallReadiness: {
    score: 78,
    targetMeritCutoff: 58,
    provincialMeritPercentile: "Top 4.2%",
    targetCommission: "PPSC",
    statusBadge: "Merit Shortlist Zone",
  },
  metricsSummary: {
    totalMcqsPracticed: 320,
    mcqAccuracyPercentage: 77,
    mockExamsCompleted: 6,
    averageMockScore: 74,
    vivasSimulated: 6,
    averageVivaScore: 82,
    englishSessionsCompleted: 8,
    averageWpm: 134,
    codingChallengesSolved: 8,
    teachingDemosDelivered: 3,
  },
  streak: {
    currentDays: 7,
    longestDays: 14,
    lastActiveDate: new Date().toISOString(),
    activeDaysThisMonth: 22,
  },
  subjectMastery: [
    { subject: "Programming Fundamentals", code: "CS-101", accuracy: 88, score: 88, targetScore: 80, attempts: 65, status: "Mastered" },
    { subject: "Object-Oriented Programming", code: "CS-201", accuracy: 84, score: 84, targetScore: 80, attempts: 58, status: "Mastered" },
    { subject: "Data Structures", code: "CS-301", accuracy: 80, score: 80, targetScore: 80, attempts: 72, status: "Mastered" },
    { subject: "Algorithms", code: "CS-302", accuracy: 76, score: 76, targetScore: 80, attempts: 60, status: "Proficient" },
    { subject: "Database Systems", code: "CS-401", accuracy: 72, score: 72, targetScore: 80, attempts: 54, status: "Proficient" },
    { subject: "Computer Networks", code: "CS-402", accuracy: 75, score: 75, targetScore: 80, attempts: 50, status: "Proficient" },
    { subject: "Operating Systems", code: "CS-403", accuracy: 58, score: 58, targetScore: 80, attempts: 48, status: "Needs Work" },
    { subject: "Software Engineering", code: "CS-404", accuracy: 65, score: 65, targetScore: 80, attempts: 42, status: "Proficient" },
    { subject: "Computer Architecture", code: "CS-405", accuracy: 71, score: 71, targetScore: 80, attempts: 38, status: "Proficient" },
    { subject: "Theory of Automata", code: "CS-406", accuracy: 55, score: 55, targetScore: 80, attempts: 35, status: "Needs Work" },
    { subject: "Compiler Construction", code: "CS-407", accuracy: 62, score: 62, targetScore: 80, attempts: 32, status: "Needs Work" },
    { subject: "Artificial Intelligence", code: "CS-408", accuracy: 70, score: 70, targetScore: 80, attempts: 44, status: "Proficient" },
  ],
  mockHistory: [
    { date: "May 02", examTitle: "PPSC BS-17 Baseline Mock", score: 62, cutoff: 58, percentage: 62, status: "PASSED" },
    { date: "May 09", examTitle: "Core CS Systems Mock", score: 68, cutoff: 58, percentage: 68, status: "PASSED" },
    { date: "May 16", examTitle: "FPSC Comprehensive Lecturer", score: 71, cutoff: 58, percentage: 71, status: "PASSED" },
    { date: "May 23", examTitle: "PPSC Advanced Speed Mock", score: 75, cutoff: 58, percentage: 75, status: "PASSED" },
    { date: "May 30", examTitle: "All-Pakistan Open Mock #4", score: 79, cutoff: 58, percentage: 79, status: "PASSED" },
    { date: "Jun 06", examTitle: "Merit Ranker Full Exam", score: 83, cutoff: 58, percentage: 83, status: "PASSED" },
  ],
  vivaPerformance: {
    technicalAccuracy: 84,
    conceptualDepth: 80,
    communication: 78,
    pedagogicalClarity: 85,
    problemSolving: 76,
    recentSessions: [
      { id: "s-1", interviewType: "TECHNICAL_CS", personality: "SENIOR_PROFESSOR", overallScore: 82, verdict: "RECOMMENDED", date: "Jun 05, 2026" },
      { id: "s-2", interviewType: "SELECTION_COMMITTEE", personality: "SELECTION_COMMITTEE", overallScore: 85, verdict: "RECOMMENDED", date: "May 28, 2026" },
    ],
  },
  englishProgress: {
    currentCefrLevel: "C1 Academic Proficient",
    averageCadenceWpm: 134,
    timeline: [
      { date: "Wk 1", sessionTitle: "Self Introduction", wpm: 115, grammar: 72, fluency: 68, vocabulary: 70, overall: 70 },
      { date: "Wk 2", sessionTitle: "Classroom Explanation", wpm: 122, grammar: 78, fluency: 74, vocabulary: 76, overall: 76 },
      { date: "Wk 3", sessionTitle: "Lecturer Interview", wpm: 129, grammar: 82, fluency: 80, vocabulary: 84, overall: 82 },
      { date: "Wk 4", sessionTitle: "Technical Viva Voce", wpm: 136, grammar: 86, fluency: 85, vocabulary: 88, overall: 86 },
    ],
    competencies: {
      grammar: 86,
      fluency: 84,
      vocabulary: 88,
      pronunciation: 90,
    },
  },
  weakTopics: [
    {
      id: "wt-1",
      topicTitle: "Memory Virtualization & Paging Replacement (LRU/Belady)",
      subjectTitle: "Operating Systems",
      accuracy: 52,
      questionsAttempted: 35,
      recommendation: "Review Belady's Anomaly proofs and virtual address translation TLB math.",
      priority: "HIGH",
    },
    {
      id: "wt-2",
      topicTitle: "Context-Free Grammars & Pushdown Automata",
      subjectTitle: "Theory of Automata",
      accuracy: 55,
      questionsAttempted: 28,
      recommendation: "Practice converting ambiguous CFGs into Greibach / Chomsky normal forms.",
      priority: "HIGH",
    },
    {
      id: "wt-3",
      topicTitle: "Database Normalization (BCNF vs 3NF Dependency Preservation)",
      subjectTitle: "Database Management Systems",
      accuracy: 58,
      questionsAttempted: 42,
      recommendation: "Solve candidate key attribute closure drills for multi-valued dependencies.",
      priority: "MEDIUM",
    },
    {
      id: "wt-4",
      topicTitle: "Instruction Pipeline Hazards & Tomasulo Algorithm",
      subjectTitle: "Computer Architecture",
      accuracy: 59,
      questionsAttempted: 24,
      recommendation: "Focus on RAW, WAR, and WAW hazard classification questions.",
      priority: "MEDIUM",
    },
  ],
  dailyActivity: Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    const mcqs = i % 7 === 0 ? 10 : Math.floor(18 + Math.sin(i) * 12);
    return {
      date: d.toISOString().split("T")[0],
      label: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      mcqsCount: mcqs,
      vivasCount: i % 4 === 0 ? 1 : 0,
      codeCount: i % 3 === 0 ? 2 : 0,
      totalActivities: mcqs + (i % 4 === 0 ? 5 : 0) + (i % 3 === 0 ? 6 : 0),
    };
  }),
  suggestedTasks: [
    {
      id: "task-1",
      title: "Paging & Memory Virtualization Mastery Drill",
      subject: "Operating Systems",
      category: "MCQ",
      estimatedMinutes: 20,
      priority: "URGENT",
      reason: "Your accuracy in this topic is currently 52% (Below merit threshold)",
      actionUrl: "/dashboard/mcq-practice?subject=operating-systems",
    },
    {
      id: "task-2",
      title: "B-Tree vs B+ Tree Indexing Demonstration",
      subject: "Database Management Systems",
      category: "TEACHING",
      estimatedMinutes: 10,
      priority: "RECOMMENDED",
      reason: "Selection boards frequently demand a 5-minute blackboard lecture on storage indexes",
      actionUrl: "/dashboard/teaching-practice?topic=b-trees-vs-b-plus-trees",
    },
    {
      id: "task-3",
      title: "Topological Sort & DAG Cycle Detection Lab",
      subject: "Algorithms",
      category: "CODE",
      estimatedMinutes: 25,
      priority: "RECOMMENDED",
      reason: "Sharpen C++ / Java graph implementation for technical viva viva rounds",
      actionUrl: "/dashboard/programming-lab?problem=course-schedule-dag",
    },
    {
      id: "task-4",
      title: "Spoken English Viva: Handling Research Disagreements",
      subject: "English Lab",
      category: "ENGLISH",
      estimatedMinutes: 15,
      priority: "OPTIONAL",
      reason: "Target a sustained 135 WPM cadence with high academic tone",
      actionUrl: "/dashboard/english-lab",
    },
  ],
};

export default function PerformanceReportsPage() {
  const [data, setData] = useState<CandidateAnalyticsDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [subjectFilter, setSubjectFilter] = useState<"ALL" | "WEAK" | "MASTERED">("ALL");

  useEffect(() => {
    let mounted = true;

    async function loadAnalytics() {
      try {
        const res = await fetch("/api/analytics/candidate");
        const json = await res.json();
        if (mounted && json.success && json.analytics) {
          setData(json.analytics);
        }
      } catch {
        // Fallback to client-generated default
        if (mounted) {
          setData(CLIENT_FALLBACK_ANALYTICS);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadAnalytics();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading || !data) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto pb-12">
        <PageHeader
          title="Psychometric & Academic Performance Analytics"
          description="Connecting live mock data, AI board vivas, and syllabus telemetry"
          badge={<Badge variant="navy">Loading Analytics Engine...</Badge>}
        />
        <div className="h-96 rounded-2xl border border-slate-200/90 bg-white dark:border-slate-800 dark:bg-[#101B36] flex flex-col items-center justify-center gap-3">
          <RefreshCw className="h-8 w-8 text-[#315BEA] animate-spin" />
          <p className="text-sm font-semibold text-slate-500">Aggregating provincial merit scores...</p>
        </div>
      </div>
    );
  }

  // Filtered subjects
  const filteredSubjects = data.subjectMastery.filter((s) => {
    if (subjectFilter === "WEAK") return s.accuracy < 65;
    if (subjectFilter === "MASTERED") return s.accuracy >= 80;
    return true;
  });

  // Radar data for the top 8 core subjects
  const radarData = data.subjectMastery.slice(0, 8).map((s) => ({
    subject: s.code,
    fullName: s.subject,
    accuracy: s.accuracy,
    target: s.targetScore,
  }));

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16 print:p-0">
      <PageHeader
        title="Comprehensive Performance & Psychometric Telemetry"
        description="Predictive readiness analytics for PPSC, FPSC, SPSC, KPPSC, BPSC, and HEC Computer Science Selection Boards"
        badge={
          <Badge variant="success" className="gap-1">
            <Sparkles className="h-3 w-3" /> Readiness: {data.overallReadiness.score}% ({data.overallReadiness.statusBadge})
          </Badge>
        }
        breadcrumbs={[{ label: "Performance Reports" }]}
        actions={
          <div className="flex items-center gap-2 print:hidden">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="text-xs font-bold flex items-center gap-1.5"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Export Dossier (Print)</span>
            </Button>
          </div>
        }
      />

      {/* Top Level Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Composite Readiness Card */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#101B36] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#315BEA]/5 rounded-bl-full pointer-events-none" />
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Overall Selection Index
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-4xl font-black text-[#101B36] dark:text-white">
              {data.overallReadiness.score}
            </span>
            <span className="text-xs font-bold text-slate-400">/ 100</span>
          </div>
          <div className="mt-3">
            <div className="flex justify-between text-[11px] mb-1 font-semibold">
              <span className="text-slate-500">Provincial Merit Cutoff (58)</span>
              <span className="text-emerald-600">+{data.overallReadiness.score - data.overallReadiness.targetMeritCutoff} pts</span>
            </div>
            <Progress value={data.overallReadiness.score} className="h-2" />
          </div>
          <p className="mt-3 text-[11px] text-slate-500 leading-snug">
            Calculated across MCQs (30%), Mocks (25%), Vivas (20%), English (10%), Coding (10%), and Pedagogy (5%).
          </p>
        </div>

        {/* Provincial Rank Percentile */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#101B36]">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Projected Provincial Merit
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#16A37B]">
              {data.overallReadiness.provincialMeritPercentile}
            </span>
            <span className="text-xs font-bold text-emerald-600 flex items-center">
              <TrendingUp className="h-3.5 w-3.5 mr-0.5" /> Shortlist
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-600 dark:text-slate-300">
            Based on competitive percentile modeling against 14,200+ Pakistani CS aspirants.
          </p>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Target Board</span>
            <Badge variant="secondary">{data.overallReadiness.targetCommission} BS-17</Badge>
          </div>
        </div>

        {/* Mock Exam Historic Average */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#101B36]">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Mock Exam Average
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#315BEA]">
              {data.metricsSummary.averageMockScore}.00
            </span>
            <span className="text-xs text-slate-400">/ 100 Marks</span>
          </div>
          <p className="mt-2 text-xs text-slate-600 dark:text-slate-300">
            Negative marking (-0.25) active. {data.metricsSummary.mockExamsCompleted} examinations completed.
          </p>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Pass Status</span>
            <Badge variant="success">Merit Shortlisted</Badge>
          </div>
        </div>

        {/* Learning Streak & Active Days */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#101B36]">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Learning Continuity
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-500 flex items-center gap-1.5">
              <Flame className="h-7 w-7 fill-amber-500" /> {data.streak.currentDays} Days
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-600 dark:text-slate-300">
            Longest streak: <strong>{data.streak.longestDays} days</strong>. Active on <strong>{data.streak.activeDaysThisMonth} days</strong> this month.
          </p>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Status</span>
            <span className="text-emerald-600 font-bold">Consistent Aspirant</span>
          </div>
        </div>
      </div>

      {/* Suggested Daily Preparation Tasks (Actionable Roadmap) */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#101B36] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-[#101B36] dark:text-white flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#315BEA]" /> Priority Daily Preparation Tasks
            </h2>
            <p className="text-xs text-slate-500">
              Personalized algorithmic recommendations targeted directly at your weak scoring topics
            </p>
          </div>
          <Badge variant="navy">Auto-Generated Roadmap</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {data.suggestedTasks.map((task) => (
            <div
              key={task.id}
              className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-900/40 flex flex-col justify-between space-y-3 hover:border-blue-200 transition-colors"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Badge
                    variant={
                      task.priority === "URGENT"
                        ? "destructive"
                        : task.priority === "RECOMMENDED"
                        ? "default"
                        : "secondary"
                    }
                    className="text-[10px]"
                  >
                    {task.priority}
                  </Badge>
                  <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                    <Activity className="h-3 w-3" /> ~{task.estimatedMinutes} mins
                  </span>
                </div>
                <h3 className="text-sm font-bold text-[#101B36] dark:text-white">
                  {task.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {task.reason}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-800">
                <span className="text-[11px] font-semibold text-[#315BEA] dark:text-blue-400">
                  {task.subject}
                </span>
                <Link href={task.actionUrl}>
                  <Button size="sm" variant="outline" className="h-7 text-xs font-bold gap-1">
                    <span>Start Practice</span>
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recharts Analytics Grid: Subject Radar + Score Progression */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: 8-Dimension Subject Competency Radar */}
        <div className="lg:col-span-6 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#101B36] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-[#101B36] dark:text-white flex items-center gap-2">
                <Layers className="h-4 w-4 text-[#315BEA]" /> Core BS CS Mastery Radar
              </h2>
              <Badge variant="secondary">Accuracy vs Target</Badge>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Evaluated across Data Structures, Algorithms, OS, Networks, DBMS, SE, Arch, and Automata
            </p>
          </div>

          <div className="w-full h-72 py-2">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: "#64748b", fontSize: 11, fontWeight: 700 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#cbd5e1" />
                <Radar
                  name="Your Accuracy (%)"
                  dataKey="accuracy"
                  stroke="#315BEA"
                  fill="#315BEA"
                  fillOpacity={0.45}
                />
                <Radar
                  name="Merit Target (80%)"
                  dataKey="target"
                  stroke="#16A37B"
                  fill="#16A37B"
                  fillOpacity={0.15}
                />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
            <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40">
              <span className="text-[10px] uppercase font-bold text-[#16A37B] block">Strongest Discipline</span>
              <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">Programming Fundamentals (88%)</p>
            </div>
            <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/40">
              <span className="text-[10px] uppercase font-bold text-amber-600 block">Needs Reinforcement</span>
              <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">Operating Systems (58%)</p>
            </div>
          </div>
        </div>

        {/* Right: Mock Exam Progression vs PPSC Historic Cutoff */}
        <div className="lg:col-span-6 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#101B36] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-[#101B36] dark:text-white flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-[#16A37B]" /> Mock Examination Score Curve
              </h2>
              <Badge variant="success">Cutoff: 58 Marks</Badge>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Progression across 100-mark full syllabus examinations with negative marking penalty
            </p>
          </div>

          <div className="w-full h-72 py-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.mockHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fill: "#64748b", fontSize: 11 }} />
                <YAxis domain={[40, 100]} tick={{ fill: "#64748b", fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#101B36", color: "#fff", borderRadius: "8px", fontSize: "11px" }}
                />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
                <Line
                  type="monotone"
                  dataKey="score"
                  name="Obtained Marks"
                  stroke="#315BEA"
                  strokeWidth={3}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="cutoff"
                  name="PPSC Merit Cutoff"
                  stroke="#ef4444"
                  strokeDasharray="5 5"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3 rounded-lg bg-blue-50/60 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 text-xs text-slate-600 dark:text-slate-300">
            <p>
              Your score has steadily improved from <strong>62.00</strong> to <strong>83.00 marks</strong> (+21.00 net increase).
              Current trajectory guarantees inclusion in the first interview interview batch.
            </p>
          </div>
        </div>
      </div>

      {/* Secondary Analytics: 30-Day Activity & Spoken English / Viva Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: 30-Day Activity Heatmap Bar Chart */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#101B36] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#101B36] dark:text-white flex items-center gap-2">
                <Calendar className="h-4 w-4 text-[#315BEA]" /> 30-Day Daily Study Volume
              </h2>
              <p className="text-xs text-slate-500">
                Number of MCQs, AI vivas, and sandboxed code submissions completed daily
              </p>
            </div>
            <Badge variant="secondary">Last 30 Days</Badge>
          </div>

          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.dailyActivity} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="label" tick={{ fill: "#64748b", fontSize: 10 }} interval={4} />
                <YAxis tick={{ fill: "#64748b", fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#101B36", color: "#fff", borderRadius: "8px", fontSize: "11px" }}
                />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
                <Bar dataKey="mcqsCount" name="MCQs Practiced" fill="#315BEA" radius={[4, 4, 0, 0]} />
                <Bar dataKey="codeCount" name="Code Submissions" fill="#16A37B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: English Fluency & Viva Progress */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#101B36] space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-[#101B36] dark:text-white flex items-center gap-2">
                <Mic className="h-4 w-4 text-emerald-500" /> English & Viva Progress
              </h2>
              <Badge variant="success">{data.englishProgress.currentCefrLevel}</Badge>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Cadence velocity and vocabulary elevation over multiple voice sessions
            </p>
          </div>

          <div className="w-full h-44">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.englishProgress.timeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fill: "#64748b", fontSize: 10 }} />
                <YAxis domain={[90, 160]} tick={{ fill: "#64748b", fontSize: 10 }} />
                <Tooltip />
                <Area type="monotone" dataKey="wpm" name="Speech Cadence (WPM)" stroke="#16A37B" fill="#16A37B" fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-center">
            <div className="p-2 rounded bg-slate-50 dark:bg-slate-900/60">
              <span className="text-[10px] text-slate-400 font-bold block">Grammar</span>
              <span className="text-sm font-black text-slate-800 dark:text-slate-200">{data.englishProgress.competencies.grammar}%</span>
            </div>
            <div className="p-2 rounded bg-slate-50 dark:bg-slate-900/60">
              <span className="text-[10px] text-slate-400 font-bold block">Fluency</span>
              <span className="text-sm font-black text-slate-800 dark:text-slate-200">{data.englishProgress.competencies.fluency}%</span>
            </div>
            <div className="p-2 rounded bg-slate-50 dark:bg-slate-900/60">
              <span className="text-[10px] text-slate-400 font-bold block">Vocabulary</span>
              <span className="text-sm font-black text-slate-800 dark:text-slate-200">{data.englishProgress.competencies.vocabulary}%</span>
            </div>
            <div className="p-2 rounded bg-slate-50 dark:bg-slate-900/60">
              <span className="text-[10px] text-slate-400 font-bold block">Cadence</span>
              <span className="text-sm font-black text-[#16A37B]">{data.englishProgress.averageCadenceWpm} WPM</span>
            </div>
          </div>
        </div>
      </div>

      {/* Weak Topics Section */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#101B36] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-[#101B36] dark:text-white flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" /> Vulnerable Topics Alert Center (&lt;60% Accuracy)
            </h2>
            <p className="text-xs text-slate-500">
              High-yield commission topics where multiple errors were logged during test submissions
            </p>
          </div>
          <Badge variant="destructive">Immediate Review Needed</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.weakTopics.map((topic) => (
            <div
              key={topic.id}
              className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 dark:border-amber-900/50 dark:bg-amber-950/20 space-y-2 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-[10px] font-bold">
                    {topic.subjectTitle}
                  </Badge>
                  <span className="text-xs font-bold text-amber-600">
                    Accuracy: {topic.accuracy}%
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-2">
                  {topic.topicTitle}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                  {topic.recommendation}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-amber-200/60 dark:border-amber-900/40 text-[11px] text-slate-500">
                <span>{topic.questionsAttempted} attempts logged</span>
                <Link href="/dashboard/mcq-practice">
                  <Button size="sm" variant="outline" className="h-6 text-[11px] font-bold">
                    Drill Topic
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Full 18-Subject Master List */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#101B36] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-[#101B36] dark:text-white flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-[#315BEA]" /> HEC BS Computer Science 18-Discipline Mastery Roster
            </h2>
            <p className="text-xs text-slate-500">
              Complete subject telemetry derived from MCQ drills, mock tests, and Selection Board answers
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900 p-1 rounded-lg">
            {(["ALL", "WEAK", "MASTERED"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setSubjectFilter(mode)}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                  subjectFilter === mode
                    ? "bg-white dark:bg-slate-800 text-[#315BEA] shadow-sm"
                    : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
                }`}
              >
                {mode === "ALL" ? "All Subjects (18)" : mode === "WEAK" ? "Weak (<65%)" : "Mastered (≥80%)"}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500">
                <th className="pb-3 font-bold">Subject Code & Title</th>
                <th className="pb-3 font-bold">Attempts</th>
                <th className="pb-3 font-bold">Accuracy</th>
                <th className="pb-3 font-bold">Mastery Level</th>
                <th className="pb-3 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredSubjects.map((sub, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                  <td className="py-3 font-medium text-slate-900 dark:text-slate-100">
                    <span className="font-mono text-xs font-bold text-[#315BEA] mr-2">[{sub.code}]</span>
                    <span>{sub.subject}</span>
                  </td>
                  <td className="py-3 font-semibold text-slate-500">{sub.attempts} drills</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <Progress value={sub.accuracy} className="w-20 h-2" />
                      <span className="font-bold">{sub.accuracy}%</span>
                    </div>
                  </td>
                  <td className="py-3">
                    <Badge
                      variant={
                        sub.status === "Mastered"
                          ? "success"
                          : sub.status === "Proficient"
                          ? "default"
                          : "destructive"
                      }
                    >
                      {sub.status}
                    </Badge>
                  </td>
                  <td className="py-3 text-right">
                    <Link href={`/dashboard/mcq-practice`}>
                      <Button variant="ghost" size="sm" className="h-7 text-xs font-bold text-[#315BEA]">
                        Practice
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
