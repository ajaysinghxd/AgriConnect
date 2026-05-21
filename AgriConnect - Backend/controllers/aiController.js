/**
 * AgriConnect — AI Chat Controller
 */

const {
    generateAIResponse,
    isGeminiConfigured
} = require("../services/geminiService");

/**
 * POST /api/ai/chat
 */
const chatWithAI =
    async (req, res) => {

    try {

        console.log(
            "[AI] POST /api/ai/chat"
        );

        const {
            message,
            history = []
        } = req.body;

        if (
            !message ||
            !String(message).trim()
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Message is required"
            });

        }

        if (
            !isGeminiConfigured()
        ) {

            console.error(
                "[AI] Gemini not configured"
            );

            return res.status(503).json({
                success: false,
                message:
                    "AI assistant is not configured. Set GEMINI_API_KEY in .env"
            });

        }

        const reply =
            await generateAIResponse(
                message,
                history
            );

        console.log(
            "[AI] Chat success ✅"
        );

        return res.json({
            success: true,
            reply
        });

    }

    catch (error) {

        console.error(
            "[AI] Chat failed ❌",
            error.message
        );

        const status =
            error.message?.includes("configured") ||
            error.message?.includes("API key")
                ? 503
                : 500;

        return res.status(status).json({
            success: false,
            message:
                error.message ||
                "AI assistant is temporarily unavailable"
        });

    }

};

/**
 * GET /api/ai/status
 */
const getAIStatus =
    (req, res) => {

    const configured =
        isGeminiConfigured();

    console.log(
        "[AI] GET /api/ai/status",
        configured
    );

    return res.json({
        configured,
        online: configured
    });

};

module.exports = {
    chatWithAI,
    getAIStatus
};
