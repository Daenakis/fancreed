import type { StyleProp, ViewStyle } from 'react-native';

export type ResendCodeProps = {
  /** Sends the code again; the countdown restarts right away. */
  onResend: () => void;
  /** Seconds before the code can be re-sent. Defaults to 30. */
  cooldownSeconds?: number;
  style?: StyleProp<ViewStyle>;
};
