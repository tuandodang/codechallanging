import { Router } from 'express';
import { body } from 'express-validator';
import * as eventController from '../controllers/eventController';
import { authenticate, optionalAuth, restrictTo } from '../middleware/auth';
import { requirePermission } from '../middleware/authorize';
import { asyncHandler } from '../middleware/errorHandler';
import { validate } from '../middleware/validate';
import { Permission, UserRole } from '../types';

const router = Router();

/**
 * @route   GET /api/v1/events
 * @desc    Get all events (with pagination and filtering)
 * @access  Public (limited) / Private (full access)
 */
router.get(
  '/',
  optionalAuth,
  asyncHandler(eventController.getAllEvents)
);

/**
 * @route   GET /api/v1/events/:id
 * @desc    Get event by ID
 * @access  Public (for public events) / Private (for private events)
 */
router.get(
  '/:id',
  optionalAuth,
  asyncHandler(eventController.getEventById)
);

/**
 * @route   POST /api/v1/events
 * @desc    Create event
 * @access  Private (Organizer/Admin)
 */
router.post(
  '/',
  authenticate,
  requirePermission(Permission.EVENT_CREATE),
  validate([
    body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 200 }),
    body('description').notEmpty().withMessage('Description is required'),
    body('type').isIn(['hackathon', 'coding_challenge', 'contest', 'workshop', 'training']),
    body('startDate').isISO8601().toDate().withMessage('Valid start date is required'),
    body('endDate').isISO8601().toDate().withMessage('Valid end date is required'),
    body('registrationStartDate').isISO8601().toDate(),
    body('registrationEndDate').isISO8601().toDate()
  ]),
  asyncHandler(eventController.createEvent)
);

/**
 * @route   PUT /api/v1/events/:id
 * @desc    Update event
 * @access  Private (Organizer of event/Admin)
 */
router.put(
  '/:id',
  authenticate,
  requirePermission(Permission.EVENT_UPDATE),
  asyncHandler(eventController.updateEvent)
);

/**
 * @route   DELETE /api/v1/events/:id
 * @desc    Delete event
 * @access  Private (Organizer of event/Admin)
 */
router.delete(
  '/:id',
  authenticate,
  requirePermission(Permission.EVENT_DELETE),
  asyncHandler(eventController.deleteEvent)
);

/**
 * @route   POST /api/v1/events/:id/register
 * @desc    Register for event
 * @access  Private
 */
router.post(
  '/:id/register',
  authenticate,
  asyncHandler(eventController.registerForEvent)
);

/**
 * @route   POST /api/v1/events/:id/unregister
 * @desc    Unregister from event
 * @access  Private
 */
router.post(
  '/:id/unregister',
  authenticate,
  asyncHandler(eventController.unregisterFromEvent)
);

/**
 * @route   GET /api/v1/events/:id/participants
 * @desc    Get event participants
 * @access  Public
 */
router.get(
  '/:id/participants',
  asyncHandler(eventController.getEventParticipants)
);

/**
 * @route   GET /api/v1/events/organizer/:organizerId
 * @desc    Get events by organizer
 * @access  Public
 */
router.get(
  '/organizer/:organizerId',
  asyncHandler(eventController.getEventsByOrganizer)
);

export default router;
