import { Response, NextFunction } from 'express';
import { AuthRequest, Permission } from '../types';
import { hasPermission, hasAnyPermission, hasAllPermissions } from '../config/permissions';

/**
 * Authorization Middleware
 * Checks if the authenticated user has the required permission(s)
 */

/**
 * Require specific permission
 */
export const requirePermission = (permission: Permission) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
      return;
    }

    if (!hasPermission(req.user.role, permission)) {
      res.status(403).json({
        success: false,
        error: 'You do not have permission to perform this action',
        requiredPermission: permission
      });
      return;
    }

    next();
  };
};

/**
 * Require any of the specified permissions (OR logic)
 */
export const requireAnyPermission = (permissions: Permission[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
      return;
    }

    if (!hasAnyPermission(req.user.role, permissions)) {
      res.status(403).json({
        success: false,
        error: 'You do not have any of the required permissions',
        requiredPermissions: permissions
      });
      return;
    }

    next();
  };
};

/**
 * Require all of the specified permissions (AND logic)
 */
export const requireAllPermissions = (permissions: Permission[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
      return;
    }

    if (!hasAllPermissions(req.user.role, permissions)) {
      res.status(403).json({
        success: false,
        error: 'You do not have all the required permissions',
        requiredPermissions: permissions
      });
      return;
    }

    next();
  };
};
