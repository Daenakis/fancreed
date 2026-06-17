import * as SecureStore from 'expo-secure-store';

import { STORAGE_KEYS } from '@/constants';

export type Tokens = {
  accessToken: string | null;
  refreshToken: string | null;
};

/**
 * Loads access and refresh tokens from iOS Keychain / Android Keystore.
 */
export async function loadTokens(): Promise<Tokens> {
  const [accessToken, refreshToken] = await Promise.all([
    SecureStore.getItemAsync(STORAGE_KEYS.ACCESS_TOKEN),
    SecureStore.getItemAsync(STORAGE_KEYS.REFRESH_TOKEN),
  ]);

  return {
    accessToken,
    refreshToken,
  };
}

/**
 * Persists tokens to SecureStore. Call on sign-in and token refresh.
 */
export async function saveTokens(
  accessToken: string,
  refreshToken: string,
): Promise<void> {
  await Promise.all([
    SecureStore.setItemAsync(STORAGE_KEYS.ACCESS_TOKEN, accessToken),
    SecureStore.setItemAsync(STORAGE_KEYS.REFRESH_TOKEN, refreshToken),
  ]);
}

/**
 * Removes tokens from SecureStore. Call on sign-out.
 */
export async function clearTokens(): Promise<void> {
  await Promise.all([
    SecureStore.deleteItemAsync(STORAGE_KEYS.ACCESS_TOKEN),
    SecureStore.deleteItemAsync(STORAGE_KEYS.REFRESH_TOKEN),
  ]);
}
