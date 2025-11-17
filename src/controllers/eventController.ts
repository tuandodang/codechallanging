import { Response } from 'express';
import { Event } from '../models/Event';
import { AuthRequest, QueryParams, EventStatus, EventVisibility } from '../types';
import { ApiError } from '../middleware/errorHandler';

/**
 * Get all events
 * GET /api/v1/events
 */
export const getAllEvents = async (req: AuthRequest, res: Response): Promise<void> => {
  const {
    page = 1,
    limit = 10,
    sort = 'startDate',
    order = 'desc',
    search,
    filter = {}
  } = req.query as QueryParams & { filter?: any };

  const query: any = {};

  // Only show public events to non-authenticated users
  if (!req.user) {
    query.visibility = EventVisibility.PUBLIC;
    query.status = { $in: [EventStatus.PUBLISHED, EventStatus.ONGOING] };
  }

  // Search by title or description
  if (search) {
    query.$text = { $search: search };
  }

  // Apply filters
  if (filter.type) query.type = filter.type;
  if (filter.status) query.status = filter.status;
  if (filter.organizer) query.organizer = filter.organizer;

  const totalEvents = await Event.countDocuments(query);
  const totalPages = Math.ceil(totalEvents / Number(limit));

  const events = await Event.find(query)
    .sort({ [sort as string]: order === 'asc' ? 1 : -1 })
    .limit(Number(limit))
    .skip((Number(page) - 1) * Number(limit))
    .populate('organizer', 'username firstName lastName avatar')
    .populate('problems', 'title difficulty');

  res.json({
    success: true,
    data: events,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total: totalEvents,
      totalPages
    }
  });
};

/**
 * Get event by ID
 * GET /api/v1/events/:id
 */
export const getEventById = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  const event = await Event.findById(id)
    .populate('organizer', 'username firstName lastName avatar email')
    .populate('problems', 'title slug difficulty category')
    .populate('judges', 'username firstName lastName avatar')
    .populate('participants.user', 'username firstName lastName avatar');

  if (!event) {
    throw new ApiError(404, 'Event not found');
  }

  // Check visibility
  if (event.visibility === EventVisibility.PRIVATE && !req.user) {
    throw new ApiError(403, 'This event is private');
  }

  res.json({
    success: true,
    data: event
  });
};

/**
 * Create event
 * POST /api/v1/events
 */
export const createEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    throw new ApiError(401, 'Authentication required');
  }

  const eventData = {
    ...req.body,
    organizer: req.user.userId
  };

  const event = await Event.create(eventData);

  res.status(201).json({
    success: true,
    message: 'Event created successfully',
    data: event
  });
};

/**
 * Update event
 * PUT /api/v1/events/:id
 */
export const updateEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  const event = await Event.findById(id);

  if (!event) {
    throw new ApiError(404, 'Event not found');
  }

  // Check if user is organizer or admin
  if (
    event.organizer.toString() !== req.user?.userId &&
    req.user?.role !== 'admin'
  ) {
    throw new ApiError(403, 'You can only update your own events');
  }

  const updatedEvent = await Event.findByIdAndUpdate(
    id,
    { $set: req.body },
    { new: true, runValidators: true }
  ).populate('organizer', 'username firstName lastName');

  res.json({
    success: true,
    message: 'Event updated successfully',
    data: updatedEvent
  });
};

/**
 * Delete event
 * DELETE /api/v1/events/:id
 */
export const deleteEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  const event = await Event.findById(id);

  if (!event) {
    throw new ApiError(404, 'Event not found');
  }

  // Check if user is organizer or admin
  if (
    event.organizer.toString() !== req.user?.userId &&
    req.user?.role !== 'admin'
  ) {
    throw new ApiError(403, 'You can only delete your own events');
  }

  await Event.findByIdAndDelete(id);

  res.json({
    success: true,
    message: 'Event deleted successfully'
  });
};

/**
 * Register for event
 * POST /api/v1/events/:id/register
 */
export const registerForEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  if (!req.user) {
    throw new ApiError(401, 'Authentication required');
  }

  const event = await Event.findById(id);

  if (!event) {
    throw new ApiError(404, 'Event not found');
  }

  // Check if registration is open
  const now = new Date();
  if (now < event.registrationStartDate) {
    throw new ApiError(400, 'Registration has not started yet');
  }

  if (now > event.registrationEndDate) {
    throw new ApiError(400, 'Registration has closed');
  }

  // Check if already registered
  const alreadyRegistered = event.participants.some(
    (p) => p.user.toString() === req.user?.userId
  );

  if (alreadyRegistered) {
    throw new ApiError(400, 'You are already registered for this event');
  }

  // Check max participants
  if (event.maxParticipants && event.currentParticipants >= event.maxParticipants) {
    throw new ApiError(400, 'Event is full');
  }

  // Add participant
  event.participants.push({
    user: req.user.userId as any,
    registeredAt: new Date(),
    status: 'registered'
  });

  event.currentParticipants += 1;
  await event.save();

  res.json({
    success: true,
    message: 'Successfully registered for event',
    data: event
  });
};

/**
 * Unregister from event
 * POST /api/v1/events/:id/unregister
 */
export const unregisterFromEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  if (!req.user) {
    throw new ApiError(401, 'Authentication required');
  }

  const event = await Event.findById(id);

  if (!event) {
    throw new ApiError(404, 'Event not found');
  }

  // Find participant
  const participantIndex = event.participants.findIndex(
    (p) => p.user.toString() === req.user?.userId && p.status !== 'cancelled'
  );

  if (participantIndex === -1) {
    throw new ApiError(400, 'You are not registered for this event');
  }

  // Update status to cancelled
  event.participants[participantIndex].status = 'cancelled';
  event.currentParticipants -= 1;
  await event.save();

  res.json({
    success: true,
    message: 'Successfully unregistered from event'
  });
};

/**
 * Get event participants
 * GET /api/v1/events/:id/participants
 */
export const getEventParticipants = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  const event = await Event.findById(id).populate('participants.user', 'username firstName lastName avatar');

  if (!event) {
    throw new ApiError(404, 'Event not found');
  }

  const activeParticipants = event.participants.filter((p) => p.status !== 'cancelled');

  res.json({
    success: true,
    data: {
      total: activeParticipants.length,
      participants: activeParticipants
    }
  });
};

/**
 * Get events by organizer
 * GET /api/v1/events/organizer/:organizerId
 */
export const getEventsByOrganizer = async (req: AuthRequest, res: Response): Promise<void> => {
  const { organizerId } = req.params;

  const events = await Event.find({ organizer: organizerId })
    .sort({ createdAt: -1 })
    .populate('problems', 'title difficulty');

  res.json({
    success: true,
    data: events
  });
};
