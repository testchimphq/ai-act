import { LLMCallOptions, LLMProvider, LLMRequest } from './llm-provider';
import { performTestchimpRequest } from './testchimp-common';

export function createTestchimpPatBasedProvider(): LLMProvider {
  const userAuthKey = process.env.TESTCHIMP_USER_AUTH_KEY?.trim();
  const userMail = process.env.TESTCHIMP_USER_MAIL?.trim();

  return {
    name: 'testchimp-pat',

    canAuthenticate(): boolean {
      return Boolean(userAuthKey && userMail);
    },

    async callLLM(request: LLMRequest, options: LLMCallOptions): Promise<string> {
      if (!userAuthKey || !userMail) {
        throw new Error(
          'TestChimp PAT-based provider cannot authenticate because TESTCHIMP_USER_AUTH_KEY or TESTCHIMP_USER_MAIL is missing.',
        );
      }

      const headers = {
        user_auth_key: userAuthKey,
        user_mail: userMail,
      };

      return performTestchimpRequest(headers, request, options.timeoutMs);
    },
  };
}
