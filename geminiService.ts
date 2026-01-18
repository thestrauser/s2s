
import { GoogleGenAI } from "@google/genai";

// Initialize the Google GenAI client with the API key from environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateBandBio = async (bandName: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Write a high-energy, funky, and professional 100-word introduction for a Red Hot Chili Peppers tribute band named "${bandName}". Capture the California funk-rock vibe, mention the energy of flea and the soul of Kiedis. Use rock-and-roll terminology.`,
    });
    return response.text || "Soul To Squeeze is bringing the California funk to your town. Stay tuned!";
  } catch (error) {
    console.error("Gemini bio generation failed:", error);
    return "Error generating bio. Please write your own soul-squeezing intro!";
  }
};

export const generateBandPoster = async (prompt: string): Promise<string | null> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { text: `A high-energy, artistic rock band poster for a Red Hot Chili Peppers tribute band. Style: Grungy, 90s alternative rock, vibrant reds and blacks, graffiti elements, psychedelic funk vibes. Subject: ${prompt}` }
        ]
      }
    });

    // Iterate through candidates and parts to find the generated image data.
    if (response.candidates && response.candidates[0] && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    return null;
  } catch (error) {
    console.error("Image generation failed:", error);
    return null;
  }
};