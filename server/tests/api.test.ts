// File: server/tests/api.test.ts — API integration tests

import { describe, it, expect, vi, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../index.js';
import * as aiService from '../services/aiService.js';

// Mock the AI service to avoid actual API calls during tests
vi.mock('../services/aiService.js', () => ({
  generateAICoachResponse: vi.fn()
}));

describe('API Integration Tests', () => {
  const validPayload = {
    name: 'Test User',
    dailyTravelKm: 10,
    transportType: 'car',
    monthlyElectricityKWh: 100,
    dietType: 'vegan',
    shoppingFrequency: 2
  };

  beforeAll(() => {
    // Setup mock return
    (aiService.generateAICoachResponse as any).mockResolvedValue({
      footprint: {
        totalCO2: 120,
        breakdown: { transport: 57, electricity: 82, diet: 60, shopping: 30 },
        rating: 'B',
        comparisonToIndia: -25,
        comparisonToGlobal: -70
      },
      aiCoach: {
        topSources: [{ source: 'Electricity', explanation: 'High usage' }],
        recommendations: [],
        weeklyPlan: [],
        estimatedSavings: 10
      }
    });
  });

  // 1. GET /api/health returns 200
  it('GET /api/health returns 200 OK', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  // 2. POST /api/calculate returns correct emission breakdown
  it('POST /api/calculate returns successful response with breakdown', async () => {
    const res = await request(app)
      .post('/api/calculate')
      .send(validPayload);
      
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.footprint.totalCO2).toBeDefined();
  });

  // 3. POST /api/calculate rejects invalid input (Zod)
  it('POST /api/calculate rejects invalid payload', async () => {
    const invalidPayload = { ...validPayload, dailyTravelKm: -10 };
    const res = await request(app)
      .post('/api/calculate')
      .send(invalidPayload);
      
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Validation Error');
  });

  // 4. POST /api/ai-coach returns structured recommendations
  it('POST /api/calculate returns structured AI recommendations', async () => {
    const res = await request(app)
      .post('/api/calculate')
      .send(validPayload);
      
    expect(res.status).toBe(200);
    expect(res.body.data.aiCoach).toBeDefined();
    expect(res.body.data.aiCoach.topSources).toBeInstanceOf(Array);
  });

  // 5. Rate limiter returns 429 after threshold
  it('Rate limiter blocks excessive requests', async () => {
    let lastStatus = 200;
    // The aiLimiter allows 10 requests per minute
    for (let i = 0; i < 12; i++) {
      const res = await request(app).post('/api/calculate').send(validPayload);
      lastStatus = res.status;
    }
    expect(lastStatus).toBe(429);
  });
});
