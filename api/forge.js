export const config = {
  maxDuration: 60
};

export default async function handler(req, res) {
  // CORS Headers to allow your Android app to connect
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Ensure only POST requests are processed
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Missing API Key.' });
    }

    let requestedModel = req.body.model || "gemini-2.5-flash";
    if (requestedModel === "gemini-1.5-flash") {
      requestedModel = "gemini-2.5-flash";
    }

    const cleanBody = { ...req.body };
    delete cleanBody.model;

    const googleUrl = `https://generativelanguage.googleapis.com/v1beta/models/${requestedModel}:generateContent?key=${apiKey}`;

    const googleResponse = await fetch(googleUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cleanBody)
    });

    const responseData = await googleResponse.json();
    return res.status(googleResponse.status).json(responseData);
    
  } catch (error) {
    console.error("Serverless Proxy Error:", error);
    return res.status(500).json({ error: 'Failed to process request.' });
  }
}