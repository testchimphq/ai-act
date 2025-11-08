import Anthropic from '@anthropic-ai/sdk';
import { LLMCallOptions, LLMProvider, LLMRequest } from './llm-provider';
import { resolveVisionInput } from './vision-utils';

const DEFAULT_CLAUDE_MODEL = 'claude-3-sonnet-20240229';
const DEFAULT_CLAUDE_MAX_TOKENS = 1024;

type ClaudeImageMediaType = 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp';

type ClaudeContentBlock =
  | { type: 'text'; text: string }
  | { type: 'image'; source: { type: 'base64'; media_type: ClaudeImageMediaType; data: string } };

function resolveClaudeMaxTokens(): number {
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

function toClaudeMediaType(mediaType: string): ClaudeImageMediaType {
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

export function createClaudeProvider(): LLMProvider {
  const apiKey = process.env.CLAUDE_API_KEY?.trim();
  const modelId = process.env.CLAUDE_MODEL?.trim() || DEFAULT_CLAUDE_MODEL;
  const maxTokens = resolveClaudeMaxTokens();
  const client = apiKey ? new Anthropic({ apiKey }) : null;

  return {
    name: 'claude',

    canAuthenticate(): boolean {
      return Boolean(apiKey);
    },

    async callLLM(request: LLMRequest, options: LLMCallOptions): Promise<string> {
      if (!client) {
        throw new Error('Claude provider cannot authenticate because CLAUDE_API_KEY is missing.');
      }

      const vision = resolveVisionInput(request);
      const content: ClaudeContentBlock[] = [{ type: 'text', text: vision.userText }];
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

      const response = await client.messages.create(
        {
          model: modelId,
          max_tokens: maxTokens,
          system: vision.systemPrompt || undefined,
          messages: [
            {
              role: 'user',
              content,
            },
          ],
        },
        { timeout: options.timeoutMs },
      );

      const textPart = response.content.find((part) => part.type === 'text') as
        | { type: 'text'; text: string }
        | undefined;
      if (!textPart?.text) {
        throw new Error('Received empty response from Claude.');
      }

      return textPart.text;
    },
  };
}
