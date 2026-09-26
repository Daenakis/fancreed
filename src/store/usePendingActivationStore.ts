import { create } from 'zustand';

/**
 * Credentials kept in memory only (never persisted) between sign-up or an
 * unactivated sign-in and the activation screen, so the user is signed in
 * automatically once the email is confirmed.
 */
interface PendingActivationState {
  email: string | null;
  password: string | null;
  setPending: (email: string, password: string) => void;
  clear: () => void;
}

export const usePendingActivationStore = create<PendingActivationState>()(
  (set) => ({
    email: null,
    password: null,
    setPending: (email, password) => set({ email, password }),
    clear: () => set({ email: null, password: null }),
  }),
);
