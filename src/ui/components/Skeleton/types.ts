import type { DimensionValue, StyleProp, ViewStyle } from 'react-native';

export type SkeletonProps = {
  /** Defaults to filling the parent's width. */
  width?: DimensionValue;
  height?: DimensionValue;
  /** Corner radius; `full` for circles and pills. Defaults to `sm`. */
  radius?: 'sm' | 'md' | 'lg' | 'full';
  /** No pulse, e.g. an image that failed to load. Defaults to `false`. */
  still?: boolean;
  style?: StyleProp<ViewStyle>;
};
