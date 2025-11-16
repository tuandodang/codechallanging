# Task Scheduler - Python Solution

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
- Python 3.11+ installed
- pip or conda

### Installation
```bash
# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### Running the Solution
```bash
python task_scheduler.py
```

### Running Tests
```bash
# Run all tests with unittest
python -m unittest test_task_scheduler.py

# Or use pytest (recommended)
pytest test_task_scheduler.py -v

# Run with coverage report
pytest test_task_scheduler.py --cov=task_scheduler --cov-report=html

# View coverage report
# Open htmlcov/index.html in browser
```

## Assumptions

TODO: List any assumptions you made:
- Example: I assumed that task identifiers are case-sensitive
- Example: Empty task list returns an empty list (not None)
- Example: When multiple valid orderings exist, any one can be returned
- Example: Invalid task references raise ValueError

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
- [ ] AI tools were used for: [specify what, e.g., "syntax help with Python type hints"]

## Alternative Approaches Considered

**TODO: (Optional for senior level)**

1. **Kahn's Algorithm (BFS-based):**
   - Pros: Iterative, easy to understand, naturally detects cycles
   - Cons: Requires in-degree tracking

2. **DFS-based with recursion:**
   - Pros: Elegant, less code
   - Cons: Stack overflow risk for very deep graphs

3. **Why I chose [selected approach]:**
   - ...

## Design Decisions

**TODO: Explain key decisions**

- Why I used `defaultdict` vs regular `dict`
- How I handle error cases (None vs exceptions)
- Data structure choices

## Code Quality

### Type Hints
- Used Python type hints throughout for better code clarity
- Compatible with mypy static type checker

### Code Style
- Follows PEP 8 style guidelines
- Docstrings in Google/NumPy style

## Future Improvements

**TODO: (Optional)**

If I had more time, I would:
- Add performance benchmarking with timeit
- Implement parallel execution simulation
- Add visualization of the dependency graph using graphviz
- Add support for weighted dependencies (priority)
