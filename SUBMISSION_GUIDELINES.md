# Submission Guidelines - Task Scheduler Challenge

## Important Deadlines

- **Challenge Start:** [TO BE FILLED]
- **Challenge End:** [TO BE FILLED]
- **Submission Deadline:** [TO BE FILLED]
- **Late submissions:** Not accepted

## Before You Submit

### Pre-Submission Checklist

Complete this checklist before submitting your solution:

- [ ] **Code compiles/runs without errors**
  - Run your solution at least once to verify it works
  - Fix all compilation errors

- [ ] **All tests pass**
  - Run the complete test suite
  - Ensure no failing tests
  - Minimum 8 test cases required

- [ ] **README.md is complete**
  - Algorithm approach explained
  - Complexity analysis provided
  - Build/run instructions included
  - Test execution instructions included
  - Assumptions documented

- [ ] **Code quality check**
  - Meaningful variable/function names
  - No commented-out code blocks
  - Consistent formatting
  - No debug print statements (unless intentional)

- [ ] **File structure is correct**
  - All files in proper directories
  - No unnecessary files (.DS_Store, node_modules/, bin/, obj/, __pycache__, etc.)

- [ ] **Dependencies documented**
  - package.json / requirements.txt / *.csproj is present
  - All dependencies listed

- [ ] **AI usage disclosed** (if applicable)
  - Mentioned in README if you used AI tools

## Submission Methods

### Method 1: Git Repository (Recommended)

If a Git repository was provided:

1. **Clone the repository**
   ```bash
   git clone [PROVIDED_REPOSITORY_URL]
   cd task-scheduler-challenge
   ```

2. **Create your solution branch**
   ```bash
   git checkout -b solution/[your-name]
   # Example: git checkout -b solution/john-doe
   ```

3. **Develop your solution**
   - Write code
   - Write tests
   - Document in README

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "Complete task scheduler implementation"
   ```

5. **Push to remote**
   ```bash
   git push origin solution/[your-name]
   ```

6. **Verify submission**
   - Check that your branch appears on the remote repository
   - Ensure all files are pushed

### Method 2: ZIP File Upload

If submitting via upload portal:

1. **Prepare your directory**
   ```
   task-scheduler-[YourName]-[Timestamp]/
   ├── README.md
   ├── src/
   ├── tests/
   └── (language-specific files)
   ```

2. **Clean build artifacts** (IMPORTANT)
   - **Node.js:** Delete `node_modules/`, `dist/`, `build/`
   - **Python:** Delete `__pycache__/`, `.pytest_cache/`, `*.pyc`
   - **C#:** Delete `bin/`, `obj/`

3. **Create ZIP archive**
   ```bash
   # From parent directory
   zip -r taskscheduler_JohnDoe_20250116.zip task-scheduler-JohnDoe/

   # Or use your OS's GUI compression tool
   ```

4. **Upload to portal**
   - Go to [PORTAL_URL]
   - Upload the ZIP file
   - Wait for confirmation

### Method 3: Email Submission

If submitting via email:

1. **Prepare ZIP file** (same as Method 2)

2. **Send email to:** [PROCTOR_EMAIL]
   - **Subject:** Task Scheduler Submission - [Your Name]
   - **Body:**
     ```
     Name: [Your Full Name]
     Language Used: [Python/TypeScript/C#/Java/Go]
     Completion Time: [Actual time taken, e.g., 75 minutes]

     Attached is my solution for the Task Scheduler challenge.

     AI Tools Used: [Yes/No - specify if yes]
     ```
   - **Attachment:** ZIP file

## File Naming Conventions

### Git Branch
```
solution/[firstname-lastname]
Example: solution/john-doe
```

### ZIP File
```
taskscheduler_[FirstnameLastname]_[YYYYMMDD].zip
Example: taskscheduler_JohnDoe_20250116.zip
```

## What NOT to Include

**DO NOT** submit:

- ❌ Build artifacts (`node_modules/`, `bin/`, `obj/`, `__pycache__/`, `dist/`)
- ❌ IDE-specific files (`.idea/`, `.vscode/`, `*.suo`, `*.user`)
- ❌ OS-specific files (`.DS_Store`, `Thumbs.db`)
- ❌ Compiled binaries (`.exe`, `.dll`, `.so`)
- ❌ Large data files or logs
- ❌ Git metadata (if submitting ZIP - exclude `.git/` folder)

**Add a `.gitignore` file to exclude these automatically:**

```gitignore
# Node
node_modules/
dist/
build/
*.log

# Python
__pycache__/
*.py[cod]
.pytest_cache/
.coverage
htmlcov/

# C#
bin/
obj/
*.user
*.suo

# IDE
.vscode/
.idea/
*.swp

# OS
.DS_Store
Thumbs.db
```

## Verification Steps

After submission, verify:

### For Git Submission
1. Go to the repository URL in a browser
2. Navigate to your branch: `solution/[your-name]`
3. Check that all files are visible
4. Try cloning and running your solution from the remote

### For ZIP/Email Submission
1. Extract your ZIP to a different location
2. Follow your README instructions to build and test
3. Ensure everything works from the extracted ZIP

## Common Issues and Solutions

### Issue: "Tests fail on evaluator's machine but pass locally"

**Solutions:**
- Hardcoded file paths - use relative paths
- Missing dependencies - update package.json/requirements.txt
- Platform-specific code - test on different OS if possible
- Environment variables - document any required env vars

### Issue: "ZIP file too large"

**Solutions:**
- Delete `node_modules/` and include `package.json` instead
- Delete `bin/`, `obj/` folders
- Don't include build artifacts

### Issue: "Code doesn't compile/run for evaluator"

**Solutions:**
- Test with clean install: delete dependencies and reinstall
- Specify exact versions in dependency files
- Include build/run instructions in README
- Test instructions by following them exactly

### Issue: "Forgot to document AI usage"

**Solutions:**
- Update README immediately
- Resubmit if still before deadline
- Be honest - partial credit better than disqualification

## Evaluation Process

Your submission will be evaluated as follows:

1. **Automated Checks (Initial)**
   - File structure validation
   - Build/compilation test
   - Automated test execution
   - Basic test cases (provided examples)

2. **Manual Review**
   - Code quality assessment
   - Algorithm correctness
   - Test comprehensiveness
   - Documentation quality

3. **Hidden Test Cases**
   - Performance tests with large inputs
   - Edge cases not in public examples
   - Subtle circular dependency patterns

4. **Scoring**
   - Correctness: 40%
   - Code Quality: 25%
   - Performance: 20%
   - Testing: 15%
   - **Passing score:** 70%

## After Submission

### What Happens Next?

1. **Confirmation** (within 1 hour)
   - You'll receive a submission confirmation
   - If you don't receive this, contact the proctor immediately

2. **Initial Automated Evaluation** (within 24 hours)
   - Basic tests run automatically
   - You'll be notified of obvious issues (compilation errors, missing files)

3. **Full Evaluation** (within 3-5 days)
   - Manual code review
   - Hidden test cases
   - Final scoring

4. **Results** (within 1 week)
   - Score and feedback provided
   - Decision on next steps (if recruitment)

### Can I Resubmit?

- **Before deadline:** Yes, latest submission counts
- **After deadline:** No, unless exceptional circumstances
- **After seeing results:** No

## Questions?

### Before/During Challenge
- Technical issues: [PROCTOR_EMAIL]
- Clarification questions: [PROCTOR_EMAIL]
- Submission problems: [PROCTOR_EMAIL]

### After Submission
- Status inquiry: [PROCTOR_EMAIL]
- Results inquiry: Wait for evaluation period to complete

## Good Luck!

Remember:
- ✅ Submit before the deadline
- ✅ Test your submission package
- ✅ Follow the file structure requirements
- ✅ Document your approach clearly
- ✅ Be honest about AI usage

**Quality over quantity** - a working, well-tested solution is better than a complex but broken one!
