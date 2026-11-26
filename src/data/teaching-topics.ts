// Academic Interview Pro - University Teaching Demonstration Topics
// Aligned with the Revised HEC Pakistan Computer Science Curriculum 2025

export interface TeachingTopic {
  id: string;
  slug: string;
  subjectSlug: string;
  subjectTitle: string;
  topicTitle: string;
  targetAudience: string;
  recommendedDurationMinutes: number;
  coreObjective: string;
  keyAnalogies: string[];
  blackboardStrategy: {
    leftPanel: string;
    centerPanel: string;
    rightPanel: string;
  };
  commonStudentMisconceptions: string[];
}

export const TEACHING_DEMO_TOPICS: TeachingTopic[] = [
  {
    id: "demo-1",
    slug: "paging-and-virtual-memory",
    subjectSlug: "operating-systems",
    subjectTitle: "Operating Systems",
    topicTitle: "Virtual Memory, Paging & Translation Lookaside Buffer (TLB)",
    targetAudience: "3rd-Semester BS Computer Science Students",
    recommendedDurationMinutes: 5,
    coreObjective:
      "Explain the distinction between logical (virtual) addresses and physical memory frames, and how the MMU / TLB achieves hardware address translation without application awareness.",
    keyAnalogies: [
      "Library Book Index: Virtual address is the call number in the library catalog; physical frame is the physical shelf location in the warehouse.",
      "Hotel Room Keys: Keycard number is virtual; actual assigned room suite number is physical.",
    ],
    blackboardStrategy: {
      leftPanel: "1. Core Definitions: Virtual Address Space vs Physical DRAM. Page vs Frame.",
      centerPanel: "2. Address Translation Diagram: Logical Address (Page Number p, Offset d) -> Page Table -> Physical Address (Frame f, Offset d).",
      rightPanel: "3. Hardware Acceleration: TLB Cache Hit vs Miss latency penalties & Page Fault ISR steps.",
    },
    commonStudentMisconceptions: [
      "Thinking page offset 'd' changes during translation (offset is invariant).",
      "Confusing page fault (disk read) with segmentation fault (memory protection violation).",
    ],
  },
  {
    id: "demo-2",
    slug: "recursion-call-stack-frames",
    subjectSlug: "programming-fundamentals",
    subjectTitle: "Programming Fundamentals",
    topicTitle: "Recursion & Call Stack Frame Mechanics",
    targetAudience: "1st-Semester BS Computer Science Students",
    recommendedDurationMinutes: 5,
    coreObjective:
      "Demystify recursive execution by tracing memory activation records (stack frames), base case termination, and return winding/unwinding.",
    keyAnalogies: [
      "Russian Nesting Dolls (Matryoshka): Opening successive dolls until the smallest solid doll (base case) is reached, then reassembling on return.",
      "Cafeteria Tray Dispenser: Pushing plates on top and popping them in Last-In-First-Out (LIFO) order.",
    ],
    blackboardStrategy: {
      leftPanel: "1. The Two Pillars: Base Case (Termination) + Recursive Step (Progress toward Base Case).",
      centerPanel: "2. Call Stack Memory Box: Visualizing Stack Frames for factorial(3) pushing down and popping back up.",
      rightPanel: "3. Traps & Pitfalls: Stack Overflow Error, Infinite Recursion, and Tail-Call Optimization (TCO).",
    },
    commonStudentMisconceptions: [
      "Assuming all recursive calls execute simultaneously rather than sequentially through the call stack.",
      "Forgetting to return the result of recursive sub-calls.",
    ],
  },
  {
    id: "demo-3",
    slug: "b-trees-vs-b-plus-trees",
    subjectSlug: "database-management-systems",
    subjectTitle: "Database Management Systems",
    topicTitle: "B-Trees vs B+ Trees in Relational Database Indexing",
    targetAudience: "4th-Semester BS Computer Science Students",
    recommendedDurationMinutes: 5,
    coreObjective:
      "Demonstrate why database storage engines (PostgreSQL, MySQL InnoDB) exclusively adopt B+ Trees rather than standard B-Trees for disk page indexing.",
    keyAnalogies: [
      "Encyclopedia vs Index: B+ Tree internal nodes are the table of contents (keys only); all articles and bidirectional bookmark links live in the volume pages (leaf nodes).",
    ],
    blackboardStrategy: {
      leftPanel: "1. The Disk I/O Bottleneck: Memory hierarchy speeds (RAM 100ns vs SSD/HDD 100μs-10ms).",
      centerPanel: "2. Structural Comparison: B-Tree (data in every node) vs B+ Tree (data strictly in leaves + leaf linked list).",
      rightPanel: "3. Performance Tradeoffs: Fan-out multiplier per 4KB disk page & fast range query sequential scans.",
    },
    commonStudentMisconceptions: [
      "Thinking B-Trees are Binary Trees (B stands for Balanced multi-way search tree).",
      "Failing to recognize that range scans (e.g. BETWEEN 10 AND 50) require slow in-order tree traversal in regular B-Trees.",
    ],
  },
  {
    id: "demo-4",
    slug: "master-theorem-divide-and-conquer",
    subjectSlug: "algorithms",
    subjectTitle: "Analysis of Algorithms",
    topicTitle: "Master Theorem for Divide-and-Conquer Recurrences",
    targetAudience: "3rd-Semester BS Computer Science Students",
    recommendedDurationMinutes: 5,
    coreObjective:
      "Equip undergraduates with an intuitive technique to instantly solve divide-and-conquer recurrences T(n) = aT(n/b) + f(n) by comparing leaf work with root work.",
    keyAnalogies: [
      "The Tree of Tasks: A company CEO dividing work into 'a' sub-managers, each handling 'n/b' fraction of work, with overhead 'f(n)'. Who does more work—the workers at leaves or managers at top?",
    ],
    blackboardStrategy: {
      leftPanel: "1. The Recurrence Template: T(n) = a T(n/b) + f(n), with a >= 1, b > 1.",
      centerPanel: "2. The Watershed Benchmark: Calculate critical exponent c_crit = log_b(a). Compare n^(log_b a) vs f(n).",
      rightPanel: "3. The Three Cases: Case 1 (Leaves dominate: Θ(n^log_b a)), Case 2 (Tie: Θ(n^log_b a * log n)), Case 3 (Root dominates: Θ(f(n))).",
    },
    commonStudentMisconceptions: [
      "Attempting to apply Master Theorem when 'a' is not constant (e.g. T(n) = 2^n T(n/2) + n).",
      "Missing the polynomial difference requirement (polynomially smaller/larger vs asymptotically different).",
    ],
  },
];
