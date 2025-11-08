"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveActiveLLMProvider = resolveActiveLLMProvider;
exports.resetProviderCacheForTesting = resetProviderCacheForTesting;
const config_1 = require("./config");
let cachedProvider = null;
function resolveActiveLLMProvider() {
    if (cachedProvider) {
        return cachedProvider;
    }
    for (const factory of (0, config_1.getConfiguredProviderFactories)()) {
        const provider = factory();
        if (provider.canAuthenticate()) {
            cachedProvider = provider;
            return provider;
        }
    }
    const configuredNames = (0, config_1.getConfiguredProviderNames)().join(', ');
    throw new Error(`Missing authentication. Provide credentials for at least one configured LLM provider (${configuredNames}).`);
}
function resetProviderCacheForTesting() {
    cachedProvider = null;
}
