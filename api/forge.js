export const config = { maxDuration: 60 };

export default async function handler(req, res) {
  // Add this logging to your Vercel deployment logs
  console.log('Incoming Request Method:', req.method);
  console.log('Incoming Request URL:', req.url);
  // Hardened CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Use a strict check
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    console.log('Request Body:', JSON.stringify(req.body)); // Log the body!
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'Missing API Key.' });

    const googleUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    const googleResponse = await fetch(googleUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });

    const responseData = await googleResponse.json();
    return res.status(googleResponse.status).json(responseData);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to process request.' });
  }
}