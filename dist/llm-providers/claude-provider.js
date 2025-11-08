"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createClaudeProvider = createClaudeProvider;
const sdk_1 = __importDefault(require("@anthropic-ai/sdk"));
const vision_utils_1 = require("./vision-utils");
const DEFAULT_CLAUDE_MODEL = 'claude-3-sonnet-20240229';
const DEFAULT_CLAUDE_MAX_TOKENS = 1024;
function resolveClaudeMaxTokens() {
    const raw = process.env.CLAUDE_MAX_TOKENS?.trim();
    if (!raw) {
        return DEFAULT_CLAUDE_MAX_TOKENS;
    }
    const parsed = Number(raw);
    if (!Number.isFinite(parsed) || parsed <= 0) {
        return DEFAULT_CLAUDE_MAX_TOKENS;
    }
    return Math.floor(parsed);
}
function toClaudeMediaType(mediaType) {
    switch (mediaType) {
        case 'image/png':
        case 'image/gif':
        case 'image/webp':
            return mediaType;
        case 'image/jpeg':
        case 'image/jpg':
            return 'image/jpeg';
        default:
            return 'image/jpeg';
    }
}
function createClaudeProvider() {
    const apiKey = process.env.CLAUDE_API_KEY?.trim();
    const modelId = process.env.CLAUDE_MODEL?.trim() || DEFAULT_CLAUDE_MODEL;
    const maxTokens = resolveClaudeMaxTokens();
    const client = apiKey ? new sdk_1.default({ apiKey }) : null;
    return {
        name: 'claude',
        canAuthenticate() {
            return Boolean(apiKey);
        },
        async callLLM(request, options) {
            if (!client) {
                throw new Error('Claude provider cannot authenticate because CLAUDE_API_KEY is missing.');
            }
            const vision = (0, vision_utils_1.resolveVisionInput)(request);
            const content = [{ type: 'text', text: vision.userText }];
            if (vision.image) {
                content.push({
                    type: 'image',
                    source: {
                        type: 'base64',
                        media_type: toClaudeMediaType(vision.image.mediaType),
                        data: vision.image.base64Data,
                    },
                });
            }
            const response = await client.messages.create({
                model: modelId,
                max_tokens: maxTokens,
                system: vision.systemPrompt || undefined,
                messages: [
                    {
                        role: 'user',
                        content,
                    },
                ],
            }, { timeout: options.timeoutMs });
            const textPart = response.content.find((part) => part.type === 'text');
            if (!textPart?.text) {
                throw new Error('Received empty response from Claude.');
            }
            return textPart.text;
        },
    };
}
