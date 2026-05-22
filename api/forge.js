export default async function handler(req, res) {
  // Only allow secure POST traffic
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { prompt } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!prompt) {
      return res.status(400).json({ error: 'A prompt blueprint is required' });
    }

    // Direct, standard browser-native cloud call to the Gemini 2.5 Flash API
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const googleResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await googleResponse.json();
    
    // Safely extract the generated heavy metal lyrics/prompt asset
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || "The Forge returned an empty response.";

    return res.status(200).json({ text: generatedText });

  } catch (error) {
    console.error("Iron Vault Gatekeeper Error:", error);
    return res.status(500).json({ error: 'The Forge encountered a system error.' });
  }
}
