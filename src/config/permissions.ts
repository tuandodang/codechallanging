import { Permission, UserRole, IRolePermissions } from '../types';

/**
 * Role-Based Access Control (RBAC) Configuration
 * Defines what permissions each role has in the system
 */
export const rolePermissions: IRolePermissions = {
  [UserRole.ADMIN]: [
    // Full access to everything
    Permission.USER_READ,
    Permission.USER_CREATE,
    Permission.USER_UPDATE,
    Permission.USER_DELETE,

    Permission.EVENT_READ,
    Permission.EVENT_CREATE,
    Permission.EVENT_UPDATE,
    Permission.EVENT_DELETE,
    Permission.EVENT_MANAGE_PARTICIPANTS,

    Permission.PROBLEM_READ,
    Permission.PROBLEM_CREATE,
    Permission.PROBLEM_UPDATE,
    Permission.PROBLEM_DELETE,

    Permission.SUBMISSION_READ,
    Permission.SUBMISSION_CREATE,
    Permission.SUBMISSION_READ_ALL,

    Permission.ADMIN_PANEL,
    Permission.MANAGE_ROLES
  ],

  [UserRole.ORGANIZER]: [
    // Can manage events and problems
    Permission.USER_READ,

    Permission.EVENT_READ,
    Permission.EVENT_CREATE,
    Permission.EVENT_UPDATE,
    Permission.EVENT_DELETE,
    Permission.EVENT_MANAGE_PARTICIPANTS,

    Permission.PROBLEM_READ,
    Permission.PROBLEM_CREATE,
    Permission.PROBLEM_UPDATE,
    Permission.PROBLEM_DELETE,

    Permission.SUBMISSION_READ,
    Permission.SUBMISSION_CREATE,
    Permission.SUBMISSION_READ_ALL
  ],

  [UserRole.JUDGE]: [
    // Can view and evaluate submissions
    Permission.USER_READ,

    Permission.EVENT_READ,

    Permission.PROBLEM_READ,

    Permission.SUBMISSION_READ,
    Permission.SUBMISSION_READ_ALL
  ],

  [UserRole.PARTICIPANT]: [
    // Basic participant permissions
    Permission.USER_READ,

    Permission.EVENT_READ,

    Permission.PROBLEM_READ,

    Permission.SUBMISSION_READ,
    Permission.SUBMISSION_CREATE
  ]
};

/**
 * Check if a role has a specific permission
 */
export const hasPermission = (role: UserRole, permission: Permission): boolean => {
  return rolePermissions[role]?.includes(permission) || false;
};

/**
 * Check if a role has any of the specified permissions
 */
export const hasAnyPermission = (role: UserRole, permissions: Permission[]): boolean => {
  return permissions.some((permission) => hasPermission(role, permission));
};

/**
 * Check if a role has all of the specified permissions
 */
export const hasAllPermissions = (role: UserRole, permissions: Permission[]): boolean => {
  return permissions.every((permission) => hasPermission(role, permission));
};

/**
 * Get all permissions for a role
 */
export const getRolePermissions = (role: UserRole): Permission[] => {
  return rolePermissions[role] || [];
};
