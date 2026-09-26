import { type AxiosInstance, isAxiosError } from 'axios';

import { useAuthStore } from '@/store';

/**
 * Attaches the access token to every request and ends the session when the
 * server rejects it. The backend has no refresh token, so a 401 on a request
 * sent with the current token means the session is over.
 */
export function setupAuthInterceptors(instance: AxiosInstance) {
  instance.interceptors.request.use((config) => {
    const { accessToken } = useAuthStore.getState();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  });

  instance.interceptors.response.use(undefined, async (error: unknown) => {
    if (isAxiosError(error) && error.response?.status === 401) {
      const { accessToken, signOut } = useAuthStore.getState();
      // Ignore 401s from requests sent with an older token (e.g. a request
      // that was in flight while the user signed in again).
      const sentWithCurrentToken =
        !!accessToken &&
        error.config?.headers?.Authorization === `Bearer ${accessToken}`;
      if (sentWithCurrentToken) await signOut();
    }
    throw error;
  });
}
