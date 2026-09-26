import * as SecureStore from 'expo-secure-store';

import { STORAGE_KEYS } from '@/constants';

/**
 * Access token persistence in iOS Keychain / Android Keystore.
 * The backend issues a single long-lived token (no refresh token).
 */
export function loadToken(): Promise<string | null> {
  return SecureStore.getItemAsync(STORAGE_KEYS.ACCESS_TOKEN);
}

export function saveToken(accessToken: string): Promise<void> {
  return SecureStore.setItemAsync(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
}

export function clearToken(): Promise<void> {
  return SecureStore.deleteItemAsync(STORAGE_KEYS.ACCESS_TOKEN);
}
