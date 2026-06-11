// File: src/constants/emissionFactors.ts — Scientifically sourced emission factors (kg CO2)

// Transport (kg CO2 per km)
export const TRANSPORT_EMISSIONS = {
  car: 0.192, // average petrol car
  bike: 0.103, // average motorcycle
  bus: 0.105, // local bus average
  train: 0.041, // national rail
  flight: 0.255, // domestic flight per km
};

// Electricity (kg CO2 per kWh)
export const ELECTRICITY_EMISSION_FACTOR = 0.82; // India grid average

// Diet (kg CO2 per month, assuming 30 days)
export const DIET_EMISSIONS: Record<string, number> = {
  vegan: 60, // 2kg/day
  vegetarian: 90, // 3kg/day
  omnivore: 150, // 5kg/day
  'heavy-meat': 210, // 7kg/day
};

// Shopping (kg CO2 per item average - textiles/electronics mixed)
export const SHOPPING_EMISSION_FACTOR = 15.0; 

// Averages (kg CO2 per month)
export const NATIONAL_AVERAGE_INDIA = 160; // ~1.9 tons per year
export const GLOBAL_AVERAGE = 400; // ~4.8 tons per year
