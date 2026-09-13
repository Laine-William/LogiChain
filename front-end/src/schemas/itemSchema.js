import { z } from 'zod';

const {
  item_types, 
  item_status
} = require('./constants/constants');

export const historyLogValidationSchema = z.object(
  {
    action: z.string(),
    history: z.coerce.date().default(() => new Date()),
    userId: z.string().nullable().optional(),
  }
);

export const itemValidationSchema = z.object(
  {
    userId: z.string().nullable().optional(),
    name: z.string().min(1, "Le nom de l'équipement est requis"),
    type: z.enum(item_types, { errorMap: () => ({ message: "Le type est invalide" }) }),
    details: z.record(z.any()).optional(),
    quantity: z.number().default(1).min(0),
    status: z.enum(item_status).default('available'),
    isDeleted: z.boolean().default(false),
    history: z.array(historyLogValidationSchema).default([])
  }
);