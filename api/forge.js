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

        // 1. Capture the model target from the incoming frontend canvas payload
        let requestedModel = req.body.model || "gemini-2.5-flash";
        
        if (requestedModel === "gemini-1.5-flash") {
            requestedModel = "gemini-2.5-flash";
        }

        // 2. DYNAMIC ROUTING BRIDGE: Shift endpoints based on asset type
        let apiAction = ":generateContent";
        if (requestedModel.includes("imagen")) {
            apiAction = ":generateImages";
        }

        // 3. Assemble the exact destination path
        const googleUrl = `https://generativelanguage.googleapis.com/v1beta/models/${requestedModel}${apiAction}?key=${apiKey}`;

        console.log("=== Constructed Google URL ===", googleUrl.replace(apiKey, "HIDDEN_KEY"));

        const googleResponse = await fetch(googleUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body)
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
