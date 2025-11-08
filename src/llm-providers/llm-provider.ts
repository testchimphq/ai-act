export interface LLMRequest {
  systemPrompt: string;
  userPrompt: string;
  image?: string;
}

export interface LLMCallOptions {
  timeoutMs: number;
}

export interface LLMProvider {
  readonly name: string;

  canAuthenticate(): boolean;

  callLLM(request: LLMRequest, options: LLMCallOptions): Promise<string>;
}

export type LLMProviderFactory = () => LLMProvider;
