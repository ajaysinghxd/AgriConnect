/**
 * AgriConnect — Gemini AI Service
 * Official SDK: @google/generative-ai
 * Exports: generateAIResponse, isGeminiConfigured
 */

const {
    GoogleGenerativeAI
} = require("@google/generative-ai");

const MODEL =
    "gemini-2.5-flash";

const SYSTEM_PROMPT = `You are AgriConnect AI — a specialist farming assistant for the AgriConnect agricultural marketplace.

SCOPE: Answer ONLY agriculture, farming, livestock, and AgriConnect marketplace topics. Politely decline unrelated questions.

EXPERTISE:
- Crop selection by season, soil type, and Indian regions
- Fertilizers (NPK, organic, application timing)
- Irrigation (drip, sprinkler, scheduling, water saving)
- Pest and disease management (IPM, organic controls)
- Tractors, harvesters, drones, equipment buy/rent guidance
- Weather precautions and harvest planning
- Soil health and sustainable practices

STYLE:
- Practical, concise, farmer-friendly language
- Use bullet points for steps when helpful
- Do not invent prices or guaranteed yields
- Recommend local agronomist for severe crop disease`;

let genAIClient = null;

/**
 * Lazy-initialize Gemini SDK client.
 */
function getGenAIClient() {

    const apiKey =
        process.env.GEMINI_API_KEY?.trim();

    if (
        !apiKey ||
        apiKey.includes("PASTE") ||
        apiKey.includes("your_") ||
        apiKey.length < 20
    ) {
        return null;
    }

    if (
        !genAIClient
    ) {

        console.log(
            "[Gemini] Initializing..."
        );

        genAIClient =
            new GoogleGenerativeAI(
                apiKey
            );

        console.log(
            "[Gemini] SDK ready ✅"
        );

    }

    return genAIClient;

}

/**
 * Whether GEMINI_API_KEY is set and valid format.
 */
function isGeminiConfigured() {

    const apiKey =
        process.env.GEMINI_API_KEY?.trim();

    return !!(
        apiKey &&
        !apiKey.includes("PASTE") &&
        !apiKey.includes("your_") &&
        apiKey.length >= 20
    );

}

/**
 * Convert frontend history to Gemini chat format.
 * user -> user, assistant -> model
 */
function mapHistoryToGemini(
    history
) {

    if (
        !Array.isArray(history)
    ) {
        return [];
    }

    return history
        .filter(
            (entry) =>
                entry?.text &&
                (
                    entry.role === "user" ||
                    entry.role === "assistant"
                )
        )
        .slice(-20)
        .map(
            (entry) => ({

                role:
                    entry.role === "assistant"
                        ? "model"
                        : "user",

                parts: [
                    {
                        text:
                            String(entry.text).trim()
                    }
                ]

            })
        );

}

/**
 * Parse SDK / API errors into user-friendly messages.
 */
function normalizeError(
    error
) {

    const msg =
        error?.message ||
        String(error);

    if (
        msg.includes("429") ||
        msg.toLowerCase().includes("quota")
    ) {
        return "Gemini API quota exceeded. Please wait and try again.";
    }

    if (
        msg.includes("403") ||
        msg.includes("401") ||
        msg.includes("API_KEY")
    ) {
        return "Invalid or unauthorized Gemini API key.";
    }

    if (
        msg.includes("404") ||
        msg.includes("not found")
    ) {
        return `Model "${MODEL}" is not available for this API key.`;
    }

    return msg;

}

/**
 * Generate AI farming assistant reply.
 * @param {string} message
 * @param {Array<{role: string, text: string}>} history
 * @returns {Promise<string>}
 */
async function generateAIResponse(
    message,
    history = []
) {

    if (
        !isGeminiConfigured()
    ) {
        throw new Error(
            "GEMINI_API_KEY is missing or invalid in .env"
        );
    }

    const trimmedMessage =
        String(message || "").trim();

    if (
        !trimmedMessage
    ) {
        throw new Error(
            "Message is required"
        );
    }

    if (
        trimmedMessage.length > 2000
    ) {
        throw new Error(
            "Message too long (max 2000 characters)"
        );
    }

    console.log(
        "[Gemini] Model selected:",
        MODEL
    );

    const client =
        getGenAIClient();

    const model =
        client.getGenerativeModel({
            model: MODEL,
            systemInstruction: SYSTEM_PROMPT
        });

    const geminiHistory =
        mapHistoryToGemini(history);

    const timeoutMs = 45000;

    const timeoutPromise =
        new Promise(
            (_, reject) => {

                setTimeout(
                    () => reject(
                        new Error(
                            "AI request timed out. Please try again."
                        )
                    ),
                    timeoutMs
                );

            }
        );

    try {

        const chat =
            model.startChat({
                history: geminiHistory,
                generationConfig: {
                    temperature: 0.65,
                    topP: 0.9,
                    maxOutputTokens: 1024
                }
            });

        const result =
            await Promise.race([
                chat.sendMessage(
                    trimmedMessage
                ),
                timeoutPromise
            ]);

        const reply =
            result.response.text();

        if (
            !reply?.trim()
        ) {
            throw new Error(
                "Empty response from AI"
            );
        }

        console.log(
            "[Gemini] Response success ✅"
        );

        return reply.trim();

    }

    catch (error) {

        console.error(
            "[Gemini] Error ❌",
            error?.message || error
        );

        throw new Error(
            normalizeError(error)
        );

    }

}

module.exports = {
    generateAIResponse,
    isGeminiConfigured
};
