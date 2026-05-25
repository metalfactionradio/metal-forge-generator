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

        // 1. Safely extract the model parameter for the endpoint path mapping
        let requestedModel = req.body.model || "gemini-2.5-flash";
        if (requestedModel === "gemini-1.5-flash") {
            requestedModel = "gemini-2.5-flash";
        }

        // 2. CRITICAL CLEANUP: Clone the body and purge the strict 'model' property
        // so Google's validation gate doesn't reject it as an unexpected field.
        const cleanBody = { ...req.body };
        delete cleanBody.model;

        // 3. Intelligently route actions based on target architectures
        let apiAction = ":generateContent";
        if (requestedModel.includes("imagen")) {
            apiAction = ":generateImages";
        }

        const googleUrl = `https://generativelanguage.googleapis.com/v1beta/models/${requestedModel}${apiAction}?key=${apiKey}`;

        console.log("=== Constructed Google URL ===", googleUrl.replace(apiKey, "HIDDEN_KEY"));

        const googleResponse = await fetch(googleUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cleanBody) // Sends only clean, endpoint-compliant criteria
        });

        const responseText = await googleResponse.text();
        let responseData;
        
        try {
            responseData = JSON.parse(responseText);
        } catch (e) {
            console.error("Google API non-JSON output:", responseText);
            return res.status(googleResponse.status).json({ 
                error: "Google API transmission failure", 
                details: responseText 
            });
        }
        
        return res.status(googleResponse.status).json(responseData);

    } catch (error) {
        console.error("Serverless Proxy Error:", error);
        return res.status(500).json({ error: 'Failed to process orchestration request.' });
    }
}
