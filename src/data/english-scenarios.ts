// Academic Interview Pro - English Communication & Voice Lab Scenarios
// Calibrated for Pakistani CS Lecturer Applicants (PPSC, FPSC, University Selection Boards)

export type EnglishScenarioKey =
  | "GENERAL_CONVERSATION"
  | "LECTURER_INTERVIEW"
  | "SELF_INTRODUCTION"
  | "TECHNICAL_ENGLISH"
  | "HR_INTERVIEW"
  | "CLASSROOM_COMMUNICATION"
  | "ACADEMIC_DISCUSSION";

export interface EnglishScenario {
  key: EnglishScenarioKey;
  title: string;
  subtitle: string;
  description: string;
  cefrTarget: "B2" | "C1" | "C2";
  targetWPM: { min: number; max: number };
  systemPrompt: string;
  initialExaminerQuestion: string;
  recommendedVocabulary: string[];
  grammarFocusAreas: string[];
  urduGuidance: string;
}

export const ENGLISH_PRACTICE_SCENARIOS: Record<EnglishScenarioKey, EnglishScenario> = {
  GENERAL_CONVERSATION: {
    key: "GENERAL_CONVERSATION",
    title: "General English Conversation",
    subtitle: "Everyday professional fluency & spontaneous dialogue",
    description:
      "Practice comfortable, spontaneous conversational English on general higher education, academic campus life, work-life balance, and current technology trends.",
    cefrTarget: "B2",
    targetWPM: { min: 120, max: 140 },
    systemPrompt:
      "You are a friendly, articulate native English academic coach. Engage the candidate in warm, natural conversational English. Ask one open-ended question at a time. Encourage fluency, full sentences, and smooth transitions.",
    initialExaminerQuestion:
      "Hello! Welcome to the English Communication Lab. To begin, could you tell me a little bit about what inspired you to pursue a career in university academia and computer science education?",
    recommendedVocabulary: ["Pursue", "Aspiration", "Pivotal", "Transformative", "Intellectual curiosity"],
    grammarFocusAreas: ["Past continuous vs simple past", "Present perfect for life experiences", "Prepositional phrases"],
    urduGuidance: "روزمرہ تعلیمی گفتگو میں روانی، عام جملوں کی درست ساخت اور قدرتی انداز پر توجہ دیں۔",
  },
  LECTURER_INTERVIEW: {
    key: "LECTURER_INTERVIEW",
    title: "University Lecturer Selection Board",
    subtitle: "High-stakes formal viva voce English defense",
    description:
      "Simulate formal oral English responses before a Public Service Commission (PPSC/FPSC) selection committee. Focus on scholarly diction, professional composure, and formal academic syntax.",
    cefrTarget: "C1",
    targetWPM: { min: 125, max: 145 },
    systemPrompt:
      "You are a senior university selection board chairman in Pakistan. You speak with high formal academic dignity. Challenge the candidate's communication poise, clarity of scholarly expression, and verbal structure.",
    initialExaminerQuestion:
      "Candidate, why do you consider yourself uniquely qualified to be appointed as a Lecturer in Computer Science under the provincial higher education department?",
    recommendedVocabulary: ["Pedagogy", "Curriculum dissemination", "Rigorous", "Cognitive engagement", "Scholarly"],
    grammarFocusAreas: ["Conditional structures (Type 2 & 3)", "Subordinate clauses", "Formal hedging (e.g. It appears that, one might argue)"],
    urduGuidance: "پبلک سروس کمیشن کے انٹرویو میں باوقار، باقاعدہ اور رسمی انگریزی کا استعمال کریں۔ غیر رسمی الفاظ سے پرہیز کریں۔",
  },
  SELF_INTRODUCTION: {
    key: "SELF_INTRODUCTION",
    title: "2-Minute Academic Self-Introduction",
    subtitle: "Elevator pitch: qualifications, MS thesis, & teaching philosophy",
    description:
      "Master the critical first two minutes of any academic interview: concise articulation of educational background, MS/MPhil thesis focus, teaching achievements, and future research vision.",
    cefrTarget: "C1",
    targetWPM: { min: 120, max: 140 },
    systemPrompt:
      "You are an academic assessor evaluating the candidate's introductory pitch. Evaluate structure, pacing, confidence, and whether the candidate strikes the right balance between humility and competence.",
    initialExaminerQuestion:
      "Candidate, please introduce yourself to the panel, highlighting your educational journey, the core contribution of your graduate thesis, and your teaching philosophy.",
    recommendedVocabulary: ["Specialization", "Methodology", "Empirical findings", "Pedagogical stance", "Aspirations"],
    grammarFocusAreas: ["Chronological sequencing (e.g., Having completed, Subsequently)", "Parallel structure in lists"],
    urduGuidance: "اپنا تعارف جامع، پر اعتماد اور ترتیب وار انداز میں کروائیں تاکہ پینل پر پہلا تاثر شاندار قائم ہو۔",
  },
  TECHNICAL_ENGLISH: {
    key: "TECHNICAL_ENGLISH",
    title: "Technical English & Terminology",
    subtitle: "Precise oral explanation of computing concepts & architectures",
    description:
      "Overcome common technical Chinglish/Urdu-English slips. Articulate abstract data structures, asymptotic complexities, memory hierarchies, and concurrency models with precise English nomenclature.",
    cefrTarget: "C1",
    targetWPM: { min: 115, max: 135 },
    systemPrompt:
      "You are a computer science technical examiner. Focus strictly on whether the candidate utilizes exact English computing terminology (e.g., invariant, deterministic, latency, throughput, amortized) rather than vague colloquialisms.",
    initialExaminerQuestion:
      "In technical terms, how would you define the difference between concurrency and parallelism, and why is this distinction critical in modern multi-core operating systems?",
    recommendedVocabulary: ["Deterministic", "Interleaved execution", "Throughput", "Latency", "Asynchronous", "Contention"],
    grammarFocusAreas: ["Passive voice for scientific descriptions", "Cause-and-effect clauses (e.g., resulting in, thereby preventing)"],
    urduGuidance: "تکنیکی الفاظ کی درست ادائیگی اور واضح سائنسی اصطلاحات کا استعمال کریں۔ مبہم بیانات سے گریز کریں۔",
  },
  HR_INTERVIEW: {
    key: "HR_INTERVIEW",
    title: "HR & Behavioral Communication",
    subtitle: "Professional conflict resolution, ethics, & empathy",
    description:
      "Practice STAR-method (Situation, Task, Action, Result) answers to behavioral questions regarding student disputes, examination controversies, plagiarism, and departmental collaboration.",
    cefrTarget: "B2",
    targetWPM: { min: 120, max: 140 },
    systemPrompt:
      "You are an HR Director evaluating behavioral and interpersonal emotional intelligence. Assess empathy, assertiveness, diplomatic tone, and ethical grounding in spoken English.",
    initialExaminerQuestion:
      "Can you describe a challenging situation where you had to manage a conflict with an undergraduate student or a fellow colleague, and how you communicated diplomatically to resolve it?",
    recommendedVocabulary: ["Diplomatic", "De-escalate", "Due process", "Empathy", "Academic integrity", "Mediate"],
    grammarFocusAreas: ["Past tense consistency", "Indirect speech", "Modal verbs for polite assertion (e.g., I would ensure, I could facilitate)"],
    urduGuidance: "مسائل اور تنازعات کے حل میں شائستہ، پختہ اور متوازن زبان استعمال کریں جس میں ہمدردی اور اصول پسندی دونوں نظر آئیں۔",
  },
  CLASSROOM_COMMUNICATION: {
    key: "CLASSROOM_COMMUNICATION",
    title: "Classroom Teaching Demonstration",
    subtitle: "Lecture delivery, student questioning, & cognitive scaffolding",
    description:
      "Deliver a 3-minute mini-lecture in clear, engaging English. Learn to use signposting language, pedagogical analogies, rhetorical questions, and classroom management phrases.",
    cefrTarget: "B2",
    targetWPM: { min: 110, max: 135 },
    systemPrompt:
      "You are a student observing a prospective lecturer's teaching demo. Evaluate whether the explanation is clear, encouraging, well-paced, and free of monotonous tone.",
    initialExaminerQuestion:
      "Candidate, imagine this interview room is a lecture hall of 60 first-year BS CS students. Teach us the core concept of 'Recursion versus Iteration' using a real-world analogy in two minutes.",
    recommendedVocabulary: ["Analogous to", "Notice that", "Crucially", "Let us consider", "In essence", "Scaffolding"],
    grammarFocusAreas: ["Imperatives for instruction (e.g., Observe how, Consider)", "Rhetorical questions", "Signposting phrases"],
    urduGuidance: "کلاس روم میں طلباء کو سکھاتے وقت پُرجوش، واضح اور پرکشش انگریزی بولیں تاکہ طلباء کی دلچسپی برقرار رہے۔",
  },
  ACADEMIC_DISCUSSION: {
    key: "ACADEMIC_DISCUSSION",
    title: "Academic Debate & Research Defense",
    subtitle: "Defending research methodology & handling peer critiques",
    description:
      "Engage in intellectual debate with academic peers. Practice counter-arguing respectfully, citing evidence, acknowledging limitations, and defending research claims without becoming defensive.",
    cefrTarget: "C2",
    targetWPM: { min: 125, max: 145 },
    systemPrompt:
      "You are a rigorous academic conference reviewer. Politely push back on the candidate's claims to see how gracefully and cogently they defend their thesis under intellectual debate.",
    initialExaminerQuestion:
      "In your graduate research, what was the primary methodological limitation you encountered, and if given a well-funded laboratory, how would you address that critique?",
    recommendedVocabulary: ["Methodological constraints", "Empirical validation", "Confounding variables", "Extensible", "Substantiate"],
    grammarFocusAreas: ["Complex concessions (e.g., While it is true that..., nevertheless)", "Subjunctive mood"],
    urduGuidance: "تحقیقی مباحثے میں دلیل کے ساتھ بات کریں، تنقید کو کھلے دل سے تسلیم کریں اور باوقار علمی انداز میں جواب دیں۔",
  },
};
