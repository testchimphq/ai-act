"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTestchimpKeyBasedProvider = createTestchimpKeyBasedProvider;
const testchimp_common_1 = require("./testchimp-common");
function createTestchimpKeyBasedProvider() {
    const apiKey = process.env.TESTCHIMP_API_KEY?.trim();
    const projectId = process.env.TESTCHIMP_PROJECT_ID?.trim();
    return {
        name: 'testchimp-key',
        canAuthenticate() {
            return Boolean(apiKey && projectId);
        },
        async callLLM(request, options) {
            if (!apiKey || !projectId) {
                throw new Error('TestChimp key-based provider cannot authenticate because TESTCHIMP_API_KEY or TESTCHIMP_PROJECT_ID is missing.');
            }
            const headers = {
                'TestChimp-Api-Key': apiKey,
                'project-id': projectId,
            };
            return (0, testchimp_common_1.performTestchimpRequest)(headers, request, options.timeoutMs);
        },
    };
}
