"use client";

import React, { useState } from "react";
import { Volume2, Play, Square, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function EnglishPracticeDemo() {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const toggleAudio = () => {
    setIsPlayingAudio(!isPlayingAudio);
  };

  return (
    <section id="english-demo" className="py-20 sm:py-28 bg-white dark:bg-[#101B36] transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <Badge className="bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300">
              Spoken English & Micro-Teaching Lab
            </Badge>
            <h2 className="mt-3 text-3xl sm:text-4xl font-black text-[#101B36] dark:text-white leading-tight">
              Master Fluent Classroom English For Selection Boards
            </h2>
            <p className="mt-4 text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              In provincial selection boards (PPSC, FPSC, SPSC), candidate merit hinges not just on what you know, but how effortlessly you deliver university lectures in English.
            </p>

            <div className="mt-6 space-y-3.5">
              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-[#16A37B] dark:bg-emerald-950 shrink-0 mt-0.5">
                  ✓
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#101B36] dark:text-white">Eliminate Awkward Filler Words</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Real-time detection for &apos;basically&apos;, &apos;actually&apos;, &apos;you know&apos;, and hesitant Urdu fillers.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-[#315BEA] dark:bg-blue-950 shrink-0 mt-0.5">
                  ✓
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#101B36] dark:text-white">Optimal Lecture Delivery Pace</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Trains your cadence to 125-145 words per minute—the ideal cadence for undergraduate comprehension.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-100 text-purple-600 dark:bg-purple-950 shrink-0 mt-0.5">
                  ✓
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#101B36] dark:text-white">Technical Terminology Pronunciation</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Master precise pronunciation of terms like Dijkstra, Asymptotic, Polymorphism, Heuristic, and Semaphore.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Simulated Voice Lab Interactive Widget */}
          <div className="rounded-2xl border border-slate-200/90 bg-[#F2F5FA] p-6 shadow-xl dark:border-slate-800 dark:bg-[#0B1120]">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#315BEA] text-white">
                  <Volume2 className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-[#101B36] dark:text-white">Micro-Lecture Audio Studio</h3>
                  <p className="text-[11px] text-slate-500">Topic: Explaining Recursion vs Iteration</p>
                </div>
              </div>
              <Badge variant="ppsc">Voice Active</Badge>
            </div>

            {/* Audio Waveform Visualizer Preview */}
            <div className="mt-6 rounded-xl bg-white p-5 border border-slate-200 dark:bg-[#101B36] dark:border-slate-800 text-center">
              <div className="flex items-center justify-center gap-1.5 h-14">
                {[12, 28, 42, 16, 32, 50, 24, 38, 46, 20, 36, 48, 14, 26, 40, 18, 30].map((height, i) => (
                  <div
                    key={i}
                    className={`w-1.5 rounded-full transition-all duration-300 ${
                      isPlayingAudio
                        ? "bg-[#315BEA] animate-pulse"
                        : "bg-slate-300 dark:bg-slate-700"
                    }`}
                    style={{ height: isPlayingAudio ? `${(height % 35) + 15}px` : `${height * 0.4}px` }}
                  />
                ))}
              </div>

              <div className="mt-4 flex items-center justify-center gap-3">
                <Button
                  size="sm"
                  onClick={toggleAudio}
                  className="bg-[#315BEA] hover:bg-[#2348C9] text-white"
                >
                  {isPlayingAudio ? (
                    <>
                      <Square className="h-3.5 w-3.5 mr-1" /> Pause Audio
                    </>
                  ) : (
                    <>
                      <Play className="h-3.5 w-3.5 mr-1" /> Play Sample Candidate Clip
                    </>
                  )}
                </Button>
                <span className="text-xs font-mono text-slate-500">00:45 / 02:00</span>
              </div>
            </div>

            {/* Analysis Metrics */}
            <div className="mt-5 grid grid-cols-3 gap-3">
              <div className="rounded-lg bg-white p-3 border border-slate-200 text-center dark:bg-[#101B36] dark:border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-500">Speaking Pace</span>
                <span className="text-base font-black text-[#16A37B] block mt-0.5">132 WPM</span>
                <span className="text-[9px] text-slate-400">Target: 120-140</span>
              </div>

              <div className="rounded-lg bg-white p-3 border border-slate-200 text-center dark:bg-[#101B36] dark:border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-500">Filler Words</span>
                <span className="text-base font-black text-[#315BEA] block mt-0.5">0.4 / min</span>
                <span className="text-[9px] text-emerald-600 font-semibold">Exceptional</span>
              </div>

              <div className="rounded-lg bg-white p-3 border border-slate-200 text-center dark:bg-[#101B36] dark:border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-500">Clarity Index</span>
                <span className="text-base font-black text-[#101B36] dark:text-white block mt-0.5">94 / 100</span>
                <span className="text-[9px] text-slate-400">C1 Academic</span>
              </div>
            </div>

            {/* Live coaching banner */}
            <div className="mt-4 rounded-lg bg-blue-50 p-3 border border-blue-200 dark:bg-blue-950/40 dark:border-blue-900/40 flex items-start gap-2.5">
              <Sparkles className="h-4 w-4 text-[#315BEA] shrink-0 mt-0.5" />
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                <strong className="text-[#315BEA] dark:text-blue-400">AI Speech Tip:</strong> Notice how you smoothly transitioned from base condition to recursive call stack with clean intonation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
