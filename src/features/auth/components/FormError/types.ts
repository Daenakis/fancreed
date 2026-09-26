import type { StyleProp, TextStyle } from 'react-native';

export type FormErrorProps = {
  /** Translated message; renders nothing when empty. */
  message?: string;
  style?: StyleProp<TextStyle>;
};
