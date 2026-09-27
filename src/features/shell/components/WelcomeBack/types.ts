import type { SplashFrom, SplashGreeting } from '@/store';

export type WelcomeBackProps = {
  /** `back` — "Welcome back, {name}!"; `new` — "Welcome, {name}!". */
  greeting: SplashGreeting;
  /** Logo start: screen centre (launch) or the auth screens' logo (sign-in). */
  from: SplashFrom;
  /** Called once the overlay is gone — unmount it then. */
  onDone: () => void;
};
