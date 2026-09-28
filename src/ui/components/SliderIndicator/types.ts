import type { StyleProp, ViewStyle } from 'react-native';

import type { ColorToken } from '@/ui/theme';

export type SliderIndicatorProps = {
  /** Number of slides (dots). */
  count: number;
  /** Index of the current slide. */
  active: number;
  /** Theme colour of the current dot. Defaults to `brand`. */
  activeColor?: ColorToken;
  /** Theme colour of the other dots. Defaults to `border`. */
  inactiveColor?: ColorToken;
  style?: StyleProp<ViewStyle>;
};

/** One dot; animates between the dash and the pill. */
export type DotProps = {
  active: boolean;
  activeColor: string;
  inactiveColor: string;
  activeWidth: number;
  inactiveWidth: number;
};
