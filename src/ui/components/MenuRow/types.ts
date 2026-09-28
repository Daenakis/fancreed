import type { StyleProp, ViewStyle } from 'react-native';

import type { IconName } from '@/ui/assets/icons';

/** `destructive`: red, for sign-out and deletes. */
export type MenuRowTone = 'default' | 'destructive';

export type MenuRowProps = {
  label: string;
  icon: IconName;
  /** Current value on the right, e.g. a size "M". */
  value?: string;
  /** Defaults to `default`. */
  tone?: MenuRowTone;
  /** Arrow on the right for rows that open a screen or page. */
  chevron?: boolean;
  /**
   * Shows a switch in this state; the row then acts as a switch — a tap
   * anywhere on it calls `onPress` (flip the value there).
   */
  toggled?: boolean;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
};
