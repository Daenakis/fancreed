import type { Ref } from 'react';
import type {
  ImageSourcePropType,
  PressableProps,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native';

export type ButtonProps = Omit<
  PressableProps,
  'children' | 'style' | 'onPress' | 'disabled'
> & {
  /** Image shown before the label (24×24). */
  source: ImageSourcePropType;
  /** Button label. */
  text: string;
  /** Blocks presses. Defaults to `false`. */
  disabled?: boolean;
  /** Called on press when `onChoose` isn't set. */
  onPress?: () => void;
  /** Selection handler — takes priority over `onPress`. */
  onChoose?: () => void;
  /** Selected state (primary background). Defaults to `false`. */
  choosen?: boolean;
  style?: StyleProp<ViewStyle>;
  ref?: Ref<View>;
};
