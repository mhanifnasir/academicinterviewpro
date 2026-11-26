"use client";

import React, { useState } from "react";
import { Mic, Send, Volume2, Sparkles, CheckCircle2, RotateCcw, Award, UserCheck, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function AIInterviewDemo() {
  const [userAnswer, setUserAnswer] = useState("");
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<{
    submitted: boolean;
    technicalAccuracy: number;
    conceptualDepth: number;
    clarityScore: number;
    critique: string;
    followUp: string;
  } | null>(null);

  const sampleQuestion = {
    panelist: "Dr. Tariq Mahmood (Subject Specialist - Fast NUCES)",
    question:
      "Candidate, explain why virtual memory paging can lead to thrashing, and how the Working Set Model or Page Fault Frequency strategy mitigates it in modern operating system kernels.",
    presetAnswer:
      "Thrashing occurs when the system spends more time paging (swapping pages into and out of memory) than executing instructions. This happens when the sum of working set sizes of all active processes exceeds available physical frames. The Working Set Model defines a working set window Delta of recent page references; an OS allocates frames based on this working set size, and if total demand exceeds capacity, suspends processes to restore stability.",
  };

  const handleUsePreset = () => {
    setUserAnswer(sampleQuestion.presetAnswer);
  };

  const handleEvaluate = () => {
    if (!userAnswer.trim()) return;
    setIsEvaluating(true);
    setTimeout(() => {
      setIsEvaluating(false);
      setEvaluation({
        submitted: true,
        technicalAccuracy: 95,
        conceptualDepth: 91,
        clarityScore: 93,
        critique:
          "Excellent response. You accurately defined thrashing, clearly explained the causal condition (aggregate working set > total RAM frames), and accurately referenced Peter Denning's Working Set principle with the Delta parameter.",
        followUp:
          "Quick follow-up: How does Page Fault Frequency (PFF) dynamically adjust frame allocations using upper and lower fault thresholds?",
      });
    }, 900);
  };

  const handleReset = () => {
    setUserAnswer("");
    setEvaluation(null);
  };

  return (
    <section id="ai-demo" className="py-20 sm:py-28 bg-[#F2F5FA] dark:bg-[#0B1120] transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <Badge className="bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950 dark:text-blue-300">
            Interactive AI Viva Simulator
          </Badge>
          <h2 className="mt-3 text-3xl sm:text-4xl font-black text-[#101B36] dark:text-white">
            Experience the Virtual Selection Board Viva
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300">
            Try an interactive simulation of the 3-member board interview. Test your technical articulation and receive real-time panel evaluations.
          </p>
        </div>

        <div className="mt-12 max-w-4xl mx-auto rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-[#101B36] overflow-hidden">
          {/* Header Bar */}
          <div className="bg-[#101B36] px-6 py-4 text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#315BEA]">
                <Mic className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold">Commission Viva Voce Simulation</h3>
                <p className="text-xs text-slate-400">Board Session: Computer Science Specialization (Operating Systems)</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-semibold text-emerald-300">Live Examiner Active</span>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* Panelist Question Box */}
            <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-5 dark:border-blue-900/60 dark:bg-blue-950/30">
              <div className="flex items-center justify-between text-xs font-bold text-[#315BEA] dark:text-blue-400 mb-2">
                <span className="flex items-center gap-1.5">
                  <UserCheck className="h-4 w-4" />
                  {sampleQuestion.panelist}
                </span>
                <span className="bg-white dark:bg-slate-800 px-2 py-0.5 rounded text-[11px] shadow-xs">
                  Viva Core Question
                </span>
              </div>
              <p className="text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100 leading-relaxed">
                &ldquo;{sampleQuestion.question}&rdquo;
              </p>
            </div>

            {/* Answer Input */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                  Your Spoken or Written Response:
                </label>
                <button
                  type="button"
                  onClick={handleUsePreset}
                  className="text-xs font-semibold text-[#315BEA] hover:underline dark:text-blue-400"
                >
                  Load Sample Candidate Answer
                </button>
              </div>

              <textarea
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Type your academic response here, or click 'Load Sample Candidate Answer' to preview instant AI evaluation..."
                rows={4}
                className="w-full rounded-xl border border-slate-200 p-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#315BEA] dark:border-slate-800 dark:bg-[#0B1120] dark:text-slate-100"
              />

              <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Mic className="h-4 w-4 text-slate-400" />
                  <span>Microphone voice response available in Candidate Dashboard</span>
                </div>
                <div className="flex items-center gap-2">
                  {evaluation && (
                    <Button variant="outline" size="sm" onClick={handleReset}>
                      <RotateCcw className="h-3.5 w-3.5 mr-1" />
                      Reset
                    </Button>
                  )}
                  <Button
                    onClick={handleEvaluate}
                    disabled={isEvaluating || !userAnswer.trim()}
                    className="bg-[#315BEA] hover:bg-[#2348C9] text-white font-semibold"
                  >
                    {isEvaluating ? (
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="h-4 w-4 animate-spin" />
                        Evaluating Viva Response...
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5">
                        <span>Submit to Board Panel</span>
                        <Send className="h-4 w-4" />
                      </span>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* AI Evaluation Result */}
            {evaluation && (
              <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50/50 p-6 dark:border-emerald-900/60 dark:bg-emerald-950/20 animate-in fade-in duration-300">
                <div className="flex items-center justify-between border-b border-emerald-200/80 pb-3 dark:border-emerald-900/60">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-[#16A37B]" />
                    <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      Panel Evaluation & Viva Scorecard
                    </span>
                  </div>
                  <Badge variant="success">Verdict: Highly Recommended</Badge>
                </div>

                {/* Score Meters */}
                <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                  <div className="rounded-lg bg-white p-3 border border-emerald-100 dark:bg-[#101B36] dark:border-slate-800">
                    <span className="text-[11px] font-medium text-slate-500 block">Technical Accuracy</span>
                    <span className="text-xl font-black text-[#16A37B]">{evaluation.technicalAccuracy}%</span>
                  </div>
                  <div className="rounded-lg bg-white p-3 border border-emerald-100 dark:bg-[#101B36] dark:border-slate-800">
                    <span className="text-[11px] font-medium text-slate-500 block">Conceptual Depth</span>
                    <span className="text-xl font-black text-[#315BEA]">{evaluation.conceptualDepth}%</span>
                  </div>
                  <div className="rounded-lg bg-white p-3 border border-emerald-100 dark:bg-[#101B36] dark:border-slate-800">
                    <span className="text-[11px] font-medium text-slate-500 block">Academic Clarity</span>
                    <span className="text-xl font-black text-[#101B36] dark:text-white">{evaluation.clarityScore}%</span>
                  </div>
                </div>

                {/* Critique */}
                <div className="mt-4">
                  <h4 className="text-xs font-bold text-slate-700 uppercase dark:text-slate-300">
                    Board Feedback & Commentary:
                  </h4>
                  <p className="mt-1 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {evaluation.critique}
                  </p>
                </div>

                {/* Follow up question */}
                <div className="mt-4 rounded-lg bg-white p-3.5 border border-slate-200 dark:bg-[#101B36] dark:border-slate-800">
                  <span className="text-xs font-bold text-[#315BEA] block mb-1">
                    Dr. Tariq&apos;s Follow-Up Question:
                  </span>
                  <p className="text-xs sm:text-sm italic text-slate-800 dark:text-slate-200">
                    &ldquo;{evaluation.followUp}&rdquo;
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
