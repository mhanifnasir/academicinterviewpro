"use client";

import React, { useState, useEffect } from "react";
import {
  HelpCircle,
  Plus,
  Search,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  Sparkles,
  Upload,
  Filter,
  RefreshCw,
  BookOpen,
  AlertCircle,
  Check,
  X,
  FileSpreadsheet,
  Download,
  Info,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Modal } from "@/components/ui/modal";
import { HEC_SUBJECTS_2025, INITIAL_QUESTION_BANK, HECQuestion } from "@/data/hec-curriculum-2025";

interface AdminQuestionItem {
  id: string;
  statement: string;
  type: "MCQ" | "SHORT" | "LONG" | "CONCEPTUAL" | "SCENARIO";
  difficulty: "EASY" | "MEDIUM" | "HARD" | "EXPERT";
  origin: "VERIFIED" | "AI_GENERATED";
  status: "DRAFT" | "PENDING_REVIEW" | "APPROVED" | "REJECTED";
  subjectId?: string;
  subjectSlug?: string;
  topicId?: string;
  topicSlug?: string;
  subject?: { id: string; title: string; code: string; slug: string };
  topic?: { id: string; name: string; slug: string };
  options?: { optionKey: "A" | "B" | "C" | "D"; statement: string; isCorrect: boolean }[];
  answer?: { detailedExplanation: string; keyPoints?: string[]; referenceCitation?: string };
  sources?: { sourceName: string; examYear?: number; postTitle?: string; bookTitle?: string }[];
  detailedExplanation?: string;
  referenceCitation?: string;
}

export default function AdminQuestionsPage() {
  const [questions, setQuestions] = useState<AdminQuestionItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string>("ALL");
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("ALL");
  const [selectedOrigin, setSelectedOrigin] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [showCsvModal, setShowCsvModal] = useState(false);
  const [reviewModalQuestion, setReviewModalQuestion] = useState<{
    question: AdminQuestionItem;
    action: "APPROVE" | "REJECT";
  } | null>(null);
  const [reviewComments, setReviewComments] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Submitting states
  const [actionLoading, setActionLoading] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // AI Generator Form
  const [aiForm, setAiForm] = useState({
    subjectSlug: "data-structures",
    topicSlug: "balanced-trees",
    difficulty: "HARD" as "EASY" | "MEDIUM" | "HARD" | "EXPERT",
    type: "MCQ" as "MCQ" | "SHORT" | "LONG" | "CONCEPTUAL" | "SCENARIO",
    quantity: 3,
    customPrompt: "",
  });

  // Manual Add Question Form
  const [manualForm, setManualForm] = useState({
    subjectSlug: "operating-systems",
    topicSlug: "virtual-memory",
    statement: "",
    type: "MCQ" as "MCQ" | "SHORT" | "LONG" | "CONCEPTUAL" | "SCENARIO",
    difficulty: "MEDIUM" as "EASY" | "MEDIUM" | "HARD" | "EXPERT",
    origin: "VERIFIED" as "VERIFIED" | "AI_GENERATED",
    status: "APPROVED" as "DRAFT" | "PENDING_REVIEW" | "APPROVED" | "REJECTED",
    optA: "",
    optB: "",
    optC: "",
    optD: "",
    correctOpt: "A" as "A" | "B" | "C" | "D",
    detailedExplanation: "",
    referenceCitation: "",
    sourceName: "PPSC CS Lecturer Screening Past Papers",
    examYear: 2026,
  });

  // CSV Import State
  const [csvText, setCsvText] = useState("");
  const [csvDefaultStatus, setCsvDefaultStatus] = useState<"PENDING_REVIEW" | "APPROVED">("PENDING_REVIEW");

  // Load questions
  const fetchQuestions = async (isManual = false) => {
    if (isManual) setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedSubject !== "ALL") params.append("subjectSlug", selectedSubject);
      if (selectedType !== "ALL") params.append("type", selectedType);
      if (selectedDifficulty !== "ALL") params.append("difficulty", selectedDifficulty);
      if (selectedOrigin !== "ALL") params.append("origin", selectedOrigin);
      if (selectedStatus !== "ALL") params.append("status", selectedStatus);
      if (searchQuery.trim()) params.append("search", searchQuery.trim());

      const res = await fetch(`/api/questions?${params.toString()}`);
      const json = await res.json();

      if (json.success && Array.isArray(json.data)) {
        setQuestions(json.data);
      } else {
        // Fallback to in-memory question bank
        const list: AdminQuestionItem[] = INITIAL_QUESTION_BANK.map((q) => {
          const sub = HEC_SUBJECTS_2025.find((s) => s.slug === q.subjectSlug);
          return {
            ...q,
            subject: sub ? { id: `subj-${sub.slug}`, title: sub.title, code: sub.code, slug: sub.slug } : undefined,
            answer: {
              detailedExplanation: q.detailedExplanation,
              keyPoints: q.keyPoints,
              referenceCitation: q.referenceCitation,
            },
            sources: q.source ? [q.source] : [],
          };
        });
        setQuestions(list);
      }
    } catch {
      const list: AdminQuestionItem[] = INITIAL_QUESTION_BANK.map((q) => {
        const sub = HEC_SUBJECTS_2025.find((s) => s.slug === q.subjectSlug);
        return {
          ...q,
          subject: sub ? { id: `subj-${sub.slug}`, title: sub.title, code: sub.code, slug: sub.slug } : undefined,
          answer: {
            detailedExplanation: q.detailedExplanation,
            keyPoints: q.keyPoints,
            referenceCitation: q.referenceCitation,
          },
          sources: q.source ? [q.source] : [],
        };
      });
      setQuestions(list);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    async function loadQuestions() {
      try {
        const params = new URLSearchParams();
        if (selectedSubject !== "ALL") params.append("subjectSlug", selectedSubject);
        if (selectedType !== "ALL") params.append("type", selectedType);
        if (selectedDifficulty !== "ALL") params.append("difficulty", selectedDifficulty);
        if (selectedOrigin !== "ALL") params.append("origin", selectedOrigin);
        if (selectedStatus !== "ALL") params.append("status", selectedStatus);
        if (searchQuery.trim()) params.append("search", searchQuery.trim());

        const res = await fetch(`/api/questions?${params.toString()}`);
        const json = await res.json();

        if (isMounted) {
          if (json.success && Array.isArray(json.data)) {
            setQuestions(json.data);
          } else {
            const list: AdminQuestionItem[] = INITIAL_QUESTION_BANK.map((q) => {
              const sub = HEC_SUBJECTS_2025.find((s) => s.slug === q.subjectSlug);
              return {
                ...q,
                subject: sub ? { id: `subj-${sub.slug}`, title: sub.title, code: sub.code, slug: sub.slug } : undefined,
                answer: {
                  detailedExplanation: q.detailedExplanation,
                  keyPoints: q.keyPoints,
                  referenceCitation: q.referenceCitation,
                },
                sources: q.source ? [q.source] : [],
              };
            });
            setQuestions(list);
          }
        }
      } catch {
        if (isMounted) {
          const list: AdminQuestionItem[] = INITIAL_QUESTION_BANK.map((q) => {
            const sub = HEC_SUBJECTS_2025.find((s) => s.slug === q.subjectSlug);
            return {
              ...q,
              subject: sub ? { id: `subj-${sub.slug}`, title: sub.title, code: sub.code, slug: sub.slug } : undefined,
              answer: {
                detailedExplanation: q.detailedExplanation,
                keyPoints: q.keyPoints,
                referenceCitation: q.referenceCitation,
              },
              sources: q.source ? [q.source] : [],
            };
          });
          setQuestions(list);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    loadQuestions();
    return () => {
      isMounted = false;
    };
  }, [selectedSubject, selectedType, selectedDifficulty, selectedOrigin, selectedStatus]);

  // Review Workflow: Approve or Reject
  const handleReviewSubmit = async () => {
    if (!reviewModalQuestion) return;
    setActionLoading(true);

    const newStatus = reviewModalQuestion.action === "APPROVE" ? "APPROVED" : "REJECTED";
    const qId = reviewModalQuestion.question.id;

    try {
      const res = await fetch(`/api/questions/${qId}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          comments: reviewComments,
        }),
      });
      const json = await res.json();

      if (json.success) {
        setFeedbackMessage({
          type: "success",
          text: `Question #${qId.substring(0, 8)} marked as ${newStatus}`,
        });
        setQuestions((prev) =>
          prev.map((q) => (q.id === qId ? { ...q, status: newStatus as AdminQuestionItem["status"] } : q))
        );
      }
    } catch {
      setQuestions((prev) =>
        prev.map((q) => (q.id === qId ? { ...q, status: newStatus as AdminQuestionItem["status"] } : q))
      );
      setFeedbackMessage({
        type: "success",
        text: `Question marked as ${newStatus} (mock mode)`,
      });
    } finally {
      setActionLoading(false);
      setReviewModalQuestion(null);
      setReviewComments("");
    }
  };

  // AI Question Generation
  const handleGenerateAi = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    setFeedbackMessage(null);

    try {
      const res = await fetch("/api/questions/generate-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(aiForm),
      });
      const json = await res.json();

      if (json.success && Array.isArray(json.data)) {
        setFeedbackMessage({
          type: "success",
          text: `${json.data.length} academic questions generated! Assigned to 'PENDING_REVIEW' for faculty verification.`,
        });
        setShowAiModal(false);
        await fetchQuestions();
      } else {
        setFeedbackMessage({
          type: "error",
          text: json.error || "Failed to generate questions",
        });
      }
    } catch {
      setFeedbackMessage({
        type: "error",
        text: "Error contacting AI generation engine",
      });
    } finally {
      setActionLoading(false);
    }
  };

  // CSV Import Submit
  const handleCsvImport = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);

    try {
      const res = await fetch("/api/questions/import-csv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          csvContent: csvText,
          defaultStatus: csvDefaultStatus,
        }),
      });
      const json = await res.json();

      if (json.success) {
        setFeedbackMessage({
          type: "success",
          text: `Successfully imported ${json.importedCount} questions from CSV into status: ${csvDefaultStatus}`,
        });
        setShowCsvModal(false);
        setCsvText("");
        await fetchQuestions();
      } else {
        setFeedbackMessage({
          type: "error",
          text: json.error || "CSV parsing error",
        });
      }
    } catch {
      setFeedbackMessage({
        type: "error",
        text: "Error executing CSV import",
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Manual Add Submit
  const handleManualAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);

    const targetSub = HEC_SUBJECTS_2025.find((s) => s.slug === manualForm.subjectSlug) || HEC_SUBJECTS_2025[0];
    const optionsData =
      manualForm.type === "MCQ"
        ? [
            { optionKey: "A", statement: manualForm.optA, isCorrect: manualForm.correctOpt === "A" },
            { optionKey: "B", statement: manualForm.optB, isCorrect: manualForm.correctOpt === "B" },
            { optionKey: "C", statement: manualForm.optC, isCorrect: manualForm.correctOpt === "C" },
            { optionKey: "D", statement: manualForm.optD, isCorrect: manualForm.correctOpt === "D" },
          ]
        : [];

    const payload = {
      subjectId: `subj-${manualForm.subjectSlug}`,
      statement: manualForm.statement,
      type: manualForm.type,
      difficulty: manualForm.difficulty,
      origin: manualForm.origin,
      status: manualForm.status,
      options: optionsData,
      detailedExplanation: manualForm.detailedExplanation,
      referenceCitation: manualForm.referenceCitation,
      sourceName: manualForm.sourceName,
      examYear: Number(manualForm.examYear) || 2026,
    };

    try {
      const res = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();

      if (json.success) {
        setFeedbackMessage({
          type: "success",
          text: "Verified question added to question bank",
        });
        setShowAddModal(false);
        await fetchQuestions();
      }
    } catch {
      setQuestions((prev) => [
        {
          id: `local-q-${Date.now()}`,
          ...payload,
          subject: { id: `subj-${targetSub.slug}`, title: targetSub.title, code: targetSub.code, slug: targetSub.slug },
          options: optionsData.map((o) => ({ ...o, optionKey: o.optionKey as "A" | "B" | "C" | "D" })),
          answer: { detailedExplanation: manualForm.detailedExplanation, referenceCitation: manualForm.referenceCitation },
          sources: [{ sourceName: manualForm.sourceName, examYear: manualForm.examYear }],
        },
        ...prev,
      ]);
      setShowAddModal(false);
    } finally {
      setActionLoading(false);
    }
  };

  // Delete Question
  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await fetch(`/api/questions/${deleteId}`, { method: "DELETE" });
      setQuestions((prev) => prev.filter((q) => q.id !== deleteId));
      setDeleteId(null);
    } catch {
      setQuestions((prev) => prev.filter((q) => q.id !== deleteId));
      setDeleteId(null);
    }
  };

  const sampleCsvTemplate = `statement,type,difficulty,optionA,optionB,optionC,optionD,correctOption,explanation,referenceCitation,sourceName,subjectCode
"What is the average case search complexity of a balanced AVL tree?",MCQ,MEDIUM,"O(1)","O(log n)","O(n)","O(n log n)",B,"AVL trees maintain strict balance factor |hL - hR| <= 1 guaranteeing O(log n) height.","CLRS 4th Ed, Ch. 13","PPSC CS 2022",CS-201
"In Operating Systems, Belady's Anomaly occurs in which page replacement algorithm?",MCQ,MEDIUM,"LRU","FIFO","OPT","LFU",B,"FIFO lacks the stack inclusion property, leading to more page faults with more frames.","Silberschatz OS Concepts, Ch. 10","FPSC CS 2021",CS-303`;

  // Selected AI subject helper
  const activeAiSubject = HEC_SUBJECTS_2025.find((s) => s.slug === aiForm.subjectSlug) || HEC_SUBJECTS_2025[0];

  const pendingCount = questions.filter((q) => q.status === "PENDING_REVIEW").length;
  const approvedCount = questions.filter((q) => q.status === "APPROVED").length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Question Bank & Review Hub"
        description="Comprehensive repository of verified Pakistani commission past paper items and faculty-moderated questions"
        badge={
          <Badge variant="navy">
            {questions.length} Items ({pendingCount} Pending Review • {approvedCount} Approved)
          </Badge>
        }
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              onClick={() => setShowCsvModal(true)}
              variant="outline"
              size="sm"
              className="text-xs font-bold flex items-center gap-1.5 border-slate-300 dark:border-slate-700"
            >
              <Upload className="h-3.5 w-3.5 text-blue-600" /> Import CSV
            </Button>
            <Button
              onClick={() => setShowAiModal(true)}
              size="sm"
              className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center gap-1.5"
            >
              <Sparkles className="h-3.5 w-3.5" /> AI Question Generator
            </Button>
            <Button
              onClick={() => setShowAddModal(true)}
              size="sm"
              className="bg-[#101B36] hover:bg-[#1A284D] text-white text-xs font-bold flex items-center gap-1.5 dark:bg-emerald-600"
            >
              <Plus className="h-4 w-4" /> Add Verified Question
            </Button>
          </div>
        }
      />

      {feedbackMessage && (
        <div
          className={`p-3.5 rounded-xl border text-xs flex items-center justify-between ${
            feedbackMessage.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/60 dark:border-emerald-800 dark:text-emerald-300"
              : "bg-rose-50 border-rose-200 text-rose-800 dark:bg-rose-950/60 dark:border-rose-800 dark:text-rose-300"
          }`}
        >
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4" />
            <span>{feedbackMessage.text}</span>
          </div>
          <button onClick={() => setFeedbackMessage(null)} className="text-slate-400 hover:text-slate-600">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Comprehensive Filter Toolbar */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#101B36] space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search statement text, options, citations, or past paper tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchQuestions()}
            className="pl-9 text-xs"
          />
        </div>

        {/* Multi-dropdown Filter Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
          {/* Subject Filter */}
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Discipline</label>
            <Select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} className="text-xs">
              <option value="ALL">All 21 Disciplines</option>
              <optgroup label="Core CS Disciplines">
                {HEC_SUBJECTS_2025.filter((s) => s.category === "CORE_CS").map((s) => (
                  <option key={s.slug} value={s.slug}>
                    {s.code}: {s.title}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Supplementary Disciplines">
                {HEC_SUBJECTS_2025.filter((s) => s.category === "SUPPLEMENTARY").map((s) => (
                  <option key={s.slug} value={s.slug}>
                    {s.code}: {s.title}
                  </option>
                ))}
              </optgroup>
            </Select>
          </div>

          {/* Question Type Filter */}
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Question Type</label>
            <Select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} className="text-xs">
              <option value="ALL">All Types</option>
              <option value="MCQ">Multiple Choice (MCQ)</option>
              <option value="SHORT">Short Question</option>
              <option value="LONG">Long Question</option>
              <option value="CONCEPTUAL">Conceptual Question</option>
              <option value="SCENARIO">Scenario-Based</option>
            </Select>
          </div>

          {/* Difficulty Classification */}
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Difficulty</label>
            <Select value={selectedDifficulty} onChange={(e) => setSelectedDifficulty(e.target.value)} className="text-xs">
              <option value="ALL">All Difficulties</option>
              <option value="EASY">Easy</option>
              <option value="MEDIUM">Medium</option>
              <option value="HARD">Hard</option>
              <option value="EXPERT">Expert</option>
            </Select>
          </div>

          {/* Question Origin */}
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Origin</label>
            <Select value={selectedOrigin} onChange={(e) => setSelectedOrigin(e.target.value)} className="text-xs">
              <option value="ALL">All Origins</option>
              <option value="VERIFIED">Verified (Faculty / Past Paper)</option>
              <option value="AI_GENERATED">AI-Generated</option>
            </Select>
          </div>

          {/* Question Review Status */}
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Review Status</label>
            <Select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="text-xs">
              <option value="ALL">All Statuses</option>
              <option value="PENDING_REVIEW">Pending Review</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
              <option value="DRAFT">Draft</option>
            </Select>
          </div>
        </div>
      </div>

      {/* Questions Listing */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#101B36] space-y-4">
        {loading ? (
          <div className="py-16 text-center text-slate-400 text-xs">
            <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-[#315BEA]" />
            Loading academic question bank...
          </div>
        ) : questions.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-xs space-y-2">
            <p>No questions found matching your filter criteria.</p>
            <Button
              onClick={() => {
                setSelectedSubject("ALL");
                setSelectedType("ALL");
                setSelectedDifficulty("ALL");
                setSelectedOrigin("ALL");
                setSelectedStatus("ALL");
                setSearchQuery("");
              }}
              variant="outline"
              size="sm"
              className="text-xs"
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {questions.map((q) => {
              const isAi = q.origin === "AI_GENERATED";
              const isPending = q.status === "PENDING_REVIEW";
              const isRejected = q.status === "REJECTED";
              const isApproved = q.status === "APPROVED";

              return (
                <div key={q.id} className="py-5 space-y-3">
                  {/* Meta bar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono font-bold text-[#315BEA] dark:text-blue-400 uppercase">
                        {q.subject?.code || q.subjectSlug}
                      </span>
                      {q.topic?.name && (
                        <span className="text-slate-400 text-[11px]">• {q.topic.name}</span>
                      )}

                      {/* Type Badge */}
                      <Badge variant="navy" className="text-[10px]">
                        {q.type}
                      </Badge>

                      {/* Difficulty Badge */}
                      <Badge
                        variant={
                          q.difficulty === "EXPERT"
                            ? "destructive"
                            : q.difficulty === "HARD"
                            ? "destructive"
                            : q.difficulty === "MEDIUM"
                            ? "default"
                            : "secondary"
                        }
                        className="text-[10px]"
                      >
                        {q.difficulty}
                      </Badge>

                      {/* Origin Badge */}
                      <Badge
                        variant={isAi ? "secondary" : "default"}
                        className={`text-[10px] ${
                          isAi
                            ? "bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-700"
                            : "bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-700"
                        }`}
                      >
                        {isAi ? "AI Generated" : "Verified Past Paper"}
                      </Badge>

                      {/* Status Badge */}
                      <Badge
                        variant={isPending ? "secondary" : isApproved ? "default" : isRejected ? "destructive" : "secondary"}
                        className={`text-[10px] ${
                          isPending
                            ? "bg-purple-100 text-purple-900 border-purple-300 dark:bg-purple-950/60 dark:text-purple-300"
                            : isApproved
                            ? "bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300"
                            : isRejected
                            ? "bg-rose-100 text-rose-900 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300"
                            : ""
                        }`}
                      >
                        {q.status.replace("_", " ")}
                      </Badge>
                    </div>

                    {/* Review & Management Actions */}
                    <div className="flex items-center gap-2">
                      {isPending && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => setReviewModalQuestion({ question: q, action: "APPROVE" })}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] h-7 px-2.5 font-bold flex items-center gap-1"
                          >
                            <Check className="h-3 w-3" /> Approve
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => setReviewModalQuestion({ question: q, action: "REJECT" })}
                            className="bg-rose-600 hover:bg-rose-700 text-white text-[11px] h-7 px-2.5 font-bold flex items-center gap-1"
                          >
                            <X className="h-3 w-3" /> Reject
                          </Button>
                        </>
                      )}

                      <button
                        onClick={() => setDeleteId(q.id)}
                        className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-slate-800"
                        title="Delete Question"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Statement */}
                  <p className="text-xs sm:text-sm font-semibold text-[#101B36] dark:text-white leading-relaxed">
                    {q.statement}
                  </p>

                  {/* Options (if MCQ) */}
                  {q.options && q.options.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {q.options.map((opt) => (
                        <div
                          key={opt.optionKey}
                          className={`p-2.5 rounded-xl border ${
                            opt.isCorrect
                              ? "border-emerald-300 bg-emerald-50 text-emerald-950 font-bold dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
                              : "border-slate-100 bg-slate-50/50 text-slate-700 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-300"
                          }`}
                        >
                          <span className="font-mono mr-1.5 font-bold">{opt.optionKey}.</span>
                          {opt.statement}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Explanation & Textbook Citation */}
                  {(q.answer?.detailedExplanation || q.detailedExplanation) && (
                    <div className="text-[11px] bg-slate-50 p-3 rounded-xl border border-slate-100 dark:bg-slate-900/50 dark:border-slate-800/80 text-slate-600 dark:text-slate-300 space-y-1">
                      <div className="font-bold text-[#101B36] dark:text-slate-200 flex items-center gap-1.5">
                        <BookOpen className="h-3.5 w-3.5 text-[#315BEA]" /> Academic Solution:
                      </div>
                      <p>{q.answer?.detailedExplanation || q.detailedExplanation}</p>
                      {(q.answer?.referenceCitation || q.referenceCitation) && (
                        <p className="italic text-slate-500 pt-1">
                          Reference: {q.answer?.referenceCitation || q.referenceCitation}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Source Footer */}
                  {q.sources && q.sources[0] && (
                    <div className="text-[10px] text-slate-400">
                      Source: {q.sources[0].sourceName}{" "}
                      {q.sources[0].examYear ? `(${q.sources[0].examYear})` : ""}{" "}
                      {q.sources[0].postTitle ? `• ${q.sources[0].postTitle}` : ""}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Review Workflow Modal (Approve / Reject) */}
      {reviewModalQuestion && (
        <Modal
          isOpen={Boolean(reviewModalQuestion)}
          onClose={() => setReviewModalQuestion(null)}
          title={
            reviewModalQuestion.action === "APPROVE"
              ? "Approve Question for Academic Bank"
              : "Reject Question & Provide Faculty Feedback"
          }
          description={
            reviewModalQuestion.action === "APPROVE"
              ? "Verified questions are published immediately to candidate practice modules and mock examinations."
              : "Rejected questions will be hidden from candidates and retained for revision or deletion."
          }
          className="max-w-lg"
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 dark:bg-slate-900 dark:border-slate-800 font-medium">
              {reviewModalQuestion.question.statement}
            </div>

            <div>
              <label className="block font-bold mb-1">
                Faculty Review Comments {reviewModalQuestion.action === "REJECT" && "(Required)"}
              </label>
              <textarea
                rows={3}
                required={reviewModalQuestion.action === "REJECT"}
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs bg-white dark:bg-slate-900 dark:border-slate-800"
                placeholder={
                  reviewModalQuestion.action === "APPROVE"
                    ? "Optional notes: Verified against CLRS 4th Ed Chapter 12..."
                    : "Reason for rejection: Ambiguous option C, incorrect formula notation..."
                }
                value={reviewComments}
                onChange={(e) => setReviewComments(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <Button variant="outline" size="sm" onClick={() => setReviewModalQuestion(null)}>
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleReviewSubmit}
                disabled={actionLoading || (reviewModalQuestion.action === "REJECT" && !reviewComments.trim())}
                className={
                  reviewModalQuestion.action === "APPROVE"
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                    : "bg-rose-600 hover:bg-rose-700 text-white font-bold"
                }
              >
                {actionLoading
                  ? "Processing..."
                  : reviewModalQuestion.action === "APPROVE"
                  ? "Confirm Approval"
                  : "Confirm Rejection"}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* AI Question Generation Modal */}
      {showAiModal && (
        <Modal
          isOpen={showAiModal}
          onClose={() => setShowAiModal(false)}
          title="AI Academic Question Generator"
          description="Generate authentic CS Lecturer questions strictly structured according to the HEC 2025 Revised Curriculum."
          className="max-w-xl"
        >
          <form onSubmit={handleGenerateAi} className="space-y-4 text-xs">
            {/* Regulatory Alert */}
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 dark:bg-amber-950/60 dark:border-amber-800 dark:text-amber-300 flex items-start gap-2.5">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-amber-600" />
              <div>
                <span className="font-bold">Faculty Review Compliance Requirement:</span> All AI-generated
                academic questions automatically enter <strong>Pending Review</strong> status. Content is never
                automatically published without verified human review.
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold mb-1">Target Discipline</label>
                <Select
                  value={aiForm.subjectSlug}
                  onChange={(e) => setAiForm({ ...aiForm, subjectSlug: e.target.value })}
                >
                  {HEC_SUBJECTS_2025.map((s) => (
                    <option key={s.slug} value={s.slug}>
                      {s.code}: {s.title}
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <label className="block font-bold mb-1">Curriculum Subtopic</label>
                <Select
                  value={aiForm.topicSlug}
                  onChange={(e) => setAiForm({ ...aiForm, topicSlug: e.target.value })}
                >
                  {activeAiSubject.topics.map((t) => (
                    <option key={t.slug} value={t.slug}>
                      {t.name}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block font-bold mb-1">Question Type</label>
                <Select
                  value={aiForm.type}
                  onChange={(e) =>
                    setAiForm({
                      ...aiForm,
                      type: e.target.value as "MCQ" | "SHORT" | "LONG" | "CONCEPTUAL" | "SCENARIO",
                    })
                  }
                >
                  <option value="MCQ">MCQ (4 Choices)</option>
                  <option value="SHORT">Short Question</option>
                  <option value="LONG">Long Question</option>
                  <option value="CONCEPTUAL">Conceptual Question</option>
                  <option value="SCENARIO">Scenario-Based</option>
                </Select>
              </div>

              <div>
                <label className="block font-bold mb-1">Difficulty</label>
                <Select
                  value={aiForm.difficulty}
                  onChange={(e) =>
                    setAiForm({
                      ...aiForm,
                      difficulty: e.target.value as "EASY" | "MEDIUM" | "HARD" | "EXPERT",
                    })
                  }
                >
                  <option value="EASY">Easy</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HARD">Hard</option>
                  <option value="EXPERT">Expert</option>
                </Select>
              </div>

              <div>
                <label className="block font-bold mb-1">Batch Quantity</label>
                <Select
                  value={String(aiForm.quantity)}
                  onChange={(e) => setAiForm({ ...aiForm, quantity: Number(e.target.value) })}
                >
                  <option value="1">1 Question</option>
                  <option value="3">3 Questions</option>
                  <option value="5">5 Questions</option>
                  <option value="10">10 Questions</option>
                </Select>
              </div>
            </div>

            <div>
              <label className="block font-bold mb-1">Custom Prompt / Specific Scenario (Optional)</label>
              <textarea
                rows={2}
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs bg-white dark:bg-slate-900 dark:border-slate-800"
                placeholder="e.g. Focus on memory leak detection, vtable runtime pointers, or PPSC 2022 past exam traps..."
                value={aiForm.customPrompt}
                onChange={(e) => setAiForm({ ...aiForm, customPrompt: e.target.value })}
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <Button type="button" variant="outline" size="sm" onClick={() => setShowAiModal(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={actionLoading}
                className="bg-amber-600 hover:bg-amber-700 text-white font-bold flex items-center gap-1.5"
              >
                <Sparkles className="h-3.5 w-3.5" />
                {actionLoading ? "Synthesizing Questions..." : "Generate into Pending Review"}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* CSV Import Modal */}
      {showCsvModal && (
        <Modal
          isOpen={showCsvModal}
          onClose={() => setShowCsvModal(false)}
          title="Import Questions via CSV"
          description="Bulk upload past paper screening MCQs and solutions directly into the database"
          className="max-w-2xl"
        >
          <form onSubmit={handleCsvImport} className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 dark:bg-blue-950/60 dark:border-blue-800 dark:text-blue-300">
              <div>
                <span className="font-bold">Required Columns:</span> statement, type, difficulty, optionA,
                optionB, optionC, optionD, correctOption (A/B/C/D), explanation, referenceCitation, sourceName,
                subjectCode.
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setCsvText(sampleCsvTemplate)}
                className="text-[11px] shrink-0 ml-3 bg-white dark:bg-slate-900"
              >
                Load Sample CSV
              </Button>
            </div>

            <div>
              <label className="block font-bold mb-1">Initial Ingest Status</label>
              <Select
                value={csvDefaultStatus}
                onChange={(e) => setCsvDefaultStatus(e.target.value as "PENDING_REVIEW" | "APPROVED")}
              >
                <option value="PENDING_REVIEW">Pending Review (Requires Admin Verification)</option>
                <option value="APPROVED">Approved (Verified Past Papers)</option>
              </Select>
            </div>

            <div>
              <label className="block font-bold mb-1">Paste CSV Data (or drop raw text)</label>
              <textarea
                rows={8}
                required
                className="w-full font-mono rounded-xl border border-slate-200 p-2.5 text-xs bg-white dark:bg-slate-900 dark:border-slate-800"
                placeholder={sampleCsvTemplate}
                value={csvText}
                onChange={(e) => setCsvText(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <Button type="button" variant="outline" size="sm" onClick={() => setShowCsvModal(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={actionLoading || !csvText.trim()}
                className="bg-[#101B36] text-white hover:bg-[#1A284D] dark:bg-emerald-600 font-bold"
              >
                {actionLoading ? "Parsing & Ingesting..." : "Run CSV Import"}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Manual Add Question Modal */}
      {showAddModal && (
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Add Verified Question to Bank"
          description="Enter verified screening question statement, 4 choices, and textbook reference"
          className="max-w-2xl"
        >
          <form onSubmit={handleManualAdd} className="space-y-4 text-xs">
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block font-bold mb-1">Discipline</label>
                <Select
                  value={manualForm.subjectSlug}
                  onChange={(e) => setManualForm({ ...manualForm, subjectSlug: e.target.value })}
                >
                  {HEC_SUBJECTS_2025.map((s) => (
                    <option key={s.slug} value={s.slug}>
                      {s.code}: {s.title}
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <label className="block font-bold mb-1">Question Type</label>
                <Select
                  value={manualForm.type}
                  onChange={(e) =>
                    setManualForm({
                      ...manualForm,
                      type: e.target.value as "MCQ" | "SHORT" | "LONG" | "CONCEPTUAL" | "SCENARIO",
                    })
                  }
                >
                  <option value="MCQ">Multiple Choice (MCQ)</option>
                  <option value="SHORT">Short Question</option>
                  <option value="LONG">Long Question</option>
                  <option value="CONCEPTUAL">Conceptual</option>
                  <option value="SCENARIO">Scenario-Based</option>
                </Select>
              </div>

              <div>
                <label className="block font-bold mb-1">Difficulty</label>
                <Select
                  value={manualForm.difficulty}
                  onChange={(e) =>
                    setManualForm({
                      ...manualForm,
                      difficulty: e.target.value as "EASY" | "MEDIUM" | "HARD" | "EXPERT",
                    })
                  }
                >
                  <option value="EASY">Easy</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HARD">Hard</option>
                  <option value="EXPERT">Expert</option>
                </Select>
              </div>
            </div>

            <div>
              <label className="block font-bold mb-1">Question Statement</label>
              <textarea
                rows={3}
                required
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs bg-white dark:bg-slate-900 dark:border-slate-800"
                placeholder="Enter exact academic question statement..."
                value={manualForm.statement}
                onChange={(e) => setManualForm({ ...manualForm, statement: e.target.value })}
              />
            </div>

            {manualForm.type === "MCQ" && (
              <div className="space-y-2 p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                <div className="font-bold text-slate-700 dark:text-slate-300">Four Answer Choices:</div>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    required
                    placeholder="Option A"
                    value={manualForm.optA}
                    onChange={(e) => setManualForm({ ...manualForm, optA: e.target.value })}
                  />
                  <Input
                    required
                    placeholder="Option B"
                    value={manualForm.optB}
                    onChange={(e) => setManualForm({ ...manualForm, optB: e.target.value })}
                  />
                  <Input
                    required
                    placeholder="Option C"
                    value={manualForm.optC}
                    onChange={(e) => setManualForm({ ...manualForm, optC: e.target.value })}
                  />
                  <Input
                    required
                    placeholder="Option D"
                    value={manualForm.optD}
                    onChange={(e) => setManualForm({ ...manualForm, optD: e.target.value })}
                  />
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <label className="font-bold">Correct Option:</label>
                  <div className="flex gap-4">
                    {(["A", "B", "C", "D"] as const).map((opt) => (
                      <label key={opt} className="flex items-center gap-1 cursor-pointer">
                        <input
                          type="radio"
                          name="correctOpt"
                          value={opt}
                          checked={manualForm.correctOpt === opt}
                          onChange={() => setManualForm({ ...manualForm, correctOpt: opt })}
                        />
                        Option {opt}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block font-bold mb-1">Detailed Academic Explanation</label>
              <textarea
                rows={3}
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs bg-white dark:bg-slate-900 dark:border-slate-800"
                placeholder="Step-by-step mathematical derivation, definition, or theorem justification..."
                value={manualForm.detailedExplanation}
                onChange={(e) => setManualForm({ ...manualForm, detailedExplanation: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold mb-1">Textbook Citation</label>
                <Input
                  placeholder="e.g. Silberschatz OS Concepts 10th Ed, Ch. 8"
                  value={manualForm.referenceCitation}
                  onChange={(e) => setManualForm({ ...manualForm, referenceCitation: e.target.value })}
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Source / Commission Exam</label>
                <Input
                  placeholder="e.g. PPSC CS Lecturer 2022 Written Exam"
                  value={manualForm.sourceName}
                  onChange={(e) => setManualForm({ ...manualForm, sourceName: e.target.value })}
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <Button type="button" variant="outline" size="sm" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={actionLoading}
                className="bg-[#101B36] text-white hover:bg-[#1A284D] dark:bg-emerald-600 font-bold"
              >
                {actionLoading ? "Saving..." : "Add to Question Bank"}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <Modal
          isOpen={Boolean(deleteId)}
          onClose={() => setDeleteId(null)}
          title="Confirm Question Deletion"
          description="Are you sure you want to permanently remove this question from the bank?"
          className="max-w-md"
        >
          <div className="flex items-center justify-end gap-2 pt-4">
            <Button variant="outline" size="sm" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleDelete}
              className="bg-rose-600 hover:bg-rose-700 text-white font-bold"
            >
              Delete
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
