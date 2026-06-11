// File: server/validators/index.ts — Zod schemas for API validation

import { z } from 'zod';

export const UserInputSchema = z.object({
  name: z.string().min(2).max(50),
  dailyTravelKm: z.number().min(0).max(1000),
  transportType: z.enum(['car', 'bike', 'bus', 'train', 'flight']),
  monthlyElectricityKWh: z.number().min(0).max(10000),
  dietType: z.enum(['vegan', 'vegetarian', 'omnivore', 'heavy-meat']),
  shoppingFrequency: z.number().min(0).max(100),
}).strict();

export type UserInputPayload = z.infer<typeof UserInputSchema>;
