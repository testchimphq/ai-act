import axios from 'axios';
import { LLMRequest } from './llm-provider';

const TESTCHIMP_ENDPOINT_PATH = '/localagent/call_llm';
const DEFAULT_TESTCHIMP_BASE_URL = 'https://featureservice.testchimp.io';

export function resolveTestchimpEndpoint(): string {
  const baseUrl = process.env.TESTCHIMP_BACKEND_URL?.trim() || DEFAULT_TESTCHIMP_BASE_URL;
  return `${baseUrl}${TESTCHIMP_ENDPOINT_PATH}`;
}

export interface TestchimpHeaders {
  [key: string]: string;
}

export async function performTestchimpRequest(
  headers: TestchimpHeaders,
  request: LLMRequest,
  timeoutMs: number,
): Promise<string> {
  const payload: Record<string, unknown> = {
    system_prompt: request.systemPrompt,
    user_prompt: request.userPrompt,
  };

  if (request.image) {
    payload['image_url'] = request.image;
  }

  const response = await axios.post(resolveTestchimpEndpoint(), payload, {
    headers,
    timeout: timeoutMs,
  });

  const content = response.data?.answer;
  if (typeof content !== 'string') {
    throw new Error('TestChimp backend returned an unexpected response format.');
  }

  return content;
}
