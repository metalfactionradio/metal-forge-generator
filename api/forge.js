export default async function handler(req, res) {
    // Block anything that isn't a secure POST request
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { contents, systemInstruction, generationConfig } = req.body;
        
        // Pulls the hidden API key safely from Vercel's environment vault
        const apiKey = process.env.GEMINI_API_KEY; 
        
        if (!apiKey) {
            return res.status(500).json({ error: 'Server configuration error: Missing API Key.' });
        }

        // Forward the payload directly to Google's endpoint from the cloud
        const googleResponse = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents, systemInstruction, generationConfig })
            }
        );

        const data = await googleResponse.json();
        return res.status(200).json(data);

    } catch (error) {
        console.error("Serverless Shield Error:", error);
        return res.status(500).json({ error: 'Failed to process orchestration request.' });
    }
}
