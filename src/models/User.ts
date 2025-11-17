import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser, UserRole, UserStatus } from '../types';

export interface IUserDocument extends Omit<IUser, '_id'>, Document {
  comparePassword(candidatePassword: string): Promise<boolean>;
  generatePasswordResetToken(): string;
}

const UserSchema = new Schema<IUserDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
      match: [/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, hyphens and underscores']
    },
    firstName: {
      type: String,
      required: true,
      trim: true
    },
    lastName: {
      type: String,
      required: true,
      trim: true
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.PARTICIPANT
    },
    status: {
      type: String,
      enum: Object.values(UserStatus),
      default: UserStatus.PENDING_VERIFICATION
    },
    avatar: {
      type: String,
      default: null
    },
    bio: {
      type: String,
      maxlength: 500
    },
    skills: [{
      type: String,
      trim: true
    }],
    githubUrl: String,
    linkedinUrl: String,
    websiteUrl: String,
    emailVerified: {
      type: Boolean,
      default: false
    },
    emailVerificationToken: String,
    passwordResetToken: String,
    passwordResetExpires: Date,
    lastLogin: Date
  },
  {
    timestamps: true
  }
);

// Indexes
UserSchema.index({ email: 1 });
UserSchema.index({ username: 1 });
UserSchema.index({ role: 1 });

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const rounds = parseInt(process.env.BCRYPT_ROUNDS || '10');
    this.password = await bcrypt.hash(this.password, rounds);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to compare password
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to generate password reset token
UserSchema.methods.generatePasswordResetToken = function (): string {
  const crypto = require('crypto');
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = new Date(Date.now() + 3600000); // 1 hour

  return resetToken;
};

// Virtual for full name
UserSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Ensure virtuals are included in JSON
UserSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret.password;
    delete ret.passwordResetToken;
    delete ret.emailVerificationToken;
    return ret;
  }
});

export const User = mongoose.model<IUserDocument>('User', UserSchema);
