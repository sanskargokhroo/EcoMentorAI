// File: src/utils/carbonCalculator.ts — Pure functions for carbon footprint calculations

import { TRANSPORT_EMISSIONS, ELECTRICITY_EMISSION_FACTOR, DIET_EMISSIONS, SHOPPING_EMISSION_FACTOR, NATIONAL_AVERAGE_INDIA, GLOBAL_AVERAGE } from '../constants/emissionFactors';
import { UserInputData, CalculationResult, SustainabilityRating, EmissionBreakdown } from '../types';

/**
 * Calculates the monthly carbon footprint based on user inputs.
 * @param input User activity data
 * @returns Comprehensive calculation result
 */
export const calculateFootprint = (input: UserInputData): CalculationResult => {
  // Monthly transport = daily * 30 * factor
  const transportCO2 = input.dailyTravelKm * 30 * (TRANSPORT_EMISSIONS[input.transportType] || 0);
  
  const electricityCO2 = input.monthlyElectricityKWh * ELECTRICITY_EMISSION_FACTOR;
  
  const dietCO2 = DIET_EMISSIONS[input.dietType] || 0;
  
  const shoppingCO2 = input.shoppingFrequency * SHOPPING_EMISSION_FACTOR;

  const totalCO2 = transportCO2 + electricityCO2 + dietCO2 + shoppingCO2;

  const breakdown: EmissionBreakdown = {
    transport: Number(transportCO2.toFixed(2)),
    electricity: Number(electricityCO2.toFixed(2)),
    diet: Number(dietCO2.toFixed(2)),
    shopping: Number(shoppingCO2.toFixed(2))
  };

  const rating = calculateRating(totalCO2);

  return {
    totalCO2: Number(totalCO2.toFixed(2)),
    breakdown,
    rating,
    comparisonToIndia: Number(((totalCO2 - NATIONAL_AVERAGE_INDIA) / NATIONAL_AVERAGE_INDIA * 100).toFixed(2)),
    comparisonToGlobal: Number(((totalCO2 - GLOBAL_AVERAGE) / GLOBAL_AVERAGE * 100).toFixed(2))
  };
};

/**
 * Determines sustainability rating based on total monthly CO2.
 * @param totalCO2 Total monthly emissions in kg
 * @returns Rating letter A-F
 */
export const calculateRating = (totalCO2: number): SustainabilityRating => {
  if (totalCO2 < 100) return 'A';
  if (totalCO2 < 200) return 'B';
  if (totalCO2 < 300) return 'C';
  if (totalCO2 < 450) return 'D';
  return 'F';
};
