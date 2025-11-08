"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGeminiProvider = createGeminiProvider;
const generative_ai_1 = require("@google/generative-ai");
const vision_utils_1 = require("./vision-utils");
const timeout_utils_1 = require("./timeout-utils");
const DEFAULT_GEMINI_MODEL = 'gemini-1.5-flash';
function createGeminiProvider() {
    const apiKey = process.env.GEMINI_API_KEY?.trim();
    const modelId = process.env.GEMINI_MODEL?.trim() || DEFAULT_GEMINI_MODEL;
    const client = apiKey ? new generative_ai_1.GoogleGenerativeAI(apiKey) : null;
    const model = client ? client.getGenerativeModel({ model: modelId }) : null;
    return {
        name: 'gemini',
        canAuthenticate() {
            return Boolean(apiKey);
        },
        async callLLM(request, options) {
            if (!client || !model) {
                throw new Error('Gemini provider cannot authenticate because GEMINI_API_KEY is missing.');
            }
            const vision = (0, vision_utils_1.resolveVisionInput)(request);
            const parts = [{ text: vision.userText }];
            if (vision.image) {
                parts.push({
                    inlineData: {
                        data: vision.image.base64Data,
                        mimeType: vision.image.mediaType,
                    },
                });
            }
            const payload = {
                contents: [
                    {
                        role: 'user',
                        parts,
                    },
                ],
            };
            if (vision.systemPrompt) {
                payload.systemInstruction = vision.systemPrompt;
            }
            const result = await (0, timeout_utils_1.withTimeout)(model.generateContent(payload), options.timeoutMs, 'Gemini request');
            const text = result.response?.text();
            if (!text) {
                throw new Error('Received empty response from Gemini.');
            }
            return text;
        },
    };
}
