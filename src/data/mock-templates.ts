// Academic Interview Pro - Examination Templates & Configurations
// Pakistani CS Lecturer Selection Board Standards (PPSC, FPSC, SPSC, KPPSC)

export interface ExamTemplateConfig {
  id: string;
  slug: string;
  title: string;
  commission: "PPSC" | "FPSC" | "SPSC" | "KPPSC" | "BPSC" | "CUSTOM";
  type: "MOCK" | "PRACTICE";
  questionCount: number;
  durationMinutes: number;
  totalMarks: number;
  negativeMarkingRate: number; // 0.25 for PPSC/SPSC, 0.0 for FPSC
  subjectRatio: Record<string, number>; // subjectSlug -> question count
  difficultyRatio: {
    EASY: number;
    MEDIUM: number;
    HARD: number;
    EXPERT: number;
  };
  description: string;
  instructions: string[];
  isActive: boolean;
}

export const STANDARD_EXAM_TEMPLATES: ExamTemplateConfig[] = [
  // 1. 30 Questions High-Yield Sprint Mock
  {
    id: "tmpl-sprint-30",
    slug: "sprint-mock-30",
    title: "30-Question High-Yield Sprint Mock",
    commission: "CUSTOM",
    type: "MOCK",
    questionCount: 30,
    durationMinutes: 35,
    totalMarks: 30,
    negativeMarkingRate: 0.25,
    subjectRatio: {
      "data-structures": 6,
      "algorithms": 6,
      "operating-systems": 6,
      "database-management-systems": 6,
      "computer-networks": 6,
    },
    difficultyRatio: { EASY: 25, MEDIUM: 50, HARD: 25, EXPERT: 0 },
    description: "Rapid screening test covering the 5 most critical CS disciplines. Ideal for daily timed benchmark practice.",
    instructions: [
      "Total Time: 35 minutes for 30 questions.",
      "Each correct answer carries 1 mark.",
      "Negative marking: 0.25 marks deducted per wrong answer.",
      "Unanswered questions carry zero penalty.",
    ],
    isActive: true,
  },

  // 2. 50 Questions Half-Length Mock Exam
  {
    id: "tmpl-half-50",
    slug: "half-mock-50",
    title: "50-Question Core Discipline Screening Mock",
    commission: "PPSC",
    type: "MOCK",
    questionCount: 50,
    durationMinutes: 50,
    totalMarks: 50,
    negativeMarkingRate: 0.25,
    subjectRatio: {
      "data-structures": 8,
      "algorithms": 8,
      "operating-systems": 8,
      "database-management-systems": 7,
      "computer-networks": 7,
      "object-oriented-programming": 6,
      "theory-of-automata": 6,
    },
    difficultyRatio: { EASY: 20, MEDIUM: 50, HARD: 25, EXPERT: 5 },
    description: "Comprehensive 50-mark simulation testing core theoretical and algorithmic CS lecturer competencies.",
    instructions: [
      "Total Time: 50 minutes for 50 questions.",
      "Each question carries 1 mark.",
      "Negative marking: 0.25 marks deducted per incorrect option.",
      "You can mark questions for review and jump between questions freely.",
    ],
    isActive: true,
  },

  // 3. 100 Questions Full-Length PPSC Standard Mock
  {
    id: "tmpl-ppsc-100",
    slug: "ppsc-cs-100-standard",
    title: "PPSC Punjab CS Lecturer Official 100-Mark Mock",
    commission: "PPSC",
    type: "MOCK",
    questionCount: 100,
    durationMinutes: 90,
    totalMarks: 100,
    negativeMarkingRate: 0.25,
    subjectRatio: {
      "programming-fundamentals": 6,
      "object-oriented-programming": 8,
      "data-structures": 10,
      "algorithms": 10,
      "database-management-systems": 8,
      "computer-networks": 8,
      "operating-systems": 10,
      "software-engineering": 6,
      "computer-architecture": 5,
      "discrete-mathematics": 5,
      "theory-of-automata": 6,
      "compiler-construction": 5,
      "artificial-intelligence": 5,
      "information-security": 4,
      "english": 10,
      "teaching-methodology": 5,
    },
    difficultyRatio: { EASY: 20, MEDIUM: 55, HARD: 20, EXPERT: 5 },
    description: "Authentic PPSC Higher Education Department format: 80% Computer Science qualification + 20% English/General Knowledge.",
    instructions: [
      "Official PPSC Standard: 100 Multiple Choice Questions in 90 Minutes.",
      "Each correct answer awards 1.00 mark.",
      "Negative Marking: 0.25 marks deducted for each incorrect answer.",
      "Qualifying threshold: 40% aggregate marks required to qualify for Selection Board Interview.",
      "Automatic submission will trigger immediately when the countdown timer reaches 00:00.",
    ],
    isActive: true,
  },

  // 4. 100 Questions Full-Length FPSC Standard Mock (No Negative Marking)
  {
    id: "tmpl-fpsc-100",
    slug: "fpsc-cs-100-standard",
    title: "FPSC Federal CS Lecturer (F.4) Official 100-Mark Mock",
    commission: "FPSC",
    type: "MOCK",
    questionCount: 100,
    durationMinutes: 100,
    totalMarks: 100,
    negativeMarkingRate: 0.0,
    subjectRatio: {
      "english": 20,
      "data-structures": 8,
      "algorithms": 8,
      "operating-systems": 8,
      "database-management-systems": 8,
      "computer-networks": 8,
      "object-oriented-programming": 6,
      "software-engineering": 6,
      "computer-architecture": 6,
      "theory-of-automata": 6,
      "artificial-intelligence": 6,
      "teaching-methodology": 20,
    },
    difficultyRatio: { EASY: 25, MEDIUM: 55, HARD: 20, EXPERT: 0 },
    description: "Official Federal Public Service Commission scheme: Part I: English (20 Marks), Part II: CS Subject (50 Marks), Part III: Professional Education (30 Marks).",
    instructions: [
      "Official FPSC Standard: 100 Questions in 100 Minutes.",
      "Negative Marking: 0.00 marks (NO negative marking in FPSC screening).",
      "Qualifying threshold: 50% aggregate marks required.",
      "Attempt all questions to maximize merit potential.",
    ],
    isActive: true,
  },

  // 5. 50 Questions SPSC Sindh CS Lecturer Standard Mock
  {
    id: "tmpl-spsc-50",
    slug: "spsc-cs-50-standard",
    title: "SPSC Sindh CS Lecturer 50-Mark Mock",
    commission: "SPSC",
    type: "MOCK",
    questionCount: 50,
    durationMinutes: 60,
    totalMarks: 50,
    negativeMarkingRate: 0.25,
    subjectRatio: {
      "data-structures": 8,
      "operating-systems": 8,
      "database-management-systems": 8,
      "computer-networks": 8,
      "algorithms": 8,
      "english": 10,
    },
    difficultyRatio: { EASY: 25, MEDIUM: 50, HARD: 25, EXPERT: 0 },
    description: "Official Sindh Public Service Commission College Education Department screening format.",
    instructions: [
      "Total Time: 60 minutes for 50 questions.",
      "Negative marking: 0.25 marks deducted per wrong answer.",
    ],
    isActive: true,
  },
];
