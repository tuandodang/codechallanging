import { Response } from 'express';
import { User } from '../models/User';
import { AuthRequest, QueryParams, UserRole } from '../types';
import { ApiError } from '../middleware/errorHandler';

/**
 * Get all users (Admin/Organizer only)
 * GET /api/v1/users
 */
export const getAllUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  const { page = 1, limit = 10, sort = 'createdAt', order = 'desc', search } = req.query as QueryParams;

  const query: any = {};

  // Search by username, email, or name
  if (search) {
    query.$or = [
      { username: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { firstName: { $regex: search, $options: 'i' } },
      { lastName: { $regex: search, $options: 'i' } }
    ];
  }

  const totalUsers = await User.countDocuments(query);
  const totalPages = Math.ceil(totalUsers / Number(limit));

  const users = await User.find(query)
    .sort({ [sort as string]: order === 'asc' ? 1 : -1 })
    .limit(Number(limit))
    .skip((Number(page) - 1) * Number(limit))
    .select('-password');

  res.json({
    success: true,
    data: users,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total: totalUsers,
      totalPages
    }
  });
};

/**
 * Get user by ID
 * GET /api/v1/users/:id
 */
export const getUserById = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  const user = await User.findById(id).select('-password');

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  res.json({
    success: true,
    data: user
  });
};

/**
 * Update user
 * PUT /api/v1/users/:id
 */
export const updateUser = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  // Users can only update their own profile unless they're admin
  if (req.user?.userId !== id && req.user?.role !== UserRole.ADMIN) {
    throw new ApiError(403, 'You can only update your own profile');
  }

  const allowedUpdates = ['firstName', 'lastName', 'bio', 'skills', 'githubUrl', 'linkedinUrl', 'websiteUrl', 'avatar'];
  const updates: any = {};

  for (const key of allowedUpdates) {
    if (req.body[key] !== undefined) {
      updates[key] = req.body[key];
    }
  }

  // Only admins can update role and status
  if (req.user?.role === UserRole.ADMIN) {
    if (req.body.role) updates.role = req.body.role;
    if (req.body.status) updates.status = req.body.status;
  }

  const user = await User.findByIdAndUpdate(
    id,
    { $set: updates },
    { new: true, runValidators: true }
  ).select('-password');

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  res.json({
    success: true,
    message: 'User updated successfully',
    data: user
  });
};

/**
 * Delete user
 * DELETE /api/v1/users/:id
 */
export const deleteUser = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  const user = await User.findByIdAndDelete(id);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  res.json({
    success: true,
    message: 'User deleted successfully'
  });
};

/**
 * Get user statistics
 * GET /api/v1/users/:id/stats
 */
export const getUserStats = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  const user = await User.findById(id);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  // Import models as needed
  const { Event } = require('../models/Event');
  const { Submission } = require('../models/Submission');
  const { Problem } = require('../models/Problem');

  const [eventsParticipated, totalSubmissions, problemsCreated, acceptedSubmissions] = await Promise.all([
    Event.countDocuments({ 'participants.user': id }),
    Submission.countDocuments({ user: id }),
    Problem.countDocuments({ author: id }),
    Submission.countDocuments({ user: id, status: 'accepted' })
  ]);

  res.json({
    success: true,
    data: {
      user: {
        id: user._id,
        username: user.username,
        fullName: user.fullName,
        avatar: user.avatar
      },
      stats: {
        eventsParticipated,
        totalSubmissions,
        acceptedSubmissions,
        problemsCreated,
        successRate: totalSubmissions > 0
          ? Math.round((acceptedSubmissions / totalSubmissions) * 100)
          : 0
      }
    }
  });
};

/**
 * Change password
 * POST /api/v1/users/:id/change-password
 */
export const changePassword = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const { currentPassword, newPassword } = req.body;

  // Users can only change their own password
  if (req.user?.userId !== id) {
    throw new ApiError(403, 'You can only change your own password');
  }

  const user = await User.findById(id).select('+password');

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  // Verify current password
  const isPasswordCorrect = await user.comparePassword(currentPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(401, 'Current password is incorrect');
  }

  // Update password
  user.password = newPassword;
  await user.save();

  res.json({
    success: true,
    message: 'Password changed successfully'
  });
};
