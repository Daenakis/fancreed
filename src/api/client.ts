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

/** Club site pages (HTML) read in place of backend data — no auth. */
export const siteClient = create({
  baseURL: CONFIG.LINKS.CLUB_SITE,
  responseType: 'text',
  timeout: 10_000,
});
