export const config = {
    maxDuration: 60
};

export default async function handler(req, res) {
    // Only accept POST requests from your frontend
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const apiKey = process.env.GEMINI_API_KEY; 
        if (!apiKey) {
            return res.status(500).json({ error: 'Server configuration error: Missing API Key.' });
        }

        // 1. Read the explicit model passed by your frontend payload
        const requestedModel = req.body.model || "gemini-1.5-flash";
        
        // 2. Select the correct gateway suffix based on the model target
        let apiAction = ":generateContent";
        if (requestedModel.includes("imagen")) {
            apiAction = ":predict";
        }

        // 3. Construct the exact target URL destination path
        const googleUrl = `https://generativelanguage.googleapis.com/v1beta/models/${requestedModel}${apiAction}?key=${apiKey}`;

        // Forward the payload data to Google exactly as structured using native global fetch
        const googleResponse = await fetch(googleUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body) 
        });

        const data = await googleResponse.json();
        
        // Return the exact status code and data back to your frontend
        return res.status(googleResponse.status).json(data);

    } catch (error) {
        console.error("Serverless Proxy Error:", error);
        return res.status(500).json({ error: 'Failed to process orchestration request.' });
    }
}
