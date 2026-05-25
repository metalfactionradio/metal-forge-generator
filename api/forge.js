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

        // DIAGNOSTIC LOG 1: See exactly what your frontend is passing over
        console.log("=== Incoming Request Body ===", JSON.stringify(req.body));

        const requestedModel = req.body.model || "gemini-1.5-flash";
        
        // Automatically switch to the correct Developer API method if an image model is called
        let apiAction = ":generateContent";
        if (requestedModel.includes("imagen")) {
            apiAction = ":generateImages"; 
        }

        const googleUrl = `https://generativelanguage.googleapis.com/v1beta/models/${requestedModel}${apiAction}?key=${apiKey}`;

        // DIAGNOSTIC LOG 2: See the exact URL pathway being sent to Google
        console.log("=== Constructed Google URL ===", googleUrl.replace(apiKey, "HIDDEN_KEY"));

        const googleResponse = await fetch(googleUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body) 
        });

        const data = await googleResponse.json();
        return res.status(googleResponse.status).json(data);

    } catch (error) {
        console.error("Serverless Proxy Error:", error);
        return res.status(500).json({ error: 'Failed to process orchestration request.' });
    }
}
