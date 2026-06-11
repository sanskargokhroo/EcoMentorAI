// File: server/services/aiService.ts — Business logic for AI generation with in-memory cache

import { GoogleGenerativeAI } from '@google/generative-ai';
import { UserInputPayload } from '../validators/index.js';
import { calculateFootprint } from '../../src/utils/carbonCalculator.js';
import { generateInputHash } from '../../src/utils/inputHash.js';

// In-memory cache: Map<InputHash, { data: string, expiry: number }>
const aiCache = new Map<string, { data: string; expiry: number }>();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

export const generateAICoachResponse = async (input: UserInputPayload): Promise<any> => {
  const hash = generateInputHash(input);

  // Check cache
  const cached = aiCache.get(hash);
  if (cached && cached.expiry > Date.now()) {
    return JSON.parse(cached.data);
  }

  const footprintResult = calculateFootprint(input);

  // Calculate AI
  // The API key check and AI initialization are moved inside the try block so the fallback works if key is missing.

  const prompt = `
    You are an expert AI Carbon Coach. A user has the following carbon footprint data:
    - Transport: ${input.transportType}, ${input.dailyTravelKm} km/day (${footprintResult.breakdown.transport} kg CO2/mo)
    - Electricity: ${input.monthlyElectricityKWh} kWh/mo (${footprintResult.breakdown.electricity} kg CO2/mo)
    - Diet: ${input.dietType} (${footprintResult.breakdown.diet} kg CO2/mo)
    - Shopping: ${input.shoppingFrequency} items/mo (${footprintResult.breakdown.shopping} kg CO2/mo)
    - Total: ${footprintResult.totalCO2} kg CO2/mo (Rating: ${footprintResult.rating})

    Provide a structured JSON response containing exactly these fields:
    {
      "topSources": [ { "source": "string", "explanation": "string" } ],
      "recommendations": [ { "id": "string", "title": "string", "description": "string", "impactCO2": number, "difficulty": "Easy" | "Medium" | "Hard" } ],
      "weeklyPlan": [ "string" ],
      "estimatedSavings": number
    }
    
    Ensure "recommendations" has exactly 5 items, "weeklyPlan" has exactly 7 items, and "topSources" has up to 3 items.
    Ensure the response is pure JSON without markdown formatting like \`\`\`json.
  `;

  try {
    let apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'your_actual_api_key_here') {
      try {
        const fs = require('fs');
        const path = require('path');
        const envPath = path.join(process.cwd(), '.env');
        if (fs.existsSync(envPath)) {
          const envContent = fs.readFileSync(envPath, 'utf-8');
          const match = envContent.match(/GEMINI_API_KEY=(.*)/);
          if (match && match[1]) {
            apiKey = match[1].trim();
          }
        }
      } catch (e) {}
    }

    if (!apiKey || apiKey === 'your_actual_api_key_here') {
      throw new Error('GEMINI_API_KEY is not defined or invalid');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash' });

    const result = await model.generateContent(prompt);
    let text = result.response.text();
    
    // Clean up potential markdown formatting
    if (text.startsWith('\`\`\`json')) {
      text = text.substring(7);
    }
    if (text.startsWith('\`\`\`')) {
      text = text.substring(3);
    }
    if (text.endsWith('\`\`\`')) {
      text = text.substring(0, text.length - 3);
    }
    
    text = text.trim();
    
    const parsedData = JSON.parse(text);
    
    // Validate structure (basic check)
    if (!parsedData.recommendations || !parsedData.topSources) {
      throw new Error('Invalid AI response structure');
    }

    const finalResponse = {
      footprint: footprintResult,
      aiCoach: parsedData
    };

    // Save to cache
    aiCache.set(hash, {
      data: JSON.stringify(finalResponse),
      expiry: Date.now() + CACHE_TTL
    });

    return finalResponse;
  } catch (error) {
    console.error("AI Generation Error:", error);
    // Provide a fallback response if AI fails
    return {
      footprint: footprintResult,
      aiCoach: {
        topSources: [{ source: "System", explanation: "AI Coach currently unavailable." }],
        recommendations: [
          { id: "fallback-1", title: "Reduce Travel", description: "Try walking or cycling for short trips.", impactCO2: 20, difficulty: "Easy" },
          { id: "fallback-2", title: "Eat Less Meat", description: "Incorporate more plant-based meals into your diet.", impactCO2: 30, difficulty: "Medium" },
          { id: "fallback-3", title: "Save Energy", description: "Turn off lights and unplug appliances when not in use.", impactCO2: 15, difficulty: "Easy" },
          { id: "fallback-4", title: "Buy Local", description: "Purchase locally sourced goods to reduce shipping emissions.", impactCO2: 10, difficulty: "Medium" },
          { id: "fallback-5", title: "Reduce Waste", description: "Avoid single-use plastics and recycle properly.", impactCO2: 5, difficulty: "Easy" }
        ],
        weeklyPlan: ["Meatless Monday", "Turn off lights", "Walk to work", "No plastic bags", "Unplug devices", "Cold wash clothes", "Buy local"],
        estimatedSavings: 80
      }
    };
  }
};

export const generateTimeMachineLetter = async (input: UserInputPayload): Promise<string> => {
  const footprintResult = calculateFootprint(input);
  
  const prompt = `
    You are the user in the year 2050 writing a letter to their past self in 2026.
    The user's current carbon footprint is ${footprintResult.totalCO2} kg CO2/mo (Rating: ${footprintResult.rating}).
    
    Based on this footprint:
    - If the footprint is high (rating 'Bad' or 'Terrible'), describe a harsh, difficult future in their local surroundings (assume an Indian context, e.g., extreme heat, water scarcity, smog).
    - If the footprint is low (rating 'Excellent' or 'Good'), describe a greener, hopeful future where their early actions helped save the environment.
    
    Make the letter deeply emotional, personal, and end with a strong, actionable plea to either change their ways or keep up the good work.
    Do not use markdown formatting like \`\`\` or include JSON. Just return the raw text of the letter. Keep it around 150-200 words.
  `;

  try {
    let apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'your_actual_api_key_here') {
      try {
        const fs = require('fs');
        const path = require('path');
        const envPath = path.join(process.cwd(), '.env');
        if (fs.existsSync(envPath)) {
          const envContent = fs.readFileSync(envPath, 'utf-8');
          const match = envContent.match(/GEMINI_API_KEY=(.*)/);
          if (match && match[1]) {
            apiKey = match[1].trim();
          }
        }
      } catch (e) {}
    }

    if (!apiKey || apiKey === 'your_actual_api_key_here') {
      throw new Error('GEMINI_API_KEY is not defined or invalid');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash' });

    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    console.error("AI Time Machine Error:", error);
    if (footprintResult.totalCO2 > 150) {
       return "Dear past self,\n\nI write this from a sweltering summer in 2050. The rivers have dried, and stepping outside without protective gear is dangerous. I wish you had realized back in 2026 that your choices mattered. Please, change your habits before it's too late.\n\n- You, from 2050";
    } else {
       return "Dear past self,\n\nI write this from a beautiful, green 2050. Thanks to the sustainable choices you made back in 2026, we avoided the worst of the climate crisis. Our city is thriving with clean air and abundant nature. Keep up the good work, it truly makes a difference!\n\n- You, from 2050";
    }
  }
};
