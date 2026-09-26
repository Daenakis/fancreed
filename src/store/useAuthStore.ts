import { create } from 'zustand';

import { queryClient } from '@/providers/queryClient';

import { clearTokens, loadTokens, saveTokens } from '@/utils/secureToken';
import { storage } from '@/utils/storage';

import { STORAGE_KEYS } from '@/constants';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  signIn: (accessToken: string, refreshToken: string) => Promise<void>;
  signOut: () => Promise<void>;
  setTokens: (accessToken: string, refreshToken: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  accessToken: null,
  refreshToken: null,

  signIn: (accessToken, refreshToken) =>
    get().setTokens(accessToken, refreshToken),

  /**
   * Clears the session. Memory is cleared first so Stack.Protected
   * navigates away immediately, then cached server data is dropped so the
   * next user never sees the previous user's data.
   */
  signOut: async () => {
    set({ accessToken: null, refreshToken: null });
    queryClient.clear();
    await clearTokens();
  },

  /**
   * Persists tokens to SecureStore and updates memory.
   * Used after sign-in and after a token refresh.
   */
  setTokens: async (accessToken, refreshToken) => {
    await saveTokens(accessToken, refreshToken);
    set({ accessToken, refreshToken });
  },
}));

/**
 * Loads tokens from SecureStore and populates the auth store.
 * Call once during app startup (in useAppReady) before rendering.
 *
 * iOS keeps Keychain items after the app is uninstalled, while MMKV is wiped.
 * A missing HAS_LAUNCHED flag therefore means a fresh install — leftover
 * tokens from a previous install are removed instead of auto-signing in.
 */
export async function loadAuthFromStorage(): Promise<void> {
  if (!storage.contains(STORAGE_KEYS.HAS_LAUNCHED)) {
    await clearTokens();
    storage.set(STORAGE_KEYS.HAS_LAUNCHED, true);
  }

  const { accessToken, refreshToken } = await loadTokens();
  useAuthStore.setState({ accessToken, refreshToken });
}

export const signIn = (accessToken: string, refreshToken: string) =>
  useAuthStore.getState().signIn(accessToken, refreshToken);

export const signOut = () => useAuthStore.getState().signOut();
