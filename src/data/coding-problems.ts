// Academic Interview Pro - Coding Problem Bank for CS Lecturer Selection Boards
// Supported Languages: C++, Java, Python, JavaScript

export type ProgrammingLanguage = "cpp" | "java" | "python" | "javascript";

export interface TestCase {
  input: string;
  expectedOutput: string;
  explanation?: string;
  isHidden?: boolean;
}

export interface CodingProblem {
  id: string;
  slug: string;
  title: string;
  difficulty: "EASY" | "MEDIUM" | "HARD" | "EXPERT";
  category: "DATA_STRUCTURES" | "ALGORITHMS" | "SYSTEMS" | "OOP" | "DYNAMIC_PROGRAMMING";
  categoryLabel: string;
  description: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string[];
  expectedTimeComplexity: string;
  expectedSpaceComplexity: string;
  academicSignificance: string;
  whiteboardTips: string[];
  sampleTestCases: TestCase[];
  hiddenTestCases: TestCase[];
  starterCode: Record<ProgrammingLanguage, string>;
}

export const CODING_PROBLEMS: CodingProblem[] = [
  // 1. LRU Cache
  {
    id: "prob-1",
    slug: "lru-cache-implementation",
    title: "LRU Cache (Design & O(1) Operations)",
    difficulty: "HARD",
    category: "DATA_STRUCTURES",
    categoryLabel: "Data Structures & Systems",
    description:
      "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache. Implement the LRUCache class with get(key) and put(key, value) operations in O(1) average time complexity.",
    inputFormat:
      "First line specifies the cache capacity C. Subsequent lines contain operations: 'put key value' or 'get key'.",
    outputFormat:
      "For each 'get key' operation, output the integer value, or -1 if the key is not present in the cache.",
    constraints: [
      "1 <= capacity <= 3000",
      "0 <= key <= 10^4",
      "0 <= value <= 10^5",
      "At most 2 * 10^5 calls will be made to get and put.",
      "Strict requirement: Both get and put must execute in O(1) average time.",
    ],
    expectedTimeComplexity: "O(1) per operation",
    expectedSpaceComplexity: "O(Capacity) auxiliary space",
    academicSignificance:
      "A classic Selection Board viva question testing knowledge of Operating System page replacement, doubly-linked lists with pointer splicing, and hash map bucket iterators.",
    whiteboardTips: [
      "Draw the hash table keys pointing directly to doubly linked list node pointers.",
      "Explain why a singly linked list is insufficient for O(1) eviction (requires O(N) to update previous pointer).",
      "Mention that modern Linux kernel page cache uses an approximation (Clock / Two-handed clock) to avoid lock contention.",
    ],
    sampleTestCases: [
      {
        input: "capacity=2\nput 1 100\nput 2 200\nget 1\nput 3 300\nget 2\nget 3",
        expectedOutput: "100\n-1\n300",
        explanation: "Key 2 is evicted when key 3 is added because key 1 was recently accessed.",
      },
    ],
    hiddenTestCases: [
      {
        input: "capacity=1\nput 10 500\nget 10\nput 20 600\nget 10\nget 20",
        expectedOutput: "500\n-1\n600",
        isHidden: true,
      },
      {
        input: "capacity=3\nput 1 1\nput 2 2\nput 3 3\nput 4 4\nget 1\nget 2",
        expectedOutput: "-1\n2",
        isHidden: true,
      },
    ],
    starterCode: {
      cpp: `// C++20 Standard
#include <iostream>
#include <unordered_map>
#include <list>
using namespace std;

class LRUCache {
private:
    int cap;
    list<pair<int, int>> dll;
    unordered_map<int, list<pair<int, int>>::iterator> map;

public:
    LRUCache(int capacity) : cap(capacity) {}

    int get(int key) {
        // Implement O(1) lookup & recency update
        return -1;
    }

    void put(int key, int value) {
        // Implement O(1) insertion & LRU eviction
    }
};

int main() {
    LRUCache cache(2);
    cache.put(1, 100);
    cache.put(2, 200);
    cout << cache.get(1) << endl;
    return 0;
}`,
      java: `// Java 21 Standard
import java.util.*;

class LRUCache {
    private final int capacity;
    private final Map<Integer, Integer> map;

    public LRUCache(int capacity) {
        this.capacity = capacity;
        this.map = new LinkedHashMap<>(capacity, 0.75f, true) {
            @Override
            protected boolean removeEldestEntry(Map.Entry<Integer, Integer> eldest) {
                return size() > capacity;
            }
        };
    }

    public int get(int key) {
        return map.getOrDefault(key, -1);
    }

    public void put(int key, int value) {
        map.put(key, value);
    }

    public static void main(String[] args) {
        LRUCache cache = new LRUCache(2);
        cache.put(1, 100);
        cache.put(2, 200);
        System.out.println(cache.get(1));
    }
}`,
      python: `# Python 3.12 Standard
from collections import OrderedDict

class LRUCache:
    def __init__(self, capacity: int):
        self.capacity = capacity
        self.cache = OrderedDict()

    def get(self, key: int) -> int:
        if key not in self.cache:
            return -1
        self.cache.move_to_end(key)
        return self.cache[key]

    def put(self, key: int, value: int) -> None:
        if key in self.cache:
            self.cache.move_to_end(key)
        self.cache[key] = value
        if len(self.cache) > self.capacity:
            self.cache.popitem(last=False)

if __name__ == "__main__":
    cache = LRUCache(2)
    cache.put(1, 100)
    cache.put(2, 200)
    print(cache.get(1))`,
      javascript: `// Node.js ES2023 Standard
class LRUCache {
    constructor(capacity) {
        this.capacity = capacity;
        this.cache = new Map();
    }

    get(key) {
        if (!this.cache.has(key)) return -1;
        const val = this.cache.get(key);
        this.cache.delete(key);
        this.cache.set(key, val);
        return val;
    }

    put(key, value) {
        if (this.cache.has(key)) {
            this.cache.delete(key);
        } else if (this.cache.size >= this.capacity) {
            const oldestKey = this.cache.keys().next().value;
            this.cache.delete(oldestKey);
        }
        this.cache.set(key, value);
    }
}

const cache = new LRUCache(2);
cache.put(1, 100);
cache.put(2, 200);
console.log(cache.get(1));`,
    },
  },

  // 2. Floyd's Cycle Detection
  {
    id: "prob-2",
    slug: "floyds-cycle-detection",
    title: "Floyd's Cycle Detection (Linked List Loop & Rendezvous)",
    difficulty: "MEDIUM",
    category: "ALGORITHMS",
    categoryLabel: "Algorithms & Linked Structures",
    description:
      "Given the head of a linked list, return the node where the cycle begins. If there is no cycle, return null. Solve without modifying the linked list and using strictly O(1) auxiliary space.",
    inputFormat: "An array of node values and an integer pos indicating the index of the cycle entry node (-1 if no cycle).",
    outputFormat: "Output the value of the cycle entry node or 'null'.",
    constraints: [
      "The number of nodes in the list is in the range [0, 10^5].",
      "-10^5 <= Node.val <= 10^5",
      "pos is -1 or a valid index in the linked-list.",
      "Strict requirement: O(1) auxiliary space (no hash sets permitted).",
    ],
    expectedTimeComplexity: "O(N) linear time",
    expectedSpaceComplexity: "O(1) constant space",
    academicSignificance:
      "Frequently asked in selection boards to test candidate's mathematical proof capability: proving that 2(F + a) = F + kC + a implies F = (k-1)C + (C - a).",
    whiteboardTips: [
      "Derive the mathematical proof step-by-step on the board.",
      "Identify the slow pointer moving 1 step and fast pointer moving 2 steps.",
      "Show why fast moving 3 steps does not guarantee rendezvous without speed divisibility conditions.",
    ],
    sampleTestCases: [
      {
        input: "head = [3,2,0,-4], pos = 1",
        expectedOutput: "Node with value 2",
        explanation: "There is a cycle in the linked list, where tail connects to the second node.",
      },
    ],
    hiddenTestCases: [
      {
        input: "head = [1,2], pos = 0",
        expectedOutput: "Node with value 1",
        isHidden: true,
      },
      {
        input: "head = [1], pos = -1",
        expectedOutput: "null",
        isHidden: true,
      },
    ],
    starterCode: {
      cpp: `// C++20 Standard
#include <iostream>
using namespace std;

struct ListNode {
    int val;
    ListNode *next;
    ListNode(int x) : val(x), next(nullptr) {}
};

ListNode *detectCycle(ListNode *head) {
    // Implement Floyd's Tortoise and Hare Algorithm
    // Return pointer to cycle start, or nullptr
    return nullptr;
}

int main() {
    ListNode* n1 = new ListNode(3);
    ListNode* n2 = new ListNode(2);
    n1->next = n2;
    n2->next = n1; // cycle
    ListNode* start = detectCycle(n1);
    cout << (start ? to_string(start->val) : "null") << endl;
    return 0;
}`,
      java: `// Java 21 Standard
class ListNode {
    int val;
    ListNode next;
    ListNode(int x) { val = x; next = null; }
}

public class Solution {
    public static ListNode detectCycle(ListNode head) {
        if (head == null || head.next == null) return null;
        ListNode slow = head, fast = head;
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
            if (slow == fast) {
                ListNode entry = head;
                while (entry != slow) {
                    entry = entry.next;
                    slow = slow.next;
                }
                return entry;
            }
        }
        return null;
    }
    public static void main(String[] args) {
        ListNode n1 = new ListNode(3);
        ListNode n2 = new ListNode(2);
        n1.next = n2;
        n2.next = n1;
        ListNode res = detectCycle(n1);
        System.out.println(res != null ? res.val : "null");
    }
}`,
      python: `# Python 3.12 Standard
class ListNode:
    def __init__(self, x):
        self.val = x
        self.next = None

def detectCycle(head: ListNode) -> ListNode:
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            entry = head
            while entry != slow:
                entry = entry.next
                slow = slow.next
            return entry
    return None

if __name__ == "__main__":
    n1 = ListNode(3)
    n2 = ListNode(2)
    n1.next = n2
    n2.next = n1
    res = detectCycle(n1)
    print(res.val if res else "null")`,
      javascript: `// Node.js ES2023 Standard
function ListNode(val) {
    this.val = val;
    this.next = null;
}

function detectCycle(head) {
    let slow = head, fast = head;
    while (fast && fast.next) {
        slow = slow.next;
        fast = fast.next.next;
        if (slow === fast) {
            let entry = head;
            while (entry !== slow) {
                entry = entry.next;
                slow = slow.next;
            }
            return entry;
        }
    }
    return null;
}

const n1 = new ListNode(3);
const n2 = new ListNode(2);
n1.next = n2;
n2.next = n1;
const res = detectCycle(n1);
console.log(res ? res.val : "null");`,
    },
  },

  // 3. Coin Change Problem (Dynamic Programming)
  {
    id: "prob-3",
    slug: "coin-change-minimum-coins",
    title: "Coin Change (Dynamic Programming Minimum Coins)",
    difficulty: "MEDIUM",
    category: "DYNAMIC_PROGRAMMING",
    categoryLabel: "Dynamic Programming & Optimization",
    description:
      "You are given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money. Return the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return -1.",
    inputFormat: "First line: space-separated integers representing coin denominations. Second line: integer target amount.",
    outputFormat: "A single integer denoting the minimum coins needed, or -1.",
    constraints: [
      "1 <= coins.length <= 12",
      "1 <= coins[i] <= 2^31 - 1",
      "0 <= amount <= 10^4",
    ],
    expectedTimeComplexity: "O(Amount * Coins)",
    expectedSpaceComplexity: "O(Amount) 1D tabular space",
    academicSignificance:
      "Tests the transition from recursive greedy approaches (which fail for non-canonical coin systems like [1, 3, 4] with amount=6) to optimal substructure dynamic programming.",
    whiteboardTips: [
      "Show a counterexample where greedy fails (coins=[1, 3, 4], amount=6: Greedy picks 4+1+1=3 coins; DP finds 3+3=2 coins).",
      "Write out the state recurrence: dp[i] = min(dp[i], dp[i - c] + 1).",
    ],
    sampleTestCases: [
      {
        input: "coins = [1,2,5], amount = 11",
        expectedOutput: "3",
        explanation: "11 = 5 + 5 + 1 (3 coins total).",
      },
    ],
    hiddenTestCases: [
      {
        input: "coins = [2], amount = 3",
        expectedOutput: "-1",
        isHidden: true,
      },
      {
        input: "coins = [1], amount = 0",
        expectedOutput: "0",
        isHidden: true,
      },
    ],
    starterCode: {
      cpp: `// C++20 Standard
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int coinChange(vector<int>& coins, int amount) {
    vector<int> dp(amount + 1, amount + 1);
    dp[0] = 0;
    for (int i = 1; i <= amount; ++i) {
        for (int c : coins) {
            if (i - c >= 0) {
                dp[i] = min(dp[i], dp[i - c] + 1);
            }
        }
    }
    return dp[amount] > amount ? -1 : dp[amount];
}

int main() {
    vector<int> coins = {1, 2, 5};
    cout << coinChange(coins, 11) << endl;
    return 0;
}`,
      java: `// Java 21 Standard
import java.util.*;

public class Solution {
    public static int coinChange(int[] coins, int amount) {
        int[] dp = new int[amount + 1];
        Arrays.fill(dp, amount + 1);
        dp[0] = 0;
        for (int i = 1; i <= amount; i++) {
            for (int c : coins) {
                if (i - c >= 0) {
                    dp[i] = Math.min(dp[i], dp[i - c] + 1);
                }
            }
        }
        return dp[amount] > amount ? -1 : dp[amount];
    }
    public static void main(String[] args) {
        System.out.println(coinChange(new int[]{1, 2, 5}, 11));
    }
}`,
      python: `# Python 3.12 Standard
def coinChange(coins: list[int], amount: int) -> int:
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    for i in range(1, amount + 1):
        for c in coins:
            if i - c >= 0:
                dp[i] = min(dp[i], dp[i - c] + 1)
    return dp[amount] if dp[amount] != float('inf') else -1

if __name__ == "__main__":
    print(coinChange([1, 2, 5], 11))`,
      javascript: `// Node.js ES2023 Standard
function coinChange(coins, amount) {
    const dp = new Array(amount + 1).fill(amount + 1);
    dp[0] = 0;
    for (let i = 1; i <= amount; i++) {
        for (const c of coins) {
            if (i - c >= 0) {
                dp[i] = Math.min(dp[i], dp[i - c] + 1);
            }
        }
    }
    return dp[amount] > amount ? -1 : dp[amount];
}

console.log(coinChange([1, 2, 5], 11));`,
    },
  },

  // 4. Course Schedule (Topological Sort / Kahn's Algorithm)
  {
    id: "prob-4",
    slug: "course-schedule-cycle-detection",
    title: "Course Schedule (Topological Sort & DAG Cycle Detection)",
    difficulty: "HARD",
    category: "ALGORITHMS",
    categoryLabel: "Graph Theory & Automata",
    description:
      "There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. You are given an array prerequisites where prerequisites[i] = [a_i, b_i] indicates that you must take course b_i first if you want to take course a_i. Return true if you can finish all courses. Otherwise, return false.",
    inputFormat: "First line: integer numCourses. Subsequent lines: pair of integers [course, prerequisite].",
    outputFormat: "Boolean 'true' if the graph is a Directed Acyclic Graph (DAG), 'false' if it contains a cycle.",
    constraints: [
      "1 <= numCourses <= 2000",
      "0 <= prerequisites.length <= 5000",
      "prerequisites[i].length == 2",
      "All the pairs prerequisites[i] are unique.",
    ],
    expectedTimeComplexity: "O(V + E) linear in vertices and edges",
    expectedSpaceComplexity: "O(V + E) adjacency list & in-degree array",
    academicSignificance:
      "Essential university curriculum topic comparing Depth-First Search 3-color cycle detection (WHITE/GRAY/BLACK) with Kahn's in-degree zero BFS algorithm.",
    whiteboardTips: [
      "Explain Kahn's algorithm: maintain in-degree array, queue nodes with in-degree 0, decrement neighbors, count processed nodes.",
      "Contrast with Tarjan's strongly connected components algorithm.",
    ],
    sampleTestCases: [
      {
        input: "numCourses = 2, prerequisites = [[1,0]]",
        expectedOutput: "true",
        explanation: "To take course 1 you should have finished course 0. So it is possible.",
      },
    ],
    hiddenTestCases: [
      {
        input: "numCourses = 2, prerequisites = [[1,0],[0,1]]",
        expectedOutput: "false",
        isHidden: true,
      },
    ],
    starterCode: {
      cpp: `// C++20 Standard
#include <iostream>
#include <vector>
#include <queue>
using namespace std;

bool canFinish(int numCourses, vector<vector<int>>& prerequisites) {
    vector<int> inDegree(numCourses, 0);
    vector<vector<int>> adj(numCourses);
    for (auto& edge : prerequisites) {
        adj[edge[1]].push_back(edge[0]);
        inDegree[edge[0]]++;
    }
    queue<int> q;
    for (int i = 0; i < numCourses; ++i) {
        if (inDegree[i] == 0) q.push(i);
    }
    int visited = 0;
    while (!q.empty()) {
        int u = q.front(); q.pop();
        visited++;
        for (int v : adj[u]) {
            if (--inDegree[v] == 0) q.push(v);
        }
    }
    return visited == numCourses;
}

int main() {
    vector<vector<int>> pre = {{1, 0}};
    cout << (canFinish(2, pre) ? "true" : "false") << endl;
    return 0;
}`,
      java: `// Java 21 Standard
import java.util.*;

public class Solution {
    public static boolean canFinish(int numCourses, int[][] prerequisites) {
        int[] inDegree = new int[numCourses];
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < numCourses; i++) adj.add(new ArrayList<>());
        for (int[] edge : prerequisites) {
            adj.get(edge[1]).add(edge[0]);
            inDegree[edge[0]]++;
        }
        Queue<Integer> q = new LinkedList<>();
        for (int i = 0; i < numCourses; i++) {
            if (inDegree[i] == 0) q.offer(i);
        }
        int count = 0;
        while (!q.isEmpty()) {
            int u = q.poll();
            count++;
            for (int v : adj.get(u)) {
                if (--inDegree[v] == 0) q.offer(v);
            }
        }
        return count == numCourses;
    }
    public static void main(String[] args) {
        System.out.println(canFinish(2, new int[][]{{1, 0}}));
    }
}`,
      python: `# Python 3.12 Standard
from collections import deque

def canFinish(numCourses: int, prerequisites: list[list[int]]) -> bool:
    in_degree = [0] * numCourses
    adj = [[] for _ in range(numCourses)]
    for dest, src in prerequisites:
        adj[src].append(dest)
        in_degree[dest] += 1
    q = deque([i for i in range(numCourses) if in_degree[i] == 0])
    visited = 0
    while q:
        u = q.popleft()
        visited += 1
        for v in adj[u]:
            in_degree[v] -= 1
            if in_degree[v] == 0:
                q.append(v)
    return visited == numCourses

if __name__ == "__main__":
    print(canFinish(2, [[1, 0]]))`,
      javascript: `// Node.js ES2023 Standard
function canFinish(numCourses, prerequisites) {
    const inDegree = new Array(numCourses).fill(0);
    const adj = Array.from({ length: numCourses }, () => []);
    for (const [dest, src] of prerequisites) {
        adj[src].push(dest);
        inDegree[dest]++;
    }
    const q = [];
    for (let i = 0; i < numCourses; i++) {
        if (inDegree[i] === 0) q.push(i);
    }
    let visited = 0;
    while (q.length > 0) {
        const u = q.shift();
        visited++;
        for (const v of adj[u]) {
            inDegree[v]--;
            if (inDegree[v] === 0) q.push(v);
        }
    }
    return visited === numCourses;
}

console.log(canFinish(2, [[1, 0]]));`,
    },
  },
];
