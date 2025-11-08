"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTestchimpPatBasedProvider = createTestchimpPatBasedProvider;
const testchimp_common_1 = require("./testchimp-common");
function createTestchimpPatBasedProvider() {
    const userAuthKey = process.env.TESTCHIMP_USER_AUTH_KEY?.trim();
    const userMail = process.env.TESTCHIMP_USER_MAIL?.trim();
    return {
        name: 'testchimp-pat',
        canAuthenticate() {
            return Boolean(userAuthKey && userMail);
        },
        async callLLM(request, options) {
            if (!userAuthKey || !userMail) {
                throw new Error('TestChimp PAT-based provider cannot authenticate because TESTCHIMP_USER_AUTH_KEY or TESTCHIMP_USER_MAIL is missing.');
            }
            const headers = {
                user_auth_key: userAuthKey,
                user_mail: userMail,
            };
            return (0, testchimp_common_1.performTestchimpRequest)(headers, request, options.timeoutMs);
        },
    };
}
