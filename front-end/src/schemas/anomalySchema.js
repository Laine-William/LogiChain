import { z } from 'zod';

const {
    anomaly_reasons,
    anomaly_severities,
    anomaly_status
} = require('./constants/constants');

export const anomalyValidationSchema = z.object(
  {
    userId: z.string().nullable().optional(),
    eventId: z.string().min(1, "L'ID de l'événement est requis"),
    logisticId: z.string().optional(),
    stepId: z.string().optional(),
    itemId: z.string().optional(),
    reason: z.enum(anomaly_reasons),
    description: z.string().min(10, "La description est trop courte").optional(),
    severity: z.enum(anomaly_severities).default('low'),
    status: z.enum(anomaly_status).default('open'),
    location: z.object({
      type: z.literal('Point').default('Point'),
      coordinates: z.tuple([z.number(), z.number()])
    }),
    isDeleted: z.boolean().default(false),
  }
);