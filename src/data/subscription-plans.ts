export interface PlanLimits {
  mcqPerDay: number;
  aiInterviewsPerMonth: number;
  voiceSessionsPerMonth: number;
  mockTestsPerMonth: number;
  codingSubmissionsPerDay: number;
  teachingDemosPerMonth: number;
}

export interface PlanEntitlements {
  customMocks: boolean;
  detailedPedagogicalReport: boolean;
  aiCodeFeedback: boolean;
  urduVoiceExplanations: boolean;
  downloadablePastPapers: boolean;
  exportPdfReports: boolean;
  priorityAiLatency: boolean;
  selectionBoardVivaSimulation: boolean;
}

export interface SubscriptionPlanDef {
  code: string;
  name: string;
  subtitle: string;
  priceMonthlyPKR: number;
  priceYearlyPKR: number;
  badge?: string;
  isPopular?: boolean;
  description: string;
  features: string[];
  limits: PlanLimits;
  entitlements: PlanEntitlements;
  displayOrder: number;
}

export const SUBSCRIPTION_PLANS: SubscriptionPlanDef[] = [
  {
    code: "FREE",
    name: "Aspirant Free",
    subtitle: "For candidates beginning their syllabus overview",
    priceMonthlyPKR: 0,
    priceYearlyPKR: 0,
    description: "Essential foundational tools to explore the HEC syllabus and sample questions.",
    features: [
      "25 Daily Subject MCQs",
      "2 AI Viva Sessions per month",
      "3 Spoken English Voice drills per month",
      "1 Full-length Mock Exam per month",
      "5 Sandboxed Code Submissions per day",
      "1 Teaching Demo evaluation per month",
      "Core curriculum syllabus browser",
      "Community discussion access",
    ],
    limits: {
      mcqPerDay: 25,
      aiInterviewsPerMonth: 2,
      voiceSessionsPerMonth: 3,
      mockTestsPerMonth: 1,
      codingSubmissionsPerDay: 5,
      teachingDemosPerMonth: 1,
    },
    entitlements: {
      customMocks: false,
      detailedPedagogicalReport: false,
      aiCodeFeedback: false,
      urduVoiceExplanations: false,
      downloadablePastPapers: false,
      exportPdfReports: false,
      priorityAiLatency: false,
      selectionBoardVivaSimulation: false,
    },
    displayOrder: 1,
  },
  {
    code: "PREMIUM",
    name: "Lecturer Pro",
    subtitle: "Most popular for PPSC / FPSC / SPSC candidates",
    priceMonthlyPKR: 2499,
    priceYearlyPKR: 23990, // ~20% discount (approx 1,999/mo)
    badge: "Recommended for Aspirants",
    isPopular: true,
    description: "Complete preparation suite with high-volume drills, full-length timed mocks, and AI interview simulations.",
    features: [
      "500 Daily Subject MCQs (All 21 HEC subjects)",
      "25 AI Selection Board Vivas per month",
      "30 Spoken English Voice practice sessions per month",
      "15 Full-length 100-mark timed Mock Exams",
      "50 Sandboxed Code Submissions per day",
      "10 Teaching Demo evaluations with 8-dimension rubric",
      "Detailed Asymptotic Code & Whiteboard tips",
      "Urdu error explanations in English Lab",
      "Downloadable verified past paper keys (2015-2025)",
      "Printable Psychometric Performance Reports",
    ],
    limits: {
      mcqPerDay: 500,
      aiInterviewsPerMonth: 25,
      voiceSessionsPerMonth: 30,
      mockTestsPerMonth: 15,
      codingSubmissionsPerDay: 50,
      teachingDemosPerMonth: 10,
    },
    entitlements: {
      customMocks: true,
      detailedPedagogicalReport: true,
      aiCodeFeedback: true,
      urduVoiceExplanations: true,
      downloadablePastPapers: true,
      exportPdfReports: true,
      priorityAiLatency: false,
      selectionBoardVivaSimulation: true,
    },
    displayOrder: 2,
  },
  {
    code: "COMMISSION_MASTER",
    name: "Commission Master Season Pass",
    subtitle: "Unrestricted access until merit list finalization",
    priceMonthlyPKR: 5999,
    priceYearlyPKR: 49990,
    badge: "Zero Restrictions",
    description: "Intensive training with unrestricted quotas, priority server latency, and advanced thesis cross-examination.",
    features: [
      "Unlimited Daily MCQs & Topic Drills",
      "100 AI Board Vivas per month with adaptive difficulty",
      "120 Spoken English Voice Sessions with CEFR metrics",
      "60 Configurable Mock Exams with negative marking",
      "200 Sandboxed Code Submissions per day",
      "50 Teaching Demo evaluations with blackboard feedback",
      "Priority AI Generation Latency (Ultra-fast response)",
      "Thesis defense & research paper cross-examination",
      "Direct 1-on-1 performance audit consultation",
      "Full offline archive export (PDF & CSV)",
    ],
    limits: {
      mcqPerDay: 2000,
      aiInterviewsPerMonth: 100,
      voiceSessionsPerMonth: 120,
      mockTestsPerMonth: 60,
      codingSubmissionsPerDay: 200,
      teachingDemosPerMonth: 50,
    },
    entitlements: {
      customMocks: true,
      detailedPedagogicalReport: true,
      aiCodeFeedback: true,
      urduVoiceExplanations: true,
      downloadablePastPapers: true,
      exportPdfReports: true,
      priorityAiLatency: true,
      selectionBoardVivaSimulation: true,
    },
    displayOrder: 3,
  },
];

export interface PakistaniPaymentChannel {
  id: string;
  name: string;
  type: "MOBILE_WALLET" | "CARD" | "OTC_1BILL";
  logoText: string;
  badge: string;
  description: string;
  processingFee: string;
  settlementTime: string;
}

export const PAKISTANI_PAYMENT_CHANNELS: PakistaniPaymentChannel[] = [
  {
    id: "JAZZCASH",
    name: "JazzCash Mobile Account / Voucher",
    type: "MOBILE_WALLET",
    logoText: "JazzCash",
    badge: "Instant Approval",
    description: "Pay directly using your JazzCash Mobile Account MPIN or generate a voucher for any JazzCash retail shop.",
    processingFee: "0% Free",
    settlementTime: "Instant Real-time",
  },
  {
    id: "EASYPAISA",
    name: "Easypaisa Wallet / In-App Approval",
    type: "MOBILE_WALLET",
    logoText: "Easypaisa",
    badge: "Direct Push Prompt",
    description: "Receive a real-time payment prompt on your Easypaisa Mobile App or pay at any Easypaisa agent counter.",
    processingFee: "0% Free",
    settlementTime: "Instant Real-time",
  },
  {
    id: "SAFEPAY",
    name: "Safepay Checkout (Debit / Credit Cards & 1Link)",
    type: "CARD",
    logoText: "Safepay",
    badge: "Visa / Mastercard / PayPak",
    description: "Secure 3D-Secure checkout for all Pakistani bank cards (HBL, Meezan, Alfalah, Allied, MCB) & PayPak.",
    processingFee: "Bank standard",
    settlementTime: "Instant Automated",
  },
  {
    id: "PAYFAST",
    name: "PayFast (APPS 1Link Direct Bank Debit)",
    type: "OTC_1BILL",
    logoText: "PayFast",
    badge: "1Link Certified",
    description: "State Bank of Pakistan regulated direct bank transfer and 1BILL invoice payment via any mobile banking app.",
    processingFee: "PKR 10 flat",
    settlementTime: "Instant",
  },
  {
    id: "MOCK",
    name: "AIP Test Gateway Simulator",
    type: "MOBILE_WALLET",
    logoText: "Simulator",
    badge: "Sandbox Testing",
    description: "Simulate Pakistani gateway payment responses, OTP verification, and failure scenarios during local testing.",
    processingFee: "Test Mode",
    settlementTime: "Instant Sandbox",
  },
];
