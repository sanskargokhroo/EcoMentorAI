import { GoogleGenerativeAI } from '@google/generative-ai';

export const analyzeVoiceTranscript = async (transcript: string): Promise<any> => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_actual_api_key_here') {
    throw new Error('GEMINI_API_KEY is not defined or invalid');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `
    You are an AI assistant helping a user calculate their carbon footprint.
    The user spoke the following sentence: "${transcript}"

    Extract the relevant footprint data and return ONLY a JSON object.
    If you cannot find data for a field, omit it.
    
    Possible fields to return:
    - name (string): The user's name if they said it.
    - dailyTravelKm (number): The distance they traveled.
    - transportType (string: "car" | "bike" | "bus" | "train" | "flight"): How they traveled.
    - monthlyElectricityKWh (number): Electricity usage if mentioned.
    - dietType (string: "vegan" | "vegetarian" | "omnivore" | "heavy-meat"): What they ate or their diet.
    - shoppingFrequency (number): Shopping items if mentioned.

    Example Transcript: "I drove my car for 50 kilometers today and had a huge steak."
    Output: { "dailyTravelKm": 50, "transportType": "car", "dietType": "heavy-meat" }

    Format: Pure JSON without markdown formatting.
  `;

  try {
    const result = await model.generateContent(prompt);
    let text = result.response.text();
    
    if (text.startsWith('\`\`\`json')) text = text.substring(7);
    if (text.startsWith('\`\`\`')) text = text.substring(3);
    if (text.endsWith('\`\`\`')) text = text.substring(0, text.length - 3);
    
    return JSON.parse(text.trim());
  } catch (error) {
    console.error("Voice AI Error:", error);
    throw new Error('Failed to parse voice transcript');
  }
};
