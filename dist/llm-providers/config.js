"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LLM_PROVIDER_ORDER = void 0;
exports.getConfiguredProviderFactories = getConfiguredProviderFactories;
exports.getConfiguredProviderNames = getConfiguredProviderNames;
const openai_provider_1 = require("./openai-provider");
const testchimp_key_provider_1 = require("./testchimp-key-provider");
const testchimp_pat_provider_1 = require("./testchimp-pat-provider");
const gemini_provider_1 = require("./gemini-provider");
const claude_provider_1 = require("./claude-provider");
const PROVIDER_CONFIG = [
    ['openai', openai_provider_1.createOpenaiProvider],
    ['testchimp-key', testchimp_key_provider_1.createTestchimpKeyBasedProvider],
    ['testchimp-pat', testchimp_pat_provider_1.createTestchimpPatBasedProvider],
    ['gemini', gemini_provider_1.createGeminiProvider],
    ['claude', claude_provider_1.createClaudeProvider],
];
exports.LLM_PROVIDER_ORDER = PROVIDER_CONFIG.map((entry) => entry[0]);
function getConfiguredProviderFactories() {
    return PROVIDER_CONFIG.map((entry) => entry[1]);
}
function getConfiguredProviderNames() {
    return [...exports.LLM_PROVIDER_ORDER];
}
