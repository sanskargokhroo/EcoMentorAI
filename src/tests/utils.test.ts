// File: src/tests/utils.test.ts — Additional utility tests

import { describe, it, expect } from 'vitest';
import { generateInputHash } from '../utils/inputHash';
import { UserInputData } from '../types';

describe('Utility Functions', () => {
  // 8. test hash generation consistency
  it('should generate a consistent hash for identical input', () => {
    const input1: UserInputData = { name: 'Test User', dailyTravelKm: 10, transportType: 'car', monthlyElectricityKWh: 200, dietType: 'vegan', shoppingFrequency: 2 };
    const input2: UserInputData = { name: 'Test User', dailyTravelKm: 10, transportType: 'car', monthlyElectricityKWh: 200, dietType: 'vegan', shoppingFrequency: 2 };
    
    expect(generateInputHash(input1)).toBe(generateInputHash(input2));
  });
});
