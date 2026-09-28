import type { StyleProp, ViewStyle } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';

import type { ColorToken } from '@/ui/theme';

export type SliderIndicatorProps = {
  /** Number of slides (dots). */
  count: number;
  /** Index of the current slide (also read out to screen readers). */
  active: number;
  /**
   * Live scroll position in pages (e.g. 1.4 = 40% of the way from page 1 to
   * 2). When set, the dots morph with the finger instead of after the page
   * lands.
   */
  progress?: SharedValue<number>;
  /** Theme colour of the current dot. Defaults to `brand`. */
  activeColor?: ColorToken;
  /** Theme colour of the other dots. Defaults to `border`. */
  inactiveColor?: ColorToken;
  style?: StyleProp<ViewStyle>;
};

/** One dot; animates between the dash and the pill. */
export type DotProps = {
  index: number;
  active: boolean;
  progress?: SharedValue<number>;
  activeColor: string;
  inactiveColor: string;
  activeWidth: number;
  inactiveWidth: number;
};
