import type { StyleProp, ViewStyle } from 'react-native';

import type { IconName } from '@/ui/assets/icons';
import type { ColorToken, TypographyVariant } from '@/ui/theme';

export type SectionTitleProps = {
  title: string;
  /** Defaults to `foreground`; `onBrand` on green sections. */
  color?: ColorToken;
  /** Icon button on the right, e.g. "+" to create. */
  action?: { icon: IconName; label: string; onPress: () => void };
  /** Defaults to `h3Medium`; smaller inside cards. */
  variant?: TypographyVariant;
  /** Layout of the heading (padding, margins). */
  style?: StyleProp<ViewStyle>;
};
