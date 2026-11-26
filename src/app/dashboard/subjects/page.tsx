"use client";

import React, { useState, useEffect } from "react";
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
  BookOpen,
  ArrowRight,
  Filter,
  CheckCircle,
  Clock,
  RefreshCw,
  Search,
  ExternalLink,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { CardSkeleton } from "@/components/shared/loading-skeleton";
import { HEC_SUBJECTS_2025, HECSubject } from "@/data/hec-curriculum-2025";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Modal } from "@/components/ui/modal";

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
  BookOpen,
};

export default function SubjectLibraryPage() {
  const [subjects, setSubjects] = useState<HECSubject[]>(HEC_SUBJECTS_2025);
  const [selectedFilter, setSelectedFilter] = useState<
    "All" | "CORE_CS" | "SUPPLEMENTARY" | "CRITICAL" | "HIGH"
  >("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSubject, setActiveSubject] = useState<HECSubject | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadDbSubjects() {
      try {
        setLoading(true);
        const res = await fetch("/api/subjects");
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setSubjects(json.data);
        }
      } catch {
        // Fallback already set to HEC_SUBJECTS_2025
      } finally {
        setLoading(false);
      }
    }
    loadDbSubjects();
  }, []);

  const filteredSubjects = subjects.filter((sub) => {
    if (selectedFilter === "CORE_CS" && sub.category !== "CORE_CS") return false;
    if (selectedFilter === "SUPPLEMENTARY" && sub.category !== "SUPPLEMENTARY") return false;
    if (selectedFilter === "CRITICAL" && sub.frequency !== "CRITICAL") return false;
    if (selectedFilter === "HIGH" && sub.frequency !== "HIGH") return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        sub.title.toLowerCase().includes(q) ||
        sub.code.toLowerCase().includes(q) ||
        sub.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const coreCount = subjects.filter((s) => s.category === "CORE_CS").length;
  const suppCount = subjects.filter((s) => s.category === "SUPPLEMENTARY").length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="CS Subject Library"
        description="Official syllabus modules, topic breakdowns, and exam practice banks aligned with the HEC Pakistan Revised Curriculum 2025"
        badge={
          <Badge variant="navy">
            {subjects.length} Disciplines ({coreCount} Core CS • {suppCount} Supplementary)
          </Badge>
        }
        breadcrumbs={[{ label: "CS Subject Library" }]}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: "All", label: "All Disciplines" },
              { id: "CORE_CS", label: "Core CS (18)" },
              { id: "SUPPLEMENTARY", label: "Supplementary (3)" },
              { id: "CRITICAL", label: "Critical Yield" },
              { id: "HIGH", label: "High Yield" },
            ].map((filter) => (
              <button
                key={filter.id}
                onClick={() => setSelectedFilter(filter.id as typeof selectedFilter)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  selectedFilter === filter.id
                    ? "bg-[#101B36] text-white dark:bg-[#315BEA]"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200 dark:border-slate-800 dark:bg-[#101B36] dark:text-slate-300"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        }
      />

      {/* Search Bar */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-[#101B36]">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search disciplines by name, code, or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#315BEA]"
          />
        </div>
      </div>

      {/* Grid of Subject Cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CardSkeleton lines={4} />
          <CardSkeleton lines={4} />
          <CardSkeleton lines={4} />
        </div>
      ) : filteredSubjects.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No disciplines found"
          description="Try adjusting your keyword search or changing the yield filter above to discover all HEC disciplines."
          action={{
            label: "Reset Search & Filters",
            onClick: () => {
              setSelectedFilter("All");
              setSearchQuery("");
            },
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSubjects.map((subject, idx) => {
            const Icon = iconMap[subject.iconName] || BookOpen;
            const simulatedProgress = [82, 75, 88, 70, 65, 78, 60, 68, 72, 58, 64, 52, 66, 74, 59, 71, 63, 67, 85, 76, 80][idx % 21];

            return (
              <div
                key={subject.slug}
                className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-[#101B36] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-[#315BEA] dark:bg-blue-950/60 dark:text-blue-400">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Badge
                        variant={
                          subject.frequency === "CRITICAL"
                            ? "destructive"
                            : subject.frequency === "HIGH"
                            ? "default"
                            : "secondary"
                        }
                        className="text-[10px]"
                      >
                        {subject.weightage}
                      </Badge>
                      <span className="text-[10px] font-bold text-slate-500 uppercase">{subject.code}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    <Badge
                      variant={subject.category === "CORE_CS" ? "default" : "secondary"}
                      className="text-[9px] px-1.5 py-0.5"
                    >
                      {subject.category === "CORE_CS" ? "Core CS" : "Supplementary"}
                    </Badge>
                    <span className="text-[11px] font-medium text-slate-400">
                      {subject.topics.length} HEC Subtopics
                    </span>
                  </div>

                  <h3 className="mt-2 text-base font-bold text-[#101B36] dark:text-white leading-snug">
                    {subject.title}
                  </h3>
                  <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                    {subject.description}
                  </p>

                  {/* Progress bar */}
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-slate-500">Syllabus Coverage</span>
                      <span className="font-bold text-[#101B36] dark:text-white">
                        {simulatedProgress}%
                      </span>
                    </div>
                    <Progress value={simulatedProgress} className="h-2" />
                  </div>

                  {/* Topics preview */}
                  <div className="mt-3.5 space-y-1">
                    {subject.topics.slice(0, 3).map((t) => (
                      <div
                        key={t.slug}
                        className="text-[11px] text-slate-600 dark:text-slate-400 flex items-center gap-1.5 truncate"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-[#315BEA]" />
                        <span className="truncate">{t.name}</span>
                      </div>
                    ))}
                    {subject.topics.length > 3 && (
                      <div className="text-[10px] text-slate-400 font-semibold pl-3">
                        +{subject.topics.length - 3} more curriculum subtopics
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-6 flex items-center gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveSubject(subject)}
                    className="w-full text-xs font-bold"
                  >
                    View Syllabus
                  </Button>
                  <Link
                    href={`/dashboard/mcq-practice?subject=${subject.slug}`}
                    className="w-full"
                  >
                    <Button
                      size="sm"
                      className="w-full bg-[#315BEA] hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-1"
                    >
                      Practice <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Interactive Syllabus Details Modal */}
      {activeSubject && (
        <Modal
          isOpen={Boolean(activeSubject)}
          onClose={() => setActiveSubject(null)}
          title={`${activeSubject.title} (${activeSubject.code})`}
          description={`HEC Pakistan Revised Curriculum 2025 • Commission Weightage: ${activeSubject.weightage}`}
          className="max-w-2xl"
        >
          <div className="space-y-5 text-xs max-h-[75vh] overflow-y-auto pr-1">
            {/* Description */}
            <div className="p-3.5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300">
              <span className="font-bold text-[#101B36] dark:text-white block mb-1">Academic Overview:</span>
              {activeSubject.description}
            </div>

            {/* Subtopics List */}
            <div>
              <div className="font-bold text-sm text-[#101B36] dark:text-white mb-3 flex items-center justify-between">
                <span>Curriculum Sub-modules ({activeSubject.topics.length})</span>
                <Badge variant="ppsc" className="text-[10px]">
                  Yield: {activeSubject.frequency}
                </Badge>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden">
                {activeSubject.topics.map((t, tIdx) => (
                  <div key={t.slug} className="p-3 bg-white dark:bg-slate-900 hover:bg-slate-50/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-xs text-[#101B36] dark:text-white flex items-center gap-2">
                        <span className="text-slate-400 font-mono text-[11px]">{tIdx + 1}.</span>
                        {t.name}
                      </div>
                      <Badge
                        variant={
                          t.difficulty === "EXPERT"
                            ? "destructive"
                            : t.difficulty === "HARD"
                            ? "destructive"
                            : t.difficulty === "MEDIUM"
                            ? "default"
                            : "secondary"
                        }
                        className="text-[9px]"
                      >
                        {t.difficulty}
                      </Badge>
                    </div>
                    {t.description && (
                      <p className="text-[11px] text-slate-500 mt-1 pl-4 leading-relaxed">
                        {t.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Textbooks */}
            {activeSubject.recommendedBooks && activeSubject.recommendedBooks.length > 0 && (
              <div>
                <span className="font-bold text-xs text-[#101B36] dark:text-white block mb-2">
                  HEC Recommended Textbooks:
                </span>
                <div className="space-y-1.5">
                  {activeSubject.recommendedBooks.map((book, bIdx) => (
                    <div
                      key={bIdx}
                      className="p-2 bg-slate-50 dark:bg-slate-900 rounded-lg text-slate-600 dark:text-slate-400 flex items-center gap-2 text-[11px]"
                    >
                      <BookOpen className="h-3.5 w-3.5 text-[#315BEA] shrink-0" />
                      <span>{book}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Direct Action Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <Link
                href={`/dashboard/interview-prep?subject=${activeSubject.slug}`}
                className="w-full sm:w-auto"
              >
                <Button variant="outline" size="sm" className="w-full text-xs font-bold">
                  Practice AI Viva Voce
                </Button>
              </Link>

              <Link
                href={`/dashboard/mcq-practice?subject=${activeSubject.slug}`}
                className="w-full sm:w-auto"
              >
                <Button
                  size="sm"
                  className="w-full bg-[#315BEA] hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  Start Topic MCQs <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
