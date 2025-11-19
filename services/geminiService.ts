import { GoogleGenAI } from "@google/genai";

// In a real app, this comes from process.env.API_KEY
// For this demo, we assume it's available.
const API_KEY = process.env.API_KEY || ''; 

export const generateOfferDescription = async (title: string, category: string): Promise<string> => {
  if (!API_KEY) {
    console.warn("Gemini API Key missing");
    return "Please configure your API Key to use AI features. For now: This is a placeholder description.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Write a professional, compelling, and concise (max 50 words) description for a service offered by an Insurance Vendor.
      
      Service Title: ${title}
      Category: ${category}
      
      Tone: Professional, High-Converting.`,
    });

    return response.text || "Could not generate description.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error generating description. Please try again.";
  }
};
