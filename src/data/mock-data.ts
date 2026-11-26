export interface CSSubject {
  id: string;
  slug: string;
  title: string;
  code: string;
  iconName: string;
  weightage: string;
  commissionFrequency: "Critical" | "High" | "Medium";
  description: string;
  totalMCQs: number;
  totalVivaQuestions: number;
  topicsCount: number;
  recommendedBooks: string[];
  topics: {
    id: string;
    name: string;
    difficulty: "Easy" | "Medium" | "Hard";
    vivaQuestions: number;
    mcqs: number;
  }[];
  sampleViva: {
    question: string;
    expectedAnswer: string;
    examinerTip: string;
  }[];
}

export const CS_SUBJECTS: CSSubject[] = [
  {
    id: "cs-dsa",
    slug: "data-structures-algorithms",
    title: "Data Structures & Algorithms",
    code: "CS-401",
    iconName: "Binary",
    weightage: "18-22%",
    commissionFrequency: "Critical",
    description: "Core algorithmic complexity, asymptotic analysis, balanced search trees, graph algorithms, dynamic programming, and memory layouts.",
    totalMCQs: 2450,
    totalVivaQuestions: 380,
    topicsCount: 14,
    recommendedBooks: ["Introduction to Algorithms (CLRS)", "Data Structures and Algorithm Analysis in C++ (Mark Allen Weiss)"],
    topics: [
      { id: "dsa-1", name: "Asymptotic Notations & Master Theorem", difficulty: "Medium", vivaQuestions: 28, mcqs: 180 },
      { id: "dsa-2", name: "Balanced Trees (AVL, Red-Black, B/B+ Trees)", difficulty: "Hard", vivaQuestions: 42, mcqs: 240 },
      { id: "dsa-3", name: "Graph Traversals (BFS, DFS, Dijkstra, Bellman-Ford)", difficulty: "Hard", vivaQuestions: 36, mcqs: 210 },
      { id: "dsa-4", name: "Dynamic Programming vs Greedy Approach", difficulty: "Hard", vivaQuestions: 34, mcqs: 195 },
      { id: "dsa-5", name: "Hash Tables & Collision Resolution Techniques", difficulty: "Medium", vivaQuestions: 26, mcqs: 170 },
      { id: "dsa-6", name: "Heaps & Priority Queues", difficulty: "Medium", vivaQuestions: 20, mcqs: 150 },
    ],
    sampleViva: [
      {
        question: "Why do relational database engines use B+ Trees rather than AVL or Red-Black Trees for index implementation?",
        expectedAnswer: "B+ Trees are multi-way search trees optimized for block storage/disk I/O. They have high fan-out, reducing tree height so search requires very few disk seeks. Furthermore, all data is in leaf nodes linked sequentially, making range queries highly efficient.",
        examinerTip: "Emphasize disk block cache vs RAM cache locality and range scan sequential pointer traversing."
      },
      {
        question: "Can Master Theorem solve T(n) = 2T(n/2) + n*log(n)? Explain why or why not.",
        expectedAnswer: "No, the standard Master Theorem cannot solve this because the ratio f(n) / n^(log_b(a)) = n*log(n)/n = log(n), which is not polynomially larger than 1. You must use Akra-Bazzi or recursion tree method, yielding Theta(n * log^2(n)).",
        examinerTip: "Commission viva examiners frequently test polynomial vs polylogarithmic growth gaps."
      }
    ]
  },
  {
    id: "cs-os",
    slug: "operating-systems",
    title: "Operating Systems & Systems Programming",
    code: "CS-402",
    iconName: "Cpu",
    weightage: "15-18%",
    commissionFrequency: "Critical",
    description: "Kernel architecture, process synchronization, CPU scheduling algorithms, deadlock handling, virtual memory management, and file systems.",
    totalMCQs: 2100,
    totalVivaQuestions: 320,
    topicsCount: 12,
    recommendedBooks: ["Operating System Concepts (Silberschatz, Galvin)", "Modern Operating Systems (Andrew S. Tanenbaum)"],
    topics: [
      { id: "os-1", name: "Process Synchronization & Semaphores", difficulty: "Hard", vivaQuestions: 38, mcqs: 220 },
      { id: "os-2", name: "Virtual Memory & Page Replacement Algorithms", difficulty: "Hard", vivaQuestions: 40, mcqs: 260 },
      { id: "os-3", name: "Deadlock Prevention, Avoidance (Banker's Algorithm)", difficulty: "Medium", vivaQuestions: 30, mcqs: 190 },
      { id: "os-4", name: "CPU Scheduling (Preemptive vs Non-Preemptive)", difficulty: "Medium", vivaQuestions: 24, mcqs: 175 },
      { id: "os-5", name: "Inter-Process Communication (Pipes, Sockets, Shared Memory)", difficulty: "Medium", vivaQuestions: 22, mcqs: 140 },
    ],
    sampleViva: [
      {
        question: "What is Belady's Anomaly and which page replacement algorithm is immune to it?",
        expectedAnswer: "Belady's anomaly occurs when increasing the number of page frames results in an increase in the number of page faults. It occurs in FIFO. Stack algorithms such as LRU and Optimal are strictly immune because the set of pages in memory for n frames is always a subset of pages in n+1 frames.",
        examinerTip: "State the definition of a 'stack algorithm' mathematically to impress academic selection boards."
      }
    ]
  },
  {
    id: "cs-dbms",
    slug: "database-management-systems",
    title: "Database Management Systems & SQL",
    code: "CS-403",
    iconName: "Database",
    weightage: "12-15%",
    commissionFrequency: "Critical",
    description: "Relational algebra, normalization (1NF through 5NF/BCNF), ACID properties, transaction concurrency control, 2PL, WAL, and query optimization.",
    totalMCQs: 1850,
    totalVivaQuestions: 290,
    topicsCount: 10,
    recommendedBooks: ["Database System Concepts (Korth, Silberschatz)", "Fundamentals of Database Systems (Elmasri & Navathe)"],
    topics: [
      { id: "db-1", name: "Relational Normalization & Functional Dependencies", difficulty: "Hard", vivaQuestions: 45, mcqs: 280 },
      { id: "db-2", name: "ACID Transactions & Two-Phase Locking (2PL)", difficulty: "Hard", vivaQuestions: 35, mcqs: 210 },
      { id: "db-3", name: "Query Optimization & Execution Plans", difficulty: "Medium", vivaQuestions: 28, mcqs: 160 },
      { id: "db-4", name: "NoSQL Architectures vs Relational Integrity", difficulty: "Medium", vivaQuestions: 22, mcqs: 130 },
    ],
    sampleViva: [
      {
        question: "Differentiate between 3NF and BCNF with a concrete counterexample where a relation is in 3NF but fails BCNF.",
        expectedAnswer: "A table is in 3NF if for every functional dependency X -> A, either X is a superkey or A is a prime attribute. BCNF removes the second relaxation: X must strictly be a superkey. An example is (Student, Subject, Teacher) where each teacher teaches one subject and students have teachers for subjects.",
        examinerTip: "Draw or verbally articulate functional dependencies cleanly and specify overlapping candidate keys."
      }
    ]
  },
  {
    id: "cs-networks",
    slug: "computer-networks",
    title: "Computer Networks & Network Security",
    code: "CS-404",
    iconName: "Network",
    weightage: "12-14%",
    commissionFrequency: "High",
    description: "OSI & TCP/IP stack, sliding window protocols, subnetting VLSM/CIDR, routing protocols (OSPF, BGP), TCP flow & congestion control, SSL/TLS, IPSec.",
    totalMCQs: 1950,
    totalVivaQuestions: 270,
    topicsCount: 11,
    recommendedBooks: ["Computer Networking: A Top-Down Approach (Kurose & Ross)", "Computer Networks (Tanenbaum)"],
    topics: [
      { id: "net-1", name: "Subnetting, CIDR & Variable Length Subnet Masking", difficulty: "Hard", vivaQuestions: 30, mcqs: 310 },
      { id: "net-2", name: "TCP 3-Way Handshake & Congestion Control (Tahoe, Reno)", difficulty: "Medium", vivaQuestions: 32, mcqs: 200 },
      { id: "net-3", name: "Routing Protocols (Link State vs Distance Vector)", difficulty: "Medium", vivaQuestions: 25, mcqs: 180 },
      { id: "net-4", name: "Application Protocols (DNS, HTTP/2, HTTPS, TLS Handshake)", difficulty: "Medium", vivaQuestions: 28, mcqs: 190 },
    ],
    sampleViva: [
      {
        question: "What is the COUNT-TO-INFINITY problem in Distance Vector routing and how does Split Horizon with Poison Reverse alleviate it?",
        expectedAnswer: "It occurs when a link fails, and adjacent routers slowly increment hop counts in routing loops because updates propagate slowly. Split Horizon prevents a router from advertising a route back on the interface from which it learned it; Poison Reverse explicitly advertises that route as infinity (16 hops in RIP).",
        examinerTip: "Mention Bellman-Ford equation convergence time and loop avoidance."
      }
    ]
  },
  {
    id: "cs-se",
    slug: "software-engineering",
    title: "Software Engineering & Architecture",
    code: "CS-405",
    iconName: "Layers",
    weightage: "10-12%",
    commissionFrequency: "High",
    description: "Software lifecycles, Agile/Scrum, requirements engineering, Gang of Four design patterns, Clean Architecture, unit/integration testing, CI/CD.",
    totalMCQs: 1400,
    totalVivaQuestions: 210,
    topicsCount: 9,
    recommendedBooks: ["Software Engineering: A Practitioner's Approach (Pressman)", "Design Patterns (GoF)"],
    topics: [
      { id: "se-1", name: "Design Patterns (Creational, Structural, Behavioral)", difficulty: "Hard", vivaQuestions: 36, mcqs: 190 },
      { id: "se-2", name: "SOLID Principles & Clean Code Architecture", difficulty: "Medium", vivaQuestions: 32, mcqs: 180 },
      { id: "se-3", name: "Agile vs Waterfall & Scrum Ceremony Metrics", difficulty: "Easy", vivaQuestions: 20, mcqs: 140 },
    ],
    sampleViva: [
      {
        question: "Explain the Liskov Substitution Principle (LSP) and how violating it damages polymorphic software.",
        expectedAnswer: "Subtypes must be substitutable for their base types without altering program correctness. Violating LSP (such as a Square inheriting from Rectangle and overriding setWidth) leads to runtime surprises and breaks client expectations.",
        examinerTip: "Selection boards appreciate examples with class hierarchies."
      }
    ]
  },
  {
    id: "cs-oop",
    slug: "object-oriented-programming",
    title: "Object-Oriented Programming (C++, Java, Python)",
    code: "CS-406",
    iconName: "Code",
    weightage: "10-12%",
    commissionFrequency: "High",
    description: "Inheritance, runtime polymorphism, virtual method tables (vtable), templates/generics, memory management (pointers, references, smart pointers, garbage collection).",
    totalMCQs: 1600,
    totalVivaQuestions: 250,
    topicsCount: 8,
    recommendedBooks: ["The C++ Programming Language (Bjarne Stroustrup)", "Effective Java (Joshua Bloch)"],
    topics: [
      { id: "oop-1", name: "Virtual Functions & Virtual Method Table (vtable) Internals", difficulty: "Hard", vivaQuestions: 40, mcqs: 220 },
      { id: "oop-2", name: "Diamond Problem & Virtual Inheritance in C++", difficulty: "Medium", vivaQuestions: 28, mcqs: 160 },
      { id: "oop-3", name: "RAII, Smart Pointers & Move Semantics", difficulty: "Hard", vivaQuestions: 30, mcqs: 180 },
    ],
    sampleViva: [
      {
        question: "How does the C++ compiler implement runtime polymorphism under the hood?",
        expectedAnswer: "The compiler constructs a Virtual Method Table (vtable) containing function pointers for classes with virtual functions. Each object instance stores a hidden vpointer (vptr) pointing to its class vtable. Dynamic dispatch resolves function calls at runtime via this pointer offset.",
        examinerTip: "Mention the slight memory overhead (1 pointer per instance) and cache indirection."
      }
    ]
  },
  {
    id: "cs-automata",
    slug: "theory-of-automata",
    title: "Theory of Automata & Formal Languages",
    code: "CS-407",
    iconName: "Terminal",
    weightage: "8-10%",
    commissionFrequency: "High",
    description: "Regular languages, DFA/NFA equivalence, pumping lemma, Context-Free Grammars (CFG), Pushdown Automata (PDA), Turing Machines, and Chomsky Hierarchy.",
    totalMCQs: 1250,
    totalVivaQuestions: 180,
    topicsCount: 8,
    recommendedBooks: ["Introduction to the Theory of Computation (Michael Sipser)", "Automata Theory (Hopcroft, Motwani, Ullman)"],
    topics: [
      { id: "auto-1", name: "DFA, NFA Equivalence & Subset Construction", difficulty: "Medium", vivaQuestions: 26, mcqs: 170 },
      { id: "auto-2", name: "Pumping Lemma for Regular & Context-Free Languages", difficulty: "Hard", vivaQuestions: 32, mcqs: 190 },
      { id: "auto-3", name: "Turing Machines & Halting Problem Undecidability", difficulty: "Hard", vivaQuestions: 28, mcqs: 150 },
    ],
    sampleViva: [
      {
        question: "Prove or sketch why the Halting Problem is undecidable using diagonalization or contradiction.",
        expectedAnswer: "Assume a Turing machine H exists that decides if any program M halts on input w. Construct machine D that takes M as input, runs H(M, M), and does the opposite: if H says halts, D loops forever; if H says loops, D halts. Running D(D) yields an irreconcilable logical paradox.",
        examinerTip: "Connect this with Gödel's Incompleteness Theorem for bonus academic credibility."
      }
    ]
  },
  {
    id: "cs-ai",
    slug: "artificial-intelligence-machine-learning",
    title: "Artificial Intelligence & Machine Learning",
    code: "CS-408",
    iconName: "Sparkles",
    weightage: "8-10%",
    commissionFrequency: "Medium",
    description: "Search algorithms (A*, minimax, alpha-beta pruning), knowledge representation, supervised vs unsupervised learning, gradient descent, neural networks, LLM basics.",
    totalMCQs: 1300,
    totalVivaQuestions: 210,
    topicsCount: 8,
    recommendedBooks: ["Artificial Intelligence: A Modern Approach (Russell & Norvig)", "Pattern Recognition and Machine Learning (Bishop)"],
    topics: [
      { id: "ai-1", name: "Heuristic Search (A*, Admissibility & Consistency)", difficulty: "Medium", vivaQuestions: 30, mcqs: 170 },
      { id: "ai-2", name: "Neural Network Backpropagation & Activation Functions", difficulty: "Hard", vivaQuestions: 35, mcqs: 190 },
      { id: "ai-3", name: "Bias-Variance Tradeoff & Regularization (L1/L2)", difficulty: "Medium", vivaQuestions: 25, mcqs: 160 },
    ],
    sampleViva: [
      {
        question: "What does it mean for a heuristic in A* search to be admissible vs consistent?",
        expectedAnswer: "Admissible means the heuristic never overestimates the true cost to reach the goal (h(n) <= h*(n)). Consistent (or monotonic) means for every node n and neighbor n', h(n) <= c(n, a, n') + h(n'). Consistency guarantees that when a node is expanded, the path found is optimal without re-opening closed nodes.",
        examinerTip: "Clearly differentiate tree search (needs admissibility) from graph search (needs consistency)."
      }
    ]
  },
  {
    id: "cs-arch",
    slug: "computer-architecture-dld",
    title: "Computer Architecture & Digital Logic (DLD)",
    code: "CS-409",
    iconName: "Monitor",
    weightage: "8-10%",
    commissionFrequency: "Medium",
    description: "Boolean algebra, Karnaugh maps, combinatorial & sequential circuits, pipelining hazards (structural, data, control), cache mapping, RISC vs CISC.",
    totalMCQs: 1450,
    totalVivaQuestions: 190,
    topicsCount: 9,
    recommendedBooks: ["Computer Organization and Design (Patterson & Hennessy)", "Digital Design (M. Morris Mano)"],
    topics: [
      { id: "arch-1", name: "Instruction Pipelining & Branch Hazard Mitigation", difficulty: "Hard", vivaQuestions: 32, mcqs: 180 },
      { id: "arch-2", name: "Cache Memory Organization (Direct, Set Associative, Fully Associative)", difficulty: "Hard", vivaQuestions: 34, mcqs: 210 },
      { id: "arch-3", name: "K-Maps & State Machine Synthesis", difficulty: "Medium", vivaQuestions: 22, mcqs: 160 },
    ],
    sampleViva: [
      {
        question: "Explain the three pipeline hazards (RAW, WAR, WAW) and how forwarding solves RAW hazard.",
        expectedAnswer: "RAW (Read After Write) is true data dependency; WAR (Write After Read) and WAW (Write After Write) are name dependencies. Forwarding routes calculated values directly from ALU or memory pipeline stage outputs back to the ALU input without waiting for register write-back.",
        examinerTip: "Illustrate with a 5-stage MIPS pipeline diagram."
      }
    ]
  },
  {
    id: "cs-compiler",
    slug: "compiler-construction",
    title: "Compiler Construction",
    code: "CS-410",
    iconName: "FileCode",
    weightage: "6-8%",
    commissionFrequency: "Medium",
    description: "Lexical analysis, syntax analysis (LL vs LR parsers, Shift-Reduce), intermediate representation (3AC), symbol table architecture, code optimization.",
    totalMCQs: 980,
    totalVivaQuestions: 140,
    topicsCount: 7,
    recommendedBooks: ["Compilers: Principles, Techniques, and Tools (Dragon Book)"],
    topics: [
      { id: "comp-1", name: "Top-Down (LL(1)) vs Bottom-Up (LR(0), SLR, LALR, CLR) Parsing", difficulty: "Hard", vivaQuestions: 34, mcqs: 190 },
      { id: "comp-2", name: "Symbol Table Management & Scope Resolution", difficulty: "Medium", vivaQuestions: 20, mcqs: 130 },
      { id: "comp-3", name: "Three-Address Code & Peephole Optimization", difficulty: "Medium", vivaQuestions: 18, mcqs: 120 },
    ],
    sampleViva: [
      {
        question: "Why is LALR(1) parser preferred in tools like YACC/Bison over Canonical LR(1)?",
        expectedAnswer: "Canonical LR(1) produces an enormous number of parsing states (often thousands), making memory footprint prohibitive. LALR(1) merges states with identical core items, drastically reducing state table size while preserving virtually all necessary grammar parsing power without introducing shift-reduce conflicts.",
        examinerTip: "Mention that LALR may introduce reduce-reduce conflicts when merging states."
      }
    ]
  },
  {
    id: "cs-cloud",
    slug: "web-cloud-technologies",
    title: "Web Technologies & Cloud Computing",
    code: "CS-411",
    iconName: "Globe",
    weightage: "6-8%",
    commissionFrequency: "Medium",
    description: "Client-server architecture, RESTful API design, microservices vs monoliths, virtualization, containerization (Docker, Kubernetes), cloud models (IaaS, PaaS, SaaS).",
    totalMCQs: 1100,
    totalVivaQuestions: 160,
    topicsCount: 7,
    recommendedBooks: ["Distributed Systems: Principles and Paradigms (Tanenbaum)", "Cloud Computing Concepts (Thomas Erl)"],
    topics: [
      { id: "cloud-1", name: "Docker Containerization vs Virtual Machines", difficulty: "Easy", vivaQuestions: 24, mcqs: 150 },
      { id: "cloud-2", name: "CAP Theorem & Distributed Consensus", difficulty: "Hard", vivaQuestions: 30, mcqs: 170 },
      { id: "cloud-3", name: "REST vs GraphQL Architecture", difficulty: "Medium", vivaQuestions: 22, mcqs: 140 },
    ],
    sampleViva: [
      {
        question: "Explain the CAP theorem and why a distributed system can only guarantee two out of Consistency, Availability, and Partition Tolerance.",
        expectedAnswer: "In a network partition (unavoidable in real distributed networks), nodes cannot communicate. The system must choose between returning outdated data to remain available (AP) or refusing requests/timing out until synchronization to remain consistent (CP).",
        examinerTip: "Cite real systems like DynamoDB (AP) vs Spanner/Postgres (CP)."
      }
    ]
  },
  {
    id: "cs-sec",
    slug: "information-security",
    title: "Information Security & Cryptography",
    code: "CS-412",
    iconName: "ShieldCheck",
    weightage: "6-8%",
    commissionFrequency: "Medium",
    description: "Symmetric vs asymmetric ciphers (AES, RSA, ECC), cryptographic hashing, digital signatures, public key infrastructure (PKI), OWASP Top 10 vulnerabilities.",
    totalMCQs: 1050,
    totalVivaQuestions: 150,
    topicsCount: 7,
    recommendedBooks: ["Cryptography and Network Security (William Stallings)"],
    topics: [
      { id: "sec-1", name: "RSA Mathematics & Modular Arithmetic", difficulty: "Hard", vivaQuestions: 28, mcqs: 160 },
      { id: "sec-2", name: "SQL Injection & Cross-Site Scripting (XSS) Mitigation", difficulty: "Medium", vivaQuestions: 24, mcqs: 150 },
      { id: "sec-3", name: "Diffie-Hellman Key Exchange & Man-in-the-Middle Attack", difficulty: "Medium", vivaQuestions: 26, mcqs: 140 },
    ],
    sampleViva: [
      {
        question: "How does the Diffie-Hellman key exchange enable two parties to agree on a secret over an unencrypted channel?",
        expectedAnswer: "Both parties agree on public prime p and base g. Alice picks private a and sends g^a mod p; Bob picks private b and sends g^b mod p. Alice computes (g^b)^a mod p and Bob computes (g^a)^b mod p. Eavesdropper cannot deduce the shared key due to the Discrete Logarithm Problem difficulty.",
        examinerTip: "Point out why DH is vulnerable to MITM if unauthenticated."
      }
    ]
  }
];

export interface CommissionExam {
  id: string;
  name: string;
  code: string;
  commission: "PPSC" | "FPSC" | "KPPSC" | "SPSC" | "BPSC";
  scale: string;
  post: string;
  totalMarks: number;
  durationMinutes: number;
  negativeMarking: number;
  syllabusBreakdown: {
    section: string;
    weightage: string;
    description: string;
  }[];
  upcomingDate: string;
  daysRemaining: number;
}

export const TARGET_COMMISSIONS: CommissionExam[] = [
  {
    id: "ppsc-cs-lecturer",
    name: "PPSC Punjab CS Lecturer",
    code: "BS-17",
    commission: "PPSC",
    scale: "BPS-17 (Higher Education Department)",
    post: "Lecturer Computer Science (Male/Female)",
    totalMarks: 100,
    durationMinutes: 90,
    negativeMarking: 0.25,
    syllabusBreakdown: [
      { section: "Subject Qualification (CS)", weightage: "80%", description: "Core Computer Science & IT BS/MSc Syllabus" },
      { section: "General Knowledge & Pedagogy", weightage: "20%", description: "Pakistan Affairs, Current Affairs, Everyday Science, Basic English, Teaching Aptitude" },
    ],
    upcomingDate: "2026-06-15",
    daysRemaining: 42,
  },
  {
    id: "fpsc-cs-lecturer",
    name: "FPSC Federal CS Lecturer",
    code: "BS-17",
    commission: "FPSC",
    scale: "BPS-17 (Federal Government Colleges)",
    post: "Lecturer in Computer Science (F.4-Series)",
    totalMarks: 100,
    durationMinutes: 100,
    negativeMarking: 0.0,
    syllabusBreakdown: [
      { section: "English Comprehension", weightage: "20%", description: "Grammar usage, sentence structuring, academic vocabulary" },
      { section: "Subject Qualification (CS)", weightage: "50%", description: "Data Structures, Algorithms, OS, DBMS, Networks, OOP, AI" },
      { section: "Professional Teaching / Pedagogy", weightage: "30%", description: "Teaching techniques, methodology, classroom management, testing & evaluation" },
    ],
    upcomingDate: "2026-07-20",
    daysRemaining: 77,
  },
  {
    id: "spsc-cs-lecturer",
    name: "SPSC Sindh CS Lecturer",
    code: "BPS-17",
    commission: "SPSC",
    scale: "BPS-17 (College Education Department)",
    post: "Lecturer Computer Science",
    totalMarks: 100,
    durationMinutes: 90,
    negativeMarking: 0.25,
    syllabusBreakdown: [
      { section: "CS Core Subjects", weightage: "80%", description: "CS Curricula approved by HEC" },
      { section: "General Aptitude", weightage: "20%", description: "English and General Knowledge" },
    ],
    upcomingDate: "2026-08-10",
    daysRemaining: 98,
  },
  {
    id: "kppsc-cs-lecturer",
    name: "KPPSC Khyber Pakhtunkhwa Lecturer",
    code: "BPS-17",
    commission: "KPPSC",
    scale: "BPS-17 (Higher Education Department KPK)",
    post: "Lecturer Computer Science",
    totalMarks: 45,
    durationMinutes: 60,
    negativeMarking: 0.0,
    syllabusBreakdown: [
      { section: "Computer Science Specialization", weightage: "100%", description: "Master / BS level CS concepts screening test" },
    ],
    upcomingDate: "2026-09-05",
    daysRemaining: 124,
  }
];

export interface MockQuestion {
  id: string;
  subjectSlug: string;
  topicId: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  referenceBook: string;
  pastPaperTag?: string;
  difficulty: "Easy" | "Medium" | "Hard";
}

export const SAMPLE_MCQS: MockQuestion[] = [
  {
    id: "mcq-1",
    subjectSlug: "data-structures-algorithms",
    topicId: "dsa-2",
    question: "What is the maximum number of nodes in an AVL tree of height h (where height of a single root node is 0)?",
    options: [
      "2^(h+1) - 1",
      "2^h",
      "Fibonacci(h+2) - 1",
      "2^(h-1) + 1"
    ],
    correctOptionIndex: 0,
    explanation: "The maximum number of nodes in an AVL tree of height h is achieved when the tree is a complete and full binary tree, which contains 2^(h+1) - 1 nodes. Conversely, the minimum number of nodes follows Fibonacci recurrence.",
    referenceBook: "Mark Allen Weiss - Data Structures and Algorithm Analysis, Ch. 4",
    pastPaperTag: "PPSC CS Lecturer 2020",
    difficulty: "Medium"
  },
  {
    id: "mcq-2",
    subjectSlug: "operating-systems",
    topicId: "os-2",
    question: "Which of the following page replacement algorithms does NOT suffer from Belady's Anomaly?",
    options: [
      "First-In First-Out (FIFO)",
      "Least Recently Used (LRU)",
      "Second-Chance Page Replacement",
      "Random Replacement"
    ],
    correctOptionIndex: 1,
    explanation: "LRU is a stack algorithm. For any stack algorithm, the set of pages in memory for n frames is always a subset of the pages in memory for n+1 frames. Therefore, increasing frames can never increase page faults in LRU.",
    referenceBook: "Silberschatz - Operating System Concepts 10th Ed, Section 10.4",
    pastPaperTag: "FPSC Lecturer CS 2022",
    difficulty: "Medium"
  },
  {
    id: "mcq-3",
    subjectSlug: "database-management-systems",
    topicId: "db-1",
    question: "A relation R(A, B, C, D) has functional dependencies {AB -> C, C -> D, D -> A}. What are the candidate keys of R?",
    options: [
      "AB only",
      "AB, BC, BD",
      "AB, CD",
      "A, B, C, D"
    ],
    correctOptionIndex: 1,
    explanation: "Compute closures: (AB)+ = ABCD (Candidate key). Since D -> A, replacing A with D yields (BD)+ = ABCD (Candidate key). Since C -> D, replacing D with C yields (BC)+ = ABCD (Candidate key). Thus AB, BC, BD are candidate keys.",
    referenceBook: "Navathe & Elmasri - Fundamentals of Database Systems, Ch. 14",
    pastPaperTag: "PPSC CS Lecturer 2022",
    difficulty: "Hard"
  },
  {
    id: "mcq-4",
    subjectSlug: "computer-networks",
    topicId: "net-1",
    question: "Given the IP address 172.16.45.14 / 22, what is the valid broadcast address of the subnetwork?",
    options: [
      "172.16.45.255",
      "172.16.47.255",
      "172.16.48.255",
      "172.16.63.255"
    ],
    correctOptionIndex: 1,
    explanation: "With /22 mask, the third octet mask is 255.255.252.0. Block size in the 3rd octet is 256 - 252 = 4. Multiples of 4 are 0, 4, ..., 44, 48. Since 45 is between 44 and 48, the network ID is 172.16.44.0 and the broadcast address is 172.16.47.255.",
    referenceBook: "Kurose & Ross - Computer Networking 8th Ed, Ch. 4",
    pastPaperTag: "PPSC Lecturer 2024",
    difficulty: "Hard"
  },
  {
    id: "mcq-5",
    subjectSlug: "software-engineering",
    topicId: "se-1",
    question: "Which Gang of Four (GoF) design pattern attaches additional responsibilities to an object dynamically without modifying its underlying class?",
    options: [
      "Adapter Pattern",
      "Decorator Pattern",
      "Proxy Pattern",
      "Composite Pattern"
    ],
    correctOptionIndex: 1,
    explanation: "The Decorator pattern attaches additional responsibilities to an object dynamically as an alternative to subclassing for extending functionality.",
    referenceBook: "Design Patterns (GoF) - Structural Patterns",
    pastPaperTag: "FPSC Lecturer CS 2021",
    difficulty: "Easy"
  }
];

export interface PanelMember {
  name: string;
  role: string;
  title: string;
  institution: string;
  avatarColor: string;
  focusArea: string;
  personality: string;
}

export const AI_PANELISTS: PanelMember[] = [
  {
    name: "Dr. Tariq Mahmood",
    role: "Subject Specialist (CS)",
    title: "Professor & Chair of Computer Science",
    institution: "FAST-NUCES / Punjab Commission Board",
    avatarColor: "bg-blue-600",
    focusArea: "Algorithms, Operating Systems, vtable internals, database index structures",
    personality: "Demands rigorous academic definitions, asks deep follow-ups when buzzwords are used without depth."
  },
  {
    name: "Prof. Dr. Ayesha Siddiqui",
    role: "Pedagogy & Teaching Expert",
    title: "Associate Dean of Academic Affairs",
    institution: "Quaid-i-Azam University Islamabad",
    avatarColor: "bg-emerald-600",
    focusArea: "Micro-teaching demonstration, Bloom's Taxonomy, handling weak students, lecture pacing",
    personality: "Evaluates blackboard clarity, structured delivery, and ability to break complex ideas into intuitive analogies."
  },
  {
    name: "Mr. Farooq Ahmad Khan",
    role: "Commission Chairman / Member",
    title: "Former Additional Secretary / Board Member",
    institution: "Provincial Public Service Commission",
    avatarColor: "bg-slate-700",
    focusArea: "General aptitude, confidence, ethics, higher education policy in Pakistan, communication skills",
    personality: "Tests composure under pressure, academic integrity, and professional demeanor."
  }
];

export interface CandidateStats {
  name: string;
  targetCommission: string;
  readinessScore: number;
  mcqsPracticed: number;
  mockExamScoreAvg: number;
  aiVivasCompleted: number;
  studyStreakDays: number;
  predictedMeritRank: string;
  weakDisciplines: string[];
  strongDisciplines: string[];
}

export const CURRENT_CANDIDATE: CandidateStats = {
  name: "Engr. Hamza Farooq",
  targetCommission: "PPSC CS Lecturer (BS-17)",
  readinessScore: 78,
  mcqsPracticed: 1840,
  mockExamScoreAvg: 74.5,
  aiVivasCompleted: 12,
  studyStreakDays: 14,
  predictedMeritRank: "Top 4.2% (Likely Merit Selection)",
  weakDisciplines: ["Theory of Automata", "Compiler Construction"],
  strongDisciplines: ["Operating Systems", "Data Structures", "Computer Networks"]
};
