import type * as T from '@/types/api';

/**
 * Temporary stand-in for auth endpoints the backend doesn't have yet.
 * Same inputs/outputs as `fetcher(api.*)`, with a short delay so loading
 * states are visible.
 *
 * Test values:
 * - verification code `111111` → "invalid code" error; any other 6 digits pass.
 *
 * TODO: delete once every hook calls the real API.
 */
const MOCK_DELAY_MS = 800;

const delay = () => new Promise((r) => setTimeout(r, MOCK_DELAY_MS));

export const MOCK_INVALID_CODE = '111111';

export class MockApiError extends Error {
  constructor(public readonly code: 'INVALID_CODE') {
    super(code);
  }
}

export const mockAuthApi = {
  requestPasswordReset: async (_params: T.PasswordResetRequest) => {
    await delay();
  },
  verifyResetCode: async (
    params: T.VerifyResetCodeRequest,
  ): Promise<T.VerifyResetCodeResponse> => {
    await delay();
    if (params.code === MOCK_INVALID_CODE) {
      throw new MockApiError('INVALID_CODE');
    }
    return { resetToken: 'mock-reset-token' };
  },
  resetPassword: async (_params: T.ResetPasswordRequest) => {
    await delay();
  },
};
