import type { StyleProp, ViewStyle } from 'react-native';

export type FanCardBlockProps = {
  /** Opens the profile to fill it in; the button hides without it. */
  onOpenProfile?: () => void;
  style?: StyleProp<ViewStyle>;
};
