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

        console.log("=== Incoming Request Body ===", JSON.stringify(req.body));

        // 1. Fallback default to modern production-grade flash layout
        let requestedModel = req.body.model || "gemini-2.5-flash";
        
        // 2. AUTO-UPGRADE INTERCEPT: If the frontend sends the retired 1.5 string,
        // we transform it instantly so it never hits Google dead.
        if (requestedModel === "gemini-1.5-flash") {
            requestedModel = "gemini-2.5-flash";
        }

        let apiAction = ":generateContent";
        if (requestedModel.includes("imagen")) {
            apiAction = ":generateImages"; 
        }

        const googleUrl = `https://generativelanguage.googleapis.com/v1beta/models/${requestedModel}${apiAction}?key=${apiKey}`;

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
