import { Response } from 'express';
import { User } from '../models/User';
import { AuthRequest, IAuthTokens, UserStatus } from '../types';
import { generateAccessToken, generateRefreshToken, verifyToken } from '../middleware/auth';
import { ApiError } from '../middleware/errorHandler';
import crypto from 'crypto';

/**
 * Register a new user
 * POST /api/v1/auth/register
 */
export const register = async (req: AuthRequest, res: Response): Promise<void> => {
  const { email, password, username, firstName, lastName } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({
    $or: [{ email }, { username }]
  });

  if (existingUser) {
    throw new ApiError(400, 'User with this email or username already exists');
  }

  // Create email verification token
  const emailVerificationToken = crypto.randomBytes(32).toString('hex');

  // Create user
  const user = await User.create({
    email,
    password,
    username,
    firstName,
    lastName,
    emailVerificationToken,
    status: UserStatus.PENDING_VERIFICATION
  });

  // TODO: Send verification email
  // await sendVerificationEmail(user.email, emailVerificationToken);

  res.status(201).json({
    success: true,
    message: 'User registered successfully. Please check your email to verify your account.',
    data: {
      userId: user._id,
      email: user.email,
      username: user.username
    }
  });
};

/**
 * Login user
 * POST /api/v1/auth/login
 */
export const login = async (req: AuthRequest, res: Response): Promise<void> => {
  const { email, password } = req.body;

  // Find user and include password field
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  // Check password
  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new ApiError(401, 'Invalid email or password');
  }

  // Check if user is active
  if (user.status === UserStatus.SUSPENDED) {
    throw new ApiError(403, 'Your account has been suspended');
  }

  if (user.status === UserStatus.PENDING_VERIFICATION) {
    throw new ApiError(403, 'Please verify your email before logging in');
  }

  // Generate tokens
  const tokenPayload = {
    userId: user._id.toString(),
    email: user.email,
    role: user.role
  };

  const accessToken = generateAccessToken(tokenPayload);
  const refreshToken = generateRefreshToken(tokenPayload);

  // Update last login
  user.lastLogin = new Date();
  await user.save();

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        avatar: user.avatar
      },
      tokens: {
        accessToken,
        refreshToken
      }
    }
  });
};

/**
 * Refresh access token
 * POST /api/v1/auth/refresh
 */
export const refreshToken = async (req: AuthRequest, res: Response): Promise<void> => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw new ApiError(400, 'Refresh token is required');
  }

  // Verify refresh token
  const decoded = verifyToken(refreshToken, true);

  // Check if user still exists
  const user = await User.findById(decoded.userId);

  if (!user) {
    throw new ApiError(401, 'Invalid refresh token');
  }

  // Generate new tokens
  const tokenPayload = {
    userId: user._id.toString(),
    email: user.email,
    role: user.role
  };

  const newAccessToken = generateAccessToken(tokenPayload);
  const newRefreshToken = generateRefreshToken(tokenPayload);

  res.json({
    success: true,
    data: {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    }
  });
};

/**
 * Verify email
 * GET /api/v1/auth/verify-email/:token
 */
export const verifyEmail = async (req: AuthRequest, res: Response): Promise<void> => {
  const { token } = req.params;

  const user = await User.findOne({
    emailVerificationToken: token
  });

  if (!user) {
    throw new ApiError(400, 'Invalid or expired verification token');
  }

  // Update user
  user.emailVerified = true;
  user.emailVerificationToken = undefined;
  user.status = UserStatus.ACTIVE;
  await user.save();

  res.json({
    success: true,
    message: 'Email verified successfully'
  });
};

/**
 * Request password reset
 * POST /api/v1/auth/forgot-password
 */
export const forgotPassword = async (req: AuthRequest, res: Response): Promise<void> => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    // Don't reveal that user doesn't exist
    res.json({
      success: true,
      message: 'If an account with that email exists, a password reset link has been sent'
    });
    return;
  }

  // Generate reset token
  const resetToken = user.generatePasswordResetToken();
  await user.save();

  // TODO: Send password reset email
  // await sendPasswordResetEmail(user.email, resetToken);

  res.json({
    success: true,
    message: 'Password reset link sent to your email'
  });
};

/**
 * Reset password
 * POST /api/v1/auth/reset-password/:token
 */
export const resetPassword = async (req: AuthRequest, res: Response): Promise<void> => {
  const { token } = req.params;
  const { password } = req.body;

  // Hash token
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });

  if (!user) {
    throw new ApiError(400, 'Invalid or expired reset token');
  }

  // Update password
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  res.json({
    success: true,
    message: 'Password reset successful'
  });
};

/**
 * Get current user
 * GET /api/v1/auth/me
 */
export const getCurrentUser = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    throw new ApiError(401, 'Not authenticated');
  }

  const user = await User.findById(req.user.userId);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  res.json({
    success: true,
    data: user
  });
};

/**
 * Logout (client-side token removal)
 * POST /api/v1/auth/logout
 */
export const logout = async (req: AuthRequest, res: Response): Promise<void> => {
  // With JWT, logout is handled client-side by removing tokens
  // This endpoint can be used for logging or token blacklisting if implemented

  res.json({
    success: true,
    message: 'Logged out successfully'
  });
};
