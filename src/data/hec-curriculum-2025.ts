// Academic Interview Pro - HEC Pakistan Revised Computer Science Curriculum 2025
// Complete Subject Library, Topics, Curriculum Mappings, and Multi-type Question Bank

export interface HECTopic {
  name: string;
  slug: string;
  description: string;
  difficulty: "EASY" | "MEDIUM" | "HARD" | "EXPERT";
  displayOrder: number;
}

export interface HECQuestionOption {
  optionKey: "A" | "B" | "C" | "D";
  statement: string;
  isCorrect: boolean;
}

export interface HECQuestionSource {
  sourceName: string;
  examYear?: number;
  postTitle?: string;
  bookTitle?: string;
}

export interface HECQuestion {
  id: string;
  subjectSlug: string;
  topicSlug?: string;
  statement: string;
  type: "MCQ" | "SHORT" | "LONG" | "CONCEPTUAL" | "SCENARIO";
  difficulty: "EASY" | "MEDIUM" | "HARD" | "EXPERT";
  origin: "VERIFIED" | "AI_GENERATED";
  status: "DRAFT" | "PENDING_REVIEW" | "APPROVED" | "REJECTED";
  options?: HECQuestionOption[];
  correctOptionKey?: "A" | "B" | "C" | "D";
  detailedExplanation: string;
  keyPoints?: string[];
  referenceCitation?: string;
  source?: HECQuestionSource;
}

export interface HECSubject {
  code: string;
  slug: string;
  title: string;
  category: "CORE_CS" | "SUPPLEMENTARY";
  weightage: string;
  frequency: "CRITICAL" | "HIGH" | "MEDIUM";
  iconName: string;
  description: string;
  recommendedBooks: string[];
  displayOrder: number;
  topics: HECTopic[];
}

export const HEC_SUBJECTS_2025: HECSubject[] = [
  // 1. Programming Fundamentals
  {
    code: "CS-101",
    slug: "programming-fundamentals",
    title: "Programming Fundamentals",
    category: "CORE_CS",
    weightage: "10-12%",
    frequency: "CRITICAL",
    iconName: "Terminal",
    description: "Imperative programming paradigms, memory allocation, pointers, recursion, data types, and control structures according to HEC 2025 guidelines.",
    recommendedBooks: ["C++ How to Program (Deitel & Deitel, 10th Ed)", "Problem Solving with C++ (Walter Savitch)"],
    displayOrder: 1,
    topics: [
      { name: "Primitive Data Types, Storage Classes & Variable Scope", slug: "data-types-scope", difficulty: "EASY", description: "Memory sizes, type qualifiers, auto, static, extern, and lifetime of variables.", displayOrder: 1 },
      { name: "Control Structures & Short-Circuit Boolean Evaluation", slug: "control-structures", difficulty: "EASY", description: "Branching, looping, ternary operators, and logical evaluation semantics.", displayOrder: 2 },
      { name: "Pointers, References & Pointer Arithmetic", slug: "pointers-memory", difficulty: "HARD", description: "Direct memory access, address arithmetic, void pointers, function pointers, and const correctness.", displayOrder: 3 },
      { name: "Dynamic Memory Allocation (malloc/free vs new/delete)", slug: "dynamic-memory", difficulty: "HARD", description: "Heap management, memory fragmentation, memory leaks, and dangling pointers.", displayOrder: 4 },
      { name: "Recursion & Call Stack Mechanics", slug: "recursion-callstack", difficulty: "MEDIUM", description: "Stack frames, base cases, direct/indirect recursion, and tail call optimization.", displayOrder: 5 },
    ],
  },

  // 2. Object-Oriented Programming
  {
    code: "CS-102",
    slug: "object-oriented-programming",
    title: "Object-Oriented Programming",
    category: "CORE_CS",
    weightage: "12-14%",
    frequency: "CRITICAL",
    iconName: "Code",
    description: "Encapsulation, inheritance, runtime polymorphism, vtables, abstract classes, templates, and SOLID design principles.",
    recommendedBooks: ["Object-Oriented Programming in C++ (Robert Lafore)", "Effective Modern C++ (Scott Meyers)"],
    displayOrder: 2,
    topics: [
      { name: "Encapsulation & Access Specifiers", slug: "encapsulation", difficulty: "EASY", description: "Information hiding, public/private/protected boundaries, and friend functions.", displayOrder: 1 },
      { name: "Constructors, Destructors & Rule of Three/Five", slug: "constructors-destructors", difficulty: "MEDIUM", description: "Copy constructors, deep vs shallow copies, move semantics, and assignment operators.", displayOrder: 2 },
      { name: "Virtual Functions, VTables & Runtime Polymorphism", slug: "polymorphism-vtables", difficulty: "EXPERT", description: "Dynamic dispatch, vptr, virtual destructor requirements, and pure virtual interfaces.", displayOrder: 3 },
      { name: "Multiple Inheritance & Diamond Problem Resolution", slug: "multiple-inheritance", difficulty: "HARD", description: "Virtual base classes, object memory layout in C++, and ambiguity resolution.", displayOrder: 4 },
      { name: "SOLID Principles & Generic Templates", slug: "solid-templates", difficulty: "HARD", description: "Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion.", displayOrder: 5 },
    ],
  },

  // 3. Data Structures
  {
    code: "CS-201",
    slug: "data-structures",
    title: "Data Structures",
    category: "CORE_CS",
    weightage: "15-18%",
    frequency: "CRITICAL",
    iconName: "Binary",
    description: "Linear and non-linear data structures, self-balancing search trees, heaps, hash tables, and priority queues.",
    recommendedBooks: ["Data Structures and Algorithm Analysis in C++ (Mark Allen Weiss)", "Data Structures: A Pseudocode Approach (Forouzan)"],
    displayOrder: 3,
    topics: [
      { name: "Linked Lists (Singly, Doubly, Circular & Skip Lists)", slug: "linked-lists", difficulty: "MEDIUM", description: "Pointer manipulation, cycle detection (Floyd's algorithm), and reversal.", displayOrder: 1 },
      { name: "Stacks, Queues & Monotonic Deques", slug: "stacks-queues", difficulty: "MEDIUM", description: "Infix to postfix conversion, parenthesis matching, circular queue buffers.", displayOrder: 2 },
      { name: "Self-Balancing Trees (AVL, Red-Black Trees, B/B+ Trees)", slug: "balanced-trees", difficulty: "EXPERT", description: "Rotations, balance factors, color properties, and external database indexing trees.", displayOrder: 3 },
      { name: "Heaps & Priority Queues", slug: "heaps-priority-queues", difficulty: "MEDIUM", description: "Binary min/max heaps, heapify in O(n) time, and binomial/Fibonacci heaps.", displayOrder: 4 },
      { name: "Hash Tables, Collision Resolution & Amortized Complexity", slug: "hash-tables", difficulty: "HARD", description: "Open addressing, chaining, quadratic probing, double hashing, and load factors.", displayOrder: 5 },
    ],
  },

  // 4. Algorithms
  {
    code: "CS-202",
    slug: "algorithms",
    title: "Algorithms",
    category: "CORE_CS",
    weightage: "14-16%",
    frequency: "CRITICAL",
    iconName: "Cpu",
    description: "Asymptotic notation, divide-and-conquer, greedy strategies, dynamic programming, graph algorithms, and NP-completeness.",
    recommendedBooks: ["Introduction to Algorithms (Cormen, Leiserson, Rivest, Stein - CLRS, 4th Ed)", "Algorithm Design (Kleinberg & Tardos)"],
    displayOrder: 4,
    topics: [
      { name: "Asymptotic Complexity & Master Theorem", slug: "asymptotic-analysis", difficulty: "MEDIUM", description: "Big-O, Omega, Theta, Little-o, solving recurrence relations via substitution, recursion tree, Master Theorem.", displayOrder: 1 },
      { name: "Divide-and-Conquer Sorting (Merge, Quick, Radix)", slug: "sorting-algorithms", difficulty: "MEDIUM", description: "Stability, in-place behavior, pivot selection strategies, and lower bounds for comparison sorts.", displayOrder: 2 },
      { name: "Dynamic Programming (Knapsack, LCS, Matrix Chain)", slug: "dynamic-programming", difficulty: "HARD", description: "Optimal substructure, overlapping subproblems, memoization vs bottom-up tabulation.", displayOrder: 3 },
      { name: "Graph Algorithms (BFS, DFS, Dijkstra, Bellman-Ford, Floyd-Warshall)", slug: "graph-algorithms", difficulty: "EXPERT", description: "Shortest paths, negative cycles, topological sorting, minimum spanning trees (Prim, Kruskal).", displayOrder: 4 },
      { name: "P, NP, NP-Complete & NP-Hard Reductions", slug: "computational-complexity", difficulty: "EXPERT", description: "Deterministic vs non-deterministic polynomial time, Cook-Levin theorem, 3-SAT reductions.", displayOrder: 5 },
    ],
  },

  // 5. Database Management Systems
  {
    code: "CS-301",
    slug: "database-management-systems",
    title: "Database Management Systems",
    category: "CORE_CS",
    weightage: "12-14%",
    frequency: "CRITICAL",
    iconName: "Database",
    description: "Relational model, relational algebra, SQL optimization, normalization (1NF-5NF), ACID transactions, 2PL, and NoSQL storage.",
    recommendedBooks: ["Database System Concepts (Silberschatz, Korth, Sudarshan, 7th Ed)", "Fundamentals of Database Systems (Elmasri & Navathe)"],
    displayOrder: 5,
    topics: [
      { name: "Relational Algebra & Tuple Relational Calculus", slug: "relational-algebra", difficulty: "HARD", description: "Selection, projection, Cartesian product, theta-join, natural join, division operator.", displayOrder: 1 },
      { name: "Functional Dependencies & Normalization (1NF, 2NF, 3NF, BCNF, 4NF)", slug: "normalization", difficulty: "HARD", description: "Lossless decomposition, dependency preservation, minimal cover, candidate key derivations.", displayOrder: 2 },
      { name: "Transaction Processing & ACID Properties", slug: "acid-transactions", difficulty: "MEDIUM", description: "Atomicity, Consistency, Isolation levels (Read Uncommitted, Read Committed, Repeatable Read, Serializable).", displayOrder: 3 },
      { name: "Concurrency Control (2PL, Timestamp Ordering & Deadlocks)", slug: "concurrency-control", difficulty: "EXPERT", description: "Strict 2PL, Rigorous 2PL, cascading rollbacks, wait-die vs wound-wait deadlock prevention.", displayOrder: 4 },
      { name: "Indexing, B+ Trees & Query Optimization Execution Plans", slug: "indexing-optimization", difficulty: "HARD", description: "Dense vs sparse indexing, clustering indices, cost-based optimizer, hash joins.", displayOrder: 5 },
    ],
  },

  // 6. Computer Networks
  {
    code: "CS-302",
    slug: "computer-networks",
    title: "Computer Networks",
    category: "CORE_CS",
    weightage: "12-14%",
    frequency: "CRITICAL",
    iconName: "Network",
    description: "OSI and TCP/IP layered architecture, subnetting (CIDR/VLSM), routing algorithms, TCP flow/congestion control, and network security protocols.",
    recommendedBooks: ["Computer Networking: A Top-Down Approach (Kurose & Ross, 8th Ed)", "Computer Networks (Tanenbaum & Wetherall)"],
    displayOrder: 6,
    topics: [
      { name: "OSI & TCP/IP Reference Models and Encapsulation", slug: "osi-tcp-models", difficulty: "EASY", description: "Layer responsibilities, PDUs (Frame, Packet, Segment, Message), ports and sockets.", displayOrder: 1 },
      { name: "IPv4 Subnetting, VLSM, CIDR & NAT", slug: "subnetting-vlsm", difficulty: "EXPERT", description: "Subnet masks, broadcast addresses, usable hosts calculation, CIDR prefix aggregation, NAT traversal.", displayOrder: 2 },
      { name: "Transport Layer Protocols (TCP vs UDP, 3-Way Handshake)", slug: "transport-protocols", difficulty: "MEDIUM", description: "SYN/ACK sequence numbers, TIME_WAIT state, flow control (Sliding Window), congestion algorithms.", displayOrder: 3 },
      { name: "Routing Protocols (Distance-Vector, Link-State, OSPF, BGP)", slug: "routing-protocols", difficulty: "HARD", description: "Bellman-Ford count-to-infinity problem, Dijkstra link-state updates, autonomous systems.", displayOrder: 4 },
      { name: "Application Protocols & TLS/SSL Handshake (DNS, HTTP/2, HTTPS)", slug: "application-protocols", difficulty: "MEDIUM", description: "Recursive vs iterative DNS queries, HTTP pipelining/multiplexing, symmetric/asymmetric key exchange.", displayOrder: 5 },
    ],
  },

  // 7. Operating Systems
  {
    code: "CS-303",
    slug: "operating-systems",
    title: "Operating Systems",
    category: "CORE_CS",
    weightage: "14-16%",
    frequency: "CRITICAL",
    iconName: "Cpu",
    description: "Process management, inter-process communication, CPU scheduling, semaphores, deadlock handling, virtual memory, and file systems.",
    recommendedBooks: ["Operating System Concepts (Silberschatz, Galvin, Gagne - Dinosaur Book)", "Modern Operating Systems (Andrew Tanenbaum)"],
    displayOrder: 7,
    topics: [
      { name: "Processes, Threads & Context Switching", slug: "processes-threads", difficulty: "MEDIUM", description: "Process Control Block (PCB), user vs kernel threads, fork() and exec() system calls, context switch overhead.", displayOrder: 1 },
      { name: "Process Synchronization & Semaphores", slug: "process-sync", difficulty: "EXPERT", description: "Critical section problem, Peterson's algorithm, mutexes, counting semaphores, condition variables, Dining Philosophers.", displayOrder: 2 },
      { name: "Deadlocks: Prevention, Avoidance (Banker's Algorithm) & Detection", slug: "deadlocks", difficulty: "HARD", description: "Four Coffman conditions, resource allocation graphs, safe state analysis, resource preemption.", displayOrder: 3 },
      { name: "CPU Scheduling Algorithms (Preemptive vs Non-Preemptive)", slug: "cpu-scheduling", difficulty: "MEDIUM", description: "FCFS, SJF, SRTF, Round Robin, Multi-Level Feedback Queues, Gantt chart turnaround times.", displayOrder: 4 },
      { name: "Virtual Memory, Paging, TLB & Page Replacement Algorithms", slug: "virtual-memory", difficulty: "EXPERT", description: "Page tables, multi-level paging, inverted page tables, Belady's anomaly, FIFO, LRU, Optimal replacement.", displayOrder: 5 },
    ],
  },

  // 8. Software Engineering
  {
    code: "CS-304",
    slug: "software-engineering",
    title: "Software Engineering",
    category: "CORE_CS",
    weightage: "10-12%",
    frequency: "HIGH",
    iconName: "Layers",
    description: "Software lifecycles, Agile/Scrum, requirements engineering, UML modeling, architectural styles, software testing, and metrics.",
    recommendedBooks: ["Software Engineering: A Practitioner's Approach (Roger Pressman)", "Software Engineering (Ian Sommerville)"],
    displayOrder: 8,
    topics: [
      { name: "SDLC Models (Waterfall, Spiral, V-Model, Agile Scrum)", slug: "sdlc-models", difficulty: "EASY", description: "Phased engineering, sprint ceremonies, user stories, product backlogs, burndown charts.", displayOrder: 1 },
      { name: "Requirements Engineering & SRS Specifications", slug: "requirements-engineering", difficulty: "MEDIUM", description: "Functional vs non-functional requirements, elicitation techniques, IEEE 830 SRS standards.", displayOrder: 2 },
      { name: "UML Modeling (Use Case, Class, Sequence & State Diagrams)", slug: "uml-modeling", difficulty: "MEDIUM", description: "Structural vs behavioral diagrams, aggregation vs composition, lifelines and messages.", displayOrder: 3 },
      { name: "Software Testing Levels & Techniques (White-box, Black-box)", slug: "software-testing", difficulty: "HARD", description: "Equivalence partitioning, boundary value analysis, cyclomatic complexity, basis path testing.", displayOrder: 4 },
      { name: "Software Architecture & Design Patterns (Gang of Four)", slug: "design-patterns", difficulty: "HARD", description: "Creational (Singleton, Factory), Structural (Adapter, Decorator), Behavioral (Observer, Strategy).", displayOrder: 5 },
    ],
  },

  // 9. Computer Architecture
  {
    code: "CS-203",
    slug: "computer-architecture",
    title: "Computer Architecture",
    category: "CORE_CS",
    weightage: "8-10%",
    frequency: "HIGH",
    iconName: "Cpu",
    description: "Instruction Set Architecture (ISA), RISC vs CISC, pipelining hazards, cache memory mapping, RAID, and bus hierarchies.",
    recommendedBooks: ["Computer Organization and Design: RISC-V Edition (Patterson & Hennessy)", "Computer Architecture: A Quantitative Approach (Hennessy & Patterson)"],
    displayOrder: 9,
    topics: [
      { name: "Instruction Set Architecture & Addressing Modes", slug: "isa-addressing-modes", difficulty: "MEDIUM", description: "Direct, indirect, register relative, indexed, immediate, and stack addressing.", displayOrder: 1 },
      { name: "RISC vs CISC Architectural Tradeoffs", slug: "risc-vs-cisc", difficulty: "EASY", description: "Instruction density, clock cycles per instruction (CPI), pipelining feasibility.", displayOrder: 2 },
      { name: "Pipelining & Hazards (Structural, Data, Control)", slug: "pipelining-hazards", difficulty: "EXPERT", description: "Five-stage pipeline (IF, ID, EX, MEM, WB), data forwarding, branch prediction, stall penalties.", displayOrder: 3 },
      { name: "Memory Hierarchy, Cache Mapping (Direct, Fully/Set Associative)", slug: "cache-memory", difficulty: "HARD", description: "Tag/Index/Offset bits breakdown, write-through vs write-back, miss penalties.", displayOrder: 4 },
      { name: "Secondary Storage & RAID Configurations (0, 1, 5, 6, 10)", slug: "raid-storage", difficulty: "MEDIUM", description: "Striping, mirroring, distributed parity calculations, fault tolerance thresholds.", displayOrder: 5 },
    ],
  },

  // 10. Discrete Mathematics
  {
    code: "CS-103",
    slug: "discrete-mathematics",
    title: "Discrete Mathematics",
    category: "CORE_CS",
    weightage: "8-10%",
    frequency: "HIGH",
    iconName: "Sparkles",
    description: "Propositional logic, predicate calculus, set theory, relations and functions, combinatorics, graph theory, and proof techniques.",
    recommendedBooks: ["Discrete Mathematics and Its Applications (Kenneth H. Rosen, 8th Ed)"],
    displayOrder: 10,
    topics: [
      { name: "Propositional Logic, Truth Tables & Quantifiers", slug: "propositional-logic", difficulty: "EASY", description: "Tautologies, contradictions, contrapositives, De Morgan's laws, universal/existential quantification.", displayOrder: 1 },
      { name: "Proof Methods & Mathematical Induction", slug: "proof-methods", difficulty: "MEDIUM", description: "Direct proofs, proof by contradiction, pigeonhole principle, weak vs strong induction.", displayOrder: 2 },
      { name: "Set Theory, Relations & Equivalence Classes", slug: "sets-relations", difficulty: "MEDIUM", description: "Reflexive, symmetric, transitive properties, partial orders, Hasse diagrams, equivalence partitions.", displayOrder: 3 },
      { name: "Permutations, Combinations & Recurrence Relations", slug: "combinatorics", difficulty: "HARD", description: "Binomial theorem, inclusion-exclusion principle, generating functions, homogeneous recurrences.", displayOrder: 4 },
      { name: "Graph Theory (Eulerian & Hamiltonian Paths, Planarity)", slug: "graph-theory", difficulty: "HARD", description: "Degree sum formula, trees and spanning trees, planar graphs (Euler's formula v - e + f = 2).", displayOrder: 5 },
    ],
  },

  // 11. Theory of Automata
  {
    code: "CS-305",
    slug: "theory-of-automata",
    title: "Theory of Automata",
    category: "CORE_CS",
    weightage: "10-12%",
    frequency: "CRITICAL",
    iconName: "FileCode",
    description: "Regular languages, DFA/NFA equivalence, regular expressions, pumping lemma, CFG, Pushdown Automata, and Turing Machines.",
    recommendedBooks: ["Introduction to the Theory of Computation (Michael Sipser, 3rd Ed)", "Introduction to Automata Theory, Languages, and Computation (Hopcroft, Motwani, Ullman)"],
    displayOrder: 11,
    topics: [
      { name: "DFA, NFA & Subset Construction Algorithm", slug: "dfa-nfa-conversion", difficulty: "MEDIUM", description: "Deterministic vs non-deterministic state transitions, epsilon-closures, Powerset construction.", displayOrder: 1 },
      { name: "Regular Expressions & DFA State Minimization (Myhill-Nerode)", slug: "regex-minimization", difficulty: "HARD", description: "Arden's theorem, equivalence partitioning table-filling algorithm, canonical DFAs.", displayOrder: 2 },
      { name: "Pumping Lemma for Regular & Context-Free Languages", slug: "pumping-lemma", difficulty: "EXPERT", description: "Contradiction proofs for non-regularity (e.g. 0^n 1^n), adversary game rules.", displayOrder: 3 },
      { name: "Context-Free Grammars (CFG) & Pushdown Automata (PDA)", slug: "cfg-pda", difficulty: "HARD", description: "Chomsky Normal Form (CNF), Greibach Normal Form (GNF), ambiguity, DPDA vs NPDA.", displayOrder: 4 },
      { name: "Turing Machines, Chomsky Hierarchy & Decidability", slug: "turing-machines", difficulty: "EXPERT", description: "Halting problem, undecidability, Post Correspondence Problem (PCP), recursive vs recursively enumerable.", displayOrder: 5 },
    ],
  },

  // 12. Compiler Construction
  {
    code: "CS-401",
    slug: "compiler-construction",
    title: "Compiler Construction",
    category: "CORE_CS",
    weightage: "8-10%",
    frequency: "HIGH",
    iconName: "Code",
    description: "Compiler phases, lexical analysis (Lex/Flex), syntax analysis (LL, LR, LALR parsers), syntax-directed translation, and intermediate code generation.",
    recommendedBooks: ["Compilers: Principles, Techniques, and Tools (Aho, Lam, Sethi, Ullman - Dragon Book)"],
    displayOrder: 12,
    topics: [
      { name: "Compiler Phases & Architecture", slug: "compiler-phases", difficulty: "EASY", description: "Lexical, Syntax, Semantic, Intermediate Code, Code Optimization, Target Code Generation, Symbol Table.", displayOrder: 1 },
      { name: "Lexical Analysis & Symbol Table Management", slug: "lexical-analysis", difficulty: "MEDIUM", description: "Tokens, lexemes, patterns, regular expressions to transition diagrams, hash symbol tables.", displayOrder: 2 },
      { name: "Top-Down Parsing (LL(1), First & Follow Sets)", slug: "top-down-parsing", difficulty: "HARD", description: "Recursive descent, left recursion elimination, left factoring, parse table conflicts.", displayOrder: 3 },
      { name: "Bottom-Up Parsing (LR(0), SLR(1), LR(1), LALR(1))", slug: "bottom-up-parsing", difficulty: "EXPERT", description: "Shift-reduce parsing, canonical collection of items, goto function, reduce/reduce and shift/reduce conflicts.", displayOrder: 4 },
      { name: "Intermediate Code Generation (Three-Address Code & SSA)", slug: "intermediate-code", difficulty: "HARD", description: "Quadruples, triples, indirect triples, syntax directed translation schemes, basic blocks.", displayOrder: 5 },
    ],
  },

  // 13. Artificial Intelligence
  {
    code: "CS-402",
    slug: "artificial-intelligence",
    title: "Artificial Intelligence",
    category: "CORE_CS",
    weightage: "10-12%",
    frequency: "HIGH",
    iconName: "Sparkles",
    description: "Intelligent agents, uninformed and informed heuristic search (A*, IDA*), adversarial search (Minimax, Alpha-Beta pruning), CSPs, and knowledge representation.",
    recommendedBooks: ["Artificial Intelligence: A Modern Approach (Stuart Russell & Peter Norvig, 4th Ed)"],
    displayOrder: 13,
    topics: [
      { name: "Intelligent Agents & Environment Types", slug: "intelligent-agents", difficulty: "EASY", description: "PEAS descriptions, accessible vs inaccessible, deterministic vs stochastic, static vs dynamic environments.", displayOrder: 1 },
      { name: "Informed Search & A* Admissibility / Consistency", slug: "heuristic-search", difficulty: "HARD", description: "Best-First Search, A* algorithm, Manhattan vs Euclidean heuristics, monotonicity guarantees.", displayOrder: 2 },
      { name: "Adversarial Search & Alpha-Beta Pruning", slug: "adversarial-search", difficulty: "HARD", description: "Game trees, Minimax values, alpha cutoffs, beta cutoffs, optimal move ordering.", displayOrder: 3 },
      { name: "Constraint Satisfaction Problems (CSP) & Forward Checking", slug: "csp-algorithms", difficulty: "MEDIUM", description: "Backtracking search, Arc Consistency (AC-3), MRV (Minimum Remaining Values) heuristic.", displayOrder: 4 },
      { name: "First-Order Logic & Resolution Refutation", slug: "knowledge-representation", difficulty: "HARD", description: "Clausal normal form conversion, Skolemization, unification algorithm, resolution theorem proving.", displayOrder: 5 },
    ],
  },

  // 14. Machine Learning
  {
    code: "CS-403",
    slug: "machine-learning",
    title: "Machine Learning",
    category: "CORE_CS",
    weightage: "10-12%",
    frequency: "HIGH",
    iconName: "Sparkles",
    description: "Supervised vs unsupervised learning, gradient descent, bias-variance tradeoff, regularization (L1/L2), neural networks, SVMs, and evaluation metrics.",
    recommendedBooks: ["Pattern Recognition and Machine Learning (Christopher Bishop)", "Machine Learning (Tom Mitchell)"],
    displayOrder: 14,
    topics: [
      { name: "Supervised Learning: Linear & Logistic Regression", slug: "linear-logistic-regression", difficulty: "MEDIUM", description: "Cost functions (MSE, Cross-entropy), sigmoid activation, decision boundaries, gradient descent updates.", displayOrder: 1 },
      { name: "Bias-Variance Tradeoff & Regularization (Lasso vs Ridge)", slug: "bias-variance-tradeoff", difficulty: "HARD", description: "Underfitting, overfitting, L1 sparsity vs L2 weight shrinkage, hyperparameter cross-validation.", displayOrder: 2 },
      { name: "Support Vector Machines (SVM) & Kernel Trick", slug: "svm-kernels", difficulty: "EXPERT", description: "Maximum margin hyperplanes, support vectors, soft-margin slack variables, RBF and polynomial kernels.", displayOrder: 3 },
      { name: "Unsupervised Learning: K-Means & PCA Dimensionality Reduction", slug: "unsupervised-learning", difficulty: "MEDIUM", description: "Centroid initialization, elbow method, eigenvalues/eigenvectors, variance maximization.", displayOrder: 4 },
      { name: "Model Evaluation: Precision, Recall, F1, ROC & AUC", slug: "model-evaluation", difficulty: "MEDIUM", description: "Confusion matrix metrics, false positive rates, precision-recall curve trade-offs in imbalanced sets.", displayOrder: 5 },
    ],
  },

  // 15. Information Security
  {
    code: "CS-404",
    slug: "information-security",
    title: "Information Security",
    category: "CORE_CS",
    weightage: "8-10%",
    frequency: "HIGH",
    iconName: "ShieldCheck",
    description: "CIA triad, symmetric/asymmetric cryptography (AES, RSA, ECC), digital signatures, hashing (SHA-256), PKI, and application vulnerabilities.",
    recommendedBooks: ["Cryptography and Network Security: Principles and Practice (William Stallings, 8th Ed)", "Security in Computing (Charles Pfleeger)"],
    displayOrder: 15,
    topics: [
      { name: "CIA Triad, Threat Modeling & Access Control Models", slug: "cia-access-control", difficulty: "EASY", description: "Confidentiality, Integrity, Availability, DAC, MAC, RBAC, Bell-LaPadula vs Biba integrity.", displayOrder: 1 },
      { name: "Symmetric Cryptography (DES, 3DES, AES Block Ciphers)", slug: "symmetric-crypto", difficulty: "MEDIUM", description: "Feistel networks, Substitution-Permutation networks, cipher block modes (ECB, CBC, GCM).", displayOrder: 2 },
      { name: "Asymmetric Cryptography (RSA Key Generation & Math)", slug: "asymmetric-crypto", difficulty: "HARD", description: "Euler's totient function, modular inverse, prime factorization security foundation, Diffie-Hellman exchange.", displayOrder: 3 },
      { name: "Cryptographic Hash Functions & Digital Signatures", slug: "hashes-signatures", difficulty: "HARD", description: "Pre-image resistance, collision resistance, birthday attack, HMAC, digital certificates (X.509).", displayOrder: 4 },
      { name: "Web Application Attacks (SQLi, XSS, CSRF, Buffer Overflows)", slug: "web-attacks-defenses", difficulty: "HARD", description: "Stored vs reflected XSS, prepared statements, anti-CSRF tokens, ASLR and stack canaries.", displayOrder: 5 },
    ],
  },

  // 16. Web Engineering
  {
    code: "CS-306",
    slug: "web-engineering",
    title: "Web Engineering",
    category: "CORE_CS",
    weightage: "8-10%",
    frequency: "MEDIUM",
    iconName: "Globe",
    description: "Web architectures (MVC, REST, GraphQL), HTTP statelessness, cookies/sessions, asynchronous JavaScript (Event Loop), and responsive rendering.",
    recommendedBooks: ["Web Engineering: A Practitioner's Approach (Roger Pressman & David Lowe)"],
    displayOrder: 16,
    topics: [
      { name: "HTTP Request Lifecycle, Status Codes & Headers", slug: "http-lifecycle", difficulty: "EASY", description: "Idempotent methods (GET, PUT, DELETE), 2xx/3xx/4xx/5xx codes, CORS, caching headers.", displayOrder: 1 },
      { name: "Client-Side Rendering vs Server-Side Rendering (SSR/SSG)", slug: "csr-vs-ssr", difficulty: "MEDIUM", description: "Hydration, Time to First Byte (TTFB), SEO implications, static generation benefits.", displayOrder: 2 },
      { name: "JavaScript Event Loop, Microtasks & Asynchronous Promises", slug: "js-event-loop", difficulty: "EXPERT", description: "Call stack, Web APIs, task queue vs microtask queue priority (Promises vs setTimeout).", displayOrder: 3 },
      { name: "RESTful API Design Principles & Resource Modeling", slug: "rest-api-design", difficulty: "MEDIUM", description: "Statelessness, uniform interface, HATEOAS, versioning, status code best practices.", displayOrder: 4 },
      { name: "Session Management, JWT Tokens & Cookie Security Flags", slug: "sessions-jwt", difficulty: "HARD", description: "HttpOnly, Secure, SameSite (Strict/Lax), token signature verification, replay prevention.", displayOrder: 5 },
    ],
  },

  // 17. Cloud Computing
  {
    code: "CS-405",
    slug: "cloud-computing",
    title: "Cloud Computing",
    category: "CORE_CS",
    weightage: "8-10%",
    frequency: "MEDIUM",
    iconName: "Layers",
    description: "Cloud service models (IaaS, PaaS, SaaS), virtualization (hypervisors, containers), microservices architecture, serverless, and cloud resilience.",
    recommendedBooks: ["Cloud Computing: Concepts, Technology & Architecture (Thomas Erl)"],
    displayOrder: 17,
    topics: [
      { name: "Cloud Service Models (IaaS, PaaS, SaaS, FaaS)", slug: "service-models", difficulty: "EASY", description: "Shared responsibility model, elasticity, on-demand self-service, metered billing.", displayOrder: 1 },
      { name: "Virtualization Mechanics (Type 1 vs Type 2 Hypervisors)", slug: "virtualization", difficulty: "MEDIUM", description: "Bare-metal vs hosted hypervisors, hardware-assisted virtualization, para-virtualization.", displayOrder: 2 },
      { name: "Containers vs Virtual Machines (Docker Architecture)", slug: "containers-docker", difficulty: "MEDIUM", description: "Linux namespaces, cgroups, Union File System (UnionFS), container runtime interface.", displayOrder: 3 },
      { name: "Microservices, API Gateways & Service Meshes", slug: "microservices-mesh", difficulty: "HARD", description: "Loose coupling, circuit breaker pattern, Istio sidecars, decentralized data management.", displayOrder: 4 },
      { name: "CAP Theorem & Distributed Data Stores", slug: "cap-theorem", difficulty: "EXPERT", description: "Consistency, Availability, Partition tolerance trade-offs, eventual consistency, quorum consensus.", displayOrder: 5 },
    ],
  },

  // 18. Data Science
  {
    code: "CS-406",
    slug: "data-science",
    title: "Data Science",
    category: "CORE_CS",
    weightage: "8-10%",
    frequency: "MEDIUM",
    iconName: "Binary",
    description: "Data wrangling, exploratory data analysis (EDA), statistical inference, hypothesis testing, Big Data paradigms (MapReduce), and visualization.",
    recommendedBooks: ["Python for Data Analysis (Wes McKinney)", "Doing Data Science (Cathy O'Neil & Rachel Schutt)"],
    displayOrder: 18,
    topics: [
      { name: "Data Cleaning, Imputation & Feature Scaling", slug: "data-preprocessing", difficulty: "MEDIUM", description: "Handling missing values, outlier detection (IQR, Z-score), Min-Max normalization, standard scaling.", displayOrder: 1 },
      { name: "Statistical Inference & Hypothesis Testing (t-test, ANOVA, Chi-Square)", slug: "hypothesis-testing", difficulty: "HARD", description: "Null vs alternative hypothesis, p-values, Type I and Type II errors, confidence intervals.", displayOrder: 2 },
      { name: "Exploratory Data Analysis (EDA) & Distribution Characteristics", slug: "eda-distributions", difficulty: "MEDIUM", description: "Skewness, kurtosis, covariance, Pearson/Spearman correlation matrices, box plots.", displayOrder: 3 },
      { name: "Big Data Architectures (Hadoop HDFS, MapReduce, Spark)", slug: "big-data-mapreduce", difficulty: "HARD", description: "Map, Shuffle, Reduce execution phases, RDDs in-memory transformations and actions.", displayOrder: 4 },
      { name: "Feature Selection & Dimensionality Reduction Strategies", slug: "feature-engineering", difficulty: "MEDIUM", description: "Filter methods, wrapper methods (RFE), embedded methods, correlation thresholding.", displayOrder: 5 },
    ],
  },

  // 19. English (Supplementary)
  {
    code: "ENG-101",
    slug: "english",
    title: "English Language & Academic Communication",
    category: "SUPPLEMENTARY",
    weightage: "10-15%",
    frequency: "CRITICAL",
    iconName: "BookOpen",
    description: "Mandatory General Knowledge / English portion (20 marks) in PPSC/FPSC exams: advanced grammar, prepositions, vocabulary, idioms, and classroom lecturing fluency.",
    recommendedBooks: ["Practical English Usage (Michael Swan)", "High School English Grammar and Composition (Wren & Martin)"],
    displayOrder: 19,
    topics: [
      { name: "Appropriate Prepositions & Phrasal Verbs", slug: "prepositions-phrasal-verbs", difficulty: "MEDIUM", description: "Fixed prepositions tested in commission screening (e.g., abstain from, adhere to, abide by).", displayOrder: 1 },
      { name: "Subject-Verb Agreement & Syntax Rules", slug: "subject-verb-agreement", difficulty: "MEDIUM", description: "Collective nouns, either/or, neither/nor, inverted sentences, and parallel structure.", displayOrder: 2 },
      { name: "Vocabulary: Synonyms, Antonyms & Academic Analogies", slug: "vocabulary-analogies", difficulty: "HARD", description: "High-frequency GRE/GAT words used in provincial commission screening tests.", displayOrder: 3 },
      { name: "Idioms, Proverbs & Common Sentence Corrections", slug: "idioms-corrections", difficulty: "MEDIUM", description: "Misplaced modifiers, dangling participles, idiomatic usage in professional writing.", displayOrder: 4 },
    ],
  },

  // 20. Teaching Methodology (Supplementary)
  {
    code: "EDU-201",
    slug: "teaching-methodology",
    title: "Teaching Methodology & Pedagogy",
    category: "SUPPLEMENTARY",
    weightage: "10-15%",
    frequency: "HIGH",
    iconName: "Monitor",
    description: "University & College level pedagogical methods, Bloom's Taxonomy, lesson planning, student engagement, and formative/summative assessment design.",
    recommendedBooks: ["Methods of Teaching (Dr. Muhammad Zafar Iqbal)", "A Taxonomy for Learning, Teaching, and Assessing (Anderson & Krathwohl)"],
    displayOrder: 20,
    topics: [
      { name: "Bloom's Revised Taxonomy in CS Curriculum Delivery", slug: "blooms-taxonomy", difficulty: "MEDIUM", description: "Cognitive domains: Remembering, Understanding, Applying, Analyzing, Evaluating, Creating.", displayOrder: 1 },
      { name: "Interactive Lecturing vs Problem-Based Learning (PBL)", slug: "interactive-lecturing", difficulty: "MEDIUM", description: "Flipped classroom models, pair programming pedagogy, handling disengaged students.", displayOrder: 2 },
      { name: "Formative vs Summative Assessment Design", slug: "assessment-design", difficulty: "MEDIUM", description: "Rubric construction, item discrimination index, continuous feedback loops in lab courses.", displayOrder: 3 },
      { name: "Classroom Management & Conflict Resolution in Higher Education", slug: "classroom-management", difficulty: "HARD", description: "Addressing academic dishonesty (plagiarism, code copying), inclusive teaching strategies.", displayOrder: 4 },
    ],
  },

  // 21. Research Methodology (Supplementary)
  {
    code: "RES-301",
    slug: "research-methodology",
    title: "Research Methodology",
    category: "SUPPLEMENTARY",
    weightage: "5-10%",
    frequency: "HIGH",
    iconName: "FileCode",
    description: "Selection Board Viva requirement: research problem formulation, literature review, empirical CS research, metrics, and academic publication ethics.",
    recommendedBooks: ["Research Methodology: Methods and Techniques (C.R. Kothari)", "Empirical Methods for Artificial Intelligence (Paul R. Cohen)"],
    displayOrder: 21,
    topics: [
      { name: "Research Problem Formulation & Hypothesis Generation", slug: "problem-formulation", difficulty: "MEDIUM", description: "Identifying research gaps, novel contributions vs incremental work, feasibility analysis.", displayOrder: 1 },
      { name: "Empirical Benchmarking & Statistical Validation in CS", slug: "empirical-validation", difficulty: "HARD", description: "A/B testing, statistical significance tests (Wilcoxon, t-test), repeatability in experiments.", displayOrder: 2 },
      { name: "Academic Ethics, Plagiarism & Citation Standards (IEEE/ACM)", slug: "academic-ethics", difficulty: "EASY", description: "HEC plagiarism policy thresholds (19% Turnitin limit), self-plagiarism, author attribution.", displayOrder: 3 },
      { name: "Literature Review Synthesis & Systematic Mapping Studies", slug: "literature-synthesis", difficulty: "HARD", description: "PRISMA guidelines, snowballing search methodology, critical comparative matrices.", displayOrder: 4 },
    ],
  },
];

// ---------------------------------------------------------------------------
// Extensive Real Pakistani Commission Question Bank
// ---------------------------------------------------------------------------

export const INITIAL_QUESTION_BANK: HECQuestion[] = [
  // 1. Operating Systems - Virtual Memory
  {
    id: "q-os-001",
    subjectSlug: "operating-systems",
    topicSlug: "virtual-memory",
    statement: "Which of the following page replacement algorithms suffers from Belady's Anomaly (where increasing the number of allocated page frames results in an increased number of page faults)?",
    type: "MCQ",
    difficulty: "MEDIUM",
    origin: "VERIFIED",
    status: "APPROVED",
    options: [
      { optionKey: "A", statement: "LRU (Least Recently Used)", isCorrect: false },
      { optionKey: "B", statement: "FIFO (First In First Out)", isCorrect: true },
      { optionKey: "C", statement: "Optimal Page Replacement (OPT)", isCorrect: false },
      { optionKey: "D", statement: "LFU (Least Frequently Used)", isCorrect: false },
    ],
    correctOptionKey: "B",
    detailedExplanation: "Belady's Anomaly is a phenomenon where allocating more page frames leads to more page faults. FIFO exhibits Belady's anomaly because it does not satisfy the 'stack algorithm' inclusion property, whereas LRU and Optimal algorithms never suffer from this anomaly.",
    keyPoints: [
      "Stack algorithms satisfy the inclusion property: M(m) ⊆ M(m+1).",
      "FIFO replacement treats pages purely by time of arrival rather than usage recency.",
      "Discovered by László Bélády in 1969 with specific reference strings (e.g., 1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5).",
    ],
    referenceCitation: "Silberschatz, Galvin & Gagne, Operating System Concepts, 10th Edition, Chapter 10 (Virtual Memory), Page 408.",
    source: {
      sourceName: "PPSC CS Lecturer Written Exam",
      examYear: 2022,
      postTitle: "Lecturer Computer Science (BS-17)",
      bookTitle: "Operating System Concepts (Silberschatz)",
    },
  },

  // 2. Data Structures - Balanced Trees
  {
    id: "q-ds-001",
    subjectSlug: "data-structures",
    topicSlug: "balanced-trees",
    statement: "In an AVL tree with balance factors defined as Height(Left Subtree) - Height(Right Subtree), an insertion causes a balance factor of +2 at node N, and its left child has a balance factor of -1. Which double rotation sequence restores balance?",
    type: "MCQ",
    difficulty: "HARD",
    origin: "VERIFIED",
    status: "APPROVED",
    options: [
      { optionKey: "A", statement: "Right Rotation followed by Left Rotation", isCorrect: false },
      { optionKey: "B", statement: "Left Rotation at Child, then Right Rotation at Node N (LR Rotation)", isCorrect: true },
      { optionKey: "C", statement: "Left-Left Rotation (Single Right Rotation)", isCorrect: false },
      { optionKey: "D", statement: "Right-Right Rotation (Single Left Rotation)", isCorrect: false },
    ],
    correctOptionKey: "B",
    detailedExplanation: "When a node has a balance factor of +2 and its left child has a balance factor of -1, this represents a Left-Right (LR) heavy state. The rebalancing requires a double rotation: first a Left rotation on the left child, followed by a Right rotation on node N.",
    keyPoints: [
      "LL imbalance (+2 at root, +1 at child) -> Single Right rotation.",
      "RR imbalance (-2 at root, -1 at child) -> Single Left rotation.",
      "LR imbalance (+2 at root, -1 at child) -> Left on child, then Right on root.",
      "RL imbalance (-2 at root, +1 at child) -> Right on child, then Left on root.",
    ],
    referenceCitation: "Mark Allen Weiss, Data Structures and Algorithm Analysis in C++, 4th Edition, Chapter 4, Section 4.4.",
    source: {
      sourceName: "FPSC Lecturer Computer Science (F.4)",
      examYear: 2021,
      postTitle: "Lecturer CS (BS-17) Federal Colleges",
      bookTitle: "Data Structures & Algorithm Analysis (Weiss)",
    },
  },

  // 3. Algorithms - Asymptotic Analysis
  {
    id: "q-algo-001",
    subjectSlug: "algorithms",
    topicSlug: "asymptotic-analysis",
    statement: "What is the tight asymptotic bound for the recurrence T(n) = 2T(n/2) + n log n according to the generalized Master Theorem?",
    type: "MCQ",
    difficulty: "EXPERT",
    origin: "VERIFIED",
    status: "APPROVED",
    options: [
      { optionKey: "A", statement: "Θ(n)", isCorrect: false },
      { optionKey: "B", statement: "Θ(n log n)", isCorrect: false },
      { optionKey: "C", statement: "Θ(n log² n)", isCorrect: true },
      { optionKey: "D", statement: "Θ(n²)", isCorrect: false },
    ],
    correctOptionKey: "C",
    detailedExplanation: "Here a = 2, b = 2, so n^(log_b a) = n^(log_2 2) = n^1 = n. The driver function is f(n) = n log n = n^1 log^1 n. This matches Case 2 of the Extended Master Theorem where f(n) = Θ(n^(log_b a) * log^k n) with k = 1. Therefore, T(n) = Θ(n^(log_b a) * log^(k+1) n) = Θ(n log² n).",
    keyPoints: [
      "Extended Master Theorem handles cases where f(n) differs from n^(log_b a) by logarithmic factors.",
      "For T(n) = aT(n/b) + Θ(n^(log_b a) * log^k n), T(n) = Θ(n^(log_b a) * log^(k+1) n).",
      "Standard Master Theorem without log extensions fails on this recurrence.",
    ],
    referenceCitation: "Cormen, Leiserson, Rivest, Stein (CLRS), Introduction to Algorithms, 4th Edition, Chapter 4, Section 4.5.",
    source: {
      sourceName: "PPSC CS Lecturer Written Exam",
      examYear: 2020,
      postTitle: "Lecturer Computer Science",
      bookTitle: "Introduction to Algorithms (CLRS)",
    },
  },

  // 4. Database Systems - Normalization
  {
    id: "q-db-001",
    subjectSlug: "database-management-systems",
    topicSlug: "normalization",
    statement: "A relation R(A, B, C, D) has candidate keys {A, B} and functional dependencies: AB -> C, C -> D, D -> B. In which highest normal form is relation R?",
    type: "MCQ",
    difficulty: "HARD",
    origin: "VERIFIED",
    status: "APPROVED",
    options: [
      { optionKey: "A", statement: "First Normal Form (1NF)", isCorrect: false },
      { optionKey: "B", statement: "Second Normal Form (2NF)", isCorrect: false },
      { optionKey: "C", statement: "Third Normal Form (3NF)", isCorrect: true },
      { optionKey: "D", statement: "Boyce-Codd Normal Form (BCNF)", isCorrect: false },
    ],
    correctOptionKey: "C",
    detailedExplanation: "Let us inspect prime attributes: Since AB -> C, C -> D, D -> B: Keys are AB, AC, AD. Prime attributes are A, B, C, D. Every attribute in the schema is prime! For 3NF, every dependency X -> Y requires X to be a superkey OR Y to be a prime attribute. Since all attributes are prime, all dependencies satisfy 3NF. However, C -> D violates BCNF because C is not a superkey (C+ = {C, D, B}, missing A). Hence the highest normal form is 3NF.",
    keyPoints: [
      "Candidate keys: {AB}, {AC}, {AD}.",
      "All attributes {A, B, C, D} are prime.",
      "Since all RHS attributes are prime, 3NF condition is universally satisfied.",
      "BCNF fails on C -> D because C is not a superkey of R.",
    ],
    referenceCitation: "Elmasri & Navathe, Fundamentals of Database Systems, 7th Edition, Chapter 14, Section 14.5.",
    source: {
      sourceName: "PPSC CS Lecturer Past Papers",
      examYear: 2017,
      postTitle: "Lecturer CS (Higher Education Department)",
      bookTitle: "Database System Concepts (Silberschatz)",
    },
  },

  // 5. Theory of Automata - Decidability
  {
    id: "q-auto-001",
    subjectSlug: "theory-of-automata",
    topicSlug: "turing-machines",
    statement: "Which of the following problems regarding formal languages is DECIDABLE by a Turing Machine?",
    type: "MCQ",
    difficulty: "HARD",
    origin: "VERIFIED",
    status: "APPROVED",
    options: [
      { optionKey: "A", statement: "Emptiness problem for Context-Free Languages (Is L(G) = ∅?)", isCorrect: true },
      { optionKey: "B", statement: "Equivalence problem for Context-Free Grammars (Is L(G1) = L(G2)?)", isCorrect: false },
      { optionKey: "C", statement: "Ambiguity problem for Context-Free Grammars (Is G ambiguous?)", isCorrect: false },
      { optionKey: "D", statement: "Halting problem for Turing Machines", isCorrect: false },
    ],
    correctOptionKey: "A",
    detailedExplanation: "The emptiness problem for Context-Free Grammars is decidable: we can determine whether a CFG generates any strings by marking all generating variables from terminals upwards. If the start symbol is marked, L(G) ≠ ∅. Conversely, equivalence and ambiguity for CFGs, as well as the TM Halting problem, are notoriously undecidable.",
    keyPoints: [
      "Decidable for Regular Languages: Emptiness, Finiteness, Equivalence, Subset.",
      "Decidable for Context-Free: Membership (CYK algorithm), Emptiness, Finiteness.",
      "Undecidable for Context-Free: Equivalence, Ambiguity, Universality (L = Σ*), Disjointness.",
    ],
    referenceCitation: "Michael Sipser, Introduction to the Theory of Computation, 3rd Edition, Chapter 4 (Decidability), Theorem 4.7.",
    source: {
      sourceName: "FPSC Lecturer CS (F.4)",
      examYear: 2023,
      postTitle: "Lecturer CS (BS-17)",
      bookTitle: "Introduction to Theory of Computation (Sipser)",
    },
  },

  // 6. Computer Networks - Subnetting
  {
    id: "q-net-001",
    subjectSlug: "computer-networks",
    topicSlug: "subnetting-vlsm",
    statement: "An organization is assigned the network block 192.168.10.0/24. If it needs to create 6 subnets, each supporting at least 25 usable hosts, which subnet mask must be used?",
    type: "MCQ",
    difficulty: "MEDIUM",
    origin: "VERIFIED",
    status: "APPROVED",
    options: [
      { optionKey: "A", statement: "255.255.255.192 (/26)", isCorrect: false },
      { optionKey: "B", statement: "255.255.255.224 (/27)", isCorrect: true },
      { optionKey: "C", statement: "255.255.255.240 (/28)", isCorrect: false },
      { optionKey: "D", statement: "255.255.255.248 (/29)", isCorrect: false },
    ],
    correctOptionKey: "B",
    detailedExplanation: "For 25 hosts per subnet: 2^h - 2 >= 25 => h = 5 host bits needed (2^5 - 2 = 30 usable hosts). Since IPv4 addresses have 32 bits, the prefix length is 32 - 5 = /27. Borrowing 3 bits from the /24 network provides 2^3 = 8 subnets (which satisfies >= 6 subnets). Subnet mask for /27 is 255.255.255.224 (128 + 64 + 32).",
    keyPoints: [
      "/27 gives 8 subnets of 32 total addresses (30 usable hosts each).",
      "/28 gives 16 subnets of 16 addresses (14 usable hosts - insufficient).",
      "/26 gives only 4 subnets (insufficient for 6 subnets).",
    ],
    referenceCitation: "Kurose & Ross, Computer Networking: A Top-Down Approach, 8th Edition, Chapter 4 (Network Layer), Section 4.3.",
    source: {
      sourceName: "PPSC CS Lecturer Written Exam",
      examYear: 2022,
      postTitle: "Lecturer Computer Science",
      bookTitle: "Computer Networking (Kurose & Ross)",
    },
  },

  // 7. Conceptual Question - OOP Polymorphism
  {
    id: "q-concept-001",
    subjectSlug: "object-oriented-programming",
    topicSlug: "polymorphism-vtables",
    statement: "Why should a base class destructor always be declared virtual in C++ when polymorphic deletion is anticipated? Explain the memory and resource leakage implications.",
    type: "CONCEPTUAL",
    difficulty: "HARD",
    origin: "VERIFIED",
    status: "APPROVED",
    detailedExplanation: "When a derived class object is deleted through a pointer to the base class (e.g. `Base* ptr = new Derived(); delete ptr;`), the compiler resolves the destructor call statically at compile time based on the pointer type unless the base destructor is declared virtual. Without a virtual destructor, only the `Base` destructor executes, leaving the `Derived` class destructor uninvoked. If the derived class allocated dynamic heap memory, opened file handles, or acquired mutexes, those resources leak irreversibly.",
    keyPoints: [
      "Non-virtual base destructor causes undefined behavior under ISO C++ when deleting derived objects via base pointers.",
      "Virtual destructor ensures dynamic dispatch via the VTable, invoking Derived::~Derived() first, then Base::~Base().",
      "Guideline: Any class with at least one virtual function MUST have a public virtual destructor or protected non-virtual destructor.",
    ],
    referenceCitation: "Scott Meyers, Effective C++, 3rd Edition, Item 7: 'Declare destructors virtual in polymorphic base classes'.",
    source: {
      sourceName: "Selection Board Viva Voce",
      examYear: 2023,
      postTitle: "PPSC CS Lecturer Selection Board Interview",
      bookTitle: "Effective C++ (Scott Meyers)",
    },
  },

  // 8. Scenario-based Question - Operating Systems Deadlock
  {
    id: "q-scen-001",
    subjectSlug: "operating-systems",
    topicSlug: "deadlocks",
    statement: "SCENARIO: In a high-throughput university portal backend, two concurrent threads T1 and T2 access two database tables: 'Students' and 'Grades'. Thread T1 updates 'Students' then requests a write lock on 'Grades'. Concurrently, Thread T2 updates 'Grades' and requests a write lock on 'Students'. The server freezes periodically during peak enrollment. Diagnose the root cause and propose two concrete software engineering architectural mitigations.",
    type: "SCENARIO",
    difficulty: "HARD",
    origin: "VERIFIED",
    status: "APPROVED",
    detailedExplanation: "DIAGNOSIS: This is a classic Circular Wait deadlock (one of Coffman's four conditions). Thread T1 holds Lock(Students) and waits for Lock(Grades). Thread T2 holds Lock(Grades) and waits for Lock(Students). Neither can proceed, causing thread pool exhaustion and server lockup.\n\nMITIGATION 1: Strict Global Lock Ordering. Impose a strict hierarchical ordering on all database resources (e.g., always acquire Lock(Students) BEFORE Lock(Grades)). If all transactions acquire locks in identical alphabetical or designated sequence, circular wait is mathematically broken.\n\nMITIGATION 2: Timed Locks / Deadlock Detection with Backoff. Use `try_lock_for` with exponential backoff. If a lock cannot be obtained within a threshold (e.g., 200ms), release all currently held locks, roll back transaction state, and retry after a randomized jitter period.",
    keyPoints: [
      "Coffman Condition violated: Circular Wait (T1 -> Grades -> T2 -> Students -> T1).",
      "Primary defense: Global lock hierarchy (Resource Ordering).",
      "Secondary defense: Transaction isolation timeouts with automatic rollback and exponential backoff retry.",
    ],
    referenceCitation: "Silberschatz, Operating System Concepts, Chapter 8 (Deadlocks), Section 8.5 (Deadlock Prevention).",
    source: {
      sourceName: "PPSC Assistant Professor / Lecturer Viva",
      examYear: 2022,
      postTitle: "Specialist CS Viva Panel",
      bookTitle: "Modern Operating Systems (Tanenbaum)",
    },
  },

  // 9. Short Question - English Grammar (Supplementary)
  {
    id: "q-eng-001",
    subjectSlug: "english",
    topicSlug: "prepositions-phrasal-verbs",
    statement: "Choose the correct preposition: 'The lecturer was exempted _____ attending the morning assembly due to postgraduate research duties.'",
    type: "MCQ",
    difficulty: "EASY",
    origin: "VERIFIED",
    status: "APPROVED",
    options: [
      { optionKey: "A", statement: "to", isCorrect: false },
      { optionKey: "B", statement: "from", isCorrect: true },
      { optionKey: "C", statement: "of", isCorrect: false },
      { optionKey: "D", statement: "with", isCorrect: false },
    ],
    correctOptionKey: "B",
    detailedExplanation: "The verb 'exempt' idiomatically takes the preposition 'from' (exempt somebody/something from something). For instance: 'exempt from taxes', 'exempted from attending'.",
    keyPoints: [
      "Fixed Preposition: 'exempt from'.",
      "Common screening trap: confusing 'exempt from' with 'immune to' or 'prevented from'.",
    ],
    referenceCitation: "Wren & Martin, High School English Grammar and Composition, Chapter on Prepositions.",
    source: {
      sourceName: "FPSC English General Knowledge Portion",
      examYear: 2022,
      postTitle: "Lecturer Screening Paper",
      bookTitle: "Practical English Usage (Swan)",
    },
  },

  // 10. Teaching Methodology - Bloom's Taxonomy
  {
    id: "q-edu-001",
    subjectSlug: "teaching-methodology",
    topicSlug: "blooms-taxonomy",
    statement: "Under Bloom's Revised Taxonomy, if a CS lecturer asks students to 'Design an optimized hash table algorithm for real-time packet filtering with low collision variance', which cognitive level is being assessed?",
    type: "MCQ",
    difficulty: "MEDIUM",
    origin: "VERIFIED",
    status: "APPROVED",
    options: [
      { optionKey: "A", statement: "Analyzing", isCorrect: false },
      { optionKey: "B", statement: "Applying", isCorrect: false },
      { optionKey: "C", statement: "Creating", isCorrect: true },
      { optionKey: "D", statement: "Evaluating", isCorrect: false },
    ],
    correctOptionKey: "C",
    detailedExplanation: "In Bloom's Revised Taxonomy (Anderson & Krathwohl, 2001), 'Creating' represents the highest cognitive dimension. It entails putting elements together to form a coherent whole, generating new structures, designing algorithms, or inventing architectural solutions.",
    keyPoints: [
      "Hierarchy: Remembering -> Understanding -> Applying -> Analyzing -> Evaluating -> Creating.",
      "Action verbs for Creating: Design, Construct, Formulate, Invent, Synthesize.",
    ],
    referenceCitation: "Anderson & Krathwohl, A Taxonomy for Learning, Teaching, and Assessing, Longman, 2001.",
    source: {
      sourceName: "Higher Education Selection Board Pedagogy Viva",
      examYear: 2023,
      postTitle: "Lecturer Interview Pedagogical Assessment",
      bookTitle: "Methods of Teaching (Iqbal)",
    },
  },

  // 11. AI-Generated Draft / Pending Question (Illustrates Pending Review requirement)
  {
    id: "q-ai-001",
    subjectSlug: "artificial-intelligence",
    topicSlug: "heuristic-search",
    statement: "In the A* search algorithm, if the heuristic function h(n) satisfies the triangle inequality h(n) <= c(n, a, n') + h(n') for all nodes n and successors n', what guarantee does this consistency property provide over mere admissibility?",
    type: "MCQ",
    difficulty: "HARD",
    origin: "AI_GENERATED",
    status: "PENDING_REVIEW",
    options: [
      { optionKey: "A", statement: "It guarantees that the search space is finite.", isCorrect: false },
      { optionKey: "B", statement: "It guarantees that the first time a node is expanded, the path to it is already optimal (no node needs to be reopened).", isCorrect: true },
      { optionKey: "C", statement: "It reduces the time complexity from exponential to polynomial O(n²).", isCorrect: false },
      { optionKey: "D", statement: "It eliminates the need to calculate path cost g(n).", isCorrect: false },
    ],
    correctOptionKey: "B",
    detailedExplanation: "A consistent (monotonic) heuristic guarantees that f(n) = g(n) + h(n) is non-decreasing along any path. Consequently, whenever A* selects a node for expansion from the priority queue (OPEN list), the cost to that node is guaranteed to be minimal. Nodes never need to be moved back from CLOSED to OPEN, drastically improving performance.",
    keyPoints: [
      "Consistency (monotonicity) implies Admissibility: h(n) <= h*(n).",
      "Graph-search A* requires consistency to prevent sub-optimal path expansions without node re-opening.",
    ],
    referenceCitation: "Russell & Norvig, Artificial Intelligence: A Modern Approach, 4th Edition, Chapter 3 (Informed Search), Section 3.5.2.",
    source: {
      sourceName: "AI Question Generator (Awaiting Faculty Review)",
      examYear: 2026,
      postTitle: "AI Generated - Pending Faculty Approval",
      bookTitle: "AI: A Modern Approach (Russell & Norvig)",
    },
  },
];
