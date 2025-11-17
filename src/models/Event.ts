import mongoose, { Schema, Document } from 'mongoose';
import {
  IEvent,
  IEventParticipant,
  IPrize,
  EventType,
  EventStatus,
  EventVisibility
} from '../types';

export interface IEventDocument extends Omit<IEvent, '_id'>, Document {}

const PrizeSchema = new Schema<IPrize>({
  position: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: String,
  amount: Number,
  currency: {
    type: String,
    default: 'USD'
  }
});

const EventParticipantSchema = new Schema<IEventParticipant>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  registeredAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['registered', 'confirmed', 'cancelled'],
    default: 'registered'
  },
  team: {
    type: Schema.Types.ObjectId,
    ref: 'Team'
  }
});

const EventSchema = new Schema<IEventDocument>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200
    },
    description: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: Object.values(EventType),
      required: true
    },
    status: {
      type: String,
      enum: Object.values(EventStatus),
      default: EventStatus.DRAFT
    },
    visibility: {
      type: String,
      enum: Object.values(EventVisibility),
      default: EventVisibility.PUBLIC
    },
    organizer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    registrationStartDate: {
      type: Date,
      required: true
    },
    registrationEndDate: {
      type: Date,
      required: true
    },
    maxParticipants: {
      type: Number,
      min: 1
    },
    currentParticipants: {
      type: Number,
      default: 0
    },
    problems: [{
      type: Schema.Types.ObjectId,
      ref: 'Problem'
    }],
    participants: [EventParticipantSchema],
    judges: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }],
    rules: String,
    prizes: [PrizeSchema],
    tags: [{
      type: String,
      trim: true
    }],
    banner: String,
    website: String,
    isTeamBased: {
      type: Boolean,
      default: false
    },
    minTeamSize: {
      type: Number,
      min: 1
    },
    maxTeamSize: {
      type: Number,
      min: 1
    }
  },
  {
    timestamps: true
  }
);

// Indexes
EventSchema.index({ title: 'text', description: 'text' });
EventSchema.index({ organizer: 1 });
EventSchema.index({ status: 1 });
EventSchema.index({ type: 1 });
EventSchema.index({ startDate: 1, endDate: 1 });
EventSchema.index({ tags: 1 });

// Validation: End date must be after start date
EventSchema.pre('save', function (next) {
  if (this.endDate <= this.startDate) {
    next(new Error('End date must be after start date'));
  }
  if (this.registrationEndDate <= this.registrationStartDate) {
    next(new Error('Registration end date must be after registration start date'));
  }
  if (this.isTeamBased && this.maxTeamSize && this.minTeamSize) {
    if (this.maxTeamSize < this.minTeamSize) {
      next(new Error('Max team size must be greater than or equal to min team size'));
    }
  }
  next();
});

// Update current participants count
EventSchema.methods.updateParticipantCount = function () {
  this.currentParticipants = this.participants.filter(
    (p: IEventParticipant) => p.status !== 'cancelled'
  ).length;
};

export const Event = mongoose.model<IEventDocument>('Event', EventSchema);
