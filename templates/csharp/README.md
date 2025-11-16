# Task Scheduler - C# Solution

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
- .NET 8.0 SDK or later installed
- Visual Studio 2022, VS Code, or Rider (optional)

### Build
```bash
dotnet build
```

### Running the Solution
```bash
dotnet run
```

### Running Tests
```bash
# Run all tests
dotnet test

# Run tests with detailed output
dotnet test -v normal

# Run tests with coverage
dotnet test /p:CollectCoverage=true /p:CoverletOutputFormat=opencover

# Run specific test
dotnet test --filter "FullyQualifiedName~SimpleLinearChain"
```

### Running in Visual Studio
1. Open `TaskScheduler.csproj` in Visual Studio
2. Press F5 to run or Ctrl+R, Ctrl+T to run tests

## Project Structure

```
TaskSchedulerChallenge/
├── TaskScheduler.cs          # Main implementation
├── TaskSchedulerTests.cs     # Unit tests (xUnit)
├── TaskScheduler.csproj      # Project file
└── README.md                 # This file
```

## Assumptions

TODO: List any assumptions you made:
- Example: I assumed that task identifiers are case-sensitive
- Example: Empty task list returns an empty list (not null)
- Example: When multiple valid orderings exist, any one can be returned
- Example: Invalid task references throw ArgumentException

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
- [ ] AI tools were used for: [specify what, e.g., "syntax help with C# nullable reference types"]

## Alternative Approaches Considered

**TODO: (Optional for senior level)**

1. **Kahn's Algorithm (BFS-based):**
   - Pros: Iterative, easy to understand, natural cycle detection
   - Cons: Requires queue and in-degree tracking

2. **DFS-based with recursion:**
   - Pros: Elegant, concise code
   - Cons: Stack overflow risk for very deep graphs

3. **Why I chose [selected approach]:**
   - ...

## Design Decisions

**TODO: Explain key decisions**

- Why I used `Dictionary<string, List<string>>` for adjacency list
- How I handle error cases (null vs exceptions)
- Use of nullable reference types (`List<string>?`)
- Choice of data structures (Queue, Stack, HashSet, etc.)

## Code Quality Features

### Language Features Used
- C# 12 features (if applicable)
- Nullable reference types enabled
- XML documentation comments
- Tuple syntax for dependency pairs

### Best Practices
- SOLID principles
- Separation of concerns
- Meaningful naming conventions
- Comprehensive XML comments

## Future Improvements

**TODO: (Optional)**

If I had more time, I would:
- Add performance benchmarking with BenchmarkDotNet
- Implement ITaskScheduler interface for testability
- Add async version for large-scale processing
- Implement visualization using DOT format
- Add support for weighted/priority dependencies
