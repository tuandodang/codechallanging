# Task Scheduler Coding Challenge – Dependency Resolution & Topological Ordering

## 1. Challenge Overview

**Title:** Task Scheduler Coding Challenge – Dependency Resolution

**Goal:** Assess candidate's ability to:
- Understand a problem statement involving graph algorithms
- Design an efficient algorithm using topological sorting
- Write clean, maintainable, and testable code
- Handle edge cases and error conditions appropriately

**Target Level:** Mid-level (with variations for Junior/Senior in bonus sections)

**Time Limit:** 90 minutes

---

## 2. Problem Statement

### Context / Story
You are building a task execution system for a DevOps pipeline. Tasks have dependencies on other tasks – for example, "deploy" depends on "build", which depends on "test". Before executing tasks, the system needs to determine a valid execution order that respects all dependencies.

### Formal Problem Description

Given a list of tasks and their dependencies, determine a valid execution order such that no task is executed before its dependencies are completed. If such an order is impossible (due to circular dependencies), report the error.

**Input:**
- A list of tasks (each task has a unique identifier)
- A list of dependency pairs, where each pair `(A, B)` means "task A depends on task B" (B must execute before A)

**Output:**
- A valid execution order (one possible topological sort of the task graph), OR
- An error indicator if no valid order exists (circular dependency detected)

**Constraints:**
- Number of tasks: 1 ≤ N ≤ 10,000
- Number of dependencies: 0 ≤ D ≤ 50,000
- Task identifiers: non-empty strings (max 50 characters)
- A task can depend on zero or more other tasks
- No duplicate dependency pairs in input

### Input Format

**Option 1 - Function Parameters (Recommended):**
```
function findExecutionOrder(tasks: string[], dependencies: [string, string][]): string[] | null
```

**Option 2 - JSON API Request:**
```json
{
  "tasks": ["task1", "task2", "task3"],
  "dependencies": [
    ["task1", "task2"],
    ["task2", "task3"]
  ]
}
```

### Output Format

**Success Case:**
- Return an array/list of task identifiers in valid execution order
- If multiple valid orders exist, return any one of them

**Failure Case:**
- Return `null` (or equivalent in your language: `None`, `nil`, empty with error flag)
- OR throw/return a specific error: `CircularDependencyError`

### Examples

#### Example 1: Simple Linear Dependencies
**Input:**
```
tasks: ["deploy", "build", "test"]
dependencies: [["deploy", "build"], ["build", "test"]]
```

**Output:**
```
["test", "build", "deploy"]
```

**Explanation:**
- "deploy" depends on "build"
- "build" depends on "test"
- Valid order: test → build → deploy

#### Example 2: Multiple Independent Chains
**Input:**
```
tasks: ["task1", "task2", "task3", "task4"]
dependencies: [["task2", "task1"], ["task4", "task3"]]
```

**Output (one possible answer):**
```
["task1", "task3", "task2", "task4"]
```
or
```
["task3", "task1", "task4", "task2"]
```

**Explanation:**
- task2 depends on task1
- task4 depends on task3
- task1 and task3 are independent, so multiple valid orders exist

#### Example 3: Circular Dependency
**Input:**
```
tasks: ["A", "B", "C"]
dependencies: [["A", "B"], ["B", "C"], ["C", "A"]]
```

**Output:**
```
null  (or CircularDependencyError)
```

**Explanation:**
- A depends on B, B depends on C, C depends on A
- This creates a cycle, making execution impossible

#### Example 4: No Dependencies
**Input:**
```
tasks: ["task1", "task2", "task3"]
dependencies: []
```

**Output (one possible answer):**
```
["task1", "task2", "task3"]
```

**Explanation:**
- No dependencies, so any order is valid

---

## 3. Functional Requirements

The solution **MUST:**

### ✓ Correctness
- Produce a valid topological ordering for acyclic dependency graphs
- Detect and report circular dependencies
- Handle all tasks (including isolated tasks with no dependencies)
- Ensure no task appears before any of its dependencies in the output

### ✓ Edge Cases
Handle the following edge cases:
- Empty task list → return empty array
- Tasks with no dependencies → include them in any valid position
- Single task with no dependencies → return array with that single task
- All tasks forming one long chain → return the correct linear order
- Multiple disconnected components in the dependency graph
- Task that depends on itself (direct cycle)

### ✓ Error Handling
- **Invalid Input:**
  - Dependency references a task not in the task list → return error or throw exception
  - Null/undefined inputs → return error or throw exception
- **Circular Dependencies:**
  - Return `null` or throw `CircularDependencyError` with descriptive message

---

## 4. Non-Functional Requirements

The solution **SHOULD:**

### ⚡ Performance
- **Time Complexity:** O(V + E) where V = number of tasks, E = number of dependencies
  - Use Kahn's algorithm (BFS-based) or DFS-based topological sort
- **Space Complexity:** O(V + E) for storing the graph
- Handle maximum input size (10,000 tasks, 50,000 dependencies) in under 1 second

### 📝 Code Quality
- **Readability:**
  - Use meaningful variable and function names (e.g., `inDegree`, `adjacencyList`, not `x`, `arr`)
  - Consistent formatting and indentation
- **Structure:**
  - Separate concerns: graph building, cycle detection, topological sort logic
  - Avoid monolithic functions (no functions over 50 lines)
  - Use appropriate data structures (adjacency list, queue/stack)
- **DRY Principle:**
  - No duplicate logic
  - Extract reusable helper functions

### 🧪 Testing
Include unit tests for:
- **Normal cases:**
  - Linear dependency chain
  - Multiple independent tasks
  - Diamond-shaped dependency graph
- **Edge cases:**
  - Empty input
  - Single task
  - No dependencies
  - Large input (performance test)
- **Negative cases:**
  - Circular dependency (simple cycle)
  - Complex circular dependency
  - Invalid task reference in dependencies

**Minimum:** 8 test cases covering above scenarios

### 📚 Documentation
Provide a **README.md** with:
- Brief explanation of your algorithm approach (Kahn's or DFS-based)
- Time and space complexity analysis
- How to run the solution
- How to run the tests
- Any assumptions made

---

## 5. Technical Constraints

### Allowed Languages
Choose **ONE** of the following:
- **C# (.NET 8+)**
- **Java (JDK 17+)**
- **JavaScript/TypeScript (Node.js 20+)**
- **Python (3.11+)**
- **Go (1.21+)**

### Runtime/Version Requirements
| Language | Version |
|----------|---------|
| C# | .NET 8.0 or later |
| Java | JDK 17 or later |
| TypeScript | Node.js 20+ with TypeScript 5+ |
| JavaScript | Node.js 20+ (ES2022+) |
| Python | 3.11+ |
| Go | 1.21+ |

### Allowed Libraries
- ✅ **Standard libraries:** YES (collections, data structures, testing utilities)
- ✅ **Testing frameworks:**
  - C#: xUnit, NUnit, MSTest
  - Java: JUnit 5, TestNG
  - JavaScript/TypeScript: Jest, Mocha, Vitest
  - Python: pytest, unittest
  - Go: testing package, testify
- ❌ **Graph algorithm libraries:** NO (e.g., NetworkX for Python, JGraphT for Java)
- ❌ **Third-party topological sort implementations:** NO

**You must implement the topological sort algorithm yourself.**

### Development Environment
- Local development (your own IDE/editor)
- Solution submitted via Git repository or ZIP file

---

## 6. Submission Requirements

Candidates must provide:

### 📁 Source Code Structure
```
task-scheduler/
├── README.md
├── src/
│   ├── TaskScheduler.[ext]      # Main implementation
│   └── (other source files)
├── tests/
│   └── TaskSchedulerTests.[ext] # Unit tests
├── (language-specific files)
│   ├── package.json (Node.js)
│   ├── requirements.txt (Python)
│   ├── go.mod (Go)
│   ├── pom.xml (Java/Maven)
│   └── *.csproj (C#)
└── examples/                     # Optional: example usage
```

### 📖 README.md Must Include:
1. **Algorithm Approach:**
   - Which algorithm did you use? (Kahn's algorithm, DFS-based, etc.)
   - Why did you choose this approach?
2. **Complexity Analysis:**
   - Time complexity
   - Space complexity
3. **How to Build/Run:**
   ```bash
   # Example for Node.js
   npm install
   npm start
   ```
4. **How to Run Tests:**
   ```bash
   # Example
   npm test
   ```
5. **Assumptions:**
   - Any assumptions you made about the input/output

### ✅ Tests
- Minimum 8 test cases (as specified in section 4)
- Tests must be runnable with a single command
- All tests must pass

### 🎓 Optional (for Senior-level consideration)
- **Brief Architecture Note:**
  - Alternative approaches considered
  - Trade-offs between Kahn's algorithm vs DFS approach
  - How would you extend this for distributed systems?
- **Performance Benchmarking:**
  - Include a benchmark test for large inputs

---

## 7. Evaluation Criteria

Your submission will be evaluated based on:

| Criteria | Weight | Description |
|----------|--------|-------------|
| **Correctness** | 40% | ✓ Passes sample test cases<br>✓ Passes hidden test cases<br>✓ Handles edge cases<br>✓ Correctly detects cycles |
| **Code Quality & Design** | 25% | ✓ Readability and structure<br>✓ Proper naming conventions<br>✓ Separation of concerns<br>✓ No code smells |
| **Performance & Efficiency** | 20% | ✓ Appropriate algorithm choice<br>✓ Efficient data structures<br>✓ Handles large inputs within time limits |
| **Testing & Robustness** | 15% | ✓ Comprehensive test coverage<br>✓ Edge case handling<br>✓ Clear test descriptions |

**Total:** 100%

**Passing Score:** 70% minimum

---

## 8. Rules & Restrictions

### ⚖️ Original Work
- This must be your own work
- Do not copy solutions from the internet, LeetCode, or other sources
- You may reference documentation for language syntax/standard library

### 💬 Communication
- This is an individual assessment
- No collaboration with other candidates during the challenge period
- You may ask the proctor clarifying questions about requirements

### 🤖 AI Tools Policy
**Allowed with Disclosure:**
- You MAY use AI tools (GitHub Copilot, ChatGPT, etc.) for:
  - Syntax help
  - Standard library usage
  - Boilerplate code generation
- You MUST NOT use AI tools to:
  - Generate the complete solution
  - Implement the core algorithm
- **If you use AI tools, mention it in your README under an "AI Assistance" section**

### 🔍 Plagiarism Check
- Solutions will be scanned using plagiarism detection tools
- Submissions with significant similarity to online sources will be disqualified

### ⏱️ Time Management
- Total time: **90 minutes**
- Recommended breakdown:
  - Understanding & design: 15 min
  - Implementation: 45 min
  - Testing: 20 min
  - Documentation: 10 min

---

## 9. Getting Started

### Quick Start Checklist
- [ ] Read the entire problem statement carefully
- [ ] Understand the input/output format
- [ ] Choose your programming language
- [ ] Set up your development environment
- [ ] Implement the solution
- [ ] Write comprehensive tests
- [ ] Document your approach in README.md
- [ ] Test with all provided examples
- [ ] Submit before the deadline

### Need Clarification?
If any requirement is unclear, ask the proctor immediately. Common questions:
- **Q:** Can I use language-specific collection types?
  - **A:** Yes, standard collections are allowed
- **Q:** What if there are multiple valid orderings?
  - **A:** Return any one valid ordering
- **Q:** Should I validate input thoroughly?
  - **A:** Yes, handle invalid task references and null inputs

---

## 10. Submission

**Deadline:** [TO BE FILLED BY PROCTOR]

**Submission Method:** [Choose one]
- [ ] Upload ZIP file to provided portal
- [ ] Push to provided Git repository
- [ ] Email to: [email address]

**File Naming:**
- ZIP: `taskscheduler_[YourName]_[Timestamp].zip`
- Git Repo: Use branch `solution/[your-name]`

---

## Good Luck! 🚀

Remember:
- **Working code** is better than perfect code
- **Test your solution** with the provided examples
- **Document your thinking** – we value your approach
- **Ask questions** if requirements are unclear

*This challenge is designed to assess your problem-solving skills, not to trick you. Be methodical, write clean code, and show your best work.*
