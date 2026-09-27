import type { Ref } from 'react';
import type { PressableProps, View } from 'react-native';

import type { IconName } from '@/ui/assets/icons';

export type TabBarButtonProps = Omit<PressableProps, 'children'> & {
  /** Icon of an inactive tab. */
  icon: IconName;
  /** Icon of the active tab. Defaults to `icon`. */
  activeIcon?: IconName;
  /** Screen-reader name of the tab. */
  label: string;
  /** Set by the router's TabTrigger. */
  isFocused?: boolean;
  /** Shows no tab as selected, e.g. on a detail screen above the tabs. */
  inactive?: boolean;
  ref?: Ref<View>;
};
