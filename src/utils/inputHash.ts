// File: src/utils/inputHash.ts — Utility to generate a hash from user input for caching

import { UserInputData } from '../types/index.js';

/**
 * Generates a simple string hash from user input data.
 * Useful for caching AI responses.
 * @param input User activity data
 * @returns string hash
 */
export const generateInputHash = (input: UserInputData): string => {
  return `${input.dailyTravelKm}-${input.transportType}-${input.monthlyElectricityKWh}-${input.dietType}-${input.shoppingFrequency}`;
};
