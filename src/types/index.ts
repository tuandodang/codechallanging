import { Request } from 'express';

// ============================================================================
// USER TYPES
// ============================================================================

export enum UserRole {
  ADMIN = 'admin',
  ORGANIZER = 'organizer',
  PARTICIPANT = 'participant',
  JUDGE = 'judge'
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING_VERIFICATION = 'pending_verification'
}

export interface IUser {
  _id: string;
  email: string;
  password: string;
  username: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: UserStatus;
  avatar?: string;
  bio?: string;
  skills?: string[];
  githubUrl?: string;
  linkedinUrl?: string;
  websiteUrl?: string;
  emailVerified: boolean;
  emailVerificationToken?: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserProfile {
  user: string;
  totalEvents: number;
  totalProblems: number;
  totalSubmissions: number;
  solvedProblems: string[];
  achievements: IAchievement[];
  rating: number;
  rank?: number;
}

export interface IAchievement {
  title: string;
  description: string;
  icon: string;
  earnedAt: Date;
}

// ============================================================================
// AUTHENTICATION TYPES
// ============================================================================

export interface IAuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface IJWTPayload {
  userId: string;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

export interface AuthRequest extends Request {
  user?: IJWTPayload;
}

// ============================================================================
// EVENT TYPES
// ============================================================================

export enum EventType {
  HACKATHON = 'hackathon',
  CODING_CHALLENGE = 'coding_challenge',
  CONTEST = 'contest',
  WORKSHOP = 'workshop',
  TRAINING = 'training'
}

export enum EventStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ONGOING = 'ongoing',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum EventVisibility {
  PUBLIC = 'public',
  PRIVATE = 'private',
  INVITE_ONLY = 'invite_only'
}

export interface IEvent {
  _id: string;
  title: string;
  description: string;
  type: EventType;
  status: EventStatus;
  visibility: EventVisibility;
  organizer: string; // User ID
  startDate: Date;
  endDate: Date;
  registrationStartDate: Date;
  registrationEndDate: Date;
  maxParticipants?: number;
  currentParticipants: number;
  problems: string[]; // Problem IDs
  participants: IEventParticipant[];
  judges?: string[]; // User IDs
  rules?: string;
  prizes?: IPrize[];
  tags: string[];
  banner?: string;
  website?: string;
  isTeamBased: boolean;
  minTeamSize?: number;
  maxTeamSize?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IEventParticipant {
  user: string;
  registeredAt: Date;
  status: 'registered' | 'confirmed' | 'cancelled';
  team?: string;
}

export interface IPrize {
  position: number;
  title: string;
  description?: string;
  amount?: number;
  currency?: string;
}

// ============================================================================
// PROBLEM TYPES
// ============================================================================

export enum ProblemDifficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
  EXPERT = 'expert'
}

export enum ProblemStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived'
}

export interface IProblem {
  _id: string;
  title: string;
  slug: string;
  description: string;
  difficulty: ProblemDifficulty;
  status: ProblemStatus;
  author: string; // User ID
  category: string;
  tags: string[];
  timeLimit: number; // in minutes
  memoryLimit?: number; // in MB
  inputFormat?: string;
  outputFormat?: string;
  constraints?: string;
  examples: IExample[];
  testCases: ITestCase[];
  hints?: string[];
  solution?: string;
  languages: string[]; // ['javascript', 'python', 'java', 'csharp']
  starterCode?: IStarterCode[];
  totalSubmissions: number;
  successfulSubmissions: number;
  successRate: number;
  averageTime?: number;
  likes: number;
  dislikes: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IExample {
  input: string;
  output: string;
  explanation?: string;
}

export interface ITestCase {
  input: string;
  expectedOutput: string;
  isHidden: boolean;
  weight?: number; // for weighted scoring
}

export interface IStarterCode {
  language: string;
  code: string;
}

// ============================================================================
// SUBMISSION TYPES
// ============================================================================

export enum SubmissionStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  ACCEPTED = 'accepted',
  WRONG_ANSWER = 'wrong_answer',
  TIME_LIMIT_EXCEEDED = 'time_limit_exceeded',
  MEMORY_LIMIT_EXCEEDED = 'memory_limit_exceeded',
  RUNTIME_ERROR = 'runtime_error',
  COMPILATION_ERROR = 'compilation_error'
}

export interface ISubmission {
  _id: string;
  problem: string; // Problem ID
  user: string; // User ID
  event?: string; // Event ID (if part of an event)
  code: string;
  language: string;
  status: SubmissionStatus;
  executionTime?: number;
  memoryUsed?: number;
  passedTestCases: number;
  totalTestCases: number;
  score?: number;
  errorMessage?: string;
  output?: string;
  submittedAt: Date;
}

// ============================================================================
// TEAM TYPES
// ============================================================================

export interface ITeam {
  _id: string;
  name: string;
  event: string; // Event ID
  members: ITeamMember[];
  leader: string; // User ID
  inviteCode: string;
  maxMembers: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITeamMember {
  user: string;
  joinedAt: Date;
  role: 'leader' | 'member';
  status: 'active' | 'removed';
}

// ============================================================================
// NOTIFICATION TYPES
// ============================================================================

export enum NotificationType {
  EVENT_INVITATION = 'event_invitation',
  EVENT_REMINDER = 'event_reminder',
  SUBMISSION_RESULT = 'submission_result',
  TEAM_INVITATION = 'team_invitation',
  ANNOUNCEMENT = 'announcement',
  ACHIEVEMENT = 'achievement'
}

export interface INotification {
  _id: string;
  recipient: string; // User ID
  type: NotificationType;
  title: string;
  message: string;
  data?: any;
  isRead: boolean;
  createdAt: Date;
}

// ============================================================================
// PERMISSION TYPES
// ============================================================================

export enum Permission {
  // User permissions
  USER_READ = 'user:read',
  USER_CREATE = 'user:create',
  USER_UPDATE = 'user:update',
  USER_DELETE = 'user:delete',

  // Event permissions
  EVENT_READ = 'event:read',
  EVENT_CREATE = 'event:create',
  EVENT_UPDATE = 'event:update',
  EVENT_DELETE = 'event:delete',
  EVENT_MANAGE_PARTICIPANTS = 'event:manage_participants',

  // Problem permissions
  PROBLEM_READ = 'problem:read',
  PROBLEM_CREATE = 'problem:create',
  PROBLEM_UPDATE = 'problem:update',
  PROBLEM_DELETE = 'problem:delete',

  // Submission permissions
  SUBMISSION_READ = 'submission:read',
  SUBMISSION_CREATE = 'submission:create',
  SUBMISSION_READ_ALL = 'submission:read_all',

  // Admin permissions
  ADMIN_PANEL = 'admin:panel',
  MANAGE_ROLES = 'admin:manage_roles'
}

export interface IRolePermissions {
  [UserRole.ADMIN]: Permission[];
  [UserRole.ORGANIZER]: Permission[];
  [UserRole.JUDGE]: Permission[];
  [UserRole.PARTICIPANT]: Permission[];
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  errors?: any[];
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ============================================================================
// QUERY TYPES
// ============================================================================

export interface QueryParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  search?: string;
  filter?: Record<string, any>;
}
