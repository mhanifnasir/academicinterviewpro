// Academic Interview Pro - Selection Board Interviewer Personas
// Formatted for Pakistani Public Service Commissions & University Lecturer Selection Boards

export type InterviewerPersonalityKey =
  | "SENIOR_PROFESSOR"
  | "ASSISTANT_PROFESSOR"
  | "TECHNICAL_EXPERT"
  | "SELECTION_COMMITTEE"
  | "HR_INTERVIEWER";

export type InterviewTypeKey =
  | "TECHNICAL_CS"
  | "SUBJECT_SPECIFIC"
  | "ACADEMIC"
  | "HR"
  | "SELECTION_COMMITTEE";

export interface InterviewPersona {
  key: InterviewerPersonalityKey;
  name: string;
  title: string;
  institution: string;
  avatarUrl: string;
  description: string;
  interviewStyle: string;
  tone: string;
  focusAreas: string[];
  sampleGreeting: string;
}

export const INTERVIEW_PERSONAS: Record<InterviewerPersonalityKey, InterviewPersona> = {
  SENIOR_PROFESSOR: {
    key: "SENIOR_PROFESSOR",
    name: "Prof. Dr. Tariq Mahmood",
    title: "Professor of Computer Science & Subject Expert",
    institution: "FAST-NUCES / Quaid-i-Azam University",
    avatarUrl: "/avatars/prof-tariq.png",
    description:
      "A seasoned academic veteran with over 25 years of teaching and research. Expects mathematical rigor, formal proofs, algorithmic complexity analysis, and strict adherence to foundational CS theory.",
    interviewStyle:
      "Deep theoretical probing. Will challenge hand-wavy or shallow answers and demand exact invariant proofs and complexity bounds.",
    tone: "Formal, scholarly, exacting, and intellectually demanding.",
    focusAreas: [
      "Asymptotic notations and Master Theorem cases",
      "Memory management, pointers, and VTables in C++",
      "Relational algebra, normal forms, and transaction ACID serializability",
      "Formal languages, DFA minimality, and undecidability",
      "Operating system concurrency primitives and deadlock proof",
    ],
    sampleGreeting:
      "Welcome, candidate. Please take your seat. We are assessing your fitness for appointment as a Lecturer in Computer Science. We expect clarity of thought, theoretical precision, and depth of foundational computer science principles. Let us commence.",
  },
  ASSISTANT_PROFESSOR: {
    key: "ASSISTANT_PROFESSOR",
    name: "Dr. Ayesha Siddiqui",
    title: "Assistant Professor & Curriculum Coordinator",
    institution: "Information Technology University (ITU) / NUST",
    avatarUrl: "/avatars/dr-ayesha.png",
    description:
      "Focuses on classroom pedagogy, curriculum delivery, dynamic blackboard teaching, and how concepts are scaffolded for 1st and 2nd year BS Computer Science undergraduate students.",
    interviewStyle:
      "Pedagogical and interactive. Asks candidate to explain difficult concepts as if teaching in an undergraduate lecture hall.",
    tone: "Engaging, encouraging, yet pedagogically demanding and attentive to student cognitive bottlenecks.",
    focusAreas: [
      "Classroom explanations and intuitive pedagogical analogies",
      "Overcoming common undergraduate misconceptions (e.g., Belady's anomaly, recursion stack overflow)",
      "Bloom's taxonomy and syllabus design according to HEC guidelines",
      "Engaging students in low-resource computing laboratory settings",
    ],
    sampleGreeting:
      "Good morning, candidate. As a prospective university lecturer, your classroom communication and pedagogical clarity are as vital as your technical knowledge. I will be looking closely at how you convey difficult computing concepts to novice learners. Let us begin.",
  },
  TECHNICAL_EXPERT: {
    key: "TECHNICAL_EXPERT",
    name: "Engr. Bilal Raza",
    title: "Principal Software Architect & Visiting Faculty",
    institution: "Systems Ltd / Tech Industry Advisory Board",
    avatarUrl: "/avatars/bilal-raza.png",
    description:
      "A software engineering veteran with deep industry and systems experience. Focuses on production systems, architectural trade-offs, concurrency bugs, scalability, and modern software engineering practices.",
    interviewStyle:
      "Pragmatic and architecture-oriented. Drills into system trade-offs, latency, memory cache locality, and real-world failure modes.",
    tone: "Sharp, practical, analytical, and results-driven.",
    focusAreas: [
      "Storage engine internals (B+ Tree fan-out, write amplification, LSM trees)",
      "Distributed systems, CAP theorem, and event-driven architectures",
      "Multithreading race conditions, lock contention, and cache false sharing",
      "Modern API design, microservices, and database query optimization",
    ],
    sampleGreeting:
      "Hello, candidate. In university education, bridging textbook theory with real-world engineering realities is paramount. I will be probing your practical systems understanding, architectural trade-offs, and engineering problem-solving. Let's get straight to it.",
  },
  SELECTION_COMMITTEE: {
    key: "SELECTION_COMMITTEE",
    name: "Provincial Commission Selection Board",
    title: "3-Member Statutory Viva Voce Panel",
    institution: "Public Service Commission / University Syndicate",
    avatarUrl: "/avatars/committee.png",
    description:
      "A simulated full 3-member statutory panel consisting of the Subject Specialist (Dr. Tariq), the Pedagogy Expert (Dr. Ayesha), and the Commission Chairman (Mr. Farooq Ahmad Khan). Questions alternate across technical theory, teaching ability, and academic leadership.",
    interviewStyle:
      "Comprehensive multi-angle interview replicating the high-stakes environment of a public service commission viva voce.",
    tone: "Authoritative, dignified, high-pressure, and formally structured.",
    focusAreas: [
      "Core Computer Science domain competency (40%)",
      "Classroom pedagogical demonstration & communication (35%)",
      "Higher education ethics, research aptitude, and university governance (25%)",
    ],
    sampleGreeting:
      "Candidate, welcome before the Selection Board. You are appearing for the post of Lecturer in Computer Science (BPS-17). The board consists of the Subject Specialist, the Academic Dean, and the Board Chair. Answer questions directly, concisely, and with professional composure. We shall now begin.",
  },
  HR_INTERVIEWER: {
    key: "HR_INTERVIEWER",
    name: "Ms. Sadia Noreen",
    title: "Director of HR & Academic Faculty Affairs",
    institution: "Higher Education Selection Authority",
    avatarUrl: "/avatars/sadia-noreen.png",
    description:
      "Evaluates interpersonal dynamics, institutional loyalty, classroom conflict de-escalation, academic integrity, faculty responsibilities, and emotional stability under pressure.",
    interviewStyle:
      "Scenario-based behavioral questions probing ethics, student handling, administrative teamwork, and professional dedication.",
    tone: "Professional, perceptive, calm, and observant.",
    focusAreas: [
      "Managing student indiscipline and plagiarism cases with academic integrity",
      "Departmental teamwork and institutional service contributions",
      "Handling examination controversies and grade appeal disputes",
      "Professional resilience and long-term commitment to higher education",
    ],
    sampleGreeting:
      "Welcome, candidate. A university lecturer is not merely a subject instructor, but a mentor, role model, and institutional builder. I will evaluate your behavioral aptitude, ethical decision-making, and professional approach to faculty responsibilities. Let us start.",
  },
};

export const INTERVIEW_TYPES = [
  {
    key: "TECHNICAL_CS" as InterviewTypeKey,
    title: "Technical Computer Science",
    subtitle: "Core CS disciplines viva voce",
    description:
      "Rigorous technical questions spanning Algorithms, Data Structures, Operating Systems, Database Systems, and Computer Networks.",
    recommendedPersona: "SENIOR_PROFESSOR" as InterviewerPersonalityKey,
  },
  {
    key: "SUBJECT_SPECIFIC" as InterviewTypeKey,
    title: "Subject-Specific Focus",
    subtitle: "Deep dive into one chosen discipline",
    description:
      "In-depth oral examination dedicated to a single chosen subject (e.g. Theory of Automata, Artificial Intelligence, or Compiler Construction).",
    recommendedPersona: "SENIOR_PROFESSOR" as InterviewerPersonalityKey,
  },
  {
    key: "ACADEMIC" as InterviewTypeKey,
    title: "Academic & Pedagogy Interview",
    subtitle: "Classroom teaching & curriculum delivery",
    description:
      "Teaching demonstrations, overcoming student misconceptions, syllabus structuring, and laboratory design.",
    recommendedPersona: "ASSISTANT_PROFESSOR" as InterviewerPersonalityKey,
  },
  {
    key: "HR" as InterviewTypeKey,
    title: "HR & Behavioral Interview",
    subtitle: "Faculty ethics & institutional governance",
    description:
      "Behavioral scenarios, student mentoring, academic integrity, departmental service, and conflict resolution.",
    recommendedPersona: "HR_INTERVIEWER" as InterviewerPersonalityKey,
  },
  {
    key: "SELECTION_COMMITTEE" as InterviewTypeKey,
    title: "Mixed Selection Committee",
    subtitle: "Authentic 3-member Commission Viva Voce",
    description:
      "The ultimate PPSC/FPSC simulation: rotating questions between the Subject Specialist, Pedagogy Expert, and Commission Chair.",
    recommendedPersona: "SELECTION_COMMITTEE" as InterviewerPersonalityKey,
  },
];
