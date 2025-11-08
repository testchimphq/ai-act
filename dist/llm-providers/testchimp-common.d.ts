import { LLMRequest } from './llm-provider';
export declare function resolveTestchimpEndpoint(): string;
export interface TestchimpHeaders {
    [key: string]: string;
}
export declare function performTestchimpRequest(headers: TestchimpHeaders, request: LLMRequest, timeoutMs: number): Promise<string>;
