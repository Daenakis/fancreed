import { create } from 'zustand';

import { queryClient } from '@/providers/queryClient';

import { clearToken, loadToken, saveToken } from '@/utils/secureToken';
import { storage } from '@/utils/storage';

import { STORAGE_KEYS } from '@/constants';

import { useSplashStore } from './useSplashStore';

interface AuthState {
  accessToken: string | null;
  signIn: (accessToken: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()((set) => ({
  accessToken: null,

  /** Persists the token to SecureStore, then marks the user signed in. */
  signIn: async (accessToken) => {
    await saveToken(accessToken);
    set({ accessToken });
  },

  /**
   * Clears the session. Memory is cleared first so Stack.Protected
   * navigates away immediately, then cached server data is dropped so the
   * next user never sees the previous user's data.
   */
  signOut: async () => {
    // The sign-in screen that appears next opens with its logo intro.
    useSplashStore.getState().replaySignInIntro();
    set({ accessToken: null });
    queryClient.clear();
    await clearToken();
  },
}));

/**
 * Loads the token from SecureStore and populates the auth store.
 * Call once during app startup (in useAppReady) before rendering.
 *
 * iOS keeps Keychain items after the app is uninstalled, while MMKV is wiped.
 * A missing HAS_LAUNCHED flag therefore means a fresh install — a leftover
 * token from a previous install is removed instead of auto-signing in.
 */
export async function loadAuthFromStorage(): Promise<void> {
  if (!storage.contains(STORAGE_KEYS.HAS_LAUNCHED)) {
    await clearToken();
    storage.set(STORAGE_KEYS.HAS_LAUNCHED, true);
  }

  useAuthStore.setState({ accessToken: await loadToken() });
}

export const signIn = (accessToken: string) =>
  useAuthStore.getState().signIn(accessToken);

export const signOut = () => useAuthStore.getState().signOut();
