import { GoogleGenerativeAI } from '@google/generative-ai';

export const analyzeProductEco = async (productName: string, category: string): Promise<unknown> => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_actual_api_key_here') {
    throw new Error('GEMINI_API_KEY is not defined or invalid');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `
    Analyze the carbon footprint of the following product:
    Product: ${productName}
    Category: ${category}

    Return ONLY a JSON object with:
    - footprint (string): Estimated carbon footprint per kg or item (e.g., "~3.2kg CO2/kg").
    - alternative (string): A greener, eco-friendly alternative.
    - reasoning (string): A short 1-sentence explanation of why the alternative is better.
    Format: Pure JSON, no markdown.
  `;

  try {
    const result = await model.generateContent(prompt);
    let text = result.response.text();
    
    if (text.startsWith('\`\`\`json')) text = text.substring(7);
    if (text.startsWith('\`\`\`')) text = text.substring(3);
    if (text.endsWith('\`\`\`')) text = text.substring(0, text.length - 3);
    
    return JSON.parse(text.trim());
  } catch (error) {
    console.error("Product AI Error:", error);
    throw new Error('Failed to analyze product');
  }
};
