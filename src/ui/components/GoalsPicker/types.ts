import type { StyleProp, ViewStyle } from 'react-native';

import type { IconName } from '@/ui/assets/icons';
import type { ColorToken } from '@/ui/theme';

export type GoalsPickerProps = {
  /** Goals 0–9, or `null` while not picked yet (shows "?"). */
  value: number | null;
  onChange: (value: number) => void;
  /** Digit colour; `onBrand` on green cards. Defaults to `foreground`. */
  color?: ColorToken;
  /** Hides the arrows (prediction already placed). Defaults to `false`. */
  readOnly?: boolean;
  /** Screen-reader name, e.g. the team. */
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

export type ArrowButtonProps = {
  icon: IconName;
  label: string;
  onPress: () => void;
};
