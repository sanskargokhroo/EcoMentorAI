// File: src/validators/index.ts — Zod schemas for payload validation (Frontend)

import { z } from 'zod';

export const UserInputSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name too long"),
  dailyTravelKm: z.number().min(0, "Travel distance cannot be negative").max(1000, "Value too high"),
  transportType: z.enum(['car', 'bike', 'bus', 'train', 'flight']),
  monthlyElectricityKWh: z.number().min(0, "Electricity cannot be negative").max(10000, "Value too high"),
  dietType: z.enum(['vegan', 'vegetarian', 'omnivore', 'heavy-meat']),
  shoppingFrequency: z.number().min(0, "Frequency cannot be negative").max(100, "Value too high"),
}).strict();

export type UserInputPayload = z.infer<typeof UserInputSchema>;
