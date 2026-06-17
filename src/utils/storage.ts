import { createMMKV } from 'react-native-mmkv';
import { createJSONStorage } from 'zustand/middleware';

/**
 * General-purpose storage for non-sensitive data (theme, language, preferences).
 * Not encrypted — do NOT store tokens or credentials here.
 * Auth tokens are stored in SecureStore via @/utils/secureToken.
 */
export const storage = createMMKV();

export function getItem<T>(key: string): T | null {
  const value = storage.getString(key);
  if (value === undefined) return null;

  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

export function setItem<T>(key: string, value: T) {
  storage.set(key, JSON.stringify(value));
}

export function removeItem(key: string) {
  storage.remove(key);
}

/**
 * Zustand persist middleware adapter for MMKV (non-sensitive data).
 * MMKV is synchronous, so hydration happens instantly (no async flash).
 * @see https://zustand.docs.pmnd.rs/integrations/persisting-store-data
 */
export const zustandStorage = createJSONStorage(() => ({
  getItem: (key: string) => storage.getString(key) ?? null,
  setItem: (key: string, value: string) => storage.set(key, value),
  removeItem: (key: string) => storage.remove(key),
}));
