export const maxDuration = 60; 

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const apiKey = process.env.GEMINI_API_KEY; 
        
        if (!apiKey) {
            return res.status(500).json({ error: 'Server configuration error: Missing API Key.' });
        }

        // Shoot the exact frontend payload directly to Google completely unaltered
        const googleResponse = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(req.body) 
            }
        );

        const data = await googleResponse.json();
// PASS TRUE STATUS CODES SO FETCHWITHRETRY CAN RUN AUTOMATIC RETRIES
return res.status(googleResponse.status).json(data);

    } catch (error) {
        console.error("Serverless Shield Error:", error);
        return res.status(500).json({ error: 'Failed to process orchestration request.' });
    }
}
