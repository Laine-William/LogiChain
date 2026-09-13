import { z } from 'zod';

const {
    event_status
} = require('./constants/constants');

const zoneValidationSchema = z.object({
  zone: z.object({
    type: z.literal('Polygon').default('Polygon'),
    coordinates: z.array(
      z.array(
        z.array(z.number())
      )
    )
  }),
  status: z.string().default('active'),
});

export const eventValidationSchema = z.object(
  {
    userId: z.string().nullable().optional(),
    name: z.string().min(1, "Le nom de l'événement est requis"),
    description: z.string().optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    zones: z.array(zoneValidationSchema).min(1, "Au moins une zone est requise"),
    status: z.enum(event_status).default('active'),
    isDeleted: z.boolean().default(false),
  }
);