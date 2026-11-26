import { z } from "zod";
import {
  INTERVIEW_PERSONAS,
  InterviewerPersonalityKey,
  InterviewTypeKey,
} from "@/data/interview-personas";

// Zod Validation Schemas
export const EvaluationResultSchema = z.object({
  technicalAccuracy: z.number().min(0).max(100),
  conceptualUnderstanding: z.number().min(0).max(100),
  communication: z.number().min(0).max(100),
  answerStructure: z.number().min(0).max(100),
  problemSolving: z.number().min(0).max(100),
  weightedScore: z.number().min(0).max(100),
  technicalMistakes: z.array(z.string()),
  missingConcepts: z.array(z.string()),
  critique: z.string(),
  isFollowUp: z.boolean(),
  followUpQuestion: z.string().nullable(),
  nextQuestion: z.string().nullable(),
  isCompleted: z.boolean(),
  modelAnswer: z.string(),
  studyRecommendations: z.array(z.string()),
});

export type EvaluationResult = z.infer<typeof EvaluationResultSchema>;

export const InitialQuestionSchema = z.object({
  greeting: z.string(),
  questionText: z.string(),
  panelistName: z.string(),
  panelistRole: z.string(),
  expectedKeywords: z.array(z.string()),
  modelAnswer: z.string(),
});

export type InitialQuestionResult = z.infer<typeof InitialQuestionSchema>;

// Academic CS Subject Knowledge Base for High-Fidelity Simulation & Fallback
interface SubjectQuestionBank {
  topic: string;
  difficulty: "EASY" | "MEDIUM" | "HARD" | "EXPERT";
  questions: {
    question: string;
    expectedKeywords: string[];
    modelAnswer: string;
    commonMistakes: string[];
    essentialConcepts: string[];
    followUp: string;
    recommendations: string[];
  }[];
}

const ACADEMIC_KNOWLEDGE_BASE: Record<string, SubjectQuestionBank[]> = {
  "data-structures": [
    {
      topic: "B+ Trees & Out-of-Core Indexing",
      difficulty: "HARD",
      questions: [
        {
          question:
            "Candidate, compare B-Trees and B+ Trees in the context of disk block storage subsystems. Why do modern relational database engines such as PostgreSQL and MySQL InnoDB strictly utilize B+ Trees for primary clustered and secondary indexes rather than standard B-Trees?",
          expectedKeywords: [
            "fan-out",
            "disk block locality",
            "leaf node pointers",
            "range scan throughput",
            "internal node pointer density",
          ],
          modelAnswer:
            "Modern RDBMS exclusively utilize B+ Trees because internal nodes only store routing keys and child pointers, with zero payload data records. This dramatically increases the branch 'fan-out' factor per disk block (typically 4KB/8KB page size), keeping the tree height shallow (3 to 4 levels for millions of records). Furthermore, in a B+ Tree, all data records reside at leaf nodes, and leaf nodes are linked via a bidirectional sequence pointer list. This enables O(log N) initial seek followed by ultra-fast O(K) sequential range scans without traversing parent nodes.",
          commonMistakes: [
            "Confusing leaf node linking with binary tree threaded pointers",
            "Claiming that standard B-Trees have faster range scans",
            "Ignoring disk page size and cache line locality",
          ],
          essentialConcepts: [
            "Fan-out multiplier per disk page",
            "Sequential linked leaf layer for range queries",
            "Cache hierarchy efficiency",
          ],
          followUp:
            "If leaf nodes are linked sequentially, what concurrency issues arise when two transactions attempt to split adjacent leaf nodes simultaneously? How does the latch crabbing protocol resolve this?",
          recommendations: [
            "Silberschatz Database System Concepts (Chapter 14: Indexing and Hashing)",
            "Garcia-Molina, Ullman: Database Systems The Complete Book",
          ],
        },
        {
          question:
            "Explain how an AVL tree guarantees O(log N) search and insertion time. Contrast its balance factor maintenance with that of a Red-Black tree during heavy write workloads.",
          expectedKeywords: [
            "balance factor",
            "tree rotations",
            "recoloring",
            "strict height balance",
            "write throughput",
          ],
          modelAnswer:
            "AVL trees enforce a strict balance condition where the height difference (balance factor) between left and right subtrees of any node never exceeds ±1. This guarantees a maximum height of ~1.44 log₂(N), making AVL trees optimal for read-heavy workloads. In contrast, Red-Black trees enforce looser balance invariants using node colors (root is black, no two consecutive red nodes, equal black-height), allowing tree height up to 2 log₂(N). Because Red-Black trees require at most 2 rotations per insertion and 3 per deletion (with mostly O(1) recoloring amortized), they offer significantly higher write throughput in memory allocators and kernel schedulers.",
          commonMistakes: [
            "Thinking Red-Black trees are strictly more balanced than AVL trees",
            "Confusing color bit storage with balance factor integer storage",
          ],
          essentialConcepts: [
            "Strict height balance (AVL) vs relaxed black-height balance (RB)",
            "Rotation frequency during write-intensive workloads",
          ],
          followUp:
            "Can you state the four fundamental coloring invariants that define a valid Red-Black Tree?",
          recommendations: [
            "Cormen, Leiserson, Rivest, Stein: Introduction to Algorithms (CLRS) Chapter 13",
          ],
        },
      ],
    },
  ],
  "operating-systems": [
    {
      topic: "Virtual Memory & Page Replacement",
      difficulty: "HARD",
      questions: [
        {
          question:
            "Candidate, suppose you are teaching third-semester BS CS students about Virtual Memory. Explain Belady's Anomaly and prove why the Least Recently Used (LRU) algorithm is provably immune to it.",
          expectedKeywords: [
            "Belady's anomaly",
            "stack algorithms",
            "subset property",
            "FIFO page fault anomaly",
            "reference string",
          ],
          modelAnswer:
            "Belady's Anomaly is the counter-intuitive phenomenon where increasing the number of physical page frames allocated to a process results in an increased number of page faults under certain replacement algorithms, notably FIFO. LRU is strictly immune to Belady's Anomaly because it belongs to the mathematical class of 'Stack Algorithms'. A stack algorithm satisfies the inclusion property: the set of pages resident in memory with 'm' frames at time 't' is always a strict subset of the pages that would be resident with 'm+1' frames. Therefore, expanding memory capacity can never evict a page that smaller memory would have kept.",
          commonMistakes: [
            "Thinking LRU is implemented with a literal LIFO stack",
            "Failing to cite the subset/inclusion property",
            "Stating that Optimal replacement (OPT) suffers from Belady's Anomaly",
          ],
          essentialConcepts: [
            "Inclusion property / subset relation of stack algorithms",
            "FIFO queue eviction vs recency-based priority",
          ],
          followUp:
            "Since true hardware LRU requires costly timestamp counters or matrix shifts per memory access, how does the Linux kernel approximate LRU using the page table reference bit?",
          recommendations: [
            "Silberschatz, Galvin, Gagne: Operating System Concepts (Chapter 10: Virtual Memory)",
            "Tanenbaum: Modern Operating Systems",
          ],
        },
      ],
    },
  ],
  "algorithms": [
    {
      topic: "Asymptotic Analysis & Dynamic Programming",
      difficulty: "HARD",
      questions: [
        {
          question:
            "In undergraduate algorithm analysis, what is the theoretical lower bound for any comparison-based sorting algorithm on 'n' elements? Outline the decision-tree proof that establishes this bound.",
          expectedKeywords: [
            "Omega(n log n)",
            "decision tree height",
            "n! permutations",
            "binary tree leaves",
            "Stirling's approximation",
          ],
          modelAnswer:
            "Any comparison-based sort can be modeled as a binary decision tree where each internal node represents a comparison A[i] ≤ A[j] and each leaf represents a distinct sorted permutation of 'n' inputs. To sort correctly, the tree must contain at least n! leaves (one for each possible input permutation). A binary tree of height 'h' has at most 2^h leaves. Therefore, 2^h ≥ n!, which implies h ≥ log₂(n!). Applying Stirling's approximation (ln n! ≈ n ln n - n), we obtain h = Ω(n log n). Hence, no comparison sort can beat Ω(n log n) in the worst case.",
          commonMistakes: [
            "Confusing average-case with lower-bound proofs",
            "Asserting that QuickSort beats Ω(n log n)",
            "Failing to mention the n! required leaf permutations",
          ],
          essentialConcepts: [
            "Binary decision tree model of comparisons",
            "Leaf count matching permutation count (n!)",
            "Logarithmic relation between leaves and tree height",
          ],
          followUp:
            "How do non-comparison algorithms such as Radix Sort or Counting Sort achieve O(n) runtime without violating this lower-bound theorem?",
          recommendations: [
            "CLRS: Introduction to Algorithms, Chapter 8 (Sorting in Linear Time)",
          ],
        },
      ],
    },
  ],
  "database-management-systems": [
    {
      topic: "Transactions & Concurrency Control",
      difficulty: "HARD",
      questions: [
        {
          question:
            "Discuss the Conflict Serializability of database schedules. How does Strict Two-Phase Locking (Strict 2PL) ensure both serializability and freedom from cascading aborts?",
          expectedKeywords: [
            "Strict 2PL",
            "conflict serializability",
            "precedence graph",
            "cascading aborts",
            "exclusive lock release at commit",
          ],
          modelAnswer:
            "A schedule is conflict serializable if it is conflict-equivalent to a serial schedule, which can be verified by the absence of cycles in its conflict serialization graph. Basic Two-Phase Locking (2PL) guarantees conflict serializability by requiring transactions to acquire all locks before releasing any (growing phase followed by shrinking phase). However, basic 2PL permits cascading aborts if transaction T2 reads dirty data written by uncommitted T1. Strict 2PL resolves this by mandating that all exclusive (write) locks must be held until the transaction fully commits or aborts, ensuring that uncommitted modifications are never exposed to concurrent transactions.",
          commonMistakes: [
            "Confusing Strict 2PL with Rigorous 2PL (which also holds shared locks)",
            "Thinking deadlock is eliminated by 2PL",
          ],
          essentialConcepts: [
            "Conflict equivalence (Read-Write, Write-Read, Write-Write conflicts)",
            "Holding exclusive locks until transaction completion",
            "Prevention of dirty reads that trigger cascading rollbacks",
          ],
          followUp:
            "Does Strict 2PL prevent deadlocks? If not, what mechanism does the RDBMS engine employ to detect and recover from deadlocks?",
          recommendations: [
            "Elmasri & Navathe: Fundamentals of Database Systems",
            "Silberschatz Database Systems, Chapter 15",
          ],
        },
      ],
    },
  ],
};

// Generic fallback questions across interview types
const GENERIC_QUESTIONS_MAP: Record<InterviewTypeKey, { question: string; keywords: string[]; modelAnswer: string; followUp: string }[]> = {
  TECHNICAL_CS: [
    {
      question:
        "Explain the fundamental difference between process concurrency and thread parallelism. How does the Operating System kernel handle context switches between threads of the same process versus threads of different processes?",
      keywords: ["address space", "TLB invalidation", "cache locality", "PCB vs TCB", "kernel overhead"],
      modelAnswer:
        "Processes have separate memory address spaces, page tables, and file descriptor tables. Threads of the same process share code, data, heap, and open resources, but maintain distinct register sets, program counters, and stack pointers. A context switch between threads of the same process is lightweight because the MMU page table base register (CR3 on x86) remains untouched, avoiding Translation Lookaside Buffer (TLB) flushes and preserving CPU L1/L2 cache locality. In contrast, switching between different processes requires remapping virtual memory address spaces, flushing the TLB, and saving/restoring the full Process Control Block (PCB).",
      followUp:
        "What is the role of atomic test-and-set or compare-and-swap (CAS) instructions in building user-space spinlocks?",
    },
    {
      question:
        "In Object-Oriented Programming and C++, how does runtime polymorphism work mechanically through the Virtual Table (VTable) and Virtual Pointer (VPtr)?",
      keywords: ["vtable", "vptr", "dynamic dispatch", "indirect function call", "object memory layout"],
      modelAnswer:
        "When a class declares a virtual function, the compiler creates a static Virtual Method Table (VTable) containing function pointers to the most-derived implementations. Each instance of the class is augmented with a hidden Virtual Pointer (VPtr) pointing to this VTable. When a virtual method is invoked through a base pointer or reference (e.g. ptr->speak()), the compiled assembly dereferences the object's VPtr, offsets into the VTable, and makes an indirect jump to the target address, achieving O(1) dynamic dispatch.",
      followUp:
        "Why must a base class destructor always be declared virtual when polymorphic deletion is possible?",
    },
  ],
  SUBJECT_SPECIFIC: [
    {
      question:
        "In Computer Networks, explain why TCP implements both Flow Control and Congestion Control. Contrast the Sliding Window mechanism with Congestion Window (cwnd) additive increase / multiplicative decrease (AIMD).",
      keywords: ["flow control", "congestion control", "receiver window rwnd", "cwnd", "AIMD", "packet drop"],
      modelAnswer:
        "Flow control is an end-to-end mechanism that prevents a fast sender from overwhelming a slow receiver's buffer; it is managed by the receiver announcing its available buffer space via the TCP receive window (rwnd). Congestion control, conversely, prevents all network senders collectively from overwhelming intermediate routers and switches; it is managed sender-side via the congestion window (cwnd). The effective transmission window is min(rwnd, cwnd). AIMD gradually probes for available bandwidth by adding 1 MSS per RTT, and cuts cwnd in half upon packet loss.",
      followUp:
        "What is the significance of the TCP Three-Way Handshake, and how does TCP SYN Cookies protect against SYN Flood attacks?",
    },
  ],
  ACADEMIC: [
    {
      question:
        "Suppose you are introducing Object-Oriented Inheritance versus Composition to first-year undergraduate students. How do you explain the 'Is-A' vs 'Has-A' relationship, and why does modern software engineering advise 'Favor composition over inheritance'?",
      keywords: ["pedagogical analogy", "loose coupling", "fragile base class problem", "is-a vs has-a", "runtime flexibility"],
      modelAnswer:
        "I start with an intuitive real-world analogy: A 'SportsCar' IS-A 'Vehicle' (inheritance), but a 'Car' HAS-AN 'Engine' (composition). Inheritance creates compile-time white-box reuse with tight coupling; changing the base class risks breaking derived subclasses (the Fragile Base Class problem). Composition achieves black-box reuse by assembling components through interfaces, allowing behavior to be swapped dynamically at runtime without subclass explosion. Thus, students learn that inheritance should only be used when true substitutability (Liskov Substitution Principle) holds.",
      followUp:
        "How do you assess student comprehension in a laboratory setting when half the class struggles with pointer arithmetic in C++?",
    },
  ],
  HR: [
    {
      question:
        "As a university lecturer, if you discover that several students in your class have submitted identical programming assignments downloaded from GitHub, how do you handle the situation in accordance with academic integrity bylaws while preserving pedagogical mentorship?",
      keywords: ["academic integrity", "due process", "mentorship", "departmental committee", "scaffolding"],
      modelAnswer:
        "I handle this through a balanced two-step protocol: First, upholding statutory due process by running code-similarity tools (such as MOSS) and documenting the exact evidence without public confrontation. Second, conducting individual viva sessions with the students to determine whether the plagiarism stemmed from academic dishonesty or cognitive frustration and panic. I refer the case to the departmental unfair means committee per university rules, while offering remedial workshops on ethical coding, proper attribution, and debugging techniques so the students can redeem their learning journey.",
      followUp:
        "How would you react if an influential senior colleague asked you to change an undergraduate's failing grade on compassion grounds?",
    },
  ],
  SELECTION_COMMITTEE: [
    {
      question:
        "Candidate, as an applicant for the BPS-17 Lecturer in Computer Science, explain how you will balance undergraduate teaching loads with conducting high-impact research, particularly in an environment with limited laboratory funding.",
      keywords: ["research-teaching nexus", "open-source tooling", "undergraduate mentorship", "cloud grants", "HEC criteria"],
      modelAnswer:
        "I approach this by integrating research with teaching—the 'Research-Teaching Nexus'. In undergraduate capstone projects, I channel students toward open-source experimental platforms, cloud educational grants, and algorithm simulation rather than requiring expensive local hardware. Furthermore, by publishing in indexed HEC recognized journals and collaborating with national research groups, I stay abreast of curriculum evolutions, bringing cutting-edge research back into the lecture hall to inspire students.",
      followUp:
        "Can you concisely defend the core research methodology and primary contribution of your MS thesis?",
    },
  ],
};

// Interchangeable AI Interview Service Class
export class AIInterviewService {
  /**
   * Initializes the interview session with persona greeting and initial question
   */
  static async startInterview(params: {
    personality: InterviewerPersonalityKey;
    interviewType: InterviewTypeKey;
    subjectSlug?: string;
    topicSlug?: string;
    difficulty?: string;
  }): Promise<InitialQuestionResult> {
    const persona = INTERVIEW_PERSONAS[params.personality] || INTERVIEW_PERSONAS.SENIOR_PROFESSOR;
    const resolvedSubject = params.subjectSlug || "data-structures";

    // Check external AI provider if configured
    if (process.env.GEMINI_API_KEY) {
      try {
        const aiResult = await this.callGeminiForGreeting({
          persona,
          interviewType: params.interviewType,
          subjectSlug: resolvedSubject,
          difficulty: params.difficulty || "MEDIUM",
        });
        if (aiResult) return aiResult;
      } catch (err) {
        console.warn("External AI call failed, falling back to academic knowledge engine:", err);
      }
    }

    // Knowledge Engine fallback
    const subjectBank = ACADEMIC_KNOWLEDGE_BASE[resolvedSubject];
    if (subjectBank && subjectBank.length > 0) {
      const qData = subjectBank[0].questions[0];
      return {
        greeting: persona.sampleGreeting,
        questionText: qData.question,
        panelistName: persona.name,
        panelistRole: persona.title,
        expectedKeywords: qData.expectedKeywords,
        modelAnswer: qData.modelAnswer,
      };
    }

    // Generic fallback for interview type
    const genericList = GENERIC_QUESTIONS_MAP[params.interviewType] || GENERIC_QUESTIONS_MAP.TECHNICAL_CS;
    const genericQ = genericList[0];
    return {
      greeting: persona.sampleGreeting,
      questionText: genericQ.question,
      panelistName: persona.name,
      panelistRole: persona.title,
      expectedKeywords: genericQ.keywords,
      modelAnswer: genericQ.modelAnswer,
    };
  }

  /**
   * Evaluates the candidate's answer against the 5 rubric criteria and generates the next question or follow-up
   */
  static async evaluateResponse(params: {
    personality: InterviewerPersonalityKey;
    interviewType: InterviewTypeKey;
    subjectSlug?: string;
    currentQuestionText: string;
    expectedKeywords: string[];
    candidateAnswer: string;
    orderIndex: number;
    targetQuestionCount: number;
    difficulty: string;
  }): Promise<EvaluationResult> {
    const persona = INTERVIEW_PERSONAS[params.personality] || INTERVIEW_PERSONAS.SENIOR_PROFESSOR;

    // Check external AI provider if configured
    if (process.env.GEMINI_API_KEY) {
      try {
        const aiEvaluation = await this.callGeminiForEvaluation({
          persona,
          ...params,
        });
        if (aiEvaluation) return aiEvaluation;
      } catch (err) {
        console.warn("External AI evaluation failed, falling back to deterministic evaluation:", err);
      }
    }

    // High-Fidelity Deterministic Evaluator based on Rubric
    return this.evaluateWithAcademicEngine(params);
  }

  /**
   * Evaluates response using linguistic pattern matching and academic scoring heuristics
   */
  private static evaluateWithAcademicEngine(params: {
    personality: InterviewerPersonalityKey;
    interviewType: InterviewTypeKey;
    subjectSlug?: string;
    currentQuestionText: string;
    expectedKeywords: string[];
    candidateAnswer: string;
    orderIndex: number;
    targetQuestionCount: number;
    difficulty: string;
  }): EvaluationResult {
    const text = params.candidateAnswer.trim().toLowerCase();
    const wordCount = text.split(/\s+/).filter(Boolean).length;

    // 1. Keyword coverage
    let matchedKeywords = 0;
    const missingConcepts: string[] = [];

    for (const kw of params.expectedKeywords) {
      if (text.includes(kw.toLowerCase())) {
        matchedKeywords++;
      } else {
        missingConcepts.push(kw);
      }
    }

    const keywordRatio = params.expectedKeywords.length > 0 ? matchedKeywords / params.expectedKeywords.length : 0.7;

    // 2. Technical Accuracy (40% Weight)
    let technicalAccuracy = Math.round(keywordRatio * 75 + Math.min(25, wordCount > 50 ? 25 : wordCount * 0.5));
    technicalAccuracy = Math.max(20, Math.min(98, technicalAccuracy));

    // 3. Conceptual Understanding (25% Weight)
    let conceptualUnderstanding = Math.round(
      technicalAccuracy * 0.9 + (wordCount > 70 ? 10 : 0) - (missingConcepts.length > 2 ? 10 : 0)
    );
    conceptualUnderstanding = Math.max(20, Math.min(98, conceptualUnderstanding));

    // 4. Communication & Tone (15% Weight)
    let communication = 75;
    if (wordCount >= 40 && wordCount <= 250) communication = 88;
    if (wordCount < 25) communication = 45;
    if (/\b(because|therefore|furthermore|specifically|in contrast|consequently)\b/i.test(text)) {
      communication += 7;
    }
    communication = Math.min(95, communication);

    // 5. Answer Structure (10% Weight)
    let answerStructure = 70;
    if (/\b(first|second|moreover|finally|in conclusion)\b/i.test(text) || text.includes("\n") || text.includes(".")) {
      answerStructure += 18;
    }
    if (wordCount < 30) answerStructure -= 20;
    answerStructure = Math.max(30, Math.min(95, answerStructure));

    // 6. Problem Solving / Pedagogical Poise (10% Weight)
    let problemSolving = Math.round((technicalAccuracy * 0.5) + (communication * 0.5));
    problemSolving = Math.max(25, Math.min(95, problemSolving));

    // Weighted Score Calculation
    // Accuracy (40%) + Conceptual (25%) + Communication (15%) + Structure (10%) + Problem Solving (10%)
    const weightedScore = parseFloat(
      (
        technicalAccuracy * 0.4 +
        conceptualUnderstanding * 0.25 +
        communication * 0.15 +
        answerStructure * 0.1 +
        problemSolving * 0.1
      ).toFixed(1)
    );

    // Technical Mistakes Identification
    const technicalMistakes: string[] = [];
    if (technicalAccuracy < 60) {
      technicalMistakes.push("Superficial coverage of underlying mechanical and memory structures.");
    }
    if (missingConcepts.length > 1) {
      technicalMistakes.push(`Omitted critical academic terms: ${missingConcepts.slice(0, 3).join(", ")}.`);
    }
    if (wordCount < 30) {
      technicalMistakes.push("Answer is overly brief and lacks university-level academic depth.");
    }

    // Determine follow-up need
    const isFollowUp = technicalAccuracy < 65 && params.orderIndex < params.targetQuestionCount;
    let followUpQuestion: string | null = null;
    let nextQuestion: string | null = null;
    const isCompleted = params.orderIndex >= params.targetQuestionCount && !isFollowUp;

    if (isFollowUp) {
      followUpQuestion = `You mentioned the broad concept, but can you specifically explain how this interacts with ${
        missingConcepts[0] || "memory hardware and runtime constraints"
      }?`;
    } else if (!isCompleted) {
      // Pick next question from bank
      const bank = ACADEMIC_KNOWLEDGE_BASE[params.subjectSlug || "data-structures"];
      if (bank && bank[0].questions.length > 1) {
        nextQuestion = bank[0].questions[1].question;
      } else {
        const genericList = GENERIC_QUESTIONS_MAP[params.interviewType] || GENERIC_QUESTIONS_MAP.TECHNICAL_CS;
        nextQuestion = genericList[1]?.question || genericList[0].question;
      }
    }

    const critique =
      weightedScore >= 80
        ? "Excellent viva performance. You demonstrated authoritative mastery of foundational computing theory, academic articulation, and structured technical reasoning."
        : weightedScore >= 65
        ? "Solid performance. You correctly identified the primary mechanisms, though deeper citations and mechanical proof steps will strengthen your standing before the Selection Board."
        : "Borderline response. While you grasped the broad notion, your answer lacked technical specificity and omitted critical architectural concepts expected of a university lecturer.";

    return {
      technicalAccuracy,
      conceptualUnderstanding,
      communication,
      answerStructure,
      problemSolving,
      weightedScore,
      technicalMistakes,
      missingConcepts: missingConcepts.slice(0, 4),
      critique,
      isFollowUp,
      followUpQuestion,
      nextQuestion,
      isCompleted,
      modelAnswer:
        "An exemplary answer should state: 1) Formal definition, 2) Exact asymptotic time/space or architectural constraints, 3) Real-world operational trade-offs, and 4) An intuitive analogy appropriate for undergraduate lecture scaffolding.",
      studyRecommendations: [
        "Review Standard HEC Computer Science Curriculum 2025 guidelines.",
        "Practice oral blackboard teaching and concise definition proofs under timed conditions.",
      ],
    };
  }

  /**
   * Calls Google Gemini API if configured via environment variables
   */
  private static async callGeminiForGreeting(params: {
    persona: typeof INTERVIEW_PERSONAS.SENIOR_PROFESSOR;
    interviewType: InterviewTypeKey;
    subjectSlug: string;
    difficulty: string;
  }): Promise<InitialQuestionResult | null> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return null;

    const systemPrompt = `You are an AI simulating a university lecturer viva voce selection board in Pakistan.
Persona: ${params.persona.name} (${params.persona.title}, ${params.persona.institution}).
Style: ${params.persona.interviewStyle}. Tone: ${params.persona.tone}.
Interview Type: ${params.interviewType}. Subject: ${params.subjectSlug}. Difficulty: ${params.difficulty}.

Return strict JSON only in this schema:
{
  "greeting": "Formal opening greeting to the candidate",
  "questionText": "The first high-yield academic interview question",
  "panelistName": "${params.persona.name}",
  "panelistRole": "${params.persona.title}",
  "expectedKeywords": ["keyword1", "keyword2", "keyword3"],
  "modelAnswer": "Complete ideal lecturer-level answer"
}`;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: systemPrompt }] }],
          generationConfig: { responseMimeType: "application/json" },
        }),
      }
    );

    if (!res.ok) return null;
    const json = await res.json();
    const candidateText = json.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidateText) return null;

    const parsed = JSON.parse(candidateText);
    const validated = InitialQuestionSchema.parse(parsed);
    return validated;
  }

  /**
   * Calls Google Gemini API for structured evaluation
   */
  private static async callGeminiForEvaluation(params: {
    persona: typeof INTERVIEW_PERSONAS.SENIOR_PROFESSOR;
    interviewType: InterviewTypeKey;
    subjectSlug?: string;
    currentQuestionText: string;
    expectedKeywords: string[];
    candidateAnswer: string;
    orderIndex: number;
    targetQuestionCount: number;
    difficulty: string;
  }): Promise<EvaluationResult | null> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return null;

    const prompt = `You are evaluating a university lecturer applicant's oral viva response.
Interviewer: ${params.persona.name} (${params.persona.title}).
Question Asked: "${params.currentQuestionText}"
Candidate's Answer: "${params.candidateAnswer}"
Expected Concepts: ${params.expectedKeywords.join(", ")}
Progress: Question ${params.orderIndex} of ${params.targetQuestionCount}.

Strict Evaluation Rubric:
1. Technical Accuracy (40% Weight): 0-100
2. Conceptual Understanding (25% Weight): 0-100
3. Communication & Tone (15% Weight): 0-100
4. Answer Structure (10% Weight): 0-100
5. Problem Solving (10% Weight): 0-100

Return ONLY strict valid JSON conforming to:
{
  "technicalAccuracy": number,
  "conceptualUnderstanding": number,
  "communication": number,
  "answerStructure": number,
  "problemSolving": number,
  "weightedScore": number,
  "technicalMistakes": ["list of errors"],
  "missingConcepts": ["list of missing concepts"],
  "critique": "Formal selection board critique",
  "isFollowUp": boolean,
  "followUpQuestion": string or null,
  "nextQuestion": string or null,
  "isCompleted": boolean,
  "modelAnswer": "High-scoring ideal model answer",
  "studyRecommendations": ["Topic 1", "Topic 2"]
}`;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: "application/json" },
        }),
      }
    );

    if (!res.ok) return null;
    const json = await res.json();
    const candidateText = json.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidateText) return null;

    const parsed = JSON.parse(candidateText);
    const validated = EvaluationResultSchema.parse(parsed);
    return validated;
  }
}
