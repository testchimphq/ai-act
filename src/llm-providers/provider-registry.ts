import { getConfiguredProviderFactories, getConfiguredProviderNames } from './config';
import { LLMProvider } from './llm-provider';

let cachedProvider: LLMProvider | null = null;

export function resolveActiveLLMProvider(): LLMProvider {
  if (cachedProvider) {
    return cachedProvider;
  }

  for (const factory of getConfiguredProviderFactories()) {
    const provider = factory();
    if (provider.canAuthenticate()) {
      cachedProvider = provider;
      return provider;
    }
  }

  const configuredNames = getConfiguredProviderNames().join(', ');
  throw new Error(
    `Missing authentication. Provide credentials for at least one configured LLM provider (${configuredNames}).`,
  );
}

export function resetProviderCacheForTesting(): void {
  cachedProvider = null;
}
