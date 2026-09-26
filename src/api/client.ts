import { create } from 'axios';

import { CONFIG } from '@/config';

import { setupAuthInterceptors } from './authInterceptors';

/** Shared HTTP client: base URL from config, Bearer token, 401 → sign out. */
export const axiosInstance = create({
  baseURL: CONFIG.API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

setupAuthInterceptors(axiosInstance);
