"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

export function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      question: "Is this syllabus strictly aligned with the latest PPSC and FPSC CS Lecturer tests?",
      answer:
        "Yes, 100%. Our curriculum and question bank are designed directly from the Higher Education Commission (HEC) National Computer Science curriculum and verified against official PPSC (Punjab), FPSC (Federal), SPSC (Sindh), and KPPSC past screening papers from 2015 to 2025. It reflects the 80% CS subject + 20% general/pedagogy split and exact negative marking (-0.25).",
    },
    {
      question: "How does the AI Viva interview panel replicate the Pakistani Commission selection board?",
      answer:
        "Pakistani commission viva panels typically consist of 3 members: a Subject Specialist (university professor testing deep CS theory), a Pedagogy/Education expert (evaluating classroom teaching methodology and micro-teaching demos), and a Commission Member/Chairman (testing general demeanor, ethics, and confidence). Our AI simulates each panelist persona with tailored line-of-questioning and follow-up grilling.",
    },
    {
      question: "Can I prepare for both the Written Screening Test and the subsequent Viva Voce Interview?",
      answer:
        "Yes. Academic Interview Pro provides a seamless two-stage preparation track: Phase 1 prepares you for the 100-mark screening test with timed negative-marking mocks and 18,000+ MCQs. Phase 2 prepares shortlisted candidates for the final viva voce, blackboard teaching demonstration, and English spoken delivery.",
    },
    {
      question: "How does the English Voice Lab assess my spoken lecture delivery?",
      answer:
        "The English Lab uses speech analysis to monitor your speech rate (target 120-140 words per minute), count hesitant filler words ('basically', 'actually', 'umm'), verify precise pronunciation of technical computer science terminology (such as 'Dijkstra', 'Asymptotic', 'Heuristic'), and rate your academic tone.",
    },
    {
      question: "What local Pakistani payment methods are accepted?",
      answer:
        "We support all major Pakistani digital payment systems including JazzCash, Easypaisa, 1BILL bank transfers from any Pakistani bank (HBL, Meezan, Alfalah, UBL, etc.), and local/international Debit and Credit cards.",
    },
    {
      question: "Are past papers and model solutions included?",
      answer:
        "Yes, authentic past papers for PPSC Lecturer Computer Science (2017, 2020, 2022, 2024), FPSC Lecturer (2018, 2021, 2023), KPPSC, and SPSC are indexed with thorough step-by-step academic explanations and textbook citations.",
    },
  ];

  return (
    <section id="faq" className="py-20 sm:py-28 bg-white dark:bg-[#101B36] transition-colors">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-[#315BEA] dark:text-blue-400">
            Got Questions?
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-black text-[#101B36] dark:text-white">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-base text-slate-600 dark:text-slate-300">
            Everything you need to know about preparing for Computer Science lecturer posts in Pakistan.
          </p>
        </div>

        <div className="mt-12 space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-[#0B1120] overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="flex w-full items-center justify-between p-5 text-left text-base font-bold text-[#101B36] dark:text-white hover:text-[#315BEA] dark:hover:text-blue-400"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-slate-400 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-[#315BEA]" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-sm leading-relaxed text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800/60 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
