import { Router } from 'express';
import { body } from 'express-validator';
import * as authController from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import { validate } from '../middleware/validate';

const router = Router();

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post(
  '/register',
  validate([
    body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    body('username')
      .isLength({ min: 3, max: 30 })
      .withMessage('Username must be between 3 and 30 characters')
      .matches(/^[a-zA-Z0-9_-]+$/)
      .withMessage('Username can only contain letters, numbers, hyphens and underscores'),
    body('firstName').trim().notEmpty().withMessage('First name is required'),
    body('lastName').trim().notEmpty().withMessage('Last name is required')
  ]),
  asyncHandler(authController.register)
);

/**
 * @route   POST /api/v1/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post(
  '/login',
  validate([
    body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required')
  ]),
  asyncHandler(authController.login)
);

/**
 * @route   POST /api/v1/auth/refresh
 * @desc    Refresh access token
 * @access  Public
 */
router.post(
  '/refresh',
  validate([
    body('refreshToken').notEmpty().withMessage('Refresh token is required')
  ]),
  asyncHandler(authController.refreshToken)
);

/**
 * @route   GET /api/v1/auth/verify-email/:token
 * @desc    Verify email address
 * @access  Public
 */
router.get(
  '/verify-email/:token',
  asyncHandler(authController.verifyEmail)
);

/**
 * @route   POST /api/v1/auth/forgot-password
 * @desc    Request password reset
 * @access  Public
 */
router.post(
  '/forgot-password',
  validate([
    body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email')
  ]),
  asyncHandler(authController.forgotPassword)
);

/**
 * @route   POST /api/v1/auth/reset-password/:token
 * @desc    Reset password
 * @access  Public
 */
router.post(
  '/reset-password/:token',
  validate([
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long')
  ]),
  asyncHandler(authController.resetPassword)
);

/**
 * @route   GET /api/v1/auth/me
 * @desc    Get current user
 * @access  Private
 */
router.get(
  '/me',
  authenticate,
  asyncHandler(authController.getCurrentUser)
);

/**
 * @route   POST /api/v1/auth/logout
 * @desc    Logout user
 * @access  Private
 */
router.post(
  '/logout',
  authenticate,
  asyncHandler(authController.logout)
);

export default router;
