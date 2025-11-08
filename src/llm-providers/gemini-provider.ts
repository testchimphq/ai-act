
import { GoogleGenerativeAI } from '@google/generative-ai';
import type { GenerateContentRequest, Part } from '@google/generative-ai/dist/types';
import { LLMCallOptions, LLMProvider, LLMRequest } from './llm-provider';
import { resolveVisionInput } from './vision-utils';
import { withTimeout } from './timeout-utils';

const DEFAULT_GEMINI_MODEL = 'gemini-1.5-flash';

export function createGeminiProvider(): LLMProvider {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  const modelId = process.env.GEMINI_MODEL?.trim() || DEFAULT_GEMINI_MODEL;
  const client = apiKey ? new GoogleGenerativeAI(apiKey) : null;
  const model = client ? client.getGenerativeModel({ model: modelId }) : null;

  return {
    name: 'gemini',

    canAuthenticate(): boolean {
      return Boolean(apiKey);
    },

    async callLLM(request: LLMRequest, options: LLMCallOptions): Promise<string> {
      if (!client || !model) {
        throw new Error('Gemini provider cannot authenticate because GEMINI_API_KEY is missing.');
      }

      const vision = resolveVisionInput(request);
      const parts: Part[] = [{ text: vision.userText }];
      if (vision.image) {
        parts.push({
          inlineData: {
            data: vision.image.base64Data,
            mimeType: vision.image.mediaType,
          },
        });
      }

      const payload: GenerateContentRequest = {
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

      const result = await withTimeout(model.generateContent(payload), options.timeoutMs, 'Gemini request');
      const text = result.response?.text();
      if (!text) {
        throw new Error('Received empty response from Gemini.');
      }
      return text;
    },
  };
}
