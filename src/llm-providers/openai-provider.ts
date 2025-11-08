import OpenAI from 'openai';
import { LLMCallOptions, LLMProvider, LLMRequest } from './llm-provider';

const DEFAULT_OPENAI_MODEL = 'gpt-5-mini';

type UserMessagePart =
  | { type: 'text'; text: string }
  | { type: 'image_url'; image_url: { url: string } };

function buildUserContent(request: LLMRequest): string | UserMessagePart[] {
  if (!request.image) {
    return request.userPrompt;
  }

  return [
    { type: 'text', text: request.userPrompt },
    { type: 'image_url', image_url: { url: request.image } },
  ];
}

export function createOpenaiProvider(): LLMProvider {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  const model = process.env.OPENAI_MODEL?.trim() || DEFAULT_OPENAI_MODEL;
  const client = apiKey ? new OpenAI({ apiKey }) : null;

  return {
    name: 'openai',

    canAuthenticate(): boolean {
      return Boolean(apiKey);
    },

    async callLLM(request: LLMRequest, options: LLMCallOptions): Promise<string> {
      if (!client) {
        throw new Error('OpenAI provider cannot authenticate because OPENAI_API_KEY is missing.');
      }

      const response = await client.chat.completions.create(
        {
          model,
          response_format: { type: 'json_object' },
          messages: [
            { role: 'system', content: request.systemPrompt },
            {
              role: 'user',
              content: buildUserContent(request),
            },
          ],
        },
        { timeout: options.timeoutMs },
      );

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('Received empty response from OpenAI.');
      }

      return content;
    },
  };
}
