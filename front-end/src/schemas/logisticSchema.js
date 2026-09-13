import { z } from 'zod';
import { stepLogisticValidationSchema } from './stepLogisticSchema';

const {
  logistic_status
} = require('./constants/constants');

const pointSchema = z.object({
  type: z.literal('Point').default('Point'),
  coordinates: z.array(z.number()).length(2)
});

export const logisticValidationSchema = z.object(
  {
    userId: z.array(z.string()).optional(),
    eventId: z.string().optional(),
    departureDestination: z.string().min(1, "La destination de départ est requise"),
    departurePosition: pointSchema.optional(),
    arrivalDestination: z.string().min(1, "La destination d'arrivée est requise"),
    arrivalPosition: pointSchema.optional(),
    totalFuelConsumption: z.number().min(0).optional(),
    totalDistance: z.number().positive("La distance totale est requise").optional(),
    status: z.enum(logistic_status).default('starting'),
    steps: z.array(stepLogisticValidationSchema).default([]),
    isDeleted: z.boolean().default(false),
  }
);