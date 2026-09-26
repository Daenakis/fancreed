import { create } from 'axios';

import * as T from '@/types/api';

import { CONFIG } from '@/config';

import { setupAuthInterceptors } from './authInterceptors';
import { fetcher } from './fetcher';

const defaults = {
  baseURL: CONFIG.API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
};

export const axiosInstance = create(defaults);

/**
 * Bare client used only for the refresh call. It has no interceptors,
 * so a 401 from the refresh endpoint can't trigger another refresh.
 */
const refreshClient = create(defaults);

setupAuthInterceptors(axiosInstance, (refreshToken) =>
  fetcher(
    refreshClient.post<T.RefreshResponse>('auth/refresh', {
      refreshToken,
    } satisfies T.RefreshRequest),
  ),
);

// ── API methods ─────────────────────────────────────────────────────
export const api = {
  login: (params: T.LoginRequest) =>
    axiosInstance.post<T.LoginResponse>('auth/login', params),
  // Password reset — endpoint paths are assumed until the backend confirms them.
  requestPasswordReset: (params: T.PasswordResetRequest) =>
    axiosInstance.post<void>('auth/password/forgot', params),
  verifyResetCode: (params: T.VerifyResetCodeRequest) =>
    axiosInstance.post<T.VerifyResetCodeResponse>(
      'auth/password/verify',
      params,
    ),
  resetPassword: (params: T.ResetPasswordRequest) =>
    axiosInstance.post<void>('auth/password/reset', params),
} as const;
