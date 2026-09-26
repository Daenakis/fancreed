import type { Ref } from 'react';
import type { StyleProp, TextInput, ViewStyle } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';

export type CodeInputProps = {
  value: string;
  /** Called with digits only, capped at `length`. */
  onChangeText: (code: string) => void;
  /** Number of digit boxes. Defaults to 6. */
  length?: number;
  /** When this turns true the boxes flash red and the row shakes. */
  error?: boolean;
  /** Dims the boxes and drops the active highlight, e.g. while the code is checked. */
  busy?: boolean;
  autoFocus?: boolean;
  style?: StyleProp<ViewStyle>;
  ref?: Ref<TextInput>;
};

export type CodeBoxProps = {
  digit?: string;
  label: string;
  /** Box the next digit goes into, while the input is focused. */
  active: boolean;
  /** 0 → normal border, 1 → error red. */
  errorProgress: SharedValue<number>;
};
