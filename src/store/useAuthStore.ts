import { create } from 'zustand';

import { clearTokens, loadTokens, saveTokens } from '@/utils/secureToken';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  signIn: (accessToken: string, refreshToken: string) => Promise<void>;
  signOut: () => Promise<void>;
  setTokens: (accessToken: string, refreshToken: string) => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  accessToken: null,
  refreshToken: null,

  signIn: async (accessToken, refreshToken) => {
    await saveTokens(accessToken, refreshToken);
    set({ accessToken, refreshToken });
  },

  signOut: async () => {
    await clearTokens();
    set({ accessToken: null, refreshToken: null });
  },

  /**
   * Updates tokens in memory only (e.g. after refresh).
   * Call saveTokens() separately if you need persistence.
   */
  setTokens: (accessToken, refreshToken) => set({ accessToken, refreshToken }),
}));

/**
 * Loads tokens from SecureStore and populates the auth store.
 * Call once during app startup (in useAppReady) before rendering.
 */
export async function loadAuthFromStorage(): Promise<void> {
  const { accessToken, refreshToken } = await loadTokens();
  useAuthStore.setState({ accessToken, refreshToken });
}

export const signIn = (accessToken: string, refreshToken: string) =>
  useAuthStore.getState().signIn(accessToken, refreshToken);

export const signOut = () => useAuthStore.getState().signOut();
