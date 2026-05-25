export const config = {
    maxDuration: 60
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const apiKey = process.env.GEMINI_API_KEY; 
        if (!apiKey) {
            return res.status(500).json({ error: 'Server configuration error: Missing API Key.' });
        }

        let requestedModel = req.body.model || "gemini-2.5-flash";
        
        if (requestedModel === "gemini-1.5-flash") {
            requestedModel = "gemini-2.5-flash";
        }

        // Seamless routing for developer-tier text, audio, and image models
        const googleUrl = `https://generativelanguage.googleapis.com/v1beta/models/${requestedModel}:generateContent?key=${apiKey}`;

        const googleResponse = await fetch(googleUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body)
        });

        // CRASH ARMOR: Safely extract response text first to handle non-JSON failures gracefully
        const responseText = await googleResponse.text();
        let responseData;
        
        try {
            responseData = JSON.parse(responseText);
        } catch (e) {
            console.error("Google API returned non-JSON string data payload:", responseText);
            return res.status(googleResponse.status).json({ 
                error: "Google API non-JSON transmission failure", 
                details: responseText 
            });
        }
        
        return res.status(googleResponse.status).json(responseData);

    } catch (error) {
        console.error("Serverless Proxy Error:", error);
        return res.status(500).json({ error: 'Failed to process orchestration request.' });
    }
}
