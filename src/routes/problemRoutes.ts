import { Router } from 'express';
import { body } from 'express-validator';
import * as problemController from '../controllers/problemController';
import { authenticate, optionalAuth, restrictTo } from '../middleware/auth';
import { requirePermission } from '../middleware/authorize';
import { asyncHandler } from '../middleware/errorHandler';
import { validate } from '../middleware/validate';
import { Permission, UserRole } from '../types';

const router = Router();

/**
 * @route   GET /api/v1/problems
 * @desc    Get all problems (with pagination and filtering)
 * @access  Public (published only) / Private (all for organizers)
 */
router.get(
  '/',
  optionalAuth,
  asyncHandler(problemController.getAllProblems)
);

/**
 * @route   GET /api/v1/problems/category/:category
 * @desc    Get problems by category
 * @access  Public
 */
router.get(
  '/category/:category',
  optionalAuth,
  asyncHandler(problemController.getProblemsByCategory)
);

/**
 * @route   GET /api/v1/problems/:idOrSlug
 * @desc    Get problem by ID or slug
 * @access  Public (for published) / Private (for drafts)
 */
router.get(
  '/:idOrSlug',
  optionalAuth,
  asyncHandler(problemController.getProblemByIdOrSlug)
);

/**
 * @route   POST /api/v1/problems
 * @desc    Create problem
 * @access  Private (Organizer/Admin)
 */
router.post(
  '/',
  authenticate,
  requirePermission(Permission.PROBLEM_CREATE),
  validate([
    body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 200 }),
    body('description').notEmpty().withMessage('Description is required'),
    body('difficulty').isIn(['easy', 'medium', 'hard', 'expert']),
    body('category').notEmpty().withMessage('Category is required'),
    body('timeLimit').isInt({ min: 1 }).withMessage('Time limit must be at least 1 minute'),
    body('examples').isArray({ min: 1 }).withMessage('At least one example is required'),
    body('testCases').isArray({ min: 1 }).withMessage('At least one test case is required')
  ]),
  asyncHandler(problemController.createProblem)
);

/**
 * @route   PUT /api/v1/problems/:id
 * @desc    Update problem
 * @access  Private (Author/Admin)
 */
router.put(
  '/:id',
  authenticate,
  requirePermission(Permission.PROBLEM_UPDATE),
  asyncHandler(problemController.updateProblem)
);

/**
 * @route   DELETE /api/v1/problems/:id
 * @desc    Delete problem
 * @access  Private (Author/Admin)
 */
router.delete(
  '/:id',
  authenticate,
  requirePermission(Permission.PROBLEM_DELETE),
  asyncHandler(problemController.deleteProblem)
);

/**
 * @route   POST /api/v1/problems/:id/submit
 * @desc    Submit solution to problem
 * @access  Private
 */
router.post(
  '/:id/submit',
  authenticate,
  validate([
    body('code').notEmpty().withMessage('Code is required'),
    body('language').notEmpty().withMessage('Language is required')
  ]),
  asyncHandler(problemController.submitSolution)
);

/**
 * @route   GET /api/v1/problems/:id/submissions
 * @desc    Get problem submissions
 * @access  Private (own submissions) / Admin/Judge (all submissions)
 */
router.get(
  '/:id/submissions',
  authenticate,
  asyncHandler(problemController.getProblemSubmissions)
);

/**
 * @route   GET /api/v1/problems/:id/stats
 * @desc    Get problem statistics
 * @access  Public
 */
router.get(
  '/:id/stats',
  asyncHandler(problemController.getProblemStats)
);

export default router;
