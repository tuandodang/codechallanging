import mongoose, { Schema, Document } from 'mongoose';
import { INotification, NotificationType } from '../types';

export interface INotificationDocument extends Omit<INotification, '_id'>, Document {}

const NotificationSchema = new Schema<INotificationDocument>(
  {
    recipient: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    type: {
      type: String,
      enum: Object.values(NotificationType),
      required: true
    },
    title: {
      type: String,
      required: true,
      maxlength: 200
    },
    message: {
      type: String,
      required: true,
      maxlength: 1000
    },
    data: {
      type: Schema.Types.Mixed
    },
    isRead: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// Indexes
NotificationSchema.index({ recipient: 1, isRead: 1 });
NotificationSchema.index({ createdAt: -1 });

export const Notification = mongoose.model<INotificationDocument>('Notification', NotificationSchema);
