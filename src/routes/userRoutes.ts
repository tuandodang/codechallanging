import { Router } from 'express';
import { body } from 'express-validator';
import * as userController from '../controllers/userController';
import { authenticate, restrictTo, isOwnerOrAdmin } from '../middleware/auth';
import { requirePermission } from '../middleware/authorize';
import { asyncHandler } from '../middleware/errorHandler';
import { validate } from '../middleware/validate';
import { Permission, UserRole } from '../types';

const router = Router();

/**
 * @route   GET /api/v1/users
 * @desc    Get all users (with pagination and filtering)
 * @access  Private (Admin/Organizer)
 */
router.get(
  '/',
  authenticate,
  requirePermission(Permission.USER_READ),
  asyncHandler(userController.getAllUsers)
);

/**
 * @route   GET /api/v1/users/:id
 * @desc    Get user by ID
 * @access  Private
 */
router.get(
  '/:id',
  authenticate,
  asyncHandler(userController.getUserById)
);

/**
 * @route   PUT /api/v1/users/:id
 * @desc    Update user
 * @access  Private (Own profile or Admin)
 */
router.put(
  '/:id',
  authenticate,
  validate([
    body('email').optional().isEmail().normalizeEmail(),
    body('username').optional().isLength({ min: 3, max: 30 }),
    body('bio').optional().isLength({ max: 500 })
  ]),
  asyncHandler(userController.updateUser)
);

/**
 * @route   DELETE /api/v1/users/:id
 * @desc    Delete user
 * @access  Private (Admin only)
 */
router.delete(
  '/:id',
  authenticate,
  restrictTo(UserRole.ADMIN),
  asyncHandler(userController.deleteUser)
);

/**
 * @route   GET /api/v1/users/:id/stats
 * @desc    Get user statistics
 * @access  Public
 */
router.get(
  '/:id/stats',
  asyncHandler(userController.getUserStats)
);

/**
 * @route   POST /api/v1/users/:id/change-password
 * @desc    Change user password
 * @access  Private (Own account only)
 */
router.post(
  '/:id/change-password',
  authenticate,
  validate([
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword')
      .isLength({ min: 8 })
      .withMessage('New password must be at least 8 characters long')
  ]),
  asyncHandler(userController.changePassword)
);

export default router;
