import { LLMRequest } from './llm-provider';
export interface VisionInput {
    systemPrompt?: string;
    userText: string;
    image?: {
        mediaType: string;
        base64Data: string;
    };
}
export declare function resolveVisionInput(request: LLMRequest): VisionInput;
