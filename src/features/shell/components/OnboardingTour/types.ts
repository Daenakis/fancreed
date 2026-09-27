import type { IconName } from '@/ui/assets/icons';

/** What a step points at: the header's menu or avatar, or a bottom tab. */
export type OnboardingTarget =
  | { kind: 'menu' }
  | { kind: 'profile' }
  | { kind: 'tab'; index: number; icon: IconName };

export type OnboardingStep = {
  target: OnboardingTarget;
  /** i18n group under `onboarding` with `title` and `text`. */
  key: 'menu' | 'profile' | 'gamification' | 'home' | 'calendar' | 'shop';
};

export type OnboardingTourProps = {
  /** Called once the last step is done (the tour hides itself). */
  onDone?: () => void;
};

/** The target in a white circle, drawn over the dimmed app. */
export type SpotlightProps = {
  target: OnboardingTarget;
  x: number;
  y: number;
};
