import type { ReactNode, Ref } from 'react';
import type {
  ImageSourcePropType,
  StyleProp,
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  TextStyle,
  ViewStyle,
} from 'react-native';

export type TextInputVariant = 'default' | 'inverse';

export type TextInputProps = Omit<RNTextInputProps, 'style' | 'editable'> & {
  /** Label above the field; also the default accessibility label. */
  label?: string;
  /** Error message under the field; also turns the border red. */
  error?: string;
  /** Image shown at the start of the field (24×24). */
  leftIcon?: ImageSourcePropType;
  /** Element at the end of the field, e.g. a "Forgot password?" link. */
  rightAccessory?: ReactNode;
  /** Makes the field read-only and dimmed. Defaults to `false`. */
  disabled?: boolean;
  /** `inverse` = light text/border for dark backgrounds. Defaults to `default`. */
  variant?: TextInputVariant;
  /** Style of the outer wrapper (label + field + error). */
  containerStyle?: StyleProp<ViewStyle>;
  /** Style of the native input, merged last. */
  style?: StyleProp<TextStyle>;
  ref?: Ref<RNTextInput>;
};
