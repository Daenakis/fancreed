import type { Ref } from 'react';
import type { PressableProps, StyleProp, View, ViewStyle } from 'react-native';

export type AuthButtonProps = Omit<PressableProps, 'children' | 'style'> & {
  /** Button label. */
  title: string;
  /** Shows a spinner and blocks presses. Defaults to `false`. */
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  ref?: Ref<View>;
};
