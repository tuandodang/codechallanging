import { Response } from 'express';
import { Problem } from '../models/Problem';
import { Submission } from '../models/Submission';
import { AuthRequest, QueryParams, ProblemStatus, UserRole } from '../types';
import { ApiError } from '../middleware/errorHandler';

/**
 * Get all problems
 * GET /api/v1/problems
 */
export const getAllProblems = async (req: AuthRequest, res: Response): Promise<void> => {
  const {
    page = 1,
    limit = 10,
    sort = 'createdAt',
    order = 'desc',
    search,
    filter = {}
  } = req.query as QueryParams & { filter?: any };

  const query: any = {};

  // Only show published problems to non-organizers
  if (req.user?.role !== UserRole.ADMIN && req.user?.role !== UserRole.ORGANIZER) {
    query.status = ProblemStatus.PUBLISHED;
  }

  // Search by title or description
  if (search) {
    query.$text = { $search: search };
  }

  // Apply filters
  if (filter.difficulty) query.difficulty = filter.difficulty;
  if (filter.category) query.category = filter.category;
  if (filter.tags) query.tags = { $in: Array.isArray(filter.tags) ? filter.tags : [filter.tags] };

  const totalProblems = await Problem.countDocuments(query);
  const totalPages = Math.ceil(totalProblems / Number(limit));

  const problems = await Problem.find(query)
    .sort({ [sort as string]: order === 'asc' ? 1 : -1 })
    .limit(Number(limit))
    .skip((Number(page) - 1) * Number(limit))
    .select('-testCases -solution') // Don't send test cases and solution
    .populate('author', 'username firstName lastName avatar');

  res.json({
    success: true,
    data: problems,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total: totalProblems,
      totalPages
    }
  });
};

/**
 * Get problem by ID or slug
 * GET /api/v1/problems/:idOrSlug
 */
export const getProblemByIdOrSlug = async (req: AuthRequest, res: Response): Promise<void> => {
  const { idOrSlug } = req.params;

  let problem;

  // Try to find by ID first, then by slug
  if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
    problem = await Problem.findById(idOrSlug);
  } else {
    problem = await Problem.findOne({ slug: idOrSlug });
  }

  if (!problem) {
    throw new ApiError(404, 'Problem not found');
  }

  // Check if user can see unpublished problems
  if (
    problem.status !== ProblemStatus.PUBLISHED &&
    req.user?.role !== UserRole.ADMIN &&
    req.user?.role !== UserRole.ORGANIZER &&
    problem.author.toString() !== req.user?.userId
  ) {
    throw new ApiError(403, 'You do not have permission to view this problem');
  }

  // Populate author
  await problem.populate('author', 'username firstName lastName avatar');

  // Don't send test cases to participants
  const response: any = problem.toObject();
  if (req.user?.role !== UserRole.ADMIN && req.user?.role !== UserRole.ORGANIZER) {
    delete response.testCases;
    delete response.solution;
  }

  // Get user's submission status if authenticated
  if (req.user) {
    const userSubmission = await Submission.findOne({
      problem: problem._id,
      user: req.user.userId,
      status: 'accepted'
    }).sort({ submittedAt: -1 });

    response.userSolved = !!userSubmission;
  }

  res.json({
    success: true,
    data: response
  });
};

/**
 * Create problem
 * POST /api/v1/problems
 */
export const createProblem = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    throw new ApiError(401, 'Authentication required');
  }

  const problemData = {
    ...req.body,
    author: req.user.userId
  };

  const problem = await Problem.create(problemData);

  res.status(201).json({
    success: true,
    message: 'Problem created successfully',
    data: problem
  });
};

/**
 * Update problem
 * PUT /api/v1/problems/:id
 */
export const updateProblem = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  const problem = await Problem.findById(id);

  if (!problem) {
    throw new ApiError(404, 'Problem not found');
  }

  // Check if user is author or admin
  if (
    problem.author.toString() !== req.user?.userId &&
    req.user?.role !== UserRole.ADMIN
  ) {
    throw new ApiError(403, 'You can only update your own problems');
  }

  const updatedProblem = await Problem.findByIdAndUpdate(
    id,
    { $set: req.body },
    { new: true, runValidators: true }
  ).populate('author', 'username firstName lastName');

  res.json({
    success: true,
    message: 'Problem updated successfully',
    data: updatedProblem
  });
};

/**
 * Delete problem
 * DELETE /api/v1/problems/:id
 */
export const deleteProblem = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  const problem = await Problem.findById(id);

  if (!problem) {
    throw new ApiError(404, 'Problem not found');
  }

  // Check if user is author or admin
  if (
    problem.author.toString() !== req.user?.userId &&
    req.user?.role !== UserRole.ADMIN
  ) {
    throw new ApiError(403, 'You can only delete your own problems');
  }

  await Problem.findByIdAndDelete(id);

  res.json({
    success: true,
    message: 'Problem deleted successfully'
  });
};

/**
 * Submit solution to problem
 * POST /api/v1/problems/:id/submit
 */
export const submitSolution = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const { code, language } = req.body;

  if (!req.user) {
    throw new ApiError(401, 'Authentication required');
  }

  const problem = await Problem.findById(id);

  if (!problem) {
    throw new ApiError(404, 'Problem not found');
  }

  if (problem.status !== ProblemStatus.PUBLISHED) {
    throw new ApiError(400, 'Problem is not published yet');
  }

  // Check if language is supported
  if (!problem.languages.includes(language)) {
    throw new ApiError(400, `Language ${language} is not supported for this problem`);
  }

  // Create submission
  const submission = await Submission.create({
    problem: problem._id,
    user: req.user.userId,
    code,
    language,
    status: 'pending',
    totalTestCases: problem.testCases.length
  });

  // TODO: Send to code execution service
  // For now, we'll just simulate a result
  // In production, you'd integrate with a code execution service like Judge0, Piston, etc.

  // Simulate processing (you should implement actual code execution)
  setTimeout(async () => {
    // This is a placeholder - implement actual code execution
    const passedTests = Math.floor(Math.random() * problem.testCases.length);
    submission.passedTestCases = passedTests;
    submission.status = passedTests === problem.testCases.length ? 'accepted' : 'wrong_answer';
    await submission.save();

    // Update problem statistics
    problem.totalSubmissions += 1;
    if (submission.status === 'accepted') {
      problem.successfulSubmissions += 1;
    }
    problem.calculateSuccessRate();
    await problem.save();
  }, 1000);

  res.status(201).json({
    success: true,
    message: 'Solution submitted successfully',
    data: {
      submissionId: submission._id,
      status: submission.status
    }
  });
};

/**
 * Get problem submissions
 * GET /api/v1/problems/:id/submissions
 */
export const getProblemSubmissions = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const { page = 1, limit = 10 } = req.query as QueryParams;

  const query: any = { problem: id };

  // Users can only see their own submissions unless they're admin/judge
  if (
    req.user?.role !== UserRole.ADMIN &&
    req.user?.role !== UserRole.JUDGE &&
    req.user?.role !== UserRole.ORGANIZER
  ) {
    query.user = req.user?.userId;
  }

  const totalSubmissions = await Submission.countDocuments(query);
  const totalPages = Math.ceil(totalSubmissions / Number(limit));

  const submissions = await Submission.find(query)
    .sort({ submittedAt: -1 })
    .limit(Number(limit))
    .skip((Number(page) - 1) * Number(limit))
    .populate('user', 'username firstName lastName avatar')
    .select('-code'); // Don't send code in list

  res.json({
    success: true,
    data: submissions,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total: totalSubmissions,
      totalPages
    }
  });
};

/**
 * Get problems by category
 * GET /api/v1/problems/category/:category
 */
export const getProblemsByCategory = async (req: AuthRequest, res: Response): Promise<void> => {
  const { category } = req.params;

  const problems = await Problem.find({
    category,
    status: ProblemStatus.PUBLISHED
  })
    .sort({ difficulty: 1, title: 1 })
    .select('-testCases -solution')
    .populate('author', 'username firstName lastName');

  res.json({
    success: true,
    data: problems
  });
};

/**
 * Get problem statistics
 * GET /api/v1/problems/:id/stats
 */
export const getProblemStats = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  const problem = await Problem.findById(id).select('title totalSubmissions successfulSubmissions successRate');

  if (!problem) {
    throw new ApiError(404, 'Problem not found');
  }

  // Get submission distribution by status
  const submissionStats = await Submission.aggregate([
    { $match: { problem: problem._id as any } },
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ]);

  res.json({
    success: true,
    data: {
      problem: {
        id: problem._id,
        title: problem.title
      },
      totalSubmissions: problem.totalSubmissions,
      successfulSubmissions: problem.successfulSubmissions,
      successRate: problem.successRate,
      submissionsByStatus: submissionStats
    }
  });
};
