import { GoogleGenAI } from "@google/genai";
import { LocationType } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateWindWhisper = async (location: LocationType): Promise<string> => {
  try {
    const prompt = `
      You are the "Wind Shepherd" of a surreal, minimalist world called "Sky Realm".
      The visual theme is: Breathing, Boundless, Crystalline, Time-Eroded.
      
      The user is currently standing at: ${location}.
      
      Describe what the wind whispers to them. 
      Keep it short (under 40 words). 
      Style: Poetic, lonely but beautiful, emphasizing the scale of the giant eroded white ruins and the flow of light.
      Do not be conversational. Just the whisper of the world.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 }, // Disable thinking for faster poetic bursts
      }
    });

    return response.text || "...the wind is silent...";
  } catch (error) {
    console.error("Failed to hear the wind:", error);
    return "The wind howls, but the words are lost.";
  }
};