"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOpenaiProvider = createOpenaiProvider;
const openai_1 = __importDefault(require("openai"));
const DEFAULT_OPENAI_MODEL = 'gpt-5-mini';
function buildUserContent(request) {
    if (!request.image) {
        return request.userPrompt;
    }
    return [
        { type: 'text', text: request.userPrompt },
        { type: 'image_url', image_url: { url: request.image } },
    ];
}
function createOpenaiProvider() {
    const apiKey = process.env.OPENAI_API_KEY?.trim();
    const model = process.env.OPENAI_MODEL?.trim() || DEFAULT_OPENAI_MODEL;
    const client = apiKey ? new openai_1.default({ apiKey }) : null;
    return {
        name: 'openai',
        canAuthenticate() {
            return Boolean(apiKey);
        },
        async callLLM(request, options) {
            if (!client) {
                throw new Error('OpenAI provider cannot authenticate because OPENAI_API_KEY is missing.');
            }
            const response = await client.chat.completions.create({
                model,
                response_format: { type: 'json_object' },
                messages: [
                    { role: 'system', content: request.systemPrompt },
                    {
                        role: 'user',
                        content: buildUserContent(request),
                    },
                ],
            }, { timeout: options.timeoutMs });
            const content = response.choices[0]?.message?.content;
            if (!content) {
                throw new Error('Received empty response from OpenAI.');
            }
            return content;
        },
    };
}
