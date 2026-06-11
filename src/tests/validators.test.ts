// File: src/tests/validators.test.ts — Unit tests for Zod schemas

import { describe, it, expect } from 'vitest';
import { UserInputSchema } from '../validators';

describe('Zod Validation', () => {
  // 6. test schema accepts valid inputs
  it('accepts valid input', () => {
    const valid = {
      dailyTravelKm: 15,
      transportType: 'bus',
      monthlyElectricityKWh: 150,
      dietType: 'vegetarian',
      shoppingFrequency: 3
    };
    const result = UserInputSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  // 7. test schema rejects invalid inputs (negative values, unknown enum)
  it('rejects negative numbers', () => {
    const invalid = {
      dailyTravelKm: -5,
      transportType: 'bus',
      monthlyElectricityKWh: 150,
      dietType: 'vegetarian',
      shoppingFrequency: 3
    };
    const result = UserInputSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects unknown enum values', () => {
    const invalid = {
      dailyTravelKm: 10,
      transportType: 'spaceship',
      monthlyElectricityKWh: 150,
      dietType: 'vegetarian',
      shoppingFrequency: 3
    };
    const result = UserInputSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects unknown fields (strict mode)', () => {
    const invalid = {
      dailyTravelKm: 10,
      transportType: 'bus',
      monthlyElectricityKWh: 150,
      dietType: 'vegetarian',
      shoppingFrequency: 3,
      extraField: 'not allowed'
    };
    const result = UserInputSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
