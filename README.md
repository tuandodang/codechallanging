# Coding Challenge Platform - Complete System

> A comprehensive platform for managing coding challenges, events, and competitions with a full-featured backend API and ready-to-use challenge templates.

## 📦 What's Included

This repository contains:

1. **Backend API** - Complete RESTful API with authentication, authorization, and management modules
2. **Challenge Templates** - Ready-to-use coding challenge templates for candidates
3. **Documentation** - Comprehensive API and usage documentation

## 📋 Quick Links

### Backend System
- **[Backend README](BACKEND_README.md)** - Complete backend setup and usage guide
- **[API Documentation](API_DOCUMENTATION.md)** - Detailed API endpoint documentation

### Coding Challenge Templates
- **[Challenge Document](CODING_CHALLENGE.md)** - Complete challenge requirements and problem statement
- **[Submission Guidelines](SUBMISSION_GUIDELINES.md)** - How to submit solutions
- **[Test Cases](test_cases.json)** - Sample test cases in JSON format

---

## 🚀 Backend System

A complete Node.js/TypeScript backend with Express.js for managing coding challenges, events, users, and submissions.

### Features

- ✅ **User Management** - Registration, authentication, profiles
- ✅ **Authentication & Authorization** - JWT-based auth with RBAC
- ✅ **Event Management** - Hackathons, contests, challenges
- ✅ **Problem Management** - Create and manage coding problems
- ✅ **Submission System** - Submit and evaluate solutions
- ✅ **Role-Based Access** - Admin, Organizer, Judge, Participant roles

### Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Start MongoDB
sudo service mongod start

# Run development server
npm run dev
```

Server will start at `http://localhost:3000`

See [BACKEND_README.md](BACKEND_README.md) for complete setup instructions.

---

## 🎯 Challenge Template Overview

**Problem:** Implement a task scheduler that can determine a valid execution order for tasks with dependencies, or detect circular dependencies (topological sort problem).

**Time Limit:** 90 minutes

**Target Level:** Mid-level (with variations for Junior/Senior)

**Languages Supported:** TypeScript, Python, C#, Java, Go

## 📂 Repository Structure

```
codechallanging/
├── README.md                          # This file - overview
├── CODING_CHALLENGE.md                # Main challenge document
├── SUBMISSION_GUIDELINES.md           # How to submit
├── test_cases.json                    # Test cases with expected outputs
│
├── templates/                         # Starter templates by language
│   ├── typescript/
│   │   ├── TaskScheduler.ts          # Implementation template
│   │   ├── TaskScheduler.test.ts     # Test template
│   │   ├── package.json               # Dependencies
│   │   └── README.md                  # Documentation template
│   │
│   ├── python/
│   │   ├── task_scheduler.py         # Implementation template
│   │   ├── test_task_scheduler.py    # Test template
│   │   ├── requirements.txt           # Dependencies
│   │   └── README.md                  # Documentation template
│   │
│   └── csharp/
│       ├── TaskScheduler.cs          # Implementation template
│       ├── TaskSchedulerTests.cs     # Test template
│       ├── TaskScheduler.csproj      # Project file
│       └── README.md                  # Documentation template
```

## 🚀 For Candidates

### Getting Started

1. **Read the challenge:**
   - Start with [CODING_CHALLENGE.md](CODING_CHALLENGE.md)
   - Understand the problem statement, constraints, and evaluation criteria

2. **Choose your language:**
   - Navigate to `templates/[language]/`
   - Copy the template files to your working directory

3. **Develop your solution:**
   - Implement the algorithm
   - Write comprehensive tests
   - Document your approach

4. **Submit:**
   - Follow instructions in [SUBMISSION_GUIDELINES.md](SUBMISSION_GUIDELINES.md)

### Template Features

Each language template includes:
- ✅ Skeleton code with helpful TODO comments
- ✅ Test file structure with test case ideas
- ✅ README template for documentation
- ✅ Dependency/project configuration files
- ✅ Example usage code

### Quick Start Commands

#### TypeScript
```bash
cd templates/typescript
npm install
npm test
npm start
```

#### Python
```bash
cd templates/python
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
pytest test_task_scheduler.py -v
python task_scheduler.py
```

#### C#
```bash
cd templates/csharp
dotnet build
dotnet test
dotnet run
```

## 👨‍💼 For Recruiters/Proctors

### How to Use This Challenge

1. **Customize the challenge:**
   - Update deadlines in CODING_CHALLENGE.md (section 10)
   - Add your contact email in SUBMISSION_GUIDELINES.md
   - Adjust time limits or evaluation criteria if needed

2. **Distribute to candidates:**
   - Share the repository link or ZIP file
   - Send CODING_CHALLENGE.md as the main document
   - Provide submission instructions from SUBMISSION_GUIDELINES.md

3. **Set up submission method:**
   - Create a Git repository for submissions, OR
   - Set up an upload portal, OR
   - Use email submissions

4. **Evaluate submissions:**
   - Use test_cases.json for automated testing
   - Review code quality manually
   - Run hidden test cases (create your own)

### Evaluation Tools

**Automated Testing:**
- Load test cases from `test_cases.json`
- Run candidate's code against public test cases
- Create additional hidden test cases for comprehensive evaluation

**Manual Review:**
- Code structure and organization
- Algorithm choice and implementation
- Test coverage and quality
- Documentation clarity

### Customization Options

**Adjust Difficulty:**
- **Make Easier (Junior):**
  - Extend time to 120 minutes
  - Reduce required test cases to 5
  - Provide more hints in templates
  - Remove performance requirements

- **Make Harder (Senior):**
  - Reduce time to 60 minutes
  - Require additional features (e.g., task priorities, parallel execution)
  - Add stricter performance requirements
  - Require architecture documentation

**Add Variations:**
- Distributed task scheduling
- Real-time task addition
- Task priorities and deadlines
- Resource constraints (CPU, memory)

## 📊 Test Cases

The [test_cases.json](test_cases.json) file contains:

- **13 Public Test Cases:**
  - Simple linear chains
  - Multiple independent chains
  - Diamond dependency graphs
  - Circular dependencies
  - Edge cases (empty, single task, no dependencies)
  - Error cases (invalid references, self-dependencies)

- **3 Hidden Test Case Descriptions:**
  - Performance tests
  - Subtle edge cases
  - Complex circular dependencies

### Using Test Cases

```javascript
// Example: Load and use test cases (JavaScript/TypeScript)
const testCases = require('./test_cases.json');

testCases.test_cases.forEach(testCase => {
  const { tasks, dependencies } = testCase.input;
  const result = scheduler.findExecutionOrder(tasks, dependencies);
  // Validate against expected_output
});
```

```python
# Example: Load and use test cases (Python)
import json

with open('test_cases.json') as f:
    test_data = json.load(f)

for test_case in test_data['test_cases']:
    tasks = test_case['input']['tasks']
    dependencies = test_case['input']['dependencies']
    result = scheduler.find_execution_order(tasks, dependencies)
    # Validate against expected_output
```

## 🎓 Educational Use

This challenge is also suitable for:

- **University courses:** Algorithm design, data structures
- **Coding bootcamps:** Advanced algorithm module
- **Internal training:** Upskilling developers
- **Interview prep:** Practice for technical interviews
- **Hackathons:** As a timed challenge event

## 🔧 Technical Details

### Algorithms Expected

Candidates may use either:

1. **Kahn's Algorithm (BFS-based):**
   - Build graph and in-degree map
   - Use queue for zero-in-degree nodes
   - Process nodes level by level
   - Detect cycles if not all nodes processed

2. **DFS-based Topological Sort:**
   - Use recursion with visited tracking
   - Detect cycles with recursion stack
   - Build result in post-order

### Complexity Requirements

- **Time:** O(V + E) where V = tasks, E = dependencies
- **Space:** O(V + E) for graph storage

### Edge Cases to Handle

- Empty task list → empty result
- Single task → single-element result
- No dependencies → any order valid
- Circular dependencies → null/error
- Invalid task references → error
- Disconnected components → valid ordering exists

## 📝 License

This coding challenge template is free to use for:
- ✅ Recruitment and hiring
- ✅ Educational purposes
- ✅ Internal training
- ✅ Interview preparation

Please credit appropriately if sharing publicly.

## 🤝 Contributing

To improve this challenge template:

1. Fork the repository
2. Add improvements (more test cases, additional language templates, etc.)
3. Submit a pull request

Suggestions for improvements:
- Additional language templates (Java, Go, Rust)
- More test case variations
- Automated evaluation scripts
- Performance benchmarking tools

## 📧 Support

For questions or issues with this challenge template:
- Create an issue in the repository
- Contact: [YOUR_CONTACT_EMAIL]

## 🎉 Version History

- **v1.0.0** (2025-01-16): Initial release
  - TypeScript, Python, C# templates
  - 13 public test cases
  - Complete documentation

---

**Ready to use!** This challenge is production-ready for recruitment, education, or practice.

Good luck to all candidates! 🚀
