import type { StyleProp, ViewStyle } from 'react-native';

import type { ColorToken } from '@/ui/theme';

export type PlayerItemProps = {
  /** Photo URL; a grey placeholder is shown when missing. */
  image?: string | null;
  name?: string | null;
  /** Vote share, shown under the name as "45%". */
  percent?: number;
  /** Makes the card pressable. */
  onPress?: () => void;
  /** Theme colour of the name and percent. Defaults to `foreground`. */
  textColor?: ColorToken;
  /** Card width defaults to 112 px — override here (e.g. carousel item width). */
  style?: StyleProp<ViewStyle>;
};
