import axios from 'axios';

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

export const axiosInstance = axios.create(defaults);

/**
 * Bare client used only for the refresh call. It has no interceptors,
 * so a 401 from the refresh endpoint can't trigger another refresh.
 */
const refreshClient = axios.create(defaults);

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
} as const;
