import type { DimensionValue, StyleProp, ViewStyle } from 'react-native';

import type { ColorToken } from '@/ui/theme';

export type SkeletonProps = {
  /** Defaults to filling the parent's width. */
  width?: DimensionValue;
  height?: DimensionValue;
  /** Corner radius; `full` for circles and pills. Defaults to `sm`. */
  radius?: 'sm' | 'md' | 'lg' | 'full';
  /** Theme colour of the block, e.g. `brandBorder` on a brand background. Defaults to `muted`. */
  color?: ColorToken;
  /** No pulse, e.g. an image that failed to load. Defaults to `false`. */
  still?: boolean;
  style?: StyleProp<ViewStyle>;
};
