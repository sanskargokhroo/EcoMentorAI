// File: src/tests/carbonCalculator.test.ts — Unit tests for calculation logic

import { describe, it, expect } from 'vitest';
import { calculateFootprint, calculateRating } from '../utils/carbonCalculator';
import { TRANSPORT_EMISSIONS, DIET_EMISSIONS, SHOPPING_EMISSION_FACTOR, ELECTRICITY_EMISSION_FACTOR } from '../constants/emissionFactors';
import { UserInputData } from '../types';

describe('Carbon Calculator Logic', () => {
  const baseInput: UserInputData = {
    dailyTravelKm: 10,
    transportType: 'car',
    monthlyElectricityKWh: 100,
    dietType: 'vegan',
    shoppingFrequency: 2
  };

  // 1. test each transport type
  it('calculates car transport correctly', () => {
    const res = calculateFootprint(baseInput);
    expect(res.breakdown.transport).toBe(10 * 30 * TRANSPORT_EMISSIONS.car);
  });

  it('calculates flight transport correctly', () => {
    const res = calculateFootprint({ ...baseInput, transportType: 'flight' });
    expect(res.breakdown.transport).toBe(10 * 30 * TRANSPORT_EMISSIONS.flight);
  });

  // 2. test diet emission values
  it('calculates diet correctly for vegan', () => {
    const res = calculateFootprint(baseInput);
    expect(res.breakdown.diet).toBe(DIET_EMISSIONS.vegan);
  });

  it('calculates diet correctly for heavy-meat', () => {
    const res = calculateFootprint({ ...baseInput, dietType: 'heavy-meat' });
    expect(res.breakdown.diet).toBe(DIET_EMISSIONS['heavy-meat']);
  });

  // 3. test total calculation with known inputs
  it('calculates total correctly', () => {
    const res = calculateFootprint(baseInput);
    const expectedTransport = 10 * 30 * TRANSPORT_EMISSIONS.car;
    const expectedElec = 100 * ELECTRICITY_EMISSION_FACTOR;
    const expectedDiet = DIET_EMISSIONS.vegan;
    const expectedShopping = 2 * SHOPPING_EMISSION_FACTOR;
    
    expect(res.totalCO2).toBe(expectedTransport + expectedElec + expectedDiet + expectedShopping);
  });

  // 4. test sustainability rating thresholds
  it('returns A for < 100', () => {
    expect(calculateRating(50)).toBe('A');
  });

  it('returns B for < 200', () => {
    expect(calculateRating(150)).toBe('B');
  });

  it('returns C for < 300', () => {
    expect(calculateRating(250)).toBe('C');
  });

  it('returns D for < 450', () => {
    expect(calculateRating(400)).toBe('D');
  });

  it('returns F for >= 450', () => {
    expect(calculateRating(500)).toBe('F');
  });

  it('handles zero values correctly', () => {
    const zeroInput: UserInputData = {
      name: 'Test User',
      dailyTravelKm: 0,
      transportType: 'bike',
      monthlyElectricityKWh: 0,
      dietType: 'vegan', // vegan still has a base value
      shoppingFrequency: 0
    };
    const res = calculateFootprint(zeroInput);
    expect(res.totalCO2).toBe(DIET_EMISSIONS.vegan);
  });
});
