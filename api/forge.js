export const config = {
    maxDuration: 60
};

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

    try {
        const apiKey = process.env.GEMINI_API_KEY;
        const { model, prompt, platform } = req.body; // Added 'platform'

        // Define platform-specific prompt modifiers
        const platformInstructions = {
            suno: "You are a Suno AI expert. Format the output with clear structural tags like [Verse], [Chorus], [Bridge], and [Outro]. Use descriptive musical genre tags.",
            udio: "You are an Udio AI expert. Focus on technical production details, sonic texture, and high-fidelity mastering descriptors.",
            stable: "You are a Sound Design AI expert. Focus on temporal progression, atmospheric build-up, and granular sound qualities."
        };

        // Prepare the system-injected prompt
        const instruction = platformInstructions[platform] || "Provide a professional, creative prompt.";
        const finalPrompt = `${instruction}\n\nUser Request: ${prompt}`;

        // Construct the payload for Gemini
        const payload = {
            contents: [{ role: "user", parts: [{ text: finalPrompt }] }]
        };

        const googleUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

        const response = await fetch(googleUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        return res.status(response.status).json(data);
    } catch (error) {
        return res.status(500).json({ error: 'Forge Processing Error' });
    }
}
