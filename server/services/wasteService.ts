import { GoogleGenerativeAI } from '@google/generative-ai';

export const analyzeWasteImage = async (base64Image: string, mimeType: string): Promise<any> => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_actual_api_key_here') {
    throw new Error('GEMINI_API_KEY is not defined or invalid');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `
    Analyze this image of a waste item. 
    Identify what the item is and determine the best way to dispose of it.
    Return ONLY a JSON object with the following fields:
    - item (string): A short name for the identified item (e.g., "Plastic Water Bottle").
    - category (string): Must be exactly one of: "Recycle", "Compost", "E-Waste", or "Trash".
    - explanation (string): A 1-2 sentence explanation of why it goes in that category and any preparation needed (e.g., "Rinse before recycling").

    Format: Pure JSON without markdown formatting.
  `;

  const base64Data = base64Image.split(',')[1] || base64Image;

  const imageParts = [
    {
      inlineData: {
        data: base64Data,
        mimeType
      },
    },
  ];

  try {
    const result = await model.generateContent([prompt, ...imageParts]);
    let text = result.response.text();
    
    if (text.startsWith('\`\`\`json')) text = text.substring(7);
    if (text.startsWith('\`\`\`')) text = text.substring(3);
    if (text.endsWith('\`\`\`')) text = text.substring(0, text.length - 3);
    
    return JSON.parse(text.trim());
  } catch (error) {
    console.error("Waste AI Error:", error);
    throw new Error('Failed to analyze waste image');
  }
};
