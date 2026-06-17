import axios from 'axios';

import * as T from '@/types/api';

import { CONFIG } from '@/config';

export const axiosInstance = axios.create({
  baseURL: CONFIG.API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Interceptors ────────────────────────────────────────────────────
// See src/docs/api.md for a full JWT refresh token implementation
// guide with request/response interceptors.

// ── API methods ─────────────────────────────────────────────────────
export const api = {
  login: (params: T.LoginRequest) =>
    axiosInstance.post<T.LoginResponse>('auth/login', params),
} as const;
