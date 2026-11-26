import React from "react";
import { ChevronRight, Target, BookOpen, Layers, Award, Mic } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      step: "01",
      icon: Target,
      title: "Select Target Commission & Syllabus",
      description:
        "Choose your target exam: PPSC (Punjab), FPSC (Federal), SPSC (Sindh), KPPSC (Khyber Pakhtunkhwa), BPSC, or University Selection Board.",
      tag: "Tailored Syllabus",
    },
    {
      step: "02",
      icon: BookOpen,
      title: "Master High-Yield CS Disciplines",
      description:
        "Study structured modules across all 12 core disciplines with instant past paper references, key definitions, and high-frequency concepts.",
      tag: "Subject Mastery",
    },
    {
      step: "03",
      icon: Layers,
      title: "Simulate Negative-Marking Mock Exams",
      description:
        "Practice timed 100-mark screening exams with the authentic commission UI, timer pressure, and -0.25 negative marking deductions.",
      tag: "Written Screening",
    },
    {
      step: "04",
      icon: Mic,
      title: "Face the 3-Member AI Viva Board",
      description:
        "Answer spoken or written technical and pedagogy questions under pressure. Handle cross-examination on your MPhil thesis and core concepts.",
      tag: "Viva Voce Simulation",
    },
    {
      step: "05",
      icon: Award,
      title: "Review Deep Scorecard & Merit Predictor",
      description:
        "Receive exhaustive breakdowns across technical precision, academic fluency, pedagogical clarity, and your projected merit list ranking.",
      tag: "Actionable Feedback",
    },
  ];

  return (
    <section id="how-it-works" className="py-20 sm:py-28 bg-[#F2F5FA] dark:bg-[#0B1120] transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-[#315BEA] dark:text-blue-400">
            Roadmap to Appointment
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-black text-[#101B36] dark:text-white">
            How Academic Interview Pro Prepares You
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300">
            A battle-tested 5-phase methodology transforming raw CS graduates into articulate, confident, top-merit academic lecturers.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="relative rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm transition-all hover:shadow-lg dark:border-slate-800 dark:bg-[#101B36] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black text-slate-300 dark:text-slate-600">
                      {item.step}
                    </span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#315BEA] dark:bg-blue-950/60 dark:text-blue-400">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>

                  <span className="mt-4 inline-block text-[11px] font-bold uppercase tracking-wider text-[#16A37B] dark:text-emerald-400">
                    {item.tag}
                  </span>

                  <h3 className="mt-1 text-base font-bold text-[#101B36] dark:text-white">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                    {item.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center gap-1 text-[11px] font-semibold text-[#315BEA] dark:text-blue-400">
                  <span>Step {idx + 1} of 5</span>
                  <ChevronRight className="h-3 w-3" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
