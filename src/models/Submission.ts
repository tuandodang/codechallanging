import mongoose, { Schema, Document } from 'mongoose';
import { ISubmission, SubmissionStatus } from '../types';

export interface ISubmissionDocument extends Omit<ISubmission, '_id'>, Document {}

const SubmissionSchema = new Schema<ISubmissionDocument>(
  {
    problem: {
      type: Schema.Types.ObjectId,
      ref: 'Problem',
      required: true
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    event: {
      type: Schema.Types.ObjectId,
      ref: 'Event'
    },
    code: {
      type: String,
      required: true
    },
    language: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: Object.values(SubmissionStatus),
      default: SubmissionStatus.PENDING
    },
    executionTime: {
      type: Number,
      min: 0
    },
    memoryUsed: {
      type: Number,
      min: 0
    },
    passedTestCases: {
      type: Number,
      default: 0,
      min: 0
    },
    totalTestCases: {
      type: Number,
      required: true,
      min: 0
    },
    score: {
      type: Number,
      min: 0,
      max: 100
    },
    errorMessage: String,
    output: String,
    submittedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// Indexes
SubmissionSchema.index({ user: 1, problem: 1 });
SubmissionSchema.index({ event: 1 });
SubmissionSchema.index({ status: 1 });
SubmissionSchema.index({ submittedAt: -1 });

// Calculate score based on passed test cases
SubmissionSchema.pre('save', function (next) {
  if (this.totalTestCases > 0) {
    this.score = Math.round((this.passedTestCases / this.totalTestCases) * 100);
  } else {
    this.score = 0;
  }
  next();
});

export const Submission = mongoose.model<ISubmissionDocument>('Submission', SubmissionSchema);
