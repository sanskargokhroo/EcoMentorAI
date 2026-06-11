// File: src/types/index.ts — Shared TypeScript interfaces for the application

export type TransportType = 'car' | 'bike' | 'bus' | 'train' | 'flight';
export type DietType = 'vegan' | 'vegetarian' | 'omnivore' | 'heavy-meat';
export type SustainabilityRating = 'A' | 'B' | 'C' | 'D' | 'F';

export interface UserInputData {
  name: string;
  dailyTravelKm: number;
  transportType: TransportType;
  monthlyElectricityKWh: number;
  dietType: DietType;
  shoppingFrequency: number; // e.g., items per month
}

export interface EmissionBreakdown {
  transport: number;
  electricity: number;
  diet: number;
  shopping: number;
}

export interface CalculationResult {
  totalCO2: number;
  breakdown: EmissionBreakdown;
  rating: SustainabilityRating;
  comparisonToIndia: number; // percentage diff
  comparisonToGlobal: number; // percentage diff
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  impactCO2: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface AICoachResponse {
  topSources: { source: string; explanation: string }[];
  recommendations: Recommendation[];
  weeklyPlan: string[];
  estimatedSavings: number;
}
