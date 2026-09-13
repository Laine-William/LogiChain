import { z } from 'zod';

const {
  user_accountStatus,
  user_availabilityStatus
} = require('./constants/constants');

export const userValidationSchema = z.object(
  {
    fullName: z.string().min(1, "Le nom complet est obligatoire"),
    email: z.string().email("Format d'email invalide"),
    role: z.string().min(1, "Le rôle est requis"),
    password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
    accountStatus: z.enum(user_accountStatus).default('pending'),
    availabilityStatus: z.enum(user_availabilityStatus).default('offline'),
    isDeleted: z.boolean().default(false),
  }
);