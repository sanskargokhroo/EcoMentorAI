import { GoogleGenerativeAI } from '@google/generative-ai';

export const analyzeReceipt = async (base64Image: string, mimeType: string): Promise<any> => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_actual_api_key_here') {
    throw new Error('GEMINI_API_KEY is not defined or invalid');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `
    Analyze this image of a receipt, bill, or invoice. 
    Extract data to help calculate a carbon footprint. 
    Return ONLY a JSON object containing the fields you can confidently identify. 
    If you cannot find data for a field, omit it.
    
    Possible fields to return:
    - monthlyElectricityKWh (number): If it's an electricity bill, extract the total kWh usage.
    - dailyTravelKm (number): If it's a gas/petrol receipt, estimate km traveled assuming 15km/liter.
    - transportType (string: "car" | "bike" | "bus" | "train" | "flight"): If it's a transport ticket.
    - shoppingFrequency (number): If it's a grocery receipt, estimate the number of physical items.
    
    Format: Pure JSON without markdown formatting.
  `;

  // Gemini requires the base64 string without the data URL prefix
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
    console.error("Vision AI Error:", error);
    throw new Error('Failed to analyze image');
  }
};
