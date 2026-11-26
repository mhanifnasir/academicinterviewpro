"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  CheckSquare,
  HelpCircle,
  CheckCircle2,
  XCircle,
  BookOpen,
  Filter,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  Award,
  Bookmark,
  BookmarkCheck,
  RefreshCw,
  Shuffle,
  Info,
  Clock,
  History,
  Check,
  Eye,
  Sliders,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { CardSkeleton } from "@/components/shared/loading-skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { Modal } from "@/components/ui/modal";
import { Progress } from "@/components/ui/progress";
import { HEC_SUBJECTS_2025, INITIAL_QUESTION_BANK } from "@/data/hec-curriculum-2025";

interface PracticeQuestion {
  id: string;
  statement: string;
  subjectSlug: string;
  topicSlug?: string;
  type: string;
  difficulty: "EASY" | "MEDIUM" | "HARD" | "EXPERT";
  origin: string;
  status: string;
  options?: { optionKey: "A" | "B" | "C" | "D"; statement: string; isCorrect: boolean }[];
  correctOptionKey?: "A" | "B" | "C" | "D";
  detailedExplanation: string;
  keyPoints?: string[];
  referenceCitation?: string;
  source?: { sourceName: string; examYear?: number; postTitle?: string };
}

interface PracticeHistoryItem {
  id: string;
  title: string;
  mode: string;
  totalQuestions: number;
  percentage: number;
  accuracy: number;
  completedAt: string;
}

function MCQPracticeContent() {
  const searchParams = useSearchParams();
  const urlSubject = searchParams.get("subject");
  const urlTopic = searchParams.get("topic");

  // Filter & Mode state
  const [selectedSubject, setSelectedSubject] = useState<string>(urlSubject || "ALL");
  const [selectedTopic, setSelectedTopic] = useState<string>(urlTopic || "ALL");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("ALL");
  const [questionCountLimit, setQuestionCountLimit] = useState<number>(20);
  const [feedbackMode, setFeedbackMode] = useState<"IMMEDIATE" | "EXAMINATION">("IMMEDIATE");

  // Questions state
  const [questions, setQuestions] = useState<PracticeQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0);

  // User responses
  const [userSelections, setUserSelections] = useState<Record<number, "A" | "B" | "C" | "D">>({});
  const [revealedQuestions, setRevealedQuestions] = useState<Record<number, boolean>>({});
  const [scoreCount, setScoreCount] = useState({ correct: 0, wrong: 0 });

  // Bookmarks & History modals
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [historyList, setHistoryList] = useState<PracticeHistoryItem[]>([]);
  const [sessionCompleted, setSessionCompleted] = useState(false);

  // Load questions
  const fetchQuestions = async (isManual = false) => {
    if (isManual) setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("status", "APPROVED");
      params.append("type", "MCQ");
      if (selectedSubject !== "ALL") params.append("subjectSlug", selectedSubject);
      if (selectedTopic !== "ALL") params.append("topicSlug", selectedTopic);
      if (selectedDifficulty !== "ALL") params.append("difficulty", selectedDifficulty);
      params.append("limit", String(questionCountLimit));

      const res = await fetch(`/api/questions?${params.toString()}`);
      const json = await res.json();

      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        const mapped: PracticeQuestion[] = json.data.map(
          (q: {
            id: string;
            statement: string;
            type: string;
            difficulty: "EASY" | "MEDIUM" | "HARD" | "EXPERT";
            origin: string;
            status: string;
            subject?: { slug: string };
            subjectSlug?: string;
            topic?: { slug: string };
            topicSlug?: string;
            options?: { optionKey: "A" | "B" | "C" | "D"; statement: string; isCorrect: boolean }[];
            answer?: { detailedExplanation: string; keyPoints?: string[]; referenceCitation?: string };
            detailedExplanation?: string;
            referenceCitation?: string;
            sources?: { sourceName: string; examYear?: number; postTitle?: string }[];
            source?: { sourceName: string; examYear?: number; postTitle?: string };
          }) => ({
            id: q.id,
            statement: q.statement,
            subjectSlug: q.subject?.slug || q.subjectSlug || "data-structures",
            topicSlug: q.topic?.slug || q.topicSlug,
            type: q.type,
            difficulty: q.difficulty,
            origin: q.origin,
            status: q.status,
            options: q.options || [],
            correctOptionKey: q.options?.find((o) => o.isCorrect)?.optionKey || "A",
            detailedExplanation: q.answer?.detailedExplanation || q.detailedExplanation || "",
            keyPoints: q.answer?.keyPoints || [],
            referenceCitation: q.answer?.referenceCitation || q.referenceCitation || "",
            source: q.sources?.[0] || q.source,
          })
        );
        setQuestions(mapped.slice(0, questionCountLimit));
      } else {
        let fallback = INITIAL_QUESTION_BANK.filter((q) => q.status === "APPROVED" && q.type === "MCQ");
        if (selectedSubject !== "ALL") {
          fallback = fallback.filter((q) => q.subjectSlug === selectedSubject);
        }
        if (selectedDifficulty !== "ALL") {
          fallback = fallback.filter((q) => q.difficulty === selectedDifficulty);
        }
        setQuestions(fallback.slice(0, questionCountLimit));
      }
    } catch {
      let fallback = INITIAL_QUESTION_BANK.filter((q) => q.status === "APPROVED" && q.type === "MCQ");
      if (selectedSubject !== "ALL") {
        fallback = fallback.filter((q) => q.subjectSlug === selectedSubject);
      }
      setQuestions(fallback.slice(0, questionCountLimit));
    } finally {
      setLoading(false);
      setActiveQuestionIdx(0);
      setUserSelections({});
      setRevealedQuestions({});
      setScoreCount({ correct: 0, wrong: 0 });
      setSessionCompleted(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const params = new URLSearchParams();
        params.append("status", "APPROVED");
        params.append("type", "MCQ");
        if (selectedSubject !== "ALL") params.append("subjectSlug", selectedSubject);
        if (selectedTopic !== "ALL") params.append("topicSlug", selectedTopic);
        if (selectedDifficulty !== "ALL") params.append("difficulty", selectedDifficulty);
        params.append("limit", String(questionCountLimit));

        const res = await fetch(`/api/questions?${params.toString()}`);
        const json = await res.json();

        if (isMounted) {
          if (json.success && Array.isArray(json.data) && json.data.length > 0) {
            const mapped: PracticeQuestion[] = json.data.map(
              (q: {
                id: string;
                statement: string;
                type: string;
                difficulty: "EASY" | "MEDIUM" | "HARD" | "EXPERT";
                origin: string;
                status: string;
                subject?: { slug: string };
                subjectSlug?: string;
                topic?: { slug: string };
                topicSlug?: string;
                options?: { optionKey: "A" | "B" | "C" | "D"; statement: string; isCorrect: boolean }[];
                answer?: { detailedExplanation: string; keyPoints?: string[]; referenceCitation?: string };
                detailedExplanation?: string;
                referenceCitation?: string;
                sources?: { sourceName: string; examYear?: number; postTitle?: string }[];
                source?: { sourceName: string; examYear?: number; postTitle?: string };
              }) => ({
                id: q.id,
                statement: q.statement,
                subjectSlug: q.subject?.slug || q.subjectSlug || "data-structures",
                topicSlug: q.topic?.slug || q.topicSlug,
                type: q.type,
                difficulty: q.difficulty,
                origin: q.origin,
                status: q.status,
                options: q.options || [],
                correctOptionKey: q.options?.find((o) => o.isCorrect)?.optionKey || "A",
                detailedExplanation: q.answer?.detailedExplanation || q.detailedExplanation || "",
                keyPoints: q.answer?.keyPoints || [],
                referenceCitation: q.answer?.referenceCitation || q.referenceCitation || "",
                source: q.sources?.[0] || q.source,
              })
            );
            setQuestions(mapped.slice(0, questionCountLimit));
          } else {
            let fallback = INITIAL_QUESTION_BANK.filter((q) => q.status === "APPROVED" && q.type === "MCQ");
            if (selectedSubject !== "ALL") {
              fallback = fallback.filter((q) => q.subjectSlug === selectedSubject);
            }
            if (selectedDifficulty !== "ALL") {
              fallback = fallback.filter((q) => q.difficulty === selectedDifficulty);
            }
            setQuestions(fallback.slice(0, questionCountLimit));
          }
        }
      } catch {
        if (isMounted) {
          let fallback = INITIAL_QUESTION_BANK.filter((q) => q.status === "APPROVED" && q.type === "MCQ");
          if (selectedSubject !== "ALL") {
            fallback = fallback.filter((q) => q.subjectSlug === selectedSubject);
          }
          setQuestions(fallback.slice(0, questionCountLimit));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
          setActiveQuestionIdx(0);
          setUserSelections({});
          setRevealedQuestions({});
          setScoreCount({ correct: 0, wrong: 0 });
          setSessionCompleted(false);
        }
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, [selectedSubject, selectedTopic, selectedDifficulty, questionCountLimit]);

  // Load bookmarks & session history
  useEffect(() => {
    async function loadMeta() {
      try {
        const [bRes, hRes] = await Promise.all([
          fetch("/api/bookmarks"),
          fetch("/api/practice/sessions"),
        ]);
        const bJson = await bRes.json();
        const hJson = await hRes.json();
        if (bJson.success && Array.isArray(bJson.data)) {
          setBookmarkedIds(new Set(bJson.data.map((b: { questionId: string }) => b.questionId)));
        }
        if (hJson.success && Array.isArray(hJson.data)) {
          setHistoryList(hJson.data);
        }
      } catch {
        // Ignore
      }
    }
    loadMeta();
  }, []);

  const currentQ: PracticeQuestion | undefined = questions[activeQuestionIdx];
  const isQuestionRevealed = feedbackMode === "IMMEDIATE" ? Boolean(revealedQuestions[activeQuestionIdx]) : sessionCompleted;
  const selectedOpt = userSelections[activeQuestionIdx];

  // Option selection logic
  const handleSelectOption = (key: "A" | "B" | "C" | "D") => {
    if (feedbackMode === "IMMEDIATE" && revealedQuestions[activeQuestionIdx]) return;
    if (sessionCompleted) return;

    setUserSelections((prev) => ({ ...prev, [activeQuestionIdx]: key }));

    if (feedbackMode === "IMMEDIATE") {
      setRevealedQuestions((prev) => ({ ...prev, [activeQuestionIdx]: true }));

      const isCorrect = key === currentQ?.correctOptionKey;
      if (isCorrect) {
        setScoreCount((prev) => ({ ...prev, correct: prev.correct + 1 }));
      } else {
        setScoreCount((prev) => ({ ...prev, wrong: prev.wrong + 1 }));
      }
    }
  };

  // Examination feedback mode: Submit all practice questions
  const handleFinishExaminationMode = async () => {
    let corr = 0;
    let wrg = 0;

    questions.forEach((q, idx) => {
      const userChoice = userSelections[idx];
      if (userChoice) {
        if (userChoice === q.correctOptionKey) corr++;
        else wrg++;
      }
    });

    setScoreCount({ correct: corr, wrong: wrg });
    setSessionCompleted(true);

    // Record session history to API
    try {
      await fetch("/api/practice/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `${selectedSubject !== "ALL" ? selectedSubject.replace(/-/g, " ") : "Comprehensive"} Practice`,
          subjectSlug: selectedSubject,
          mode: feedbackMode,
          totalQuestions: questions.length,
          correctCount: corr,
          incorrectCount: wrg,
          unattemptedCount: questions.length - (corr + wrg),
          percentage: questions.length > 0 ? Math.round((corr / questions.length) * 100) : 0,
          accuracy: corr + wrg > 0 ? Math.round((corr / (corr + wrg)) * 100) : 0,
        }),
      });
    } catch {
      // Ignore
    }
  };

  const handleNext = () => {
    setActiveQuestionIdx((prev) => (prev + 1) % questions.length);
  };

  const handlePrev = () => {
    setActiveQuestionIdx((prev) => (prev - 1 + questions.length) % questions.length);
  };

  const handleShuffle = () => {
    const randomIdx = Math.floor(Math.random() * questions.length);
    setActiveQuestionIdx(randomIdx);
  };

  const handleReset = () => {
    setUserSelections({});
    setRevealedQuestions({});
    setScoreCount({ correct: 0, wrong: 0 });
    setActiveQuestionIdx(0);
    setSessionCompleted(false);
  };

  const handleToggleBookmark = async () => {
    if (!currentQ) return;
    const isBookmarked = bookmarkedIds.has(currentQ.id);

    try {
      await fetch("/api/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId: currentQ.id }),
      });
      setBookmarkedIds((prev) => {
        const next = new Set(prev);
        if (isBookmarked) next.delete(currentQ.id);
        else next.add(currentQ.id);
        return next;
      });
    } catch {
      setBookmarkedIds((prev) => {
        const next = new Set(prev);
        if (isBookmarked) next.delete(currentQ.id);
        else next.add(currentQ.id);
        return next;
      });
    }
  };

  const activeSubjectInfo = HEC_SUBJECTS_2025.find((s) => s.slug === selectedSubject);
  const totalAttempted = Object.keys(userSelections).length;
  const accuracy =
    scoreCount.correct + scoreCount.wrong > 0
      ? Math.round((scoreCount.correct / (scoreCount.correct + scoreCount.wrong)) * 100)
      : 0;
  const isCurrentBookmarked = currentQ ? bookmarkedIds.has(currentQ.id) : false;

  return (
    <div className="space-y-6">
      <PageHeader
        title="MCQ Practice Suite"
        description="Authentic Pakistani commission past paper screening questions with step-by-step academic solutions and citations"
        badge={<Badge variant="navy">{questions.length} Items Selected</Badge>}
        breadcrumbs={[{ label: "MCQ Practice Suite" }]}
        actions={
          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowHistoryModal(true)}
              className="text-xs font-bold flex items-center gap-1.5"
            >
              <History className="h-3.5 w-3.5" /> Attempt History
            </Button>
            <div className="flex items-center gap-3 text-xs font-bold">
              <span className="text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 dark:bg-emerald-950/60 dark:border-emerald-800">
                Correct: {scoreCount.correct}
              </span>
              <span className="text-rose-600 bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-200 dark:bg-rose-950/60 dark:border-rose-800">
                Incorrect: {scoreCount.wrong}
              </span>
              <span className="text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200 dark:bg-blue-950/60 dark:border-blue-800">
                Accuracy: {accuracy}%
              </span>
            </div>
          </div>
        }
      />

      {/* Filter and Mode Configuration Panel */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#101B36] space-y-4">
        {/* Top Controls: Feedback Mode & Question Quantity */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Feedback Mode:
            </span>
            <div className="flex items-center rounded-xl bg-slate-100 p-1 dark:bg-slate-900 text-xs font-semibold">
              <button
                onClick={() => {
                  setFeedbackMode("IMMEDIATE");
                  handleReset();
                }}
                className={`rounded-lg px-3 py-1.5 transition-all flex items-center gap-1.5 ${
                  feedbackMode === "IMMEDIATE"
                    ? "bg-white text-[#101B36] shadow-xs dark:bg-slate-800 dark:text-white"
                    : "text-slate-500"
                }`}
              >
                <Sparkles className="h-3.5 w-3.5 text-[#315BEA]" />
                Immediate Feedback
              </button>
              <button
                onClick={() => {
                  setFeedbackMode("EXAMINATION");
                  handleReset();
                }}
                className={`rounded-lg px-3 py-1.5 transition-all flex items-center gap-1.5 ${
                  feedbackMode === "EXAMINATION"
                    ? "bg-white text-[#101B36] shadow-xs dark:bg-slate-800 dark:text-white"
                    : "text-slate-500"
                }`}
              >
                <Clock className="h-3.5 w-3.5 text-amber-500" />
                Examination Mode (Post-Test Review)
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-xs font-bold text-slate-500">Question Quota:</label>
            <Select
              value={String(questionCountLimit)}
              onChange={(e) => setQuestionCountLimit(Number(e.target.value))}
              className="text-xs font-bold w-28"
            >
              <option value="5">5 Questions</option>
              <option value="10">10 Questions</option>
              <option value="20">20 Questions</option>
              <option value="30">30 Questions</option>
              <option value="50">50 Questions</option>
            </Select>
          </div>
        </div>

        {/* Filters Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
              Discipline
            </label>
            <Select
              value={selectedSubject}
              onChange={(e) => {
                setSelectedSubject(e.target.value);
                setSelectedTopic("ALL");
              }}
              className="text-xs font-semibold"
            >
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

          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
              Subtopic
            </label>
            <Select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              disabled={!activeSubjectInfo}
              className="text-xs"
            >
              <option value="ALL">All Subtopics</option>
              {activeSubjectInfo?.topics.map((t) => (
                <option key={t.slug} value={t.slug}>
                  {t.name}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
              Difficulty
            </label>
            <Select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="text-xs"
            >
              <option value="ALL">All Difficulties</option>
              <option value="EASY">Easy</option>
              <option value="MEDIUM">Medium</option>
              <option value="HARD">Hard</option>
              <option value="EXPERT">Expert</option>
            </Select>
          </div>
        </div>
      </div>

      {/* Main Runner Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-[#101B36]">
            {loading ? (
              <CardSkeleton lines={5} />
            ) : !currentQ ? (
              <EmptyState
                icon={HelpCircle}
                title="No questions found"
                description="No practice questions match your active subject, topic, or difficulty filters. Try broadening your criteria."
                action={{
                  label: "Clear Filters",
                  onClick: () => {
                    setSelectedSubject("ALL");
                    setSelectedTopic("ALL");
                    setSelectedDifficulty("ALL");
                  },
                }}
              />
            ) : (
              <>
                {/* Meta header */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4 dark:border-slate-800 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#315BEA] dark:text-blue-400 uppercase tracking-wider">
                      {currentQ.subjectSlug.replace(/-/g, " ")}
                    </span>
                    <Badge
                      variant={
                        currentQ.difficulty === "EXPERT" || currentQ.difficulty === "HARD"
                          ? "destructive"
                          : currentQ.difficulty === "MEDIUM"
                          ? "default"
                          : "secondary"
                      }
                      className="text-[10px]"
                    >
                      {currentQ.difficulty}
                    </Badge>
                    {currentQ.source?.sourceName && (
                      <Badge variant="ppsc" className="text-[10px]">
                        {currentQ.source.sourceName}
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleToggleBookmark}
                      className={`p-1.5 rounded-lg border text-xs font-bold flex items-center gap-1 transition-all ${
                        isCurrentBookmarked
                          ? "bg-amber-50 border-amber-300 text-amber-700 dark:bg-amber-950/60 dark:border-amber-800 dark:text-amber-300"
                          : "border-slate-200 text-slate-400 hover:text-slate-600 dark:border-slate-700"
                      }`}
                      title={isCurrentBookmarked ? "Bookmarked" : "Bookmark Question"}
                    >
                      {isCurrentBookmarked ? (
                        <BookmarkCheck className="h-3.5 w-3.5 text-amber-600 fill-amber-600" />
                      ) : (
                        <Bookmark className="h-3.5 w-3.5" />
                      )}
                      <span>{isCurrentBookmarked ? "Saved" : "Save"}</span>
                    </button>

                    <span className="text-xs font-bold text-slate-400">
                      Question {activeQuestionIdx + 1} of {questions.length}
                    </span>
                  </div>
                </div>

                {/* Statement */}
                <h2 className="mt-5 text-base sm:text-lg font-bold text-[#101B36] dark:text-white leading-relaxed">
                  {currentQ.statement}
                </h2>

                {/* Options */}
                <div className="mt-6 space-y-3">
                  {currentQ.options?.map((opt) => {
                    const isSelected = selectedOpt === opt.optionKey;
                    const isCorrect = opt.optionKey === currentQ.correctOptionKey;

                    let btnStyle =
                      "border-slate-200 hover:border-blue-400 bg-white hover:bg-slate-50 text-slate-800 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-200";

                    if (isQuestionRevealed) {
                      if (isCorrect) {
                        btnStyle =
                          "border-emerald-500 bg-emerald-50 text-emerald-950 dark:bg-emerald-950/60 dark:text-emerald-200 dark:border-emerald-600 font-bold";
                      } else if (isSelected && !isCorrect) {
                        btnStyle =
                          "border-rose-500 bg-rose-50 text-rose-950 dark:bg-rose-950/60 dark:text-rose-200 dark:border-rose-600";
                      } else {
                        btnStyle = "border-slate-100 opacity-60 text-slate-400 dark:border-slate-800";
                      }
                    } else if (isSelected) {
                      btnStyle =
                        "border-[#315BEA] bg-blue-50/70 text-[#101B36] font-bold dark:bg-blue-950/40 dark:text-white dark:border-blue-500";
                    }

                    return (
                      <button
                        key={opt.optionKey}
                        onClick={() => handleSelectOption(opt.optionKey)}
                        className={`w-full text-left p-4 rounded-xl border text-xs sm:text-sm font-medium transition-all flex items-center justify-between ${btnStyle}`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border font-mono font-bold text-xs ${
                              isSelected
                                ? "bg-[#315BEA] text-white border-[#315BEA]"
                                : "bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400"
                            }`}
                          >
                            {opt.optionKey}
                          </span>
                          <span>{opt.statement}</span>
                        </div>

                        {isQuestionRevealed && isCorrect && (
                          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                        )}
                        {isQuestionRevealed && isSelected && !isCorrect && (
                          <XCircle className="h-5 w-5 text-rose-600 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation Card */}
                {isQuestionRevealed && (
                  <div className="mt-6 rounded-xl border border-slate-200/90 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900/50 text-xs space-y-3 animate-in fade-in">
                    <div className="flex items-center gap-2 font-bold text-[#101B36] dark:text-white">
                      <BookOpen className="h-4 w-4 text-[#315BEA]" /> Academic Explanation & Derivation:
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      {currentQ.detailedExplanation}
                    </p>

                    {currentQ.keyPoints && currentQ.keyPoints.length > 0 && (
                      <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-1">
                        <span className="font-bold text-[11px] text-slate-700 dark:text-slate-300">
                          Selection Board Key Invariants:
                        </span>
                        <ul className="list-disc pl-4 space-y-0.5 text-slate-500">
                          {currentQ.keyPoints.map((pt, pIdx) => (
                            <li key={pIdx}>{pt}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {currentQ.referenceCitation && (
                      <p className="text-[11px] text-slate-500 italic pt-1">
                        Textbook Citation: {currentQ.referenceCitation}
                      </p>
                    )}
                  </div>
                )}

                {/* Navigation and Action Controls */}
                <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePrev}
                      disabled={questions.length <= 1}
                      className="text-xs font-bold flex items-center gap-1"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" /> Prev
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleShuffle}
                      className="text-xs font-bold flex items-center gap-1"
                      title="Random Question"
                    >
                      <Shuffle className="h-3.5 w-3.5" /> Shuffle
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleReset}
                      className="text-xs font-bold flex items-center gap-1 text-slate-500"
                    >
                      <RotateCcw className="h-3.5 w-3.5" /> Reset
                    </Button>
                  </div>

                  <div className="flex items-center gap-2">
                    {feedbackMode === "EXAMINATION" && !sessionCompleted && (
                      <Button
                        size="sm"
                        onClick={handleFinishExaminationMode}
                        className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center gap-1"
                      >
                        <Check className="h-3.5 w-3.5" /> Submit & Reveal Solutions
                      </Button>
                    )}
                    <Button
                      onClick={handleNext}
                      disabled={questions.length <= 1}
                      size="sm"
                      className="bg-[#101B36] text-white hover:bg-[#1A284D] dark:bg-emerald-600 text-xs font-bold flex items-center gap-1.5"
                    >
                      Next Item <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Question Palette & Strategy Sidebar */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#101B36] space-y-4">
            <h3 className="text-sm font-bold text-[#101B36] dark:text-white flex items-center justify-between">
              <span>Item Navigator</span>
              <span className="text-xs font-normal text-slate-500">
                {totalAttempted} / {questions.length} Attempted
              </span>
            </h3>

            {/* Quick Question Grid */}
            <div className="grid grid-cols-5 gap-2 max-h-60 overflow-y-auto pr-1">
              {questions.map((_, idx) => {
                const isAnswered = userSelections[idx] !== undefined;
                const isCurrent = activeQuestionIdx === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => setActiveQuestionIdx(idx)}
                    className={`h-8 rounded-lg text-xs font-mono font-bold transition-all ${
                      isCurrent
                        ? "ring-2 ring-[#315BEA] ring-offset-2 bg-[#101B36] text-white dark:ring-offset-slate-900"
                        : isAnswered
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                        : "bg-slate-100 text-slate-500 dark:bg-slate-800"
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Progress:</span>
                <span className="font-bold text-[#101B36] dark:text-white">
                  {questions.length > 0
                    ? Math.round((totalAttempted / questions.length) * 100)
                    : 0}
                  %
                </span>
              </div>
              <Progress
                value={
                  questions.length > 0
                    ? Math.round((totalAttempted / questions.length) * 100)
                    : 0
                }
                className="h-2"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Attempt History Modal */}
      {showHistoryModal && (
        <Modal
          isOpen={showHistoryModal}
          onClose={() => setShowHistoryModal(false)}
          title="Candidate Practice History"
          description="Track your mastery and accuracy rates across past topical sessions"
          className="max-w-xl"
        >
          <div className="space-y-4 text-xs">
            {historyList.length === 0 ? (
              <div className="py-8 text-center text-slate-400">
                No prior practice sessions logged yet.
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-72 overflow-y-auto pr-1">
                {historyList.map((h) => (
                  <div key={h.id} className="py-3 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-[#101B36] dark:text-white block">
                        {h.title}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {h.totalQuestions} Questions • Mode: {h.mode} •{" "}
                        {new Date(h.completedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-emerald-600 block">{h.percentage}%</span>
                      <span className="text-[10px] text-slate-400">{h.accuracy}% Accuracy</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
              <Button size="sm" variant="outline" onClick={() => setShowHistoryModal(false)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default function MCQPracticePage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center text-xs text-slate-400">
          <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-[#315BEA]" />
          Loading practice suite...
        </div>
      }
    >
      <MCQPracticeContent />
    </Suspense>
  );
}
