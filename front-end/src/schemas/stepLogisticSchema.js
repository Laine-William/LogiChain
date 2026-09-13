import { z } from 'zod';

const {
  logistic_step_status,
  logistic_vehicle_types
} = require('./constants/constants');

const pointSchema = z.object({
  type: z.literal('Point').default('Point'),
  coordinates: z.array(z.number()).length(2)
});

export const stepLogisticValidationSchema = z.object(
  {
    location: z.string().min(1, "La localisation est requise"),
    position: pointSchema.optional(),
    distance: z.number().positive("La distance doit être positive"),
    fuelConsumption: z.number().min(0).default(0),
    vehicle: z.enum(logistic_vehicle_types, { errorMap: () => ({ message: "Type de véhicule invalide" }) }).default('truck'),
    status: z.enum(logistic_step_status).default('to_do'),
    items: z.array(z.string()).optional(),
  }
);