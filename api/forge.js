import { GoogleGenAI } from '@google/genai';

// Initialize the SDK. It naturally grabs the GEMINI_API_KEY from Vercel's environment variables.
const ai = new GoogleGenAI();

export default async function handler(req, res) {
  // Only allow secure POST traffic
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'A prompt blueprint is required' });
    }

    // Call Gemini 2.5 Flash securely in the cloud
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    // Send the generated heavy music asset back to the user's browser
    return res.status(200).json({ text: response.text });

  } catch (error) {
    console.error("Iron Vault Gatekeeper Error:", error);
    return res.status(500).json({ error: 'The Forge encountered a system error.' });
  }
}