import { LLMProviderFactory } from './llm-provider';
import { createOpenaiProvider } from './openai-provider';
import { createTestchimpKeyBasedProvider } from './testchimp-key-provider';
import { createTestchimpPatBasedProvider } from './testchimp-pat-provider';
import { createGeminiProvider } from './gemini-provider';
import { createClaudeProvider } from './claude-provider';

const PROVIDER_CONFIG = [
  ['openai', createOpenaiProvider],
  ['testchimp-key', createTestchimpKeyBasedProvider],
  ['testchimp-pat', createTestchimpPatBasedProvider],
  ['gemini', createGeminiProvider],
  ['claude', createClaudeProvider],
] as const;

type ProviderTuple = typeof PROVIDER_CONFIG[number];
export type ProviderName = ProviderTuple[0];

export const LLM_PROVIDER_ORDER: ProviderName[] = PROVIDER_CONFIG.map((entry) => entry[0]) as ProviderName[];

export function getConfiguredProviderFactories(): LLMProviderFactory[] {
  return PROVIDER_CONFIG.map((entry) => entry[1]);
}

export function getConfiguredProviderNames(): ProviderName[] {
  return [...LLM_PROVIDER_ORDER];
}
