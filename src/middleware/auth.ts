import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest, IJWTPayload, UserRole } from '../types';
import { User } from '../models/User';

/**
 * Generate JWT Access Token
 */
export const generateAccessToken = (payload: IJWTPayload): string => {
  const secret = process.env.JWT_SECRET || 'your-secret-key';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

  return jwt.sign(payload, secret, { expiresIn });
};

/**
 * Generate JWT Refresh Token
 */
export const generateRefreshToken = (payload: IJWTPayload): string => {
  const secret = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret';
  const expiresIn = process.env.JWT_REFRESH_EXPIRES_IN || '30d';

  return jwt.sign(payload, secret, { expiresIn });
};

/**
 * Verify JWT Token
 */
export const verifyToken = (token: string, isRefreshToken: boolean = false): IJWTPayload => {
  const secret = isRefreshToken
    ? process.env.JWT_REFRESH_SECRET || 'your-refresh-secret'
    : process.env.JWT_SECRET || 'your-secret-key';

  return jwt.verify(token, secret) as IJWTPayload;
};

/**
 * Authentication Middleware
 * Verifies JWT token and attaches user info to request
 */
export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        error: 'No token provided. Please authenticate.'
      });
      return;
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = verifyToken(token);

    // Check if user still exists
    const user = await User.findById(decoded.userId);

    if (!user) {
      res.status(401).json({
        success: false,
        error: 'User no longer exists'
      });
      return;
    }

    // Check if user is active
    if (user.status !== 'active') {
      res.status(403).json({
        success: false,
        error: 'Your account is not active'
      });
      return;
    }

    // Attach user info to request
    req.user = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role
    };

    next();
  } catch (error: any) {
    if (error.name === 'JsonWebTokenError') {
      res.status(401).json({
        success: false,
        error: 'Invalid token'
      });
      return;
    }

    if (error.name === 'TokenExpiredError') {
      res.status(401).json({
        success: false,
        error: 'Token expired'
      });
      return;
    }

    res.status(500).json({
      success: false,
      error: 'Authentication failed'
    });
  }
};

/**
 * Optional Authentication Middleware
 * Similar to authenticate but doesn't fail if no token is provided
 */
export const optionalAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      next();
      return;
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    const user = await User.findById(decoded.userId);

    if (user && user.status === 'active') {
      req.user = {
        userId: user._id.toString(),
        email: user.email,
        role: user.role
      };
    }

    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};

/**
 * Restrict access to specific roles
 */
export const restrictTo = (...roles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'You are not authenticated'
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        error: 'You do not have permission to perform this action'
      });
      return;
    }

    next();
  };
};

/**
 * Check if user is the owner of a resource or has admin role
 */
export const isOwnerOrAdmin = (resourceUserIdField: string = 'userId') => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'You are not authenticated'
      });
      return;
    }

    const resourceUserId = (req.params as any)[resourceUserIdField];

    if (
      req.user.role === UserRole.ADMIN ||
      req.user.userId === resourceUserId
    ) {
      next();
      return;
    }

    res.status(403).json({
      success: false,
      error: 'You can only access your own resources'
    });
  };
};
