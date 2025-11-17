import mongoose, { Schema, Document } from 'mongoose';
import { ITeam, ITeamMember } from '../types';
import { v4 as uuidv4 } from 'uuid';

export interface ITeamDocument extends Omit<ITeam, '_id'>, Document {}

const TeamMemberSchema = new Schema<ITeamMember>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  joinedAt: {
    type: Date,
    default: Date.now
  },
  role: {
    type: String,
    enum: ['leader', 'member'],
    default: 'member'
  },
  status: {
    type: String,
    enum: ['active', 'removed'],
    default: 'active'
  }
});

const TeamSchema = new Schema<ITeamDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    event: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: true
    },
    members: {
      type: [TeamMemberSchema],
      validate: {
        validator: function (v: ITeamMember[]) {
          return v && v.length >= 1;
        },
        message: 'A team must have at least one member'
      }
    },
    leader: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    inviteCode: {
      type: String,
      unique: true,
      default: () => uuidv4().substring(0, 8).toUpperCase()
    },
    maxMembers: {
      type: Number,
      required: true,
      min: 1
    }
  },
  {
    timestamps: true
  }
);

// Indexes
TeamSchema.index({ event: 1 });
TeamSchema.index({ leader: 1 });
TeamSchema.index({ inviteCode: 1 });
TeamSchema.index({ 'members.user': 1 });

// Ensure leader is in members array
TeamSchema.pre('save', function (next) {
  const leaderInMembers = this.members.some(
    (member) => member.user.toString() === this.leader.toString() && member.status === 'active'
  );

  if (!leaderInMembers) {
    next(new Error('Team leader must be an active member of the team'));
  }

  // Check max members
  const activeMembers = this.members.filter((m) => m.status === 'active');
  if (activeMembers.length > this.maxMembers) {
    next(new Error(`Team cannot have more than ${this.maxMembers} members`));
  }

  next();
});

export const Team = mongoose.model<ITeamDocument>('Team', TeamSchema);
