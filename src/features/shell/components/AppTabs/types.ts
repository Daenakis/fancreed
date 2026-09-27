import type { IconName } from '@/ui/assets/icons';

export type AppTab = {
  /** Route name inside (tabs). */
  name: 'gamification' | '(home)' | 'calendar' | 'shop';
  href: '/gamification' | '/' | '/calendar' | '/shop';
  icon: IconName;
  activeIcon?: IconName;
  /** i18n key of the screen-reader label. */
  label: 'nav.gamification' | 'nav.home' | 'nav.calendar' | 'nav.shop';
};

/** Layout component — rendered by `src/app/(app)/(tabs)/_layout.tsx`. */
export type AppTabsProps = Record<string, never>;

export type TabIndicatorProps = {
  /** Tab under the line (the tab whose stack is on screen). */
  index: number;
  /** False on screens outside the tab roots — the line squashes away. */
  visible: boolean;
  tabWidth: number;
};
