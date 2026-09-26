import type { StyleProp, ViewStyle } from 'react-native';

export type AuthFooterLinkProps = {
  /** Plain lead-in, e.g. "Not registered yet?". */
  text: string;
  /** Link label, e.g. "Create account". */
  linkText: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
};
