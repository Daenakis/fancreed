import type { StyleProp, ViewStyle } from 'react-native';

export type SocialProvider = 'google' | 'apple' | 'facebook';

export type SocialSignInProps = {
  /** Called with the provider whose button was pressed. */
  onPress: (provider: SocialProvider) => void;
  /** Providers to show, in order. Defaults to Google, Apple, Facebook. */
  providers?: SocialProvider[];
  style?: StyleProp<ViewStyle>;
};
