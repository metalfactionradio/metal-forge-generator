// Traditional CommonJS configuration for standard Vercel vanilla environments

async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const apiKey = process.env.GEMINI_API_KEY; 
        
        if (!apiKey) {
            return res.status(500).json({ error: 'Server configuration error: Missing API Key.' });
        }

        // 1. Dynamically read the model requested by the frontend layout payload
        const requestedModel = req.body.model || "gemini-1.5-flash";
        
        // 2. Automatically select the correct endpoint action based on model type
        let apiAction = ":generateContent";
        if (requestedModel.includes("imagen")) {
            apiAction = ":predict";
        }

        // 3. Construct the perfect target URL for Google Cloud's gateway
        const googleUrl = `https://generativelanguage.googleapis.com/v1beta/models/${requestedModel}${apiAction}?key=${apiKey}`;

        console.log(`[ORCHESTRATION] Routing payload cleanly to: ${requestedModel} via ${apiAction}`);

        // Forward the payload exactly as the frontend structured it
        const googleResponse = await fetch(googleUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body) 
        });

        const data = await googleResponse.json();
        
        // PASS TRUE STATUS CODES SO FETCHWITHRETRY CAN RUN AUTOMATIC RETRIES
        return res.status(googleResponse.status).json(data);

    } catch (error) {
        console.error("Serverless Shield Error:", error);
        return res.status(500).json({ error: 'Failed to process orchestration request.' });
    }
}

// Map exports to match traditional Node runtime definitions 
handler.maxDuration = 60;
module.exports = handler;
