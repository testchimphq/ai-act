import { LLMRequest } from './llm-provider';
import { parseImageData } from './image-utils';

export interface VisionInput {
  systemPrompt?: string;
  userText: string;
  image?: {
    mediaType: string;
    base64Data: string;
  };
}

export function resolveVisionInput(request: LLMRequest): VisionInput {
  return {
    systemPrompt: request.systemPrompt || undefined,
    userText: request.userPrompt,
    image: parseImageData(request.image),
  };
}
