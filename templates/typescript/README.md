# Task Scheduler - TypeScript Solution

## Algorithm Approach

**TODO: Describe your approach here**

I implemented [Kahn's Algorithm / DFS-based topological sort] because...

### Algorithm Steps:
1. TODO: Step 1
2. TODO: Step 2
3. TODO: Step 3

## Complexity Analysis

- **Time Complexity:** O(V + E)
  - TODO: Explain why
  - V = number of tasks
  - E = number of dependencies

- **Space Complexity:** O(V + E)
  - TODO: Explain the data structures used

## How to Build/Run

### Prerequisites
- Node.js 20+ installed
- npm or yarn

### Installation
```bash
npm install
```

### Running the Solution
```bash
npm start
```

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## Assumptions

TODO: List any assumptions you made:
- Example: I assumed that task identifiers are case-sensitive
- Example: Empty task list returns an empty array (not null)
- Example: When multiple valid orderings exist, any one can be returned

## Test Coverage

Implemented tests for:
- ✅ Simple linear dependency chain
- ✅ Multiple independent chains
- ✅ Diamond-shaped dependency graph
- ✅ Empty input
- ✅ Single task
- ✅ No dependencies
- ✅ Circular dependency detection
- ✅ Self-dependency detection
- ✅ Invalid task reference handling
- ✅ Disconnected components

## AI Assistance

**TODO: If you used AI tools, disclose here**

- [ ] No AI tools were used
- [ ] AI tools were used for: [specify what, e.g., "syntax help with TypeScript generics"]

## Alternative Approaches Considered

**TODO: (Optional for senior level)**

1. **Kahn's Algorithm (BFS-based):**
   - Pros: ...
   - Cons: ...

2. **DFS-based with recursion:**
   - Pros: ...
   - Cons: ...

3. **Why I chose [selected approach]:**
   - ...

## Design Decisions

**TODO: Explain key decisions**

- Why I used Map vs plain objects
- How I handle error cases
- Data structure choices

## Future Improvements

**TODO: (Optional)**

If I had more time, I would:
- Add performance benchmarking
- Implement parallel execution simulation
- Add visualization of the dependency graph
