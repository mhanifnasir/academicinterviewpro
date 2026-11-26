"use client";

import React, { useState, useEffect } from "react";
import {
  FolderDown,
  FileText,
  Download,
  Search,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { CardSkeleton } from "@/components/shared/loading-skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

interface StudyResourceItem {
  id: string;
  title: string;
  category: "PAST_PAPER" | "CURRICULUM" | "FORMULA_SHEET" | "VIVA_HANDBOOK" | string;
  commission: string;
  year: string;
  fileUrl: string;
  fileSize: string;
  format: string;
  description: string;
  downloads?: number;
}

export default function StudyResourcesPage() {
  const [resources, setResources] = useState<StudyResourceItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedCommission, setSelectedCommission] = useState<string>("ALL");
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());

  // Load resources from API
  useEffect(() => {
    let mounted = true;
    async function fetchResources() {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (selectedCategory !== "ALL") params.append("category", selectedCategory);
        if (selectedCommission !== "ALL") params.append("commission", selectedCommission);
        if (searchQuery.trim()) params.append("search", searchQuery.trim());

        const res = await fetch(`/api/study-materials?${params.toString()}`);
        const data = await res.json();
        if (mounted && data.success && Array.isArray(data.materials)) {
          setResources(data.materials);
        }
      } catch {
        // Continue with empty or fallback
      } finally {
        if (mounted) setLoading(false);
      }
    }

    const timer = setTimeout(fetchResources, 250);
    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, [selectedCategory, selectedCommission, searchQuery]);

  // Load candidate bookmarks
  useEffect(() => {
    let mounted = true;
    async function loadBookmarks() {
      try {
        const res = await fetch("/api/bookmarks");
        const json = await res.json();
        if (mounted && json.success && Array.isArray(json.data)) {
          const ids = new Set<string>();
          json.data.forEach((b: { studyMaterialId?: string }) => {
            if (b.studyMaterialId) ids.add(b.studyMaterialId);
          });
          setBookmarkedIds(ids);
        }
      } catch {
        // Fallback
      }
    }
    loadBookmarks();
    return () => {
      mounted = false;
    };
  }, []);

  // Handle Download PDF Action
  const handleDownload = (item: StudyResourceItem) => {
    setDownloadingId(item.id);

    // Create virtual downloadable document
    setTimeout(() => {
      const dummyContent = `# ${item.title}\n\nCategory: ${item.category}\nCommission: ${item.commission}\nYear: ${item.year}\n\n${item.description}\n\nAcademic Interview Pro - Verified Study Materials & Past Papers\nWebsite: https://academicinterviewpro.pk\nVerified Answer Key & Curriculum Outline for BPS-17 Computer Science Lecturer Aspirants.`;
      const blob = new Blob([dummyContent], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${item.title.replace(/[^a-zA-Z0-9-_]/g, "_")}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setDownloadingId(null);
      setDownloadSuccess(item.title);
      setTimeout(() => setDownloadSuccess(null), 3000);
    }, 600);
  };

  // Toggle Bookmark
  const handleToggleBookmark = async (item: StudyResourceItem) => {
    const isBookmarked = bookmarkedIds.has(item.id);
    const newSet = new Set(bookmarkedIds);

    if (isBookmarked) {
      newSet.delete(item.id);
      setBookmarkedIds(newSet);
      try {
        await fetch(`/api/bookmarks?studyMaterialId=${item.id}`, { method: "DELETE" });
      } catch {
        // fallback
      }
    } else {
      newSet.add(item.id);
      setBookmarkedIds(newSet);
      try {
        await fetch("/api/bookmarks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ studyMaterialId: item.id, notes: item.title }),
        });
      } catch {
        // fallback
      }
    }
  };

  const categoryTabs = [
    { label: "All Materials", value: "ALL" },
    { label: "Past Papers", value: "PAST_PAPER" },
    { label: "Curriculum Outlines", value: "CURRICULUM" },
    { label: "Formula Sheets", value: "FORMULA_SHEET" },
    { label: "Viva Trap Books", value: "VIVA_HANDBOOK" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Study Resources & Past Papers"
        description="Authentic Pakistani commission past papers, HEC curriculum outlines, formula sheets, and viva preparation handbooks"
        badge={<Badge variant="navy">Verified Materials</Badge>}
        breadcrumbs={[{ label: "Study Resources & Past Papers" }]}
      />

      {downloadSuccess && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <span>Downloaded successfully: {downloadSuccess}</span>
        </div>
      )}

      {/* Category Tabs & Filter Bar */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          {categoryTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setSelectedCategory(tab.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedCategory === tab.value
                  ? "bg-[#315BEA] text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search past papers, formula sheets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 text-xs"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-semibold text-slate-500 shrink-0">Commission:</span>
            <Select
              value={selectedCommission}
              onChange={(e) => setSelectedCommission(e.target.value)}
              className="text-xs w-full sm:w-44"
            >
              <option value="ALL">All Commissions</option>
              <option value="PPSC">PPSC Punjab</option>
              <option value="FPSC">FPSC Federal</option>
              <option value="SPSC">SPSC Sindh</option>
              <option value="KPPSC">KPPSC Khyber</option>
              <option value="HEC">HEC National</option>
            </Select>
          </div>
        </div>
      </div>

      {/* Resource Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CardSkeleton lines={4} />
          <CardSkeleton lines={4} />
          <CardSkeleton lines={4} />
        </div>
      ) : resources.length === 0 ? (
        <EmptyState
          icon={FolderDown}
          title="No study resources found"
          description="Try clearing your search query or switching your commission filter to explore all available past papers."
          action={{
            label: "Reset Filters",
            onClick: () => {
              setSelectedCategory("ALL");
              setSelectedCommission("ALL");
              setSearchQuery("");
            },
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((item) => {
            const isBookmarked = bookmarkedIds.has(item.id);
            const isDownloading = downloadingId === item.id;

            return (
              <div
                key={item.id}
                className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs hover:shadow-md transition-all dark:border-slate-800 dark:bg-[#101B36] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#315BEA] dark:bg-blue-950/60 dark:text-blue-400">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleToggleBookmark(item)}
                        title={isBookmarked ? "Remove Bookmark" : "Save Bookmark"}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          isBookmarked
                            ? "bg-amber-50 text-amber-500 border-amber-200 dark:bg-amber-950/40 dark:border-amber-900"
                            : "text-slate-400 hover:text-slate-600 border-slate-200 dark:border-slate-700"
                        }`}
                      >
                        {isBookmarked ? (
                          <BookmarkCheck className="h-4 w-4 fill-amber-400 text-amber-500" />
                        ) : (
                          <Bookmark className="h-4 w-4" />
                        )}
                      </button>
                      <Badge variant="ppsc">{item.commission}</Badge>
                      <span className="text-[10px] text-slate-400 font-mono">{item.year}</span>
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-[#101B36] dark:text-white leading-snug">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
                    {item.description}
                  </p>

                  <div className="mt-4 flex items-center justify-between text-[11px] text-slate-500 font-semibold border-t border-slate-100 pt-3 dark:border-slate-800">
                    <span>{item.format}</span>
                    <span>{item.fileSize}</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#16A37B]">Verified Answer Key</span>
                  <Button
                    size="sm"
                    disabled={isDownloading}
                    onClick={() => handleDownload(item)}
                    className="bg-[#315BEA] hover:bg-[#2348C9] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                  >
                    {isDownloading ? (
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Download className="h-3.5 w-3.5" />
                    )}
                    <span>{isDownloading ? "Downloading..." : "Download PDF"}</span>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
