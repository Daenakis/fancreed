import { type AxiosInstance, isAxiosError } from 'axios';

import { useAuthStore } from '@/store';

import type { AuthTokens } from '@/types';

declare module 'axios' {
  interface InternalAxiosRequestConfig {
    /** Set once a request has been retried after a 401 — prevents loops. */
    _retry?: boolean;
  }
}

type RefreshTokens = (refreshToken: string) => Promise<AuthTokens>;

/**
 * Attaches the access token to every request and refreshes it on 401.
 *
 * - Single-flight: concurrent 401s share one refresh call. Backends that
 *   rotate refresh tokens would otherwise reject the second refresh and
 *   sign the user out.
 * - The user is signed out only when the backend rejects the refresh token
 *   (4xx). Network/5xx errors during refresh keep the session, so being
 *   offline never logs anyone out.
 *
 * `refreshTokens` must use a client WITHOUT these interceptors.
 */
export function setupAuthInterceptors(
  instance: AxiosInstance,
  refreshTokens: RefreshTokens,
) {
  let refreshPromise: Promise<string | null> | null = null;

  /** Resolves the new access token, or null if the session has ended. */
  async function runRefresh(): Promise<string | null> {
    const { refreshToken, setTokens, signOut } = useAuthStore.getState();
    if (!refreshToken) return null;

    try {
      const tokens = await refreshTokens(refreshToken);
      await setTokens(tokens.accessToken, tokens.refreshToken);
      return tokens.accessToken;
    } catch (error) {
      const status = isAxiosError(error) ? error.response?.status : undefined;
      if (status !== undefined && status < 500) {
        await signOut();
        return null;
      }
      throw error;
    }
  }

  function refreshAccessToken() {
    refreshPromise ??= runRefresh().finally(() => {
      refreshPromise = null;
    });
    return refreshPromise;
  }

  instance.interceptors.request.use((config) => {
    const { accessToken } = useAuthStore.getState();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  });

  instance.interceptors.response.use(undefined, async (error: unknown) => {
    if (
      !isAxiosError(error) ||
      error.response?.status !== 401 ||
      !error.config ||
      error.config._retry
    ) {
      throw error;
    }

    const config = error.config;
    const { accessToken } = useAuthStore.getState();

    // Not signed in (e.g. wrong password on login) — nothing to refresh.
    if (!accessToken) throw error;

    config._retry = true;

    // If another request already refreshed while this one was in flight,
    // just retry with the current token instead of refreshing again.
    const sentWithCurrentToken =
      config.headers.Authorization === `Bearer ${accessToken}`;

    if (sentWithCurrentToken) {
      const newToken = await refreshAccessToken();
      if (!newToken) throw error;
    }

    // The request interceptor attaches the latest token on retry.
    return instance(config);
  });
}
