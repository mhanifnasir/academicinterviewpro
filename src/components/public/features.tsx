import React from "react";
import {
  Mic,
  BookOpen,
  BarChart,
  Presentation,
  FileQuestion,
} from "lucide-react";

export function Features() {
  const features = [
    {
      icon: Mic,
      title: "AI 3-Member Commission Panel",
      description:
        "Practice authentic viva voce interviews with a Subject Specialist, Pedagogy Dean, and Commission Chairman. Experience real follow-up drilling.",
      badge: "Flagship AI",
      color: "text-[#315BEA]",
      bg: "bg-blue-50 dark:bg-blue-950/60",
    },
    {
      icon: BookOpen,
      title: "21 CS Subject Disciplines",
      description:
        "Comprehensive syllabi covering 18 Core CS disciplines plus General Knowledge, Pedagogy, and English Spoken Communication aligned with HEC Revised 2025.",
      badge: "Full Syllabus",
      color: "text-[#16A37B]",
      bg: "bg-emerald-50 dark:bg-emerald-950/60",
    },
    {
      icon: FileQuestion,
      title: "100-Mark Timed Mocks",
      description:
        "Replicate PPSC and FPSC written examination patterns with exact negative marking (-0.25), 90-minute countdowns, and question flags.",
      badge: "Real Exam Drill",
      color: "text-[#101B36] dark:text-blue-300",
      bg: "bg-slate-100 dark:bg-slate-800",
    },
    {
      icon: Presentation,
      title: "Micro-Teaching Demonstration",
      description:
        "Deliver 5-minute simulated classroom lectures. AI scores your blackboard structure, pedagogical analogies, and student engagement technique.",
      badge: "Teaching Viva",
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-50 dark:bg-purple-950/60",
    },
    {
      icon: Mic,
      title: "Academic English Voice Lab",
      description:
        "Eliminate filler words ('basically', 'um'), tune your speech rate (120-140 WPM), and master technical CS terminology pronunciation.",
      badge: "Voice Fluency",
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-950/60",
    },
    {
      icon: BarChart,
      title: "Merit Percentile Prediction",
      description:
        "See your predicted provincial rank based on performance analytics compared with thousands of active CS lecturer aspirants across Pakistan.",
      badge: "Smart Analytics",
      color: "text-[#315BEA]",
      bg: "bg-blue-50 dark:bg-blue-950/60",
    },
  ];

  return (
    <section id="features" className="py-20 sm:py-28 bg-white dark:bg-[#101B36] transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-[#315BEA] dark:text-blue-400">
            Engineered For Lecturer Aspirants
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-black text-[#101B36] dark:text-white">
            Everything You Need To Secure Your BPS-17 Appointment
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300">
            A comprehensive suite spanning written test preparation, technical coding, micro-teaching demos, and high-pressure selection board vivas.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="group relative rounded-2xl border border-slate-200/80 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-[#0B1120]"
              >
                <div className="flex items-center justify-between">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${feature.bg} ${feature.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    {feature.badge}
                  </span>
                </div>

                <h3 className="mt-5 text-xl font-bold text-[#101B36] dark:text-white group-hover:text-[#315BEA] transition-colors">
                  {feature.title}
                </h3>

                <p className="mt-2.5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
