import type { IconName } from '@/ui/assets/icons';

export type AppTab = {
  /** Route name inside (tabs). */
  name: 'gamification' | 'index' | 'calendar' | 'shop';
  href: '/gamification' | '/' | '/calendar' | '/shop';
  icon: IconName;
  activeIcon?: IconName;
  /** i18n key of the screen-reader label. */
  label: 'nav.gamification' | 'nav.home' | 'nav.calendar' | 'nav.shop';
};

/** Layout component — rendered by `src/app/(app)/(tabs)/_layout.tsx`. */
export type AppTabsProps = Record<string, never>;
