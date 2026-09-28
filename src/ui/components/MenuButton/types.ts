import type { StyleProp, ViewStyle } from 'react-native';
import type { AnimatedStyle } from 'react-native-reanimated';

export type MenuButtonProps = {
  /** `false` — three lines (burger); `true` — a cross. Animates between them. */
  open: boolean;
  onPress?: () => void;
  /** Shown inactive, e.g. the header without a menu. Defaults to `false`. */
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

/** One of the three lines. */
export type BarProps = {
  style: StyleProp<AnimatedStyle<ViewStyle>>;
};
