import type { StyleProp, ViewStyle } from 'react-native';

import type { ColorToken } from '@/ui/theme';

export type SliderIndicatorProps = {
  /** Number of slides (dots). */
  count: number;
  /** Index of the current slide. */
  active: number;
  /** Theme colour of the current dot. Defaults to `foreground`. */
  activeColor?: ColorToken;
  /** Theme colour of the other dots. Defaults to `background`. */
  inactiveColor?: ColorToken;
  style?: StyleProp<ViewStyle>;
};
