export const config = { maxDuration: 60 };

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'Missing API Key.' });

    const { title, styleTags, theme } = req.body;

    const imagePrompt = `Album cover artwork for a song titled "${title}". 
Musical style: ${styleTags}. 
Theme and mood: ${theme || 'dramatic and atmospheric'}.
Style: Professional album cover art, cinematic lighting, highly detailed, 
no text, no words, no letters, square format, dramatic composition, 
visually striking, suitable for music streaming platforms.`;

    // Image generation requires v1alpha API endpoint
    const googleUrl = `https://generativelanguage.googleapis.com/v1alpha/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`;

    const payload = {
      contents: [{ parts: [{ text: imagePrompt }] }],
      generationConfig: { responseModalities: ["IMAGE", "TEXT"] }
    };

    const googleResponse = await fetch(googleUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const responseData = await googleResponse.json();

    if (!googleResponse.ok) {
      console.error('Gemini image error:', JSON.stringify(responseData));
      return res.status(googleResponse.status).json({ 
        error: 'Image generation failed.', 
        details: responseData 
      });
    }

    const parts = responseData?.candidates?.[0]?.content?.parts || [];
    const imagePart = parts.find(p => p.inlineData);

    if (!imagePart) {
      console.error('No image in response. Parts:', JSON.stringify(parts));
      return res.status(500).json({ error: 'No image returned from Gemini.', parts });
    }

    return res.status(200).json({
      imageData: imagePart.inlineData.data,
      mimeType: imagePart.inlineData.mimeType
    });

  } catch (error) {
    console.error('Artwork generation error:', error);
    return res.status(500).json({ error: error.message });
  }
}
