import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import type { AnimatedStyle } from 'react-native-reanimated';

import type { SocialProvider } from '../SocialSignIn';

export type AuthLayoutProps = {
  /** Screen title above the form. */
  title: string;
  /** Text under the title. */
  subtitle?: string;
  /** Centres the title and subtitle. Defaults to `false`. */
  centered?: boolean;
  /** The form. */
  children: ReactNode;
  /** Shows the social sign-in row when set. */
  onSocialPress?: (provider: SocialProvider) => void;
  /** Hides the static logo (the sign-in intro draws its own). Defaults to `false`. */
  hideLogo?: boolean;
  /** Extra style for the title/form block and the social row (e.g. an animated opacity). */
  contentStyle?: StyleProp<AnimatedStyle<ViewStyle>>;
  /** Pinned to the bottom (used when there is no social row). */
  footer?: ReactNode;
  /** Rendered on top of everything, e.g. the intro overlay. */
  overlay?: ReactNode;
};
