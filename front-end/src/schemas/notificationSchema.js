import { z } from 'zod';

const {
  notification_types
} = require('./constants/constants');

export const notificationValidationSchema = z.object(
  {
    userId: z.string().min(1, "L'ID utilisateur est obligatoire"),
    message: z.string().min(3, "Message trop court").max(80, "Message trop long"),
    type: z.enum(notification_types).default('system'),
    isRead: z.boolean().default(false),
    externalRef: z.string().optional(),
  }
);