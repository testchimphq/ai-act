import { AiActionResult } from './types';
import { LLMRequest } from './llm-providers/llm-provider';
declare function isDebugEnvEnabled(): boolean;
declare function debugLog(...messages: unknown[]): void;
type AiClientRequest = LLMRequest;
export declare function callAiAction(request: AiClientRequest): Promise<AiActionResult>;
export { isDebugEnvEnabled as isDebugEnabled, debugLog };
export declare function getNavigationTimeout(): number;
export declare function getCommandTimeout(): number;
