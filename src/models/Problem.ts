import mongoose, { Schema, Document } from 'mongoose';
import {
  IProblem,
  IExample,
  ITestCase,
  IStarterCode,
  ProblemDifficulty,
  ProblemStatus
} from '../types';

export interface IProblemDocument extends Omit<IProblem, '_id'>, Document {
  calculateSuccessRate(): void;
}

const ExampleSchema = new Schema<IExample>({
  input: {
    type: String,
    required: true
  },
  output: {
    type: String,
    required: true
  },
  explanation: String
});

const TestCaseSchema = new Schema<ITestCase>({
  input: {
    type: String,
    required: true
  },
  expectedOutput: {
    type: String,
    required: true
  },
  isHidden: {
    type: Boolean,
    default: false
  },
  weight: {
    type: Number,
    default: 1,
    min: 0
  }
});

const StarterCodeSchema = new Schema<IStarterCode>({
  language: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true
  }
});

const ProblemSchema = new Schema<IProblemDocument>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    difficulty: {
      type: String,
      enum: Object.values(ProblemDifficulty),
      required: true
    },
    status: {
      type: String,
      enum: Object.values(ProblemStatus),
      default: ProblemStatus.DRAFT
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    category: {
      type: String,
      required: true,
      trim: true
    },
    tags: [{
      type: String,
      trim: true
    }],
    timeLimit: {
      type: Number,
      required: true,
      min: 1,
      default: 90
    },
    memoryLimit: {
      type: Number,
      min: 1,
      default: 128
    },
    inputFormat: String,
    outputFormat: String,
    constraints: String,
    examples: {
      type: [ExampleSchema],
      validate: {
        validator: function (v: IExample[]) {
          return v && v.length >= 1;
        },
        message: 'At least one example is required'
      }
    },
    testCases: {
      type: [TestCaseSchema],
      validate: {
        validator: function (v: ITestCase[]) {
          return v && v.length >= 1;
        },
        message: 'At least one test case is required'
      }
    },
    hints: [String],
    solution: String,
    languages: {
      type: [String],
      default: ['javascript', 'python', 'java', 'csharp', 'cpp']
    },
    starterCode: [StarterCodeSchema],
    totalSubmissions: {
      type: Number,
      default: 0
    },
    successfulSubmissions: {
      type: Number,
      default: 0
    },
    successRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    averageTime: Number,
    likes: {
      type: Number,
      default: 0
    },
    dislikes: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// Indexes
ProblemSchema.index({ title: 'text', description: 'text' });
ProblemSchema.index({ slug: 1 });
ProblemSchema.index({ author: 1 });
ProblemSchema.index({ difficulty: 1 });
ProblemSchema.index({ category: 1 });
ProblemSchema.index({ tags: 1 });
ProblemSchema.index({ status: 1 });

// Generate slug from title before saving
ProblemSchema.pre('save', function (next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

// Method to calculate success rate
ProblemSchema.methods.calculateSuccessRate = function (): void {
  if (this.totalSubmissions > 0) {
    this.successRate = Math.round(
      (this.successfulSubmissions / this.totalSubmissions) * 100
    );
  } else {
    this.successRate = 0;
  }
};

export const Problem = mongoose.model<IProblemDocument>('Problem', ProblemSchema);
