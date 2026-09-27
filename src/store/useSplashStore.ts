import { create } from 'zustand';

/** `back` — "Welcome back, {name}!"; `new` — "Welcome, {name}!" (new account). */
export type SplashGreeting = 'back' | 'new';
/** Where the logo starts: screen centre (app launch) or the auth screens' top-left logo (after sign-in). */
export type SplashFrom = 'center' | 'auth';

/**
 * The welcome splash over the app (WelcomeBack): shown on a launch with a
 * stored session and right after signing in. In memory only.
 */
interface SplashState {
  splash: { greeting: SplashGreeting; from: SplashFrom } | null;
  /** Set when an account was just activated — its first sign-in says "Welcome". */
  newAccount: boolean;
  /** The sign-in screen's logo intro is due: on app start and after signing out. */
  signInIntro: boolean;
  show: (greeting: SplashGreeting, from: SplashFrom) => void;
  hide: () => void;
  markNewAccount: () => void;
  /** Called by the sign-in screen as it starts the intro. */
  consumeSignInIntro: () => void;
  /** Called on sign-out, so the sign-in screen opens with its intro again. */
  replaySignInIntro: () => void;
}

export const useSplashStore = create<SplashState>()((set) => ({
  splash: null,
  newAccount: false,
  signInIntro: true,
  show: (greeting, from) =>
    set({ splash: { greeting, from }, newAccount: false }),
  hide: () => set({ splash: null }),
  markNewAccount: () => set({ newAccount: true }),
  consumeSignInIntro: () => set({ signInIntro: false }),
  replaySignInIntro: () => set({ signInIntro: true }),
}));
