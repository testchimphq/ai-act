"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveTestchimpEndpoint = resolveTestchimpEndpoint;
exports.performTestchimpRequest = performTestchimpRequest;
const axios_1 = __importDefault(require("axios"));
const TESTCHIMP_ENDPOINT_PATH = '/localagent/call_llm';
const DEFAULT_TESTCHIMP_BASE_URL = 'https://featureservice.testchimp.io';
function resolveTestchimpEndpoint() {
    const baseUrl = process.env.TESTCHIMP_BACKEND_URL?.trim() || DEFAULT_TESTCHIMP_BASE_URL;
    return `${baseUrl}${TESTCHIMP_ENDPOINT_PATH}`;
}
async function performTestchimpRequest(headers, request, timeoutMs) {
    const payload = {
        system_prompt: request.systemPrompt,
        user_prompt: request.userPrompt,
    };
    if (request.image) {
        payload['image_url'] = request.image;
    }
    const response = await axios_1.default.post(resolveTestchimpEndpoint(), payload, {
        headers,
        timeout: timeoutMs,
    });
    const content = response.data?.answer;
    if (typeof content !== 'string') {
        throw new Error('TestChimp backend returned an unexpected response format.');
    }
    return content;
}
